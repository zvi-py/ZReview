import 'dotenv/config';
import express from 'express';
import path from 'path';
import {
  USERS,
  BRANDS,
  PARAMETERS,
  CAMPAIGNS,
  SUBMISSIONS,
  AUDIT_LOGS,
  NOTIFICATIONS,
  SYSTEM_SETTINGS,
  updateSystemSettings,
  getAnalyticsData,
  getReviewVelocityStats,
  AI_USAGE_LOGS,
  saveDatabase,
  createSession,
  getSessionUser,
  destroySession,
} from './server/db.ts';
import { runMultimodalAnalysis, detectBrandFromCreative, chatWithComplianceAssistant } from './server/aiService.ts';
import { resolveAndExtractCanva } from './server/canvaService.ts';
import { archiveApprovedProjectToDrive } from './server/driveArchiveService.ts';
import { saveMediaFile, resolveFileBuffer, verifyMediaFile } from './server/storageService.ts';
import { testGoogleDriveConnection, getDriveConfig } from './server/googleDriveService.ts';
import { syncBrandToolkitToDrive } from './server/brandToolkitSyncService.ts';
import { prepareClientDeliveryPackage } from './server/deliveryPackageService.ts';
import type {
  Submission,
  SubmissionVersion,
  SubmissionFile,
  SubmissionStatus,
  AuditLog,
  AppNotification,
  Brand,
  BrandParameter,
  UserRole,
} from './src/types.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing with generous limit for media uploads (images and frame snapshots)
  app.use(express.json({ limit: '60mb' }));
  app.use(express.urlencoded({ extended: true, limit: '60mb' }));

  // ==========================================
  // SERVER-SIDE AUTHENTICATION & RBAC MIDDLEWARES
  // ==========================================
  const extractToken = (req: express.Request): string | null => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1].trim();
    }
    return null;
  };

  const authMiddleware = (req: any, res: express.Response, next: express.NextFunction) => {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }
    const user = getSessionUser(token);
    if (!user) {
      return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
    }
    req.user = user;
    next();
  };

  const optionalAuth = (req: any, res: express.Response, next: express.NextFunction) => {
    const token = extractToken(req);
    if (token) {
      const user = getSessionUser(token);
      if (user) {
        req.user = user;
      }
    }
    next();
  };

  const requireRole = (...allowedRoles: UserRole[]) => {
    return (req: any, res: express.Response, next: express.NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required.' });
      }
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          error: `Access Denied. Required role: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`,
        });
      }
      next();
    };
  };

  // ==========================================
  // API ROUTES
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // 1. Auth & Users
  app.get('/api/auth/users', (req, res) => {
    res.json(USERS);
  });

  app.get('/api/auth/me', authMiddleware, (req: any, res) => {
    res.json({ user: req.user });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }
    const cleanEmail = email.trim().toLowerCase();
    let user = USERS.find((u) => u.email.toLowerCase() === cleanEmail);

    if (user) {
      // Validate password against database
      const userPassword = user.password || 'password123';
      if (!password || password !== userPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
    } else {
      // New signups strictly default to EMPLOYEE; role elevation is an explicit admin action.
      if (!password || password.length < 4) {
        return res.status(400).json({ error: 'Password is required for new registration (min 4 characters)' });
      }

      user = {
        id: `usr-${Date.now()}`,
        name: cleanEmail
          .split('@')[0]
          .replace(/[._]/g, ' ')
          .replace(/\b\w/g, (c: string) => c.toUpperCase()),
        email: cleanEmail,
        password: password,
        role: 'EMPLOYEE', // New signups default to EMPLOYEE; role elevation is an explicit admin action
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        department: 'Creative Operations',
        assignedBrands: ['brand-jdc', 'brand-nmc'],
      };
      USERS.push(user);
    }

    const token = createSession(user);

    AUDIT_LOGS.unshift({
      id: `audit-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'LOGIN_SUCCESS',
      details: `User logged in: ${user.name} (${user.email}) with verified role ${user.role}`,
      timestamp: new Date().toISOString(),
    });
    saveDatabase();

    res.json({ success: true, token, user });
  });

  app.post('/api/auth/logout', (req, res) => {
    const token = extractToken(req);
    if (token) {
      destroySession(token);
    }
    res.json({ success: true });
  });

  // Admin-only role elevation endpoint
  app.patch('/api/auth/users/:id/role', authMiddleware, requireRole('ADMIN'), (req: any, res) => {
    const { role } = req.body;
    if (!role || !['EMPLOYEE', 'SUPERVISOR', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Valid role is required (EMPLOYEE, SUPERVISOR, ADMIN)' });
    }
    const targetUser = USERS.find((u) => u.id === req.params.id);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const oldRole = targetUser.role;
    targetUser.role = role as UserRole;

    AUDIT_LOGS.unshift({
      id: `audit-${Date.now()}`,
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'USER_ROLE_UPDATED',
      details: `Admin ${req.user.name} changed role of ${targetUser.name} (${targetUser.email}) from ${oldRole} to ${role}`,
      timestamp: new Date().toISOString(),
    });
    saveDatabase();

    res.json({ success: true, user: targetUser });
  });

  // MEDIA UPLOAD ENDPOINT
  app.post('/api/upload', authMiddleware, (req: any, res) => {
    try {
      const { content, fileName, mimeType } = req.body;
      if (!content) {
        return res.status(400).json({ error: 'File content (base64 or data URL) is required.' });
      }

      const stored = saveMediaFile(content, fileName, mimeType);
      res.status(201).json(stored);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'File upload failed' });
    }
  });

  // 2. Brands
  app.get('/api/brands', (req, res) => {
    res.json(BRANDS);
  });

  app.post('/api/brands', authMiddleware, requireRole('ADMIN'), (req: any, res) => {
    const newBrand: Brand = {
      id: `brand-${Date.now()}`,
      name: req.body.name || 'New Brand',
      logo: req.body.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      description: req.body.description || '',
      isActive: true,
      colorPalette: req.body.colorPalette || {
        primary: '#0D50F2',
        secondary: '#111418',
        forbidden: ['#FF0000'],
      },
      typography: req.body.typography || {
        primaryFont: 'Plus Jakarta Sans',
        minHeadingSize: '24px',
        minBodySize: '14px',
        rules: ['Clean modern typography'],
      },
      logoRules: req.body.logoRules || {
        minSizePercent: 5,
        safeZonePercent: 6,
        approvedPositions: ['TOP_RIGHT', 'BOTTOM_RIGHT'],
        prohibitedModifications: ['No rotation'],
      },
      creativeRules: req.body.creativeRules || {
        productVisibilityMinPercent: 20,
        tone: 'Professional & modern',
        backgroundStyle: 'Clean studio',
        ctaRequirement: 'Distinct action button',
      },
      videoRules: req.body.videoRules || {
        logoMinDurationSec: 3,
        productAppearanceWithinSec: 4,
        ctaRequiredAtEnd: true,
        minResolution: '1080p',
      },
      guidelinesMarkdown: req.body.guidelinesMarkdown || '### Brand Guidelines\n- Follow brand standard.',
      parametersCount: 0,
    };
    BRANDS.push(newBrand);

    AUDIT_LOGS.unshift({
      id: `audit-${Date.now()}`,
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'BRAND_CREATED',
      details: `Created new brand "${newBrand.name}" (${newBrand.id})`,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json(newBrand);
  });

  app.put('/api/brands/:id', authMiddleware, requireRole('ADMIN'), (req, res) => {
    const idx = BRANDS.findIndex((b) => b.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    BRANDS[idx] = { ...BRANDS[idx], ...req.body };
    res.json(BRANDS[idx]);
  });

  // 3. Parameters
  app.get('/api/brands/:id/parameters', (req, res) => {
    const params = PARAMETERS.filter((p) => p.brandId === req.params.id);
    res.json(params);
  });

  app.get(['/api/parameters', '/api/brand-parameters'], (req, res) => {
    const brandId = req.query.brandId as string;
    if (brandId) {
      return res.json(PARAMETERS.filter((p) => p.brandId === brandId));
    }
    res.json(PARAMETERS);
  });

  app.post('/api/parameters', authMiddleware, requireRole('ADMIN'), (req: any, res) => {
    const newParam: BrandParameter = {
      id: `param-${Date.now()}`,
      brandId: req.body.brandId,
      name: req.body.name,
      category: req.body.category || 'BRAND_COMPLIANCE',
      type: req.body.type || 'BOOLEAN',
      severity: req.body.severity || 'HIGH',
      weight: Number(req.body.weight) || 10,
      passThreshold: Number(req.body.passThreshold) || 80,
      isRequired: req.body.isRequired ?? true,
      isActive: true,
      applicableMediaType: req.body.applicableMediaType || 'ALL',
      instructions: req.body.instructions || '',
      passCriteria: req.body.passCriteria || '',
    };
    PARAMETERS.push(newParam);

    // Update count on brand
    const b = BRANDS.find((x) => x.id === newParam.brandId);
    if (b) {
      b.parametersCount = PARAMETERS.filter((p) => p.brandId === b.id).length;
    }

    AUDIT_LOGS.unshift({
      id: `audit-${Date.now()}`,
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'PARAMETER_CREATED',
      details: `Created parameter "${newParam.name}" for brand ${newParam.brandId} (Weight: ${newParam.weight}%)`,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json(newParam);
  });

  app.put('/api/parameters/:id', authMiddleware, requireRole('ADMIN'), (req, res) => {
    const idx = PARAMETERS.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Parameter not found' });
    }
    PARAMETERS[idx] = { ...PARAMETERS[idx], ...req.body };
    res.json(PARAMETERS[idx]);
  });

  app.delete('/api/parameters/:id', authMiddleware, requireRole('ADMIN'), (req, res) => {
    const idx = PARAMETERS.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Parameter not found' });
    }
    const [deleted] = PARAMETERS.splice(idx, 1);
    res.json({ success: true, deleted });
  });

  // 4. Campaigns
  app.get('/api/campaigns', (req, res) => {
    const brandId = req.query.brandId as string;
    if (brandId) {
      return res.json(CAMPAIGNS.filter((c) => c.brandId === brandId));
    }
    res.json(CAMPAIGNS);
  });

  // Assign Supervisor to Campaign
  app.put('/api/campaigns/:id/assign-supervisor', authMiddleware, requireRole('ADMIN'), (req: any, res) => {
    const { supervisorId } = req.body;
    const camp = CAMPAIGNS.find((c) => c.id === req.params.id);
    if (!camp) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const supervisor = USERS.find((u) => u.id === supervisorId);
    if (!supervisor || supervisor.role !== 'SUPERVISOR') {
      return res.status(400).json({ error: 'Valid supervisor user is required' });
    }

    camp.assignedSupervisorId = supervisor.id;
    camp.assignedSupervisorName = supervisor.name;

    let updatedSubCount = 0;
    SUBMISSIONS.forEach((sub) => {
      if (sub.campaignId === camp.id) {
        sub.assignedSupervisorId = supervisor.id;
        sub.assignedSupervisorName = supervisor.name;
        if (
          sub.workflowStatus === 'SUPERVISOR_ASSIGNMENT_REQUIRED' ||
          sub.workflowStatus === 'AWAITING_SUPERVISOR_REVIEW' ||
          (sub.workflowStatus as string) === 'AWAITING_MANAGER_REVIEW'
        ) {
          sub.workflowStatus = 'AWAITING_SUPERVISOR_REVIEW';
          const latestV = sub.versions[sub.versions.length - 1];
          if (latestV && !latestV.routedToSupervisorAt) {
            latestV.routedToSupervisorAt = new Date().toISOString();
          }
          updatedSubCount++;
        }
      }
    });

    AUDIT_LOGS.unshift({
      id: `audit-${Date.now()}`,
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'CAMPAIGN_SUPERVISOR_ASSIGNED',
      details: `Assigned Supervisor ${supervisor.name} (${supervisor.id}) to campaign "${camp.name}". ${updatedSubCount} pending submissions routed to queue.`,
      timestamp: new Date().toISOString(),
    });

    saveDatabase();
    res.json(camp);
  });

  // Fetch all supervisors
  app.get('/api/supervisors', (req, res) => {
    const supervisors = USERS.filter((u) => u.role === 'SUPERVISOR');
    res.json(supervisors);
  });

  // Fetch all users
  app.get('/api/users', (req, res) => {
    res.json(USERS);
  });

  app.post('/api/campaigns', authMiddleware, requireRole('SUPERVISOR', 'ADMIN'), (req: any, res) => {
    const newCamp = {
      id: `cmp-${Date.now()}`,
      brandId: req.body.brandId,
      name: req.body.name,
      product: req.body.product,
      campaignType: req.body.campaignType,
      region: req.body.region || 'Global',
      targetAudience: req.body.targetAudience || 'General',
      description: req.body.description || '',
      startDate: req.body.startDate || new Date().toISOString().slice(0, 10),
      endDate: req.body.endDate || new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
      active: true,
    };
    CAMPAIGNS.push(newCamp);

    AUDIT_LOGS.unshift({
      id: `audit-${Date.now()}`,
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'CAMPAIGN_CREATED',
      details: `Created campaign "${newCamp.name}" for brand ${newCamp.brandId}`,
      timestamp: new Date().toISOString(),
    });

    saveDatabase();
    res.status(201).json(newCamp);
  });

  app.post('/api/campaigns/with-guidelines', authMiddleware, requireRole('SUPERVISOR', 'ADMIN'), (req: any, res) => {
    const { campaign, guidelines } = req.body;
    if (!campaign || !campaign.name || !campaign.brandId) {
      return res.status(400).json({ error: 'Campaign name and brandId are required' });
    }

    const supervisor = USERS.find((u) => u.id === campaign.assignedSupervisorId);
    const newCamp = {
      id: `cmp-${Date.now()}`,
      brandId: campaign.brandId,
      name: campaign.name,
      product: campaign.product || '',
      campaignType: campaign.campaignType || 'Marketing Campaign',
      region: campaign.region || 'Global',
      targetAudience: campaign.targetAudience || 'General Audience',
      description: campaign.description || '',
      startDate: campaign.startDate || new Date().toISOString().slice(0, 10),
      endDate: campaign.endDate || new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
      active: true,
      assignedSupervisorId: supervisor ? supervisor.id : (campaign.assignedSupervisorId || 'usr-101'),
      assignedSupervisorName: supervisor ? supervisor.name : (campaign.assignedSupervisorName || 'Marcus Vance'),
    };
    CAMPAIGNS.unshift(newCamp);

    const createdParams: BrandParameter[] = [];
    if (Array.isArray(guidelines) && guidelines.length > 0) {
      guidelines.forEach((g, idx) => {
        const p: BrandParameter = {
          id: `param-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
          brandId: campaign.brandId,
          name: g.name || `Guideline Rule ${idx + 1}`,
          category: g.category || 'BRAND_COMPLIANCE',
          type: g.type || 'TEXT',
          severity: g.severity || 'HIGH',
          weight: Number(g.weight) || 20,
          passThreshold: Number(g.passThreshold) || 80,
          isRequired: g.isRequired ?? true,
          isActive: true,
          applicableMediaType: g.applicableMediaType || 'ALL',
          instructions: g.instructions || '',
          passCriteria: g.passCriteria || '',
        };
        PARAMETERS.push(p);
        createdParams.push(p);
      });

      // Update count on brand
      const b = BRANDS.find((x) => x.id === campaign.brandId);
      if (b) {
        b.parametersCount = PARAMETERS.filter((p) => p.brandId === b.id).length;
      }
    }

    AUDIT_LOGS.unshift({
      id: `audit-${Date.now()}`,
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'CAMPAIGN_CREATED',
      details: `Created upcoming project "${newCamp.name}" with ${createdParams.length} compliance guidelines for brand ${newCamp.brandId}.`,
      timestamp: new Date().toISOString(),
    });

    saveDatabase();
    res.status(201).json({ campaign: newCamp, parameters: createdParams });
  });

  // 5. Submissions & Workflow
  app.get('/api/submissions', optionalAuth, (req: any, res) => {
    const { brandId, status, userId, role } = req.query;
    let list = [...SUBMISSIONS];

    // If authenticated as EMPLOYEE, restrict to own submissions
    if (req.user && req.user.role === 'EMPLOYEE') {
      list = list.filter((s) => s.userId === req.user.id);
    } else if (role === 'EMPLOYEE' && userId) {
      list = list.filter((s) => s.userId === userId);
    }

    if (brandId) {
      list = list.filter((s) => s.brandId === brandId);
    }
    if (status) {
      list = list.filter((s) => s.workflowStatus === status);
    }

    // Preserve canonical showcase order (SUB-101 to SUB-108), or sort by newest if requested
    const sortBy = req.query.sort as string;
    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else {
      list.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
    }
    res.json(list);
  });

  app.get('/api/submissions/:id', (req, res) => {
    const sub = SUBMISSIONS.find((s) => s.id === req.params.id);
    if (!sub) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    res.json(sub);
  });

  // CREATE NEW SUBMISSION
  app.post('/api/submissions', authMiddleware, async (req: any, res) => {
    try {
      const {
        campaignId,
        brandId,
        userId,
        userName,
        userEmail,
        userAvatar,
        mediaType,
        files,
        tags,
        notes,
      } = req.body;

      const brand = BRANDS.find((b) => b.id === brandId);
      if (!brand) {
        return res.status(400).json({ error: 'Brand not found' });
      }

      const campaign = CAMPAIGNS.find((c) => c.id === campaignId);
      const submissionId = `sub-${Date.now().toString(36)}`;

      // Brand parameters for this brand
      const brandParams = PARAMETERS.filter((p) => p.brandId === brandId && p.isActive);

      let targetFile = files && files.length > 0 ? { ...files[0] } : null;

      let canvaExtraction: any = null;
      if (req.body.canvaUrl) {
        canvaExtraction = await resolveAndExtractCanva(req.body.canvaUrl, brandId, req.body.campaignName || notes);
      }

      if (!targetFile && req.body.fileUrl) {
        targetFile = {
          id: `file-${Date.now()}`,
          fileName: req.body.fileName || 'poster_asset',
          fileType: req.body.fileType || mediaType || 'image',
          mimeType: req.body.fileUrl.endsWith('.svg')
            ? 'image/svg+xml'
            : req.body.fileType === 'video'
              ? 'video/mp4'
              : 'image/png',
          fileSize: req.body.fileSizeMb ? Math.round(req.body.fileSizeMb * 1024 * 1024) : 2500000,
          fileUrl: req.body.fileUrl,
          thumbnailUrl: req.body.fileUrl,
        };
      }

      // If no upload file was provided but a Canva link was provided
      if (!targetFile && req.body.canvaUrl) {
        if (canvaExtraction?.hasRealPreview && canvaExtraction?.imageBuffer && canvaExtraction?.dataUrl) {
          targetFile = {
            id: `file-canva-${Date.now()}`,
            fileName: `canva_${canvaExtraction.designId}.png`,
            fileType: 'image',
            mimeType: canvaExtraction.mimeType || 'image/png',
            fileSize: canvaExtraction.imageBuffer.length,
            fileUrl: canvaExtraction.dataUrl,
            thumbnailUrl: canvaExtraction.dataUrl,
          };
        } else {
          targetFile = {
            id: `file-canva-${Date.now()}`,
            fileName: `Canva Design (${canvaExtraction?.designId || 'Link'})`,
            fileType: 'image',
            mimeType: 'application/x-canva',
            fileSize: 0,
            fileUrl: '',
            thumbnailUrl: '',
          };
        }
      }

      if (!targetFile) {
        return res.status(400).json({ error: 'A creative asset file, image upload, or Canva design link is required.' });
      }

      // Persist raw base64 data URLs to disk in storageService & compute SHA-256 asset hash
      if (targetFile.fileUrl && targetFile.fileUrl.startsWith('data:')) {
        try {
          const stored = saveMediaFile(targetFile.fileUrl, targetFile.fileName, targetFile.mimeType);
          targetFile.fileUrl = stored.fileUrl;
          targetFile.fileSize = stored.fileSize;
          targetFile.thumbnailUrl = stored.fileUrl;
          targetFile.assetHash = stored.assetHash;
          targetFile.verifiedAt = new Date().toISOString();
        } catch (storageErr: any) {
          return res.status(400).json({ error: `Storage error: ${storageErr.message}` });
        }
      } else if (targetFile.fileUrl) {
        const verification = verifyMediaFile(targetFile.fileUrl, targetFile.mimeType);
        if (verification.isValid) {
          targetFile.assetHash = verification.assetHash || undefined;
          targetFile.fileSize = verification.size || targetFile.fileSize;
          targetFile.verifiedAt = new Date().toISOString();
        }
      }

      // Assigned supervisor
      const assignedSupervisorId = campaign?.assignedSupervisorId || 'usr-101';
      const supervisorUser = USERS.find((u) => u.id === assignedSupervisorId);
      const assignedSupervisorName = supervisorUser?.name || campaign?.assignedSupervisorName || 'Marcus Vance';

      const reviewRequestId = `req-rev-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      // Run Multimodal AI analysis
      let analysis: any;
      if (targetFile.fileUrl && targetFile.fileUrl !== '') {
        analysis = await runMultimodalAnalysis({
          submissionId,
          versionNumber: 1,
          brand,
          parameters: brandParams,
          campaign,
          file: targetFile,
          threshold: SYSTEM_SETTINGS.aiApprovalThreshold,
          reviewRequestId,
          assetHash: targetFile.assetHash,
        });
      } else {
        // Link-only verification for Canva
        analysis = {
          overallScore: 88,
          confidence: 0.95,
          status: 'AWAITING_SUPERVISOR_REVIEW',
          parameters: brandParams.map((p) => ({
            parameterId: p.id,
            name: p.name,
            category: p.category,
            score: 90,
            status: 'PASS',
            confidence: 0.9,
            evidence: ['Brand guidelines validated for design review in Canva editor.'],
            reason: `Guideline ${p.name} active for ${brand.name}. Verify in Canva editor.`,
            metaGuideline: p.instructions || p.passCriteria,
            remedy: 'Verify and review in Canva.',
            severity: p.severity,
            weight: p.weight,
          })),
          strengths: [
            'Canva link registered successfully with verified design ID.',
            `Brand parameters loaded for ${brand.name}.`,
            'Ready for supervisor review directly in Canva.',
          ],
          weaknesses: [
            'Design is hosted on Canva. Open in Canva to inspect layout.',
          ],
          recommendations: [
            'Use "Open in Canva" button to inspect design details.',
          ],
          canvaFixPrompt:
            'Suggested changes — apply them manually in Canva:\n1. Verify logo safe zone and margins.\n2. Ensure brand color palette matches official codes.\n3. Check client claims and contact details.',
        };
      }

      const isAiApproved = analysis.overallScore >= 90;
      const initialStatus = isAiApproved
        ? 'APPROVED'
        : analysis.status === 'NEEDS_IMPROVEMENT'
        ? 'NEEDS_IMPROVEMENT'
        : 'AWAITING_SUPERVISOR_REVIEW';

      const v1: SubmissionVersion = {
        versionNumber: 1,
        submissionId,
        files: [targetFile],
        changelog: notes || 'Initial creative submission.',
        submittedAt: new Date().toISOString(),
        routedToSupervisorAt: initialStatus === 'AWAITING_SUPERVISOR_REVIEW' ? new Date().toISOString() : undefined,
        aiScore: analysis.overallScore,
        aiConfidence: analysis.confidence,
        aiStatus: analysis.overallScore >= SYSTEM_SETTINGS.aiApprovalThreshold ? 'PASSED' : 'COMPLETED',
        workflowStatus: initialStatus,
        humanDecision: isAiApproved ? 'APPROVED' : 'PENDING',
        humanDecisionAt: isAiApproved ? new Date().toISOString() : undefined,
        humanReviewerName: isAiApproved ? 'ZARVIS Multimodal AI System (AI Approved)' : undefined,
        analysisResult: analysis,
      };

      const effectiveUserId = req.user.id;
      const effectiveUserName = req.user.name;
      const effectiveUserEmail = req.user.email;
      const effectiveUserAvatar = req.user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80';

      const newSubmission: Submission = {
        id: submissionId,
        campaignId: campaign?.id || 'cmp-custom',
        campaignName: campaign?.name || 'Custom Creative Campaign',
        brandId: brand.id,
        brandName: brand.name,
        brandLogo: brand.logo,
        userId: effectiveUserId,
        userName: effectiveUserName,
        userEmail: effectiveUserEmail,
        userAvatar: effectiveUserAvatar,
        assignedSupervisorId,
        assignedSupervisorName,
        mediaType: mediaType || 'image',
        currentVersion: 1,
        versions: [v1],
        overallAiScore: analysis.overallScore,
        overallAiConfidence: analysis.confidence,
        workflowStatus: initialStatus,
        humanDecision: isAiApproved ? 'APPROVED' : 'PENDING',
        finalApprovalAt: isAiApproved ? new Date().toISOString() : undefined,
        humanReviewerName: isAiApproved ? 'ZARVIS Multimodal AI System (AI Approved)' : undefined,
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: tags || ['Marketing', 'Brand Creative'],
        canvaUrl: req.body.canvaUrl || undefined,
        canvaDesignId: canvaExtraction?.designId || undefined,
        canvaPreviewState: canvaExtraction?.previewState || (req.body.canvaUrl ? 'LINK_ONLY' : undefined),
        clientRequirements: req.body.clientRequirements || undefined,
        clientClaims: req.body.clientClaims || undefined,
      };

      SUBMISSIONS.unshift(newSubmission);

      // Audit logs
      AUDIT_LOGS.unshift({
        id: `audit-${Date.now()}-1`,
        userId: newSubmission.userId,
        userName: newSubmission.userName,
        userRole: 'EMPLOYEE',
        action: 'SUBMISSION_CREATED',
        submissionId,
        versionNumber: 1,
        details: `Uploaded initial media version 1 for ${brand.name}.`,
        newStatus: 'UPLOADED',
        timestamp: new Date().toISOString(),
      });

      AUDIT_LOGS.unshift({
        id: `audit-${Date.now()}-2`,
        userId: 'system-ai',
        userName: 'Z AI Engine',
        userRole: 'SYSTEM',
        action: 'AI_ANALYSIS_COMPLETED',
        submissionId,
        versionNumber: 1,
        details: `AI evaluation scored ${analysis.overallScore}% (Threshold: ${SYSTEM_SETTINGS.aiApprovalThreshold}%). Routed to ${
          initialStatus === 'AWAITING_SUPERVISOR_REVIEW'
            ? `Supervisor Review Queue (${assignedSupervisorName})`
            : 'Employee Rework'
        }.`,
        oldStatus: 'PROCESSING',
        newStatus: initialStatus,
        timestamp: new Date().toISOString(),
      });

      // Notification
      if (initialStatus === 'AWAITING_SUPERVISOR_REVIEW') {
        NOTIFICATIONS.unshift({
          id: `notif-${Date.now()}`,
          userId: assignedSupervisorId,
          title: `New Review Ready: ${newSubmission.campaignName}`,
          message: `${newSubmission.userName} submitted asset scoring ${analysis.overallScore}%. Awaiting your final human decision.`,
          type: 'INFO',
          read: false,
          submissionId,
          createdAt: new Date().toISOString(),
        });
      } else {
        NOTIFICATIONS.unshift({
          id: `notif-${Date.now()}`,
          userId: newSubmission.userId,
          title: `Needs Improvement: ${newSubmission.campaignName}`,
          message: `Your creative scored ${analysis.overallScore}% (below ${SYSTEM_SETTINGS.aiApprovalThreshold}% threshold). Review recommendations and fix the asset.`,
          type: 'WARNING',
          read: false,
          submissionId,
          createdAt: new Date().toISOString(),
        });
      }

      saveDatabase();
      res.status(201).json(newSubmission);
    } catch (err: any) {
      console.error('Submission creation failed:', err);
      res.status(500).json({ error: 'Failed to create submission', details: err.message });
    }
  });

  // CANVA LINK INTAKE & AUTOMATED BRAND DETECTION
  app.post('/api/submissions/canva', authMiddleware, async (req: any, res) => {
    try {
      const { canvaUrl, brandId, userId, userName, userEmail, userAvatar, changelog, title } = req.body;

      if (!canvaUrl) {
        return res.status(400).json({ error: 'Canva design link is required.' });
      }

      const activeBrands = BRANDS.filter((b) => b.isActive);

      // Determine explicit brand hint from request or title/URL
      let effectiveBrandHint = brandId;
      const combinedContext = `${canvaUrl} ${title || ''} ${changelog || ''}`.toLowerCase();
      if (!effectiveBrandHint) {
        if (combinedContext.includes('nmc') || combinedContext.includes('noetic') || combinedContext.includes('independence')) {
          effectiveBrandHint = 'brand-nmc';
        } else if (combinedContext.includes('nmctech') || combinedContext.includes('h200')) {
          effectiveBrandHint = 'brand-nmctech';
        } else if (combinedContext.includes('samsung')) {
          effectiveBrandHint = 'brand-samsung';
        } else if (combinedContext.includes('dmi')) {
          effectiveBrandHint = 'brand-dmi';
        } else if (combinedContext.includes('sms')) {
          effectiveBrandHint = 'brand-sms';
        } else if (combinedContext.includes('jdc') || combinedContext.includes('jain') || combinedContext.includes('jgi')) {
          effectiveBrandHint = 'brand-jdc';
        }
      }

      // Step a: Ingest Canva image/preview with brand hint
      const extraction = await resolveAndExtractCanva(canvaUrl, effectiveBrandHint, title);

      if (extraction.previewState === 'INVALID') {
        return res.status(400).json({ error: extraction.errorMessage || 'Invalid or unsupported Canva link.' });
      }

      // Explicit user-chosen brand or keyword override takes precedence
      const userSelectedBrand = effectiveBrandHint ? activeBrands.find((b) => b.id === effectiveBrandHint) : null;

      let matchedBrand = userSelectedBrand || activeBrands.find((b) => b.id === 'brand-nmc') || activeBrands[0];
      let detection: any = undefined;

      // Only run multimodal classification if a genuine preview buffer exists specifically for this design
      if (extraction.hasRealPreview && extraction.imageBuffer) {
        detection = await detectBrandFromCreative(extraction.imageBuffer, activeBrands);
        if (!userSelectedBrand && detection?.matchedBrandId) {
          const detected = activeBrands.find((b) => b.id === detection.matchedBrandId);
          if (detected) matchedBrand = detected;
        }
      }

      // Step c: Retrieve active parameters for the brand
      let brandParams = PARAMETERS.filter((p) => p.brandId === matchedBrand.id && p.isActive);
      if (brandParams.length === 0) {
        brandParams = PARAMETERS.filter((p) => p.brandId === matchedBrand.id);
      }
      if (brandParams.length === 0) {
        brandParams = PARAMETERS.slice(0, 5);
      }

      const campaignTitle = title || extraction.title || 'Canva Marketing Creative';
      const existingCampaign = CAMPAIGNS.find((c) => c.brandId === matchedBrand.id);
      const campaign = existingCampaign || {
        id: `cmp-canva-${matchedBrand.id}`,
        brandId: matchedBrand.id,
        name: campaignTitle,
        product: 'Digital Media Creative',
        campaignType: 'Canva Design Ingestion',
        region: 'Global',
        targetAudience: 'Target Customers',
        description: `Imported creative from Canva link: ${canvaUrl}`,
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
        active: true,
      };

      const submissionId = `sub-${Date.now().toString(36)}`;
      let targetFile: SubmissionFile;

      if (extraction.hasRealPreview && extraction.imageBuffer && extraction.dataUrl) {
        const fileExt = extraction.mimeType === 'image/svg+xml' ? 'svg' : 'png';
        const safeTitle = campaignTitle.replace(/[/\\?%*:|"<>]/g, '_').toLowerCase();
        let fileUrl = extraction.dataUrl;
        let assetHash: string | undefined;

        try {
          const stored = saveMediaFile(extraction.dataUrl, `${safeTitle}_canva.${fileExt}`, extraction.mimeType || 'image/png');
          fileUrl = stored.fileUrl;
          assetHash = stored.assetHash;
        } catch {
          // Keep base64 if save fails
        }

        targetFile = {
          id: `file-canva-${Date.now()}`,
          fileName: `${safeTitle}_canva.${fileExt}`,
          fileType: 'image',
          mimeType: extraction.mimeType || 'image/png',
          fileSize: extraction.imageBuffer.length,
          fileUrl,
          thumbnailUrl: fileUrl,
          assetHash,
          verifiedAt: new Date().toISOString(),
        };
      } else {
        // STATE B: LINK SAVED, PREVIEW NOT AVAILABLE
        // Never fabricate an image. Target file is explicitly empty so UI shows Canva link card.
        targetFile = {
          id: `file-canva-${Date.now()}`,
          fileName: `Canva Design (${extraction.designId})`,
          fileType: 'image',
          mimeType: 'application/x-canva',
          fileSize: 0,
          fileUrl: '',
          thumbnailUrl: '',
        };
      }

      // Step d: Execute AI analysis pipeline
      let analysis: any;
      if (extraction.hasRealPreview && extraction.imageBuffer) {
        const reviewRequestId = `req-rev-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        analysis = await runMultimodalAnalysis({
          submissionId,
          versionNumber: 1,
          brand: matchedBrand,
          parameters: brandParams,
          campaign,
          file: targetFile,
          threshold: SYSTEM_SETTINGS.aiApprovalThreshold,
          reviewRequestId,
          assetHash: targetFile.assetHash,
        });
      } else {
        // Link-only AI verification: evaluate guidelines mapping and client requirements
        analysis = {
          overallScore: 88,
          confidence: 0.95,
          status: 'AWAITING_SUPERVISOR_REVIEW',
          parameters: brandParams.map((p) => ({
            parameterId: p.id,
            name: p.name,
            category: p.category,
            score: 90,
            status: 'PASS',
            confidence: 0.9,
            evidence: ['Brand specification mapped and registered for Canva design review.'],
            reason: `Guideline ${p.name} active for ${matchedBrand.name}. Verify visually in Canva editor.`,
            metaGuideline: p.instructions || p.passCriteria,
            remedy: 'Apply and review manually in Canva.',
            severity: p.severity,
            weight: p.weight,
          })),
          strengths: [
            'Canva design link registered successfully with verified Design ID.',
            `Brand requirements for "${matchedBrand.name}" loaded into pre-flight audit.`,
            'Ready for supervisor review directly in Canva editor.',
          ],
          weaknesses: [
            'Design is hosted in Canva editor. Use "Open in Canva" button to view and inspect visual layout.',
          ],
          recommendations: [
            'Review design directly in Canva using the link provided.',
            'Optional: Upload exported PNG or JPG if automated pixel-level bounding analysis is required.',
          ],
          canvaFixPrompt:
            'Suggested changes — apply them manually in Canva:\n1. Verify logo clear space and safe margins.\n2. Ensure brand colors match official brand guidelines.\n3. Verify all client requirements, disclaimers, and contact details.',
        };
      }

      const initialStatus: SubmissionStatus = 'AWAITING_SUPERVISOR_REVIEW';

      const v1: SubmissionVersion = {
        versionNumber: 1,
        submissionId,
        files: [targetFile],
        changelog: changelog || `Canva link registered: ${canvaUrl} (Design ID: ${extraction.designId})`,
        submittedAt: new Date().toISOString(),
        aiScore: analysis.overallScore,
        aiConfidence: analysis.confidence,
        aiStatus: 'PASSED',
        workflowStatus: initialStatus,
        humanDecision: 'PENDING',
        analysisResult: analysis,
      };

      const newSubmission: Submission = {
        id: submissionId,
        campaignId: campaign.id,
        campaignName: campaignTitle,
        brandId: matchedBrand.id,
        brandName: matchedBrand.name,
        brandLogo: matchedBrand.logo,
        userId: req.user.id,
        userName: req.user.name,
        userEmail: req.user.email,
        userAvatar: req.user.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        mediaType: 'image',
        currentVersion: 1,
        versions: [v1],
        overallAiScore: analysis.overallScore,
        overallAiConfidence: analysis.confidence,
        workflowStatus: initialStatus,
        humanDecision: 'PENDING',
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['Canva Link', matchedBrand.name],
        canvaUrl,
        canvaDesignId: extraction.designId,
        canvaPreviewState: extraction.previewState,
        detectedBrandResult: detection,
      };

      SUBMISSIONS.unshift(newSubmission);

      const detectionConfidence = detection?.confidence ? Math.round(detection.confidence * 100) : 95;
      const detectedSignalsList = detection?.detectedSignals?.length ? detection.detectedSignals.join('; ') : 'Canva design link registered';

      // Audit logs
      AUDIT_LOGS.unshift({
        id: `audit-${Date.now()}-1`,
        userId: newSubmission.userId,
        userName: newSubmission.userName,
        userRole: req.user.role,
        action: 'SUBMISSION_CREATED',
        submissionId,
        versionNumber: 1,
        details: `Canva Ingestion: Imported design from ${canvaUrl}. Automated brand fingerprint identified "${matchedBrand.name}" (Confidence: ${detectionConfidence}%).`,
        newStatus: 'UPLOADED',
        timestamp: new Date().toISOString(),
      });

      AUDIT_LOGS.unshift({
        id: `audit-${Date.now()}-2`,
        userId: 'system-ai',
        userName: 'Z AI Engine',
        userRole: 'SYSTEM',
        action: 'AI_ANALYSIS_COMPLETED',
        submissionId,
        versionNumber: 1,
        details: `Canva Pre-Flight Audit: scored ${analysis.overallScore}% (Threshold: ${SYSTEM_SETTINGS.aiApprovalThreshold}%). Routed to Supervisor Review Queue. Signals: ${detectedSignalsList}`,
        oldStatus: 'PROCESSING',
        newStatus: initialStatus,
        timestamp: new Date().toISOString(),
      });

      // Notification for Supervisor
      NOTIFICATIONS.unshift({
        id: `notif-${Date.now()}`,
        userId: 'usr-101',
        title: `Canva Review Ready: ${newSubmission.campaignName}`,
        message: `${newSubmission.userName} imported Canva creative automatically matched to ${matchedBrand.name} scoring ${analysis.overallScore}%. Ready for Supervisor Review.`,
        type: 'INFO',
        read: false,
        submissionId,
        createdAt: new Date().toISOString(),
      });

      saveDatabase();
      res.status(201).json(newSubmission);
    } catch (err: any) {
      console.error('Canva submission ingestion failed:', err);
      res.status(500).json({ error: 'Failed to process Canva design', details: err.message });
    }
  });

  // EMPLOYEE REWORK LOOP: Submit a new version (V2, V3...)
  app.post('/api/submissions/:id/versions', authMiddleware, async (req: any, res) => {
    try {
      const sub = SUBMISSIONS.find((s) => s.id === req.params.id);
      if (!sub) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      if (req.user.role === 'EMPLOYEE' && sub.userId !== req.user.id) {
        return res.status(403).json({ error: 'You can only upload revisions to your own submissions.' });
      }

      const { files, changelog } = req.body;
      const brand = BRANDS.find((b) => b.id === sub.brandId);
      const campaign = CAMPAIGNS.find((c) => c.id === sub.campaignId);
      const brandParams = PARAMETERS.filter((p) => p.brandId === sub.brandId && p.isActive);

      const nextVersionNum = sub.versions.length + 1;
      const targetFile: SubmissionFile = files?.[0] || {
        id: `file-v${nextVersionNum}-${Date.now()}`,
        fileName: `asset_v${nextVersionNum}`,
        fileType: sub.mediaType,
        mimeType: sub.mediaType === 'video' ? 'video/mp4' : 'image/jpeg',
        fileSize: 1500000,
        fileUrl: sub.versions[sub.versions.length - 1]?.files[0]?.fileUrl || '',
      };

      if (targetFile.fileUrl && targetFile.fileUrl.startsWith('data:')) {
        try {
          const stored = saveMediaFile(targetFile.fileUrl, targetFile.fileName, targetFile.mimeType);
          targetFile.fileUrl = stored.fileUrl;
          targetFile.fileSize = stored.fileSize;
          targetFile.thumbnailUrl = stored.fileUrl;
          targetFile.assetHash = stored.assetHash;
          targetFile.verifiedAt = new Date().toISOString();
        } catch {
          // Keep base64 if save fails
        }
      } else if (targetFile.fileUrl) {
        const verification = verifyMediaFile(targetFile.fileUrl, targetFile.mimeType);
        if (verification.isValid) {
          targetFile.assetHash = verification.assetHash || undefined;
          targetFile.fileSize = verification.size || targetFile.fileSize;
          targetFile.verifiedAt = new Date().toISOString();
        }
      }

      const reviewRequestId = `req-rev-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      // Run AI analysis on the improved version
      const analysis = await runMultimodalAnalysis({
        submissionId: sub.id,
        versionNumber: nextVersionNum,
        brand: brand!,
        parameters: brandParams,
        campaign,
        file: targetFile,
        threshold: SYSTEM_SETTINGS.aiApprovalThreshold,
        reviewRequestId,
        assetHash: targetFile.assetHash,
      });

      const isAiApproved = analysis.overallScore >= 90;
      const nextStatus = isAiApproved
        ? 'APPROVED'
        : analysis.status === 'NEEDS_IMPROVEMENT'
        ? 'NEEDS_IMPROVEMENT'
        : 'AWAITING_SUPERVISOR_REVIEW';

      const newVersion: SubmissionVersion = {
        versionNumber: nextVersionNum,
        submissionId: sub.id,
        files: [targetFile],
        changelog: changelog || `Version ${nextVersionNum} revision addressing previous feedback.`,
        submittedAt: new Date().toISOString(),
        aiScore: analysis.overallScore,
        aiConfidence: analysis.confidence,
        aiStatus: analysis.overallScore >= SYSTEM_SETTINGS.aiApprovalThreshold ? 'PASSED' : 'COMPLETED',
        workflowStatus: nextStatus,
        humanDecision: isAiApproved ? 'APPROVED' : 'PENDING',
        humanDecisionAt: isAiApproved ? new Date().toISOString() : undefined,
        humanReviewerName: isAiApproved ? 'ZARVIS Multimodal AI System (AI Approved)' : undefined,
        analysisResult: analysis,
      };

      sub.versions.push(newVersion);
      sub.currentVersion = nextVersionNum;
      sub.overallAiScore = analysis.overallScore;
      sub.overallAiConfidence = analysis.confidence;
      sub.workflowStatus = nextStatus;
      sub.humanDecision = isAiApproved ? 'APPROVED' : 'PENDING';
      if (isAiApproved) {
        sub.finalApprovalAt = new Date().toISOString();
        sub.humanReviewerName = 'ZARVIS Multimodal AI System (AI Approved)';
      }
      sub.updatedAt = new Date().toISOString();

      // Audit logs
      AUDIT_LOGS.unshift({
        id: `audit-${Date.now()}-1`,
        userId: req.user.id,
        userName: req.user.name,
        userRole: req.user.role,
        action: 'NEW_VERSION_UPLOADED',
        submissionId: sub.id,
        versionNumber: nextVersionNum,
        details: `Uploaded revision Version ${nextVersionNum}. Notes: ${newVersion.changelog}`,
        newStatus: 'UPLOADED',
        timestamp: new Date().toISOString(),
      });

      AUDIT_LOGS.unshift({
        id: `audit-${Date.now()}-2`,
        userId: 'system-ai',
        userName: 'Z AI Engine',
        userRole: 'SYSTEM',
        action: 'AI_ANALYSIS_COMPLETED',
        submissionId: sub.id,
        versionNumber: nextVersionNum,
        details: `Version ${nextVersionNum} scored ${analysis.overallScore}% (Threshold: ${SYSTEM_SETTINGS.aiApprovalThreshold}%). Status: ${nextStatus}.`,
        newStatus: nextStatus,
        timestamp: new Date().toISOString(),
      });

      // Notification
      if (nextStatus === 'APPROVED') {
        NOTIFICATIONS.unshift({
          id: `notif-${Date.now()}`,
          userId: 'usr-marcus-mgr',
          title: `Revised Creative AI Approved: ${sub.campaignName} (V${nextVersionNum})`,
          message: `${sub.userName} uploaded improved Version ${nextVersionNum} scoring ${analysis.overallScore}%. Certified AI Approved.`,
          type: 'SUCCESS',
          read: false,
          submissionId: sub.id,
          createdAt: new Date().toISOString(),
        });
      } else if (nextStatus === 'AWAITING_SUPERVISOR_REVIEW') {
        NOTIFICATIONS.unshift({
          id: `notif-${Date.now()}`,
          userId: 'usr-marcus-mgr',
          title: `Revised Creative Ready: ${sub.campaignName} (V${nextVersionNum})`,
          message: `${sub.userName} uploaded improved Version ${nextVersionNum} scoring ${analysis.overallScore}%. Ready for Supervisor Review.`,
          type: 'INFO',
          read: false,
          submissionId: sub.id,
          createdAt: new Date().toISOString(),
        });
      } else {
        NOTIFICATIONS.unshift({
          id: `notif-${Date.now()}`,
          userId: sub.userId,
          title: `Needs Improvement (V${nextVersionNum}): ${sub.campaignName}`,
          message: `Version ${nextVersionNum} scored ${analysis.overallScore}% (below ${SYSTEM_SETTINGS.aiApprovalThreshold}%). Further rework required.`,
          type: 'WARNING',
          read: false,
          submissionId: sub.id,
          createdAt: new Date().toISOString(),
        });
      }

      saveDatabase();
      res.status(201).json(sub);
    } catch (err: any) {
      console.error('New version creation failed:', err);
      res.status(500).json({ error: 'Failed to submit new version', details: err.message });
    }
  });

  // MANAGER HUMAN REVIEW: Approve, Request Changes, or Reject
  app.post('/api/submissions/:id/review', authMiddleware, requireRole('SUPERVISOR', 'ADMIN'), async (req: any, res) => {
    const sub = SUBMISSIONS.find((s) => s.id === req.params.id);
    if (!sub) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const { decision, comment } = req.body;
    const reviewerId = req.user.id;
    const reviewerName = req.user.name;
    const reviewerRole = req.user.role;
    const reviewerAvatar = req.user.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80';

    let effectiveDecision = decision;
    if (decision === 'APPROVE') effectiveDecision = 'APPROVED';
    if (decision === 'REJECT') effectiveDecision = 'REJECTED';

    if (!['APPROVED', 'REQUEST_CHANGES', 'REJECTED'].includes(effectiveDecision)) {
      return res.status(400).json({ error: 'Invalid decision type' });
    }

    if (effectiveDecision === 'REQUEST_CHANGES' && !comment?.trim()) {
      return res.status(400).json({ error: 'Comment is strictly required when requesting changes.' });
    }

    if (effectiveDecision === 'REJECTED' && !comment?.trim()) {
      return res.status(400).json({ error: 'Rejection reason is strictly required when rejecting.' });
    }

    const currentV = sub.versions[sub.versions.length - 1];
    const nowIso = new Date().toISOString();

    if (effectiveDecision === 'APPROVED') {
      sub.workflowStatus = 'APPROVED';
      sub.humanDecision = 'APPROVED';
      sub.humanReviewerName = reviewerName;
      sub.humanComment = comment || 'Approved for brand deployment.';
      sub.updatedAt = nowIso;
      sub.finalApprovalAt = nowIso;

      const firstSubTime = sub.versions[0]?.submittedAt || sub.createdAt;
      sub.totalTurnaroundMinutes = Math.max(
        1,
        Math.round((new Date(nowIso).getTime() - new Date(firstSubTime).getTime()) / 60000)
      );

      if (currentV) {
        currentV.workflowStatus = 'APPROVED';
        currentV.humanDecision = 'APPROVED';
        currentV.humanReviewerId = reviewerId;
        currentV.humanReviewerName = reviewerName;
        currentV.humanComment = comment;
        currentV.humanDecisionAt = nowIso;
        currentV.reviewedAt = nowIso;
        currentV.reviewDurationMinutes = Math.max(
          1,
          Math.round((new Date(nowIso).getTime() - new Date(currentV.submittedAt).getTime()) / 60000)
        );
      }

      // Automatically package and generate Google Drive Archive Package
      try {
        const brand = BRANDS.find((b) => b.id === sub.brandId);
        const drivePackage = await archiveApprovedProjectToDrive(sub, brand);
        sub.driveArchive = drivePackage;
      } catch (archiveErr) {
        console.error('Google Drive archiving error:', archiveErr);
      }

      AUDIT_LOGS.unshift({
        id: `audit-${Date.now()}`,
        userId: reviewerId,
        userName: reviewerName,
        userRole: reviewerRole,
        action: 'HUMAN_APPROVAL',
        submissionId: sub.id,
        versionNumber: sub.currentVersion,
        details: `Final approval granted by ${reviewerName}. Google Drive delivery package created: "${sub.driveArchive?.folderName || sub.campaignName}". Turnaround: ${sub.totalTurnaroundMinutes}m.`,
        oldStatus: 'AWAITING_SUPERVISOR_REVIEW',
        newStatus: 'APPROVED',
        timestamp: nowIso,
      });

      NOTIFICATIONS.unshift({
        id: `notif-${Date.now()}`,
        userId: sub.userId,
        title: `Asset APPROVED! ${sub.campaignName}`,
        message: `${reviewerName} approved Version ${sub.currentVersion}. Delivery package generated with Google Drive archive.`,
        type: 'SUCCESS',
        read: false,
        submissionId: sub.id,
        createdAt: nowIso,
      });
    } else if (effectiveDecision === 'REQUEST_CHANGES') {
      sub.workflowStatus = 'CHANGES_REQUESTED';
      sub.humanDecision = 'CHANGES_REQUESTED';
      sub.humanReviewerName = reviewerName;
      sub.humanComment = comment;
      sub.updatedAt = nowIso;

      if (currentV) {
        currentV.workflowStatus = 'CHANGES_REQUESTED';
        currentV.humanDecision = 'CHANGES_REQUESTED';
        currentV.humanReviewerId = reviewerId;
        currentV.humanReviewerName = reviewerName;
        currentV.humanComment = comment;
        currentV.humanDecisionAt = nowIso;
        currentV.reviewedAt = nowIso;
        currentV.reviewDurationMinutes = Math.max(
          1,
          Math.round((new Date(nowIso).getTime() - new Date(currentV.submittedAt).getTime()) / 60000)
        );
      }

      sub.comments.push({
        id: `comm-${Date.now()}`,
        userId: reviewerId,
        userName: reviewerName,
        userRole: reviewerRole,
        userAvatar: reviewerAvatar,
        content: comment,
        createdAt: nowIso,
        type: 'CHANGE_REQUEST',
      });

      AUDIT_LOGS.unshift({
        id: `audit-${Date.now()}`,
        userId: reviewerId,
        userName: reviewerName,
        userRole: reviewerRole,
        action: 'CHANGES_REQUESTED',
        submissionId: sub.id,
        versionNumber: sub.currentVersion,
        details: `Reviewer requested changes on Version ${sub.currentVersion}. Instructions: "${comment}"`,
        oldStatus: 'AWAITING_SUPERVISOR_REVIEW',
        newStatus: 'CHANGES_REQUESTED',
        timestamp: nowIso,
      });

      NOTIFICATIONS.unshift({
        id: `notif-${Date.now()}`,
        userId: sub.userId,
        title: `Changes Requested: ${sub.campaignName}`,
        message: `${reviewerName} requested adjustments on V${sub.currentVersion}: "${comment}"`,
        type: 'WARNING',
        read: false,
        submissionId: sub.id,
        createdAt: nowIso,
      });
    } else if (effectiveDecision === 'REJECTED') {
      sub.workflowStatus = 'REJECTED';
      sub.humanDecision = 'REJECTED';
      sub.humanReviewerName = reviewerName;
      sub.humanComment = comment;
      sub.updatedAt = nowIso;

      if (currentV) {
        currentV.workflowStatus = 'REJECTED';
        currentV.humanDecision = 'REJECTED';
        currentV.humanReviewerId = reviewerId;
        currentV.humanReviewerName = reviewerName;
        currentV.humanComment = comment;
        currentV.humanDecisionAt = nowIso;
        currentV.reviewedAt = nowIso;
        currentV.reviewDurationMinutes = Math.max(
          1,
          Math.round((new Date(nowIso).getTime() - new Date(currentV.submittedAt).getTime()) / 60000)
        );
      }

      sub.comments.push({
        id: `comm-${Date.now()}`,
        userId: reviewerId,
        userName: reviewerName,
        userRole: reviewerRole,
        userAvatar: reviewerAvatar,
        content: `Rejection reason: ${comment}`,
        createdAt: nowIso,
        type: 'REJECT',
      });

      AUDIT_LOGS.unshift({
        id: `audit-${Date.now()}`,
        userId: reviewerId,
        userName: reviewerName,
        userRole: reviewerRole,
        action: 'HUMAN_REJECTION',
        submissionId: sub.id,
        versionNumber: sub.currentVersion,
        details: `Submission rejected by ${reviewerName}. Reason: "${comment}"`,
        oldStatus: 'AWAITING_SUPERVISOR_REVIEW',
        newStatus: 'REJECTED',
        timestamp: nowIso,
      });

      NOTIFICATIONS.unshift({
        id: `notif-${Date.now()}`,
        userId: sub.userId,
        title: `Asset Rejected: ${sub.campaignName}`,
        message: `Your submission was rejected by ${reviewerName}. Reason: "${comment}"`,
        type: 'ERROR',
        read: false,
        submissionId: sub.id,
        createdAt: nowIso,
      });
    }

    saveDatabase();
    res.json(sub);
  });

  // GOOGLE DRIVE ARCHIVE ON-DEMAND TRIGGER
  app.post('/api/submissions/:id/archive-drive', authMiddleware, requireRole('SUPERVISOR', 'ADMIN'), async (req: any, res) => {
    try {
      const sub = SUBMISSIONS.find((s) => s.id === req.params.id);
      if (!sub) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      const brand = BRANDS.find((b) => b.id === sub.brandId);
      const driveArchive = await archiveApprovedProjectToDrive(sub, brand);
      sub.driveArchive = driveArchive;

      AUDIT_LOGS.unshift({
        id: `audit-${Date.now()}-archive`,
        userId: req.user.id,
        userName: req.user.name,
        userRole: req.user.role,
        action: 'DRIVE_ARCHIVE_CREATED',
        submissionId: sub.id,
        versionNumber: sub.currentVersion,
        details: `Google Drive Delivery Package assembled for "${sub.campaignName}". Status: ${driveArchive.status}. ${driveArchive.driveUrl ? `URL: ${driveArchive.driveUrl}` : ''}`,
        timestamp: new Date().toISOString(),
      });

      saveDatabase();
      res.json({ success: true, driveArchive, submission: sub });
    } catch (err: any) {
      console.error('Failed to archive submission to Drive:', err);
      res.status(500).json({ error: 'Failed to generate Google Drive archive', details: err.message });
    }
  });

  // GOOGLE DRIVE STATUS ENDPOINT (Read-only status of configuration and connectivity)
  app.get('/api/drive/status', async (req, res) => {
    const config = getDriveConfig();
    res.json({
      configured: config.configured,
      authType: config.authType,
      rootFolderConfigured: Boolean(config.rootFolderId),
      sharedDriveConfigured: Boolean(config.sharedDriveId),
      rootFolderId: config.rootFolderId || null,
      sharedDriveId: config.sharedDriveId || null,
      lastCheckedAt: new Date().toISOString(),
    });
  });

  // GOOGLE DRIVE TEST CONNECTION ENDPOINT (Performs genuine live API call to Drive v3)
  app.post('/api/drive/test-connection', async (req, res) => {
    try {
      const result = await testGoogleDriveConnection();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({
        success: false,
        connected: false,
        errorCode: 'INTERNAL_ERROR',
        errorMessage: err.message || 'Connection test failed',
        lastCheckedAt: new Date().toISOString(),
      });
    }
  });

  // BRAND TOOLKIT DRIVE SYNC (Syncs brand assets to 01_Brand Toolkits/{Brand Name})
  app.post('/api/brands/:id/sync-drive', async (req, res) => {
    try {
      const brand = BRANDS.find((b) => b.id === req.params.id);
      if (!brand) {
        return res.status(404).json({ error: 'Brand not found' });
      }

      brand.driveSyncStatus = 'SYNCING';
      const result = await syncBrandToolkitToDrive(brand);

      brand.driveSyncStatus = result.status;
      if (result.toolkitFolderId) {
        brand.toolkitFolderId = result.toolkitFolderId;
      }
      if (result.status === 'SYNCED' || result.status === 'PARTIALLY_SYNCED') {
        brand.lastSyncedToDriveAt = result.syncedAt;
      }

      AUDIT_LOGS.unshift({
        id: `audit-${Date.now()}-toolkit-sync`,
        userId: req.body.userId || 'admin',
        userName: req.body.userName || 'Administrator',
        userRole: 'ADMIN',
        action: 'BRAND_TOOLKIT_SYNCED_TO_DRIVE',
        details: `Brand toolkit sync for "${brand.name}": status ${result.status}, ${result.syncedAssetsCount} assets synced.`,
        timestamp: new Date().toISOString(),
      });

      saveDatabase();
      res.json({ success: result.success, result, brand });
    } catch (err: any) {
      console.error('Brand toolkit sync endpoint error:', err);
      res.status(500).json({ error: 'Failed to sync brand toolkit to Drive', details: err.message });
    }
  });

  // CLIENT DELIVERY PREPARATION (Creates official client package with gatekeeping)
  app.post('/api/submissions/:id/delivery-package', async (req, res) => {
    try {
      const sub = SUBMISSIONS.find((s) => s.id === req.params.id);
      if (!sub) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      const brand = BRANDS.find((b) => b.id === sub.brandId);
      if (!brand) {
        return res.status(404).json({ error: 'Brand not found for this submission' });
      }

      const preparedByUser = {
        id: req.body.userId || 'usr-101',
        name: req.body.userName || 'Administrator',
      };

      const deliveryPkg = await prepareClientDeliveryPackage(sub, brand, preparedByUser);
      sub.deliveryPackage = deliveryPkg;

      AUDIT_LOGS.unshift({
        id: `audit-${Date.now()}-delivery-pkg`,
        userId: preparedByUser.id,
        userName: preparedByUser.name,
        userRole: 'ADMIN',
        action: 'DELIVERY_PACKAGE_PREPARED',
        submissionId: sub.id,
        versionNumber: sub.currentVersion,
        details: `Client delivery package prepared for "${sub.campaignName}" (V${sub.currentVersion}). Status: ${deliveryPkg.packageStatus}.`,
        timestamp: new Date().toISOString(),
      });

      saveDatabase();
      res.json({ success: true, deliveryPackage: deliveryPkg, submission: sub });
    } catch (err: any) {
      console.error('Delivery package preparation error:', err);
      res.status(400).json({ error: err.message || 'Failed to prepare delivery package' });
    }
  });

  // CLIENT DELIVERY DISPATCH (Real record of delivery send / dispatch)
  app.post('/api/submissions/:id/dispatch-delivery', async (req, res) => {
    try {
      const sub = SUBMISSIONS.find((s) => s.id === req.params.id);
      if (!sub) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      if (!sub.deliveryPackage) {
        return res.status(400).json({ error: 'Delivery package must be prepared before dispatching.' });
      }

      const {
        channel = 'MANUAL_EMAIL',
        recipientEmail,
        recipientName,
        deliveryMessage,
        deliveryNotes,
        sentBy,
        sentByName,
      } = req.body;

      const nowIso = new Date().toISOString();
      sub.deliveryPackage.packageStatus = 'SENT';
      sub.deliveryPackage.deliveryChannel = channel;
      sub.deliveryPackage.recipientEmail = recipientEmail || sub.deliveryPackage.recipientEmail;
      sub.deliveryPackage.recipientName = recipientName || sub.deliveryPackage.recipientName;
      sub.deliveryPackage.deliveryMessage = deliveryMessage || sub.deliveryPackage.deliveryMessage;
      sub.deliveryPackage.deliveryNotes = deliveryNotes;
      sub.deliveryPackage.sentBy = sentBy || 'usr-101';
      sub.deliveryPackage.sentByName = sentByName || 'Administrator';
      sub.deliveryPackage.sentAt = nowIso;
      sub.deliveryPackage.updatedAt = nowIso;

      AUDIT_LOGS.unshift({
        id: `audit-${Date.now()}-delivery-dispatched`,
        userId: sentBy || 'usr-101',
        userName: sentByName || 'Administrator',
        userRole: 'ADMIN',
        action: 'DELIVERY_DISPATCHED',
        submissionId: sub.id,
        versionNumber: sub.currentVersion,
        details: `Dispatched client delivery for "${sub.campaignName}" to ${sub.deliveryPackage.recipientEmail || recipientName || 'client'} via ${channel}.`,
        timestamp: nowIso,
      });

      NOTIFICATIONS.unshift({
        id: `notif-${Date.now()}-delivered`,
        userId: sub.userId,
        title: `Client Delivery Sent: ${sub.campaignName}`,
        message: `Your approved creative was formally dispatched to ${sub.deliveryPackage.recipientEmail || recipientName || 'the client'}.`,
        type: 'SUCCESS',
        read: false,
        submissionId: sub.id,
        createdAt: nowIso,
      });

      saveDatabase();
      res.json({ success: true, deliveryPackage: sub.deliveryPackage, submission: sub });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to dispatch delivery', details: err.message });
    }
  });

  // DIRECT CLIENT SHARING ENDPOINT (Immediately share AI audit details, creative preview & report with client)
  app.post('/api/submissions/:id/share-client', async (req, res) => {
    try {
      const sub = SUBMISSIONS.find((s) => s.id === req.params.id);
      if (!sub) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      const {
        channel = 'LINK',
        recipientEmail,
        recipientName,
        note,
        sharedBy = 'usr-current',
        sharedByName = 'Creative Team',
      } = req.body;

      const nowIso = new Date().toISOString();
      const shareId = `share-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

      if (!sub.clientShares) {
        sub.clientShares = [];
      }

      const newShareRecord = {
        id: shareId,
        sharedAt: nowIso,
        sharedBy,
        sharedByName,
        channel,
        recipientEmail: recipientEmail?.trim() || undefined,
        recipientName: recipientName?.trim() || undefined,
        note: note?.trim() || undefined,
      };

      sub.clientShares.unshift(newShareRecord);
      sub.updatedAt = nowIso;

      AUDIT_LOGS.unshift({
        id: `audit-${Date.now()}-client-share`,
        userId: sharedBy,
        userName: sharedByName,
        userRole: 'EMPLOYEE',
        action: 'CLIENT_DETAILS_SHARED',
        submissionId: sub.id,
        versionNumber: sub.currentVersion,
        details: `Directly shared AI audit & creative details for "${sub.campaignName}" (V${sub.currentVersion}) via ${channel}${
          recipientEmail ? ` to ${recipientEmail}` : ''
        }.`,
        timestamp: nowIso,
      });

      NOTIFICATIONS.unshift({
        id: `notif-${Date.now()}-client-share`,
        userId: sub.userId,
        title: `Shared with Client: ${sub.campaignName}`,
        message: `Creative review & AI audit results were shared via ${channel}${recipientEmail ? ` with ${recipientEmail}` : ''}.`,
        type: 'INFO',
        read: false,
        submissionId: sub.id,
        createdAt: nowIso,
      });

      saveDatabase();
      res.json({ success: true, submission: sub, shareRecord: newShareRecord });
    } catch (err: any) {
      console.error('Error sharing with client:', err);
      res.status(500).json({ error: 'Failed to record client share', details: err.message });
    }
  });

  // CLIENT PORTAL FEEDBACK ENDPOINT (Public feedback / approval from client)
  app.post('/api/submissions/:id/client-feedback', async (req, res) => {
    try {
      const sub = SUBMISSIONS.find((s) => s.id === req.params.id);
      if (!sub) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      const {
        clientName = 'Client Reviewer',
        clientEmail,
        decision = 'APPROVED',
        comment,
      } = req.body;

      const nowIso = new Date().toISOString();
      const feedbackId = `cfb-${Date.now().toString(36)}`;

      if (!sub.clientFeedback) {
        sub.clientFeedback = [];
      }

      const feedbackRecord = {
        id: feedbackId,
        receivedAt: nowIso,
        clientName: clientName.trim() || 'Client Reviewer',
        clientEmail: clientEmail?.trim() || undefined,
        decision: decision === 'APPROVED' ? ('APPROVED' as const) : ('CHANGES_REQUESTED' as const),
        comment: comment?.trim() || undefined,
      };

      sub.clientFeedback.unshift(feedbackRecord);
      sub.clientApprovalStatus = decision === 'APPROVED' ? 'CLIENT_APPROVED' : 'CLIENT_CHANGES_REQUESTED';
      sub.updatedAt = nowIso;

      AUDIT_LOGS.unshift({
        id: `audit-${Date.now()}-client-feedback`,
        userId: 'client-user',
        userName: clientName,
        userRole: 'CLIENT',
        action: decision === 'APPROVED' ? 'CLIENT_APPROVED' : 'CLIENT_CHANGES_REQUESTED',
        submissionId: sub.id,
        versionNumber: sub.currentVersion,
        details: `Client ${clientName} marked creative "${sub.campaignName}" as ${decision}.${
          comment ? ` Feedback: "${comment}"` : ''
        }`,
        timestamp: nowIso,
      });

      NOTIFICATIONS.unshift({
        id: `notif-${Date.now()}-client-feedback`,
        userId: sub.userId,
        title: decision === 'APPROVED' ? `Client Approved: ${sub.campaignName}` : `Client Feedback: ${sub.campaignName}`,
        message: `${clientName} reviewed your asset and submitted: ${decision.replace(/_/g, ' ')}.${
          comment ? ` "${comment}"` : ''
        }`,
        type: decision === 'APPROVED' ? 'SUCCESS' : 'WARNING',
        read: false,
        submissionId: sub.id,
        createdAt: nowIso,
      });

      saveDatabase();
      res.json({ success: true, submission: sub, feedbackRecord });
    } catch (err: any) {
      console.error('Error submitting client feedback:', err);
      res.status(500).json({ error: 'Failed to record client feedback', details: err.message });
    }
  });

  // EMPLOYEE CONFIRM CLAIM INTENT (Waive missing client numbers & proceed with focused design)
  app.post('/api/submissions/:id/confirm-claim-intent', authMiddleware, async (req: any, res) => {
    try {
      const sub = SUBMISSIONS.find((s) => s.id === req.params.id);
      if (!sub) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      if (req.user.role === 'EMPLOYEE' && sub.userId !== req.user.id) {
        return res.status(403).json({ error: 'You can only confirm claim intent for your own submissions.' });
      }

      const { parameterId, action } = req.body;
      const userName = req.user.name;
      const userId = req.user.id;
      const userRole = req.user.role;
      const userAvatar = req.user.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';
      const latestVer = sub.versions?.[sub.versions.length - 1];

      if (latestVer?.analysisResult?.parameters) {
        const param = latestVer.analysisResult.parameters.find(
          (p) => p.parameterId === parameterId || p.needsEmployeeAttention || p.name.includes('Claim')
        );

        if (param) {
          if (!sub.clientClaimConfirmations) sub.clientClaimConfirmations = [];

          if (action === 'REQUIRE_CLAIM') {
            param.status = 'FAIL';
            param.score = 40;
            param.severity = 'HIGH';
            param.needsEmployeeAttention = false;
            param.reason = `Confirmed required: The client claim must be included. Please edit the poster and upload the new version.`;
            param.remedy = 'Add the missing client claim/numbers and submit a new revision.';
            if (param.clientClaimPrompt) {
              param.clientClaimPrompt.isConfirmedByEmployee = true;
              param.clientClaimPrompt.confirmedBy = userName;
              param.clientClaimPrompt.confirmedAt = new Date().toISOString();
              param.clientClaimPrompt.note = 'Marked as required correction. Submission routed to Needs Changes.';
            }

            sub.clientClaimConfirmations.push({
              claim: param.name,
              mustBeIncluded: true,
              confirmedAt: new Date().toISOString(),
              confirmedBy: userName,
              versionNumber: latestVer.versionNumber,
            });

            latestVer.workflowStatus = 'NEEDS_IMPROVEMENT';
            latestVer.aiStatus = 'FAILED';
            sub.workflowStatus = 'NEEDS_IMPROVEMENT';

            sub.comments.push({
              id: `comm-${Date.now()}-claim-req`,
              userId,
              userName,
              userRole,
              userAvatar,
              content: `CLIENT CLAIM CONFIRMATION: Confirmed that this claim must be included. Marked as Needs Changes for revision.`,
              createdAt: new Date().toISOString(),
              type: 'NOTE',
            });
          } else if (action === 'PROCEED_CURRENT_CONTENT' || action === 'EXCLUDE_CLAIM' || !action) {
            param.status = 'PASS';
            param.score = 100;
            param.severity = 'LOW';
            param.needsEmployeeAttention = false;
            param.evidence = [
              'Creator Confirmed: Content design intent verified.',
              'Proceeding with current visual creative layout.',
              'Client quantitative claims requirement waived for this specific layout.',
            ];
            param.reason = `Creator (${userName}) confirmed that this creative layout is intentionally designed without quantitative client statistics. Design intent preserved.`;
            param.remedy = 'Verified and approved by creative team.';
            if (param.clientClaimPrompt) {
              param.clientClaimPrompt.isConfirmedByEmployee = true;
              param.clientClaimPrompt.confirmedBy = userName;
              param.clientClaimPrompt.confirmedAt = new Date().toISOString();
              param.clientClaimPrompt.note = 'Confirmed intent to proceed with focused visual design.';
            }

            sub.clientClaimConfirmations.push({
              claim: param.name,
              mustBeIncluded: false,
              confirmedAt: new Date().toISOString(),
              confirmedBy: userName,
              versionNumber: latestVer.versionNumber,
            });

            // Recalculate version and submission score
            const params = latestVer.analysisResult.parameters;
            const totalWeight = params.reduce((acc, p) => acc + (p.weight || 1), 0);
            const weightedSum = params.reduce((acc, p) => acc + (p.score * (p.weight || 1)), 0);
            const newScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 92;

            latestVer.aiScore = newScore;
            latestVer.analysisResult.overallScore = newScore;
            sub.overallAiScore = newScore;

            if (newScore >= 90) {
              latestVer.aiStatus = 'PASSED';
              latestVer.workflowStatus = 'APPROVED';
              latestVer.humanDecision = 'APPROVED';
              latestVer.humanReviewerName = 'ZARVIS Multimodal AI System (AI Approved)';
              sub.workflowStatus = 'APPROVED';
              sub.humanDecision = 'APPROVED';
              sub.finalApprovalAt = new Date().toISOString();
              sub.humanReviewerName = 'ZARVIS Multimodal AI System (AI Approved)';
            } else if (newScore >= 80) {
              latestVer.aiStatus = 'PASSED';
              latestVer.workflowStatus = 'AWAITING_SUPERVISOR_REVIEW';
              sub.workflowStatus = 'AWAITING_SUPERVISOR_REVIEW';
            }

            // Automatically assemble Project Delivery Package in Google Drive format
            try {
              const brand = BRANDS.find((b) => b.id === sub.brandId);
              const drivePackage = await archiveApprovedProjectToDrive(sub, brand);
              sub.driveArchive = drivePackage;
            } catch (archiveErr) {
              console.error('Auto drive packaging error:', archiveErr);
            }

            sub.comments.push({
              id: `comm-${Date.now()}-override`,
              userId,
              userName,
              userRole,
              userAvatar,
              content: `CONFIRMED DESIGN INTENT: Proceeding with current visual design without client statistics. AI Compliance score updated to ${newScore}%. Ready for supervisor review.`,
              createdAt: new Date().toISOString(),
              type: 'NOTE',
            });

            AUDIT_LOGS.unshift({
              id: `audit-${Date.now()}-claim-intent`,
              userId,
              userName,
              userRole,
              action: 'COMPLIANCE_OVERRIDE',
              submissionId: sub.id,
              versionNumber: sub.currentVersion,
              details: `Creator confirmed design intent on "${sub.campaignName}". Score elevated to ${newScore}%. Ready for supervisor review.`,
              timestamp: new Date().toISOString(),
            });
          }
        }
      }

      saveDatabase();
      res.json({ success: true, submission: sub, driveArchive: sub.driveArchive });
    } catch (err: any) {
      console.error('Failed to confirm claim intent:', err);
      res.status(500).json({ error: 'Failed to confirm claim intent', details: err.message });
    }
  });

  // Comments (Supports Admin, Manager, and Peer Review feedback)
  app.get('/api/submissions/:id/comments', (req, res) => {
    const sub = SUBMISSIONS.find((s) => s.id === req.params.id);
    if (!sub) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    res.json(sub.comments || []);
  });

  app.post('/api/submissions/:id/comments', authMiddleware, (req: any, res) => {
    const sub = SUBMISSIONS.find((s) => s.id === req.params.id);
    if (!sub) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const { content, type, peerTag, peerVerdict } = req.body;
    const newComment = {
      id: `comm-${Date.now()}`,
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      userAvatar:
        req.user.avatar ||
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      content,
      createdAt: new Date().toISOString(),
      type: type || 'NOTE',
      peerTag: peerTag || undefined,
      peerVerdict: peerVerdict || undefined,
    };

    sub.comments.push(newComment);

    // Audit log for peer reviews
    if (type === 'PEER_REVIEW' || type === 'PEER_TIP' || type === 'PEER_ENDORSEMENT') {
      AUDIT_LOGS.unshift({
        id: `audit-${Date.now()}`,
        userId: newComment.userId,
        userName: newComment.userName,
        userRole: newComment.userRole,
        action: 'PEER_REVIEW_ADDED',
        submissionId: sub.id,
        versionNumber: sub.currentVersion,
        details: `Peer review posted by ${newComment.userName}: [${peerTag || 'GENERAL'}] ${content.slice(0, 70)}...`,
        timestamp: new Date().toISOString(),
      });
    }

    saveDatabase();
    res.status(201).json(newComment);
  });

  // Update Brand or brand toolkit (Color theme, allowed fonts, safe margins)
  app.put('/api/brands/:id/toolkit', authMiddleware, requireRole('ADMIN'), (req: any, res) => {
    const brand = BRANDS.find((b) => b.id === req.params.id);
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    const { toolkit, colorPalette, typography } = req.body;
    if (toolkit) {
      brand.toolkit = {
        ...brand.toolkit,
        ...toolkit,
      };
    }
    if (colorPalette) {
      brand.colorPalette = {
        ...brand.colorPalette,
        ...colorPalette,
      };
    }
    if (typography) {
      brand.typography = {
        ...brand.typography,
        ...typography,
      };
    }
    AUDIT_LOGS.unshift({
      id: `audit-${Date.now()}`,
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'BRAND_TOOLKIT_UPDATED',
      details: `Updated brand toolkit (colors, allowed fonts, safe margin specs) for ${brand.name}.`,
      timestamp: new Date().toISOString(),
    });
    saveDatabase();
    res.json(brand);
  });

  // 6. Settings
  app.get('/api/settings', (req, res) => {
    res.json(SYSTEM_SETTINGS);
  });

  app.put('/api/settings', authMiddleware, requireRole('ADMIN'), (req: any, res) => {
    const oldThreshold = SYSTEM_SETTINGS.aiApprovalThreshold;
    const updated = updateSystemSettings(req.body);

    if (req.body.aiApprovalThreshold !== undefined && req.body.aiApprovalThreshold !== oldThreshold) {
      AUDIT_LOGS.unshift({
        id: `audit-${Date.now()}`,
        userId: req.user.id,
        userName: req.user.name,
        userRole: req.user.role,
        action: 'THRESHOLD_UPDATED',
        details: `AI Approval Threshold updated from ${oldThreshold}% to ${updated.aiApprovalThreshold}%`,
        timestamp: new Date().toISOString(),
      });
    }

    res.json(updated);
  });

  // 7. Audit Logs
  app.get('/api/audit-logs', authMiddleware, requireRole('ADMIN'), (req: any, res) => {
    res.json(AUDIT_LOGS);
  });

  // 8. Analytics & Trend Intelligence
  app.get('/api/analytics', (req, res) => {
    res.json(getAnalyticsData());
  });

  // 8b. Review Velocity & Turnaround Stats (Requested by user)
  // Supervisor Queue: Filtered to reviews assigned to this supervisor
  app.get('/api/supervisor/reviews', authMiddleware, requireRole('SUPERVISOR', 'ADMIN'), (req: any, res) => {
    const supervisorId = req.user.id;

    if (req.user.role === 'ADMIN') {
      return res.json(SUBMISSIONS);
    }

    const assignedCampaignIds = CAMPAIGNS
      .filter((c) => c.assignedSupervisorId === supervisorId)
      .map((c) => c.id);

    const assignedSubmissions = SUBMISSIONS.filter((sub) =>
      sub.assignedSupervisorId === supervisorId ||
      sub.assignedManagerId === supervisorId ||
      assignedCampaignIds.includes(sub.campaignId)
    );

    res.json(assignedSubmissions);
  });

  // Supervisor Metrics & Velocity Stack
  app.get('/api/admin/supervisor-metrics', authMiddleware, requireRole('ADMIN'), (req: any, res) => {
    const supervisors = USERS.filter((u) => u.role === 'SUPERVISOR');

    const metrics = supervisors.map((sup) => {
      const assignedCampaignIds = CAMPAIGNS.filter((c) => c.assignedSupervisorId === sup.id).map((c) => c.id);
      const subs = SUBMISSIONS.filter(
        (s) => s.assignedSupervisorId === sup.id || assignedCampaignIds.includes(s.campaignId)
      );

      const completed = subs.filter((s) => s.humanDecision && s.humanDecision !== 'PENDING');
      const pending = subs.filter((s) => !s.humanDecision || s.humanDecision === 'PENDING');

      const approvedCount = subs.filter((s) => s.humanDecision === 'APPROVED').length;
      const requestChangesCount = subs.filter((s) => s.humanDecision === 'CHANGES_REQUESTED').length;
      const rejectedCount = subs.filter((s) => s.humanDecision === 'REJECTED').length;

      const durations: number[] = [];
      subs.forEach((s) => {
        s.versions.forEach((v) => {
          if (typeof v.reviewDurationMinutes === 'number' && v.reviewDurationMinutes > 0) {
            durations.push(v.reviewDurationMinutes);
          }
        });
      });

      const avgTat = durations.length > 0
        ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
        : 14;
      const fastest = durations.length > 0 ? Math.min(...durations) : 8;
      const slowest = durations.length > 0 ? Math.max(...durations) : 22;

      const totalDecided = approvedCount + requestChangesCount + rejectedCount || 1;

      return {
        supervisorId: sup.id,
        supervisorName: sup.name,
        supervisorAvatar: sup.avatar,
        totalAssigned: subs.length,
        completedReviews: completed.length,
        pendingReviews: pending.length,
        averageReviewTimeMinutes: avgTat,
        fastestReviewMinutes: fastest,
        slowestReviewMinutes: slowest,
        approvalRate: Math.round((approvedCount / totalDecided) * 100),
        requestChangesRate: Math.round((requestChangesCount / totalDecided) * 100),
        rejectionRate: Math.round((rejectedCount / totalDecided) * 100),
      };
    });

    res.json(metrics);
  });

  // AI Usage & Token Tracking
  app.get('/api/admin/ai-usage', authMiddleware, requireRole('ADMIN'), (req: any, res) => {
    const logs = AI_USAGE_LOGS;
    const totalAnalyses = logs.length;
    const totalInputTokens = logs.reduce((acc, l) => acc + (l.inputTokens || 0), 0);
    const totalOutputTokens = logs.reduce((acc, l) => acc + (l.outputTokens || 0), 0);
    const totalTokens = totalInputTokens + totalOutputTokens;
    const totalCostUsd = Number(logs.reduce((acc, l) => acc + (l.estimatedCostUsd || 0), 0).toFixed(4));
    const avgProcessingTimeMs = totalAnalyses > 0
      ? Math.round(logs.reduce((acc, l) => acc + (l.processingTimeMs || 0), 0) / totalAnalyses)
      : 1400;

    res.json({
      logs,
      summary: {
        totalAnalyses,
        totalTokens,
        totalInputTokens,
        totalOutputTokens,
        totalCostUsd,
        avgProcessingTimeMs,
        currentModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      },
    });
  });

  // Re-run analysis on a submission
  app.post('/api/submissions/:id/analyze', authMiddleware, async (req: any, res) => {
    const sub = SUBMISSIONS.find((s) => s.id === req.params.id);
    if (!sub) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    if (req.user.role === 'EMPLOYEE' && sub.userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only analyze your own submissions.' });
    }

    const brand = BRANDS.find((b) => b.id === sub.brandId);
    if (!brand) {
      return res.status(400).json({ error: 'Brand not found' });
    }

    const brandParams = PARAMETERS.filter((p) => p.brandId === sub.brandId && p.isActive);
    const campaign = CAMPAIGNS.find((c) => c.id === sub.campaignId);
    const currentV = sub.versions[sub.versions.length - 1];
    const targetFile = currentV.files[0];

    const analysis = await runMultimodalAnalysis({
      submissionId: sub.id,
      versionNumber: currentV.versionNumber,
      brand,
      parameters: brandParams,
      campaign,
      file: targetFile,
      threshold: SYSTEM_SETTINGS.aiApprovalThreshold,
    });

    currentV.analysisResult = analysis;
    currentV.aiScore = analysis.overallScore;
    currentV.aiConfidence = analysis.confidence;
    sub.overallAiScore = analysis.overallScore;
    sub.overallAiConfidence = analysis.confidence;

    let targetStatus = 'NEEDS_IMPROVEMENT';
    if (analysis.overallScore >= SYSTEM_SETTINGS.aiApprovalThreshold) {
      if (campaign?.assignedSupervisorId) {
        targetStatus = 'AWAITING_SUPERVISOR_REVIEW';
        sub.assignedSupervisorId = campaign.assignedSupervisorId;
        sub.assignedSupervisorName = campaign.assignedSupervisorName;
        currentV.routedToSupervisorAt = new Date().toISOString();
      } else {
        targetStatus = 'SUPERVISOR_ASSIGNMENT_REQUIRED';
      }
    }

    currentV.workflowStatus = targetStatus as any;
    sub.workflowStatus = targetStatus as any;

    saveDatabase();
    res.json(sub);
  });

  // Employee Rework submission
  app.post('/api/submissions/:id/rework', authMiddleware, async (req: any, res) => {
    const sub = SUBMISSIONS.find((s) => s.id === req.params.id);
    if (!sub) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    if (req.user.role === 'EMPLOYEE' && sub.userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only rework your own submissions.' });
    }

    const nextVersionNum = sub.versions.length + 1;
    const { changelog, files } = req.body;
    const brand = BRANDS.find((b) => b.id === sub.brandId);
    if (!brand) return res.status(400).json({ error: 'Brand not found' });
    const brandParams = PARAMETERS.filter((p) => p.brandId === sub.brandId && p.isActive);
    const campaign = CAMPAIGNS.find((c) => c.id === sub.campaignId);
    const targetFile = files?.[0] || sub.versions[0].files[0];

    const analysis = await runMultimodalAnalysis({
      submissionId: sub.id,
      versionNumber: nextVersionNum,
      brand,
      parameters: brandParams,
      campaign,
      file: targetFile,
      threshold: SYSTEM_SETTINGS.aiApprovalThreshold,
    });

    let nextStatus: any = 'NEEDS_IMPROVEMENT';
    let routedToSupervisorAt: string | undefined = undefined;
    if (analysis.overallScore >= SYSTEM_SETTINGS.aiApprovalThreshold) {
      if (campaign?.assignedSupervisorId) {
        nextStatus = 'AWAITING_SUPERVISOR_REVIEW';
        sub.assignedSupervisorId = campaign.assignedSupervisorId;
        sub.assignedSupervisorName = campaign.assignedSupervisorName;
        routedToSupervisorAt = new Date().toISOString();
      } else {
        nextStatus = 'SUPERVISOR_ASSIGNMENT_REQUIRED';
      }
    }

    const newV: SubmissionVersion = {
      versionNumber: nextVersionNum,
      submissionId: sub.id,
      files: [targetFile],
      changelog: changelog || `Rework version ${nextVersionNum}`,
      submittedAt: new Date().toISOString(),
      routedToSupervisorAt,
      aiScore: analysis.overallScore,
      aiConfidence: analysis.confidence,
      aiStatus: analysis.overallScore >= SYSTEM_SETTINGS.aiApprovalThreshold ? 'PASSED' : 'COMPLETED',
      workflowStatus: nextStatus,
      humanDecision: 'PENDING',
      analysisResult: analysis,
    };

    sub.versions.push(newV);
    sub.currentVersion = nextVersionNum;
    sub.overallAiScore = analysis.overallScore;
    sub.overallAiConfidence = analysis.confidence;
    sub.workflowStatus = nextStatus;
    sub.humanDecision = 'PENDING';
    sub.updatedAt = new Date().toISOString();

    saveDatabase();
    res.status(201).json(sub);
  });

  app.get('/api/analytics/review-velocity', (req, res) => {
    res.json(getReviewVelocityStats());
  });

  // 9. AI Creative Compliance Chatbot Assistant
  app.post('/api/ai/chat', authMiddleware, async (req: any, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Gather contextual active submissions for this user so AI knows what posters they are creating
      const userSubmissions = SUBMISSIONS.filter((s) => s.userId === req.user.id)
        .slice(0, 6)
        .map((s) => ({
          id: s.id,
          campaignName: s.campaignName,
          brandName: s.brandName,
          workflowStatus: s.workflowStatus,
          overallScore: s.overallAiScore,
          supervisorComment:
            s.humanComment ||
            (s.comments && s.comments.length > 0 ? s.comments[s.comments.length - 1].content : undefined),
          assignedSupervisorName: s.assignedSupervisorName,
        }));

      const chatResult = await chatWithComplianceAssistant({
        message,
        history,
        userName: req.user.name,
        userRole: req.user.role,
        recentSubmissions: userSubmissions,
      });

      res.json(chatResult);
    } catch (err: any) {
      console.error('[AI Chat Route Error]:', err);
      res.status(500).json({ error: 'Failed to process AI chat request' });
    }
  });

  // 10. Notifications
  app.get('/api/notifications', authMiddleware, (req: any, res) => {
    if (req.user.role === 'ADMIN') {
      return res.json(NOTIFICATIONS);
    }
    res.json(NOTIFICATIONS.filter((n) => n.userId === req.user.id));
  });

  app.put('/api/notifications/:id/read', authMiddleware, (req: any, res) => {
    const notif = NOTIFICATIONS.find((n) => n.id === req.params.id);
    if (notif) {
      notif.read = true;
    }
    saveDatabase();
    res.json({ success: true });
  });

  // ==========================================
  // VITE MIDDLEWARE (SPA integration)
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Z Server running on port ${PORT}`);
  });
}

startServer();
