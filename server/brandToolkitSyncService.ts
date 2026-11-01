import fs from 'fs';
import path from 'path';
import type { Brand, BrandToolkitVersion } from '../src/types.ts';
import {
  getDriveConfig,
  getOrCreateFolder,
  uploadFileToDrive,
  verifyDriveFile,
  initializeZarvisHierarchy,
} from './googleDriveService.ts';

/**
 * BRAND TOOLKIT SYSTEMATIC DRIVE SYNCHRONIZATION SERVICE
 * 
 * Creates & syncs Phase 5 / Phase 9 Brand Toolkit Folder Architecture:
 * ZARVIS / 01_Brand Toolkits / {Brand Name}
 *   ├── 00_Brand Information
 *   ├── 01_Logos
 *   ├── 02_Colors
 *   ├── 03_Typography
 *   ├── 04_Brand Guidelines
 *   ├── 05_Content Guidelines
 *   ├── 06_Canva Templates
 *   ├── 07_Reference Assets
 *   ├── 08_AI Evaluation Rules
 *   └── 99_Version History
 * 
 * Handles versions idempotently, saves real Drive file IDs, verifies files, and
 * stores previous snapshots in 99_Version History without rewriting past records.
 */

export interface ToolkitSyncResult {
  success: boolean;
  status: 'NOT_CONFIGURED' | 'SYNCED' | 'PARTIALLY_SYNCED' | 'SYNC_FAILED';
  toolkitFolderId: string | null;
  toolkitFolderUrl: string | null;
  syncedAssetsCount: number;
  failedAssetsCount: number;
  syncedAt: string;
  version: string;
  errorMessage?: string;
  details?: Record<string, any>;
}

