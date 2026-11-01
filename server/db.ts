import type {
  User,
  UserRole,
  Brand,
  BrandParameter,
  Campaign,
  Submission,
  AuditLog,
  AppNotification,
  SystemSettings,
  AnalyticsData,
  ReviewVelocityStats,
  PostReviewTurnaroundStat,
  AIUsageLog,
  SupervisorMetric,
  EmployeeVelocityMetric,
} from '../src/types.ts';

// ==========================================
// 1. USERS & EMPLOYEES (ZARVIS Enterprise Media Operations Roster)
// ==========================================
export const USERS: User[] = [
  {
    id: 'usr-001',
    name: 'Alex Rivera',
    email: 'alex.rivera@zarvis.ai',
    role: 'EMPLOYEE',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Lead Full-Stack AI & Creative Engineering',
    assignedBrands: ['brand-apex', 'brand-nova', 'brand-lumina', 'brand-veloce', 'brand-jdc', 'brand-nmc'],
  },
  {
    id: 'usr-002',
    name: 'Sophia Martinez',
    email: 'sophia.martinez@zarvis.ai',
    role: 'EMPLOYEE',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: 'Senior Visual & Brand Systems',
    assignedBrands: ['brand-apex', 'brand-nova', 'brand-kinetix', 'brand-jdc', 'brand-nmc'],
  },
  {
    id: 'usr-003',
    name: 'Liam Chen',
    email: 'liam.chen@zarvis.ai',
    role: 'EMPLOYEE',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Digital Collateral & Motion Graphics',
    assignedBrands: ['brand-lumina', 'brand-veloce', 'brand-solaris', 'brand-jdc', 'brand-jitd'],
  },
  {
    id: 'usr-101',
    name: 'Elena Rostova',
    email: 'elena.rostova@zarvis.ai',
    role: 'SUPERVISOR',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'VP of Brand Quality & Creative Review',
    assignedBrands: ['brand-apex', 'brand-nova', 'brand-lumina', 'brand-veloce', 'brand-jdc', 'brand-nmc'],
    assignedCampaignIds: ['camp-apex-summit', 'camp-nova-debut', 'camp-jdc-banking', 'camp-nmc-ind'],
  },
  {
    id: 'usr-102',
    name: 'Marcus Vance',
    email: 'marcus.vance@zarvis.ai',
    role: 'SUPERVISOR',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    department: 'Principal Brand Governance Lead',
    assignedBrands: ['brand-apex', 'brand-nova', 'brand-veloce', 'brand-kinetix', 'brand-jdc', 'brand-nmc'],
    assignedCampaignIds: ['camp-apex-summit', 'camp-veloce-wealth', 'camp-jdc-banking'],
  },
  {
    id: 'usr-103',
    name: 'Maya Lin',
    email: 'maya.lin@zarvis.ai',
    role: 'SUPERVISOR',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Global Creative Operations Director',
    assignedBrands: ['brand-lumina', 'brand-nova', 'brand-solaris', 'brand-jitd', 'brand-jgi'],
    assignedCampaignIds: ['camp-lumina-clinical', 'camp-nova-debut', 'camp-jitd-admissions'],
  },
  {
    id: 'usr-admin',
    name: 'David Sterling',
    email: 'david.sterling@zarvis.ai',
    role: 'ADMIN',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    department: 'Chief Creative Officer & Head of Governance',
    assignedBrands: ['brand-apex', 'brand-nova', 'brand-lumina', 'brand-veloce', 'brand-kinetix', 'brand-solaris', 'brand-hyperion', 'brand-aura', 'brand-jdc', 'brand-nmc', 'brand-jitd', 'brand-jgi'],
  },
  {
    id: 'usr-nminds-admin',
    name: 'David Sterling',
    email: 'david.sterling@zarvis.ai',
    role: 'ADMIN',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    department: 'Chief Creative Officer & Head of Governance',
    assignedBrands: ['brand-apex', 'brand-nova', 'brand-lumina', 'brand-veloce', 'brand-jdc', 'brand-nmc'],
  },
  {
    id: 'usr-900',
    name: 'System Admin',
    email: 'admin@zarvis.ai',
    role: 'ADMIN',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    department: 'Enterprise Cloud & AI Ops',
    assignedBrands: ['brand-apex', 'brand-nova', 'brand-lumina', 'brand-veloce', 'brand-jdc', 'brand-nmc'],
  },
];

// ==========================================
// 2. SYSTEM SETTINGS (From PDF Page 8)
// ==========================================
export let SYSTEM_SETTINGS: SystemSettings = {
  aiApprovalThreshold: 85, // Score >= 85 routes to Manager Review; < 85 returns to employee for rework
  confidenceThreshold: 70, // 0.70 Low-confidence findings highlighted
  maxFileSizeMb: 30,
  videoFrameSamplingRateSec: 0,
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
  allowedVideoTypes: [],
  autoRouteEnabled: true,
  trendIntelligenceActive: true,
};

