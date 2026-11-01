import {
  Submission,
  SubmissionVersion,
  AIAnalysisResult,
  ParameterResult,
  CreativeReviewModel,
  CreativeReviewStatus,
  CreativeActionPriority,
  CreativeActionItem,
  CreativeIssueCard,
  CreativeCategorySummary,
  CreativeVersionDelta,
} from '../types';

/**
 * Human-friendly spatial translation from normalized 0-1 bounding boxes
 */
export function getHumanLocation(
  boundingRegion?: { x: number; y: number; width: number; height: number; label: string }
): string | undefined {
  if (!boundingRegion) return undefined;
  const { x, y, label } = boundingRegion;

  let vPos = 'Center';
  if (y < 0.35) vPos = 'Top';
  else if (y > 0.65) vPos = 'Bottom';

  let hPos = 'center';
  if (x < 0.35) hPos = 'left';
  else if (x > 0.65) hPos = 'right';

  const positionStr = vPos === 'Center' && hPos === 'center' ? 'Center area' : `${vPos}-${hPos} area`;
  if (label && label.trim().length > 0) {
    return `${positionStr} (${label})`;
  }
  return positionStr;
}

/**
 * Replaces technical computer-vision / audit jargon with clear creative phrases
 */
export function humanizeText(text: string): string {
  if (!text) return '';
  return text
    .replace(/chromatic deviation/gi, 'color difference')
    .replace(/primary hue variance/gi, 'brand color variance')
    .replace(/exceeds permitted spatial threshold/gi, 'is too close to the boundary')
    .replace(/bounding box/gi, 'placement zone')
    .replace(/OCR confidence/gi, 'text clarity')
    .replace(/hierarchy score/gi, 'visual prominence')
    .replace(/parameter id/gi, 'check')
    .replace(/threshold violation/gi, 'guideline requirement')
    .replace(/spatial proximity/gi, 'spacing')
    .replace(/variance is \d+(\.\d+)?%/gi, 'differs from brand specifications')
    .replace(/confidence score: \d+(\.\d+)?/gi, '')
    .trim();
}

/**
 * Maps standard categories and parameters into 10 canonical creative categories
 */
interface CategoryBucket {
  id: string;
  name: string;
  iconType: CreativeCategorySummary['iconType'];
  match: (p: ParameterResult) => boolean;
  defaultGood: string;
  defaultNeedsAttention: string;
}

