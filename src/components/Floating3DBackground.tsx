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

      {/* SVG Definitions for 3D GLOSSY Light-Pink Ring Gradients & Specular Highlights */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          {/* Glossy Torus Gradient 1: Multi-stop reflective acrylic shading */}
          <linearGradient id="glossyPinkRingGrad1" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
            <stop offset="12%" stopColor="#FFF2F7" stopOpacity="0.95" />
            <stop offset="28%" stopColor="#FFC2D8" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#FF6B9E" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#FF4387" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#C91B58" stopOpacity="0.8" />
          </linearGradient>

          {/* Glossy Torus Gradient 2: Reverse angle for secondary ring */}
          <linearGradient id="glossyPinkRingGrad2" x1="85%" y1="0%" x2="15%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="15%" stopColor="#FFE5EF" stopOpacity="0.92" />
            <stop offset="35%" stopColor="#FFB3CE" stopOpacity="0.88" />
            <stop offset="70%" stopColor="#FF5E97" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#D82666" stopOpacity="0.8" />
          </linearGradient>

          {/* Specular Glint Arc Gradient: Razor-sharp white reflection streak */}
          <linearGradient id="specularGlintGrad" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Dual Drop Shadow: Bottom Pink Radiance + Top Crisp Specular Glow */}
          <filter id="glossyRingFilter" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="16" stdDeviation="20" floodColor="#FF5E97" floodOpacity="0.35" />
            <feDropShadow dx="0" dy="-3" stdDeviation="5" floodColor="#FFFFFF" floodOpacity="0.45" />
          </filter>
        </defs>
      </svg>

      {/* =========================================================================
          GLOSSY 3D LIGHT-PINK RINGS (With specular white arcs and rich torus depth)
          ========================================================================= */}
      
      {/* Moving Ring 1: Large Glossy 3D Torus (Top-Right / Gliding gracefully behind frosted glass) */}
      <div
        className="absolute -top-12 right-2 sm:top-6 sm:right-20 w-64 h-64 sm:w-80 sm:h-80 animate-torus-drift-1 opacity-90 pointer-events-none transition-transform"
        style={{ animationDuration: '20s', filter: 'drop-shadow(0 20px 30px rgba(255, 94, 151, 0.28))' }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ filter: 'url(#glossyRingFilter)' }}>
          {/* Main 3D Glossy Torus Body */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="url(#glossyPinkRingGrad1)"
            strokeWidth="26"
            strokeLinecap="round"
          />
          {/* Specular White Rim Streak (Creates real glossy resin / acrylic shine) */}
          <path
            d="M 45,85 A 70,70 0 0,1 125,32"
            fill="none"
            stroke="url(#specularGlintGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            style={{ filter: 'blur(0.8px)' }}
          />
          {/* Inner ambient rim light */}
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      {/* Moving Ring 2: Medium Glossy 3D Torus (Bottom-Left / Floating upward) */}
      <div
        className="absolute bottom-6 -left-10 sm:bottom-14 sm:left-14 w-52 h-52 sm:w-68 sm:h-68 animate-torus-drift-2 opacity-85 pointer-events-none transition-transform"
        style={{ animationDuration: '24s', filter: 'drop-shadow(0 18px 28px rgba(255, 94, 151, 0.25))' }}
      >
        <svg viewBox="0 0 180 180" className="w-full h-full" style={{ filter: 'url(#glossyRingFilter)' }}>
          {/* Main 3D Glossy Body */}
          <circle
            cx="90"
            cy="90"
            r="62"
            fill="none"
            stroke="url(#glossyPinkRingGrad2)"
            strokeWidth="22"
            strokeLinecap="round"
          />
          {/* Specular White Curve */}
          <path
            d="M 40,75 A 62,62 0 0,1 115,30"
            fill="none"
            stroke="url(#specularGlintGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            style={{ filter: 'blur(0.7px)' }}
          />
          {/* Outer edge highlight */}
          <circle
            cx="90"
            cy="90"
            r="72"
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Moving Ring 3: Delicate Petite Glossy Ring (Mid-Right / Floating Accent) */}
      <div
        className="absolute top-1/2 -right-8 sm:right-12 w-36 h-36 sm:w-44 sm:h-44 animate-float-secondary opacity-80 pointer-events-none transition-transform"
        style={{ animationDuration: '15s', filter: 'drop-shadow(0 14px 22px rgba(255, 94, 151, 0.22))' }}
      >
        <svg viewBox="0 0 140 140" className="w-full h-full" style={{ filter: 'url(#glossyRingFilter)' }}>
          <circle
            cx="70"
            cy="70"
            r="48"
            fill="none"
            stroke="url(#glossyPinkRingGrad1)"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M 32,58 A 48,48 0 0,1 90,24"
            fill="none"
            stroke="url(#specularGlintGrad)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Moving Ring 4: Soft Horizon Glossy Ring (Top-Left / Gentle Presence) */}
      <div
        className="absolute top-12 left-6 sm:top-18 sm:left-20 w-32 h-32 sm:w-40 sm:h-40 animate-float-small opacity-75 pointer-events-none transition-transform"
        style={{ animationDuration: '17s', filter: 'drop-shadow(0 12px 20px rgba(255, 94, 151, 0.2))' }}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full" style={{ filter: 'url(#glossyRingFilter)' }}>
          <circle
            cx="60"
            cy="60"
            r="42"
            fill="none"
            stroke="url(#glossyPinkRingGrad2)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 28,50 A 42,42 0 0,1 78,20"
            fill="none"
            stroke="url(#specularGlintGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};
