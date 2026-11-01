/**
 * Generates high-fidelity SVG assets for ZARVIS Enterprise Brand Clients
 */
import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'public/assets/posters');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Apex Global Technologies - NextGen Sovereign AI Summit 2026 (APPROVED Poster, 1080x1350)
const apexSummitSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="100%" height="100%">
  <defs>
    <linearGradient id="apexBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050814" />
      <stop offset="40%" stop-color="#0B132B" />
      <stop offset="100%" stop-color="#1C2541" />
    </linearGradient>
    <linearGradient id="apexCyan" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00F2FE" />
      <stop offset="100%" stop-color="#4FACFE" />
    </linearGradient>
    <linearGradient id="apexOrange" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF5000" />
      <stop offset="100%" stop-color="#FF8A00" />
    </linearGradient>
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Deep Obsidian Space Canvas -->
  <rect width="800" height="1000" fill="url(#apexBg)" />

  <!-- Subtle Neural Grid Pattern -->
  <g opacity="0.08" stroke="#00F2FE" stroke-width="1">
    <line x1="0" y1="200" x2="800" y2="200" />
    <line x1="0" y1="400" x2="800" y2="400" />
    <line x1="0" y1="600" x2="800" y2="600" />
    <line x1="0" y1="800" x2="800" y2="800" />
    <line x1="200" y1="0" x2="200" y2="1000" />
    <line x1="400" y1="0" x2="400" y2="1000" />
    <line x1="600" y1="0" x2="600" y2="1000" />
  </g>

  <!-- Cybernetic Horizon Mesh -->
  <path d="M 0,650 Q 250,580 400,660 T 800,600 L 800,1000 L 0,1000 Z" fill="#00F2FE" opacity="0.04" />

  <!-- Header: Apex Brand Identity (Top Left) -->
  <g transform="translate(60, 60)">
    <rect width="44" height="44" rx="12" fill="url(#apexCyan)" />
    <path d="M 22,10 L 34,34 L 10,34 Z" fill="#050814" />
    <circle cx="22" cy="24" r="3.5" fill="#00F2FE" />
    <text x="60" y="28" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="24" fill="#FFFFFF" letter-spacing="-0.5">APEX GLOBAL</text>
    <text x="60" y="42" font-family="'Space Grotesk', monospace" font-size="11" fill="#00F2FE" letter-spacing="2">ENTERPRISE CLOUD &amp; AI</text>
  </g>

  <!-- Live Status Badge (Top Right) -->
  <g transform="translate(620, 65)">
    <rect width="120" height="32" rx="16" fill="#1C2541" stroke="#00F2FE" stroke-width="1.2" opacity="0.9" />
    <circle cx="18" cy="16" r="4.5" fill="#00F2FE" />
    <text x="32" y="20" font-family="'Space Grotesk', monospace" font-size="11" font-weight="700" fill="#FFFFFF" letter-spacing="1">GENEVA 2026</text>
  </g>

  <!-- Big Central Typographic Showcase -->
  <g transform="translate(60, 240)">
    <rect x="0" y="0" width="180" height="26" rx="6" fill="url(#apexOrange)" />
    <text x="12" y="18" font-family="'Space Grotesk', monospace" font-size="12" font-weight="800" fill="#FFFFFF" letter-spacing="1.5">GLOBAL KEYNOTE SUMMIT</text>
    
    <text x="0" y="90" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="68" fill="#FFFFFF" letter-spacing="-2">Sovereign AI</text>
    <text x="0" y="160" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="68" fill="url(#apexCyan)" letter-spacing="-2">&amp; Superclusters</text>

    <text x="0" y="215" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" fill="#94A3B8" font-weight="400">
      Architecting high-throughput resilient AI infrastructure for the next billion tokens.
    </text>
  </g>

  <!-- Central Visual: Floating Neural Supercomputer Node -->
  <g transform="translate(400, 560)">
    <circle cx="0" cy="0" r="160" fill="none" stroke="#00F2FE" stroke-width="1" stroke-dasharray="6 6" opacity="0.3" />
    <circle cx="0" cy="0" r="120" fill="none" stroke="#4FACFE" stroke-width="2" opacity="0.4" />
    
    <!-- Central Glowing Core -->
    <circle cx="0" cy="0" r="75" fill="#0B132B" stroke="#00F2FE" stroke-width="3" filter="url(#neonGlow)" />
    <polygon points="0,-40 35,-20 35,20 0,40 -35,20 -35,-20" fill="url(#apexCyan)" />
    <text x="0" y="8" font-family="'Space Grotesk', monospace" font-size="16" font-weight="900" text-anchor="middle" fill="#050814">H200</text>
  </g>

  <!-- Statistics Row -->
  <g transform="translate(60, 770)">
    <!-- Stat 1 -->
    <g transform="translate(0, 0)">
      <text x="0" y="32" font-family="'Space Grotesk', monospace" font-weight="900" font-size="36" fill="#00F2FE">99.999%</text>
      <text x="0" y="54" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#94A3B8" font-weight="600">SLA Availability</text>
    </g>
    <!-- Stat 2 -->
    <g transform="translate(240, 0)">
      <text x="0" y="32" font-family="'Space Grotesk', monospace" font-weight="900" font-size="36" fill="#FFFFFF">128 PFLOPS</text>
      <text x="0" y="54" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#94A3B8" font-weight="600">Peak Tensor Compute</text>
    </g>
    <!-- Stat 3 -->
    <g transform="translate(480, 0)">
      <text x="0" y="32" font-family="'Space Grotesk', monospace" font-weight="900" font-size="36" fill="#FF5000">Zero-Trust</text>
      <text x="0" y="54" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#94A3B8" font-weight="600">Hardware Attestation</text>
    </g>
  </g>

  <!-- Bottom CTA & Compliance Strip (8.5% safe margin buffer) -->
  <g transform="translate(60, 890)">
    <rect width="680" height="64" rx="18" fill="#111827" stroke="#1F2937" stroke-width="1.5" />
    
    <!-- CTA Button -->
    <g transform="translate(470, 10)">
      <rect width="190" height="44" rx="14" fill="url(#apexOrange)" />
      <text x="95" y="27" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="14" text-anchor="middle" fill="#FFFFFF">Request Keynote Pass</text>
    </g>

    <!-- Contact & Portal Info -->
    <text x="24" y="28" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="700" fill="#FFFFFF">Apex Global Cloud Systems • Geneva Palexpo</text>
    <text x="24" y="46" font-family="'Space Grotesk', monospace" font-size="12" fill="#00F2FE">portal.apexglobal.tech/summit2026 | +1 (800) 490-APEX</text>
  </g>
