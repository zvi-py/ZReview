/**
 * Generates ultra-realistic, professional brand campaign posters for ZReview
 * Each poster features high-resolution imagery, authentic typography, accreditation seals,
 * and realistic marketing layout safe zones.
 */
import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'public/assets/posters');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. JGI / JDC Banking Career Opportunities - APPROVED V2 (800x1000)
const jgiBankingApprovedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="100%" height="100%">
  <defs>
    <linearGradient id="jdcNavy" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#071329" />
      <stop offset="50%" stop-color="#0A1D37" />
      <stop offset="100%" stop-color="#142B52" />
    </linearGradient>
    <linearGradient id="jdcGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="50%" stop-color="#FCD34D" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.4" />
    </filter>
  </defs>

  <!-- Deep Blue Institutional Canvas -->
  <rect width="800" height="1000" fill="url(#jdcNavy)" />

  <!-- Background Imagery: Modern Banking & Corporate Finance Boardroom -->
  <image href="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&amp;w=1200&amp;auto=format&amp;fit=crop" x="0" y="0" width="800" height="480" preserveAspectRatio="xMidYMid slice" opacity="0.32" />
  <rect width="800" height="480" fill="url(#jdcNavy)" opacity="0.75" />

  <!-- Header: JGI Institutional Mark (Top Left) -->
  <g transform="translate(50, 45)">
    <!-- Crest Emblem -->
    <rect width="48" height="48" rx="12" fill="url(#jdcGold)" />
    <text x="24" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="24" fill="#0A1D37" text-anchor="middle">JGI</text>
    <text x="62" y="26" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="20" fill="#FFFFFF" letter-spacing="-0.5">JAIN DEGREE COLLEGE</text>
    <text x="62" y="42" font-family="'Space Grotesk', monospace" font-size="11" font-weight="700" fill="#FCD34D" letter-spacing="2">DEPARTMENT OF BANKING &amp; FINTECH</text>
  </g>

  <!-- NAAC A+ Accreditation Seal (Top Right) -->
  <g transform="translate(630, 45)">
    <rect width="120" height="44" rx="10" fill="#0A1D37" stroke="#F59E0B" stroke-width="1.5" />
    <text x="60" y="20" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="12" fill="#FCD34D" text-anchor="middle">NAAC A++</text>
    <text x="60" y="34" font-family="'Space Grotesk', monospace" font-size="9" fill="#94A3B8" text-anchor="middle">GRADE ACCREDITED</text>
  </g>

  <!-- Big Central Headline -->
  <g transform="translate(50, 150)">
    <rect x="0" y="0" width="220" height="28" rx="6" fill="#F59E0B" />
    <text x="12" y="19" font-family="'Space Grotesk', monospace" font-size="12" font-weight="900" fill="#0A1D37" letter-spacing="1.5">CAREER ACCELERATOR 2026</text>

    <text x="0" y="85" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="52" fill="#FFFFFF" letter-spacing="-1.5">50,000+ Opportunities</text>
    <text x="0" y="145" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="52" fill="url(#jdcGold)" letter-spacing="-1.5">in Banking &amp; FinTech</text>

    <text x="0" y="195" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" fill="#CBD5E1" font-weight="400">
      Shape the future of digital wealth, algorithmic trading, and investment banking.
    </text>
  </g>

  <!-- Recruiter Logos Grid Card -->
  <g transform="translate(50, 390)">
    <rect width="700" height="340" rx="20" fill="#0E2445" stroke="#1E3A8A" stroke-width="1.5" filter="url(#cardShadow)" />
    
    <!-- Student Hero Graphic Inside Card -->
    <g transform="translate(420, 25)">
      <rect width="250" height="290" rx="16" fill="#071329" stroke="#3B82F6" stroke-width="1" />
      <image href="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&amp;w=600&amp;auto=format&amp;fit=crop" x="0" y="0" width="250" height="290" preserveAspectRatio="xMidYMid slice" opacity="0.85" rx="16" />
      <rect width="250" height="290" rx="16" fill="url(#jdcNavy)" opacity="0.25" />
      <rect x="15" y="235" width="220" height="40" rx="8" fill="#0A1D37" opacity="0.9" />
      <text x="25" y="253" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="#FFFFFF">100% Placement Record</text>
      <text x="25" y="267" font-family="'Space Grotesk', monospace" font-size="9" fill="#FCD34D">Highest CTC: ₹42.5 LPA</text>
    </g>

    <!-- Key Offerings List -->
    <g transform="translate(30, 35)">
      <text x="0" y="20" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="20" fill="#FFFFFF">Program Highlights</text>

      <!-- Bullet 1 -->
      <g transform="translate(0, 45)">
        <circle cx="10" cy="10" r="10" fill="#F59E0B" />
        <path d="M 6,10 L 9,13 L 15,7" stroke="#0A1D37" stroke-width="2" fill="none" />
        <text x="30" y="14" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="700" fill="#FFFFFF">B.Com / M.Com in Investment Banking</text>
      </g>
      <!-- Bullet 2 -->
      <g transform="translate(0, 90)">
        <circle cx="10" cy="10" r="10" fill="#F59E0B" />
        <path d="M 6,10 L 9,13 L 15,7" stroke="#0A1D37" stroke-width="2" fill="none" />
        <text x="30" y="14" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="700" fill="#FFFFFF">NSE &amp; Bloomberg Terminal Certifications</text>
      </g>
      <!-- Bullet 3 -->
      <g transform="translate(0, 135)">
        <circle cx="10" cy="10" r="10" fill="#F59E0B" />
        <path d="M 6,10 L 9,13 L 15,7" stroke="#0A1D37" stroke-width="2" fill="none" />
        <text x="30" y="14" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="700" fill="#FFFFFF">Internships with Goldman Sachs, Morgan Stanley</text>
      </g>
      <!-- Bullet 4 -->
      <g transform="translate(0, 180)">
        <circle cx="10" cy="10" r="10" fill="#F59E0B" />
        <path d="M 6,10 L 9,13 L 15,7" stroke="#0A1D37" stroke-width="2" fill="none" />
        <text x="30" y="14" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="700" fill="#FFFFFF">Comprehensive CFA &amp; FRM Integrated Prep</text>
      </g>

      <!-- Recruiter Badges -->
      <g transform="translate(0, 235)">
        <text x="0" y="12" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" fill="#94A3B8" letter-spacing="1.5">OFFICIAL RECRUITMENT PARTNERS</text>
        <g transform="translate(0, 22)">
          <rect x="0" y="0" width="75" height="24" rx="6" fill="#1E3A8A" />
          <text x="37" y="16" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">HDFC</text>

          <rect x="85" y="0" width="75" height="24" rx="6" fill="#1E3A8A" />
          <text x="122" y="16" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">ICICI</text>

          <rect x="170" y="0" width="75" height="24" rx="6" fill="#1E3A8A" />
          <text x="207" y="16" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">KOTAK</text>

          <rect x="255" y="0" width="90" height="24" rx="6" fill="#1E3A8A" />
          <text x="300" y="16" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">J.P. MORGAN</text>
        </g>
      </g>
    </g>
  </g>

  <!-- Metric Badges Row (760) -->
  <g transform="translate(50, 760)">
    <g transform="translate(0, 0)">
      <text x="0" y="28" font-family="'Space Grotesk', monospace" font-weight="900" font-size="34" fill="#FCD34D">₹18.4 LPA</text>
      <text x="0" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#94A3B8">Average Placement Package</text>
    </g>
    <g transform="translate(260, 0)">
      <text x="0" y="28" font-family="'Space Grotesk', monospace" font-weight="900" font-size="34" fill="#FFFFFF">120+ Banks</text>
      <text x="0" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#94A3B8">Annual Campus Hiring</text>
    </g>
    <g transform="translate(510, 0)">
      <text x="0" y="28" font-family="'Space Grotesk', monospace" font-weight="900" font-size="34" fill="#38BDF8">Ranked #1</text>
      <text x="0" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#94A3B8">FinTech College in South India</text>
    </g>
  </g>

  <!-- Bottom CTA Banner with Safe Margin Buffer (≥8% margin) -->
  <g transform="translate(50, 860)">
    <rect width="700" height="85" rx="18" fill="#0A1D37" stroke="#F59E0B" stroke-width="1.8" />
    
    <!-- CTA Button -->
    <g transform="translate(480, 18)">
      <rect width="195" height="48" rx="14" fill="url(#jdcGold)" />
      <text x="97" y="29" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="14" text-anchor="middle" fill="#0A1D37">Apply for 2026 Batch</text>
    </g>

    <!-- Helpline Contact info with High-Contrast Badge -->
    <g transform="translate(24, 20)">
      <rect x="0" y="0" width="180" height="22" rx="6" fill="#F59E0B" />
      <text x="8" y="15" font-family="'Space Grotesk', monospace" font-size="11" font-weight="900" fill="#0A1D37">ADMISSIONS HOTLINE</text>
      <text x="0" y="42" font-family="'Space Grotesk', monospace" font-size="16" font-weight="900" fill="#FFFFFF">+91 910-810-3111</text>
      <text x="175" y="42" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#94A3B8">| admissions@jdc.ac.in</text>
    </g>
  </g>