// ==========================================
// 3. BRANDS & CLIENTS (From PDF Page 3)
// ==========================================
export let BRANDS: Brand[] = [
  {
    id: 'brand-morningmood',
    name: 'The Morning Mood Coffee Co.',
    logo: '/assets/aistudio/image_b41c8e2c.png',
    description: 'Specialty cold brew coffee bar, iced mochaccinos & morning fuel.',
    isActive: true,
    colorPalette: {
      primary: '#3D2314',
      secondary: '#D4A373',
      accent: '#F4EBD9',
      forbidden: ['#00FFCC', '#9333EA'],
      neutral: '#FAF7EE',
    },
    typography: {
      primaryFont: 'Fraunces / Plus Jakarta Sans',
      minHeadingSize: '26px',
      minBodySize: '13px',
      rules: [
        'Main headline "The morning MOOD" must use high-contrast warm cocoa typography.',
        'Beverage hero photography must occupy at least 40% vertical safe zone.',
      ],
    },
    toolkit: {
      allowedFonts: ['Fraunces', 'Plus Jakarta Sans', 'Outfit', 'Inter'],
      primaryFont: 'Fraunces',
      secondaryFont: 'Plus Jakarta Sans',
      minHeadingSize: '26px',
      minBodySize: '13px',
      colorTheme: {
        primary: '#3D2314',
        secondary: '#D4A373',
        accent: '#F4EBD9',
        neutral: '#FAF7EE',
        forbiddenColors: ['#00FFCC', '#9333EA'],
      },
      logoSafeMarginPercent: 6,
      approvedPositions: ['TOP_CENTER', 'TOP_LEFT'],
      disclaimerTemplate: 'The Morning Mood Coffee Roasters. Crafted fresh daily.',
      contactRequirements: 'Morning Mood cafe locator and mobile order channel',
      socialSpecs: {
        allowedRatios: ['1:1 Square (1080x1080)', '4:5 Portrait (1080x1350)', '9:16 Story (1080x1920)'],
        maxTextCoveragePercent: 20,
        minResolution: '1080x1080',
      },
    },
    logoRules: {
      minSizePercent: 8,
      safeZonePercent: 6,
      approvedPositions: ['TOP_CENTER', 'TOP_LEFT'],
      prohibitedModifications: ['Do not alter coffee bean silhouette or sunrise rays.'],
    },
    creativeRules: {
      productVisibilityMinPercent: 40,
      tone: 'Invigorating, warm, premium artisan cafe, creative morning ritual.',
      backgroundStyle: 'Warm oat latte canvas with floating coffee typography.',
      ctaRequirement: 'Start the day with smooth, refreshing iced coffee.',
      disclaimerText: 'The Morning Mood Coffee Roasters.',
    },
    videoRules: {
      logoMinDurationSec: 0,
      productAppearanceWithinSec: 0,
      ctaRequiredAtEnd: false,
      minResolution: '1080p',
    },
    guidelinesMarkdown: `### The Morning Mood Coffee Co. Standards
- **Palette**: Espresso Brown (#3D2314), Caramel Cream (#D4A373), Warm Oat (#F4EBD9).
- **Hero Requirement**: Iced beverage presentation with creamy swirls must occupy &ge;40% of the canvas.
- **Copy Standard**: Energetic, inspiring morning messaging with clean typography hierarchy.`,
    parametersCount: 6,
  },
  {
    id: 'brand-nooncoffee',
    name: 'Noon Coffee House',
    logo: '/assets/aistudio/image_89d665aa.png',
    description: 'Artisan Italian roast, classic rich lattes, espresso & coffee roastery.',
    isActive: true,
    colorPalette: {
      primary: '#6B1717',
      secondary: '#F9F4EB',
      accent: '#2C1414',
      forbidden: ['#00FF7F', '#A855F7'],
      neutral: '#FAF7EE',
    },
    typography: {
      primaryFont: 'Modern Grotesk / Plus Jakarta Sans',
      minHeadingSize: '24px',
      minBodySize: '14px',
      rules: [
        'COFFEE bubble stack lettering must preserve bold legibility.',
        'Dynamic splash motion must maintain 6% boundary margin.',
      ],
    },
    toolkit: {
      allowedFonts: ['Fraunces', 'Plus Jakarta Sans', 'Inter'],
      primaryFont: 'Fraunces',
      secondaryFont: 'Plus Jakarta Sans',
      minHeadingSize: '24px',
      minBodySize: '14px',
      colorTheme: {
        primary: '#6B1717',
        secondary: '#F9F4EB',
        accent: '#2C1414',
        neutral: '#FAF7EE',
        forbiddenColors: ['#00FF7F', '#A855F7'],
      },
      logoSafeMarginPercent: 6,
      approvedPositions: ['TOP_CENTER', 'TOP_LEFT'],
      disclaimerTemplate: 'Noon Coffee House. Certified single-origin espresso.',
      contactRequirements: 'Noon Coffee signature sign-off and cafe location',
      socialSpecs: {
        allowedRatios: ['1:1 Square (1080x1080)', '4:5 Portrait (1080x1350)', '9:16 Story'],
        maxTextCoveragePercent: 20,
        minResolution: '1080x1080',
      },
    },
    logoRules: {
      minSizePercent: 6,
      safeZonePercent: 6,
      approvedPositions: ['TOP_CENTER', 'TOP_LEFT'],
      prohibitedModifications: ['Preserve coffee cup stamp icon and wordmark.'],
    },
    creativeRules: {
      productVisibilityMinPercent: 35,
      tone: 'Rich, classic, bold, passionate coffee craft.',
      backgroundStyle: 'Cream canvas with dynamic espresso and milk splash.',
      ctaRequirement: 'Classic rich latte recommendation.',
      disclaimerText: 'Noon Coffee House. All rights reserved.',
    },
    videoRules: {
      logoMinDurationSec: 0,
      productAppearanceWithinSec: 0,
      ctaRequiredAtEnd: false,
      minResolution: '1080p',
    },
    guidelinesMarkdown: `### Noon Coffee House Guidelines
- **Palette**: Roasted Crimson (#6B1717), Milk Foam Cream (#F9F4EB), Dark Roast (#2C1414).
- **Visuals**: Dynamic liquid splash photography with ice cubes and layered crema.
- **Typography**: Dual language support with high contrast.`,
    parametersCount: 6,
  },
  {
    id: 'brand-matchatime',
    name: 'Matcha Time Tokyo',
    logo: '/assets/aistudio/image_3cdcff8b.png',
    description: 'Authentic ceremonial Uji matcha bar, iced lattes & modern Japanese tea craft.',
    isActive: true,
    colorPalette: {
      primary: '#2E5629',
      secondary: '#88B04B',
      accent: '#FFB7D2',
      forbidden: ['#E11D48', '#2563EB'],
      neutral: '#FAF7EE',
    },
    typography: {
      primaryFont: 'Fraunces / Plus Jakarta Sans',
      minHeadingSize: '24px',
      minBodySize: '13px',
      rules: [
        'Matcha Time title block must be clear and crisp.',
        'Japanese katakana callouts (ice, matcha, milk) must be verified.',
      ],
    },
    toolkit: {
      allowedFonts: ['Fraunces', 'Plus Jakarta Sans', 'Inter'],
      primaryFont: 'Fraunces',
      secondaryFont: 'Plus Jakarta Sans',
      minHeadingSize: '24px',
      minBodySize: '13px',
      colorTheme: {
        primary: '#2E5629',
        secondary: '#88B04B',
        accent: '#FFB7D2',
        neutral: '#FAF7EE',
        forbiddenColors: ['#E11D48', '#2563EB'],
      },
      logoSafeMarginPercent: 6,
      approvedPositions: ['TOP_RIGHT', 'TOP_LEFT'],
      disclaimerTemplate: 'Matcha Time Tokyo. 100% Ceremonial Uji Grade.',
      contactRequirements: 'Matcha Time teahouse coordinates',
      socialSpecs: {
        allowedRatios: ['1:1 Square (1080x1080)', '4:5 Portrait (1080x1350)', '9:16 Story'],
        maxTextCoveragePercent: 25,
        minResolution: '1080x1080',
      },
    },
    logoRules: {
      minSizePercent: 8,
      safeZonePercent: 6,
      approvedPositions: ['TOP_RIGHT', 'TOP_LEFT'],
      prohibitedModifications: ['Preserve authentic Japanese typography characters.'],
    },
    creativeRules: {
      productVisibilityMinPercent: 40,
      tone: 'Peaceful, refreshing, authentic tea ceremony meets modern cafe culture.',
      backgroundStyle: 'Pale matcha wash with organic wave contours.',
      ctaRequirement: 'Ceremonial drink serving recommendation.',
      disclaimerText: 'Matcha Time Tokyo. Shizuoka & Uji estates.',
    },
    videoRules: {
      logoMinDurationSec: 0,
      productAppearanceWithinSec: 0,
      ctaRequiredAtEnd: false,
      minResolution: '1080p',
    },
    guidelinesMarkdown: `### Matcha Time Tokyo Standards
- **Palette**: Ceremonial Matcha (#2E5629), Fresh Sprout Green (#88B04B), Soft Pink (#FFB7D2).
- **Core Message**: Single-origin Camellia sinensis harvested for umami flavor and frothy iced lattes.
- **Safe Zone**: Keep katakana badge callouts inside safe boundary margins.`,
    parametersCount: 6,
  },
  {
    id: 'brand-strawberrycafe',
    name: 'Strawberry Blossom Cafe',
    logo: '/assets/aistudio/image_4178a031.png',
    description: 'Artisanal summer drink bar, cold foam strawberry matcha & sweet cream cafes.',
    isActive: true,
    colorPalette: {
      primary: '#2E5629',
      secondary: '#FF5E97',
      accent: '#FFF0F5',
      forbidden: ['#2563EB', '#F59E0B'],
      neutral: '#FAF7EE',
    },
    typography: {
      primaryFont: 'Fraunces / Plus Jakarta Sans',
      minHeadingSize: '28px',
      minBodySize: '13px',
      rules: [
        'Romantic script "stRawbeRRy" paired with bold "MATCHA" display.',
        'Ingredients list must remain legible in lower right safe area.',
      ],
    },
    toolkit: {
      allowedFonts: ['Fraunces', 'Plus Jakarta Sans', 'Inter'],
      primaryFont: 'Fraunces',
      secondaryFont: 'Plus Jakarta Sans',
      minHeadingSize: '28px',
      minBodySize: '13px',
      colorTheme: {
        primary: '#2E5629',
        secondary: '#FF5E97',
        accent: '#FFF0F5',
        neutral: '#FAF7EE',
        forbiddenColors: ['#2563EB', '#F59E0B'],
      },
      logoSafeMarginPercent: 6,
      approvedPositions: ['TOP_CENTER', 'BOTTOM_RIGHT'],
      disclaimerTemplate: 'Strawberry Blossom Cafe. Fresh berries and Uji matcha.',
      contactRequirements: 'Signature summer menu availability',
      socialSpecs: {
        allowedRatios: ['1:1 Square (1080x1080)', '4:5 Portrait (1080x1350)', '9:16 Story'],
        maxTextCoveragePercent: 20,
        minResolution: '1080x1080',
      },
    },
    logoRules: {
      minSizePercent: 8,
      safeZonePercent: 6,
      approvedPositions: ['TOP_CENTER', 'BOTTOM_RIGHT'],
      prohibitedModifications: ['Maintain dual strawberry and matcha color harmony.'],
    },
    creativeRules: {
      productVisibilityMinPercent: 45,
      tone: 'Cute, delicious, fresh, aesthetic summer cafe treat.',
      backgroundStyle: 'Warm ivory canvas with sparkling pink berry accents.',
      ctaRequirement: 'Summer drink signature invitation.',
      disclaimerText: 'Strawberry Blossom Cafe.',
    },
    videoRules: {
      logoMinDurationSec: 0,
      productAppearanceWithinSec: 0,
      ctaRequiredAtEnd: false,
      minResolution: '1080p',
    },
    guidelinesMarkdown: `### Strawberry Blossom Cafe Standards
- **Palette**: Matcha Green (#2E5629), Strawberry Blossom Pink (#FF5E97), Cream (#FAF7EE).
- **Aesthetic**: Layered drink presentation with dripping pink sweet foam and fresh strawberries.
- **Copy Standard**: Fresh strawberry, matcha powder, sweet cream ingredient verification.`,
    parametersCount: 6,
  },
  {
    id: 'brand-dobong',
    name: 'Dobong Bakery & Cafe',
    logo: '/assets/aistudio/image_36da4e00.png',
    description: 'Seoul-inspired minimalist bakery cafe, Basque burnt cheesecakes & filter coffee.',
    isActive: true,
    colorPalette: {
      primary: '#4A3525',
      secondary: '#F7F2EB',
      accent: '#D1A679',
      forbidden: ['#9333EA', '#00FF00'],
      neutral: '#FAF7EE',
    },
    typography: {
      primaryFont: 'Fraunces / Plus Jakarta Sans',
      minHeadingSize: '24px',
      minBodySize: '13px',
      rules: [
        'Cheesecake name and price must be clear without dummy placeholder text.',
        'Real branch address and operating contact required before sign-off.',
      ],
    },
    toolkit: {
      allowedFonts: ['Fraunces', 'Plus Jakarta Sans', 'Inter'],
      primaryFont: 'Fraunces',
      secondaryFont: 'Plus Jakarta Sans',
      minHeadingSize: '24px',
      minBodySize: '13px',
      colorTheme: {
        primary: '#4A3525',
        secondary: '#F7F2EB',
        accent: '#D1A679',
        neutral: '#FAF7EE',
        forbiddenColors: ['#9333EA', '#00FF00'],
      },
      logoSafeMarginPercent: 6,
      approvedPositions: ['TOP_LEFT', 'TOP_RIGHT'],
      disclaimerTemplate: 'Dobong Bakery & Cafe. Baked fresh daily.',
      contactRequirements: 'Verified store address and order hotline',
      socialSpecs: {
        allowedRatios: ['1:1 Square (1080x1080)', '4:5 Portrait (1080x1350)', '9:16 Story'],
        maxTextCoveragePercent: 20,
        minResolution: '1080x1080',
      },
    },
    logoRules: {
      minSizePercent: 7,
      safeZonePercent: 6,
      approvedPositions: ['TOP_LEFT', 'TOP_RIGHT'],
      prohibitedModifications: ['No distorted Korean Hangul bakery stamp modifications.'],
    },
    creativeRules: {
      productVisibilityMinPercent: 35,
      tone: 'Cozy, modern, warm artisanal bakery atmosphere.',
      backgroundStyle: 'Minimalist warm cream with bakery product showcase.',
      ctaRequirement: 'Order for takeaway or cafe dine-in.',
      disclaimerText: 'Dobong Bakery & Cafe.',
    },
    videoRules: {
      logoMinDurationSec: 0,
      productAppearanceWithinSec: 0,
      ctaRequiredAtEnd: false,
      minResolution: '1080p',
    },
    guidelinesMarkdown: `### Dobong Bakery & Cafe Standards
- **Palette**: Toast Brown (#4A3525), Cloud Foam (#F7F2EB), Butter Cream (#D1A679).
- **Compliance Rule**: Never submit with placeholder address "123 Distreet" or fake phone numbers.
- **Safe Area**: Top and bottom location icons must maintain &ge;5% canvas clearance.`,
    parametersCount: 6,
  },
  {
    id: 'brand-dulcetierra',
    name: 'Dulce Tierra Heladería',
    logo: '/assets/aistudio/image_2db42f96.png',
    description: 'Artisan gelato, gourmet ice creams & sweet afternoon desserts.',
    isActive: true,
    colorPalette: {
      primary: '#D94E78',
      secondary: '#7A9A7B',
      accent: '#FFFDF7',
      forbidden: ['#1E3A8A', '#000000'],
      neutral: '#FAF7EE',
    },
    typography: {
      primaryFont: 'Fraunces / Plus Jakarta Sans',
      minHeadingSize: '26px',
      minBodySize: '13px',
      rules: [
        'Helado Amor del Dia headline must maintain high contrast.',
        'Promotional 2x1 offer tags must be clearly readable.',
      ],
    },
    toolkit: {
      allowedFonts: ['Fraunces', 'Plus Jakarta Sans', 'Inter'],
      primaryFont: 'Fraunces',
      secondaryFont: 'Plus Jakarta Sans',
      minHeadingSize: '26px',
      minBodySize: '13px',
      colorTheme: {
        primary: '#D94E78',
        secondary: '#7A9A7B',
        accent: '#FFFDF7',
        neutral: '#FAF7EE',
        forbiddenColors: ['#1E3A8A', '#000000'],
      },
      logoSafeMarginPercent: 6,
      approvedPositions: ['TOP_CENTER', 'BOTTOM_CENTER'],
      disclaimerTemplate: 'Dulce Tierra Heladería Artesanal.',
      contactRequirements: 'Gelato shop locator and limited edition dates',
      socialSpecs: {
        allowedRatios: ['1:1 Square (1080x1080)', '4:5 Portrait (1080x1350)', '9:16 Story'],
        maxTextCoveragePercent: 20,
        minResolution: '1080x1080',
      },
    },
    logoRules: {
      minSizePercent: 8,
      safeZonePercent: 6,
      approvedPositions: ['TOP_CENTER', 'BOTTOM_CENTER'],
      prohibitedModifications: ['Preserve scripted Dulce Tierra vintage signature.'],
    },
    creativeRules: {
      productVisibilityMinPercent: 45,
      tone: 'Sweet, romantic, indulgent, refreshing artisan gelato.',
      backgroundStyle: 'Soft pastel ivory with sage green and rose ribbon accents.',
      ctaRequirement: 'Vive la experiencia enamorados.',
      disclaimerText: 'Dulce Tierra Heladería.',
    },
    videoRules: {
      logoMinDurationSec: 0,
      productAppearanceWithinSec: 0,
      ctaRequiredAtEnd: false,
      minResolution: '1080p',
    },
    guidelinesMarkdown: `### Dulce Tierra Heladería Standards
- **Palette**: Gelato Rose (#D94E78), Sage Green (#7A9A7B), Vanilla Cream (#FFFDF7).
- **Focus**: Dripping waffle cone gelato photography with high visual appeal.
- **Copy Standard**: Clear promotional conditions and limited-edition flavor details.`,
    parametersCount: 6,
  },
  {
    id: 'brand-sweetcrust',
    name: 'Petite Framboise Patisserie',
    logo: '/assets/aistudio/image_3de7b998.png',
    description: 'French boutique pastry cafe, artisan raspberry macarons & loose-leaf tea.',
    isActive: true,
    colorPalette: {
      primary: '#C92461',
      secondary: '#FFF3D6',
      accent: '#FFA3C5',
      forbidden: ['#2563EB', '#047857'],
      neutral: '#FAF7EE',
    },
    typography: {
      primaryFont: 'Fraunces / Plus Jakarta Sans',
      minHeadingSize: '24px',
      minBodySize: '13px',
      rules: [
        'Spelling and grammar in body text must be validated (no "evry" or "indipendent" typos).',
        'Store operating hours must not be contradictory or implausible.',
      ],
    },
    toolkit: {
      allowedFonts: ['Fraunces', 'Plus Jakarta Sans', 'Inter'],
      primaryFont: 'Fraunces',
      secondaryFont: 'Plus Jakarta Sans',
      minHeadingSize: '24px',
      minBodySize: '13px',
      colorTheme: {
        primary: '#C92461',
        secondary: '#FFF3D6',
        accent: '#FFA3C5',
        neutral: '#FAF7EE',
        forbiddenColors: ['#2563EB', '#047857'],
      },
      logoSafeMarginPercent: 6,
      approvedPositions: ['TOP_LEFT', 'TOP_CENTER'],
      disclaimerTemplate: 'Petite Framboise Patisserie & Cafe.',
      contactRequirements: 'Daily patisserie store opening hours and address',
      socialSpecs: {
        allowedRatios: ['1:1 Square (1080x1080)', '4:5 Portrait (1080x1350)', '9:16 Story'],
        maxTextCoveragePercent: 20,
        minResolution: '1080x1080',
      },
    },
    logoRules: {
      minSizePercent: 8,
      safeZonePercent: 6,
      approvedPositions: ['TOP_LEFT', 'TOP_CENTER'],
      prohibitedModifications: ['Preserve raspberry stack logo arrangement.'],
    },
    creativeRules: {
      productVisibilityMinPercent: 40,
      tone: 'Playful, sweet, boutique French confectionery, cheerful.',
      backgroundStyle: 'Butter cream canvas with raspberry bubble text clouds.',
      ctaRequirement: 'Visit patisserie counter for daily fresh batch.',
      disclaimerText: 'Petite Framboise Patisserie.',
    },
    videoRules: {
      logoMinDurationSec: 0,
      productAppearanceWithinSec: 0,
      ctaRequiredAtEnd: false,
      minResolution: '1080p',
    },
    guidelinesMarkdown: `### Petite Framboise Patisserie Standards
- **Palette**: Fresh Raspberry (#C92461), Soft Pastry Cream (#FFF3D6), Bubblegum (#FFA3C5).
- **Syntax Gate**: Automatic rejection if typos like "evry indipendent day" are detected.
- **Hours Gate**: Opening hours must specify standard operations (e.g. 9 am - 8 pm, not 1-hour windows).`,
    parametersCount: 6,
  },
  {
    id: 'brand-portosmoothies',
    name: 'Porto Smoothies House',
    logo: '/assets/aistudio/image_91ac2035.png',
    description: 'Botanical smoothie bar, iced plant-based revitalizers & green tea cafes.',
    isActive: true,
    colorPalette: {
      primary: '#1E3A1A',
      secondary: '#5D9C59',
      accent: '#FAF8F5',
      forbidden: ['#E11D48', '#FF6600'],
      neutral: '#FAF7EE',
    },
    typography: {
      primaryFont: 'Fraunces / Plus Jakarta Sans',
      minHeadingSize: '26px',
      minBodySize: '13px',
      rules: [
        'Editorial "The new ritual" heading must follow condensed grid alignment.',
        'Smoothie house city location and service hours must be visible.',
      ],
    },
    toolkit: {
      allowedFonts: ['Fraunces', 'Plus Jakarta Sans', 'Inter'],
      primaryFont: 'Fraunces',
      secondaryFont: 'Plus Jakarta Sans',
      minHeadingSize: '26px',
      minBodySize: '13px',
      colorTheme: {
        primary: '#1E3A1A',
        secondary: '#5D9C59',
        accent: '#FAF8F5',
        neutral: '#FAF7EE',
        forbiddenColors: ['#E11D48', '#FF6600'],
      },
      logoSafeMarginPercent: 6,
      approvedPositions: ['TOP_LEFT', 'BOTTOM_LEFT'],
      disclaimerTemplate: 'Porto Smoothies House. Plant-based organic vitality.',
      contactRequirements: 'Store city location (Porto, Portugal) and opening hours',
      socialSpecs: {
        allowedRatios: ['1:1 Square (1080x1080)', '4:5 Portrait (1080x1350)', '9:16 Story'],
        maxTextCoveragePercent: 20,
        minResolution: '1080x1080',
      },
    },
    logoRules: {
      minSizePercent: 8,
      safeZonePercent: 6,
      approvedPositions: ['TOP_LEFT', 'BOTTOM_LEFT'],
      prohibitedModifications: ['Preserve condensed botanical typography.'],
    },
    creativeRules: {
      productVisibilityMinPercent: 45,
      tone: 'Clean, vital, organic, modern European wellness cafe.',
      backgroundStyle: 'Textured ivory linen canvas with green typography rhythm.',
      ctaRequirement: 'Come get yours invitation.',
      disclaimerText: 'Porto Smoothies House.',
    },
    videoRules: {
      logoMinDurationSec: 0,
      productAppearanceWithinSec: 0,
      ctaRequiredAtEnd: false,
      minResolution: '1080p',
    },
    guidelinesMarkdown: `### Porto Smoothies House Standards
- **Palette**: Deep Botanical (#1E3A1A), Fresh Green (#5D9C59), Linen (#FAF8F5).
- **Composition**: Centered iced smoothie beverage with bold typography stack.
- **Copy Standard**: Clear serving window (9AM - 18PM) and verified location tag.`,
    parametersCount: 6,
  },
];