</svg>`;

// 2. Apex Draft with Violations (Failed version for Rework & AI Scoring Demo)
const apexSummitFailedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="100%" height="100%">
  <!-- Same canvas with low contrast CTA and clipped bottom margin -->
  <rect width="800" height="1000" fill="#050814" />
  
  <g transform="translate(60, 60)">
    <rect width="44" height="44" rx="12" fill="#3B82F6" />
    <text x="60" y="32" font-family="Arial, sans-serif" font-weight="900" font-size="24" fill="#E2E8F0">APEX GLOBAL (Draft)</text>
  </g>

  <g transform="translate(60, 240)">
    <text x="0" y="90" font-family="Arial, sans-serif" font-weight="900" font-size="64" fill="#FFFFFF">Sovereign AI</text>
    <text x="0" y="160" font-family="Arial, sans-serif" font-weight="900" font-size="64" fill="#60A5FA">&amp; Superclusters</text>
  </g>

  <!-- Problem: Red prohibited accent color used & CTA touches bottom edge (< 2% margin) -->
  <g transform="translate(60, 960)">
    <rect width="680" height="35" fill="#EF4444" />
    <text x="340" y="24" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#7F1D1D">
      Contact: apex.tech (Missing official helpline phone &amp; safe zone violation)
    </text>
  </g>
</svg>`;