</svg>`;

// 2. JGI / JDC Banking Career Opportunities - DRAFT V1 (82% Failed Gate with Margin Defect)
const jgiBankingFailedSvg = jgiBankingApprovedSvg.replace(
  '<g transform="translate(50, 860)">\n    <rect width="700" height="85" rx="18" fill="#0A1D37" stroke="#F59E0B" stroke-width="1.8" />',
  '<!-- REWORK DETECTED: Bottom banner pushed into danger margin buffer (< 1.8%) -->\n  <g transform="translate(50, 930)">\n    <rect width="700" height="65" fill="#DC2626" />\n    <text x="350" y="40" font-family="sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF" text-anchor="middle">WARNING: Safe Zone Bleed &bull; Contact Hotline Touches Canvas Border (1.8% margin)</text>'
);

// 3. NMC Independence Day Corporate Commemorative (APPROVED 94%)
const nmcIndependenceSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="100%" height="100%">
  <defs>
    <linearGradient id="nmcBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050C1A" />
      <stop offset="60%" stop-color="#091830" />
      <stop offset="100%" stop-color="#0E2445" />
    </linearGradient>
    <linearGradient id="saffronWave" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF9933" />
      <stop offset="100%" stop-color="#FF6F00" />
    </linearGradient>
    <linearGradient id="greenWave" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#138808" />
      <stop offset="100%" stop-color="#0F6606" />
    </linearGradient>
  </defs>

  <rect width="800" height="1000" fill="url(#nmcBg)" />

  <!-- Tricolor Flow Curves -->
  <path d="M 0,260 Q 250,200 450,290 T 800,240 L 800,320 Q 550,380 350,300 T 0,330 Z" fill="url(#saffronWave)" opacity="0.85" />
  <path d="M 0,320 Q 250,260 450,350 T 800,300 L 800,340 Q 550,400 350,320 T 0,350 Z" fill="#FFFFFF" opacity="0.9" />
  <path d="M 0,340 Q 250,280 450,370 T 800,320 L 800,400 Q 550,460 350,380 T 0,410 Z" fill="url(#greenWave)" opacity="0.85" />

  <!-- Background Monument Silhouette: India Gate -->
  <g transform="translate(250, 420)" opacity="0.12" fill="#FFFFFF">
    <rect x="60" y="60" width="180" height="240" />
    <path d="M 100,300 C 100,200 200,200 200,300 Z" fill="#091830" />
    <rect x="40" y="40" width="220" height="25" />
    <rect x="20" y="20" width="260" height="25" />
  </g>

  <!-- Ashok Chakra Center Wheel -->
  <g transform="translate(400, 310)">
    <circle cx="0" cy="0" r="32" fill="none" stroke="#000080" stroke-width="2.5" />
    <circle cx="0" cy="0" r="6" fill="#000080" />
    <!-- 24 spokes -->
    ${Array.from({ length: 24 }).map((_, i) => `<line x1="0" y1="0" x2="${(30 * Math.cos((i * 15 * Math.PI) / 180)).toFixed(1)}" y2="${(30 * Math.sin((i * 15 * Math.PI) / 180)).toFixed(1)}" stroke="#000080" stroke-width="1.2" />`).join('\n    ')}
  </g>

  <!-- Header: NMC Logo (Top Left) -->
  <g transform="translate(60, 60)">
    <rect width="48" height="48" rx="12" fill="#FF9933" />
    <text x="24" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="20" fill="#FFFFFF" text-anchor="middle">NMC</text>
    <text x="62" y="26" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="22" fill="#FFFFFF">NOETICMINDS</text>
    <text x="62" y="42" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" fill="#94A3B8" letter-spacing="2">ENTERPRISE CONSULTING &amp; CLOUD</text>
  </g>

  <!-- Central Greeting -->
  <g transform="translate(60, 480)">
    <text x="0" y="30" font-family="'Space Grotesk', monospace" font-size="16" font-weight="700" fill="#FF9933" letter-spacing="3">79TH YEAR OF INDEPENDENCE</text>
    <text x="0" y="95" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="64" fill="#FFFFFF" letter-spacing="-1.5">Celebrating Freedom,</text>
    <text x="0" y="165" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="64" fill="#FF9933" letter-spacing="-1.5">Empowering Tomorrow</text>
    
    <text x="0" y="225" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" fill="#CBD5E1">
      Saluting the spirit of innovation, self-reliance, and technological sovereignty.
    </text>
  </g>

  <!-- Corporate Pillars Row (780) -->
  <g transform="translate(60, 750)">
    <g transform="translate(0, 0)">
      <text x="0" y="28" font-family="'Space Grotesk', monospace" font-weight="900" font-size="34" fill="#FF9933">100%</text>
      <text x="0" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#94A3B8">Indigenous Tech Stack</text>
    </g>
    <g transform="translate(240, 0)">
      <text x="0" y="28" font-family="'Space Grotesk', monospace" font-weight="900" font-size="34" fill="#FFFFFF">25,000+</text>
      <text x="0" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#94A3B8">Engineers Empowered</text>
    </g>
    <g transform="translate(480, 0)">
      <text x="0" y="28" font-family="'Space Grotesk', monospace" font-weight="900" font-size="34" fill="#138808">Tier-4</text>
      <text x="0" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#94A3B8">Sovereign Data Center</text>
    </g>
  </g>

  <!-- Bottom Strip -->
  <g transform="translate(60, 870)">
    <rect width="680" height="70" rx="18" fill="#071329" stroke="#1E3A8A" stroke-width="1.5" />
    <text x="24" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="700" fill="#FFFFFF">Noeticminds Consulting Private Limited • Bangalore &amp; Global</text>
    <text x="24" y="52" font-family="'Space Grotesk', monospace" font-size="11" fill="#FF9933">www.noeticminds.com • AI, Digital Transformation &amp; Cloud Systems</text>
  </g>
</svg>`;