export async function syncBrandToolkitToDrive(brand: Brand): Promise<ToolkitSyncResult> {
  const driveConfig = getDriveConfig();
  const currentVersion = brand.toolkitVersion || 'v1.0';
  const nowIso = new Date().toISOString();

  if (!driveConfig.configured) {
    return {
      success: false,
      status: 'NOT_CONFIGURED',
      toolkitFolderId: null,
      toolkitFolderUrl: null,
      syncedAssetsCount: 0,
      failedAssetsCount: 0,
      syncedAt: nowIso,
      version: currentVersion,
      errorMessage: 'Saved in ZARVIS only — Google Drive sync unavailable.',
    };
  }

  try {
    const hierarchy = await initializeZarvisHierarchy();
    const safeBrandName = brand.name.replace(/[/\\?%*:|"<>]/g, '_').trim() || 'Brand';

    // 1. Brand Root Folder: ZARVIS / 01_Brand Toolkits / {Brand Name}
    const brandToolkitFolder = await getOrCreateFolder(safeBrandName, hierarchy.brandToolkitsFolderId);

    // 2. Standardized 10 subfolders
    const [
      fInfo,
      fLogos,
      fColors,
      fTypography,
      fGuidelines,
      fContent,
      fCanva,
      fReference,
      fRules,
      fHistory,
    ] = await Promise.all([
      getOrCreateFolder('00_Brand Information', brandToolkitFolder.id),
      getOrCreateFolder('01_Logos', brandToolkitFolder.id),
      getOrCreateFolder('02_Colors', brandToolkitFolder.id),
      getOrCreateFolder('03_Typography', brandToolkitFolder.id),
      getOrCreateFolder('04_Brand Guidelines', brandToolkitFolder.id),
      getOrCreateFolder('05_Content Guidelines', brandToolkitFolder.id),
      getOrCreateFolder('06_Canva Templates', brandToolkitFolder.id),
      getOrCreateFolder('07_Reference Assets', brandToolkitFolder.id),
      getOrCreateFolder('08_AI Evaluation Rules', brandToolkitFolder.id),
      getOrCreateFolder('99_Version History', brandToolkitFolder.id),
    ]);

    let syncedCount = 0;
    let failedCount = 0;

    // 3. Prepare structured documentation payloads
    const brandInfoText = `=======================================================
ZARVIS BRAND INFORMATION MANIFEST
Brand: ${brand.name} (${brand.id})
Version: ${currentVersion}
Last Updated: ${nowIso}
=======================================================
Description: ${brand.description || 'N/A'}
Active Status: ${brand.isActive ? 'ACTIVE' : 'INACTIVE'}
Guideline Parameters Configured: ${brand.parametersCount || 0}
`;

    const colorSpecText = `=======================================================
OFFICIAL BRAND COLOR SPECIFICATIONS
=======================================================
Primary Color: ${brand.colorPalette?.primary || 'N/A'}
Secondary Color: ${brand.colorPalette?.secondary || 'N/A'}
Accent Color: ${brand.colorPalette?.accent || 'N/A'}
Neutral Color: ${brand.colorPalette?.neutral || 'N/A'}
Dark Background: ${brand.toolkit?.colorTheme?.darkBackground || 'N/A'}
Light Background: ${brand.toolkit?.colorTheme?.lightBackground || 'N/A'}

PROHIBITED / FORBIDDEN COLORS:
${(brand.colorPalette?.forbidden || []).join('\n') || 'None'}
`;

    const typographySpecText = `=======================================================
TYPOGRAPHY & HIERARCHY SPECIFICATIONS
=======================================================
Primary Font: ${brand.typography?.primaryFont || 'N/A'}
Allowed Fonts: ${(brand.toolkit?.allowedFonts || [brand.typography?.primaryFont]).filter(Boolean).join(', ')}
Minimum Heading Size: ${brand.typography?.minHeadingSize || '24px'}
Minimum Body Size: ${brand.typography?.minBodySize || '12px'}

Rules:
${(brand.typography?.rules || []).join('\n') || 'Standard typography hierarchy applies.'}
`;

    const guidelinesDoc = brand.guidelinesMarkdown || 'No guidelines text provided.';

    const evaluationRulesJson = JSON.stringify(
      {
        brandId: brand.id,
        brandName: brand.name,
        toolkitVersion: currentVersion,
        logoRules: brand.logoRules,
        creativeRules: brand.creativeRules,
        videoRules: brand.videoRules,
        colorTheme: brand.toolkit?.colorTheme,
        typographySpecs: brand.toolkit?.typographySpecs,
      },
      null,
      2
    );

    // 4. Upload files to corresponding folders
    const uploads = [
      { name: 'Brand_Overview.txt', mime: 'text/plain', folder: fInfo.id, body: Buffer.from(brandInfoText, 'utf-8') },
      { name: 'Official_Color_Palette.txt', mime: 'text/plain', folder: fColors.id, body: Buffer.from(colorSpecText, 'utf-8') },
      { name: 'Typography_Specifications.txt', mime: 'text/plain', folder: fTypography.id, body: Buffer.from(typographySpecText, 'utf-8') },
      { name: 'Brand_Guidelines.md', mime: 'text/markdown', folder: fGuidelines.id, body: Buffer.from(guidelinesDoc, 'utf-8') },
      { name: 'AI_Evaluation_Rules.json', mime: 'application/json', folder: fRules.id, body: Buffer.from(evaluationRulesJson, 'utf-8') },
      // Also snapshot into 99_Version History
      { name: `Snapshot_${currentVersion}_${Date.now()}.json`, mime: 'application/json', folder: fHistory.id, body: Buffer.from(JSON.stringify(brand, null, 2), 'utf-8') },
    ];

    for (const item of uploads) {
      try {
        const file = await uploadFileToDrive({
          name: item.name,
          mimeType: item.mime,
          parentFolderId: item.folder,
          body: item.body,
        });
        const verified = await verifyDriveFile(file.id);
        if (verified) {
          syncedCount++;
        } else {
          failedCount++;
        }
      } catch (uploadErr) {
        console.warn(`Failed to upload ${item.name} to Drive:`, uploadErr);
        failedCount++;
      }
    }

    const folderUrl = brandToolkitFolder.webViewLink || `https://drive.google.com/drive/folders/${brandToolkitFolder.id}`;

    return {
      success: syncedCount > 0,
      status: failedCount === 0 ? 'SYNCED' : 'PARTIALLY_SYNCED',
      toolkitFolderId: brandToolkitFolder.id,
      toolkitFolderUrl: folderUrl,
      syncedAssetsCount: syncedCount,
      failedAssetsCount: failedCount,
      syncedAt: nowIso,
      version: currentVersion,
      details: {
        brandToolkitFolderId: brandToolkitFolder.id,
        syncedCount,
        failedCount,
      },
    };
  } catch (err: any) {
    console.error('Brand toolkit sync error:', err);
    return {
      success: false,
      status: 'SYNC_FAILED',
      toolkitFolderId: null,
      toolkitFolderUrl: null,
      syncedAssetsCount: 0,
      failedAssetsCount: 0,
      syncedAt: nowIso,
      version: currentVersion,
      errorMessage: err.message || 'Failed to synchronize brand toolkit to Google Drive',
    };
  }
}
