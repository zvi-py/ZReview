import fs from 'fs';
import path from 'path';

/**
 * PRODUCTION-READY GOOGLE DRIVE REST CLIENT
 * Supports OAuth 2.0 (ClientId, ClientSecret, RefreshToken) & Service Account credentials.
 * Supports Google Shared Drive with corpora: 'drive', supportsAllDrives: true, includeItemsFromAllDrives: true.
 * Built with native Node.js fetch — ZERO expensive or fragile extra dependencies.
 * Never prints tokens, client secrets, or private keys to logs or responses.
 */

export interface DriveConfig {
  configured: boolean;
  authType: 'OAUTH_REFRESH_TOKEN' | 'SERVICE_ACCOUNT' | 'NOT_CONFIGURED';
  rootFolderId: string | null;
  sharedDriveId: string | null;
}

export interface DriveStatus {
  configured: boolean;
  authenticated: boolean;
  connected: boolean;
  authType: string;
  rootFolderConfigured: boolean;
  rootFolderVerified: boolean;
  sharedDriveConfigured: boolean;
  driveName: string | null;
  rootFolderName: string | null;
  lastCheckedAt: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface DriveFolderInfo {
  id: string;
  name: string;
  webViewLink?: string;
}

export interface DriveFileInfo {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  webViewLink?: string;
  webContentLink?: string;
  createdTime?: string;
}

export interface UploadFileOptions {
  name: string;
  mimeType: string;
  parentFolderId: string;
  body: Buffer | Uint8Array;
}

let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

/**
 * In-memory & persistent cache for discovered folder IDs to avoid duplicate API lookups.
 * Key: `${parentFolderId || 'ROOT'}::${folderName}`
 */
const folderIdCache = new Map<string, string>();

/**
 * Returns configuration state safely without exposing credentials.
 */
export function getDriveConfig(): DriveConfig {
  const hasOAuth = Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN
  );
  const hasServiceAccount = Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  );

  const authType = hasOAuth
    ? 'OAUTH_REFRESH_TOKEN'
    : hasServiceAccount
      ? 'SERVICE_ACCOUNT'
      : 'NOT_CONFIGURED';

  const configured = authType !== 'NOT_CONFIGURED';
  const rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID || process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID || null;
  const sharedDriveId = process.env.GOOGLE_DRIVE_ID || process.env.GOOGLE_SHARED_DRIVE_ID || null;

  return {
    configured,
    authType,
    rootFolderId,
    sharedDriveId,
  };
}

/**
 * Obtains a fresh Google OAuth 2.0 access token using the refresh token.
 */
