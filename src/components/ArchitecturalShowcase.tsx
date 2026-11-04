import React, { useState, useEffect } from 'react';
import { Submission, Brand } from '../types';
import { useAuth } from '../context/AuthContext';
import { Floating3DBackground } from './Floating3DBackground';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Share2,
  Play,
  Pause,
  Pin,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';

interface ArchitecturalShowcaseProps {
  submissions: Submission[];
  brands: Brand[];
  onSelectSubmission: (submission: Submission) => void;
  onOpenScoreReport: (submission: Submission) => void;
  onOpenNewSubmission: () => void;
  onOpenArchitectureModal: () => void;
  onSwitchToWorkspace: (tab?: string) => void;
  onOpenDemo?: () => void;
}

export const GEMINI_VIDEO_PROMPT = `Cinematic photorealistic 4K video of a modern aesthetic cafe beverage and poster showcase. The hero subject is an artisanal Strawberry Matcha iced latte in a fluted textured glass tumbler: vivid emerald green ceremonial Japanese Uji matcha layer at the bottom, crisp whole milk and crystalline ice cubes in the middle, topped with a luscious, thick pastel strawberry cold foam cascading gently over the glass rim. Soft morning sunlight filters through cafe window glass onto warm oat and ivory cream surfaces. The camera performs a smooth, graceful slow-motion macro pan (0.95x speed, 60fps), capturing the swirling textures of rich chocolate iced coffee, golden espresso crema, dripping waffle cone gelato, and delicate pink raspberry macarons. Behind the glass, soft 3D light-pink circular rings float and drift with subtle ambient depth and gentle reflections. Color palette: Ceremonial Matcha Green (#2E5629), Soft Strawberry Blossom Pink (#FF5E97), Warm Ivory Cream (#FAF7EE). Hyper-detailed 8K textures, shallow depth of field (f/1.8), elegant minimalist editorial luxury aesthetic, studio lighting, zero glitches, zero distortion.`;

