import { Submission, Brand } from '../types';

export const DEFAULT_BRANDS: Brand[] = [
  {
    "id": "brand-morningmood",
    "name": "The Morning Mood Coffee Co.",
    "logo": "/assets/aistudio/image_b41c8e2c.png",
    "description": "Specialty cold brew coffee bar, iced mochaccinos & morning fuel.",
    "isActive": true,
    "colorPalette": {
      "primary": "#3D2314",
      "secondary": "#D4A373",
      "accent": "#F4EBD9",
      "forbidden": [
        "#00FFCC",
        "#9333EA"
      ],
      "neutral": "#FAF7EE"
    },
    "typography": {
      "primaryFont": "Fraunces / Plus Jakarta Sans",
      "minHeadingSize": "26px",
      "minBodySize": "13px",
      "rules": [
        "Main headline \"The morning MOOD\" must use high-contrast warm cocoa typography.",
        "Beverage hero photography must occupy at least 40% vertical safe zone."
      ]
    },
    "toolkit": {
      "allowedFonts": [
        "Fraunces",
        "Plus Jakarta Sans",
        "Outfit",
        "Inter"
      ],
      "primaryFont": "Fraunces",
      "secondaryFont": "Plus Jakarta Sans",
      "minHeadingSize": "26px",
      "minBodySize": "13px",
      "colorTheme": {
        "primary": "#3D2314",
        "secondary": "#D4A373",
        "accent": "#F4EBD9",
        "neutral": "#FAF7EE",
        "forbiddenColors": [
          "#00FFCC",
          "#9333EA"
        ]
      },
      "logoSafeMarginPercent": 6,
      "approvedPositions": [
        "TOP_CENTER",
        "TOP_LEFT"
      ],
      "disclaimerTemplate": "The Morning Mood Coffee Roasters. Crafted fresh daily.",
      "contactRequirements": "Morning Mood cafe locator and mobile order channel",
      "socialSpecs": {
        "allowedRatios": [
          "1:1 Square (1080x1080)",
          "4:5 Portrait (1080x1350)",
          "9:16 Story (1080x1920)"
        ],
        "maxTextCoveragePercent": 20,
        "minResolution": "1080x1080"
      }
    },
    "logoRules": {
      "minSizePercent": 8,
      "safeZonePercent": 6,
      "approvedPositions": [
        "TOP_CENTER",
        "TOP_LEFT"
      ],
      "prohibitedModifications": [
        "Do not alter coffee bean silhouette or sunrise rays."
      ]
    },
    "creativeRules": {
      "productVisibilityMinPercent": 40,
      "tone": "Invigorating, warm, premium artisan cafe, creative morning ritual.",
      "backgroundStyle": "Warm oat latte canvas with floating coffee typography.",
      "ctaRequirement": "Start the day with smooth, refreshing iced coffee.",
      "disclaimerText": "The Morning Mood Coffee Roasters."
    },
    "videoRules": {
      "logoMinDurationSec": 0,
      "productAppearanceWithinSec": 0,
      "ctaRequiredAtEnd": false,
      "minResolution": "1080p"
    },
    "guidelinesMarkdown": "### The Morning Mood Coffee Co. Standards\n- **Palette**: Espresso Brown (#3D2314), Caramel Cream (#D4A373), Warm Oat (#F4EBD9).\n- **Hero Requirement**: Iced beverage presentation with creamy swirls must occupy &ge;40% of the canvas.\n- **Copy Standard**: Energetic, inspiring morning messaging with clean typography hierarchy.",
    "parametersCount": 6
  },
  {
    "id": "brand-nooncoffee",
    "name": "Noon Coffee House",
    "logo": "/assets/aistudio/image_89d665aa.png",
    "description": "Artisan Italian roast, classic rich lattes, espresso & coffee roastery.",
    "isActive": true,
    "colorPalette": {
      "primary": "#6B1717",
      "secondary": "#F9F4EB",
      "accent": "#2C1414",
      "forbidden": [
        "#00FF7F",
        "#A855F7"
      ],
      "neutral": "#FAF7EE"
    },
    "typography": {
      "primaryFont": "Modern Grotesk / Plus Jakarta Sans",
      "minHeadingSize": "24px",
      "minBodySize": "14px",
      "rules": [
        "COFFEE bubble stack lettering must preserve bold legibility.",
        "Dynamic splash motion must maintain 6% boundary margin."
      ]
    },
    "toolkit": {
      "allowedFonts": [
        "Fraunces",
        "Plus Jakarta Sans",
        "Inter"
      ],
      "primaryFont": "Fraunces",
      "secondaryFont": "Plus Jakarta Sans",
      "minHeadingSize": "24px",
      "minBodySize": "14px",
      "colorTheme": {
        "primary": "#6B1717",
        "secondary": "#F9F4EB",
        "accent": "#2C1414",
        "neutral": "#FAF7EE",
        "forbiddenColors": [
          "#00FF7F",
          "#A855F7"
        ]
      },
      "logoSafeMarginPercent": 6,
      "approvedPositions": [
        "TOP_CENTER",
        "TOP_LEFT"
      ],
      "disclaimerTemplate": "Noon Coffee House. Certified single-origin espresso.",
      "contactRequirements": "Noon Coffee signature sign-off and cafe location",
      "socialSpecs": {
        "allowedRatios": [
          "1:1 Square (1080x1080)",
          "4:5 Portrait (1080x1350)",
          "9:16 Story"
        ],
        "maxTextCoveragePercent": 20,
        "minResolution": "1080x1080"
      }
    },
    "logoRules": {
      "minSizePercent": 6,
      "safeZonePercent": 6,
      "approvedPositions": [
        "TOP_CENTER",
        "TOP_LEFT"
      ],
      "prohibitedModifications": [
        "Preserve coffee cup stamp icon and wordmark."
      ]
    },
    "creativeRules": {
      "productVisibilityMinPercent": 35,
      "tone": "Rich, classic, bold, passionate coffee craft.",
      "backgroundStyle": "Cream canvas with dynamic espresso and milk splash.",
      "ctaRequirement": "Classic rich latte recommendation.",
      "disclaimerText": "Noon Coffee House. All rights reserved."
    },
    "videoRules": {
      "logoMinDurationSec": 0,
      "productAppearanceWithinSec": 0,
      "ctaRequiredAtEnd": false,
      "minResolution": "1080p"
    },
    "guidelinesMarkdown": "### Noon Coffee House Guidelines\n- **Palette**: Roasted Crimson (#6B1717), Milk Foam Cream (#F9F4EB), Dark Roast (#2C1414).\n- **Visuals**: Dynamic liquid splash photography with ice cubes and layered crema.\n- **Typography**: Dual language support with high contrast.",
    "parametersCount": 6
  },
  {
    "id": "brand-matchatime",
    "name": "Matcha Time Tokyo",
    "logo": "/assets/aistudio/image_3cdcff8b.png",
    "description": "Authentic ceremonial Uji matcha bar, iced lattes & modern Japanese tea craft.",
    "isActive": true,
    "colorPalette": {
      "primary": "#2E5629",
      "secondary": "#88B04B",
      "accent": "#FFB7D2",
      "forbidden": [
        "#E11D48",
        "#2563EB"
      ],
      "neutral": "#FAF7EE"
    },
    "typography": {
      "primaryFont": "Fraunces / Plus Jakarta Sans",
      "minHeadingSize": "24px",
      "minBodySize": "13px",
      "rules": [
        "Matcha Time title block must be clear and crisp.",
        "Japanese katakana callouts (ice, matcha, milk) must be verified."
      ]
    },
    "toolkit": {
      "allowedFonts": [
        "Fraunces",
        "Plus Jakarta Sans",
        "Inter"
      ],
      "primaryFont": "Fraunces",
      "secondaryFont": "Plus Jakarta Sans",
      "minHeadingSize": "24px",
      "minBodySize": "13px",
      "colorTheme": {
        "primary": "#2E5629",
        "secondary": "#88B04B",
        "accent": "#FFB7D2",
        "neutral": "#FAF7EE",
        "forbiddenColors": [
          "#E11D48",
          "#2563EB"
        ]
      },
      "logoSafeMarginPercent": 6,
      "approvedPositions": [
        "TOP_RIGHT",
        "TOP_LEFT"
      ],
      "disclaimerTemplate": "Matcha Time Tokyo. 100% Ceremonial Uji Grade.",
      "contactRequirements": "Matcha Time teahouse coordinates",
      "socialSpecs": {
        "allowedRatios": [
          "1:1 Square (1080x1080)",
          "4:5 Portrait (1080x1350)",
          "9:16 Story"
        ],
        "maxTextCoveragePercent": 25,
        "minResolution": "1080x1080"
      }
    },
    "logoRules": {
      "minSizePercent": 8,
      "safeZonePercent": 6,
      "approvedPositions": [
        "TOP_RIGHT",
        "TOP_LEFT"
      ],
      "prohibitedModifications": [
        "Preserve authentic Japanese typography characters."
      ]
    },
    "creativeRules": {
      "productVisibilityMinPercent": 40,
      "tone": "Peaceful, refreshing, authentic tea ceremony meets modern cafe culture.",
      "backgroundStyle": "Pale matcha wash with organic wave contours.",
      "ctaRequirement": "Ceremonial drink serving recommendation.",
      "disclaimerText": "Matcha Time Tokyo. Shizuoka & Uji estates."
    },
    "videoRules": {
      "logoMinDurationSec": 0,
      "productAppearanceWithinSec": 0,
      "ctaRequiredAtEnd": false,
      "minResolution": "1080p"
    },
    "guidelinesMarkdown": "### Matcha Time Tokyo Standards\n- **Palette**: Ceremonial Matcha (#2E5629), Fresh Sprout Green (#88B04B), Soft Pink (#FFB7D2).\n- **Core Message**: Single-origin Camellia sinensis harvested for umami flavor and frothy iced lattes.\n- **Safe Zone**: Keep katakana badge callouts inside safe boundary margins.",
    "parametersCount": 6
  },
  {
    "id": "brand-strawberrycafe",
    "name": "Strawberry Blossom Cafe",
    "logo": "/assets/aistudio/image_4178a031.png",
    "description": "Artisanal summer drink bar, cold foam strawberry matcha & sweet cream cafes.",
    "isActive": true,
    "colorPalette": {
      "primary": "#2E5629",
      "secondary": "#FF5E97",
      "accent": "#FFF0F5",
      "forbidden": [
        "#2563EB",
        "#F59E0B"
      ],
      "neutral": "#FAF7EE"
    },
    "typography": {
      "primaryFont": "Fraunces / Plus Jakarta Sans",
      "minHeadingSize": "28px",
      "minBodySize": "13px",
      "rules": [
        "Romantic script \"stRawbeRRy\" paired with bold \"MATCHA\" display.",
        "Ingredients list must remain legible in lower right safe area."
      ]
    },
    "toolkit": {
      "allowedFonts": [
        "Fraunces",
        "Plus Jakarta Sans",
        "Inter"
      ],
      "primaryFont": "Fraunces",
      "secondaryFont": "Plus Jakarta Sans",
      "minHeadingSize": "28px",
      "minBodySize": "13px",
      "colorTheme": {
        "primary": "#2E5629",
        "secondary": "#FF5E97",
        "accent": "#FFF0F5",
        "neutral": "#FAF7EE",
        "forbiddenColors": [
          "#2563EB",
          "#F59E0B"
        ]
      },
      "logoSafeMarginPercent": 6,
      "approvedPositions": [
        "TOP_CENTER",
        "BOTTOM_RIGHT"
      ],
      "disclaimerTemplate": "Strawberry Blossom Cafe. Fresh berries and Uji matcha.",
      "contactRequirements": "Signature summer menu availability",
      "socialSpecs": {
        "allowedRatios": [
          "1:1 Square (1080x1080)",
          "4:5 Portrait (1080x1350)",
          "9:16 Story"
        ],
        "maxTextCoveragePercent": 20,
        "minResolution": "1080x1080"
      }
    },
    "logoRules": {
      "minSizePercent": 8,
      "safeZonePercent": 6,
      "approvedPositions": [
        "TOP_CENTER",
        "BOTTOM_RIGHT"
      ],
      "prohibitedModifications": [
        "Maintain dual strawberry and matcha color harmony."
      ]
    },
    "creativeRules": {
      "productVisibilityMinPercent": 45,
      "tone": "Cute, delicious, fresh, aesthetic summer cafe treat.",
      "backgroundStyle": "Warm ivory canvas with sparkling pink berry accents.",
      "ctaRequirement": "Summer drink signature invitation.",
      "disclaimerText": "Strawberry Blossom Cafe."
    },
    "videoRules": {
      "logoMinDurationSec": 0,
      "productAppearanceWithinSec": 0,
      "ctaRequiredAtEnd": false,
      "minResolution": "1080p"
    },
    "guidelinesMarkdown": "### Strawberry Blossom Cafe Standards\n- **Palette**: Matcha Green (#2E5629), Strawberry Blossom Pink (#FF5E97), Cream (#FAF7EE).\n- **Aesthetic**: Layered drink presentation with dripping pink sweet foam and fresh strawberries.\n- **Copy Standard**: Fresh strawberry, matcha powder, sweet cream ingredient verification.",
    "parametersCount": 6
  },
  {
    "id": "brand-dobong",
    "name": "Dobong Bakery & Cafe",
    "logo": "/assets/aistudio/image_36da4e00.png",
    "description": "Seoul-inspired minimalist bakery cafe, Basque burnt cheesecakes & filter coffee.",
    "isActive": true,
    "colorPalette": {
      "primary": "#4A3525",
      "secondary": "#F7F2EB",
      "accent": "#D1A679",
      "forbidden": [
        "#9333EA",
        "#00FF00"
      ],
      "neutral": "#FAF7EE"
    },
    "typography": {
      "primaryFont": "Fraunces / Plus Jakarta Sans",
      "minHeadingSize": "24px",
      "minBodySize": "13px",
      "rules": [
        "Cheesecake name and price must be clear without dummy placeholder text.",
        "Real branch address and operating contact required before sign-off."
      ]
    },
    "toolkit": {
      "allowedFonts": [
        "Fraunces",
        "Plus Jakarta Sans",
        "Inter"
      ],
      "primaryFont": "Fraunces",
      "secondaryFont": "Plus Jakarta Sans",
      "minHeadingSize": "24px",
      "minBodySize": "13px",
      "colorTheme": {
        "primary": "#4A3525",
        "secondary": "#F7F2EB",
        "accent": "#D1A679",
        "neutral": "#FAF7EE",
        "forbiddenColors": [
          "#9333EA",
          "#00FF00"
        ]
      },
      "logoSafeMarginPercent": 6,
      "approvedPositions": [
        "TOP_LEFT",
        "TOP_RIGHT"
      ],
      "disclaimerTemplate": "Dobong Bakery & Cafe. Baked fresh daily.",
      "contactRequirements": "Verified store address and order hotline",
      "socialSpecs": {
        "allowedRatios": [
          "1:1 Square (1080x1080)",
          "4:5 Portrait (1080x1350)",
          "9:16 Story"
        ],
        "maxTextCoveragePercent": 20,
        "minResolution": "1080x1080"
      }
    },
    "logoRules": {
      "minSizePercent": 7,
      "safeZonePercent": 6,
      "approvedPositions": [
        "TOP_LEFT",
        "TOP_RIGHT"
      ],
      "prohibitedModifications": [
        "No distorted Korean Hangul bakery stamp modifications."
      ]
    },
    "creativeRules": {
      "productVisibilityMinPercent": 35,
      "tone": "Cozy, modern, warm artisanal bakery atmosphere.",
      "backgroundStyle": "Minimalist warm cream with bakery product showcase.",
      "ctaRequirement": "Order for takeaway or cafe dine-in.",
      "disclaimerText": "Dobong Bakery & Cafe."
    },
    "videoRules": {
      "logoMinDurationSec": 0,
      "productAppearanceWithinSec": 0,
      "ctaRequiredAtEnd": false,
      "minResolution": "1080p"
    },
    "guidelinesMarkdown": "### Dobong Bakery & Cafe Standards\n- **Palette**: Toast Brown (#4A3525), Cloud Foam (#F7F2EB), Butter Cream (#D1A679).\n- **Compliance Rule**: Never submit with placeholder address \"123 Distreet\" or fake phone numbers.\n- **Safe Area**: Top and bottom location icons must maintain &ge;5% canvas clearance.",
    "parametersCount": 6
  },
  {
    "id": "brand-dulcetierra",
    "name": "Dulce Tierra Heladería",
    "logo": "/assets/aistudio/image_2db42f96.png",
    "description": "Artisan gelato, gourmet ice creams & sweet afternoon desserts.",
    "isActive": true,
    "colorPalette": {
      "primary": "#D94E78",
      "secondary": "#7A9A7B",
      "accent": "#FFFDF7",
      "forbidden": [
        "#1E3A8A",
        "#000000"
      ],
      "neutral": "#FAF7EE"
    },
    "typography": {
      "primaryFont": "Fraunces / Plus Jakarta Sans",
      "minHeadingSize": "26px",
      "minBodySize": "13px",
      "rules": [
        "Helado Amor del Dia headline must maintain high contrast.",
        "Promotional 2x1 offer tags must be clearly readable."
      ]
    },
    "toolkit": {
      "allowedFonts": [
        "Fraunces",
        "Plus Jakarta Sans",
        "Inter"
      ],
      "primaryFont": "Fraunces",
      "secondaryFont": "Plus Jakarta Sans",
      "minHeadingSize": "26px",
      "minBodySize": "13px",
      "colorTheme": {
        "primary": "#D94E78",
        "secondary": "#7A9A7B",
        "accent": "#FFFDF7",
        "neutral": "#FAF7EE",
        "forbiddenColors": [
          "#1E3A8A",
          "#000000"
        ]
      },
      "logoSafeMarginPercent": 6,
      "approvedPositions": [
        "TOP_CENTER",
        "BOTTOM_CENTER"
      ],
      "disclaimerTemplate": "Dulce Tierra Heladería Artesanal.",
      "contactRequirements": "Gelato shop locator and limited edition dates",
      "socialSpecs": {
        "allowedRatios": [
          "1:1 Square (1080x1080)",
          "4:5 Portrait (1080x1350)",
          "9:16 Story"
        ],
        "maxTextCoveragePercent": 20,
        "minResolution": "1080x1080"
      }
    },
    "logoRules": {
      "minSizePercent": 8,
      "safeZonePercent": 6,
      "approvedPositions": [
        "TOP_CENTER",
        "BOTTOM_CENTER"
      ],
      "prohibitedModifications": [
        "Preserve scripted Dulce Tierra vintage signature."
      ]
    },
    "creativeRules": {
      "productVisibilityMinPercent": 45,
      "tone": "Sweet, romantic, indulgent, refreshing artisan gelato.",
      "backgroundStyle": "Soft pastel ivory with sage green and rose ribbon accents.",
      "ctaRequirement": "Vive la experiencia enamorados.",
      "disclaimerText": "Dulce Tierra Heladería."
    },
    "videoRules": {
      "logoMinDurationSec": 0,
      "productAppearanceWithinSec": 0,
      "ctaRequiredAtEnd": false,
      "minResolution": "1080p"
    },
    "guidelinesMarkdown": "### Dulce Tierra Heladería Standards\n- **Palette**: Gelato Rose (#D94E78), Sage Green (#7A9A7B), Vanilla Cream (#FFFDF7).\n- **Focus**: Dripping waffle cone gelato photography with high visual appeal.\n- **Copy Standard**: Clear promotional conditions and limited-edition flavor details.",
    "parametersCount": 6
  },
  {
    "id": "brand-sweetcrust",
    "name": "Petite Framboise Patisserie",
    "logo": "/assets/aistudio/image_3de7b998.png",
    "description": "French boutique pastry cafe, artisan raspberry macarons & loose-leaf tea.",
    "isActive": true,
    "colorPalette": {
      "primary": "#C92461",
      "secondary": "#FFF3D6",
      "accent": "#FFA3C5",
      "forbidden": [
        "#2563EB",
        "#047857"
      ],
      "neutral": "#FAF7EE"
    },
    "typography": {
      "primaryFont": "Fraunces / Plus Jakarta Sans",
      "minHeadingSize": "24px",
      "minBodySize": "13px",
      "rules": [
        "Spelling and grammar in body text must be validated (no \"evry\" or \"indipendent\" typos).",
        "Store operating hours must not be contradictory or implausible."
      ]
    },
    "toolkit": {
      "allowedFonts": [
        "Fraunces",
        "Plus Jakarta Sans",
        "Inter"
      ],
      "primaryFont": "Fraunces",
      "secondaryFont": "Plus Jakarta Sans",
      "minHeadingSize": "24px",
      "minBodySize": "13px",
      "colorTheme": {
        "primary": "#C92461",
        "secondary": "#FFF3D6",
        "accent": "#FFA3C5",
        "neutral": "#FAF7EE",
        "forbiddenColors": [
          "#2563EB",
          "#047857"
        ]
      },
      "logoSafeMarginPercent": 6,
      "approvedPositions": [
        "TOP_LEFT",
        "TOP_CENTER"
      ],
      "disclaimerTemplate": "Petite Framboise Patisserie & Cafe.",
      "contactRequirements": "Daily patisserie store opening hours and address",
      "socialSpecs": {
        "allowedRatios": [
          "1:1 Square (1080x1080)",
          "4:5 Portrait (1080x1350)",
          "9:16 Story"
        ],
        "maxTextCoveragePercent": 20,
        "minResolution": "1080x1080"
      }
    },
    "logoRules": {
      "minSizePercent": 8,
      "safeZonePercent": 6,
      "approvedPositions": [
        "TOP_LEFT",
        "TOP_CENTER"
      ],
      "prohibitedModifications": [
        "Preserve raspberry stack logo arrangement."
      ]
    },
    "creativeRules": {
      "productVisibilityMinPercent": 40,
      "tone": "Playful, sweet, boutique French confectionery, cheerful.",
      "backgroundStyle": "Butter cream canvas with raspberry bubble text clouds.",
      "ctaRequirement": "Visit patisserie counter for daily fresh batch.",
      "disclaimerText": "Petite Framboise Patisserie."
    },
    "videoRules": {
      "logoMinDurationSec": 0,
      "productAppearanceWithinSec": 0,
      "ctaRequiredAtEnd": false,
      "minResolution": "1080p"
    },
    "guidelinesMarkdown": "### Petite Framboise Patisserie Standards\n- **Palette**: Fresh Raspberry (#C92461), Soft Pastry Cream (#FFF3D6), Bubblegum (#FFA3C5).\n- **Syntax Gate**: Automatic rejection if typos like \"evry indipendent day\" are detected.\n- **Hours Gate**: Opening hours must specify standard operations (e.g. 9 am - 8 pm, not 1-hour windows).",
    "parametersCount": 6
  },
  {
    "id": "brand-portosmoothies",
    "name": "Porto Smoothies House",
    "logo": "/assets/aistudio/image_91ac2035.png",
    "description": "Botanical smoothie bar, iced plant-based revitalizers & green tea cafes.",
    "isActive": true,
    "colorPalette": {
      "primary": "#1E3A1A",
      "secondary": "#5D9C59",
      "accent": "#FAF8F5",
      "forbidden": [
        "#E11D48",
        "#FF6600"
      ],
      "neutral": "#FAF7EE"
    },
    "typography": {
      "primaryFont": "Fraunces / Plus Jakarta Sans",
      "minHeadingSize": "26px",
      "minBodySize": "13px",
      "rules": [
        "Editorial \"The new ritual\" heading must follow condensed grid alignment.",
        "Smoothie house city location and service hours must be visible."
      ]
    },
    "toolkit": {
      "allowedFonts": [
        "Fraunces",
        "Plus Jakarta Sans",
        "Inter"
      ],
      "primaryFont": "Fraunces",
      "secondaryFont": "Plus Jakarta Sans",
      "minHeadingSize": "26px",
      "minBodySize": "13px",
      "colorTheme": {
        "primary": "#1E3A1A",
        "secondary": "#5D9C59",
        "accent": "#FAF8F5",
        "neutral": "#FAF7EE",
        "forbiddenColors": [
          "#E11D48",
          "#FF6600"
        ]
      },
      "logoSafeMarginPercent": 6,
      "approvedPositions": [
        "TOP_LEFT",
        "BOTTOM_LEFT"
      ],
      "disclaimerTemplate": "Porto Smoothies House. Plant-based organic vitality.",
      "contactRequirements": "Store city location (Porto, Portugal) and opening hours",
      "socialSpecs": {
        "allowedRatios": [
          "1:1 Square (1080x1080)",
          "4:5 Portrait (1080x1350)",
          "9:16 Story"
        ],
        "maxTextCoveragePercent": 20,
        "minResolution": "1080x1080"
      }
    },
    "logoRules": {
      "minSizePercent": 8,
      "safeZonePercent": 6,
      "approvedPositions": [
        "TOP_LEFT",
        "BOTTOM_LEFT"
      ],
      "prohibitedModifications": [
        "Preserve condensed botanical typography."
      ]
    },
    "creativeRules": {
      "productVisibilityMinPercent": 45,
      "tone": "Clean, vital, organic, modern European wellness cafe.",
      "backgroundStyle": "Textured ivory linen canvas with green typography rhythm.",
      "ctaRequirement": "Come get yours invitation.",
      "disclaimerText": "Porto Smoothies House."
    },
    "videoRules": {
      "logoMinDurationSec": 0,
      "productAppearanceWithinSec": 0,
      "ctaRequiredAtEnd": false,
      "minResolution": "1080p"
    },
    "guidelinesMarkdown": "### Porto Smoothies House Standards\n- **Palette**: Deep Botanical (#1E3A1A), Fresh Green (#5D9C59), Linen (#FAF8F5).\n- **Composition**: Centered iced smoothie beverage with bold typography stack.\n- **Copy Standard**: Clear serving window (9AM - 18PM) and verified location tag.",
    "parametersCount": 6
  }
];