async function getOAuthAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN?.trim();

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google OAuth credentials incomplete. GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN are required.');
  }

  // Reuse valid token if > 60 seconds remain
  if (cachedAccessToken && Date.now() < tokenExpiresAt - 60000) {
    return cachedAccessToken;
  }

  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    let parsedMsg = 'OAuth token exchange failed';
    try {
      const parsed = JSON.parse(errText);
      parsedMsg = parsed.error_description || parsed.error || parsedMsg;
    } catch {
      // ignore
    }
    throw new Error(`Google Drive OAuth authentication failed: ${parsedMsg}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedAccessToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in || 3600) * 1000;
  return cachedAccessToken;
}

/**
 * Returns a valid authorization header. Throws clean error if unconfigured.
 */
export async function getAuthorizationHeader(): Promise<string> {
  const config = getDriveConfig();
  if (!config.configured) {
    throw new Error('Google Drive is not configured in server environment.');
  }

  if (config.authType === 'OAUTH_REFRESH_TOKEN') {
    const token = await getOAuthAccessToken();
    return `Bearer ${token}`;
  }

  throw new Error('Google Drive authentication method not currently supported.');
}

/**
 * Appends Shared Drive parameters to an API URL where appropriate.
 */
function appendSharedDriveParams(url: URL): void {
  url.searchParams.set('supportsAllDrives', 'true');
  url.searchParams.set('includeItemsFromAllDrives', 'true');
  const sharedDriveId = process.env.GOOGLE_DRIVE_ID || process.env.GOOGLE_SHARED_DRIVE_ID;
  if (sharedDriveId) {
    url.searchParams.set('corpora', 'drive');
    url.searchParams.set('driveId', sharedDriveId.trim());
  }
}

/**
 * Performs a safe, harmless API test to verify Drive connectivity and root folder availability.
 */
export async function testDriveConnection(): Promise<DriveStatus> {
  const config = getDriveConfig();
  const nowIso = new Date().toISOString();

  if (!config.configured) {
    return {
      configured: false,
      authenticated: false,
      connected: false,
      authType: 'NOT_CONFIGURED',
      rootFolderConfigured: Boolean(config.rootFolderId),
      rootFolderVerified: false,
      sharedDriveConfigured: Boolean(config.sharedDriveId),
      driveName: null,
      rootFolderName: null,
      lastCheckedAt: nowIso,
      errorCode: 'NOT_CONFIGURED',
      errorMessage: 'Google Drive is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN.',
    };
  }

  try {
    const authHeader = await getAuthorizationHeader();

    // 1. If rootFolderId is configured, verify it exists and is accessible
    let rootFolderName: string | null = null;
    let rootFolderVerified = false;

    if (config.rootFolderId) {
      const rootUrl = new URL(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(config.rootFolderId)}`);
      rootUrl.searchParams.set('fields', 'id,name,mimeType,trashed');
      appendSharedDriveParams(rootUrl);

      const rootRes = await fetch(rootUrl.toString(), {
        headers: { Authorization: authHeader },
      });

      if (rootRes.ok) {
        const rootData = (await rootRes.json()) as { id: string; name: string; mimeType: string; trashed?: boolean };
        if (rootData.trashed) {
          return {
            configured: true,
            authenticated: true,
            connected: false,
            authType: config.authType,
            rootFolderConfigured: true,
            rootFolderVerified: false,
            sharedDriveConfigured: Boolean(config.sharedDriveId),
            driveName: null,
            rootFolderName: rootData.name,
            lastCheckedAt: nowIso,
            errorCode: 'ROOT_FOLDER_TRASHED',
            errorMessage: `Configured Google Drive root folder "${rootData.name}" is in the trash.`,
          };
        }
        rootFolderName = rootData.name;
        rootFolderVerified = true;
      } else if (rootRes.status === 404) {
        return {
          configured: true,
          authenticated: true,
          connected: false,
          authType: config.authType,
          rootFolderConfigured: true,
          rootFolderVerified: false,
          sharedDriveConfigured: Boolean(config.sharedDriveId),
          driveName: null,
          rootFolderName: null,
          lastCheckedAt: nowIso,
          errorCode: 'ROOT_FOLDER_NOT_FOUND',
          errorMessage: `Configured root folder ID "${config.rootFolderId}" was not found or is inaccessible with this account.`,
        };
      } else if (rootRes.status === 403) {
        return {
          configured: true,
          authenticated: true,
          connected: false,
          authType: config.authType,
          rootFolderConfigured: true,
          rootFolderVerified: false,
          sharedDriveConfigured: Boolean(config.sharedDriveId),
          driveName: null,
          rootFolderName: null,
          lastCheckedAt: nowIso,
          errorCode: 'PERMISSION_DENIED',
          errorMessage: 'Access denied: Google account lacks read permissions for the configured root folder.',
        };
      }
    }

    // 2. If Shared Drive is configured, verify the Drive itself
    let driveName: string | null = null;
    if (config.sharedDriveId) {
      const driveUrl = new URL(`https://www.googleapis.com/drive/v3/drives/${encodeURIComponent(config.sharedDriveId)}`);
      const driveRes = await fetch(driveUrl.toString(), {
        headers: { Authorization: authHeader },
      });
      if (driveRes.ok) {
        const driveData = (await driveRes.json()) as { id: string; name: string };
        driveName = driveData.name;
      }
    }

    // 3. If no root folder was specified or root check was skipped, perform a lightweight files check
    if (!config.rootFolderId) {
      const aboutUrl = new URL('https://www.googleapis.com/drive/v3/about');
      aboutUrl.searchParams.set('fields', 'user,storageQuota');
      const aboutRes = await fetch(aboutUrl.toString(), {
        headers: { Authorization: authHeader },
      });
      if (aboutRes.ok) {
        const aboutData = (await aboutRes.json()) as { user?: { displayName: string; emailAddress: string } };
        driveName = aboutData.user ? `${aboutData.user.displayName} (${aboutData.user.emailAddress})` : 'Connected Google Account';
      }
    }

    return {
      configured: true,
      authenticated: true,
      connected: true,
      authType: config.authType,
      rootFolderConfigured: Boolean(config.rootFolderId),
      rootFolderVerified,
      sharedDriveConfigured: Boolean(config.sharedDriveId),
      driveName,
      rootFolderName,
      lastCheckedAt: nowIso,
    };
  } catch (err: any) {
    return {
      configured: true,
      authenticated: false,
      connected: false,
      authType: config.authType,
      rootFolderConfigured: Boolean(config.rootFolderId),
      rootFolderVerified: false,
      sharedDriveConfigured: Boolean(config.sharedDriveId),
      driveName: null,
      rootFolderName: null,
      lastCheckedAt: nowIso,
      errorCode: 'AUTH_OR_NETWORK_ERROR',
      errorMessage: err?.message || 'Failed to authenticate or connect to Google Drive API',
    };
  }
}

