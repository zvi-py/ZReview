import React, { useState, useEffect } from 'react';
import { Campaign, Brand, BrandParameter, BrandToolkit, User } from '../types';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { BrandToolkitEditor } from './BrandToolkitEditor';
import {
  CalendarPlus,
  Building2,
  FolderKanban,
  Plus,
  Trash2,
  CheckCircle2,
  Zap,
  Sliders,
  ShieldCheck,
  AlertCircle,
  Tag,
  Clock,
  Layers,
  FileCheck,
  Palette,
  Type,
  UserCheck,
} from 'lucide-react';

interface AdminProjectManagementProps {
  onProjectCreated?: () => void;
}

interface NewGuidelineItem {
  id: string;
  name: string;
  category: string;
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  weight: number;
  passThreshold: number;
  instructions: string;
  passCriteria: string;
}

export const AdminProjectManagement: React.FC<AdminProjectManagementProps> = ({
  onProjectCreated,
}) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [parameters, setParameters] = useState<BrandParameter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'add'>('list');

  // Form state
  const { currentUser } = useAuth();
  const [supervisors, setSupervisors] = useState<User[]>([]);
  const [assignedSupervisorId, setAssignedSupervisorId] = useState('usr-101');
  const [projectName, setProjectName] = useState('');
  const [brandId, setBrandId] = useState('');
  const [customBrandName, setCustomBrandName] = useState('');
  const [product, setProduct] = useState('');
  const [campaignType, setCampaignType] = useState('Product Launch');
  const [region, setRegion] = useState('Global');
  const [targetAudience, setTargetAudience] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10)
  );
  const [description, setDescription] = useState('');

  // Guidelines state
  const [brandToolkit, setBrandToolkit] = useState<BrandToolkit>({
    colorTheme: {
      primary: '#0F172A',
      secondary: '#ff5000',
      darkBackground: '#0A0F1D',
      lightBackground: '#FFFFFF',
      prohibitedColors: ['#FF007A', '#00FF66'],
    },
    allowedFonts: ['Inter', 'Montserrat', 'Syne'],
    typographySpecs: {
      minHeadingPx: 28,
      minBodyPx: 14,
      allowedHierarchy: [
        'H1: Bold Brand Display (>=28px)',
        'H2: Section Subhead (>=20px)',
        'Body: Legible Regular (>=14px)',
        'Legal: Monospace or Sans (>=11px)',
      ],
    },
    safeMargins: {
      topPx: 48,
      bottomPx: 48,
      sidesPx: 48,
      dangerZoneBufferPercent: 5,
    },
    disclaimerTemplate:
      'Approved by Competent Authority. All rights reserved. Terms and conditions apply.',
    socialSpecs: [
      { format: '4:5 Feed Portrait', width: 1080, height: 1350, maxTextDensityPercent: 20 },
      { format: '9:16 Story / Reel', width: 1080, height: 1920, maxTextDensityPercent: 15 },
      { format: '1:1 Square Post', width: 1080, height: 1080, maxTextDensityPercent: 20 },
    ],
  });

  const [guidelines, setGuidelines] = useState<NewGuidelineItem[]>([
    {
      id: 'g-1',
      name: 'Logo Placement & Safe Zone Clearance',
      category: 'LOGO',
      type: 'SPATIAL',
      severity: 'CRITICAL',
      weight: 25,
      passThreshold: 85,
      instructions: 'Verify brand logo is located in top quadrant with at least 5% clearance from all canvas boundaries.',
      passCriteria: 'Logo is sharp, correctly oriented, and maintains minimum 5% safe margin.',
    },
    {
      id: 'g-2',
      name: 'Corporate Color Palette Compliance',
      category: 'COLOR_PALETTE',
      type: 'COLOR',
      severity: 'HIGH',
      weight: 25,
      passThreshold: 80,
      instructions: 'Verify compliance with official brand color codes. Prohibit unapproved neon tints.',
      passCriteria: 'Dominant colors match designated hex specifications.',
    },
    {
      id: 'g-3',
      name: 'Mandatory Legal Disclaimers & Sign-Off',
      category: 'DISCLAIMER',
      type: 'TEXT',
      severity: 'HIGH',
      weight: 25,
      passThreshold: 85,
      instructions: 'Ensure official team sign-off, copyright attribution, and regional disclaimers are present.',
      passCriteria: 'Exact legal attribution text clearly legible in footer.',
    },
    {
      id: 'g-4',
      name: 'Call To Action (CTA) & Verified Contact Coordinates',
      category: 'CTA',
      type: 'TEXT',
      severity: 'HIGH',
      weight: 25,
      passThreshold: 80,
      instructions: 'Confirm official website URL, inquiry phone hotline, or action button styling.',
      passCriteria: 'Prominent CTA with valid contact details.',
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [cList, bList, pList, supList] = await Promise.all([
        api.getCampaigns(),
        api.getBrands(),
        api.getParameters(),
        api.getSupervisors().catch(() => []),
      ]);
      setCampaigns(cList);
      setBrands(bList);
      setParameters(pList);
      setSupervisors(supList);
      if (supList.length > 0 && !assignedSupervisorId) {
        setAssignedSupervisorId(supList[0].id);
      }
      if (bList.length > 0 && !brandId) {
        setBrandId(bList[0].id);
      }
    } catch (err) {
      console.error('Failed to load project management data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReassignSupervisor = async (campaignId: string, supervisorId: string) => {
    try {
      const updated = await api.assignSupervisorToCampaign(
        campaignId,
        supervisorId,
        currentUser?.id,
        currentUser?.name
      );
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaignId
            ? {
                ...c,
                assignedSupervisorId: updated.assignedSupervisorId,
                assignedSupervisorName: updated.assignedSupervisorName,
              }
            : c
        )
      );
      setStatusMessage({
        type: 'success',
        text: `Assigned supervisor ${updated.assignedSupervisorName} to project "${updated.name}". All eligible submissions routed to their review queue.`,
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to reassign supervisor',
      });
    }
  };

  const handleAddGuideline = () => {
    const newItem: NewGuidelineItem = {
      id: `g-${Date.now()}`,
      name: 'New Guideline Parameter',
      category: 'BRAND_COMPLIANCE',
      type: 'TEXT',
      severity: 'HIGH',
      weight: 15,
      passThreshold: 80,
      instructions: 'Specify requirements for AI multimodal grading.',
      passCriteria: 'Define passing conditions.',
    };
    setGuidelines([...guidelines, newItem]);
  };

  const handleRemoveGuideline = (id: string) => {
    setGuidelines(guidelines.filter((g) => g.id !== id));
  };

  const handleUpdateGuideline = (id: string, field: keyof NewGuidelineItem, value: any) => {
    setGuidelines(
      guidelines.map((g) => (g.id === id ? { ...g, [field]: value } : g))
    );
  };

  const handleLoadPreset = (preset: 'apex' | 'nova' | 'lumina' | 'nmc' | 'tech' | 'retail') => {
    if (preset === 'apex' || preset === 'tech') {
      setBrandId('brand-apex');
      setProjectName('Apex Sovereign AI & Cloud Clusters 2026');
      setProduct('H200 Tensor Core Superclusters & Sovereign Infrastructure');
      setCampaignType('Global Keynote & Social Campaign');
      setRegion('North America, EMEA & Asia');
      setTargetAudience('Chief Information Officers, AI Architects, Enterprise Cloud Leaders');
      setDescription('Flagship campaign promoting sovereign high-throughput AI cluster availability.');
      setBrandToolkit({
        colorTheme: {
          primary: '#050814',
          secondary: '#00F2FE',
          darkBackground: '#0B132B',
          lightBackground: '#FFFFFF',
          prohibitedColors: ['#DC2626', '#FF007A'],
        },
        allowedFonts: ['Plus Jakarta Sans', 'Space Grotesk', 'Inter'],
        typographySpecs: {
          minHeadingPx: 32,
          minBodyPx: 14,
          allowedHierarchy: ['H1: Display Headline', 'H2: Subhead', 'Body: Regular', 'Legal: 11px'],
        },
        safeMargins: {
          topPx: 56,
          bottomPx: 56,
          sidesPx: 48,
          dangerZoneBufferPercent: 6,
        },
        disclaimerTemplate: 'Apex Global Technologies Inc. All rights reserved. Sovereign Cloud Certified.',
        socialSpecs: [
          { format: '4:5 Feed Portrait', width: 1080, height: 1350, maxTextDensityPercent: 20 },
          { format: '9:16 Story / Reel', width: 1080, height: 1920, maxTextDensityPercent: 15 },
        ],
      });
      setGuidelines([
        {
          id: 'g-apex-1',
          name: 'Apex Prism Brand Mark Integrity',
          category: 'LOGO',
          type: 'SPATIAL',
          severity: 'CRITICAL',
          weight: 25,
          passThreshold: 85,
          instructions: 'Verify official Apex geometric prism in top quadrant with 6% safe zone margin.',
          passCriteria: 'Logo glyph must be unclipped with intact aspect ratio.',
        },
        {
          id: 'g-apex-2',
          name: 'Obsidian & Cyber Cyan Palette (#050814 & #00F2FE)',
          category: 'COLOR_PALETTE',
          type: 'COLOR',
          severity: 'HIGH',
          weight: 25,
          passThreshold: 80,
          instructions: 'Ensure obsidian dark canvas with cyan vector mesh accents. Disallow unauthorized saturated pinks.',
          passCriteria: 'Palette harmonizes with corporate color tokens.',
        },
        {
          id: 'g-apex-3',
          name: 'Verified Technical Benchmark Claims',
          category: 'BRAND_COMPLIANCE',
          type: 'TEXT',
          severity: 'HIGH',
          weight: 25,
          passThreshold: 85,
          instructions: 'Ensure computing performance claims (128 PFLOPS, 99.999% SLA) match verified cluster specs.',
          passCriteria: 'Verified statistics present and confirmed.',
        },
        {
          id: 'g-apex-4',
          name: 'Santiago Orange Action CTA Pill',
          category: 'CTA',
          type: 'TEXT',
          severity: 'HIGH',
          weight: 25,
          passThreshold: 80,
          instructions: 'Verify high-contrast registration CTA button and valid portal URL.',
          passCriteria: 'Prominent CTA with telephone helpline (+1 800-490-APEX).',
        },
      ]);
    } else if (preset === 'nova' || preset === 'retail') {
      setBrandId('brand-nova');
      setProjectName('Nova Apex Gran Turismo World Premiere');
      setProduct('Autonomous Electric Gran Turismo Hyper-Sedan');
      setCampaignType('Product Launch & Digital Out-of-Home');
      setRegion('Global');
      setTargetAudience('Performance EV Buyers, Sustainable Luxury Enthusiasts');
      setDescription('Unveiling of the 840-mile solid-state battery autonomous gran turismo.');
      setBrandToolkit({
        colorTheme: {
          primary: '#0F172A',
          secondary: '#10B981',
          darkBackground: '#020617',
          lightBackground: '#F8FAFC',
          prohibitedColors: ['#FF007A', '#F59E0B'],
        },
        allowedFonts: ['Plus Jakarta Sans', 'Space Grotesk', 'Inter'],
        typographySpecs: {
          minHeadingPx: 30,
          minBodyPx: 13,
          allowedHierarchy: ['H1: Model Name', 'H2: Specs', 'Body: Sans', 'Legal: 11px'],
        },
        safeMargins: {
          topPx: 48,
          bottomPx: 48,
          sidesPx: 48,
          dangerZoneBufferPercent: 5,
        },
        disclaimerTemplate: 'Nova Mobility Labs Inc. Zero-Emission Autonomous Powertrain.',
        socialSpecs: [
          { format: '4:5 Feed Portrait', width: 1080, height: 1350, maxTextDensityPercent: 20 },
        ],
      });
      setGuidelines([
        {
          id: 'g-nova-1',
          name: 'Nova Orbital Logo Integrity',
          category: 'LOGO',
          type: 'SPATIAL',
          severity: 'CRITICAL',
          weight: 25,
          passThreshold: 85,
          instructions: 'Verify dual orbital pulse mark is intact and unscaled.',
          passCriteria: 'Logo undamaged in approved quadrant.',
        },
        {
          id: 'g-nova-2',
          name: 'Aerodynamic Speed Streamline Quality',
          category: 'VISUAL_QUALITY',
          type: 'IMAGE',
          severity: 'HIGH',
          weight: 25,
          passThreshold: 80,
          instructions: 'Ensure dynamic cyan/emerald streamlines with smooth vector curves.',
          passCriteria: 'Crisp vector rendering without banding.',
        },
      ]);
    } else if (preset === 'lumina' || preset === 'nmc') {
      setBrandId('brand-lumina');
      setProjectName('Lumina Precision Biomarker Discovery');
      setProduct('Phase III Targeted Immunotherapy Program');
      setCampaignType('Clinical & Medical Announcement');
      setRegion('Global');
      setTargetAudience('Oncologists, Clinical Research Organizations');
      setDescription('Patient cohort enrollment campaign for multimodal oncology discovery.');
      setBrandToolkit({
        colorTheme: {
          primary: '#F8FAFC',
          secondary: '#0284C7',
          darkBackground: '#0F172A',
          lightBackground: '#FFFFFF',
          prohibitedColors: ['#DC2626', '#9333EA'],
        },
        allowedFonts: ['Plus Jakarta Sans', 'Inter'],
        typographySpecs: {
          minHeadingPx: 28,
          minBodyPx: 13,
          allowedHierarchy: ['H1: Clinical Heading', 'H2: Trial Phase', 'Body: Body', 'Legal: 11px'],
        },
        safeMargins: {
          topPx: 48,
          bottomPx: 48,
          sidesPx: 48,
          dangerZoneBufferPercent: 6,
        },
        disclaimerTemplate: 'Lumina Health Sciences. FDA Fast-Track Approved.',
        socialSpecs: [
          { format: '4:5 Feed Portrait', width: 1080, height: 1350, maxTextDensityPercent: 20 },
        ],
      });
      setGuidelines([
        {
          id: 'g-lum-1',
          name: 'Lumina Starburst Crest Placement',
          category: 'LOGO',
          type: 'SPATIAL',
          severity: 'CRITICAL',
          weight: 25,
          passThreshold: 85,
          instructions: 'Verify luminescent starburst crest in upper quadrant.',
          passCriteria: 'Logo centered within safe margins.',
        },
        {
          id: 'g-lum-2',
          name: 'Clinical Trial Identifier Registry',
          category: 'BRAND_COMPLIANCE',
          type: 'TEXT',
          severity: 'HIGH',
          weight: 25,
          passThreshold: 85,
          instructions: 'Ensure FDA Phase III study identifier and trial enrollment URL are present.',
          passCriteria: 'Study code verified by OCR.',
        },
      ]);
    } else if (preset === 'tech') {
      setBrandId('brand-nmctech');
      setProjectName('H200 Superchip Cluster Availability Q4');
      setProduct('NVIDIA H200 High Performance AI Compute Nodes');
      setCampaignType('Hardware Product Launch');
      setRegion('Middle East & Global');
      setTargetAudience('Enterprise AI Labs, Data Centers & Compute Buyers');
      setDescription('Announcement of H200 server lot availability for immediate procurement.');
      setBrandToolkit({
        colorTheme: {
          primary: '#00F0FF',
          secondary: '#7000FF',
          darkBackground: '#0F172A',
          lightBackground: '#F8FAFC',
          prohibitedColors: ['#FF1493', '#39FF14'],
        },
        allowedFonts: ['Space Grotesk', 'Inter', 'Outfit'],
        typographySpecs: {
          minHeadingPx: 30,
          minBodyPx: 13,
          allowedHierarchy: ['H1: Cyber Display', 'H2: Specs Header', 'Body: Tech Monospace/Sans', 'Legal: 10px'],
        },
        safeMargins: {
          topPx: 48,
          bottomPx: 48,
          sidesPx: 48,
          dangerZoneBufferPercent: 5,
        },
        disclaimerTemplate: 'Available: Ex Works Abu Dhabi • Hardware subject to export license compliance.',
        socialSpecs: [
          { format: '4:5 Feed Portrait', width: 1080, height: 1350, maxTextDensityPercent: 20 },
          { format: '1:1 Square Post', width: 1080, height: 1080, maxTextDensityPercent: 20 },
        ],
      });
      setGuidelines([
        {
          id: 'g-t-1',
          name: 'Hardware Specifications Accuracy',
          category: 'PRODUCT_VISIBILITY',
          type: 'CATEGORICAL',
          severity: 'CRITICAL',
          weight: 30,
          passThreshold: 85,
          instructions: 'Verify 8x NVIDIA H200 GPUs (141GB SXM) and Dual Xeon specifications.',
          passCriteria: 'All technical specifications accurately cataloged in specs grid.',
        },
        {
          id: 'g-t-2',
          name: 'Procurement Hotline & Direct Email',
          category: 'CTA',
          type: 'TEXT',
          severity: 'HIGH',
          weight: 25,
          passThreshold: 85,
          instructions: 'Verify phone +1-978-225-0565 and compute@nmctech.cloud coordinates.',
          passCriteria: 'Hotline and email clearly formatted in high-contrast pill.',
        },
        {
          id: 'g-t-3',
          name: 'Ex Works Abu Dhabi Location Disclaimer',
          category: 'DISCLAIMER',
          type: 'TEXT',
          severity: 'HIGH',
          weight: 25,
          passThreshold: 80,
          instructions: 'Verify "AVAILABLE: EX WORKS ABU DHABI" banner and shipping asterisk.',
          passCriteria: 'Logistics terms clearly visible.',
        },
        {
          id: 'g-t-4',
          name: 'Cyber Dark Contrast & Neon Cyan Accents',
          category: 'COLOR_PALETTE',
          type: 'COLOR',
          severity: 'MEDIUM',
          weight: 20,
          passThreshold: 80,
          instructions: 'Ensure deep charcoal background (#0F172A) with cyan (#00F0FF) text accents.',
          passCriteria: 'Passes WCAG AA high contrast on dark background.',
        },
      ]);
    } else {
      setBrandId('brand-samsung-belagavi');
      setProjectName('Galaxy Mega Fest Belagavi 2026');
      setProduct('Galaxy S26 Ultra & Fold Series');
      setCampaignType('Retail Promotion & In-Store Traffic');
      setRegion('Belagavi, Karnataka');
      setTargetAudience('Smartphone Upgraders, Students & Regional Shoppers');
      setDescription('Retail store price drop announcement and free accessory bundle campaign.');
      setGuidelines([
        {
          id: 'g-r-1',
          name: 'Authorized Samsung Experience Store Header',
          category: 'LOGO',
          type: 'TEXT',
          severity: 'CRITICAL',
          weight: 30,
          passThreshold: 85,
          instructions: 'Verify official Samsung typography and Experience Store badge.',
          passCriteria: 'Official store header matches brand guidelines.',
        },
        {
          id: 'g-r-2',
          name: 'Store Address & Directions QR Code',
          category: 'CTA',
          type: 'SPATIAL',
          severity: 'HIGH',
          weight: 25,
          passThreshold: 80,
          instructions: 'Check Khanapur Road address, landmark Bell Electronics, and functional QR code.',
          passCriteria: 'QR code is high-resolution with accompanying telephone hotline.',
        },
        {
          id: 'g-r-3',
          name: 'Price Drop Promotional Header & Urgency',
          category: 'TYPOGRAPHY',
          type: 'TEXT',
          severity: 'HIGH',
          weight: 25,
          passThreshold: 80,
          instructions: 'Check "PRICE DROPS ARE HERE" angular metallic text styling.',
          passCriteria: 'Promotional headline creates high retail impact.',
        },
        {
          id: 'g-r-4',
          name: 'Warranty & Genuine Accessory Disclaimer',
          category: 'DISCLAIMER',
          type: 'TEXT',
          severity: 'MEDIUM',
          weight: 20,
          passThreshold: 75,
          instructions: 'Verify "100% Genuine Samsung Products • Brand Warranty" badge.',
          passCriteria: 'Consumer trust indicator present at base of creative.',
        },
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setStatusMessage({ type: 'error', text: 'Project Name is required.' });
      return;
    }

    let targetBrandId = brandId;
    if (brandId === 'NEW_BRAND') {
      if (!customBrandName.trim()) {
        setStatusMessage({ type: 'error', text: 'Please specify the new brand name.' });
        return;
      }
      try {
        const newB = await api.createBrand({
          name: customBrandName.trim(),
          description: `Brand for project ${projectName}`,
          isActive: true,
          logo: '/assets/posters/nmc-independence.svg',
          colorPalette: {
            primary: '#0F172A',
            secondary: '#ff5000',
            forbidden: ['#FF007A'],
          },
          typography: {
            primaryFont: 'Inter',
            minHeadingSize: '24px',
            minBodySize: '14px',
            rules: ['Maintain logo safe margins', 'Use approved corporate typography'],
          },
        } as any);
        targetBrandId = newB.id;
        setBrands((prev) => [newB, ...prev]);
      } catch (err: any) {
        setStatusMessage({ type: 'error', text: `Failed to create new brand: ${err.message}` });
        return;
      }
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const payload = {
        campaign: {
          brandId: targetBrandId,
          name: projectName.trim(),
          product: product.trim() || projectName.trim(),
          campaignType: campaignType.trim(),
          region: region.trim() || 'Global',
          targetAudience: targetAudience.trim() || 'General Audience',
          description: description.trim(),
          startDate,
          endDate,
          active: true,
          assignedSupervisorId,
          assignedSupervisorName:
            supervisors.find((s) => s.id === assignedSupervisorId)?.name || 'Marcus Vance',
        },
        guidelines: guidelines.map((g) => ({
          brandId: targetBrandId,
          name: g.name,
          category: g.category,
          type: g.type,
          severity: g.severity,
          weight: Number(g.weight),
          passThreshold: Number(g.passThreshold),
          isRequired: true,
          isActive: true,
          instructions: g.instructions,
          passCriteria: g.passCriteria,
        })),
      };

      await api.createCampaignWithGuidelines(payload);

      // Persist the brand toolkit (colors, allowed fonts, safe margins, legal disclaimer)
      try {
        await api.updateBrandToolkit(targetBrandId, {
          toolkit: brandToolkit,
          colorPalette: {
            primary: brandToolkit.colorTheme.primary,
            secondary: brandToolkit.colorTheme.secondary,
            forbidden: brandToolkit.colorTheme.prohibitedColors,
          },
          typography: {
            primaryFont: brandToolkit.allowedFonts[0] || 'Inter',
            minHeadingSize: `${brandToolkit.typographySpecs.minHeadingPx}px`,
            minBodySize: `${brandToolkit.typographySpecs.minBodyPx}px`,
            rules: brandToolkit.allowedFonts.map((f) => `Approved font family: ${f}`),
          },
        });
      } catch (tkErr) {
        console.warn('Brand toolkit update warning:', tkErr);
      }

      await loadData();

      setStatusMessage({
        type: 'success',
        text: `Successfully published project "${projectName}" with ${guidelines.length} AI brand guidelines!`,
      });

      // Reset form
      setProjectName('');
      setDescription('');
      setProduct('');
      setViewMode('list');

      if (onProjectCreated) {
        onProjectCreated();
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to publish upcoming project and guidelines.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalWeight = guidelines.reduce((sum, g) => sum + (Number(g.weight) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#ff5000]">
              [ GOVERNANCE &bull; STRATEGY ]
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-xs font-space font-semibold text-slate-500">
              Admin Project &amp; Rules Architect
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-syne text-slate-900 tracking-tight">
            Upcoming Projects &amp; Brand Guidelines
          </h2>
          <p className="text-xs text-slate-500 font-sans max-w-2xl">
            Register new upcoming projects, define campaign scopes, and establish mandatory AI compliance parameters that every employee poster must pass before deployment.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'add' ? 'list' : 'add')}
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold font-syne shadow-md transition-all cursor-pointer ${
              viewMode === 'add'
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-[#ff5000] text-white hover:bg-[#e04600] shadow-[#ff5000]/25'
            }`}
          >
            {viewMode === 'add' ? (
              <>
                <FolderKanban className="h-4 w-4" />
                <span>View All Projects ({campaigns.length})</span>
              </>
            ) : (
              <>
                <CalendarPlus className="h-4 w-4" />
                <span>+ Add Upcoming Project &amp; Rules</span>
              </>
            )}
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`flex items-center gap-3 rounded-2xl p-4 text-xs font-medium shadow-xs ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          )}
          <span className="font-sans font-semibold">{statusMessage.text}</span>
        </div>
      )}

      {/* ==================== VIEW MODE: ADD PROJECT & GUIDELINES FORM ==================== */}
      {viewMode === 'add' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quick Presets Bar */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold font-syne text-slate-800">
              <Zap className="h-4 w-4 text-[#ff5000]" />
              <span>Quick Project Presets:</span>
              <span className="text-[11px] font-normal text-slate-500 font-sans hidden md:inline">
                (Instantly populate recommended project guidelines)
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleLoadPreset('apex')}
                className="rounded-lg border border-slate-200 bg-white hover:bg-slate-900 hover:text-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                Apex Cloud Preset
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset('nova')}
                className="rounded-lg border border-slate-200 bg-white hover:bg-slate-900 hover:text-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                Nova EV Preset
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset('lumina')}
                className="rounded-lg border border-slate-200 bg-white hover:bg-slate-900 hover:text-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                Lumina Health Preset
              </button>
            </div>
          </div>

          {/* Section 1: Project Metadata */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-space font-bold uppercase tracking-wider text-slate-400">
                STEP 01 / PROJECT DETAILS
              </span>
              <h3 className="text-base font-bold font-syne text-slate-900">
                General Project &amp; Campaign Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold font-space text-slate-700">
                  Project Name <span className="text-[#ff5000]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Global AI Innovation Summit"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-sans text-slate-900 placeholder-slate-400 focus:border-[#ff5000] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold font-space text-slate-700">
                  Associated Brand <span className="text-[#ff5000]">*</span>
                </label>
                <select
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-space font-bold text-slate-900 focus:border-[#ff5000] focus:outline-none cursor-pointer"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                  <option value="NEW_BRAND">+ Create New Brand...</option>
                </select>
              </div>

              {brandId === 'NEW_BRAND' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-space text-[#ff5000]">
                    New Brand Name <span className="text-[#ff5000]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Innovations"
                    value={customBrandName}
                    onChange={(e) => setCustomBrandName(e.target.value)}
                    className="w-full rounded-xl border border-[#ff5000] bg-orange-50/20 px-3.5 py-2.5 text-xs font-sans text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold font-space text-slate-700">
                  Product or Service Focus
                </label>
                <input
                  type="text"
                  placeholder="e.g. Multimodal Governance Platform"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-sans text-slate-900 placeholder-slate-400 focus:border-[#ff5000] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold font-space text-slate-700">Campaign Type</label>
                <input
                  type="text"
                  placeholder="e.g. Brand Awareness, Lead Gen"
                  value={campaignType}
                  onChange={(e) => setCampaignType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-sans text-slate-900 placeholder-slate-400 focus:border-[#ff5000] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold font-space text-slate-700">Target Region</label>
                <input
                  type="text"
                  placeholder="e.g. India &amp; Global"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-sans text-slate-900 placeholder-slate-400 focus:border-[#ff5000] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold font-space text-slate-700">Target Audience</label>
                <input
                  type="text"
                  placeholder="e.g. Enterprise CTOs, Institutional Leaders"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-sans text-slate-900 placeholder-slate-400 focus:border-[#ff5000] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold font-space text-slate-700">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-space text-slate-900 focus:border-[#ff5000] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold font-space text-slate-700">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-space text-slate-900 focus:border-[#ff5000] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold font-space text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-[#ff5000]" />
                    <span>Assigned Review Supervisor (Sign-Off Authority)</span>
                  </span>
                  <span className="text-[10px] text-[#ff5000] font-medium">Auto-Routes &ge;85% Audits</span>
                </label>
                <select
                  value={assignedSupervisorId}
                  onChange={(e) => setAssignedSupervisorId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-space font-medium text-slate-900 focus:border-[#ff5000] focus:bg-white focus:outline-none cursor-pointer"
                >
                  {supervisors.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.department || 'Supervisor'} ({s.email})
                    </option>
                  ))}
                  {supervisors.length === 0 && (
                    <option value="usr-101">Marcus Vance — Brand Compliance (supervisor@zarvis.ai)</option>
                  )}
                </select>
                <p className="text-[11px] font-sans text-slate-400">
                  Approved submissions &ge;85% for this campaign will automatically route to this supervisor's review queue.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold font-space text-slate-700">
                Strategic Description &amp; Objectives
              </label>
              <textarea
                rows={2}
                placeholder="Provide creative brief, core messaging pillars, and target milestones..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-sans text-slate-900 placeholder-slate-400 focus:border-[#ff5000] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Color Theme & Allowed Brand Toolkit */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-space font-bold uppercase tracking-wider text-[#ff5000]">
                  STEP 02 / COLOR THEME &amp; BRAND TOOLKIT
                </span>
                <h3 className="text-base font-bold font-syne text-slate-900">
                  Allowed Fonts, Color Palettes, Safe Margins &amp; Legal Disclaimers
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  Define the exact design system tool kit for posters assigned under this project.
                </p>
              </div>
            </div>

            <BrandToolkitEditor
              brandId={brandId === 'NEW_BRAND' ? undefined : brandId}
              brandName={brandId === 'NEW_BRAND' ? customBrandName || 'New Brand' : (brands.find((b) => b.id === brandId)?.name || 'Project Brand')}
              initialToolkit={brandToolkit}
              onChange={(updated) => setBrandToolkit(updated)}
              isInlineForm={true}
            />
          </div>

          {/* Section 3: Important Guidelines & AI Compliance Rules */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <span className="text-[10px] font-space font-bold uppercase tracking-wider text-[#ff5000]">
                  STEP 03 / AI COMPLIANCE PARAMETERS
                </span>
                <h3 className="text-base font-bold font-syne text-slate-900">
                  Important Brand Guidelines &amp; AI Multimodal Rules ({guidelines.length})
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  The AI automated gate evaluates employee poster submissions against these exact criteria.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-space font-bold ${
                    totalWeight === 100
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  Total Weight: {totalWeight}%
                </span>
                <button
                  type="button"
                  onClick={handleAddGuideline}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-900 hover:text-white px-3.5 py-2 text-xs font-bold font-syne text-slate-800 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Guideline</span>
                </button>
              </div>
            </div>

            {/* Guidelines Builder List */}
            <div className="space-y-4">
              {guidelines.map((g, idx) => (
                <div
                  key={g.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:bg-white hover:border-slate-300 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-[11px] font-space font-bold text-white">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={g.name}
                        onChange={(e) => handleUpdateGuideline(g.id, 'name', e.target.value)}
                        placeholder="Guideline Rule Name..."
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold font-syne text-slate-900 focus:border-[#ff5000] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={g.category}
                        onChange={(e) => handleUpdateGuideline(g.id, 'category', e.target.value)}
                        className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-space font-bold text-slate-800 focus:border-[#ff5000] focus:outline-none cursor-pointer"
                      >
                        <option value="LOGO">LOGO</option>
                        <option value="COLOR_PALETTE">COLOR PALETTE</option>
                        <option value="TYPOGRAPHY">TYPOGRAPHY</option>
                        <option value="DISCLAIMER">DISCLAIMER</option>
                        <option value="CTA">CTA &amp; CONTACT</option>
                        <option value="PRODUCT_VISIBILITY">PRODUCT FOCUS</option>
                        <option value="SAFE_AREA">SAFE AREA</option>
                        <option value="VISUAL_QUALITY">VISUAL QUALITY</option>
                        <option value="BRAND_COMPLIANCE">BRAND COMPLIANCE</option>
                      </select>

                      <select
                        value={g.severity}
                        onChange={(e) => handleUpdateGuideline(g.id, 'severity', e.target.value)}
                        className={`rounded-xl border px-2.5 py-1.5 text-[11px] font-space font-bold uppercase cursor-pointer ${
                          g.severity === 'CRITICAL'
                            ? 'border-red-200 bg-red-50 text-red-700'
                            : g.severity === 'HIGH'
                            ? 'border-amber-200 bg-amber-50 text-amber-700'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <option value="CRITICAL">CRITICAL</option>
                        <option value="HIGH">HIGH</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="LOW">LOW</option>
                      </select>

                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1">
                        <span className="text-[10px] font-space text-slate-500 font-bold">Weight:</span>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={g.weight}
                          onChange={(e) => handleUpdateGuideline(g.id, 'weight', e.target.value)}
                          className="w-12 text-center text-xs font-black font-space text-slate-900 focus:outline-none"
                        />
                        <span className="text-[10px] font-space text-slate-400">%</span>
                      </div>

                      {guidelines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveGuideline(g.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer rounded-lg hover:bg-red-50"
                          title="Delete Guideline"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Instructions & Pass Criteria Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[10px] font-space font-bold uppercase text-slate-500">
                        AI Verification Instructions
                      </label>
                      <input
                        type="text"
                        value={g.instructions}
                        onChange={(e) => handleUpdateGuideline(g.id, 'instructions', e.target.value)}
                        placeholder="What specific elements should the AI detect & verify?"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-sans text-slate-800 placeholder-slate-400 focus:border-[#ff5000] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-space font-bold uppercase text-slate-500">
                        Pass Criteria &amp; Conditions
                      </label>
                      <input
                        type="text"
                        value={g.passCriteria}
                        onChange={(e) => handleUpdateGuideline(g.id, 'passCriteria', e.target.value)}
                        placeholder="What criteria must be satisfied for a 100% score?"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-sans text-slate-800 placeholder-slate-400 focus:border-[#ff5000] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold font-syne text-slate-700 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-[#ff5000] hover:bg-[#e04600] px-6 py-2.5 text-xs font-bold font-syne text-white shadow-md shadow-[#ff5000]/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <FileCheck className="h-4 w-4" />
              <span>{isSubmitting ? 'Publishing Rules...' : 'Publish Upcoming Project & Guidelines'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ==================== VIEW MODE: ALL UPCOMING PROJECTS LIST ==================== */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-syne text-slate-900">Active Upcoming Projects</h3>
              <span className="rounded-full bg-slate-900 text-white px-2.5 py-0.5 text-[10px] font-space font-bold">
                {campaigns.length}
              </span>
            </div>
            <span className="text-xs font-space text-slate-500">
              {parameters.length} Enforced Brand Rules across active projects
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((camp, cIdx) => {
              const brand = brands.find((b) => b.id === camp.brandId);
              const brandParams = parameters.filter((p) => p.brandId === camp.brandId);

              return (
                <div
                  key={`${camp.id}-${cIdx}`}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between transition-all hover:border-[#ff5000] hover:shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-[#ff5000] shrink-0" />
                        <span className="text-xs font-bold font-space text-slate-900 truncate">
                          {brand?.name || camp.brandId}
                        </span>
                      </div>
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-space font-bold text-emerald-700 uppercase">
                        ACTIVE
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold font-syne text-slate-900 leading-snug">
                        {camp.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-sans mt-0.5 leading-relaxed line-clamp-2">
                        {camp.description || camp.product}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-[11px] font-space text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Type:</span>
                        <span className="font-semibold text-slate-800">{camp.campaignType}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Region:</span>
                        <span className="font-semibold text-slate-800">{camp.region}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Timeline:</span>
                        <span className="font-semibold text-slate-800">
                          {camp.startDate} to {camp.endDate}
                        </span>
                      </div>
                    </div>

                    {/* Brand Compliance Guidelines Tags */}
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-space font-bold uppercase text-slate-400 mb-1.5">
                        <span>Enforced AI Rules ({brandParams.length})</span>
                        <ShieldCheck className="h-3 w-3 text-[#ff5000]" />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {brandParams.slice(0, 3).map((p, pIdx) => (
                          <span
                            key={`${p.id}-${pIdx}`}
                            className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[9px] font-space text-slate-700 font-medium truncate max-w-[170px]"
                            title={p.name}
                          >
                            {p.name}
                          </span>
                        ))}
                        {brandParams.length > 3 && (
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-space text-slate-500">
                            +{brandParams.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Assigned Review Supervisor */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[10px] font-space font-bold uppercase text-slate-500">
                        <span className="flex items-center gap-1">
                          <UserCheck className="h-3 w-3 text-[#ff5000]" />
                          <span>Review Supervisor</span>
                        </span>
                        <span className="text-[9px] text-[#ff5000]">&ge;85% Routing</span>
                      </div>
                      <select
                        value={camp.assignedSupervisorId || 'usr-101'}
                        onChange={(e) => handleReassignSupervisor(camp.id, e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-space font-medium text-slate-800 hover:border-[#ff5000] focus:outline-none cursor-pointer"
                      >
                        {supervisors.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.department || s.email})
                          </option>
                        ))}
                        {supervisors.length === 0 && (
                          <option value="usr-101">Marcus Vance (Brand Compliance)</option>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-space">
                    <span className="text-[#ff5000] font-bold">Ready for Employee Uploads</span>
                    <span className="text-slate-400">Gate: 85%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