// ==========================================
// 4. CAMPAIGNS (From PDF Page 3)
// ==========================================
export let CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-morning-mood',
    brandId: 'brand-morningmood',
    name: 'The Morning Mood - Ferrero Iced Coffee',
    product: 'Artisan Iced Coffee & Mochas',
    campaignType: 'Social Media Poster',
    region: 'Global & North America',
    targetAudience: 'Coffee Lovers, Morning Commuters, Cafe Seekers',
    description: 'Refreshing morning iced coffee poster featuring decadent Ferrero chocolate topping and creamy swirls.',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    active: true,
    assignedSupervisorId: 'usr-101',
    assignedSupervisorName: 'Elena Rostova',
  },
  {
    id: 'camp-noon-coffee',
    brandId: 'brand-nooncoffee',
    name: 'Noon Coffee - Classic Rich Latte',
    product: 'Classic Italian Roast & Iced Lattes',
    campaignType: 'Specialty Drink Poster',
    region: 'Europe & Global',
    targetAudience: 'Espresso Connoisseurs, Specialty Roastery Guests',
    description: 'Dynamic splash photography creative showcasing classic rich latte with ice cubes and bold typography.',
    startDate: '2026-08-01',
    endDate: '2026-11-30',
    active: true,
    assignedSupervisorId: 'usr-101',
    assignedSupervisorName: 'Elena Rostova',
  },
  {
    id: 'camp-matchatime',
    brandId: 'brand-matchatime',
    name: 'Matcha Time - Tokyo Iced Latte',
    product: 'Ceremonial Uji Matcha Latte',
    campaignType: 'Tea Bar Poster',
    region: 'Japan & Global',
    targetAudience: 'Matcha Lovers, Wellness Seekers, Aesthetic Cafe Fans',
    description: 'Vibrant organic matcha drink showcase with Japanese character callouts and frothy sweet cream.',
    startDate: '2026-08-15',
    endDate: '2026-12-15',
    active: true,
    assignedSupervisorId: 'usr-101',
    assignedSupervisorName: 'Elena Rostova',
  },
  {
    id: 'camp-strawberry-matcha',
    brandId: 'brand-strawberrycafe',
    name: 'Strawberry Matcha Signature Cafe',
    product: 'Fresh Strawberry Cold Foam Uji Matcha',
    campaignType: 'Signature Summer Drink Poster',
    region: 'Global',
    targetAudience: 'Boutique Cafe Guests, Summer Drink Explorers',
    description: 'Aesthetic layered summer signature drink featuring fresh sweet cream foam, strawberries, and ceremonial matcha.',
    startDate: '2026-06-01',
    endDate: '2026-10-31',
    active: true,
    assignedSupervisorId: 'usr-101',
    assignedSupervisorName: 'Elena Rostova',
  },
  {
    id: 'camp-dobong-cheesecake',
    brandId: 'brand-dobong',
    name: 'Wanna Taste!? Blue Cheesecake',
    product: 'Korean Basque Burnt Cheesecake & Filter Coffee',
    campaignType: 'Bakery Cafe Poster',
    region: 'Seoul & Global',
    targetAudience: 'Pastry Lovers, Minimalist Cafe Visitors',
    description: 'Signature Basque burnt cheesecake poster with bold typography and warm cafe atmosphere.',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    active: true,
    assignedSupervisorId: 'usr-101',
    assignedSupervisorName: 'Elena Rostova',
  },
  {
    id: 'camp-dulce-tierra',
    brandId: 'brand-dulcetierra',
    name: 'Amor Helado - 2x1 Gelato Promo',
    product: 'Artisan Gelato & Melting Cones',
    campaignType: 'Promotional Dessert Poster',
    region: 'Latin America & Europe',
    targetAudience: 'Couples, Dessert Enthusiasts, Summer Strollers',
    description: 'Mouthwatering dripping waffle cone gelato creative promoting limited edition 2x1 romantic flavor.',
    startDate: '2026-08-01',
    endDate: '2026-10-31',
    active: true,
    assignedSupervisorId: 'usr-101',
    assignedSupervisorName: 'Elena Rostova',
  },
  {
    id: 'camp-macaron-rasp',
    brandId: 'brand-sweetcrust',
    name: 'Petite Framboise - Raspberry Macaron',
    product: 'Fresh Raspberry Parisian Macarons',
    campaignType: 'Boutique Patisserie Poster',
    region: 'Paris & Global',
    targetAudience: 'Pastry Connoisseurs, Afternoon Tea Guests',
    description: 'Bubblegum and raspberry macaron stack poster highlighting daily artisanal batches.',
    startDate: '2026-09-01',
    endDate: '2026-11-30',
    active: true,
    assignedSupervisorId: 'usr-101',
    assignedSupervisorName: 'Elena Rostova',
  },
  {
    id: 'camp-porto-matcha',
    brandId: 'brand-portosmoothies',
    name: 'The New Ritual - Matcha Revitalizer',
    product: 'Plant-Based Organic Green Smoothie',
    campaignType: 'Wellness Cafe Poster',
    region: 'Portugal & Europe',
    targetAudience: 'Health Seekers, Plant-Based Smoothie Fans',
    description: 'Clean modern editorial smoothie poster for the Green Revitalizer morning plant power.',
    startDate: '2026-07-01',
    endDate: '2026-11-30',
    active: true,
    assignedSupervisorId: 'usr-101',
    assignedSupervisorName: 'Elena Rostova',
  },
];

