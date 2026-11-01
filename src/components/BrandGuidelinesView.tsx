import React, { useState, useEffect } from 'react';
import { Brand, BrandParameter } from '../types';
import { api } from '../api';
import {
  Building2,
  Palette,
  Type,
  Maximize,
  Video,
  ShieldCheck,
  Check,
  AlertCircle,
} from 'lucide-react';

export const BrandGuidelinesView: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [parameters, setParameters] = useState<BrandParameter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBrands().then((bList) => {
      setBrands(bList);
      if (bList.length > 0) {
        setSelectedBrand(bList[0]);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      api.getParameters(selectedBrand.id).then(setParameters);
    }
  }, [selectedBrand]);

  if (loading || !selectedBrand) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading brand standards...</div>;
  }

  return (
    <div className="space-y-6 text-slate-900">
      {/* Top Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 text-slate-900 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#2E5629]">
            [ BRAND GOVERNANCE ]
          </span>
          <span className="text-slate-300">&bull;</span>
          <span className="text-xs font-space text-slate-500">Design System &amp; Parameter Rules</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-syne text-slate-900 tracking-tight">
          Brand Compliance Manual
        </h1>
        <p className="text-xs font-sans text-slate-500 max-w-xl mt-1 leading-relaxed">
          Reference official brand colors, logo safe zone requirements, typography constraints,
          and multimodal AI evaluation criteria.
        </p>
      </div>

      {/* Brand Selection Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {brands.map((b, bIdx) => {
          const isSelected = selectedBrand.id === b.id;
          return (
            <button
              key={`${b.id}-${bIdx}`}
              onClick={() => setSelectedBrand(b)}
              className={`flex items-center gap-3 rounded-2xl border p-4 transition-all text-left shrink-0 cursor-pointer ${
                isSelected
                  ? 'border-[#2E5629] bg-[#182817] text-white shadow-xs ring-2 ring-[#2E5629]/25'
                  : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50'
              }`}
            >
              <img
                src={b.logo}
                alt={b.name}
                className="h-10 w-10 rounded-xl object-contain bg-slate-900 p-1 ring-1 ring-slate-200"
              />
              <div>
                <h3 className={`text-xs font-bold font-syne ${isSelected ? 'text-white' : 'text-slate-900'}`}>{b.name}</h3>
                <span className={`text-[10px] font-space ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>{b.id}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Brand Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
        {/* Left Column: Design Rules & Architecture (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Color Palette Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-base font-bold font-syne text-slate-900 border-b border-slate-100 pb-3">
              <Palette className="h-4 w-4 text-[#2E5629]" />
              <span>Color Palette Architecture</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2 shadow-xs">
                <div
                  className="h-12 w-full rounded-xl shadow-inner border border-black/10"
                  style={{ backgroundColor: selectedBrand.colorPalette.primary }}
                />
                <div>
                  <span className="text-[10px] font-bold font-space uppercase text-slate-500 block">
                    Primary Brand Color
                  </span>
                  <span className="text-xs font-space font-bold text-slate-900">
                    {selectedBrand.colorPalette.primary}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2 shadow-xs">
                <div
                  className="h-12 w-full rounded-xl shadow-inner border border-black/10"
                  style={{ backgroundColor: selectedBrand.colorPalette.secondary }}
                />
                <div>
                  <span className="text-[10px] font-bold font-space uppercase text-slate-500 block">
                    Secondary Surface
                  </span>
                  <span className="text-xs font-space font-bold text-slate-900">
                    {selectedBrand.colorPalette.secondary}
                  </span>
                </div>
              </div>

              {selectedBrand.colorPalette.accent && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2 shadow-xs">
                  <div
                    className="h-12 w-full rounded-xl shadow-inner border border-black/10"
                    style={{ backgroundColor: selectedBrand.colorPalette.accent }}
                  />
                  <div>
                    <span className="text-[10px] font-bold font-space uppercase text-slate-500 block">
                      Accent Color
                    </span>
                    <span className="text-xs font-space font-bold text-slate-900">
                      {selectedBrand.colorPalette.accent}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Forbidden Colors */}
            {selectedBrand.colorPalette.forbidden &&
              selectedBrand.colorPalette.forbidden.length > 0 && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-900">
                  <span className="font-bold font-syne block mb-1">Forbidden Palette Colors:</span>
                  <div className="flex items-center gap-3">
                    {selectedBrand.colorPalette.forbidden.map((col, i) => (
                      <div key={i} className="flex items-center gap-1.5 font-space text-[11px] text-red-700">
                        <div
                          className="h-3.5 w-3.5 rounded-full border border-red-300"
                          style={{ backgroundColor: col }}
                        />
                        <span>{col} (Non-compliant)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Logo & Placement Rules */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-base font-bold font-syne text-slate-900 border-b border-slate-100 pb-3">
              <Maximize className="h-4 w-4 text-[#2E5629]" />
              <span>Logo &amp; Spatial Placement Rules</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="rounded-2xl bg-slate-50/70 p-4 border border-slate-200 shadow-xs">
                <span className="text-slate-500 font-space block mb-1">Minimum Safe Zone Margin</span>
                <span className="text-xl font-black font-space text-slate-900">
                  &ge;{selectedBrand.logoRules.safeZonePercent}%
                </span>
                <p className="text-[10px] font-space text-slate-500 mt-0.5">
                  Distance from canvas boundary edges
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50/70 p-4 border border-slate-200 shadow-xs">
                <span className="text-slate-500 font-space block mb-1">Approved Positions</span>
                <span className="text-xs font-bold font-space text-slate-900">
                  {selectedBrand.logoRules.approvedPositions.join(', ')}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5">
              <span className="font-bold font-syne text-slate-900 block">Prohibited Logo Alterations:</span>
              {selectedBrand.logoRules.prohibitedModifications.map((mod, i) => (
                <p key={i} className="text-[11px] font-space text-slate-500">
                  &bull; {mod}
                </p>
              ))}
            </div>
          </div>

          {/* Video & Motion Rules */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-base font-bold font-syne text-slate-900 border-b border-slate-100 pb-3">
              <Video className="h-4 w-4 text-[#2E5629]" />
              <span>Video &amp; Motion Creative Standards</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="rounded-2xl bg-slate-50/70 p-3.5 border border-slate-200 shadow-xs">
                <span className="text-slate-500 font-space block mb-1">Logo On Screen</span>
                <span className="font-bold font-space text-slate-900">
                  &ge;{selectedBrand.videoRules.logoMinDurationSec} seconds
                </span>
              </div>
              <div className="rounded-2xl bg-slate-50/70 p-3.5 border border-slate-200 shadow-xs">
                <span className="text-slate-500 font-space block mb-1">Product In First</span>
                <span className="font-bold font-space text-slate-900">
                  &le;{selectedBrand.videoRules.productAppearanceWithinSec} seconds
                </span>
              </div>
              <div className="rounded-2xl bg-slate-50/70 p-3.5 border border-slate-200 shadow-xs">
                <span className="text-slate-500 font-space block mb-1">Min Resolution</span>
                <span className="font-bold font-space text-slate-900">
                  {selectedBrand.videoRules.minResolution}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Brand Parameters (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold font-syne text-slate-900">
                AI Evaluation Parameters ({parameters.length})
              </h2>
              <p className="text-xs font-space text-slate-500">
                Evaluated deterministically by Gemini 2.5 Flash
              </p>
            </div>
            <ShieldCheck className="h-4 w-4 text-[#2E5629]" />
          </div>

          <div className="space-y-3">
            {parameters.map((p, pIdx) => (
              <div key={`${p.id}-${pIdx}`} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-xs space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold font-syne text-slate-900">{p.name}</span>
                  <span className="rounded-md bg-slate-900 text-white px-2 py-0.5 text-[10px] font-bold font-space">
                    {p.weight}% wt
                  </span>
                </div>
                <p className="text-[11px] font-space text-slate-500">{p.passCriteria}</p>
                <div className="flex justify-between text-[10px] font-space text-slate-500 pt-1.5 border-t border-slate-200">
                  <span>Threshold: {p.passThreshold}%</span>
                  <span className="uppercase font-bold text-[#FF5E97]">{p.severity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