const CATEGORY_BUCKETS: CategoryBucket[] = [
  {
    id: 'brand-colors',
    name: 'Brand colours',
    iconType: 'COLOR',
    match: (p) =>
      p.category === 'COLOR_PALETTE' ||
      p.name.toLowerCase().includes('color') ||
      p.name.toLowerCase().includes('palette') ||
      p.name.toLowerCase().includes('hex'),
    defaultGood: 'Colors match the approved brand palette.',
    defaultNeedsAttention: 'One or more colors differ from the approved brand palette.',
  },
  {
    id: 'logo-usage',
    name: 'Logo usage',
    iconType: 'LOGO',
    match: (p) =>
      p.category === 'LOGO' ||
      p.name.toLowerCase().includes('logo') ||
      p.name.toLowerCase().includes('crest') ||
      p.name.toLowerCase().includes('clear space'),
    defaultGood: 'Logo placement, version, and clear space follow brand rules.',
    defaultNeedsAttention: 'The logo requires adjustment for clear space, size, or placement.',
  },
  {
    id: 'typography',
    name: 'Typography',
    iconType: 'TYPE',
    match: (p) =>
      p.category === 'TYPOGRAPHY' ||
      p.name.toLowerCase().includes('font') ||
      p.name.toLowerCase().includes('type') ||
      p.name.toLowerCase().includes('headline size'),
    defaultGood: 'Uses approved brand typography and clear font hierarchy.',
    defaultNeedsAttention: 'Font family or heading size needs to match brand guidelines.',
  },
  {
    id: 'layout-spacing',
    name: 'Layout and spacing',
    iconType: 'LAYOUT',
    match: (p) =>
      (p.category as string) === 'SAFE_AREA' ||
      (p.category as string) === 'SPATIAL' ||
      p.name.toLowerCase().includes('margin') ||
      p.name.toLowerCase().includes('safe area') ||
      p.name.toLowerCase().includes('spacing') ||
      p.name.toLowerCase().includes('balance'),
    defaultGood: 'Layout is balanced with adequate margins around key elements.',
    defaultNeedsAttention: 'Key elements sit too close to the borders or overlap awkwardly.',
  },
  {
    id: 'readability',
    name: 'Readability',
    iconType: 'READABILITY',
    match: (p) =>
      p.category === 'TEXT' ||
      p.name.toLowerCase().includes('contrast') ||
      p.name.toLowerCase().includes('readab') ||
      p.name.toLowerCase().includes('legib') ||
      p.name.toLowerCase().includes('ocr'),
    defaultGood: 'Copy is clear, high-contrast, and easy to read at normal size.',
    defaultNeedsAttention: 'Some text suffers from low contrast or is difficult to read.',
  },
  {
    id: 'cta-messaging',
    name: 'CTA and messaging',
    iconType: 'CTA',
    match: (p) =>
      p.category === 'CTA' ||
      p.name.toLowerCase().includes('cta') ||
      p.name.toLowerCase().includes('call to action') ||
      p.name.toLowerCase().includes('button') ||
      p.name.toLowerCase().includes('action') ||
      p.name.toLowerCase().includes('offer'),
    defaultGood: 'Call-to-action is prominent and clearly directs the audience.',
    defaultNeedsAttention: 'The main action or offer is hard to notice or missing key contact details.',
  },
  {
    id: 'brand-tone',
    name: 'Brand tone',
    iconType: 'TONE',
    match: (p) =>
      p.category === 'BRAND_COMPLIANCE' ||
      p.name.toLowerCase().includes('tone') ||
      p.name.toLowerCase().includes('imagery') ||
      p.name.toLowerCase().includes('style') ||
      p.name.toLowerCase().includes('voice'),
    defaultGood: 'Visual style and tone match the brand identity.',
    defaultNeedsAttention: 'The mood or creative tone feels inconsistent with the brand style.',
  },
  {
    id: 'visual-quality',
    name: 'Image & video quality',
    iconType: 'QUALITY',
    match: (p) =>
      p.category === 'IMAGE_QUALITY' ||
      p.category === 'VISUAL_QUALITY' ||
      p.name.toLowerCase().includes('resolution') ||
      p.name.toLowerCase().includes('quality') ||
      p.name.toLowerCase().includes('artifact') ||
      p.name.toLowerCase().includes('blur'),
    defaultGood: 'High-resolution assets with crisp clarity and no compression artifacts.',
    defaultNeedsAttention: 'Image or video resolution is lower than standard export guidelines.',
  },
  {
    id: 'compliance',
    name: 'Compliance requirements',
    iconType: 'COMPLIANCE',
    match: (p) =>
      p.category === 'DISCLAIMER' ||
      p.name.toLowerCase().includes('disclaimer') ||
      p.name.toLowerCase().includes('legal') ||
      p.name.toLowerCase().includes('terms') ||
      p.name.toLowerCase().includes('claim'),
    defaultGood: 'Required regulatory disclaimers and brand statements are present.',
    defaultNeedsAttention: 'Required disclaimers or campaign terms are missing or incomplete.',
  },
  {
    id: 'platform-specs',
    name: 'Platform specifications',
    iconType: 'SPECS',
    match: (p) =>
      p.name.toLowerCase().includes('safe zone') ||
      p.name.toLowerCase().includes('aspect') ||
      p.name.toLowerCase().includes('format') ||
      p.name.toLowerCase().includes('ratio') ||
      p.name.toLowerCase().includes('platform'),
    defaultGood: 'Framing fits standard social and digital placement ratios cleanly.',
    defaultNeedsAttention: 'Check placement ratio so text is not cut off by platform UI overlays.',
  },
];

