export type UserRole = 'EMPLOYEE' | 'SUPERVISOR' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  assignedBrands?: string[];
  assignedCampaignIds?: string[];
  active?: boolean;
  password?: string;
}

export type ParameterCategory =
  | 'LOGO'
  | 'BRAND_COMPLIANCE'
  | 'PRODUCT_VISIBILITY'
  | 'TYPOGRAPHY'
  | 'COLOR_PALETTE'
  | 'CTA'
  | 'DISCLAIMER'
  | 'SAFE_AREA'
  | 'VISUAL_QUALITY'
  | 'TEMPORAL_CONSISTENCY'
  | 'TEXT'
  | 'IMAGE_QUALITY'
  | 'VISUAL';

export type ParameterSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ParameterMediaType = 'IMAGE' | 'VIDEO' | 'ALL';
export type ParameterType =
  | 'BOOLEAN'
  | 'NUMERIC'
  | 'CATEGORICAL'
  | 'TEXT'
  | 'VISUAL'
  | 'OBJECT_DETECTION'
  | 'SPATIAL'
  | 'TEMPORAL';

export interface BrandParameter {
  id: string;
  brandId: string;
  name: string;
  category: ParameterCategory;
  type: ParameterType;
  severity: ParameterSeverity;
  weight: number; // 0 - 100%
  passThreshold: number; // 0 - 100%
  isRequired: boolean;
  isActive: boolean;
  applicableMediaType: ParameterMediaType;
  instructions: string;
  passCriteria: string;
}

export interface BrandToolkit {
  allowedFonts: string[];
  primaryFont: string;
  secondaryFont: string;
  minHeadingSize: string;
  minBodySize: string;
  colorTheme: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    forbiddenColors: string[];
    prohibitedColors?: string[];
    darkBackground?: string;
    lightBackground?: string;
  };
  typographySpecs?: {
    minHeadingPx?: number;
    minBodyPx?: number;
    allowedHierarchy?: string[];
  };
  logoSafeMarginPercent: number;
  approvedPositions: string[];
  disclaimerTemplate: string;
  contactRequirements: string;
  socialSpecs: {
    allowedRatios: string[];
    maxTextCoveragePercent: number;
    minResolution: string;
  };
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  isActive: boolean;
  colorPalette: {
    primary: string;
    secondary: string;
    forbidden: string[];
    accent?: string;
    neutral?: string;
  };
  typography: {
    primaryFont: string;
    minHeadingSize: string;
    minBodySize: string;
    rules: string[];
  };
  toolkit?: BrandToolkit;
  logoRules: {
    minSizePercent: number;
    safeZonePercent: number;
    approvedPositions: string[];
    prohibitedModifications: string[];
  };
  creativeRules: {
    productVisibilityMinPercent: number;
    tone: string;
    backgroundStyle: string;
    ctaRequirement: string;
    disclaimerText?: string;
  };
  videoRules: {
    logoMinDurationSec: number;
    productAppearanceWithinSec: number;
    ctaRequiredAtEnd: boolean;
    minResolution: string;
  };
  guidelinesMarkdown: string;
  parametersCount?: number;
  slug?: string;
  toolkitVersion?: string;
  toolkitFolderId?: string | null;
  driveSyncStatus?: 'NOT_CONFIGURED' | 'PENDING' | 'SYNCING' | 'SYNCED' | 'PARTIALLY_SYNCED' | 'SYNC_FAILED' | 'VERIFICATION_FAILED';
  lastSyncedToDriveAt?: string;
  toolkitVersions?: BrandToolkitVersion[];
}

export interface BrandToolkitVersion {
  version: string;
  updatedAt: string;
  updatedBy: string;
  updatedByName?: string;
  summaryOfChanges: string;
  changedFields: string[];
  toolkitSnapshot: Partial<Brand>;
  driveFolderId?: string | null;
  driveFolderUrl?: string | null;
}

export interface Campaign {
  id: string;
  brandId: string;
  name: string;
  product: string;
  campaignType: string;
  region: string;
  targetAudience: string;
  description: string;
  startDate: string;
  endDate: string;
  active: boolean;
  assignedSupervisorId?: string;
  assignedSupervisorName?: string;
}