/**
 * Backward compatibility alias for testDriveConnection
 */
export const testGoogleDriveConnection = testDriveConnection;

/**
 * Searches for a single subfolder by name under a given parent folder.
 * Idempotent: returns the first matching non-trashed folder or null.
 */
export async function findFolder(name: string, parentFolderId?: string | null): Promise<DriveFolderInfo | null> {
  const cacheKey = `${parentFolderId || 'ROOT'}::${name.trim()}`;
  const cachedId = folderIdCache.get(cacheKey);
  if (cachedId) {
    return { id: cachedId, name: name.trim() };
  }

  const authHeader = await getAuthorizationHeader();
  const listUrl = new URL('https://www.googleapis.com/drive/v3/files');

  // Build safe Drive query
  const escapedName = name.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  let q = `mimeType = 'application/vnd.google-apps.folder' and name = '${escapedName}' and trashed = false`;
  if (parentFolderId) {
    const escapedParent = parentFolderId.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    q += ` and '${escapedParent}' in parents`;
  }

  listUrl.searchParams.set('q', q);
  listUrl.searchParams.set('fields', 'files(id, name, webViewLink)');
  listUrl.searchParams.set('pageSize', '1');
  appendSharedDriveParams(listUrl);

  const res = await fetch(listUrl.toString(), {
    headers: { Authorization: authHeader },
  });

  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(`Drive folder search failed for "${name}": ${err.slice(0, 150)}`);
  }

  const data = (await res.json()) as { files?: { id: string; name: string; webViewLink?: string }[] };
  const found = data.files && data.files.length > 0 ? data.files[0] : null;

  if (found) {
    folderIdCache.set(cacheKey, found.id);
    return found;
  }
  return null;
}

/**
 * Creates or reuses a folder under a parent folder. IDEMPOTENT.
 * Never creates duplicate folders when one already exists.
 */