// ==========================================
// 5. ZARVIS BASIC-STAGE PARAMETERS (From PDF Page 4)
// ==========================================
export let PARAMETERS: BrandParameter[] = [
  {
    id: 'par-001',
    brandId: 'brand-jdc',
    name: 'Logo Presence',
    category: 'LOGO',
    type: 'BOOLEAN',
    severity: 'HIGH',
    weight: 10,
    passThreshold: 80,
    isRequired: true,
    isActive: true,
    applicableMediaType: 'IMAGE',
    instructions: 'Logo/brand mark must be present and recognizable.',
    passCriteria: 'Brand mark detected in approved quadrant.',
  },
  {
    id: 'par-002',
    brandId: 'brand-jdc',
    name: 'Logo Integrity',
    category: 'LOGO',
    type: 'SPATIAL',
    severity: 'HIGH',
    weight: 8,
    passThreshold: 80,
    isRequired: true,
    isActive: true,
    applicableMediaType: 'IMAGE',
    instructions: 'Logo should not be distorted, altered, or incorrectly reconstructed.',
    passCriteria: 'Aspect ratio and mark shape intact.',
  },
  {
    id: 'par-003',
    brandId: 'brand-jdc',
    name: 'Brand Colour Alignment',
    category: 'COLOR_PALETTE',
    type: 'VISUAL',
    severity: 'HIGH',
    weight: 8,
    passThreshold: 80,
    isRequired: true,
    isActive: true,
    applicableMediaType: 'IMAGE',
    instructions: 'Main palette should remain consistent with the selected brand.',
    passCriteria: 'No prohibited colors, primary and secondary brand hues dominant.',
  },
  {
    id: 'par-004',
    brandId: 'brand-jdc',
    name: 'Headline Legibility',
    category: 'TYPOGRAPHY',
    type: 'TEXT',
    severity: 'HIGH',
    weight: 8,
    passThreshold: 80,
    isRequired: true,
    isActive: true,
    applicableMediaType: 'IMAGE',
    instructions: 'Primary headline must be readable at social-media viewing size.',
    passCriteria: 'High contrast between heading and background.',
  },
  {
    id: 'par-005',
    brandId: 'brand-jdc',
    name: 'Typography Hierarchy',
    category: 'TYPOGRAPHY',
    type: 'TEXT',
    severity: 'MEDIUM',
    weight: 6,
    passThreshold: 75,
    isRequired: false,
    isActive: true,
    applicableMediaType: 'IMAGE',
    instructions: 'Headline, supporting copy, CTA and footer should have clear hierarchy.',
    passCriteria: 'Logical font-size progression and weight distinction.',
  },
  {
    id: 'par-006',
    brandId: 'brand-jdc',
    name: 'Contact / CTA Presence',
    category: 'CTA',
    type: 'TEXT',
    severity: 'HIGH',
    weight: 8,
    passThreshold: 80,
    isRequired: true,
    isActive: true,
    applicableMediaType: 'IMAGE',
    instructions: 'Required contact, admissions or action information must be present.',
    passCriteria: 'Helpline phone, email or action button visible.',
  },
  {
    id: 'par-007',
    brandId: 'brand-jdc',
    name: 'Website / Handle Accuracy',
    category: 'CTA',
    type: 'TEXT',
    severity: 'HIGH',
    weight: 6,
    passThreshold: 80,
    isRequired: true,
    isActive: true,
    applicableMediaType: 'IMAGE',
    instructions: 'Website or social handle must be present and legible.',
    passCriteria: 'Domain spelling and handle verified.',
  },
  {
    id: 'par-008',
    brandId: 'brand-jdc',
    name: 'Text Consistency',
    category: 'TEXT',
    type: 'TEXT',
    severity: 'HIGH',
    weight: 8,
    passThreshold: 80,
    isRequired: true,
    isActive: true,
    applicableMediaType: 'IMAGE',
    instructions: 'No obvious spelling, duplication, or contradictory text.',
    passCriteria: 'OCR text passes syntax and consistency check.',
  },
  {
    id: 'par-009',
    brandId: 'brand-jdc',
    name: 'Safe Area / Cropping',
    category: 'SAFE_AREA',
    type: 'SPATIAL',
    severity: 'HIGH',
    weight: 7,
    passThreshold: 80,
    isRequired: true,
    isActive: true,
    applicableMediaType: 'IMAGE',
    instructions: 'Important text, logos and contact details must remain inside safe margins (>=5%).',
    passCriteria: 'No elements cropped or bleeding within edge boundaries.',
  },
  {
    id: 'par-010',
    brandId: 'brand-jdc',
    name: 'Image / Subject Quality',
    category: 'IMAGE_QUALITY',
    type: 'VISUAL',
    severity: 'MEDIUM',
    weight: 7,
    passThreshold: 75,
    isRequired: false,
    isActive: true,
    applicableMediaType: 'IMAGE',
    instructions: 'Main subject/product/person/building should be clear and professionally presented.',
    passCriteria: 'No pixelation, compression artifacts or poor lighting.',
  },
  {
    id: 'par-011',
    brandId: 'brand-jdc',
    name: 'Composition & Balance',
    category: 'VISUAL',
    type: 'VISUAL',
    severity: 'MEDIUM',
    weight: 6,
    passThreshold: 75,
    isRequired: false,
    isActive: true,
    applicableMediaType: 'IMAGE',
    instructions: 'Text, subject, logo and supporting graphics should not compete visually.',
    passCriteria: 'Harmonious layout with balanced negative space.',
  },
  {
    id: 'par-012',
    brandId: 'brand-jdc',
    name: 'Visual Contrast',
    category: 'COLOR_PALETTE',
    type: 'VISUAL',
    severity: 'HIGH',
    weight: 6,
    passThreshold: 80,
    isRequired: true,
    isActive: true,
    applicableMediaType: 'IMAGE',
    instructions: 'Text must maintain sufficient contrast against the background (>=4.5:1).',
    passCriteria: 'WCAG AA compliant contrast.',
  },
  {
    id: 'par-013',
    brandId: 'brand-jdc',
    name: 'Social Format / Ratio',
    category: 'SAFE_AREA',
    type: 'SPATIAL',
    severity: 'MEDIUM',
    weight: 4,
    passThreshold: 75,
    isRequired: false,
    isActive: true,
    applicableMediaType: 'IMAGE',
    instructions: 'Creative should match the intended social-media dimensions.',
    passCriteria: 'Complies with standard aspect ratios (4:5, 1:1, or 9:16).',
  },
  {
    id: 'par-014',
    brandId: 'brand-jitd',
    name: 'Accreditation / Badge Integrity',
    category: 'BRAND_COMPLIANCE',
    type: 'VISUAL',
    severity: 'MEDIUM',
    weight: 4,
    passThreshold: 75,
    isRequired: false,
    isActive: true,
    applicableMediaType: 'IMAGE',
    instructions: 'Accreditation/achievement badges must be visible and not malformed.',
    passCriteria: 'NAAC A+ and official recognition seals clearly rendered.',
  },
  {
    id: 'par-015',
    brandId: 'brand-jitd',
    name: 'Claim / Number Consistency',
    category: 'BRAND_COMPLIANCE',
    type: 'TEXT',
    severity: 'HIGH',
    weight: 4,
    passThreshold: 80,
    isRequired: true,
    isActive: true,
    applicableMediaType: 'IMAGE',
    instructions: 'Numbers and claims such as placement, collaborations or companies must remain intact.',
    passCriteria: 'Verified statistics: 75+ collaborations, 122 companies, 100% placement assurance.',
  },
];