export type SubmissionStatus =
  | 'DRAFT'
  | 'UPLOADED'
  | 'SUBMITTED'
  | 'PROCESSING'
  | 'ANALYZING'
  | 'ANALYSIS_FAILED'
  | 'NEEDS_IMPROVEMENT'
  | 'AWAITING_SUPERVISOR_REVIEW'
  | 'AWAITING_MANAGER_REVIEW'
  | 'IN_SUPERVISOR_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUPERVISOR_ASSIGNMENT_REQUIRED'
  | 'FAILED';

export type HumanDecision = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
export type AIStatus = 'PENDING' | 'PROCESSING' | 'PASSED' | 'FAILED' | 'COMPLETED';

export interface ParameterResult {
  parameterId: string;
  name: string;
  category: ParameterCategory;
  score: number; // 0-100
  status: 'PASS' | 'FAIL' | 'UNCERTAIN';
  confidence: number; // 0.0-1.0
  evidence: string[];
  reason?: string; // Explicit explanation of why it stood true or why it failed
  metaGuideline?: string; // Exact brand/meta guideline rule citation
  remedy?: string; // Specific corrective action required
  timestamps?: string[];
  boundingRegion?: {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
  };
  severity: ParameterSeverity;
  weight: number;
  needsEmployeeAttention?: boolean;
  clientClaimPrompt?: {
    claims: string[];
    isConfirmedByEmployee?: boolean;
    confirmedAt?: string;
    confirmedBy?: string;
    note?: string;
  };
}

export interface AIRecommendation {
  id: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  parameterId?: string;
}

export interface LayerScores {
  filesAndPackaging: number; // Layer 1: File integrity, required exports, folder structure
  brandIdentity: number; // Layer 2: Logos, crest clear space, approved hex palette
  designQuality: number; // Layer 3: Visual hierarchy, contrast, typography whitelist
  contentMessaging: number; // Layer 4: Claims, OCR consistency, contact hotline, no watermarks
  platformSafeZones: number; // Layer 5: 5% margin buffer, 4:5 / 9:16 ratio fit
  trendIntelligence: number; // Layer 6: Visual whitespace balance, engagement aesthetics
}

export interface VideoTimelineEvent {
  timestamp: string; // e.g. "00:04"
  timeSec?: number;
  label: string;
  status: 'PASS' | 'FLAG' | 'INFO';
  detail: string;
}

export interface AIAnalysisResult {
  id: string;
  submissionId: string;
  versionNumber: number;
  reviewRequestId?: string;
  assetHash?: string;
  overallScore: number;
  confidence: number;
  status: 'NEEDS_IMPROVEMENT' | 'AWAITING_SUPERVISOR_REVIEW' | 'AWAITING_MANAGER_REVIEW';
  isBrandMismatch?: boolean;
  detectedSubject?: string;
  parameters: ParameterResult[];
  recommendations: AIRecommendation[];
  executiveSummary: string;
  analyzedAt: string;
  modelUsed: string;
  processingTimeMs: number;
  layerScores?: LayerScores;
  videoTimeline?: VideoTimelineEvent[];
  canvaFixPrompt?: string;
  quickFixSteps?: string[];
  manualVerificationRecommended?: boolean;
}

export interface VideoFrame {
  timestamp: string; // e.g. "00:04"
  timeSec: number;
  dataUrl: string;
}

export interface SubmissionFile {
  id: string;
  fileName: string;
  fileType: 'image' | 'video';
  mimeType: string;
  fileSize: number;
  fileUrl: string;
  thumbnailUrl?: string;
  durationSec?: number;
  resolution?: string;
  frames?: VideoFrame[];
  assetHash?: string;
  verifiedAt?: string;
}

export interface SubmissionComment {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userAvatar: string;
  content: string;
  createdAt: string;
  type: 'REVIEW' | 'CHANGE_REQUEST' | 'NOTE' | 'REJECT' | 'APPROVAL' | 'COMMENT' | 'PEER_REVIEW' | 'PEER_TIP' | 'PEER_ENDORSEMENT';
  peerTag?: 'SAFE_AREA' | 'COLOR_PALETTE' | 'TYPOGRAPHY' | 'DISCLAIMER' | 'CTA' | 'GENERAL';
  peerVerdict?: 'APPROVED' | 'SUGGESTION' | 'QUESTION';
}