// 4. JIT Davangere Engineering Admissions 2026 (APPROVED 88%)
const jitdAdmissionsSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="100%" height="100%">
  <defs>
    <linearGradient id="jitdBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="60%" stop-color="#1E293B" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
  </defs>

  <rect width="800" height="1000" fill="url(#jitdBg)" />
  <image href="https://images.unsplash.com/photo-1562774053-701939374585?q=80&amp;w=1200&amp;auto=format&amp;fit=crop" x="0" y="0" width="800" height="420" preserveAspectRatio="xMidYMid slice" opacity="0.35" />

  <!-- JITD Crest -->
  <g transform="translate(50, 45)">
    <rect width="48" height="48" rx="10" fill="#2563EB" />
    <text x="24" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="20" fill="#FFFFFF" text-anchor="middle">JIT</text>
    <text x="62" y="26" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="20" fill="#FFFFFF">JAIN INSTITUTE OF TECHNOLOGY</text>
    <text x="62" y="42" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" fill="#38BDF8">DAVANGERE • AFFILIATED TO VTU, BELAGAVI</text>
  </g>

  <!-- Accreditation Seals -->
  <g transform="translate(630, 45)">
    <rect width="120" height="44" rx="10" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5" />
    <text x="60" y="20" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="12" fill="#38BDF8" text-anchor="middle">NAAC A+</text>
    <text x="60" y="34" font-family="'Space Grotesk', monospace" font-size="9" fill="#94A3B8" text-anchor="middle">NBA ACCREDITED</text>
  </g>

  <!-- Title -->
  <g transform="translate(50, 160)">
    <rect x="0" y="0" width="220" height="26" rx="6" fill="#2563EB" />
    <text x="12" y="18" font-family="'Space Grotesk', monospace" font-size="12" font-weight="900" fill="#FFFFFF">ADMISSIONS OPEN 2026-27</text>
    <text x="0" y="85" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="52" fill="#FFFFFF" letter-spacing="-1.5">Build Your Future</text>
    <text x="0" y="145" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="52" fill="#38BDF8" letter-spacing="-1.5">At JIT Davangere</text>
  </g>

  <!-- Courses Grid -->
  <g transform="translate(50, 360)">
    <rect width="700" height="360" rx="20" fill="#1E293B" stroke="#334155" stroke-width="1.5" />
    
    <g transform="translate(30, 30)">
      <text x="0" y="20" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="22" fill="#FFFFFF">Engineering &amp; Tech Specializations</text>

      <g transform="translate(0, 45)">
        <rect x="0" y="0" width="310" height="60" rx="12" fill="#0F172A" />
        <text x="20" y="28" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="800" fill="#FFFFFF">Computer Science &amp; Engineering</text>
        <text x="20" y="46" font-family="'Space Grotesk', monospace" font-size="11" fill="#38BDF8">AI, Machine Learning &amp; Cloud</text>

        <rect x="330" y="0" width="310" height="60" rx="12" fill="#0F172A" />
        <text x="350" y="28" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="800" fill="#FFFFFF">Electronics &amp; Communication</text>
        <text x="350" y="46" font-family="'Space Grotesk', monospace" font-size="11" fill="#38BDF8">VLSI Design, Robotics &amp; IoT</text>

        <rect x="0" y="75" width="310" height="60" rx="12" fill="#0F172A" />
        <text x="20" y="103" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="800" fill="#FFFFFF">Data Science &amp; Cyber Security</text>
        <text x="20" y="121" font-family="'Space Grotesk', monospace" font-size="11" fill="#38BDF8">Enterprise Defense &amp; Big Data</text>

        <rect x="330" y="75" width="310" height="60" rx="12" fill="#0F172A" />
        <text x="350" y="103" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="800" fill="#FFFFFF">Mechanical &amp; Civil Engineering</text>
        <text x="350" y="121" font-family="'Space Grotesk', monospace" font-size="11" fill="#38BDF8">Smart Infrastructure &amp; Automation</text>
      </g>
    </g>

    <!-- Placement Record -->
    <g transform="translate(30, 230)">
      <rect width="640" height="95" rx="14" fill="#0F172A" stroke="#2563EB" stroke-width="1.2" />
      <g transform="translate(30, 25)">
        <text x="0" y="24" font-family="'Space Grotesk', monospace" font-size="28" font-weight="900" fill="#38BDF8">75+</text>
        <text x="0" y="42" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#94A3B8">Industry Collaborations</text>
      </g>
      <g transform="translate(220, 25)">
        <text x="0" y="24" font-family="'Space Grotesk', monospace" font-size="28" font-weight="900" fill="#FFFFFF">122+</text>
        <text x="0" y="42" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#94A3B8">Recruiting Companies</text>
      </g>
      <g transform="translate(420, 25)">
        <text x="0" y="24" font-family="'Space Grotesk', monospace" font-size="28" font-weight="900" fill="#F59E0B">100%</text>
        <text x="0" y="42" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#94A3B8">Placement Assistance</text>
      </g>
    </g>
  </g>

  <!-- Bottom CTA -->
  <g transform="translate(50, 860)">
    <rect width="700" height="85" rx="18" fill="#1E293B" stroke="#2563EB" stroke-width="1.5" />
    <g transform="translate(480, 18)">
      <rect width="195" height="48" rx="14" fill="#2563EB" />
      <text x="97" y="29" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="14" text-anchor="middle" fill="#FFFFFF">Inquire / Enroll</text>
    </g>
    <g transform="translate(24, 25)">
      <text x="0" y="16" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="700" fill="#FFFFFF">JIT Campus, Avaragere, Davangere, Karnataka</text>
      <text x="0" y="38" font-family="'Space Grotesk', monospace" font-size="12" fill="#38BDF8">Helpline: +91 8192-297701 • admissions@jitd.in</text>
    </g>
  </g>
</svg>`;

// Write all real SVG posters
fs.writeFileSync(path.join(outDir, 'jgi-banking.svg'), jgiBankingApprovedSvg);
fs.writeFileSync(path.join(outDir, 'jgi-banking-failed.svg'), jgiBankingFailedSvg);
fs.writeFileSync(path.join(outDir, 'nmc-independence.svg'), nmcIndependenceSvg);
fs.writeFileSync(path.join(outDir, 'jitd-admissions.svg'), jitdAdmissionsSvg);

console.log('Successfully written real posters for JDC Banking, NMC Independence, and JITD Admissions!');