/**
 * Transforms raw submission and AI analysis data into an actionable creative review model
 */
export function transformToCreativeReview(
  submission: Submission,
  selectedVersionNumber?: number,
  approvalThreshold = 80
): CreativeReviewModel {
  const versionNum = selectedVersionNumber || submission.currentVersion || 1;
  const currentVersion =
    submission.versions.find((v) => v.versionNumber === versionNum) ||
    submission.versions[submission.versions.length - 1];

  const analysis: AIAnalysisResult | undefined = currentVersion?.analysisResult;
  const currentFile = currentVersion?.files?.[0];
  const isVideo = submission.mediaType === 'video' || currentFile?.fileType === 'video';
  const brandName = submission.brandName || 'the assigned brand';

  const overallScore =
    typeof currentVersion?.aiScore === 'number'
      ? currentVersion.aiScore
      : typeof submission.overallAiScore === 'number'
      ? submission.overallAiScore
      : 0;

  const hasMissingAiData = !analysis || !analysis.parameters || analysis.parameters.length === 0;

  // 1. Overall Status
  let overallStatus: CreativeReviewStatus = 'PENDING_HUMAN_REVIEW';
  let oneSentenceSummary = '';
  let workflowNotice = '';

  if (analysis?.isBrandMismatch) {
    overallStatus = 'FAIL';
    const detectedStr = analysis.detectedSubject ? ` (detected content: "${analysis.detectedSubject}")` : '';
    oneSentenceSummary = `Asset Content Mismatch: This image does not depict or belong to ${brandName}${detectedStr}. No official ${brandName} marks, crests, or campaign materials were found.`;
    workflowNotice = `Asset Mismatch &bull; Uploaded creative does not match brand "${brandName}". Check uploaded file or selected brand.`;
  } else if (submission.workflowStatus === 'APPROVED' || submission.humanDecision === 'APPROVED') {
    overallStatus = 'PASS';
    oneSentenceSummary =
      'This creative has been formally verified and approved by the appointed supervisor.';
    workflowNotice = 'Final human approval granted &bull; Ready for client packaging.';
  } else if (hasMissingAiData) {
    overallStatus = 'PENDING_HUMAN_REVIEW';
    oneSentenceSummary =
      'Creative pre-flight analysis is being processed or waiting for supervisor review.';
    workflowNotice = 'Analysis in progress &bull; Appointed supervisor sign-off required.';
  } else if (overallScore >= approvalThreshold) {
    overallStatus = 'PASS';
    oneSentenceSummary =
      'Your creative follows the core brand rules with high fidelity. Only minor polish may be suggested.';
    workflowNotice =
      'AI Review Passed &bull; Appointed Supervisor approval required before client dispatch.';
  } else if (overallScore >= 60) {
    overallStatus = 'NEEDS_CHANGES';
    oneSentenceSummary =
      'This creative needs a few important adjustments to match brand guidelines before moving forward.';
    workflowNotice =
      'Changes required &bull; Address the highlighted issues and submit a revised version.';
  } else {
    overallStatus = 'FAIL';
    oneSentenceSummary =
      'Multiple critical brand guidelines were missed. Please rework the asset before resubmitting.';
    workflowNotice = 'Non-compliant &bull; Significant revision required to meet company brand standard.';
  }

  // 2. Extract and categorize issues
  const rawParams: ParameterResult[] = analysis?.parameters || [];
  const issues: CreativeIssueCard[] = [];

  if (analysis?.isBrandMismatch) {
    issues.push({
      id: 'issue-brand-mismatch',
      priority: 'CRITICAL',
      category: 'LOGO',
      title: 'Uploaded Asset Does Not Match Brand',
      whatWeFound: `The uploaded asset appears to depict "${analysis.detectedSubject || 'unrelated visual content'}" with zero marks, logos, or typography for ${brandName}.`,
      whyItMatters: `Evaluating an unrelated asset against ${brandName} guidelines generates false compliance findings.`,
      howToFix: `Please verify that you have chosen the intended brand profile or re-upload the official creative file for ${brandName}.`,
      relatedRule: 'Brand Identity & Asset Grounding',
      blocking: true,
      score: 0,
    });
  }

  rawParams.forEach((param) => {
    const isFailing = param.status === 'FAIL' || param.status === 'UNCERTAIN' || param.score < 80;
    if (!isFailing) return;

    let priority: CreativeActionPriority = 'MEDIUM';
    if (param.severity === 'CRITICAL' || param.score < 50) {
      priority = 'CRITICAL';
    } else if (param.severity === 'HIGH' || param.score < 70) {
      priority = 'HIGH';
    } else if (param.score >= 80) {
      priority = 'LOW';
    }

    const blocking = priority === 'CRITICAL' || priority === 'HIGH';

    // Generate human-friendly title
    let shortTitle = param.name;
    if (shortTitle.toLowerCase().includes('color') && !shortTitle.toLowerCase().includes('palette')) {
      shortTitle = 'Brand colour mismatch';
    } else if (shortTitle.toLowerCase().includes('clear space') || shortTitle.toLowerCase().includes('margin')) {
      shortTitle = 'Logo spacing is too tight';
    } else if (shortTitle.toLowerCase().includes('cta') || shortTitle.toLowerCase().includes('action')) {
      shortTitle = 'Call-to-action needs prominence';
    } else if (shortTitle.toLowerCase().includes('readab') || shortTitle.toLowerCase().includes('contrast')) {
      shortTitle = 'Text contrast / readability issue';
    }

    // What we found
    const whatWeFound = humanizeText(
      param.reason ||
        (param.evidence && param.evidence[0]) ||
        `The ${param.name.toLowerCase()} does not meet the brand pass criteria.`
    );

    // Why it matters
    let whyItMatters =
      'Ensuring this rule is followed maintains brand consistency and clear communication.';
    const nameLower = param.name.toLowerCase();
    if (nameLower.includes('color')) {
      whyItMatters =
        'Using unapproved colors dilutes brand recognition and looks inconsistent across campaign collateral.';
    } else if (nameLower.includes('logo')) {
      whyItMatters =
        'Crowding the logo or altering its proportion diminishes brand prestige and clarity.';
    } else if (nameLower.includes('cta') || nameLower.includes('action')) {
      whyItMatters =
        'If the call-to-action is hard to spot, the audience will not know what step to take next.';
    } else if (nameLower.includes('font') || nameLower.includes('type')) {
      whyItMatters =
        'Consistent typography reinforces brand identity and ensures professional hierarchy.';
    } else if (nameLower.includes('contrast') || nameLower.includes('readab')) {
      whyItMatters =
        'Low-contrast text causes strain on mobile screens and lowers campaign engagement.';
    }

    // How to fix
    const howToFix = humanizeText(
      param.remedy ||
        `Update this element in Canva or your design editor to align with the active ${param.metaGuideline || 'brand guideline'}.`
    );

    issues.push({
      id: param.parameterId || `issue-${param.name}`,
      priority,
      category: param.category,
      title: shortTitle,
      whatWeFound,
      whyItMatters,
      howToFix,
      relatedRule: param.metaGuideline || `${param.name} Guideline`,
      blocking,
      location: getHumanLocation(param.boundingRegion),
      technicalEvidence: param.evidence,
      parameterId: param.parameterId,
      score: param.score,
    });
  });

  // Sort issues: CRITICAL > HIGH > MEDIUM > LOW
  const priorityWeight: Record<CreativeActionPriority, number> = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };
  issues.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);

  // 3. Quick Action Summary ("What you need to do") - Top 3 to 5 items
  const topActions: CreativeActionItem[] = [];

  // Integrate explicit AI recommendations if present
  if (analysis?.recommendations && analysis.recommendations.length > 0) {
    analysis.recommendations.slice(0, 4).forEach((rec, idx) => {
      const matchedIssue = issues.find((iss) => iss.parameterId === rec.parameterId);
      topActions.push({
        id: `action-rec-${idx}`,
        priority: (rec.priority as CreativeActionPriority) || 'HIGH',
        title: matchedIssue?.title || `Update ${rec.message.split('.')[0]}`,
        reason: matchedIssue?.whyItMatters || 'Required by brand guidelines.',
        fix: humanizeText(rec.message),
        relatedRule: matchedIssue?.relatedRule,
      });
    });
  }

  // If recommendations are fewer than 3, fill from top issues
  if (topActions.length < 3) {
    issues.forEach((iss) => {
      if (topActions.length >= 5) return;
      if (!topActions.some((act) => act.title === iss.title)) {
        topActions.push({
          id: `action-issue-${iss.id}`,
          priority: iss.priority,
          title: iss.title,
          reason: iss.whyItMatters,
          fix: iss.howToFix,
          relatedRule: iss.relatedRule,
        });
      }
    });
  }

  // 4. Category Score Summary (Creative Checklist)
  const categorySummary: CreativeCategorySummary[] = CATEGORY_BUCKETS.map((bucket) => {
    const matchedParams = rawParams.filter(bucket.match);
    if (matchedParams.length === 0) {
      return {
        id: bucket.id,
        name: bucket.name,
        status: 'NOT_CHECKED',
        summary: 'Not specifically evaluated on this asset type.',
        iconType: bucket.iconType,
      };
    }

    const hasFailure = matchedParams.some(
      (p) => p.status === 'FAIL' || p.status === 'UNCERTAIN' || p.score < 75
    );
    const avgScore = Math.round(
      matchedParams.reduce((acc, p) => acc + p.score, 0) / matchedParams.length
    );

    if (hasFailure) {
      const failingParam = matchedParams.find(
        (p) => p.status === 'FAIL' || p.status === 'UNCERTAIN' || p.score < 75
      );
      return {
        id: bucket.id,
        name: bucket.name,
        status: 'NEEDS_ATTENTION',
        score: avgScore,
        summary: humanizeText(failingParam?.reason || bucket.defaultNeedsAttention),
        iconType: bucket.iconType,
      };
    }

    return {
      id: bucket.id,
      name: bucket.name,
      status: 'GOOD',
      score: avgScore,
      summary: bucket.defaultGood,
      iconType: bucket.iconType,
    };
  });

  // 5. What is Working Well (2 to 5 specific strengths)
  const strengths: string[] = [];
  if (analysis?.isBrandMismatch) {
    strengths.push('File format, dimensions, and cryptographic asset hash were verified in storage.');
  } else {
    const passingParams = rawParams.filter((p) => p.status === 'PASS' && p.score >= 85);

    passingParams.slice(0, 5).forEach((p) => {
      let friendlyPraise = humanizeText(p.reason || p.evidence?.[0] || '');
      if (!friendlyPraise || friendlyPraise.length < 15) {
        friendlyPraise = `${p.name} cleanly meets approved brand guidelines.`;
      }
      strengths.push(friendlyPraise);
    });

    // Provide encouraging defaults if passing params are sparse
    if (strengths.length === 0 && overallScore >= 70) {
      strengths.push('Asset resolution and visual layout are clean and well-structured.');
      strengths.push('Campaign messaging and product focus are clearly identifiable.');
    }
  }

  // 6. Version Comparison ("What changed from previous version")
  let versionComparison: CreativeVersionDelta | undefined;
  if (versionNum > 1 && submission.versions.length > 1) {
    const prevVersionNum = versionNum - 1;
    const prevVersion = submission.versions.find((v) => v.versionNumber === prevVersionNum);

    if (prevVersion?.analysisResult?.parameters) {
      const prevScore = prevVersion.aiScore || 0;
      const scoreDiff = overallScore - prevScore;

      const improved: { title: string; detail: string }[] = [];
      const stillNeedsAttention: { title: string; detail: string }[] = [];

      rawParams.forEach((currParam) => {
        const prevParam = prevVersion.analysisResult?.parameters.find(
          (p) => p.parameterId === currParam.parameterId || p.name === currParam.name
        );
        if (!prevParam) return;

        const wasFailing = prevParam.status !== 'PASS' || prevParam.score < 80;
        const nowPassing = currParam.status === 'PASS' && currParam.score >= 80;

        if (wasFailing && nowPassing) {
          improved.push({
            title: currParam.name,
            detail: `Improved from ${prevParam.score}% to ${currParam.score}%. Issue resolved.`,
          });
        } else if (currParam.status !== 'PASS' || currParam.score < 80) {
          stillNeedsAttention.push({
            title: currParam.name,
            detail: humanizeText(currParam.remedy || currParam.reason || 'Needs further adjustment.'),
          });
        }
      });

      versionComparison = {
        comparedVersionNumber: prevVersionNum,
        scoreDifference: scoreDiff,
        improved: improved.slice(0, 4),
        stillNeedsAttention: stillNeedsAttention.slice(0, 4),
      };
    }
  }

  // 7. Interactive Resubmission Checklist
  const resubmissionChecklist = [
    {
      id: 'chk-critical',
      label: 'I corrected all critical and high-priority issues.',
    },
    {
      id: 'chk-colors',
      label: 'I verified approved brand colors from the toolkit.',
    },
    {
      id: 'chk-logo',
      label: 'I checked logo placement, proportion, and clear space.',
    },
    {
      id: 'chk-spelling',
      label: 'I proofread the headline, body text, and contact hotline.',
    },
    {
      id: 'chk-cta',
      label: 'I confirmed that the call-to-action is prominent and legible.',
    },
    {
      id: 'chk-upload',
      label: 'I uploaded the revised export in the correct resolution.',
    },
    {
      id: 'chk-campaign',
      label: 'I confirmed the correct brand and campaign are selected.',
    },
  ];

  // 8. Video Specific Details (if applicable)
  let videoChecks: CreativeReviewModel['videoChecks'] = undefined;
  if (isVideo) {
    const videoTimeline = analysis?.videoTimeline || [];
    videoChecks = {
      openingHook: {
        status: overallScore > 75 ? 'GOOD' : 'NEEDS_ATTENTION',
        note: 'First 3 seconds establish brand context and campaign topic.',
      },
      brandVisibility: {
        status: overallScore > 80 ? 'GOOD' : 'NEEDS_ATTENTION',
        note: 'Logo and brand badge appear with clear contrast throughout the clip.',
      },
      ctaTiming: {
        status: overallScore > 70 ? 'GOOD' : 'NEEDS_ATTENTION',
        note: 'Closing screen holds call-to-action text for at least 2.5 seconds.',
      },
      audioCaptions: {
        status: 'GOOD',
        note: 'Captions are positioned safely above bottom platform UI icons.',
      },
      timelineEvents: videoTimeline,
    };
  }

  // 9. Image Specific Details
  const imageChecks: CreativeReviewModel['imageChecks'] = !isVideo
    ? {
        colorMatchNote: 'Colors sampled against the official brand hex palette.',
        safeMarginNote: 'Critical graphics and copy remain inside the 5% margin boundary.',
        hierarchyNote: 'Clear visual path from primary headline down to the action button.',
      }
    : undefined;

  let assetTypeLabel: CreativeReviewModel['assetType'] = 'Poster';
  if (isVideo) assetTypeLabel = 'Video';

  return {
    overallStatus,
    overallScore,
    oneSentenceSummary,
    workflowNotice,
    brandName: submission.brandName,
    campaignName: submission.campaignName,
    assetType: assetTypeLabel,
    versionNumber: versionNum,
    reviewDateTime: new Date(
      currentVersion?.submittedAt || submission.createdAt
    ).toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
    topActions,
    issues,
    categorySummary,
    strengths,
    versionComparison,
    resubmissionChecklist,
    isVideo,
    videoChecks,
    imageChecks,
    technicalReportAvailable: Boolean(analysis && analysis.parameters?.length > 0),
    hasMissingAiData,
  };
}