export const DEFAULT_SUBMISSIONS: Submission[] = [
  {
    "id": "SUB-101",
    "campaignId": "camp-morning-mood",
    "campaignName": "The Morning Mood - Ferrero Iced Coffee",
    "brandId": "brand-morningmood",
    "brandName": "The Morning Mood Coffee Co.",
    "brandLogo": "/assets/aistudio/image_b41c8e2c.png",
    "userId": "usr-001",
    "userName": "Chetana Mayaza",
    "userEmail": "c.mayaza@morningmood.com",
    "userAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "mediaType": "image",
    "currentVersion": 2,
    "overallAiScore": 96,
    "overallAiConfidence": 0.98,
    "workflowStatus": "APPROVED",
    "humanDecision": "APPROVED",
    "humanReviewerId": "usr-101",
    "humanReviewerName": "Elena Rostova",
    "humanComment": "Exceptional product presentation and WCAG AA contrast. Approved for immediate social launch.",
    "createdAt": "2026-09-06T11:00:00Z",
    "updatedAt": "2026-09-06T11:45:00Z",
    "finalApprovalAt": "2026-09-06T11:45:00Z",
    "totalTurnaroundMinutes": 45,
    "tags": [
      "coffee",
      "iced-coffee",
      "ferrero-topping",
      "approved"
    ],
    "comments": [
      {
        "id": "c-sub101-1",
        "userId": "usr-101",
        "userName": "Elena Rostova",
        "userRole": "SUPERVISOR",
        "userAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        "content": "Revised iced coffee creative passes both AI gate (96%) and human review. Typography hierarchy and focal subject contrast are pristine. Approved for distribution.",
        "createdAt": "2026-09-06T11:45:00Z",
        "type": "APPROVAL"
      }
    ],
    "versions": [
      {
        "versionNumber": 2,
        "submissionId": "SUB-101",
        "changelog": "Centered Ferrero topping and high-contrast morning coffee typography.",
        "submittedAt": "2026-09-06T11:00:00Z",
        "aiScore": 96,
        "aiConfidence": 0.98,
        "aiStatus": "PASSED",
        "workflowStatus": "APPROVED",
        "humanDecision": "APPROVED",
        "files": [
          {
            "id": "file-sub101-1",
            "fileName": "morning-mood-ferrero.png",
            "fileSize": 2450000,
            "fileType": "image",
            "mimeType": "image/png",
            "fileUrl": "/assets/aistudio/image_b41c8e2c.png",
            "thumbnailUrl": "/assets/aistudio/image_b41c8e2c.png"
          }
        ],
        "analysisResult": {
          "id": "eval-sub101-1",
          "submissionId": "SUB-101",
          "versionNumber": 2,
          "overallScore": 96,
          "confidence": 0.98,
          "status": "AWAITING_SUPERVISOR_REVIEW",
          "executiveSummary": "AI GATE PASSED: Score 96% meets >=85% threshold. Rich iced coffee presentation, warm espresso palette, and clear morning typography hierarchy.",
          "analyzedAt": "2026-09-06T11:02:00Z",
          "modelUsed": "gemini-2.5-flash",
          "processingTimeMs": 1180,
          "recommendations": [],
          "parameters": [
            {
              "parameterId": "par-003",
              "name": "Brand Colour Alignment",
              "category": "COLOR_PALETTE",
              "score": 98,
              "status": "PASS",
              "confidence": 0.99,
              "evidence": [
                "Espresso Brown (#3D2314) and Caramel Cream (#D4A373) match approved palette."
              ],
              "severity": "HIGH",
              "weight": 50
            },
            {
              "parameterId": "par-004",
              "name": "Headline Legibility",
              "category": "TYPOGRAPHY",
              "score": 95,
              "status": "PASS",
              "confidence": 0.97,
              "evidence": [
                "\"The morning MOOD\" display typography is clear with 7.2:1 contrast."
              ],
              "severity": "HIGH",
              "weight": 50
            }
          ]
        }
      }
    ]
  },
  {
    "id": "SUB-102",
    "campaignId": "camp-noon-coffee",
    "campaignName": "Noon Coffee - Classic Rich Latte",
    "brandId": "brand-nooncoffee",
    "brandName": "Noon Coffee House",
    "brandLogo": "/assets/aistudio/image_89d665aa.png",
    "userId": "usr-001",
    "userName": "Chetana Mayaza",
    "userEmail": "c.mayaza@nooncoffee.com",
    "userAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "mediaType": "image",
    "currentVersion": 1,
    "overallAiScore": 95,
    "overallAiConfidence": 0.98,
    "workflowStatus": "APPROVED",
    "humanDecision": "APPROVED",
    "humanReviewerId": "usr-101",
    "humanReviewerName": "Elena Rostova",
    "humanComment": "Dynamic liquid splash photography verified; dual bilingual typography adheres to brand guide. Approved for launch.",
    "createdAt": "2026-08-14T09:30:00Z",
    "updatedAt": "2026-08-14T10:15:00Z",
    "tags": [
      "coffee-splash",
      "noon-coffee",
      "approved",
      "latte"
    ],
    "comments": [
      {
        "id": "c-sub102-1",
        "userId": "usr-101",
        "userName": "Elena Rostova",
        "userRole": "SUPERVISOR",
        "userAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        "content": "Noon Coffee iced latte creative passes all brand toolkit metrics with 95% AI confidence. Splash motion and typography hierarchy verified.",
        "createdAt": "2026-08-14T10:15:00Z",
        "type": "APPROVAL"
      }
    ],
    "versions": [
      {
        "versionNumber": 1,
        "submissionId": "SUB-102",
        "changelog": "Official Noon Coffee rich latte splash creative.",
        "submittedAt": "2026-08-14T09:30:00Z",
        "aiScore": 95,
        "aiConfidence": 0.98,
        "aiStatus": "PASSED",
        "workflowStatus": "APPROVED",
        "humanDecision": "APPROVED",
        "files": [
          {
            "id": "file-sub102-1",
            "fileName": "noon-coffee-latte.png",
            "fileSize": 2800000,
            "fileType": "image",
            "mimeType": "image/png",
            "fileUrl": "/assets/aistudio/image_89d665aa.png",
            "thumbnailUrl": "/assets/aistudio/image_89d665aa.png"
          }
        ],
        "analysisResult": {
          "id": "eval-sub102-1",
          "submissionId": "SUB-102",
          "versionNumber": 1,
          "overallScore": 95,
          "confidence": 0.98,
          "status": "AWAITING_SUPERVISOR_REVIEW",
          "executiveSummary": "AI GATE PASSED: Score 95% meets >=85% threshold. Splash motion dynamics captured cleanly with high clarity and contrast.",
          "analyzedAt": "2026-08-14T09:31:45Z",
          "modelUsed": "gemini-2.5-flash",
          "processingTimeMs": 1240,
          "recommendations": [],
          "parameters": [
            {
              "parameterId": "par-003",
              "name": "Brand Colour Alignment",
              "category": "COLOR_PALETTE",
              "score": 96,
              "status": "PASS",
              "confidence": 0.98,
              "evidence": [
                "Deep Espresso (#6B1717) and Cream Latte (#F9F4EB) are verified."
              ],
              "severity": "HIGH",
              "weight": 50
            },
            {
              "parameterId": "par-004",
              "name": "Headline Legibility",
              "category": "TYPOGRAPHY",
              "score": 94,
              "status": "PASS",
              "confidence": 0.98,
              "evidence": [
                "COFFEE bubble lettering maintains high visibility against splash."
              ],
              "severity": "HIGH",
              "weight": 50
            }
          ]
        }
      }
    ]
  },
  {
    "id": "SUB-103",
    "campaignId": "camp-matchatime",
    "campaignName": "Matcha Time - Tokyo Iced Latte",
    "brandId": "brand-matchatime",
    "brandName": "Matcha Time Tokyo",
    "brandLogo": "/assets/aistudio/image_3cdcff8b.png",
    "userId": "usr-001",
    "userName": "Chetana Mayaza",
    "userEmail": "c.mayaza@matchatime.jp",
    "userAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "mediaType": "image",
    "currentVersion": 1,
    "overallAiScore": 94,
    "overallAiConfidence": 0.97,
    "workflowStatus": "APPROVED",
    "humanDecision": "APPROVED",
    "humanReviewerId": "usr-101",
    "humanReviewerName": "Elena Rostova",
    "humanComment": "Authentic Uji ceremonial matcha aesthetic, bilingual Japanese callouts, balanced margins. Approved.",
    "createdAt": "2026-08-20T08:00:00Z",
    "updatedAt": "2026-08-20T08:40:00Z",
    "tags": [
      "matcha-time",
      "tokyo-latte",
      "cafe",
      "approved"
    ],
    "comments": [
      {
        "id": "c-sub103-1",
        "userId": "usr-101",
        "userName": "Elena Rostova",
        "userRole": "SUPERVISOR",
        "userAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        "content": "Vibrant matcha layer separation and frothy sweet cream look appetizing. Text callouts well positioned.",
        "createdAt": "2026-08-20T08:40:00Z",
        "type": "APPROVAL"
      }
    ],
    "versions": [
      {
        "versionNumber": 1,
        "submissionId": "SUB-103",
        "changelog": "Matcha Time Tokyo Iced Latte signature poster.",
        "submittedAt": "2026-08-20T08:00:00Z",
        "aiScore": 94,
        "aiConfidence": 0.97,
        "aiStatus": "PASSED",
        "workflowStatus": "APPROVED",
        "humanDecision": "APPROVED",
        "files": [
          {
            "id": "file-sub103-1",
            "fileName": "matcha-time-tokyo-latte.png",
            "fileSize": 2600000,
            "fileType": "image",
            "mimeType": "image/png",
            "fileUrl": "/assets/aistudio/image_3cdcff8b.png",
            "thumbnailUrl": "/assets/aistudio/image_3cdcff8b.png"
          }
        ],
        "analysisResult": {
          "id": "eval-sub103-1",
          "submissionId": "SUB-103",
          "versionNumber": 1,
          "overallScore": 94,
          "confidence": 0.97,
          "status": "AWAITING_SUPERVISOR_REVIEW",
          "executiveSummary": "AI GATE PASSED: Score 94% meets >=85% threshold. Uji matcha drink clarity verified, Japanese callout badges compliant with safe margins.",
          "analyzedAt": "2026-08-20T08:02:00Z",
          "modelUsed": "gemini-2.5-flash",
          "processingTimeMs": 1210,
          "recommendations": [],
          "parameters": [
            {
              "parameterId": "par-003",
              "name": "Brand Colour Alignment",
              "category": "COLOR_PALETTE",
              "score": 96,
              "status": "PASS",
              "confidence": 0.98,
              "evidence": [
                "Uji Matcha Green (#2D5A27) and Soft Blossom (#FFCAD4) pass compliance."
              ],
              "severity": "HIGH",
              "weight": 50
            },
            {
              "parameterId": "par-004",
              "name": "Headline Legibility",
              "category": "TYPOGRAPHY",
              "score": 92,
              "status": "PASS",
              "confidence": 0.96,
              "evidence": [
                "MATCHA TIME headline is distinct and readable."
              ],
              "severity": "HIGH",
              "weight": 50
            }
          ]
        }
      }
    ]
  },
  {
    "id": "SUB-104",
    "campaignId": "camp-strawberry-matcha",
    "campaignName": "Strawberry Matcha Signature Cafe",
    "brandId": "brand-strawberrycafe",
    "brandName": "Strawberry Blossom Cafe",
    "brandLogo": "/assets/aistudio/image_4178a031.png",
    "userId": "usr-001",
    "userName": "Chetana Mayaza",
    "userEmail": "c.mayaza@strawberryblossom.com",
    "userAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "mediaType": "image",
    "currentVersion": 1,
    "overallAiScore": 93,
    "overallAiConfidence": 0.97,
    "workflowStatus": "APPROVED",
    "humanDecision": "APPROVED",
    "humanReviewerId": "usr-101",
    "humanReviewerName": "Elena Rostova",
    "humanComment": "Stunning layered strawberry matcha drink poster. Palette harmony of blush pink, forest matcha, and warm cream is sublime.",
    "createdAt": "2026-08-25T10:00:00Z",
    "updatedAt": "2026-08-25T10:35:00Z",
    "tags": [
      "strawberry-matcha",
      "summer-drink",
      "signature-cafe",
      "approved"
    ],
    "comments": [
      {
        "id": "c-sub104-1",
        "userId": "usr-101",
        "userName": "Elena Rostova",
        "userRole": "SUPERVISOR",
        "userAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        "content": "This 4th card signature poster sets the benchmark for the cafe aesthetic. Certified 93% AI pre-flight and approved.",
        "createdAt": "2026-08-25T10:35:00Z",
        "type": "APPROVAL"
      }
    ],
    "versions": [
      {
        "versionNumber": 1,
        "submissionId": "SUB-104",
        "changelog": "Strawberry Matcha Summer Drink Signature cafe poster.",
        "submittedAt": "2026-08-25T10:00:00Z",
        "aiScore": 93,
        "aiConfidence": 0.97,
        "aiStatus": "PASSED",
        "workflowStatus": "APPROVED",
        "humanDecision": "APPROVED",
        "files": [
          {
            "id": "file-sub104-1",
            "fileName": "strawberry-matcha-signature.png",
            "fileSize": 2950000,
            "fileType": "image",
            "mimeType": "image/png",
            "fileUrl": "/assets/aistudio/image_4178a031.png",
            "thumbnailUrl": "/assets/aistudio/image_4178a031.png"
          }
        ],
        "analysisResult": {
          "id": "eval-sub104-1",
          "submissionId": "SUB-104",
          "versionNumber": 1,
          "overallScore": 93,
          "confidence": 0.97,
          "status": "AWAITING_SUPERVISOR_REVIEW",
          "executiveSummary": "AI GATE PASSED: Score 93% meets >=85% threshold. Beautiful strawberry cold foam and deep matcha tones. Script and display typography verified.",
          "analyzedAt": "2026-08-25T10:02:00Z",
          "modelUsed": "gemini-2.5-flash",
          "processingTimeMs": 1190,
          "recommendations": [],
          "parameters": [
            {
              "parameterId": "par-003",
              "name": "Brand Colour Alignment",
              "category": "COLOR_PALETTE",
              "score": 95,
              "status": "PASS",
              "confidence": 0.98,
              "evidence": [
                "Strawberry Pink (#FF5E97), Ceremonial Matcha (#2E5629), and Cream (#FAF7EE) pass."
              ],
              "severity": "HIGH",
              "weight": 50
            },
            {
              "parameterId": "par-004",
              "name": "Headline Legibility",
              "category": "TYPOGRAPHY",
              "score": 91,
              "status": "PASS",
              "confidence": 0.96,
              "evidence": [
                "\"Strawberry MATCHA\" headline matches authorized script and serif fonts."
              ],
              "severity": "HIGH",
              "weight": 50
            }
          ]
        }
      }
    ]
  },
  {
    "id": "SUB-105",
    "campaignId": "camp-dobong-cheesecake",
    "campaignName": "Wanna Taste!? Blue Cheesecake",
    "brandId": "brand-dobong",
    "brandName": "Dobong Bakery & Cafe",
    "brandLogo": "/assets/aistudio/image_36da4e00.png",
    "userId": "usr-001",
    "userName": "Chetana Mayaza",
    "userEmail": "c.mayaza@dobongbakery.com",
    "userAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "mediaType": "image",
    "currentVersion": 1,
    "overallAiScore": 74,
    "overallAiConfidence": 0.95,
    "workflowStatus": "NEEDS_IMPROVEMENT",
    "humanDecision": "PENDING",
    "createdAt": "2026-09-07T14:10:00Z",
    "updatedAt": "2026-09-07T14:15:00Z",
    "tags": [
      "dobong-bakery",
      "cheesecake",
      "needs-rework",
      "placeholder-failed"
    ],
    "comments": [
      {
        "id": "c-sub105-1",
        "userId": "system-ai",
        "userName": "ZARVIS AI Compliance Gate",
        "userRole": "ADMIN",
        "userAvatar": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
        "content": "AI GATE RETURNED FOR REWORK: Overall score of 74% is below the required 85% threshold. Issues flagged: Placeholder address \"123 Distreet, Somewhere in city\" and dummy phone number \"012345678\" violate brand compliance. Please replace with actual cafe coordinates and resubmit.",
        "createdAt": "2026-09-07T14:15:00Z",
        "type": "CHANGE_REQUEST"
      }
    ],
    "versions": [
      {
        "versionNumber": 1,
        "submissionId": "SUB-105",
        "changelog": "Initial concept poster with cheesecake graphic.",
        "submittedAt": "2026-09-07T14:10:00Z",
        "aiScore": 74,
        "aiConfidence": 0.95,
        "aiStatus": "FAILED",
        "workflowStatus": "NEEDS_IMPROVEMENT",
        "humanDecision": "PENDING",
        "files": [
          {
            "id": "file-sub105-1",
            "fileName": "dobong-cheesecake.png",
            "fileSize": 3100000,
            "fileType": "image",
            "mimeType": "image/png",
            "fileUrl": "/assets/aistudio/image_36da4e00.png",
            "thumbnailUrl": "/assets/aistudio/image_36da4e00.png"
          }
        ],
        "analysisResult": {
          "id": "eval-sub105-1",
          "submissionId": "SUB-105",
          "versionNumber": 1,
          "overallScore": 74,
          "confidence": 0.95,
          "status": "NEEDS_IMPROVEMENT",
          "executiveSummary": "AI GATE FAILED: Score 74% (Threshold 85%). Delicious focal cheesecake presentation, but unresolved placeholder text (\"123 Distreet, Somewhere in city\") and dummy contact details violate brand verification.",
          "analyzedAt": "2026-09-07T14:12:00Z",
          "modelUsed": "gemini-2.5-flash",
          "processingTimeMs": 1410,
          "recommendations": [
            {
              "id": "rec-sub105-1",
              "priority": "HIGH",
              "message": "Replace dummy text \"123 Distreet\" with real Dobong Cafe branch address.",
              "parameterId": "par-006"
            },
            {
              "id": "rec-sub105-2",
              "priority": "MEDIUM",
              "message": "Check phone digits to ensure authentic branch contact.",
              "parameterId": "par-006"
            }
          ],
          "parameters": [
            {
              "parameterId": "par-006",
              "name": "Contact / CTA Presence",
              "category": "CTA",
              "score": 52,
              "status": "FAIL",
              "confidence": 0.96,
              "evidence": [
                "Placeholder address \"123 Distreet\" detected in footer."
              ],
              "severity": "HIGH",
              "weight": 50
            },
            {
              "parameterId": "par-004",
              "name": "Headline Legibility",
              "category": "TYPOGRAPHY",
              "score": 92,
              "status": "PASS",
              "confidence": 0.96,
              "evidence": [
                "\"Wanna Taste!?\" typography is bold and legible."
              ],
              "severity": "HIGH",
              "weight": 50
            }
          ]
        }
      }
    ]
  },
  {
    "id": "SUB-106",
    "campaignId": "camp-dulce-tierra",
    "campaignName": "Amor Helado - 2x1 Gelato Promo",
    "brandId": "brand-dulcetierra",
    "brandName": "Dulce Tierra Heladería",
    "brandLogo": "/assets/aistudio/image_2db42f96.png",
    "userId": "usr-004",
    "userName": "Sample Employee 04",
    "userEmail": "emp04@dulcetierra.com",
    "userAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "mediaType": "image",
    "currentVersion": 1,
    "overallAiScore": 91,
    "overallAiConfidence": 0.96,
    "workflowStatus": "APPROVED",
    "humanDecision": "APPROVED",
    "humanReviewerId": "usr-102",
    "humanReviewerName": "Elena Rostova",
    "humanComment": "Dripping waffle cone gelato photography is mouthwatering, 2x1 promotional banner is crisp and compliant.",
    "createdAt": "2026-09-04T12:00:00Z",
    "updatedAt": "2026-09-04T13:10:00Z",
    "tags": [
      "dulce-tierra",
      "amor-helado",
      "gelato",
      "approved",
      "v1"
    ],
    "comments": [
      {
        "id": "c-sub106-1",
        "userId": "usr-102",
        "userName": "Elena Rostova",
        "userRole": "SUPERVISOR",
        "userAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        "content": "Dulce Tierra gelato promotional poster passed AI gate (91%) and verified by supervisor. Ready for campaign push.",
        "createdAt": "2026-09-04T13:10:00Z",
        "type": "APPROVAL"
      }
    ],
    "versions": [
      {
        "versionNumber": 1,
        "submissionId": "SUB-106",
        "changelog": "Dulce Tierra Amor Helado 2x1 promotional creative.",
        "submittedAt": "2026-09-04T12:00:00Z",
        "aiScore": 91,
        "aiConfidence": 0.96,
        "aiStatus": "PASSED",
        "workflowStatus": "APPROVED",
        "humanDecision": "APPROVED",
        "files": [
          {
            "id": "file-sub106-1",
            "fileName": "dulce-tierra-amor-helado.png",
            "fileSize": 3100000,
            "fileType": "image",
            "mimeType": "image/png",
            "fileUrl": "/assets/aistudio/image_2db42f96.png",
            "thumbnailUrl": "/assets/aistudio/image_2db42f96.png"
          }
        ],
        "analysisResult": {
          "id": "eval-sub106-1",
          "submissionId": "SUB-106",
          "versionNumber": 1,
          "overallScore": 91,
          "confidence": 0.96,
          "status": "AWAITING_SUPERVISOR_REVIEW",
          "executiveSummary": "AI GATE PASSED: Score 91% meets >=85% threshold. Vibrant artisanal presentation, accurate promo terms, high brand contrast.",
          "analyzedAt": "2026-09-04T12:02:00Z",
          "modelUsed": "gemini-2.5-flash",
          "processingTimeMs": 1190,
          "recommendations": [],
          "parameters": [
            {
              "parameterId": "par-003",
              "name": "Brand Colour Alignment",
              "category": "COLOR_PALETTE",
              "score": 93,
              "status": "PASS",
              "confidence": 0.96,
              "evidence": [
                "Pastel rose (#D94E78) and sage green (#7A9A7B) adhere to brand standards."
              ],
              "severity": "HIGH",
              "weight": 50
            },
            {
              "parameterId": "par-006",
              "name": "Contact / CTA Presence",
              "category": "CTA",
              "score": 90,
              "status": "PASS",
              "confidence": 0.95,
              "evidence": [
                "2x1 promotional CTA and validity conditions are clearly rendered."
              ],
              "severity": "HIGH",
              "weight": 50
            }
          ]
        }
      }
    ]
  },
  {
    "id": "SUB-107",
    "campaignId": "camp-macaron-rasp",
    "campaignName": "Petite Framboise - Raspberry Macaron",
    "brandId": "brand-sweetcrust",
    "brandName": "Petite Framboise Patisserie",
    "brandLogo": "/assets/aistudio/image_3de7b998.png",
    "userId": "usr-001",
    "userName": "Chetana Mayaza",
    "userEmail": "c.mayaza@sweetcrust.com",
    "userAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "mediaType": "image",
    "currentVersion": 1,
    "overallAiScore": 76,
    "overallAiConfidence": 0.96,
    "workflowStatus": "NEEDS_IMPROVEMENT",
    "humanDecision": "PENDING",
    "createdAt": "2026-09-06T10:15:00Z",
    "updatedAt": "2026-09-06T10:18:00Z",
    "tags": [
      "macaron-raspberry",
      "needs-rework",
      "v1",
      "typo-failed"
    ],
    "comments": [
      {
        "id": "c-sub107-1",
        "userId": "system-ai",
        "userName": "ZARVIS AI Compliance Gate",
        "userRole": "ADMIN",
        "userAvatar": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
        "content": "AI GATE RETURNED FOR REWORK: Overall score of 76% is below the required 85% threshold. Issues flagged: Critical body text typo \"we off evry indipendent day\" and contradictory 1-hour operating window (\"OPEN DAILY 9 am - 10 am\"). Please correct copy and resubmit.",
        "createdAt": "2026-09-06T10:18:00Z",
        "type": "CHANGE_REQUEST"
      }
    ],
    "versions": [
      {
        "versionNumber": 1,
        "submissionId": "SUB-107",
        "changelog": "Initial version of macaron-raspberry-promo.png.",
        "submittedAt": "2026-09-06T10:15:00Z",
        "aiScore": 76,
        "aiConfidence": 0.96,
        "aiStatus": "FAILED",
        "workflowStatus": "NEEDS_IMPROVEMENT",
        "humanDecision": "PENDING",
        "reviewDurationMinutes": 3,
        "files": [
          {
            "id": "file-sub107-1",
            "fileName": "macaron-raspberry-promo.png",
            "fileSize": 2450000,
            "fileType": "image",
            "mimeType": "image/png",
            "fileUrl": "/assets/aistudio/image_3de7b998.png",
            "thumbnailUrl": "/assets/aistudio/image_3de7b998.png"
          }
        ],
        "analysisResult": {
          "id": "eval-sub107-1",
          "submissionId": "SUB-107",
          "versionNumber": 1,
          "overallScore": 76,
          "confidence": 0.96,
          "status": "NEEDS_IMPROVEMENT",
          "executiveSummary": "AI GATE FAILED: Score 76% (Threshold 85% Required). Rich macaron photography, but spelling errors (\"we off evry indipendent day\") and narrow 1-hour store schedule fail accuracy guidelines.",
          "analyzedAt": "2026-09-06T10:16:30Z",
          "modelUsed": "gemini-2.5-flash",
          "processingTimeMs": 1320,
          "recommendations": [
            {
              "id": "rec-sub107-1",
              "priority": "HIGH",
              "message": "Correct typo \"we off evry indipendent day\" to standard grammatical text.",
              "parameterId": "par-004"
            },
            {
              "id": "rec-sub107-2",
              "priority": "HIGH",
              "message": "Update store hours from \"9 am - 10 am\" to standard operating hours (e.g. 9 am - 6 pm).",
              "parameterId": "par-006"
            }
          ],
          "parameters": [
            {
              "parameterId": "par-004",
              "name": "Headline & Copy Legibility",
              "category": "TYPOGRAPHY",
              "score": 55,
              "status": "FAIL",
              "confidence": 0.97,
              "evidence": [
                "Typo found in quote: \"we off evry indipendent day\"."
              ],
              "severity": "HIGH",
              "weight": 50
            },
            {
              "parameterId": "par-003",
              "name": "Brand Colour Alignment",
              "category": "COLOR_PALETTE",
              "score": 94,
              "status": "PASS",
              "confidence": 0.98,
              "evidence": [
                "Raspberry rose (#C92461) and pastel lemon (#FFF3D6) adhere to palette."
              ],
              "severity": "HIGH",
              "weight": 50
            }
          ]
        }
      }
    ]
  },
  {
    "id": "SUB-108",
    "campaignId": "camp-porto-matcha",
    "campaignName": "The New Ritual - Matcha Revitalizer",
    "brandId": "brand-portosmoothies",
    "brandName": "Porto Smoothies House",
    "brandLogo": "/assets/aistudio/image_91ac2035.png",
    "userId": "usr-001",
    "userName": "Chetana Mayaza",
    "userEmail": "c.mayaza@portosmoothies.com",
    "userAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "mediaType": "image",
    "currentVersion": 1,
    "overallAiScore": 92,
    "overallAiConfidence": 0.97,
    "workflowStatus": "AWAITING_SUPERVISOR_REVIEW",
    "humanDecision": "PENDING",
    "createdAt": "2026-09-07T16:00:00Z",
    "updatedAt": "2026-09-07T16:05:00Z",
    "tags": [
      "porto-smoothies",
      "matcha-revitalizer",
      "cafe",
      "v1"
    ],
    "comments": [
      {
        "id": "c-sub108-1",
        "userId": "usr-101",
        "userName": "Elena Rostova",
        "userRole": "SUPERVISOR",
        "userAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        "content": "Clean editorial grid and crisp matcha green palette. Ready for final supervisor sign-off.",
        "createdAt": "2026-09-07T16:15:00Z",
        "type": "COMMENT"
      }
    ],
    "versions": [
      {
        "versionNumber": 1,
        "submissionId": "SUB-108",
        "changelog": "The New Ritual - Matcha Revitalizer launch creative.",
        "submittedAt": "2026-09-07T16:00:00Z",
        "aiScore": 92,
        "aiConfidence": 0.97,
        "aiStatus": "PASSED",
        "workflowStatus": "AWAITING_SUPERVISOR_REVIEW",
        "humanDecision": "PENDING",
        "files": [
          {
            "id": "file-sub108-1",
            "fileName": "porto-smoothie-matcha.png",
            "fileSize": 2850000,
            "fileType": "image",
            "mimeType": "image/png",
            "fileUrl": "/assets/aistudio/image_91ac2035.png",
            "thumbnailUrl": "/assets/aistudio/image_91ac2035.png"
          }
        ],
        "analysisResult": {
          "id": "eval-sub108-1",
          "submissionId": "SUB-108",
          "versionNumber": 1,
          "overallScore": 92,
          "confidence": 0.97,
          "status": "AWAITING_SUPERVISOR_REVIEW",
          "executiveSummary": "AI GATE PASSED: Score 92% meets >=85% threshold. Vibrant organic matcha product focus, brand typography hierarchy verified, safe zones compliant.",
          "analyzedAt": "2026-09-07T16:01:45Z",
          "modelUsed": "gemini-2.5-flash",
          "processingTimeMs": 1180,
          "recommendations": [],
          "parameters": [
            {
              "parameterId": "par-003",
              "name": "Brand Colour Alignment",
              "category": "COLOR_PALETTE",
              "score": 95,
              "status": "PASS",
              "confidence": 0.98,
              "evidence": [
                "Botanical green (#1E3A1A) and linen cream (#FAF8F5) match approved identity."
              ],
              "severity": "HIGH",
              "weight": 50
            },
            {
              "parameterId": "par-004",
              "name": "Headline Legibility",
              "category": "TYPOGRAPHY",
              "score": 91,
              "status": "PASS",
              "confidence": 0.96,
              "evidence": [
                "\"The New Ritual\" headline delivers high contrast and clean hierarchy."
              ],
              "severity": "HIGH",
              "weight": 50
            }
          ]
        }
      }
    ]
  }
];
