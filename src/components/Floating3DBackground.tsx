import React from 'react';

interface Floating3DBackgroundProps {
  className?: string;
}

export const Floating3DBackground: React.FC<Floating3DBackgroundProps> = ({ className = '' }) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden z-0 select-none bg-[#FAF7EE] ${className}`}
      aria-hidden="true"
    >
      {/* Calm ambient background wash (soft pastel cream, matcha and strawberry tint) */}
      <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#E2F0DE]/45 to-[#BED8B9]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[#FFE4ED]/50 to-[#FFD0E0]/25 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[900px] rounded-full bg-radial from-white/40 via-transparent to-transparent blur-2xl pointer-events-none" />

      {/* SVG Definitions for 3D Glossy Light-Pink Ring Gradients (no spirals, purely geometric circular rings) */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <linearGradient id="pinkRingGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#FFD6E5" stopOpacity="0.85" />
            <stop offset="65%" stopColor="#FFA3C5" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#FF6B9E" stopOpacity="0.7" />
          </linearGradient>

          <linearGradient id="pinkRingGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF0F5" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#FFCAD4" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#FF8DAF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#E8457F" stopOpacity="0.65" />
          </linearGradient>

          <linearGradient id="pinkRingGrad3" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#FFB8D2" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF5E97" stopOpacity="0.65" />
          </linearGradient>

          <filter id="pinkRingGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="16" stdDeviation="22" floodColor="#FF5E97" floodOpacity="0.22" />
          </filter>
        </defs>
      </svg>

      {/* =========================================================================
          MOVING LIGHT-PINK RINGS (Torus / Ring geometry drifting smoothly)
          ========================================================================= */}
      
      {/* Moving Ring 1: Large Light-Pink 3D Ring (Top-Right / Behind Glass) */}
      <div
        className="absolute -top-10 right-4 sm:top-8 sm:right-24 w-56 h-56 sm:w-72 sm:h-72 animate-torus-drift-1 opacity-80 pointer-events-none transition-transform"
        style={{ animationDuration: '18s' }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ filter: 'url(#pinkRingGlow)' }}>
          <circle
            cx="100"
            cy="100"
            r="72"
            fill="none"
            stroke="url(#pinkRingGrad1)"
            strokeWidth="24"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Moving Ring 2: Medium Light-Pink Ring (Bottom-Left / Floating upward) */}
      <div
        className="absolute bottom-8 -left-8 sm:bottom-16 sm:left-16 w-44 h-44 sm:w-60 sm:h-60 animate-torus-drift-2 opacity-75 pointer-events-none transition-transform"
        style={{ animationDuration: '22s' }}
      >
        <svg viewBox="0 0 180 180" className="w-full h-full" style={{ filter: 'url(#pinkRingGlow)' }}>
          <circle
            cx="90"
            cy="90"
            r="64"
            fill="none"
            stroke="url(#pinkRingGrad2)"
            strokeWidth="20"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Moving Ring 3: Delicate Petite Ring (Mid-Right / Floating Accent) */}
      <div
        className="absolute top-1/2 -right-6 sm:right-16 w-32 h-32 sm:w-40 sm:h-40 animate-float-secondary opacity-70 pointer-events-none transition-transform"
        style={{ animationDuration: '14s' }}
      >
        <svg viewBox="0 0 140 140" className="w-full h-full" style={{ filter: 'url(#pinkRingGlow)' }}>
          <circle
            cx="70"
            cy="70"
            r="50"
            fill="none"
            stroke="url(#pinkRingGrad3)"
            strokeWidth="16"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Moving Ring 4: Soft Accent Ring (Top-Left / Subtle Horizon) */}
      <div
        className="absolute top-14 left-8 sm:top-20 sm:left-24 w-28 h-28 sm:w-36 sm:h-36 animate-float-small opacity-60 pointer-events-none transition-transform"
        style={{ animationDuration: '16s' }}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full" style={{ filter: 'url(#pinkRingGlow)' }}>
          <circle
            cx="60"
            cy="60"
            r="44"
            fill="none"
            stroke="url(#pinkRingGrad1)"
            strokeWidth="14"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};