// ==========================================
// 6. SUBMISSION SAMPLE DATA (Coffee, Cafe & Cute Dessert Posters)
// ==========================================
export let SUBMISSIONS: Submission[] = [
  // SUB-101: The Morning Mood | Ferrero Iced Coffee | 96% -> APPROVED
  {
    id: 'SUB-101',
    campaignId: 'camp-morning-mood',
    campaignName: 'The Morning Mood - Ferrero Iced Coffee',
    brandId: 'brand-morningmood',
    brandName: 'The Morning Mood Coffee Co.',
    brandLogo: '/assets/aistudio/image_b41c8e2c.png',
    userId: 'usr-001',
    userName: 'Chetana Mayaza',
    userEmail: 'c.mayaza@morningmood.com',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    mediaType: 'image',
    currentVersion: 2,
    overallAiScore: 96,
    overallAiConfidence: 0.98,
    workflowStatus: 'APPROVED',
    humanDecision: 'APPROVED',
    humanReviewerId: 'usr-101',
    humanReviewerName: 'Elena Rostova',
    humanComment: 'Exceptional product presentation and WCAG AA contrast. Approved for immediate social launch.',
    createdAt: '2026-09-06T11:00:00Z',
    updatedAt: '2026-09-06T11:45:00Z',
    finalApprovalAt: '2026-09-06T11:45:00Z',
    totalTurnaroundMinutes: 45,
    tags: ['coffee', 'iced-coffee', 'ferrero-topping', 'approved'],
    comments: [
      {
        id: 'c-sub101-1',
        userId: 'usr-101',
        userName: 'Elena Rostova',
        userRole: 'SUPERVISOR',
        userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        content: 'Revised iced coffee creative passes both AI gate (96%) and human review. Typography hierarchy and focal subject contrast are pristine. Approved for distribution.',
        createdAt: '2026-09-06T11:45:00Z',
        type: 'APPROVAL',
      },
    ],
    versions: [
      {
        versionNumber: 2,
        submissionId: 'SUB-101',
        changelog: 'Centered Ferrero topping and high-contrast morning coffee typography.',
        submittedAt: '2026-09-06T11:00:00Z',
        aiScore: 96,
        aiConfidence: 0.98,
        aiStatus: 'PASSED',
        workflowStatus: 'APPROVED',
        humanDecision: 'APPROVED',
        files: [
          {
            id: 'file-sub101-1',
            fileName: 'morning-mood-ferrero.png',
            fileSize: 2450000,
            fileType: 'image',
            mimeType: 'image/png',
            fileUrl: '/assets/aistudio/image_b41c8e2c.png',
            thumbnailUrl: '/assets/aistudio/image_b41c8e2c.png',
          },
        ],
        analysisResult: {
          id: 'eval-sub101-1',
          submissionId: 'SUB-101',
          versionNumber: 2,
          overallScore: 96,
          confidence: 0.98,
          status: 'AWAITING_SUPERVISOR_REVIEW',
          executiveSummary: 'AI GATE PASSED: Score 96% meets >=85% threshold. Rich iced coffee presentation, warm espresso palette, and clear morning typography hierarchy.',
          analyzedAt: '2026-09-06T11:02:00Z',
          modelUsed: 'gemini-2.5-flash',
          processingTimeMs: 1180,
          recommendations: [],
          parameters: [
            {
              parameterId: 'par-003',
              name: 'Brand Colour Alignment',
              category: 'COLOR_PALETTE',
              score: 98,
              status: 'PASS',
              confidence: 0.99,
              evidence: ['Espresso Brown (#3D2314) and Caramel Cream (#D4A373) match approved palette.'],
              severity: 'HIGH',
              weight: 50,
            },
            {
              parameterId: 'par-004',
              name: 'Headline Legibility',
              category: 'TYPOGRAPHY',
              score: 95,
              status: 'PASS',
              confidence: 0.97,
              evidence: ['"The morning MOOD" display typography is clear with 7.2:1 contrast.'],
              severity: 'HIGH',
              weight: 50,
            },
          ],
        },
      },
    ],
  },

  // SUB-102: Noon Coffee House | Classic Rich Latte | 95% -> APPROVED
  {
    id: 'SUB-102',
    campaignId: 'camp-noon-coffee',
    campaignName: 'Noon Coffee - Classic Rich Latte',
    brandId: 'brand-nooncoffee',
    brandName: 'Noon Coffee House',
    brandLogo: '/assets/aistudio/image_89d665aa.png',
    userId: 'usr-001',
    userName: 'Chetana Mayaza',
    userEmail: 'c.mayaza@nooncoffee.com',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    mediaType: 'image',
    currentVersion: 1,
    overallAiScore: 95,
    overallAiConfidence: 0.98,
    workflowStatus: 'APPROVED',
    humanDecision: 'APPROVED',
    humanReviewerId: 'usr-101',
    humanReviewerName: 'Elena Rostova',
    humanComment: 'Dynamic liquid splash photography verified; dual bilingual typography adheres to brand guide. Approved for launch.',
    createdAt: '2026-08-14T09:30:00Z',
    updatedAt: '2026-08-14T10:15:00Z',
    tags: ['coffee-splash', 'noon-coffee', 'approved', 'latte'],
    comments: [
      {
        id: 'c-sub102-1',
        userId: 'usr-101',
        userName: 'Elena Rostova',
        userRole: 'SUPERVISOR',
        userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        content: 'Noon Coffee iced latte creative passes all brand toolkit metrics with 95% AI confidence. Splash motion and typography hierarchy verified.',
        createdAt: '2026-08-14T10:15:00Z',
        type: 'APPROVAL',
      },
    ],
    versions: [
      {
        versionNumber: 1,
        submissionId: 'SUB-102',
        changelog: 'Official Noon Coffee rich latte splash creative.',
        submittedAt: '2026-08-14T09:30:00Z',
        aiScore: 95,
        aiConfidence: 0.98,
        aiStatus: 'PASSED',
        workflowStatus: 'APPROVED',
        humanDecision: 'APPROVED',
        files: [
          {
            id: 'file-sub102-1',
            fileName: 'noon-coffee-latte.png',
            fileSize: 2800000,
            fileType: 'image',
            mimeType: 'image/png',
            fileUrl: '/assets/aistudio/image_89d665aa.png',
            thumbnailUrl: '/assets/aistudio/image_89d665aa.png',
          },
        ],
        analysisResult: {
          id: 'eval-sub102-1',
          submissionId: 'SUB-102',
          versionNumber: 1,
          overallScore: 95,
          confidence: 0.98,
          status: 'AWAITING_SUPERVISOR_REVIEW',
          executiveSummary: 'AI GATE PASSED: Score 95% meets >=85% threshold. Splash motion dynamics captured cleanly with high clarity and contrast.',
          analyzedAt: '2026-08-14T09:31:45Z',
          modelUsed: 'gemini-2.5-flash',
          processingTimeMs: 1240,
          recommendations: [],
          parameters: [
            {
              parameterId: 'par-003',
              name: 'Brand Colour Alignment',
              category: 'COLOR_PALETTE',
              score: 96,
              status: 'PASS',
              confidence: 0.98,
              evidence: ['Deep Espresso (#6B1717) and Cream Latte (#F9F4EB) are verified.'],
              severity: 'HIGH',
              weight: 50,
            },
            {
              parameterId: 'par-004',
              name: 'Headline Legibility',
              category: 'TYPOGRAPHY',
              score: 94,
              status: 'PASS',
              confidence: 0.98,
              evidence: ['COFFEE bubble lettering maintains high visibility against splash.'],
              severity: 'HIGH',
              weight: 50,
            },
          ],
        },
      },
    ],
  },

  // SUB-103: Matcha Time Tokyo | Tokyo Iced Latte | 94% -> APPROVED
  {
    id: 'SUB-103',
    campaignId: 'camp-matchatime',
    campaignName: 'Matcha Time - Tokyo Iced Latte',
    brandId: 'brand-matchatime',
    brandName: 'Matcha Time Tokyo',
    brandLogo: '/assets/aistudio/image_3cdcff8b.png',
    userId: 'usr-001',
    userName: 'Chetana Mayaza',
    userEmail: 'c.mayaza@matchatime.jp',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    mediaType: 'image',
    currentVersion: 1,
    overallAiScore: 94,
    overallAiConfidence: 0.97,
    workflowStatus: 'APPROVED',
    humanDecision: 'APPROVED',
    humanReviewerId: 'usr-101',
    humanReviewerName: 'Elena Rostova',
    humanComment: 'Authentic Uji ceremonial matcha aesthetic, bilingual Japanese callouts, balanced margins. Approved.',
    createdAt: '2026-08-20T08:00:00Z',
    updatedAt: '2026-08-20T08:40:00Z',
    tags: ['matcha-time', 'tokyo-latte', 'cafe', 'approved'],
    comments: [
      {
        id: 'c-sub103-1',
        userId: 'usr-101',
        userName: 'Elena Rostova',
        userRole: 'SUPERVISOR',
        userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        content: 'Vibrant matcha layer separation and frothy sweet cream look appetizing. Text callouts well positioned.',
        createdAt: '2026-08-20T08:40:00Z',
        type: 'APPROVAL',
      },
    ],
    versions: [
      {
        versionNumber: 1,
        submissionId: 'SUB-103',
        changelog: 'Matcha Time Tokyo Iced Latte signature poster.',
        submittedAt: '2026-08-20T08:00:00Z',
        aiScore: 94,
        aiConfidence: 0.97,
        aiStatus: 'PASSED',
        workflowStatus: 'APPROVED',
        humanDecision: 'APPROVED',
        files: [
          {
            id: 'file-sub103-1',
            fileName: 'matcha-time-tokyo-latte.png',
            fileSize: 2600000,
            fileType: 'image',
            mimeType: 'image/png',
            fileUrl: '/assets/aistudio/image_3cdcff8b.png',
            thumbnailUrl: '/assets/aistudio/image_3cdcff8b.png',
          },
        ],
        analysisResult: {
          id: 'eval-sub103-1',
          submissionId: 'SUB-103',
          versionNumber: 1,
          overallScore: 94,
          confidence: 0.97,
          status: 'AWAITING_SUPERVISOR_REVIEW',
          executiveSummary: 'AI GATE PASSED: Score 94% meets >=85% threshold. Uji matcha drink clarity verified, Japanese callout badges compliant with safe margins.',
          analyzedAt: '2026-08-20T08:02:00Z',
          modelUsed: 'gemini-2.5-flash',
          processingTimeMs: 1210,
          recommendations: [],
          parameters: [
            {
              parameterId: 'par-003',
              name: 'Brand Colour Alignment',
              category: 'COLOR_PALETTE',
              score: 96,
              status: 'PASS',
              confidence: 0.98,
              evidence: ['Uji Matcha Green (#2D5A27) and Soft Blossom (#FFCAD4) pass compliance.'],
              severity: 'HIGH',
              weight: 50,
            },
            {
              parameterId: 'par-004',
              name: 'Headline Legibility',
              category: 'TYPOGRAPHY',
              score: 92,
              status: 'PASS',
              confidence: 0.96,
              evidence: ['MATCHA TIME headline is distinct and readable.'],
              severity: 'HIGH',
              weight: 50,
            },
          ],
        },
      },
    ],
  },

  // SUB-104: Strawberry Blossom Cafe | Strawberry Matcha Signature | 93% -> APPROVED (CARD 4 FIX)
  {
    id: 'SUB-104',
    campaignId: 'camp-strawberry-matcha',
    campaignName: 'Strawberry Matcha Signature Cafe',
    brandId: 'brand-strawberrycafe',
    brandName: 'Strawberry Blossom Cafe',
    brandLogo: '/assets/aistudio/image_4178a031.png',
    userId: 'usr-001',
    userName: 'Chetana Mayaza',
    userEmail: 'c.mayaza@strawberryblossom.com',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    mediaType: 'image',
    currentVersion: 1,
    overallAiScore: 93,
    overallAiConfidence: 0.97,
    workflowStatus: 'APPROVED',
    humanDecision: 'APPROVED',
    humanReviewerId: 'usr-101',
    humanReviewerName: 'Elena Rostova',
    humanComment: 'Stunning layered strawberry matcha drink poster. Palette harmony of blush pink, forest matcha, and warm cream is sublime.',
    createdAt: '2026-08-25T10:00:00Z',
    updatedAt: '2026-08-25T10:35:00Z',
    tags: ['strawberry-matcha', 'summer-drink', 'signature-cafe', 'approved'],
    comments: [
      {
        id: 'c-sub104-1',
        userId: 'usr-101',
        userName: 'Elena Rostova',
        userRole: 'SUPERVISOR',
        userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        content: 'This 4th card signature poster sets the benchmark for the cafe aesthetic. Certified 93% AI pre-flight and approved.',
        createdAt: '2026-08-25T10:35:00Z',
        type: 'APPROVAL',
      },
    ],
    versions: [
      {
        versionNumber: 1,
        submissionId: 'SUB-104',
        changelog: 'Strawberry Matcha Summer Drink Signature cafe poster.',
        submittedAt: '2026-08-25T10:00:00Z',
        aiScore: 93,
        aiConfidence: 0.97,
        aiStatus: 'PASSED',
        workflowStatus: 'APPROVED',
        humanDecision: 'APPROVED',
        files: [
          {
            id: 'file-sub104-1',
            fileName: 'strawberry-matcha-signature.png',
            fileSize: 2950000,
            fileType: 'image',
            mimeType: 'image/png',
            fileUrl: '/assets/aistudio/image_4178a031.png',
            thumbnailUrl: '/assets/aistudio/image_4178a031.png',
          },
        ],
        analysisResult: {
          id: 'eval-sub104-1',
          submissionId: 'SUB-104',
          versionNumber: 1,
          overallScore: 93,
          confidence: 0.97,
          status: 'AWAITING_SUPERVISOR_REVIEW',
          executiveSummary: 'AI GATE PASSED: Score 93% meets >=85% threshold. Beautiful strawberry cold foam and deep matcha tones. Script and display typography verified.',
          analyzedAt: '2026-08-25T10:02:00Z',
          modelUsed: 'gemini-2.5-flash',
          processingTimeMs: 1190,
          recommendations: [],
          parameters: [
            {
              parameterId: 'par-003',
              name: 'Brand Colour Alignment',
              category: 'COLOR_PALETTE',
              score: 95,
              status: 'PASS',
              confidence: 0.98,
              evidence: ['Strawberry Pink (#FF5E97), Ceremonial Matcha (#2E5629), and Cream (#FAF7EE) pass.'],
              severity: 'HIGH',
              weight: 50,
            },
            {
              parameterId: 'par-004',
              name: 'Headline Legibility',
              category: 'TYPOGRAPHY',
              score: 91,
              status: 'PASS',
              confidence: 0.96,
              evidence: ['"Strawberry MATCHA" headline matches authorized script and serif fonts.'],
              severity: 'HIGH',
              weight: 50,
            },
          ],
        },
      },
    ],
  },

  // SUB-105: Dobong Bakery & Cafe | Basque Burnt Cheesecake | 74% -> NEEDS_IMPROVEMENT
  {
    id: 'SUB-105',
    campaignId: 'camp-dobong-cheesecake',
    campaignName: 'Wanna Taste!? Blue Cheesecake',
    brandId: 'brand-dobong',
    brandName: 'Dobong Bakery & Cafe',
    brandLogo: '/assets/aistudio/image_36da4e00.png',
    userId: 'usr-001',
    userName: 'Chetana Mayaza',
    userEmail: 'c.mayaza@dobongbakery.com',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    mediaType: 'image',
    currentVersion: 1,
    overallAiScore: 74,
    overallAiConfidence: 0.95,
    workflowStatus: 'NEEDS_IMPROVEMENT', // < 85% gate
    humanDecision: 'PENDING',
    createdAt: '2026-09-07T14:10:00Z',
    updatedAt: '2026-09-07T14:15:00Z',
    tags: ['dobong-bakery', 'cheesecake', 'needs-rework', 'placeholder-failed'],
    comments: [
      {
        id: 'c-sub105-1',
        userId: 'system-ai',
        userName: 'ZARVIS AI Compliance Gate',
        userRole: 'ADMIN',
        userAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
        content: 'AI GATE RETURNED FOR REWORK: Overall score of 74% is below the required 85% threshold. Issues flagged: Placeholder address "123 Distreet, Somewhere in city" and dummy phone number "012345678" violate brand compliance. Please replace with actual cafe coordinates and resubmit.',
        createdAt: '2026-09-07T14:15:00Z',
        type: 'CHANGE_REQUEST',
      },
    ],
    versions: [
      {
        versionNumber: 1,
        submissionId: 'SUB-105',
        changelog: 'Initial concept poster with cheesecake graphic.',
        submittedAt: '2026-09-07T14:10:00Z',
        aiScore: 74,
        aiConfidence: 0.95,
        aiStatus: 'FAILED',
        workflowStatus: 'NEEDS_IMPROVEMENT',
        humanDecision: 'PENDING',
        files: [
          {
            id: 'file-sub105-1',
            fileName: 'dobong-cheesecake.png',
            fileSize: 3100000,
            fileType: 'image',
            mimeType: 'image/png',
            fileUrl: '/assets/aistudio/image_36da4e00.png',
            thumbnailUrl: '/assets/aistudio/image_36da4e00.png',
          },
        ],
        analysisResult: {
          id: 'eval-sub105-1',
          submissionId: 'SUB-105',
          versionNumber: 1,
          overallScore: 74,
          confidence: 0.95,
          status: 'NEEDS_IMPROVEMENT',
          executiveSummary: 'AI GATE FAILED: Score 74% (Threshold 85%). Delicious focal cheesecake presentation, but unresolved placeholder text ("123 Distreet, Somewhere in city") and dummy contact details violate brand verification.',
          analyzedAt: '2026-09-07T14:12:00Z',
          modelUsed: 'gemini-2.5-flash',
          processingTimeMs: 1410,
          recommendations: [
            {
              id: 'rec-sub105-1',
              priority: 'HIGH',
              message: 'Replace dummy text "123 Distreet" with real Dobong Cafe branch address.',
              parameterId: 'par-006',
            },
            {
              id: 'rec-sub105-2',
              priority: 'MEDIUM',
              message: 'Check phone digits to ensure authentic branch contact.',
              parameterId: 'par-006',
            },
          ],
          parameters: [
            {
              parameterId: 'par-006',
              name: 'Contact / CTA Presence',
              category: 'CTA',
              score: 52,
              status: 'FAIL',
              confidence: 0.96,
              evidence: ['Placeholder address "123 Distreet" detected in footer.'],
              severity: 'HIGH',
              weight: 50,
            },
            {
              parameterId: 'par-004',
              name: 'Headline Legibility',
              category: 'TYPOGRAPHY',
              score: 92,
              status: 'PASS',
              confidence: 0.96,
              evidence: ['"Wanna Taste!?" typography is bold and legible.'],
              severity: 'HIGH',
              weight: 50,
            },
          ],
        },
      },
    ],
  },

  // SUB-106: Dulce Tierra Heladería | Amor Helado 2x1 Gelato | 91% -> APPROVED
  {
    id: 'SUB-106',
    campaignId: 'camp-dulce-tierra',
    campaignName: 'Amor Helado - 2x1 Gelato Promo',
    brandId: 'brand-dulcetierra',
    brandName: 'Dulce Tierra Heladería',
    brandLogo: '/assets/aistudio/image_2db42f96.png',
    userId: 'usr-004',
    userName: 'Sample Employee 04',
    userEmail: 'emp04@dulcetierra.com',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    mediaType: 'image',
    currentVersion: 1,
    overallAiScore: 91,
    overallAiConfidence: 0.96,
    workflowStatus: 'APPROVED',
    humanDecision: 'APPROVED',
    humanReviewerId: 'usr-102',
    humanReviewerName: 'Elena Rostova',
    humanComment: 'Dripping waffle cone gelato photography is mouthwatering, 2x1 promotional banner is crisp and compliant.',
    createdAt: '2026-09-04T12:00:00Z',
    updatedAt: '2026-09-04T13:10:00Z',
    tags: ['dulce-tierra', 'amor-helado', 'gelato', 'approved', 'v1'],
    comments: [
      {
        id: 'c-sub106-1',
        userId: 'usr-102',
        userName: 'Elena Rostova',
        userRole: 'SUPERVISOR',
        userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        content: 'Dulce Tierra gelato promotional poster passed AI gate (91%) and verified by supervisor. Ready for campaign push.',
        createdAt: '2026-09-04T13:10:00Z',
        type: 'APPROVAL',
      },
    ],
    versions: [
      {
        versionNumber: 1,
        submissionId: 'SUB-106',
        changelog: 'Dulce Tierra Amor Helado 2x1 promotional creative.',
        submittedAt: '2026-09-04T12:00:00Z',
        aiScore: 91,
        aiConfidence: 0.96,
        aiStatus: 'PASSED',
        workflowStatus: 'APPROVED',
        humanDecision: 'APPROVED',
        files: [
          {
            id: 'file-sub106-1',
            fileName: 'dulce-tierra-amor-helado.png',
            fileSize: 3100000,
            fileType: 'image',
            mimeType: 'image/png',
            fileUrl: '/assets/aistudio/image_2db42f96.png',
            thumbnailUrl: '/assets/aistudio/image_2db42f96.png',
          },
        ],
        analysisResult: {
          id: 'eval-sub106-1',
          submissionId: 'SUB-106',
          versionNumber: 1,
          overallScore: 91,
          confidence: 0.96,
          status: 'AWAITING_SUPERVISOR_REVIEW',
          executiveSummary: 'AI GATE PASSED: Score 91% meets >=85% threshold. Vibrant artisanal presentation, accurate promo terms, high brand contrast.',
          analyzedAt: '2026-09-04T12:02:00Z',
          modelUsed: 'gemini-2.5-flash',
          processingTimeMs: 1190,
          recommendations: [],
          parameters: [
            {
              parameterId: 'par-003',
              name: 'Brand Colour Alignment',
              category: 'COLOR_PALETTE',
              score: 93,
              status: 'PASS',
              confidence: 0.96,
              evidence: ['Pastel rose (#D94E78) and sage green (#7A9A7B) adhere to brand standards.'],
              severity: 'HIGH',
              weight: 50,
            },
            {
              parameterId: 'par-006',
              name: 'Contact / CTA Presence',
              category: 'CTA',
              score: 90,
              status: 'PASS',
              confidence: 0.95,
              evidence: ['2x1 promotional CTA and validity conditions are clearly rendered.'],
              severity: 'HIGH',
              weight: 50,
            },
          ],
        },
      },
    ],
  },

  // SUB-107: Petite Framboise Patisserie | Raspberry Macaron | 76% -> NEEDS_IMPROVEMENT
  {
    id: 'SUB-107',
    campaignId: 'camp-macaron-rasp',
    campaignName: 'Petite Framboise - Raspberry Macaron',
    brandId: 'brand-sweetcrust',
    brandName: 'Petite Framboise Patisserie',
    brandLogo: '/assets/aistudio/image_3de7b998.png',
    userId: 'usr-001',
    userName: 'Chetana Mayaza',
    userEmail: 'c.mayaza@sweetcrust.com',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    mediaType: 'image',
    currentVersion: 1,
    overallAiScore: 76,
    overallAiConfidence: 0.96,
    workflowStatus: 'NEEDS_IMPROVEMENT', // < 85% gate
    humanDecision: 'PENDING',
    createdAt: '2026-09-06T10:15:00Z',
    updatedAt: '2026-09-06T10:18:00Z',
    tags: ['macaron-raspberry', 'needs-rework', 'v1', 'typo-failed'],
    comments: [
      {
        id: 'c-sub107-1',
        userId: 'system-ai',
        userName: 'ZARVIS AI Compliance Gate',
        userRole: 'ADMIN',
        userAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
        content: 'AI GATE RETURNED FOR REWORK: Overall score of 76% is below the required 85% threshold. Issues flagged: Critical body text typo "we off evry indipendent day" and contradictory 1-hour operating window ("OPEN DAILY 9 am - 10 am"). Please correct copy and resubmit.',
        createdAt: '2026-09-06T10:18:00Z',
        type: 'CHANGE_REQUEST',
      },
    ],
    versions: [
      {
        versionNumber: 1,
        submissionId: 'SUB-107',
        changelog: 'Initial version of macaron-raspberry-promo.png.',
        submittedAt: '2026-09-06T10:15:00Z',
        aiScore: 76,
        aiConfidence: 0.96,
        aiStatus: 'FAILED',
        workflowStatus: 'NEEDS_IMPROVEMENT',
        humanDecision: 'PENDING',
        reviewDurationMinutes: 3,
        files: [
          {
            id: 'file-sub107-1',
            fileName: 'macaron-raspberry-promo.png',
            fileSize: 2450000,
            fileType: 'image',
            mimeType: 'image/png',
            fileUrl: '/assets/aistudio/image_3de7b998.png',
            thumbnailUrl: '/assets/aistudio/image_3de7b998.png',
          },
        ],
        analysisResult: {
          id: 'eval-sub107-1',
          submissionId: 'SUB-107',
          versionNumber: 1,
          overallScore: 76,
          confidence: 0.96,
          status: 'NEEDS_IMPROVEMENT',
          executiveSummary: 'AI GATE FAILED: Score 76% (Threshold 85% Required). Rich macaron photography, but spelling errors ("we off evry indipendent day") and narrow 1-hour store schedule fail accuracy guidelines.',
          analyzedAt: '2026-09-06T10:16:30Z',
          modelUsed: 'gemini-2.5-flash',
          processingTimeMs: 1320,
          recommendations: [
            {
              id: 'rec-sub107-1',
              priority: 'HIGH',
              message: 'Correct typo "we off evry indipendent day" to standard grammatical text.',
              parameterId: 'par-004',
            },
            {
              id: 'rec-sub107-2',
              priority: 'HIGH',
              message: 'Update store hours from "9 am - 10 am" to standard operating hours (e.g. 9 am - 6 pm).',
              parameterId: 'par-006',
            },
          ],
          parameters: [
            {
              parameterId: 'par-004',
              name: 'Headline & Copy Legibility',
              category: 'TYPOGRAPHY',
              score: 55,
              status: 'FAIL',
              confidence: 0.97,
              evidence: ['Typo found in quote: "we off evry indipendent day".'],
              severity: 'HIGH',
              weight: 50,
            },
            {
              parameterId: 'par-003',
              name: 'Brand Colour Alignment',
              category: 'COLOR_PALETTE',
              score: 94,
              status: 'PASS',
              confidence: 0.98,
              evidence: ['Raspberry rose (#C92461) and pastel lemon (#FFF3D6) adhere to palette.'],
              severity: 'HIGH',
              weight: 50,
            },
          ],
        },
      },
    ],
  },

  // SUB-108: Porto Smoothies House | The New Ritual Matcha | 92% -> AWAITING_SUPERVISOR_REVIEW
  {
    id: 'SUB-108',
    campaignId: 'camp-porto-matcha',
    campaignName: 'The New Ritual - Matcha Revitalizer',
    brandId: 'brand-portosmoothies',
    brandName: 'Porto Smoothies House',
    brandLogo: '/assets/aistudio/image_91ac2035.png',
    userId: 'usr-001',
    userName: 'Chetana Mayaza',
    userEmail: 'c.mayaza@portosmoothies.com',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    mediaType: 'image',
    currentVersion: 1,
    overallAiScore: 92,
    overallAiConfidence: 0.97,
    workflowStatus: 'AWAITING_SUPERVISOR_REVIEW', // >= 85% gate, routed to supervisor
    humanDecision: 'PENDING',
    createdAt: '2026-09-07T16:00:00Z',
    updatedAt: '2026-09-07T16:05:00Z',
    tags: ['porto-smoothies', 'matcha-revitalizer', 'cafe', 'v1'],
    comments: [
      {
        id: 'c-sub108-1',
        userId: 'usr-101',
        userName: 'Elena Rostova',
        userRole: 'SUPERVISOR',
        userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        content: 'Clean editorial grid and crisp matcha green palette. Ready for final supervisor sign-off.',
        createdAt: '2026-09-07T16:15:00Z',
        type: 'COMMENT',
      },
    ],
    versions: [
      {
        versionNumber: 1,
        submissionId: 'SUB-108',
        changelog: 'The New Ritual - Matcha Revitalizer launch creative.',
        submittedAt: '2026-09-07T16:00:00Z',
        aiScore: 92,
        aiConfidence: 0.97,
        aiStatus: 'PASSED',
        workflowStatus: 'AWAITING_SUPERVISOR_REVIEW',
        humanDecision: 'PENDING',
        files: [
          {
            id: 'file-sub108-1',
            fileName: 'porto-smoothie-matcha.png',
            fileSize: 2850000,
            fileType: 'image',
            mimeType: 'image/png',
            fileUrl: '/assets/aistudio/image_91ac2035.png',
            thumbnailUrl: '/assets/aistudio/image_91ac2035.png',
          },
        ],
        analysisResult: {
          id: 'eval-sub108-1',
          submissionId: 'SUB-108',
          versionNumber: 1,
          overallScore: 92,
          confidence: 0.97,
          status: 'AWAITING_SUPERVISOR_REVIEW',
          executiveSummary: 'AI GATE PASSED: Score 92% meets >=85% threshold. Vibrant organic matcha product focus, brand typography hierarchy verified, safe zones compliant.',
          analyzedAt: '2026-09-07T16:01:45Z',
          modelUsed: 'gemini-2.5-flash',
          processingTimeMs: 1180,
          recommendations: [],
          parameters: [
            {
              parameterId: 'par-003',
              name: 'Brand Colour Alignment',
              category: 'COLOR_PALETTE',
              score: 95,
              status: 'PASS',
              confidence: 0.98,
              evidence: ['Botanical green (#1E3A1A) and linen cream (#FAF8F5) match approved identity.'],
              severity: 'HIGH',
              weight: 50,
            },
            {
              parameterId: 'par-004',
              name: 'Headline Legibility',
              category: 'TYPOGRAPHY',
              score: 91,
              status: 'PASS',
              confidence: 0.96,
              evidence: ['"The New Ritual" headline delivers high contrast and clean hierarchy.'],
              severity: 'HIGH',
              weight: 50,
            },
          ],
        },
      },
    ],
  },
];

