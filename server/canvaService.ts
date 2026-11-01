export interface CanvaExtractionResult {
  success: boolean;
  designId: string;
  title: string;
  canvaUrl: string;
  hasRealPreview: boolean;
  previewState: 'REAL_PREVIEW' | 'LINK_ONLY' | 'INVALID';
  imageBuffer?: Buffer;
  mimeType?: string;
  dataUrl?: string;
  errorMessage?: string;
}

/**
 * Normalizes and extracts Canva design metadata.
 * Strictly adheres to Canva Link Rules:
 * 1. Save the exact original URL.
 * 2. Extract the Canva design ID if possible.
 * 3. Store the design ID separately.
 * 4. Display the exact submitted URL.
 * 5. Never replace the design with a local sample image.
 * 6. Never generate a fake preview based on the brand or campaign name.
 * 7. Never use an unrelated SVG as a fallback.
 * 8. Never claim that the design was imported unless it was actually imported.
 * 9. Never claim that the design was edited automatically unless a real Canva API is connected.
 * 
 * Preview States:
 * A. REAL PREVIEW AVAILABLE: Real preview retrieved specifically for this design ID.
 * B. LINK SAVED, PREVIEW NOT AVAILABLE: Valid link, design ID extracted, link saved, but preview unavailable.
 * C. INVALID LINK: Not a valid Canva URL.
 */
export async function resolveAndExtractCanva(
  rawUrl: string,
  brandHint?: string,
  titleHint?: string
): Promise<CanvaExtractionResult> {
  const cleanUrl = (rawUrl || '').trim();

  if (!cleanUrl) {
    return {
      success: false,
      designId: '',
      title: '',
      canvaUrl: '',
      hasRealPreview: false,
      previewState: 'INVALID',
      errorMessage: 'Canva design link is required.',
    };
  }

  // Check if this is a genuine Canva domain
  const isCanvaDomain =
    cleanUrl.includes('canva.com') ||
    cleanUrl.includes('canva.link') ||
    cleanUrl.includes('canva.me');

  if (!isCanvaDomain) {
    return {
      success: false,
      designId: '',
      title: '',
      canvaUrl: cleanUrl,
      hasRealPreview: false,
      previewState: 'INVALID',
      errorMessage: 'Invalid or unsupported Canva link. Please check the URL.',
    };
  }

  // Extract Canva design ID from URL path (e.g., /design/DAHT79DbjJg/... or /brand/... or share links)
  const designIdMatch = cleanUrl.match(/\/design\/([A-Za-z0-9_-]+)/i);
  let designId = designIdMatch ? designIdMatch[1] : '';

  if (!designId) {
    // Check if it's a short link or alternative format
    const altMatch = cleanUrl.match(/canva\.(?:link|me)\/([A-Za-z0-9_-]+)/i);
    if (altMatch) {
      designId = altMatch[1];
    } else {
      // Fallback: extract last alphanumeric token from path
      const pathSegments = cleanUrl.split('?')[0].split('/').filter(Boolean);
      const candidate = pathSegments[pathSegments.length - 1];
      if (candidate && candidate.length >= 3) {
        designId = candidate;
      } else {
        designId = `canva-${Date.now().toString(36)}`;
      }
    }
  }

  const effectiveDesignId = designId || 'canva-design';
  let inferredTitle = titleHint?.trim() || `Canva Design (${effectiveDesignId})`;

  // Canva /edit URLs are private authenticated editor pages that never serve
  // unauthenticated design renders to anonymous web requests (they return generic Canva login/landing graphics).
  const isPrivateEditorUrl = cleanUrl.includes('/edit') || cleanUrl.includes('/edit#');

  // Attempt live fetch to check for real public og:image belonging specifically to this design
  let extractedBuffer: Buffer | undefined;
  let extractedMime: string | undefined;
  let extractedDataUrl: string | undefined;

  // Only attempt unauthenticated public preview scrape if not a private editor URL
  if (!isPrivateEditorUrl) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(cleanUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,image/*,*/*',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';

        if (contentType.startsWith('image/')) {
          const arrayBuf = await response.arrayBuffer();
          extractedBuffer = Buffer.from(arrayBuf);
          extractedMime = contentType;
          extractedDataUrl = `data:${contentType};base64,${extractedBuffer.toString('base64')}`;
        } else {
          const html = await response.text();

          const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
          if (titleMatch && titleMatch[1]) {
            const docTitle = titleMatch[1].replace(/ - Canva.*$/i, '').trim();
            if (docTitle && !docTitle.toLowerCase().includes('log in') && !docTitle.toLowerCase().includes('sign up')) {
              inferredTitle = docTitle;
            }
          }

          // Only use og:image if it is a genuine preview asset and not a generic Canva brand logo or login graphic
          const ogImageMatch =
            html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
            html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i) ||
            html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);

          if (ogImageMatch && ogImageMatch[1]) {
            const imgUrl = ogImageMatch[1];
            // Check if image URL looks like an actual design render and not a static Canva marketing graphic or generic placeholder
            const isGenericCanvaAsset =
              imgUrl.includes('static.canva.com') ||
              imgUrl.includes('canva-login') ||
              imgUrl.includes('brand-assets') ||
              imgUrl.includes('og_image') ||
              imgUrl.includes('canva-share') ||
              imgUrl.includes('default') ||
              imgUrl.includes('placeholder') ||
              imgUrl.includes('anon_home') ||
              imgUrl.includes('login') ||
              imgUrl.includes('growth') ||
              imgUrl.includes('logo') ||
              imgUrl.endsWith('.ico');

            // Crucial: The image MUST actually belong to this design ID
            const isDesignSpecific =
              effectiveDesignId &&
              (imgUrl.toLowerCase().includes(effectiveDesignId.toLowerCase()) ||
                imgUrl.includes('/v2/image-resize') ||
                imgUrl.includes('/design/'));

            if (!isGenericCanvaAsset && isDesignSpecific) {
              try {
                const imgRes = await fetch(imgUrl);
                if (imgRes.ok) {
                  const imgArrayBuf = await imgRes.arrayBuffer();
                  extractedBuffer = Buffer.from(imgArrayBuf);
                  extractedMime = imgRes.headers.get('content-type') || 'image/jpeg';
                  extractedDataUrl = `data:${extractedMime};base64,${extractedBuffer.toString('base64')}`;
                }
              } catch {
                // Fetch failed, proceed without fake fallback
              }
            }
          }
        }
      }
    } catch {
      // Network or timeout fetch failed
    }
  }

  // STATE A vs STATE B:
  // If we have a genuine extracted preview specifically for this design:
  if (extractedBuffer && extractedDataUrl) {
    return {
      success: true,
      designId: effectiveDesignId,
      title: inferredTitle,
      canvaUrl: cleanUrl,
      hasRealPreview: true,
      previewState: 'REAL_PREVIEW',
      imageBuffer: extractedBuffer,
      mimeType: extractedMime,
      dataUrl: extractedDataUrl,
    };
  }

  // STATE B: Link saved, preview not available.
  // CRITICAL RULE: NEVER replace the design with a local sample image.
  // NEVER generate a fake preview based on the brand or campaign name.
  // NEVER use an unrelated SVG as a fallback.
  return {
    success: true,
    designId: effectiveDesignId,
    title: inferredTitle,
    canvaUrl: cleanUrl,
    hasRealPreview: false,
    previewState: 'LINK_ONLY',
  };
}