// 3. Nova Electric Mobility - Hyper-EV Premiere (APPROVED, 1080x1350)
const novaEvSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="100%" height="100%">
  <defs>
    <linearGradient id="novaBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="60%" stop-color="#020617" />
      <stop offset="100%" stop-color="#000000" />
    </linearGradient>
    <linearGradient id="novaTeal" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#06B6D4" />
    </linearGradient>
    <linearGradient id="silverGloss" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="40%" stop-color="#E2E8F0" />
      <stop offset="100%" stop-color="#64748B" />
    </linearGradient>
  </defs>

  <rect width="800" height="1000" fill="url(#novaBg)" />

  <!-- Speed Streamlines -->
  <g opacity="0.15" stroke="url(#novaTeal)" stroke-width="2">
    <path d="M -100,350 C 200,350 400,280 900,280" />
    <path d="M -100,420 C 200,420 500,360 900,360" />
    <path d="M -100,500 C 200,500 450,440 900,440" />
  </g>

  <!-- Nova Brand Mark -->
  <g transform="translate(60, 60)">
    <circle cx="20" cy="20" r="18" fill="none" stroke="url(#novaTeal)" stroke-width="3" />
    <circle cx="20" cy="20" r="6" fill="#10B981" />
    <text x="52" y="27" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="26" fill="#FFFFFF" letter-spacing="1">NOVA</text>
    <text x="52" y="42" font-family="'Space Grotesk', monospace" font-size="10" fill="#06B6D4" letter-spacing="3">MOBILITY LABS</text>
  </g>

  <!-- Tagline -->
  <g transform="translate(60, 200)">
    <text x="0" y="24" font-family="'Space Grotesk', monospace" font-size="13" font-weight="700" fill="#10B981" letter-spacing="3">ALL-ELECTRIC AUTONOMOUS GT</text>
    <text x="0" y="85" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="62" fill="url(#silverGloss)" letter-spacing="-1.5">Apex Gran Turismo</text>
    <text x="0" y="135" font-family="'Plus Jakarta Sans', sans-serif" font-weight="400" font-size="18" fill="#94A3B8">
      840-mile solid-state battery range with Level 4 autonomous highway pilot.
    </text>
  </g>

  <!-- Stylized Sleek EV Silhouette -->
  <g transform="translate(100, 420)">
    <ellipse cx="300" cy="180" rx="280" ry="16" fill="#06B6D4" opacity="0.2" filter="blur(15px)" />
    <!-- Chassis Contour -->
    <path d="M 40,160 C 80,120 180,90 280,75 C 380,60 480,85 540,140 C 560,160 550,170 510,170 L 60,170 Z" fill="#1E293B" stroke="url(#novaTeal)" stroke-width="2" />
    <!-- Cockpit Canopy -->
    <path d="M 180,95 C 240,75 340,75 420,105 C 440,115 410,135 370,135 L 190,135 Z" fill="#020617" stroke="#38BDF8" stroke-width="1.5" />
    <!-- Headlight Beam -->
    <line x1="535" y1="145" x2="680" y2="155" stroke="#38BDF8" stroke-width="3" opacity="0.8" />
  </g>

  <!-- Specs Badges -->
  <g transform="translate(60, 740)">
    <g transform="translate(0, 0)">
      <text x="0" y="28" font-family="'Space Grotesk', monospace" font-weight="800" font-size="34" fill="#FFFFFF">1.88s</text>
      <text x="0" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#64748B">0-60 MPH Acceleration</text>
    </g>
    <g transform="translate(240, 0)">
      <text x="0" y="28" font-family="'Space Grotesk', monospace" font-weight="800" font-size="34" fill="#10B981">840 Mi</text>
      <text x="0" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#64748B">Solid-State Range</text>
    </g>
    <g transform="translate(480, 0)">
      <text x="0" y="28" font-family="'Space Grotesk', monospace" font-weight="800" font-size="34" fill="#06B6D4">800V</text>
      <text x="0" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#64748B">Ultra-Fast 12-Min Charge</text>
    </g>
  </g>

  <!-- Bottom Strip -->
  <g transform="translate(60, 880)">
    <rect width="680" height="66" rx="18" fill="#0F172A" stroke="#1E293B" stroke-width="1.5" />
    <g transform="translate(470, 11)">
      <rect width="190" height="44" rx="14" fill="url(#novaTeal)" />
      <text x="95" y="27" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="14" text-anchor="middle" fill="#020617">Reserve Edition 01</text>
    </g>
    <text x="24" y="28" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="700" fill="#FFFFFF">Nova Mobility Headquarters • Stuttgart &amp; Palo Alto</text>
    <text x="24" y="48" font-family="'Space Grotesk', monospace" font-size="12" fill="#10B981">novamobility.tech | Concierge: +1 (888) 720-NOVA</text>
  </g>