// ==========================================
// 7. AUDIT LOGS (From PDF Page 7)
// ==========================================
export let AUDIT_LOGS: AuditLog[] = [
  {
    id: 'REV-201',
    userId: 'usr-101',
    userName: 'Elena Rostova',
    userRole: 'SUPERVISOR',
    action: 'APPROVAL',
    submissionId: 'SUB-101',
    versionNumber: 2,
    details: 'The Morning Mood - Ferrero Iced Coffee passed AI gate (96%) and verified by supervisor Elena Rostova.',
    timestamp: '2026-09-06T11:45:00Z',
  },
  {
    id: 'REV-202',
    userId: 'usr-101',
    userName: 'Elena Rostova',
    userRole: 'SUPERVISOR',
    action: 'APPROVAL',
    submissionId: 'SUB-102',
    versionNumber: 1,
    details: 'Noon Coffee Classic Rich Latte creative verified with dynamic splash fidelity (95%).',
    timestamp: '2026-08-14T10:15:00Z',
  },
  {
    id: 'REV-203',
    userId: 'usr-101',
    userName: 'Elena Rostova',
    userRole: 'SUPERVISOR',
    action: 'APPROVAL',
    submissionId: 'SUB-104',
    versionNumber: 1,
    details: 'Strawberry Matcha Summer Drink Signature verified with ceremonial green & strawberry blush fidelity (93%).',
    timestamp: '2026-08-25T10:35:00Z',
  },
  {
    id: 'REV-204',
    userId: 'usr-102',
    userName: 'Elena Rostova',
    userRole: 'SUPERVISOR',
    action: 'APPROVAL',
    submissionId: 'SUB-106',
    versionNumber: 1,
    details: 'Dulce Tierra Amor Helado 2x1 promotional poster verified by supervisor.',
    timestamp: '2026-09-04T13:10:00Z',
  },
];

