import React, { useState } from 'react';
import { BrandToolkit, Brand } from '../types';
import { api } from '../api';
import {
  Palette,
  Type,
  Maximize2,
  FileCheck,
  Share2,
  CheckCircle2,
  Plus,
  Trash2,
  Save,
  Info,
  HardDrive,
  CloudUpload,
  X,
} from 'lucide-react';

interface BrandToolkitEditorProps {
  brandId?: string;
  brandName?: string;
  initialToolkit?: BrandToolkit;
  initialColors?: { primary: string; secondary: string; forbidden: string[] };
  initialFonts?: { primaryFont: string; minHeadingSize: string; minBodySize: string };
  onSave?: (savedToolkit: BrandToolkit) => void;
  onChange?: (toolkit: BrandToolkit) => void;
  isInlineForm?: boolean;
}

const COMMON_FONTS = [
  'Inter',
  'Syne',
  'Space Grotesk',
  'Montserrat',
  'Outfit',
  'Plus Jakarta Sans',
  'Poppins',
  'Playfair Display',
  'Cinzel',
  'Roboto',
];

export const BrandToolkitEditor: React.FC<BrandToolkitEditorProps> = ({
  brandId,
  brandName = 'Brand',
  initialToolkit,
  initialColors,
  initialFonts,
  onSave,
  onChange,
  isInlineForm = false,
}) => {
  const [toolkit, setToolkitState] = useState<BrandToolkit>({
    colorTheme: {
      primary: initialColors?.primary || initialToolkit?.colorTheme?.primary || '#0F172A',
      secondary: initialColors?.secondary || initialToolkit?.colorTheme?.secondary || '#ff5000',
      darkBackground: initialToolkit?.colorTheme?.darkBackground || '#0A0F1D',
      lightBackground: initialToolkit?.colorTheme?.lightBackground || '#FFFFFF',
      prohibitedColors: initialColors?.forbidden || initialToolkit?.colorTheme?.prohibitedColors || ['#FF007A', '#00FF66'],
    },
    allowedFonts: initialToolkit?.allowedFonts || [
      initialFonts?.primaryFont || 'Inter',
      'Montserrat',
      'Syne',
    ],
    typographySpecs: {
      minHeadingPx: initialToolkit?.typographySpecs?.minHeadingPx || 28,
      minBodyPx: initialToolkit?.typographySpecs?.minBodyPx || 14,
      allowedHierarchy: initialToolkit?.typographySpecs?.allowedHierarchy || [
        'H1: Bold Brand Display',
        'H2: Medium Section Header',
        'Body: Regular Legible',
        'Legal: 11px Monospace or Sans',
      ],
    },
    safeMargins: {
      topPx: initialToolkit?.safeMargins?.topPx || 48,
      bottomPx: initialToolkit?.safeMargins?.bottomPx || 48,
      sidesPx: initialToolkit?.safeMargins?.sidesPx || 48,
      dangerZoneBufferPercent: initialToolkit?.safeMargins?.dangerZoneBufferPercent || 5,
    },
    disclaimerTemplate:
      initialToolkit?.disclaimerTemplate ||
      'Approved by Competent Authority. All rights reserved. Terms & conditions apply.',
    socialSpecs: initialToolkit?.socialSpecs || [
      { format: '4:5 Feed Portrait', width: 1080, height: 1350, maxTextDensityPercent: 20 },
      { format: '9:16 Story / Reel', width: 1080, height: 1920, maxTextDensityPercent: 15 },
      { format: '1:1 Square Post', width: 1080, height: 1080, maxTextDensityPercent: 20 },
    ],
  });

  const setToolkit = (newVal: BrandToolkit | ((prev: BrandToolkit) => BrandToolkit)) => {
    setToolkitState((prev) => {
      const updated = typeof newVal === 'function' ? newVal(prev) : newVal;
      if (onChange) {
        onChange(updated);
      }
      return updated;
    });
  };

  const [newFont, setNewFont] = useState('');
  const [newProhibitedColor, setNewProhibitedColor] = useState('#FF0055');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSyncingDrive, setIsSyncingDrive] = useState(false);
  const [syncDriveMsg, setSyncDriveMsg] = useState<string | null>(null);

  const handleSyncToDrive = async () => {
    if (!brandId) return;
    setIsSyncingDrive(true);
    setSyncDriveMsg(null);
    try {
      const res = await api.syncBrandToolkitToDrive(brandId);
      setSyncDriveMsg(res.message || 'Synced toolkit to Google Drive');
      setTimeout(() => setSyncDriveMsg(null), 4000);
    } catch (err: any) {
      setSyncDriveMsg(err.message || 'Sync failed');
      setTimeout(() => setSyncDriveMsg(null), 4000);
    } finally {
      setIsSyncingDrive(false);
    }
  };

  const handleAddFont = (fontToAdd: string) => {
    const f = fontToAdd.trim();
    if (!f || toolkit.allowedFonts.includes(f)) return;
    setToolkit((prev) => ({
      ...prev,
      allowedFonts: [...prev.allowedFonts, f],
    }));
    setNewFont('');
  };

  const handleRemoveFont = (fontToRemove: string) => {
    setToolkit((prev) => ({
      ...prev,
      allowedFonts: prev.allowedFonts.filter((f) => f !== fontToRemove),
    }));
  };

  const handleAddProhibitedColor = () => {
    const list = toolkit.colorTheme.prohibitedColors || [];
    if (list.includes(newProhibitedColor)) return;
    setToolkit((prev) => ({
      ...prev,
      colorTheme: {
        ...prev.colorTheme,
        prohibitedColors: [...(prev.colorTheme.prohibitedColors || []), newProhibitedColor],
      },
    }));
  };

  const handleRemoveProhibitedColor = (hex: string) => {
    setToolkit((prev) => ({
      ...prev,
      colorTheme: {
        ...prev.colorTheme,
        prohibitedColors: (prev.colorTheme.prohibitedColors || []).filter((c) => c !== hex),
      },
    }));
  };

  const handleSaveToolkit = async () => {
    if (!brandId) {
      if (onSave) onSave(toolkit);
      return;
    }

    setIsSaving(true);
    try {
      await api.updateBrandToolkit(brandId, {
        toolkit,
        colorPalette: {
          primary: toolkit.colorTheme.primary,
          secondary: toolkit.colorTheme.secondary,
          forbidden: toolkit.colorTheme.prohibitedColors,
        },
        typography: {
          primaryFont: toolkit.allowedFonts[0] || 'Inter',
          minHeadingSize: `${toolkit.typographySpecs.minHeadingPx}px`,
          minBodySize: `${toolkit.typographySpecs.minBodyPx}px`,
          rules: toolkit.allowedFonts.map((f) => `Approved font family: ${f}`),
        },
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      if (onSave) onSave(toolkit);
    } catch (err) {
      console.error('Failed to update brand toolkit:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-6 shadow-xs">
      {/* Toolkit Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-[#ff5000]">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold font-syne text-slate-900">
                Brand Toolkit &amp; Design System
              </h3>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold font-space text-slate-700">
                {brandName}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans">
              Color themes, allowed typography families, and safe margin specifications enforced during AI pre-flight.
            </p>
          </div>
        </div>

        {brandId && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSyncToDrive}
              disabled={isSyncingDrive}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 px-3.5 py-2 text-xs font-bold font-syne text-slate-700 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              title="Export brand guideline specifications to company Google Drive toolkit folder"
            >
              <CloudUpload className="h-3.5 w-3.5 text-blue-600" />
              <span>{isSyncingDrive ? 'Syncing Drive...' : 'Sync to Drive'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveToolkit}
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-[#ff5000] px-4 py-2 text-xs font-bold font-syne text-white transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSaving ? (
                <span>Saving...</span>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Toolkit Saved!</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Toolkit Specs</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {syncDriveMsg && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-3 text-xs text-blue-900 font-sans flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-blue-600 shrink-0" />
            <span>{syncDriveMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSyncDriveMsg(null)}
            className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 1. COLOR THEME CONFIGURATION */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold font-syne text-slate-900">
          <Palette className="h-4 w-4 text-[#ff5000]" />
          <span>1. Official Color Theme &amp; Swatches</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Primary Color */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-space block">
              Primary Brand Hex
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={toolkit.colorTheme.primary}
                onChange={(e) =>
                  setToolkit({
                    ...toolkit,
                    colorTheme: { ...toolkit.colorTheme, primary: e.target.value },
                  })
                }
                className="h-8 w-8 rounded-lg border border-slate-300 p-0.5 cursor-pointer"
              />
              <input
                type="text"
                value={toolkit.colorTheme.primary}
                onChange={(e) =>
                  setToolkit({
                    ...toolkit,
                    colorTheme: { ...toolkit.colorTheme, primary: e.target.value },
                  })
                }
                className="flex-1 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-space font-bold uppercase text-slate-900"
              />
            </div>
          </div>

          {/* Secondary Accent */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-space block">
              Secondary Accent Hex
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={toolkit.colorTheme.secondary}
                onChange={(e) =>
                  setToolkit({
                    ...toolkit,
                    colorTheme: { ...toolkit.colorTheme, secondary: e.target.value },
                  })
                }
                className="h-8 w-8 rounded-lg border border-slate-300 p-0.5 cursor-pointer"
              />
              <input
                type="text"
                value={toolkit.colorTheme.secondary}
                onChange={(e) =>
                  setToolkit({
                    ...toolkit,
                    colorTheme: { ...toolkit.colorTheme, secondary: e.target.value },
                  })
                }
                className="flex-1 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-space font-bold uppercase text-slate-900"
              />
            </div>
          </div>

          {/* Dark Background */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-space block">
              Dark Mode Background
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={toolkit.colorTheme.darkBackground}
                onChange={(e) =>
                  setToolkit({
                    ...toolkit,
                    colorTheme: { ...toolkit.colorTheme, darkBackground: e.target.value },
                  })
                }
                className="h-8 w-8 rounded-lg border border-slate-300 p-0.5 cursor-pointer"
              />
              <input
                type="text"
                value={toolkit.colorTheme.darkBackground}
                onChange={(e) =>
                  setToolkit({
                    ...toolkit,
                    colorTheme: { ...toolkit.colorTheme, darkBackground: e.target.value },
                  })
                }
                className="flex-1 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-space font-bold uppercase text-slate-900"
              />
            </div>
          </div>

          {/* Light Background */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-space block">
              Light Canvas Background
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={toolkit.colorTheme.lightBackground}
                onChange={(e) =>
                  setToolkit({
                    ...toolkit,
                    colorTheme: { ...toolkit.colorTheme, lightBackground: e.target.value },
                  })
                }
                className="h-8 w-8 rounded-lg border border-slate-300 p-0.5 cursor-pointer"
              />
              <input
                type="text"
                value={toolkit.colorTheme.lightBackground}
                onChange={(e) =>
                  setToolkit({
                    ...toolkit,
                    colorTheme: { ...toolkit.colorTheme, lightBackground: e.target.value },
                  })
                }
                className="flex-1 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-space font-bold uppercase text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Prohibited Colors */}
        <div className="rounded-xl border border-red-200 bg-red-50/50 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold font-space text-red-900 flex items-center gap-1.5">
              <span>Prohibited / Forbidden Brand Colors:</span>
              <span className="text-[10px] font-normal text-red-700">
                (AI will trigger immediate score deductions if detected)
              </span>
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={newProhibitedColor}
                onChange={(e) => setNewProhibitedColor(e.target.value)}
                className="h-6 w-6 rounded border border-red-300 p-0 cursor-pointer"
              />
              <button
                type="button"
                onClick={handleAddProhibitedColor}
                className="rounded-lg bg-red-800 text-white px-2.5 py-1 text-[10px] font-bold font-space hover:bg-red-900 transition-colors cursor-pointer"
              >
                + Add Prohibited Hex
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {toolkit.colorTheme.prohibitedColors.map((hex, hexIdx) => (
              <span
                key={`${hex}-${hexIdx}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-2.5 py-1 text-xs font-space font-bold text-red-700 shadow-2xs"
              >
                <span
                  className="h-3 w-3 rounded-full border border-black/20"
                  style={{ backgroundColor: hex }}
                />
                <span>{hex}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveProhibitedColor(hex)}
                  className="text-red-400 hover:text-red-700 cursor-pointer ml-1"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. ALLOWED FONTS & TYPOGRAPHY STANDARDS */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold font-syne text-slate-900">
            <Type className="h-4 w-4 text-[#ff5000]" />
            <span>2. Allowed Fonts &amp; Typography Toolkit</span>
          </div>
          <span className="text-[10px] font-space text-slate-500">
            Enforces typography consistency across all versions
          </span>
        </div>

        {/* Current Allowed Fonts Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {toolkit.allowedFonts.map((font, fIdx) => (
            <span
              key={`${font}-${fIdx}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold font-syne text-slate-800 shadow-2xs"
            >
              <span>{font}</span>
              <button
                type="button"
                onClick={() => handleRemoveFont(font)}
                className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                title="Remove font"
              >
                &times;
              </button>
            </span>
          ))}
        </div>

        {/* Quick Add Fonts */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-space font-bold text-slate-400 uppercase tracking-wider mr-1">
            Quick Add:
          </span>
          {COMMON_FONTS.filter((f) => !toolkit.allowedFonts.includes(f)).slice(0, 6).map((f, fIdx) => (
            <button
              key={`${f}-${fIdx}`}
              type="button"
              onClick={() => handleAddFont(f)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 hover:border-[#ff5000] hover:text-[#ff5000] transition-colors cursor-pointer"
            >
              + {f}
            </button>
          ))}
        </div>

        {/* Custom Font Input + Heading/Body Constraints */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={newFont}
              onChange={(e) => setNewFont(e.target.value)}
              placeholder="Custom font name (e.g. Satoshi)..."
              className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#ff5000] outline-hidden"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddFont(newFont);
                }
              }}
            />
            <button
              type="button"
              onClick={() => handleAddFont(newFont)}
              className="rounded-xl bg-slate-900 text-white px-3 py-1.5 text-xs font-bold font-syne hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            >
              Add Font
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-1.5">
            <label className="text-[10px] font-bold uppercase text-slate-500 font-space whitespace-nowrap">
              Min Headline Size:
            </label>
            <input
              type="number"
              value={toolkit.typographySpecs.minHeadingPx}
              onChange={(e) =>
                setToolkit({
                  ...toolkit,
                  typographySpecs: {
                    ...toolkit.typographySpecs,
                    minHeadingPx: Number(e.target.value),
                  },
                })
              }
              className="w-16 rounded border border-slate-300 bg-white px-2 py-0.5 text-xs font-space font-bold text-slate-900"
            />
            <span className="text-xs text-slate-400 font-space">px</span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-1.5">
            <label className="text-[10px] font-bold uppercase text-slate-500 font-space whitespace-nowrap">
              Min Body Size:
            </label>
            <input
              type="number"
              value={toolkit.typographySpecs.minBodyPx}
              onChange={(e) =>
                setToolkit({
                  ...toolkit,
                  typographySpecs: {
                    ...toolkit.typographySpecs,
                    minBodyPx: Number(e.target.value),
                  },
                })
              }
              className="w-16 rounded border border-slate-300 bg-white px-2 py-0.5 text-xs font-space font-bold text-slate-900"
            />
            <span className="text-xs text-slate-400 font-space">px</span>
          </div>
        </div>
      </div>

      {/* 3. SAFE MARGINS & SOCIAL BOUNDARIES */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold font-syne text-slate-900">
            <Maximize2 className="h-4 w-4 text-[#ff5000]" />
            <span>3. Boundary Safe Zones &amp; Aspect Dimensions</span>
          </div>
          <span className="text-[10px] font-space text-slate-500">
            Prevents mobile feed header and navigation bar cropping
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
            <label className="text-[10px] font-bold text-slate-500 font-space uppercase block">
              Top Margin Safe Zone
            </label>
            <div className="flex items-center gap-1 mt-1">
              <input
                type="number"
                value={toolkit.safeMargins.topPx}
                onChange={(e) =>
                  setToolkit({
                    ...toolkit,
                    safeMargins: { ...toolkit.safeMargins, topPx: Number(e.target.value) },
                  })
                }
                className="w-20 rounded border border-slate-300 bg-white px-2 py-1 text-xs font-space font-bold text-slate-900"
              />
              <span className="text-xs text-slate-400 font-space">px</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
            <label className="text-[10px] font-bold text-slate-500 font-space uppercase block">
              Bottom Margin Safe Zone
            </label>
            <div className="flex items-center gap-1 mt-1">
              <input
                type="number"
                value={toolkit.safeMargins.bottomPx}
                onChange={(e) =>
                  setToolkit({
                    ...toolkit,
                    safeMargins: { ...toolkit.safeMargins, bottomPx: Number(e.target.value) },
                  })
                }
                className="w-20 rounded border border-slate-300 bg-white px-2 py-1 text-xs font-space font-bold text-slate-900"
              />
              <span className="text-xs text-slate-400 font-space">px</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
            <label className="text-[10px] font-bold text-slate-500 font-space uppercase block">
              Sides Margin Safe Zone
            </label>
            <div className="flex items-center gap-1 mt-1">
              <input
                type="number"
                value={toolkit.safeMargins.sidesPx}
                onChange={(e) =>
                  setToolkit({
                    ...toolkit,
                    safeMargins: { ...toolkit.safeMargins, sidesPx: Number(e.target.value) },
                  })
                }
                className="w-20 rounded border border-slate-300 bg-white px-2 py-1 text-xs font-space font-bold text-slate-900"
              />
              <span className="text-xs text-slate-400 font-space">px</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
            <label className="text-[10px] font-bold text-slate-500 font-space uppercase block">
              Danger Buffer
            </label>
            <div className="flex items-center gap-1 mt-1">
              <input
                type="number"
                value={toolkit.safeMargins.dangerZoneBufferPercent}
                onChange={(e) =>
                  setToolkit({
                    ...toolkit,
                    safeMargins: {
                      ...toolkit.safeMargins,
                      dangerZoneBufferPercent: Number(e.target.value),
                    },
                  })
                }
                className="w-20 rounded border border-slate-300 bg-white px-2 py-1 text-xs font-space font-bold text-slate-900"
              />
              <span className="text-xs text-slate-400 font-space">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MANDATORY DISCLAIMER TEMPLATE */}
      <div className="space-y-2 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold font-syne text-slate-900 flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-[#ff5000]" />
            <span>4. Mandatory Disclaimer &amp; Accreditation Notice</span>
          </label>
          <span className="text-[10px] font-space text-slate-400">
            Required legal attribution in footer
          </span>
        </div>

        <textarea
          rows={2}
          value={toolkit.disclaimerTemplate}
          onChange={(e) =>
            setToolkit({ ...toolkit, disclaimerTemplate: e.target.value })
          }
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#ff5000] focus:ring-1 focus:ring-[#ff5000] outline-hidden resize-none font-sans"
          placeholder="Enter mandatory disclaimer, accreditation seals (e.g. NAAC A+, AICTE), and registration numbers..."
        />
      </div>
    </div>
  );
};
