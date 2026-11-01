import React from 'react';
import { ExternalLink, CheckCircle2, AlertCircle, Link2 } from 'lucide-react';

interface CanvaPreviewCardProps {
  canvaUrl?: string;
  designId?: string;
  realPreviewUrl?: string;
  previewState?: 'REAL_PREVIEW' | 'LINK_ONLY' | 'INVALID';
  className?: string;
}

export const CanvaPreviewCard: React.FC<CanvaPreviewCardProps> = ({
  canvaUrl,
  designId,
  realPreviewUrl,
  previewState = 'LINK_ONLY',
  className = '',
}) => {
  if (!canvaUrl) return null;

  const effectiveDesignId =
    designId ||
    canvaUrl.match(/\/design\/([A-Za-z0-9_-]+)/i)?.[1] ||
    '';

  // State C: INVALID LINK
  if (previewState === 'INVALID') {
    return (
      <div
        className={`rounded-xl border border-red-200 bg-red-50 p-4 text-slate-800 ${className}`}
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <p className="font-semibold text-red-900">Invalid or unsupported Canva link</p>
            <p className="text-red-700">
              Please check the URL. Supported format: <code className="bg-red-100 px-1 py-0.5 rounded">https://www.canva.com/design/...</code>
            </p>
            <p className="text-slate-600 break-all">{canvaUrl}</p>
          </div>
        </div>
      </div>
    );
  }

  // State A: REAL PREVIEW AVAILABLE
  if (previewState === 'REAL_PREVIEW' && realPreviewUrl) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-900 flex items-center justify-center">
          <img
            src={realPreviewUrl}
            alt={`Canva design ${effectiveDesignId}`}
            className="max-h-80 w-full object-contain rounded-lg"
          />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Real preview verified for Design ID: <strong className="text-slate-900">{effectiveDesignId}</strong>
            </span>
            <a
              href={canvaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#00c4cc] hover:bg-[#00b2b8] text-white px-3 py-1 text-xs font-semibold shadow-xs transition-colors"
            >
              Open in Canva
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="text-[11px] text-slate-500 break-all flex items-center gap-1">
            <Link2 className="h-3 w-3 text-slate-400 shrink-0" />
            <span>{canvaUrl}</span>
          </div>
        </div>
      </div>
    );
  }

  // State B: LINK SAVED, PREVIEW NOT AVAILABLE
  // Rule: Do not display another image.
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#00c4cc]/10 flex items-center justify-center text-[#00c4cc]">
            <Link2 className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Canva design link added</h4>
            {effectiveDesignId && (
              <p className="text-[11px] text-slate-500">
                Design ID: <strong className="text-slate-700">{effectiveDesignId}</strong>
              </p>
            )}
          </div>
        </div>
        <a
          href={canvaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#00c4cc] hover:bg-[#00b2b8] text-white px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-colors"
        >
          Open in Canva
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs text-slate-600 space-y-1.5">
        <p className="text-slate-500 text-[11px]">
          Preview unavailable. Open the design in Canva to view it.
        </p>
        <p className="text-[11px] font-mono text-slate-700 break-all select-all bg-white p-1.5 rounded border border-slate-200">
          {canvaUrl}
        </p>
      </div>
    </div>
  );
};

interface CanvaThumbnailTileProps {
  canvaUrl: string;
  designId?: string;
  campaignName?: string;
  className?: string;
  onClick?: () => void;
}

export const CanvaThumbnailTile: React.FC<CanvaThumbnailTileProps> = ({
  canvaUrl,
  designId,
  campaignName,
  className = '',
  onClick,
}) => {
  const effectiveDesignId =
    designId ||
    canvaUrl.match(/\/design\/([A-Za-z0-9_-]+)/i)?.[1] ||
    '';

  return (
    <div
      onClick={onClick}
      className={`relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 border border-slate-800 p-4 flex flex-col justify-between text-white cursor-pointer select-none group ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#00c4cc]/20 border border-[#00c4cc]/40 px-2.5 py-0.5 text-[10px] font-space font-bold text-[#00c4cc]">
          CANVA DESIGN
        </span>
        {effectiveDesignId && (
          <span className="font-mono text-[10px] text-slate-400 truncate max-w-[140px]">
            ID: {effectiveDesignId}
          </span>
        )}
      </div>

      <div className="text-center py-2 space-y-1">
        <div className="mx-auto w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#00c4cc] mb-1 group-hover:scale-110 transition-transform">
          <Link2 className="h-5 w-5" />
        </div>
        <p className="text-xs font-bold font-syne text-white truncate px-2">
          {campaignName || 'Canva Design Link'}
        </p>
        <p className="text-[10px] text-slate-400 font-sans">
          Preview unavailable. Click to view review or open in Canva.
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] font-space">
        <span className="text-[#ff5000] font-bold group-hover:underline">
          View AI Review &rarr;
        </span>
        <a
          href={canvaUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-[#00c4cc] hover:text-white transition-colors"
        >
          <span>Open in Canva</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