</svg>`;

// 4. Lumina Health Sciences (APPROVED, 1080x1350)
const luminaHealthSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="100%" height="100%">
  <defs>
    <linearGradient id="luminaBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC" />
      <stop offset="60%" stop-color="#F1F5F9" />
      <stop offset="100%" stop-color="#E2E8F0" />
    </linearGradient>
    <linearGradient id="luminaBlue" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284C7" />
      <stop offset="100%" stop-color="#2563EB" />
    </linearGradient>
  </defs>

  <rect width="800" height="1000" fill="url(#luminaBg)" />

  <!-- Lumina Logo -->
  <g transform="translate(60, 60)">
    <circle cx="20" cy="20" r="18" fill="#0284C7" />
    <path d="M 20,8 L 24,18 L 32,20 L 24,24 L 20,32 L 16,24 L 8,20 L 16,18 Z" fill="#FFFFFF" />
    <text x="50" y="27" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="24" fill="#0F172A">LUMINA</text>
    <text x="50" y="42" font-family="'Space Grotesk', monospace" font-size="11" fill="#0284C7" font-weight="700">HEALTH SCIENCES</text>
  </g>

  <!-- Headline -->
  <g transform="translate(60, 200)">
    <rect width="180" height="26" rx="6" fill="#0284C7" opacity="0.1" />
    <text x="10" y="18" font-family="'Space Grotesk', monospace" font-size="11" font-weight="800" fill="#0284C7">PRECISION GENOMICS</text>
    <text x="0" y="80" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="58" fill="#0F172A" letter-spacing="-1.5">Next-Gen Clinical</text>
    <text x="0" y="145" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="58" fill="#0284C7" letter-spacing="-1.5">Therapeutics</text>
    <text x="0" y="195" font-family="'Plus Jakarta Sans', sans-serif" font-size="17" fill="#475569">
      Accelerating biomarker discovery and targeted immunotherapy with multimodal molecular AI.
    </text>
  </g>

  <!-- DNA / Molecular Helix Artwork -->
  <g transform="translate(400, 520)">
    <circle cx="0" cy="0" r="150" fill="#E0F2FE" opacity="0.5" />
    <g stroke="#0284C7" stroke-width="3" fill="none">
      <path d="M -80,-80 Q 0,-40 80,-80 T -80,0 T 80,80" />
      <path d="M 80,-80 Q 0,-40 -80,-80 T 80,0 T -80,80" stroke="#2563EB" />
    </g>
    <circle cx="-60" cy="-60" r="12" fill="#0284C7" />
    <circle cx="60" cy="-60" r="12" fill="#2563EB" />
    <circle cx="0" cy="0" r="16" fill="#0EA5E9" />
    <circle cx="-60" cy="60" r="12" fill="#2563EB" />
    <circle cx="60" cy="60" r="12" fill="#0284C7" />
  </g>

  <!-- Clinical Highlights -->
  <g transform="translate(60, 750)">
    <g transform="translate(0, 0)">
      <text x="0" y="28" font-family="'Space Grotesk', monospace" font-weight="800" font-size="34" fill="#0F172A">Phase III</text>
      <text x="0" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#64748B">FDA Fast-Track Approved</text>
    </g>
    <g transform="translate(240, 0)">
      <text x="0" y="28" font-family="'Space Grotesk', monospace" font-weight="800" font-size="34" fill="#0284C7">99.4%</text>
      <text x="0" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#64748B">Target Binding Specificity</text>
    </g>
    <g transform="translate(480, 0)">
      <text x="0" y="28" font-family="'Space Grotesk', monospace" font-weight="800" font-size="34" fill="#2563EB">14,200+</text>
      <text x="0" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#64748B">Enrolled Clinical Cohort</text>
    </g>
  </g>

  <!-- Bottom Action Card -->
  <g transform="translate(60, 880)">
    <rect width="680" height="66" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5" />
    <g transform="translate(470, 11)">
      <rect width="190" height="44" rx="14" fill="url(#luminaBlue)" />
      <text x="95" y="27" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="14" text-anchor="middle" fill="#FFFFFF">Access Clinical Trial</text>
    </g>
    <text x="24" y="28" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="700" fill="#0F172A">Lumina Health Sciences Bio-Campuses • Boston &amp; Cambridge</text>
    <text x="24" y="48" font-family="'Space Grotesk', monospace" font-size="12" fill="#0284C7">trials.luminahealth.org | Medical Registry: +1 (877) 402-LUMI</text>
  </g>
</svg>`;