export interface SubmissionVersion {
  versionNumber: number;
  submissionId: string;
  files: SubmissionFile[];
  changelog?: string;
  submittedAt: string;
  routedToSupervisorAt?: string;
  aiScore?: number;
  aiConfidence?: number;
  aiStatus: AIStatus;
  workflowStatus: SubmissionStatus;
  humanDecision: HumanDecision;
  humanReviewerId?: string;
  humanReviewerName?: string;
  humanComment?: string;
  humanDecisionAt?: string;
  reviewedAt?: string;
  reviewDurationMinutes?: number;
  analysisResult?: AIAnalysisResult;
  driveFolderUrl?: string;
}

export interface Submission {
  id: string;
  campaignId: string;
  campaignName: string;
  brandId: string;
  brandName: string;
  brandLogo: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  mediaType: 'image' | 'video';
  currentVersion: number;
  versions: SubmissionVersion[];
  overallAiScore: number;
  overallAiConfidence: number;
  workflowStatus: SubmissionStatus;
  humanDecision: HumanDecision;
  humanReviewerId?: string;
  humanReviewerName?: string;
  humanComment?: string;
  comments: SubmissionComment[];
  createdAt: string;
  updatedAt: string;
  finalApprovalAt?: string;
  totalTurnaroundMinutes?: number;
  assignedManagerId?: string;
  assignedSupervisorId?: string;
  assignedSupervisorName?: string;
  tags: string[];
  canvaUrl?: string;
  canvaDesignId?: string;
  canvaPreviewState?: 'REAL_PREVIEW' | 'LINK_ONLY' | 'INVALID';
  clientRequirements?: string;
  clientClaims?: string[];
  clientClaimConfirmations?: {
    claim: string;
    mustBeIncluded: boolean;
    confirmedAt: string;
    confirmedBy: string;
    versionNumber: number;
  }[];
  detectedBrandResult?: CanvaBrandDetectionResult;
  driveArchive?: DriveArchivePackage;
  deliveryPackage?: DeliveryPackage;
  clientShares?: ClientShareRecord[];
  clientFeedback?: ClientFeedbackRecord[];
  clientApprovalStatus?: 'PENDING' | 'CLIENT_APPROVED' | 'CLIENT_CHANGES_REQUESTED';
}

export interface ClientShareRecord {
  id: string;
  sharedAt: string;
  sharedBy: string;
  sharedByName: string;
  channel: 'LINK' | 'EMAIL' | 'WHATSAPP' | 'CLIQ' | 'SLACK' | 'DIRECT';
  recipientEmail?: string;
  recipientName?: string;
  note?: string;
  shareUrl?: string;
}

export interface ClientFeedbackRecord {
  id: string;
  receivedAt: string;
  clientName: string;
  clientEmail?: string;
  decision: 'APPROVED' | 'CHANGES_REQUESTED';
  comment?: string;
}

export type DeliveryStatus =
  | 'NOT_ELIGIBLE'
  | 'PACKAGE_NOT_CREATED'
  | 'PACKAGE_CREATING'
  | 'PACKAGE_READY'
  | 'WAITING_FOR_ADMIN_REVIEW'
  | 'READY_TO_SEND'
  | 'SENDING'
  | 'SENT'
  | 'SEND_FAILED'
  | 'DELIVERY_CONFIRMED'
  | 'CANCELLED';

export interface DeliveryAssetRecord {
  assetId: string;
  submissionId: string;
  brandId: string;
  campaignId: string;
  versionNumber: number;
  assetType: 'APPROVED_MEDIA' | 'AI_REPORT' | 'BRAND_SPEC' | 'DELIVERY_README' | 'COMPLIANCE_CERT';
  originalFilename: string;
  storedFilename: string;
  mimeType: string;
  fileSize: number;
  checksum?: string;
  driveFileId?: string | null;
  driveFolderId?: string | null;
  driveWebViewLink?: string | null;
  uploadStatus: 'NOT_STARTED' | 'QUEUED' | 'UPLOADING' | 'UPLOADED' | 'VERIFYING' | 'VERIFIED' | 'UPLOAD_FAILED' | 'VERIFICATION_FAILED' | 'RETRY_REQUIRED' | 'ARCHIVED';
  verificationStatus: 'PENDING' | 'VERIFIED' | 'FAILED';
  uploadedAt?: string;
  verifiedAt?: string;
  errorMessage?: string;
}