// ==========================================
// 8. NOTIFICATIONS
// ==========================================
export let NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'usr-001',
    title: 'SUB-105 Needs Rework (74%)',
    message: 'Dobong Bakery Basque Cheesecake scored 74% (below 85% threshold). Please resolve placeholder address and dummy phone digits.',
    type: 'WARNING',
    read: false,
    submissionId: 'SUB-105',
    createdAt: '2026-09-07T14:15:00Z',
  },
  {
    id: 'notif-2',
    userId: 'usr-001',
    title: 'SUB-101 Approved by Supervisor',
    message: 'Elena Rostova approved The Morning Mood Ferrero Iced Coffee v2 (96%). Ready for publication.',
    type: 'SUCCESS',
    read: true,
    submissionId: 'SUB-101',
    createdAt: '2026-09-06T11:45:00Z',
  },
  {
    id: 'notif-3',
    userId: 'usr-101',
    title: 'SUB-108 Awaiting Review (92%)',
    message: 'Chetana Mayaza submitted Porto Smoothies The New Ritual Matcha. Score 92% passed AI gate; supervisor review pending.',
    type: 'INFO',
    read: false,
    submissionId: 'SUB-108',
    createdAt: '2026-09-07T16:05:00Z',
  },
];

export function updateSystemSettings(newSettings: Partial<SystemSettings>): SystemSettings {
  SYSTEM_SETTINGS = {
    ...SYSTEM_SETTINGS,
    ...newSettings,
  };
  saveDatabase();
  return SYSTEM_SETTINGS;
}

export function getAnalyticsData(): AnalyticsData {
  const total = SUBMISSIONS.length;
  const approved = SUBMISSIONS.filter((s) => s.workflowStatus === 'APPROVED').length;
  const rejected = SUBMISSIONS.filter((s) => s.workflowStatus === 'REJECTED').length;
  const rework = SUBMISSIONS.filter(
    (s) => s.workflowStatus === 'NEEDS_IMPROVEMENT' || s.workflowStatus === 'CHANGES_REQUESTED'
  ).length;

  const scores = SUBMISSIONS.map((s) => s.overallAiScore).filter((s) => s > 0);
  const avgAi = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 86;

  return {
    totalSubmissions: total,
    approvalRate: total > 0 ? Math.round((approved / total) * 100) : 60,
    rejectionRate: total > 0 ? Math.round((rejected / total) * 100) : 0,
    reworkRate: total > 0 ? Math.round((rework / total) * 100) : 38,
    averageAiScore: avgAi,
    averageFinalScore: 91,
    averageReviewTimeHours: 0.8,
    averageRevisionsCount: 1.4,
    brandCompliance: BRANDS.map((b) => {
      const brandSubs = SUBMISSIONS.filter((s) => s.brandId === b.id);
      const bTotal = brandSubs.length;
      const bApp = brandSubs.filter((s) => s.workflowStatus === 'APPROVED').length;
      const bAvg = brandSubs.length > 0
        ? Math.round(brandSubs.reduce((acc, curr) => acc + curr.overallAiScore, 0) / brandSubs.length)
        : 88;
      return {
        brandName: b.name,
        score: bAvg,
        total: bTotal,
        approved: bApp,
      };
    }),
    commonFailures: [
      { parameterName: 'Contact / CTA Presence', category: 'CTA', percentage: 28, count: 2 },
      { parameterName: 'Safe Area / Cropping', category: 'SAFE_AREA', percentage: 25, count: 2 },
      { parameterName: 'Claim / Number Consistency', category: 'BRAND_COMPLIANCE', percentage: 18, count: 1 },
      { parameterName: 'Color Palette Fidelity', category: 'COLOR_PALETTE', percentage: 12, count: 1 },
    ],
    timeline: [
      { date: '2026-08-14', submitted: 2, approved: 1, reworked: 0 },
      { date: '2026-09-04', submitted: 1, approved: 1, reworked: 0 },
      { date: '2026-09-05', submitted: 1, approved: 0, reworked: 1 },
      { date: '2026-09-06', submitted: 2, approved: 1, reworked: 1 },
      { date: '2026-09-07', submitted: 2, approved: 0, reworked: 1 },
    ],
  };
}

export function getReviewVelocityStats(): ReviewVelocityStats {
  const posts: PostReviewTurnaroundStat[] = SUBMISSIONS.map((s) => {
    const firstSubmittedAt = s.versions[0]?.submittedAt || s.createdAt;
    const latestVersion = s.versions[s.versions.length - 1];

    let latestReviewDurationMinutes = latestVersion?.reviewDurationMinutes || 0;
    if (!latestReviewDurationMinutes) {
      if (latestVersion?.humanDecisionAt) {
        latestReviewDurationMinutes = Math.max(
          1,
          Math.round(
            (new Date(latestVersion.humanDecisionAt).getTime() -
              new Date(latestVersion.submittedAt).getTime()) /
              60000
          )
        );
      } else if (s.workflowStatus === 'APPROVED') {
        latestReviewDurationMinutes = 45;
      } else if (s.workflowStatus === 'NEEDS_IMPROVEMENT') {
        latestReviewDurationMinutes = 3; // AI gate return in 3 mins
      } else {
        // Pending human review: duration elapsed from submission
        latestReviewDurationMinutes = Math.max(
          15,
          Math.round((Date.now() - new Date(latestVersion.submittedAt).getTime()) / 60000)
        );
      }
    }

    const finalApprovedAt =
      s.finalApprovalAt || (s.workflowStatus === 'APPROVED' ? s.updatedAt : undefined);

    let totalTurnaroundMinutes = s.totalTurnaroundMinutes || 0;
    if (!totalTurnaroundMinutes) {
      if (finalApprovedAt) {
        totalTurnaroundMinutes = Math.max(
          latestReviewDurationMinutes,
          Math.round(
            (new Date(finalApprovedAt).getTime() - new Date(firstSubmittedAt).getTime()) / 60000
          )
        );
      } else {
        totalTurnaroundMinutes = Math.max(
          latestReviewDurationMinutes,
          Math.round((Date.now() - new Date(firstSubmittedAt).getTime()) / 60000)
        );
      }
    }

    const versions = s.versions.map((v, idx) => {
      let revDuration = v.reviewDurationMinutes || 0;
      if (!revDuration) {
        if (v.humanDecisionAt) {
          revDuration = Math.max(
            1,
            Math.round(
              (new Date(v.humanDecisionAt).getTime() - new Date(v.submittedAt).getTime()) / 60000
            )
          );
        } else if (v.workflowStatus === 'APPROVED') {
          revDuration = 45;
        } else if (v.workflowStatus === 'NEEDS_IMPROVEMENT') {
          revDuration = 3;
        } else {
          revDuration = Math.max(
            15,
            Math.round((Date.now() - new Date(v.submittedAt).getTime()) / 60000)
          );
        }
      }

      let reworkDurationMinutes: number | undefined;
      if (idx > 0) {
        const prevV = s.versions[idx - 1];
        const prevDecisionTime = prevV.humanDecisionAt || prevV.submittedAt;
        reworkDurationMinutes = Math.max(
          1,
          Math.round(
            (new Date(v.submittedAt).getTime() - new Date(prevDecisionTime).getTime()) / 60000
          )
        );
      }

      const vScore = (v as any).evaluation?.overallScore || (v as any).analysisResult?.overallScore || s.overallAiScore || 85;
      const vStatus =
        v.humanDecision !== 'PENDING'
          ? v.humanDecision
          : v.workflowStatus === 'APPROVED'
          ? 'APPROVED'
          : v.workflowStatus === 'NEEDS_IMPROVEMENT'
          ? 'NEEDS_IMPROVEMENT'
          : 'PENDING';
      const reviewerName =
        v.humanReviewerName ||
        (vStatus === 'APPROVED' ? 'Marcus Vance (Admin)' : undefined);

      return {
        versionNumber: v.versionNumber,
        submittedAt: v.submittedAt,
        reviewedAt:
          v.humanDecisionAt || (v.workflowStatus === 'APPROVED' ? s.updatedAt : undefined),
        decision: vStatus === 'NEEDS_IMPROVEMENT' ? 'NEEDS_REWORK' : vStatus,
        status: vStatus,
        score: vScore,
        reviewDurationMinutes: revDuration,
        reworkDurationMinutes,
        reviewerName,
        changelog: v.changelog,
      };
    });

    const brand = BRANDS.find((b) => b.id === s.brandId);
    const campaign = CAMPAIGNS.find((c) => c.id === s.campaignId);
    const assignedSupervisor = USERS.find(
      (u) => u.id === (s.assignedSupervisorId || campaign?.assignedSupervisorId)
    );
    const peerReviewsCount = (s.comments || []).filter(
      (c) =>
        c.type === 'PEER_REVIEW' ||
        c.type === 'PEER_TIP' ||
        c.type === 'PEER_ENDORSEMENT' ||
        Boolean(c.peerTag) ||
        Boolean(c.peerVerdict)
    ).length;

    return {
      submissionId: s.id,
      campaignName: s.campaignName,
      brandName: s.brandName,
      brandLogo: brand?.logo || undefined,
      creatorName: s.userName,
      creatorAvatar: s.userAvatar,
      currentVersion: s.currentVersion,
      status: s.workflowStatus,
      currentStatus: s.workflowStatus,
      finalScore: s.overallAiScore,
      assignedSupervisorId: assignedSupervisor?.id,
      assignedSupervisorName: assignedSupervisor?.name || 'Marcus Vance',
      peerReviewsCount,
      submittedAt: latestVersion.submittedAt,
      firstSubmittedAt,
      finalApprovedAt,
      latestReviewDurationMinutes,
      timeToReviewMinutes: latestReviewDurationMinutes,
      totalTurnaroundMinutes,
      overallTurnaroundMinutes: totalTurnaroundMinutes,
      versionCount: s.versions.length,
      totalVersions: s.versions.length,
      versions,
      versionsBreakdown: versions,
    };
  });

  const approvedPosts = posts.filter((p) => p.status === 'APPROVED');
  const reviewTimes = approvedPosts.map((p) => p.latestReviewDurationMinutes);
  const totalTurnarounds = approvedPosts.map((p) => p.totalTurnaroundMinutes);

  const avgReview =
    reviewTimes.length > 0
      ? Math.round(reviewTimes.reduce((a, b) => a + b, 0) / reviewTimes.length)
      : 43;
  const avgTotal =
    totalTurnarounds.length > 0
      ? Math.round(totalTurnarounds.reduce((a, b) => a + b, 0) / totalTurnarounds.length)
      : 79;

  const fastest = reviewTimes.length > 0 ? Math.min(...reviewTimes) : 38;
  const longest = reviewTimes.length > 0 ? Math.max(...reviewTimes) : 70;

  const firstPass = approvedPosts.filter((p) => p.versionCount === 1).length;
  const reworked = approvedPosts.filter((p) => p.versionCount > 1).length;
  const avgVersions =
    posts.length > 0
      ? Number((posts.reduce((acc, p) => acc + p.versionCount, 0) / posts.length).toFixed(1))
      : 1.4;

  const supervisors = USERS.filter((u) => u.role === 'SUPERVISOR');
  const supervisorMetrics = supervisors.map((sup) => {
    const assignedCampaignIds = CAMPAIGNS.filter((c) => c.assignedSupervisorId === sup.id).map((c) => c.id);
    const subs = SUBMISSIONS.filter(
      (s) => s.assignedSupervisorId === sup.id || assignedCampaignIds.includes(s.campaignId)
    );
    const completed = subs.filter((s) => s.humanDecision && s.humanDecision !== 'PENDING');
    const pending = subs.filter((s) => !s.humanDecision || s.humanDecision === 'PENDING');
    const approvedCount = subs.filter((s) => s.humanDecision === 'APPROVED').length;
    const requestChangesCount = subs.filter((s) => s.humanDecision === 'CHANGES_REQUESTED').length;
    const rejectedCount = subs.filter((s) => s.humanDecision === 'REJECTED').length;

    const durations: number[] = [];
    subs.forEach((s) => {
      s.versions.forEach((v) => {
        if (typeof v.reviewDurationMinutes === 'number' && v.reviewDurationMinutes > 0) {
          durations.push(v.reviewDurationMinutes);
        }
      });
    });

    const avgTat = durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 14;
    const fastestM = durations.length > 0 ? Math.min(...durations) : 8;
    const slowestM = durations.length > 0 ? Math.max(...durations) : 22;
    const totalDecided = approvedCount + requestChangesCount + rejectedCount || 1;

    return {
      supervisorId: sup.id,
      supervisorName: sup.name,
      supervisorAvatar: sup.avatar,
      totalAssigned: subs.length,
      completedReviews: completed.length,
      pendingReviews: pending.length,
      averageReviewTimeMinutes: avgTat,
      fastestReviewMinutes: fastestM,
      slowestReviewMinutes: slowestM,
      approvalRate: Math.round((approvedCount / totalDecided) * 100),
      requestChangesRate: Math.round((requestChangesCount / totalDecided) * 100),
      rejectionRate: Math.round((rejectedCount / totalDecided) * 100),
    };
  });

  const employees = USERS.filter((u) => u.role === 'EMPLOYEE');
  const employeeMetrics: EmployeeVelocityMetric[] = employees.map((emp) => {
    const empSubs = SUBMISSIONS.filter(
      (s) =>
        s.userId === emp.id ||
        s.userName?.toLowerCase().includes(emp.name.toLowerCase()) ||
        emp.name.toLowerCase().includes(s.userName?.toLowerCase() || '')
    );

    const approvedSubs = empSubs.filter(
      (s) => s.workflowStatus === 'APPROVED' || s.humanDecision === 'APPROVED'
    );
    const reworkSubs = empSubs.filter(
      (s) =>
        s.workflowStatus === 'CHANGES_REQUESTED' ||
        s.workflowStatus === 'NEEDS_IMPROVEMENT'
    );

    const firstPassCount = approvedSubs.filter(
      (s) => (s.versions?.length || 1) === 1
    ).length;
    const firstPassApprovalRate =
      empSubs.length > 0
        ? Math.round((firstPassCount / empSubs.length) * 100)
        : 75;

    const totalIterations = empSubs.reduce(
      (sum, s) => sum + (s.versions?.length || 1),
      0
    );
    const avgIterations =
      empSubs.length > 0
        ? Number((totalIterations / empSubs.length).toFixed(1))
        : 1.2;

    const turnarounds: number[] = [];
    empSubs.forEach((s) => {
      if (s.totalTurnaroundMinutes && s.totalTurnaroundMinutes > 0) {
        turnarounds.push(s.totalTurnaroundMinutes);
      }
    });
    const avgTurnaround =
      turnarounds.length > 0
        ? Math.round(turnarounds.reduce((a, b) => a + b, 0) / turnarounds.length)
        : 45;

    const aiScores = empSubs.map((s) => s.overallAiScore || 85);
    const avgAiScore =
      aiScores.length > 0
        ? Math.round(aiScores.reduce((a, b) => a + b, 0) / aiScores.length)
        : 86;

    let velocityRating: 'EXCELLENT' | 'HIGH' | 'STEADY' | 'NEEDS_TRAINING' =
      'STEADY';
    if (firstPassApprovalRate >= 65 && avgAiScore >= 88) {
      velocityRating = 'EXCELLENT';
    } else if (avgAiScore >= 82 || firstPassApprovalRate >= 50) {
      velocityRating = 'HIGH';
    } else if (avgAiScore >= 75) {
      velocityRating = 'STEADY';
    } else {
      velocityRating = 'NEEDS_TRAINING';
    }

    const primaryCampaign = CAMPAIGNS.find((c) =>
      empSubs.some((s) => s.campaignId === c.id)
    );
    const supervisor = USERS.find(
      (u) => u.id === (primaryCampaign?.assignedSupervisorId || 'usr-101')
    );

    return {
      employeeId: emp.id,
      employeeName: emp.name,
      employeeAvatar: emp.avatar,
      department: emp.department || 'Creative / Media',
      totalSubmissions: empSubs.length,
      approvedCount: approvedSubs.length,
      reworkCount: reworkSubs.length,
      firstPassApprovalRate,
      averageTurnaroundMinutes: avgTurnaround,
      averageIterations: avgIterations,
      averageAiScore: avgAiScore,
      velocityRating,
      assignedSupervisorName: supervisor?.name || 'Marcus Vance',
    };
  });

  return {
    averageReviewTimeMinutes: avgReview,
    averageTotalTurnaroundMinutes: avgTotal,
    fastestReviewMinutes: fastest,
    longestReviewMinutes: longest,
    averageVersionsCount: avgVersions,
    firstPassApprovedCount: firstPass,
    reworkedApprovedCount: reworked,
    totalApproved: approvedPosts.length,
    pendingReviewCount: posts.filter(
      (p) =>
        (p.status as string) === 'AWAITING_MANAGER_REVIEW' ||
        (p.status as string) === 'AWAITING_SUPERVISOR_REVIEW' ||
        (p.status as string) === 'AWAITING_REVIEW'
    ).length,
    totalSubmissionsAnalyzed: SUBMISSIONS.length,
    posts,
    postVelocities: posts,
    supervisorMetrics,
    employeeMetrics,
  };
}


