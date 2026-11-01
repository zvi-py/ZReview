import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export interface StoredMediaFile {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  assetHash: string;
}

export interface FileVerificationResult {
  isValid: boolean;
  exists: boolean;
  buffer: Buffer | null;
  size: number;
  mimeType: string;
  assetHash: string | null;
  errorMessage?: string;
}

export function computeAssetHash(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

const MAX_FILE_SIZE_BYTES = 30 * 1024 * 1024; // 30MB

const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
]);

/**
 * Persists raw base64 or buffer media into the public/uploads storage directory.
 */
export function saveMediaFile(
  content: string | Buffer,
  originalName = 'creative_asset',
  preferredMime?: string
): StoredMediaFile {
  let buffer: Buffer;
  let mimeType = preferredMime || 'image/png';

  if (typeof content === 'string') {
    if (content.startsWith('data:')) {
      const match = content.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1] || mimeType;
        buffer = Buffer.from(match[2], 'base64');
      } else {
        buffer = Buffer.from(content, 'utf8');
      }
    } else {
      buffer = Buffer.from(content, 'utf8');
    }
  } else {
    buffer = content;
  }

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File size (${(buffer.length / (1024 * 1024)).toFixed(1)}MB) exceeds maximum allowed limit of 30MB.`);
  }

  // Determine file extension
  let ext = 'png';
  if (mimeType.includes('svg')) ext = 'svg';
  else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
  else if (mimeType.includes('webp')) ext = 'webp';
  else if (mimeType.includes('mp4')) ext = 'mp4';
  else if (mimeType.includes('webm')) ext = 'webm';
  else if (originalName.includes('.')) {
    ext = originalName.split('.').pop() || 'png';
  }

  const sanitizedBase = path
    .basename(originalName, path.extname(originalName))
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 32);

  const uniqueId = crypto.randomBytes(6).toString('hex');
  const fileName = `${sanitizedBase || 'asset'}_${Date.now()}_${uniqueId}.${ext}`;
  const absolutePath = path.join(UPLOADS_DIR, fileName);

  fs.writeFileSync(absolutePath, buffer);
  const assetHash = computeAssetHash(buffer);

  return {
    fileUrl: `/uploads/${fileName}`,
    fileName,
    fileSize: buffer.length,
    mimeType,
    assetHash,
  };
}

/**
 * Verifies that a media file actually exists, is non-empty, and computes its SHA-256 hash.
 */
export function verifyMediaFile(fileUrl: string, expectedMime?: string): FileVerificationResult {
  if (!fileUrl) {
    return {
      isValid: false,
      exists: false,
      buffer: null,
      size: 0,
      mimeType: expectedMime || 'unknown',
      assetHash: null,
      errorMessage: 'File URL is missing or empty.',
    };
  }

  const buffer = resolveFileBuffer(fileUrl);
  if (!buffer || buffer.length === 0) {
    return {
      isValid: false,
      exists: false,
      buffer: null,
      size: 0,
      mimeType: expectedMime || 'unknown',
      assetHash: null,
      errorMessage: `Media asset could not be located or read from storage (${fileUrl}).`,
    };
  }

  const assetHash = computeAssetHash(buffer);
  let detectedMime = expectedMime || 'image/png';
  if (fileUrl.endsWith('.svg') || buffer.toString('utf8', 0, 100).includes('<svg')) {
    detectedMime = 'image/svg+xml';
  } else if (fileUrl.endsWith('.jpg') || fileUrl.endsWith('.jpeg')) {
    detectedMime = 'image/jpeg';
  } else if (fileUrl.endsWith('.webp')) {
    detectedMime = 'image/webp';
  } else if (fileUrl.endsWith('.mp4')) {
    detectedMime = 'video/mp4';
  }

  return {
    isValid: true,
    exists: true,
    buffer,
    size: buffer.length,
    mimeType: detectedMime,
    assetHash,
  };
}

/**
 * Resolves a file buffer from a relative URL (/uploads/..., /assets/...) or data URL.
 */
export function resolveFileBuffer(fileUrl: string): Buffer | null {
  if (!fileUrl) return null;

  try {
    if (fileUrl.startsWith('data:')) {
      const base64Index = fileUrl.indexOf(';base64,');
      if (base64Index !== -1) {
        const base64Data = fileUrl.slice(base64Index + 8);
        return Buffer.from(base64Data, 'base64');
      }
    }

    if (fileUrl.startsWith('/')) {
      const absPath = path.join(process.cwd(), 'public', fileUrl);
      if (fs.existsSync(absPath)) {
        return fs.readFileSync(absPath);
      }
    }

    if (fs.existsSync(fileUrl)) {
      return fs.readFileSync(fileUrl);
    }
  } catch (err) {
    console.error('Error resolving file buffer for:', fileUrl, err);
  }

  return null;
}