export interface DeliveryPackage {
  id: string;
  submissionId: string;
  brandId: string;
  campaignId: string;
  approvedVersion: number;
  packageStatus: DeliveryStatus;
  deliveryFolderId?: string | null;
  deliveryFolderUrl?: string | null;
  verifiedDriveUrl?: string | null;
  includedAssets: DeliveryAssetRecord[];
  preparedBy: string;
  preparedByName?: string;
  preparedAt: string;
  sentBy?: string;
  sentByName?: string;
  sentAt?: string;
  deliveryChannel?: 'MANUAL_EMAIL' | 'WHATSAPP' | 'DIRECT_LINK' | 'OTHER';
  recipientName?: string;
  recipientEmail?: string;
  recipientContact?: string;
  deliveryMessage?: string;
  deliveryNotes?: string;
  clientConfirmationStatus?: 'PENDING' | 'CONFIRMED' | 'DISPUTED';
  clientConfirmedAt?: string;
  clientNotes?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DriveStatusResponse {
  configured: boolean;
  authenticated: boolean;
  connected: boolean;
  authType: string;
  rootFolderConfigured: boolean;
  rootFolderVerified: boolean;
  sharedDriveConfigured: boolean;
  driveName: string | null;
  rootFolderName: string | null;
  lastCheckedAt: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface CanvaBrandDetectionResult {
  matchedBrandId: string;
  brandName: string;
  confidence: number;
  inferredCampaignName: string;
  detectedSignals: string[];
}

export interface CryptographicCertificate {
  algorithm: string;
  hash: string;
  fileName: string;
  fileSize: number;
  approvedVersion: number;
  approvedAt: string;
}

export interface DriveArchivePackage {
  folderId: string | null;
  folderName: string;
  driveUrl: string | null;
  archivedAt: string;
  status: 'ARCHIVED' | 'ARCHIVE_NOT_CONFIGURED' | 'ARCHIVE_FAILED' | 'SIMULATED';
  message?: string;
  cryptographicCertificate?: CryptographicCertificate;
  fileStructure: {
    path: string;
    sizeBytes?: number;
    type: string;
  }[];
}

export interface PostReviewTurnaroundStat {
  submissionId: string;
  campaignName: string;
  brandName: string;
  brandLogo?: string;
  creatorName: string;
  creatorAvatar: string;
  currentVersion: number;
  status: SubmissionStatus;
  currentStatus?: SubmissionStatus;
  finalScore?: number;
  assignedSupervisorId?: string;
  assignedSupervisorName?: string;
  peerReviewsCount?: number;
  submittedAt: string;
  firstSubmittedAt: string;
  finalApprovedAt?: string;
  latestReviewDurationMinutes: number;
  timeToReviewMinutes?: number;
  totalTurnaroundMinutes: number;
  overallTurnaroundMinutes?: number;
  versionCount: number;
  totalVersions?: number;
  versions: {
    versionNumber: number;
    submittedAt: string;
    reviewedAt?: string;
    decision: string;
    status?: string;
    score?: number;
    reviewDurationMinutes: number;
    reworkDurationMinutes?: number;
    reviewerName?: string;
    changelog?: string;
  }[];
  versionsBreakdown?: {
    versionNumber: number;
    submittedAt: string;
    reviewedAt?: string;
    status: string;
    score: number;
    reviewDurationMinutes: number;
    reviewerName?: string;
    changelog?: string;
  }[];
}

export interface EmployeeVelocityMetric {
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  department?: string;
  totalSubmissions: number;
  approvedCount: number;
  reworkCount: number;
  firstPassApprovalRate: number; // percentage e.g. 80%
  averageTurnaroundMinutes: number;
  averageIterations: number;
  averageAiScore: number;
  velocityRating: 'EXCELLENT' | 'HIGH' | 'STEADY' | 'NEEDS_TRAINING';
  assignedSupervisorName?: string;
}

export interface ReviewVelocityStats {
  averageReviewTimeMinutes: number;
  averageTotalTurnaroundMinutes: number;
  fastestReviewMinutes: number;
  longestReviewMinutes: number;
  averageVersionsCount: number;
  firstPassApprovedCount: number;
  reworkedApprovedCount: number;
  totalApproved: number;
  pendingReviewCount: number;
  totalSubmissionsAnalyzed?: number;
  posts: PostReviewTurnaroundStat[];
  postVelocities?: PostReviewTurnaroundStat[];
  supervisorMetrics?: SupervisorMetric[];
  employeeMetrics?: EmployeeVelocityMetric[];
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole | 'SYSTEM' | 'CLIENT';
  action: string;
  submissionId?: string;
  versionNumber?: number;
  details: string;
  oldStatus?: string;
  newStatus?: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  submissionId?: string;
  createdAt: string;
}

export interface SystemSettings {
  aiApprovalThreshold: number; // default: 85
  confidenceThreshold: number; // default: 80
  maxFileSizeMb: number; // default: 50
  videoFrameSamplingRateSec: number; // default: 3
  allowedImageTypes: string[];
  allowedVideoTypes: string[];
  autoRouteEnabled: boolean;
  trendIntelligenceActive: boolean;
  userId?: string;
  userName?: string;
}

export interface AnalyticsData {
  totalSubmissions: number;
  approvalRate: number;
  rejectionRate: number;
  reworkRate: number;
  averageAiScore: number;
  averageFinalScore: number;
  averageReviewTimeHours: number;
  averageRevisionsCount: number;
  brandCompliance: {
    brandName: string;
    score: number;
    total: number;
    approved: number;
  }[];
  commonFailures: {
    parameterName: string;
    category: string;
    percentage: number;
    count: number;
  }[];
  timeline: {
    date: string;
    submitted: number;
    approved: number;
    reworked: number;
  }[];
}


export interface AIUsageLog {
  id: string;
  submissionId: string;
  versionNumber: number;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  cachedTokens?: number;
  processingTimeMs: number;
  timestamp: string;
  estimatedCostUsd?: number;
}

export interface SupervisorMetric {
  supervisorId: string;
  supervisorName: string;
  supervisorAvatar?: string;
  totalAssigned: number;
  completedReviews: number;
  pendingReviews: number;
  averageReviewTimeMinutes: number;
  fastestReviewMinutes: number;
  slowestReviewMinutes: number;
  approvalRate: number;
  requestChangesRate: number;
  rejectionRate: number;
}

export type CreativeReviewStatus = 'PASS' | 'NEEDS_CHANGES' | 'FAIL' | 'PENDING_HUMAN_REVIEW';
export type CreativeActionPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface CreativeActionItem {
  id: string;
  priority: CreativeActionPriority;
  title: string;
  reason: string;
  fix: string;
  relatedRule?: string;
}

export interface CreativeIssueCard {
  id: string;
  priority: CreativeActionPriority;
  category: string;
  title: string;
  whatWeFound: string;
  whyItMatters: string;
  howToFix: string;
  relatedRule: string;
  blocking: boolean;
  location?: string;
  technicalEvidence?: string[];
  parameterId?: string;
  score?: number;
}

export interface CreativeCategorySummary {
  id: string;
  name: string;
  status: 'GOOD' | 'NEEDS_ATTENTION' | 'NOT_CHECKED';
  score?: number;
  summary: string;
  iconType: 'COLOR' | 'LOGO' | 'TYPE' | 'LAYOUT' | 'READABILITY' | 'CTA' | 'TONE' | 'QUALITY' | 'COMPLIANCE' | 'SPECS';
}

export interface CreativeVersionDelta {
  comparedVersionNumber: number;
  scoreDifference: number;
  improved: { title: string; detail: string }[];
  stillNeedsAttention: { title: string; detail: string }[];
}

export interface CreativeReviewModel {
  overallStatus: CreativeReviewStatus;
  overallScore: number;
  oneSentenceSummary: string;
  workflowNotice: string;
  brandName: string;
  campaignName: string;
  assetType: 'Poster' | 'Image' | 'Video' | 'Reel' | 'Carousel';
  versionNumber: number;
  reviewDateTime: string;
  topActions: CreativeActionItem[];
  issues: CreativeIssueCard[];
  categorySummary: CreativeCategorySummary[];
  strengths: string[];
  versionComparison?: CreativeVersionDelta;
  resubmissionChecklist: { id: string; label: string }[];
  isVideo: boolean;
  videoChecks?: {
    openingHook?: { status: 'GOOD' | 'NEEDS_ATTENTION'; note: string };
    brandVisibility?: { status: 'GOOD' | 'NEEDS_ATTENTION'; note: string };
    ctaTiming?: { status: 'GOOD' | 'NEEDS_ATTENTION'; note: string };
    audioCaptions?: { status: 'GOOD' | 'NEEDS_ATTENTION'; note: string };
    timelineEvents?: VideoTimelineEvent[];
  };
  imageChecks?: {
    colorMatchNote: string;
    safeMarginNote: string;
    hierarchyNote: string;
  };
  technicalReportAvailable: boolean;
  hasMissingAiData: boolean;
}