// ==========================================
// AI USAGE & TOKEN TRACKING LOGS
// ==========================================
export let AI_USAGE_LOGS: AIUsageLog[] = [
  {
    id: 'log-ai-001',
    submissionId: 'SUB-101',
    versionNumber: 1,
    model: 'gemini-2.5-flash',
    inputTokens: 1140,
    outputTokens: 420,
    cachedTokens: 0,
    processingTimeMs: 1420,
    timestamp: '2026-09-06T10:15:30Z',
    estimatedCostUsd: 0.00021,
  },
  {
    id: 'log-ai-002',
    submissionId: 'SUB-102',
    versionNumber: 1,
    model: 'gemini-2.5-flash',
    inputTokens: 1180,
    outputTokens: 390,
    cachedTokens: 0,
    processingTimeMs: 1350,
    timestamp: '2026-09-06T11:30:15Z',
    estimatedCostUsd: 0.00020,
  },
  {
    id: 'log-ai-003',
    submissionId: 'SUB-103',
    versionNumber: 1,
    model: 'gemini-2.5-flash',
    inputTokens: 1250,
    outputTokens: 460,
    cachedTokens: 0,
    processingTimeMs: 1510,
    timestamp: '2026-09-07T09:10:45Z',
    estimatedCostUsd: 0.00023,
  },
  {
    id: 'log-ai-004',
    submissionId: 'SUB-104',
    versionNumber: 1,
    model: 'gemini-2.5-flash',
    inputTokens: 1210,
    outputTokens: 430,
    cachedTokens: 0,
    processingTimeMs: 1400,
    timestamp: '2026-09-07T14:00:20Z',
    estimatedCostUsd: 0.00022,
  },
  {
    id: 'log-ai-005',
    submissionId: 'SUB-105',
    versionNumber: 1,
    model: 'gemini-2.5-flash',
    inputTokens: 1290,
    outputTokens: 450,
    cachedTokens: 0,
    processingTimeMs: 1490,
    timestamp: '2026-09-08T10:02:10Z',
    estimatedCostUsd: 0.00024,
  },
  {
    id: 'log-ai-006',
    submissionId: 'SUB-107',
    versionNumber: 1,
    model: 'gemini-2.5-flash',
    inputTokens: 1190,
    outputTokens: 410,
    cachedTokens: 0,
    processingTimeMs: 1380,
    timestamp: '2026-09-08T16:20:00Z',
    estimatedCostUsd: 0.00021,
  },
];

// ==========================================
// PERSISTENT DATABASE ENGINE (ATOMIC DISK PERSISTENCE)
// ==========================================
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'zarvis_database.json');
const DB_TMP_FILE = path.join(DATA_DIR, 'zarvis_database.tmp.json');

export interface SessionData {
  token: string;
  userId: string;
  email: string;
  role: UserRole;
  createdAt: string;
  expiresAt: string;
}

export let SESSIONS: Record<string, SessionData> = {};

export function saveDatabase(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const payload = {
      version: '1.0.0',
      savedAt: new Date().toISOString(),
      users: USERS,
      brands: BRANDS,
      parameters: PARAMETERS,
      campaigns: CAMPAIGNS,
      submissions: SUBMISSIONS,
      auditLogs: AUDIT_LOGS,
      notifications: NOTIFICATIONS,
      systemSettings: SYSTEM_SETTINGS,
      aiUsageLogs: AI_USAGE_LOGS,
      sessions: SESSIONS,
    };

    fs.writeFileSync(DB_TMP_FILE, JSON.stringify(payload, null, 2), 'utf8');
    fs.renameSync(DB_TMP_FILE, DB_FILE);
  } catch (err) {
    console.error('Failed to save database to disk:', err);
  }
}

export function loadDatabase(): void {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const data = JSON.parse(raw);

      if (Array.isArray(data.users) && data.users.length > 0) {
        USERS.length = 0;
        USERS.push(...data.users);
      }
      // Ensure all users have valid password
      USERS.forEach((u) => {
        if (!u.password) {
          u.password = 'password123';
        }
      });
      if (Array.isArray(data.brands) && data.brands.length > 0) {
        BRANDS.length = 0;
        BRANDS.push(...data.brands);
      }
      if (Array.isArray(data.parameters) && data.parameters.length > 0) {
        PARAMETERS.length = 0;
        PARAMETERS.push(...data.parameters);
      }
      if (Array.isArray(data.campaigns) && data.campaigns.length > 0) {
        CAMPAIGNS.length = 0;
        CAMPAIGNS.push(...data.campaigns);
      }
      if (Array.isArray(data.submissions) && data.submissions.length > 0) {
        SUBMISSIONS.length = 0;
        SUBMISSIONS.push(...data.submissions);
      }
      // Canonicalize workflow statuses (replace legacy AWAITING_MANAGER_REVIEW with AWAITING_SUPERVISOR_REVIEW)
      SUBMISSIONS.forEach((s) => {
        if ((s.workflowStatus as any) === 'AWAITING_MANAGER_REVIEW') {
          s.workflowStatus = 'AWAITING_SUPERVISOR_REVIEW';
        }
        if (s.versions) {
          s.versions.forEach((v) => {
            if ((v.workflowStatus as any) === 'AWAITING_MANAGER_REVIEW') {
              v.workflowStatus = 'AWAITING_SUPERVISOR_REVIEW';
            }
            if ((v.analysisResult?.status as any) === 'AWAITING_MANAGER_REVIEW') {
              v.analysisResult.status = 'AWAITING_SUPERVISOR_REVIEW';
            }
          });
        }
      });
      if (Array.isArray(data.auditLogs)) {
        AUDIT_LOGS.length = 0;
        AUDIT_LOGS.push(...data.auditLogs);
      }
      if (Array.isArray(data.notifications)) {
        NOTIFICATIONS.length = 0;
        NOTIFICATIONS.push(...data.notifications);
      }
      if (data.systemSettings) {
        Object.assign(SYSTEM_SETTINGS, data.systemSettings);
      }
      if (Array.isArray(data.aiUsageLogs)) {
        AI_USAGE_LOGS.length = 0;
        AI_USAGE_LOGS.push(...data.aiUsageLogs);
      }
      if (data.sessions && typeof data.sessions === 'object') {
        Object.assign(SESSIONS, data.sessions);
      }
      console.log(`[DB] Successfully loaded persistent database from ${DB_FILE}`);
    } else {
      console.log('[DB] No database file found on disk; seeding initial database');
      saveDatabase();
    }
  } catch (err) {
    console.error('[DB] Failed to load database from disk, using in-memory defaults:', err);
  }
}

// Session Helpers
export function createSession(user: User): string {
  const token = crypto.randomBytes(32).toString('hex');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

  SESSIONS[token] = {
    token,
    userId: user.id,
    email: user.email,
    role: user.role,
    createdAt: now.toISOString(),
    expiresAt,
  };

  saveDatabase();
  return token;
}

export function getSessionUser(token: string): User | null {
  if (!token) return null;
  const session = SESSIONS[token];
  if (!session) return null;

  if (new Date(session.expiresAt).getTime() < Date.now()) {
    delete SESSIONS[token];
    saveDatabase();
    return null;
  }

  const user = USERS.find((u) => u.id === session.userId);
  return user || null;
}

export function destroySession(token: string): void {
  if (token && SESSIONS[token]) {
    delete SESSIONS[token];
    saveDatabase();
  }
}

// Immediately initialize/hydrate database from disk on module import
loadDatabase();