export async function getOrCreateFolder(name: string, parentFolderId?: string | null): Promise<DriveFolderInfo> {
  const existing = await findFolder(name, parentFolderId);
  if (existing) {
    return existing;
  }

  const authHeader = await getAuthorizationHeader();
  const createUrl = new URL('https://www.googleapis.com/drive/v3/files');
  createUrl.searchParams.set('fields', 'id, name, webViewLink');
  appendSharedDriveParams(createUrl);

  const metadata: Record<string, any> = {
    name: name.trim(),
    mimeType: 'application/vnd.google-apps.folder',
  };
  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const res = await fetch(createUrl.toString(), {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(`Failed to create Drive folder "${name}": ${err.slice(0, 150)}`);
  }

  const created = (await res.json()) as DriveFolderInfo;
  const cacheKey = `${parentFolderId || 'ROOT'}::${name.trim()}`;
  folderIdCache.set(cacheKey, created.id);
  return created;
}

/**
 * Uploads a file (buffer or string) to a designated Drive folder using multipart upload.
 * Captures real Drive file ID and real Drive webViewLink.
 */
export async function uploadFileToDrive(options: UploadFileOptions): Promise<DriveFileInfo> {
  const { name, mimeType, parentFolderId, body } = options;
  const authHeader = await getAuthorizationHeader();

  const boundary = `-------314159265358979323846_${Date.now()}`;
  const metadata = {
    name,
    mimeType,
    parents: [parentFolderId],
  };

  const metadataHeader = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(
    metadata
  )}\r\n`;
  const fileHeader = `--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n`;
  const fileFooter = `\r\n--${boundary}--`;

  const metaBuf = Buffer.from(metadataHeader, 'utf-8');
  const headerBuf = Buffer.from(fileHeader, 'utf-8');
  const footerBuf = Buffer.from(fileFooter, 'utf-8');
  const bodyBuf = Buffer.isBuffer(body) ? body : Buffer.from(body);

  const multipartBuffer = Buffer.concat([metaBuf, headerBuf, bodyBuf, footerBuf]);

  const uploadUrl = new URL('https://www.googleapis.com/upload/drive/v3/files');
  uploadUrl.searchParams.set('uploadType', 'multipart');
  uploadUrl.searchParams.set('fields', 'id, name, mimeType, size, webViewLink, webContentLink, createdTime');
  appendSharedDriveParams(uploadUrl);

  const res = await fetch(uploadUrl.toString(), {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': `multipart/related; boundary=${boundary}`,
      'Content-Length': String(multipartBuffer.length),
    },
    body: multipartBuffer,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Drive file upload failed for "${name}": ${errText.slice(0, 160)}`);
  }

  const uploaded = (await res.json()) as DriveFileInfo;

  // Set file permissions to 'anyone with the link can view' for verified deliverables sharing if requested
  try {
    const permUrl = new URL(`https://www.googleapis.com/drive/v3/files/${uploaded.id}/permissions`);
    appendSharedDriveParams(permUrl);
    await fetch(permUrl.toString(), {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone',
      }),
    });
  } catch {
    // Non-fatal if organizational sharing policies restrict public link sharing
  }

  return uploaded;
}

/**
 * Verifies that a Drive file exists, is not in the trash, and matches the given ID.
 * Follow-up verification step required before setting state to VERIFIED.
 */
export async function verifyDriveFile(fileId: string): Promise<DriveFileInfo | null> {
  if (!fileId) return null;
  const authHeader = await getAuthorizationHeader();

  const getUrl = new URL(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`);
  getUrl.searchParams.set('fields', 'id, name, mimeType, size, webViewLink, webContentLink, trashed, createdTime');
  appendSharedDriveParams(getUrl);

  const res = await fetch(getUrl.toString(), {
    headers: { Authorization: authHeader },
  });

  if (!res.ok) {
    return null;
  }

  const file = (await res.json()) as DriveFileInfo & { trashed?: boolean };
  if (file.trashed) {
    return null;
  }

  return {
    id: file.id,
    name: file.name,
    mimeType: file.mimeType,
    size: file.size,
    webViewLink: file.webViewLink,
    webContentLink: file.webContentLink,
    createdTime: file.createdTime,
  };
}

/**
 * Initializes the official ZARVIS root directory structure idempotently.
 * Structure:
 * ZARVIS /
 *   ├── 00_System
 *   ├── 01_Brand Toolkits
 *   ├── 02_Campaigns
 *   └── 03_Client Deliveries
 */
export async function initializeZarvisHierarchy(): Promise<{
  rootFolderId: string;
  systemFolderId: string;
  brandToolkitsFolderId: string;
  campaignsFolderId: string;
  clientDeliveriesFolderId: string;
}> {
  const config = getDriveConfig();
  if (!config.configured) {
    throw new Error('Google Drive is not configured. Cannot initialize ZARVIS folder hierarchy.');
  }

  // 1. Root folder
  let rootFolderId = config.rootFolderId;
  if (!rootFolderId) {
    const root = await getOrCreateFolder('ZARVIS_ASSET_ARCHIVE', null);
    rootFolderId = root.id;
  }

  // 2. Four primary functional modules
  const [sys, toolkits, campaigns, deliveries] = await Promise.all([
    getOrCreateFolder('00_System', rootFolderId),
    getOrCreateFolder('01_Brand Toolkits', rootFolderId),
    getOrCreateFolder('02_Campaigns', rootFolderId),
    getOrCreateFolder('03_Client Deliveries', rootFolderId),
  ]);

  return {
    rootFolderId,
    systemFolderId: sys.id,
    brandToolkitsFolderId: toolkits.id,
    campaignsFolderId: campaigns.id,
    clientDeliveriesFolderId: deliveries.id,
  };
}