export const ArchitecturalShowcase: React.FC<ArchitecturalShowcaseProps> = ({
  submissions,
  brands,
  onOpenScoreReport,
  onOpenNewSubmission,
  onSwitchToWorkspace,
  onOpenDemo,
}) => {
  const { currentUser } = useAuth();

  // "keep the forth car page as the fix" - start at 4th card (0-indexed: 3 = Strawberry Matcha)
  const [currentIndex, setCurrentIndex] = useState(3);
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('ALL');
  const [isCopiedShare, setIsCopiedShare] = useState(false);
  const [isCopiedPrompt, setIsCopiedPrompt] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isFixedCard, setIsFixedCard] = useState(false);

  // Main page video loop ref (continuous high-definition video playing on loop at 0.95x speed)
  const cafeVideoRef = React.useRef<HTMLVideoElement>(null);

  // Ensure cafe video autoplays on loop with 0.95x playback rate (5% decreased speed)
  useEffect(() => {
    if (cafeVideoRef.current) {
      cafeVideoRef.current.playbackRate = 0.95;
      cafeVideoRef.current.play().catch(() => {});
    }
  }, []);

  // Filtered submissions
  const activeSubmissions = submissions.filter((s) => {
    if (selectedBrandFilter === 'ALL') return true;
    return s.brandId === selectedBrandFilter;
  });

  const safeIndex =
    activeSubmissions.length > 0
      ? Math.min(currentIndex, activeSubmissions.length - 1)
      : 0;
  const activeSub = activeSubmissions[safeIndex] || submissions[0] || null;

  // Auto-change page every 5 seconds (5000ms)
  useEffect(() => {
    if (!isAutoPlaying || isFixedCard || activeSubmissions.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSubmissions.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isFixedCard, activeSubmissions.length]);

  const handleNext = () => {
    if (activeSubmissions.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % activeSubmissions.length);
  };

  const handlePrev = () => {
    if (activeSubmissions.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + activeSubmissions.length) % activeSubmissions.length);
  };

  const handleShareClick = () => {
    if (navigator.clipboard && activeSub) {
      navigator.clipboard.writeText(`${window.location.origin}?subId=${activeSub.id}`);
      setIsCopiedShare(true);
      setTimeout(() => setIsCopiedShare(false), 2000);
    }
  };

  const handleCopyPrompt = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(GEMINI_VIDEO_PROMPT);
      setIsCopiedPrompt(true);
      setTimeout(() => setIsCopiedPrompt(false), 2500);
    }
  };

  // Curated coffee, cafe & cute posters
  const getPosterImage = (sub: Submission | null): string => {
    if (!sub) return '/assets/aistudio/image_4178a031.png';

    const latestVer = sub.versions?.[sub.versions.length - 1];
    const file = latestVer?.files?.[0];
    if (file?.fileUrl && file.fileUrl.startsWith('data:image')) {
      return file.fileUrl;
    }

    // Direct authentic mappings to user-uploaded cafe & coffee assets
    const name = (sub.campaignName || '').toLowerCase();

    if (name.includes('morning mood') || name.includes('ferrero') || sub.id === 'SUB-101') {
      return '/assets/aistudio/image_b41c8e2c.png';
    }
    if (name.includes('noon coffee') || name.includes('latte') || sub.id === 'SUB-102') {
      return '/assets/aistudio/image_89d665aa.png';
    }
    if (name.includes('matcha time') || name.includes('tokyo') || sub.id === 'SUB-103') {
      return '/assets/aistudio/image_3cdcff8b.png';
    }
    // 4th card: Strawberry Matcha Signature
    if (name.includes('strawberry') || name.includes('signature') || sub.id === 'SUB-104') {
      return '/assets/aistudio/image_4178a031.png';
    }
    if (name.includes('cheesecake') || name.includes('dobong') || sub.id === 'SUB-105') {
      return '/assets/aistudio/image_36da4e00.png';
    }
    // Dulce Tierra Gelato (Amor Helado)
    if (name.includes('helado') || name.includes('dulce tierra') || sub.id === 'SUB-106') {
      return '/assets/aistudio/image_2db42f96.png';
    }
    if (name.includes('macaron') || name.includes('framboise') || sub.id === 'SUB-107') {
      return '/assets/aistudio/image_3de7b998.png';
    }
    if (name.includes('revitalizer') || name.includes('ritual') || name.includes('porto') || sub.id === 'SUB-108') {
      return '/assets/aistudio/image_91ac2035.png';
    }

    if (file?.thumbnailUrl) return file.thumbnailUrl;
    if (file?.fileUrl) return file.fileUrl;
    return '/assets/aistudio/image_4178a031.png';
  };

  const isGatePassed = (activeSub?.overallAiScore || 94) >= 85;

  return (
    <div className="relative h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#FAF7EE] text-[#182817] flex flex-col justify-between p-2 sm:p-3 lg:p-4 font-sans select-none box-border">
      {/* Calm ambient background with moving 3D light-pink rings (visible through transparent frosted glass) */}
      <Floating3DBackground />

      {/* =========================================================================
          PALPABLE FROSTED GLASS SHOWCASE CONTAINER (Ruang Edit style)
          Crisp specular white bevels, deep 3D acrylic drop-shadow, backdrop blur
          ========================================================================= */}
      <main className="relative z-10 mx-auto w-full max-w-5xl xl:max-w-6xl flex-1 min-h-0 rounded-[28px] sm:rounded-[36px] overflow-hidden bg-gradient-to-b from-white/60 via-white/35 to-white/45 backdrop-blur-3xl backdrop-saturate-150 border border-white/90 shadow-[0_30px_70px_-15px_rgba(255,140,175,0.22),inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_-2px_3px_rgba(255,255,255,0.4)] flex flex-col justify-between p-3 sm:p-4 lg:p-5">
        {/* Specular Diagonal Glass Sheen Reflection */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-[160%] h-48 bg-gradient-to-b from-white/35 via-white/10 to-transparent rotate-[-22deg] blur-xs" />
        
        {/* ---------------------------------------------------------------------
            GLASS TOP BAR (Compact, cleanly spaced)
            --------------------------------------------------------------------- */}
        <header className="relative z-20 flex items-center justify-between gap-2 pb-2.5 border-b border-white/60 shrink-0">
          {/* Brand Mark Pill with Pink Dot */}
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/80 backdrop-blur-md px-3 py-0.5 text-[11px] font-space font-semibold uppercase tracking-wider text-[#182817] border border-white/90 shadow-xs flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#FF5E97]" />
              {activeSub?.brandName || 'Strawberry Blossom Cafe'}
            </span>
            <span className="text-[#677A65] text-[11px] hidden md:inline font-space">
              Compliance Pre-Flight
            </span>
          </div>

          {/* Right Controls: Auto 5s, Brand Filter, Video Prompt & Upload */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Auto-Rotation 5s Status & Fix/Pin Button */}
            <button
              type="button"
              onClick={() => setIsFixedCard(!isFixedCard)}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-md border transition cursor-pointer ${
                isFixedCard
                  ? 'bg-[#FF5E97]/25 text-[#C92461] border-[#FF5E97]/40 shadow-xs'
                  : 'bg-white/70 text-[#182817] border-white/90 hover:bg-white shadow-xs'
              }`}
              title={isFixedCard ? 'Click to resume 5s auto-rotation' : 'Click to fix Card 4 in place'}
            >
              <Pin className={`h-3 w-3 ${isFixedCard ? 'fill-current' : ''}`} />
              <span className="font-space">
                {isFixedCard ? 'Fixed: Card ' + (safeIndex + 1) : 'Auto: 5s'}
              </span>
            </button>

            {/* Video Prompt Copy Button */}
            <button
              type="button"
              onClick={handleCopyPrompt}
              className="hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/70 hover:bg-white text-[#182817] border border-white/90 transition cursor-pointer shadow-xs"
              title="Copy Gemini Video Prompt"
            >
              {isCopiedPrompt ? (
                <>
                  <Check className="h-3 w-3 text-emerald-600" />
                  <span className="font-space text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 text-[#FF5E97]" />
                  <span className="font-space">Prompt</span>
                </>
              )}
            </button>

            {/* Brand Filter */}
            <select
              aria-label="Filter showcase by brand"
              value={selectedBrandFilter}
              onChange={(e) => {
                setSelectedBrandFilter(e.target.value);
                setCurrentIndex(0);
              }}
              className="bg-white/70 backdrop-blur-md text-[#182817] text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-white/90 cursor-pointer focus:outline-none shadow-xs"
            >
              <option value="ALL">All Cafe Brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            {/* Upload Button */}
            <button
              type="button"
              onClick={onOpenNewSubmission}
              className="flex items-center gap-1 rounded-full bg-[#182817] hover:bg-[#253D23] text-white px-3 py-0.5 text-[11px] font-bold font-syne shadow-xs transition-all cursor-pointer"
            >
              <span>+ Upload</span>
            </button>
          </div>
        </header>

        {/* ---------------------------------------------------------------------
            STAGE CENTER: 3-COLUMN SHOWCASE (Video on Left, Editorial in Center, Poster Card on Right)
            Enables user to see BOTH the live video and the poster cards simultaneously
            --------------------------------------------------------------------- */}
        <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-4 items-center py-1 sm:py-1.5 min-h-0 overflow-hidden">
          
          {/* Column 1 (Left): Live Cafe Film Video on Continuous Loop */}
          <div className="md:col-span-4 lg:col-span-4 flex flex-col justify-center items-center h-full min-h-0">
            <div className="flex items-center gap-1.5 mb-1.5 px-2.5 py-0.5 rounded-full bg-white/70 backdrop-blur-md border border-white/90 shadow-2xs text-[10px] font-space font-semibold text-[#182817]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF5E97] animate-pulse" />
              <span>Live Cafe Film (Loop)</span>
            </div>

            <div className="relative h-full w-full max-w-[270px] sm:max-w-[300px] lg:max-w-[330px] max-h-[220px] sm:max-h-[260px] lg:max-h-[295px] rounded-[22px] sm:rounded-[26px] overflow-hidden border border-white/90 shadow-[0_12px_32px_rgba(255,94,151,0.12),inset_0_1px_2px_rgba(255,255,255,0.95)] bg-white/75 group flex items-center justify-center p-2">
              <video
                ref={cafeVideoRef}
                src="/assets/aistudio/gemini_generated_video_b1c402ce_c5ef3847.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="h-full w-full object-cover rounded-[16px] sm:rounded-[20px] filter contrast-[1.03] transition-all duration-500 cursor-pointer"
                onClick={() => {
                  if (!cafeVideoRef.current) return;
                  if (cafeVideoRef.current.paused) {
                    cafeVideoRef.current.play();
                  } else {
                    cafeVideoRef.current.pause();
                  }
                }}
                title="Aesthetic Cafe Film Loop (Click to play/pause)"
              />
            </div>
          </div>

          {/* Column 2 (Center): Clean Editorial Content, 85% Score Gate & Actions */}
          <div className="md:col-span-4 lg:col-span-4 flex flex-col justify-center space-y-1.5 sm:space-y-2 text-left min-h-0 px-1 sm:px-2">
            {/* Tagline */}
            <div className="inline-flex items-center gap-1 rounded-full bg-white/75 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-space font-semibold uppercase tracking-wider text-[#182817] border border-white/90 shadow-xs w-fit">
              <Sparkles className="h-2.5 w-2.5 text-[#FF5E97]" />
              <span>Vision Compliance &bull; 85% Gate</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-base sm:text-lg lg:text-xl font-extrabold font-serif tracking-tight text-[#182817] leading-snug line-clamp-2">
              {activeSub?.campaignName || 'Strawberry Matcha Signature Cafe'}
            </h1>

            {/* Description Body */}
            <p className="text-[11px] sm:text-xs font-sans text-[#526350] leading-relaxed line-clamp-2">
              {activeSub?.description ||
                'Automated multimodal evaluation verifying logo safe margin, typography hierarchy, Pantone color alignment, and contact information compliance in under 2.4s.'}
            </p>

            {/* Creator Attribution */}
            <p className="text-[10px] font-space text-[#7A8E78] italic">
              - created by {activeSub?.userName || 'Chetana Mayaza'} -
            </p>

            {/* Gate Score & Supervisor Status Card */}
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/70 border border-white/90 shadow-xs">
              <span className="text-xl font-black font-syne text-[#182817]">
                {activeSub?.overallAiScore || 93}%
              </span>
              <div className="flex flex-col">
                <span
                  className={`text-[9px] font-space font-bold uppercase tracking-wider px-2 py-0.2 rounded-full w-fit ${
                    isGatePassed
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {isGatePassed ? 'Passed AI Gate (≥85%)' : 'Needs Rework (<85%)'}
                </span>
                <span className="text-[10px] text-[#677A65] font-sans mt-0.5 line-clamp-1">
                  {isGatePassed
                    ? 'Verified for Elena Rostova sign-off'
                    : 'Requires creator correction'}
                </span>
              </div>
            </div>

            {/* Glass Pill Actions (Explore / Watch Demo / Share) */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => activeSub && onOpenScoreReport(activeSub)}
                className="flex items-center gap-1 rounded-full bg-[#182817] hover:bg-[#253D23] text-white px-3 py-1.5 text-xs font-bold font-syne shadow-sm transition-all cursor-pointer"
              >
                <span>Explore Audit</span>
                <ChevronRight className="h-3 w-3" />
              </button>

              {onOpenDemo && (
                <button
                  type="button"
                  onClick={onOpenDemo}
                  className="flex items-center gap-1 rounded-full bg-[#FFF0F5] hover:bg-[#FFE4ED] text-[#D82666] px-3 py-1.5 text-xs font-bold font-syne border border-[#FFD0E0] shadow-xs transition-all cursor-pointer"
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span>Watch Demo</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleShareClick}
                className="h-7 w-7 rounded-full bg-white/80 hover:bg-white text-[#182817] border border-white/90 shadow-xs flex items-center justify-center transition cursor-pointer"
                title="Copy share link"
              >
                {isCopiedShare ? <Check className="h-3 w-3 text-emerald-600" /> : <Share2 className="h-3 w-3" />}
              </button>
            </div>
          </div>

          {/* Column 3 (Right): Creative Poster Card / Postcard Display */}
          <div className="md:col-span-4 lg:col-span-4 flex flex-col justify-center items-center h-full min-h-0">
            <div className="flex items-center justify-between w-full max-w-[260px] sm:max-w-[290px] lg:max-w-[320px] mb-1.5 px-3 py-0.5 rounded-full bg-white/70 backdrop-blur-md border border-white/90 shadow-2xs text-[10px] font-space font-semibold text-[#182817]">
              <span className="truncate max-w-[170px]">{activeSub?.campaignName || 'Poster Postcard'}</span>
              <span className="text-[#FF5E97] font-bold shrink-0">Card {safeIndex + 1} of {activeSubmissions.length}</span>
            </div>

            <div className="relative h-full w-full max-w-[260px] sm:max-w-[290px] lg:max-w-[320px] max-h-[220px] sm:max-h-[260px] lg:max-h-[295px] rounded-[22px] sm:rounded-[26px] overflow-hidden border border-white/90 shadow-[0_12px_32px_rgba(255,94,151,0.12),inset_0_1px_2px_rgba(255,255,255,0.95)] bg-white/75 group flex items-center justify-center p-2">
              <img
                key={activeSub?.id || safeIndex}
                src={getPosterImage(activeSub)}
                alt={activeSub?.campaignName || 'Showcase'}
                className="h-full w-full object-contain rounded-[16px] sm:rounded-[20px] filter contrast-[1.02] transition-all duration-500"
              />

              {/* Floating Top Arrow Badge in Circular Glass Pill */}
              <button
                type="button"
                onClick={() => activeSub && onOpenScoreReport(activeSub)}
                className="absolute top-3.5 left-3.5 h-7 w-7 rounded-full bg-white/85 hover:bg-white text-[#182817] border border-white backdrop-blur-md flex items-center justify-center shadow-xs transition-all duration-200 hover:scale-105 cursor-pointer z-10"
                title="View Full Compliance Audit"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>

              {/* Discreet Card Label */}
              <span className="absolute bottom-3 right-3 rounded-full bg-black/65 backdrop-blur-md px-2 py-0.5 text-[9px] font-space text-white/95 z-10">
                Postcard {safeIndex + 1}
              </span>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------------
            STAGE BOTTOM CONTROLS: 5-SECOND AUTO-ROTATION CAROUSEL STRIP
            --------------------------------------------------------------------- */}
        <footer className="relative z-20 pt-2 border-t border-white/50 flex items-center justify-between gap-3 text-[#182817] shrink-0">
          {/* Left: Previous / Next & 5-Second Timer Status */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="h-7 w-7 rounded-full bg-white/80 hover:bg-white text-[#182817] border border-white/90 shadow-xs flex items-center justify-center transition cursor-pointer"
              title="Previous poster"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-[11px] text-[#526350] font-space font-medium tracking-wider hover:text-[#182817] flex items-center gap-1"
              title={isAutoPlaying ? 'Pause 5s auto-play' : 'Resume 5s auto-play'}
            >
              <span>{safeIndex + 1} of {activeSubmissions.length}</span>
              {isAutoPlaying && !isFixedCard ? (
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF5E97] animate-pulse" />
              ) : (
                <Pause className="h-2 w-2 text-[#7A8E78]" />
              )}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="h-7 w-7 rounded-full bg-white/80 hover:bg-white text-[#182817] border border-white/90 shadow-xs flex items-center justify-center transition cursor-pointer"
              title="Next poster"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Center: Pagination Progress Dots (Card 4 highlighted by default) */}
          <div className="flex items-center gap-1">
            {activeSubmissions.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  safeIndex === idx
                    ? 'w-5 bg-[#FF5E97]'
                    : 'w-1.5 bg-[#182817]/25 hover:bg-[#182817]/50'
                }`}
                title={`Go to poster ${idx + 1}`}
              />
            ))}
          </div>

          {/* Right: Quick link to My Posters */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSwitchToWorkspace('creatives')}
              className="text-[11px] font-bold font-syne text-[#FF5E97] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>My Posters</span>
              <span>&rarr;</span>
            </button>
          </div>
        </footer>
      </main>

      {/* =========================================================================
          SUB-FOOTER SENTENCE END: with "made by zaveriya and all @ copyright claimed" in small size
          ========================================================================= */}
      <div className="relative z-10 flex flex-wrap items-center justify-between pt-1.5 px-1 text-[10px] font-space text-[#677A65] shrink-0 gap-2">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-[#182817]">ZReview Studio</span>
          <span>&bull;</span>
          <span>5-Second Inspection Cycle &bull; 85% Approval Gate</span>
        </div>
        <div className="text-[10px] font-space text-[#7A8E78] tracking-wider">
          made by zaveriya and all @ copyright claimed
        </div>
      </div>
    </div>
  );
};