// 5. Veloce Institutional FinTech (APPROVED, 1080x1350)
const veloceWealthSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="100%" height="100%">
  <defs>
    <linearGradient id="veloceBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0A1128" />
      <stop offset="60%" stop-color="#001F54" />
      <stop offset="100%" stop-color="#034078" />
    </linearGradient>
    <linearGradient id="veloceGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="50%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
  </defs>

  <rect width="800" height="1000" fill="url(#veloceBg)" />

  <!-- Veloce Logo -->
  <g transform="translate(60, 60)">
    <rect width="40" height="40" rx="8" fill="url(#veloceGold)" />
    <text x="20" y="28" font-family="'Space Grotesk', monospace" font-size="22" font-weight="900" fill="#0A1128" text-anchor="middle">V</text>
    <text x="52" y="28" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="24" fill="#FFFFFF">VELOCE</text>
    <text x="52" y="42" font-family="'Space Grotesk', monospace" font-size="10" fill="#FBBF24" letter-spacing="2">INSTITUTIONAL WEALTH</text>
  </g>

  <!-- Content -->
  <g transform="translate(60, 220)">
    <text x="0" y="24" font-family="'Space Grotesk', monospace" font-size="12" font-weight="800" fill="#FBBF24" letter-spacing="3">GLOBAL ASSET MANAGEMENT</text>
    <text x="0" y="85" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="64" fill="#FFFFFF" letter-spacing="-1.5">Algorithmic Wealth</text>
    <text x="0" y="150" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="64" fill="url(#veloceGold)" letter-spacing="-1.5">&amp; Treasury</text>
    <text x="0" y="200" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" fill="#94A3B8">
      Sovereign liquidity, multi-currency algorithmic yields, and tier-1 custodian safety.
    </text>
  </g>

  <!-- Metric Badges -->
  <g transform="translate(60, 750)">
    <g transform="translate(0, 0)">
      <text x="0" y="28" font-family="'Space Grotesk', monospace" font-weight="900" font-size="36" fill="#FBBF24">$42.8B</text>
      <text x="0" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#94A3B8">Assets Under Custody</text>
    </g>
    <g transform="translate(240, 0)">
      <text x="0" y="28" font-family="'Space Grotesk', monospace" font-weight="900" font-size="36" fill="#FFFFFF">&lt; 1.2ms</text>
      <text x="0" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#94A3B8">Global Execution Latency</text>
    </g>
    <g transform="translate(480, 0)">
      <text x="0" y="28" font-family="'Space Grotesk', monospace" font-weight="900" font-size="36" fill="#38BDF8">SOC-2 Type II</text>
      <text x="0" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#94A3B8">Audited &amp; Insured</text>
    </g>
  </g>

  <!-- Bottom CTA -->
  <g transform="translate(60, 880)">
    <rect width="680" height="66" rx="18" fill="#0A1128" stroke="#1E3A8A" stroke-width="1.5" />
    <g transform="translate(470, 11)">
      <rect width="190" height="44" rx="14" fill="url(#veloceGold)" />
      <text x="95" y="27" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="14" text-anchor="middle" fill="#0A1128">Open Private Account</text>
    </g>
    <text x="24" y="28" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="700" fill="#FFFFFF">Veloce Financial Group • Zurich, London &amp; Singapore</text>
    <text x="24" y="48" font-family="'Space Grotesk', monospace" font-size="12" fill="#FBBF24">velocewealth.com | Advisory: +41 22 819 9000</text>
  </g>
</svg>`;

// Write all generated files
fs.writeFileSync(path.join(outDir, 'apex-summit.svg'), apexSummitSvg);
fs.writeFileSync(path.join(outDir, 'apex-summit-failed.svg'), apexSummitFailedSvg);
fs.writeFileSync(path.join(outDir, 'nova-ev.svg'), novaEvSvg);
fs.writeFileSync(path.join(outDir, 'lumina-health.svg'), luminaHealthSvg);
fs.writeFileSync(path.join(outDir, 'veloce-wealth.svg'), veloceWealthSvg);

// Also overwrite/map the legacy file paths so existing views and bookmarks load beautifully
fs.writeFileSync(path.join(outDir, 'jgi-banking.svg'), apexSummitSvg);
fs.writeFileSync(path.join(outDir, 'nmc-independence.svg'), novaEvSvg);
fs.writeFileSync(path.join(outDir, 'jitd-admissions.svg'), luminaHealthSvg);
fs.writeFileSync(path.join(outDir, 'nmctech-h200.svg'), apexSummitSvg);
fs.writeFileSync(path.join(outDir, 'nmc-summit-failed.svg'), apexSummitFailedSvg);
fs.writeFileSync(path.join(outDir, 'samsung-belagavi.svg'), veloceWealthSvg);
fs.writeFileSync(path.join(outDir, 'sms-system.svg'), luminaHealthSvg);
fs.writeFileSync(path.join(outDir, 'dmi-pooja.svg'), novaEvSvg);

console.log('Successfully generated high-fidelity SVG brand posters!');
