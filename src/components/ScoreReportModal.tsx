import React, { useState, useRef, useEffect } from 'react';
import { Submission, SubmissionVersion } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  ShieldCheck,
  Play,
  RotateCcw,
  Check,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  MessageSquare,
  FileCheck2,
  User,
  ShieldAlert,
  FolderArchive,
  ExternalLink,
  Cpu,
  Link2,
  Share2,
  Copy,
  Mail,
} from 'lucide-react';
import { PeerReviewSection } from './PeerReviewSection';
import { CanvaPreviewCard } from './CanvaPreviewCard';
import { CreativeReviewView } from './CreativeReviewView';
import { transformToCreativeReview } from '../utils/creativeReviewTransformer';

interface ScoreReportModalProps {
  submission: Submission | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRework: (submission: Submission) => void;
  onManagerReview: (
    submissionId: string,
    decision: 'APPROVED' | 'REQUEST_CHANGES' | 'REJECTED',
    comment?: string
  ) => Promise<void>;
}

export const ScoreReportModal: React.FC<ScoreReportModalProps> = ({
  submission,
  isOpen,
  onClose,
  onOpenRework,
  onManagerReview,
}) => {
  const { currentRole, currentUser, systemSettings } = useAuth();
  const [currentSub, setCurrentSub] = useState<Submission | null>(submission);
  const [selectedVersionNum, setSelectedVersionNum] = useState<number>(
    submission?.currentVersion || 1
  );
  const [actionComment, setActionComment] = useState<string>('');
  const [showDecisionModal, setShowDecisionModal] = useState<
    'APPROVE' | 'REQUEST_CHANGES' | 'REJECT' | null
  >(null);
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);
  const [localDriveArchive, setLocalDriveArchive] = useState<any>(submission?.driveArchive || null);
  const [isArchivingDrive, setIsArchivingDrive] = useState(false);
  const [showClientShareModal, setShowClientShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [copiedRecipe, setCopiedRecipe] = useState(false);
  const [isConfirmingClaim, setIsConfirmingClaim] = useState(false);
  const [claimConfirmedBanner, setClaimConfirmedBanner] = useState<string | null>(null);
  const [copiedCliq, setCopiedCliq] = useState(false);
  const [copiedDrive, setCopiedDrive] = useState(false);

  useEffect(() => {
    if (submission) {
      setCurrentSub(submission);
      setLocalDriveArchive(submission.driveArchive || null);
      setSelectedVersionNum(submission.currentVersion || 1);
      setClaimConfirmedBanner(null);
    }
  }, [submission]);

  const activeSub = currentSub || submission;

  const handleCopyCanvaRecipe = () => {
    const text = analysis?.canvaFixPrompt || '';
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedRecipe(true);
    setTimeout(() => setCopiedRecipe(false), 2500);
  };

  const handleConfirmClaimIntent = async (parameterId: string) => {
    if (!activeSub) return;
    setIsConfirmingClaim(true);
    try {
      const res = await api.confirmClaimIntent(activeSub.id, {
        parameterId,
        userName: currentUser?.name || 'Creator',
        userId: currentUser?.id,
        action: 'PROCEED_CURRENT_CONTENT',
      });
      if (res.success && res.submission) {
        setCurrentSub(res.submission);
        setLocalDriveArchive(res.submission.driveArchive || null);
        setClaimConfirmedBanner(
          `Creative intent confirmed! Score updated to ${res.submission.overallAiScore}% (AI Approved). Delivery package archived to Google Drive: [Project] ${res.submission.campaignName} - ${res.submission.brandName}`
        );
        // Automatically open the client share modal so user can share Drive link via Email, Zoho Cliq, or WhatsApp!
        setShowClientShareModal(true);
      }
    } catch (err: any) {
      console.error('Failed to confirm claim intent:', err);
      alert(err.message || 'Failed to confirm claim intent');
    } finally {
      setIsConfirmingClaim(false);
    }
  };

  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  if (!isOpen || !activeSub) return null;

  const version =
    activeSub.versions.find((v) => v.versionNumber === selectedVersionNum) ||
    activeSub.versions[activeSub.versions.length - 1];

  const analysis = version?.analysisResult;
  const currentFile = version?.files[0];
  const isVideo = currentFile?.fileType === 'video';

  const isBelowThreshold =
    (version?.aiScore || activeSub.overallAiScore) < systemSettings.aiApprovalThreshold;

  const jumpToVideoTimestamp = (ts: string) => {
    if (!videoPlayerRef.current) return;
    const parts = ts.split(':');
    if (parts.length === 2) {
      const sec = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
      videoPlayerRef.current.currentTime = sec;
      videoPlayerRef.current.play().catch(() => {});
    }
  };

  const handleArchiveDrive = async () => {
    if (!activeSub) return;
    setIsArchivingDrive(true);
    try {
      const res = await api.archiveToGoogleDrive(activeSub.id);
      setLocalDriveArchive(res.driveArchive);
    } catch (err) {
      console.error('Failed to package to Drive', err);
    } finally {
      setIsArchivingDrive(false);
    }
  };

  const handleDecisionConfirm = async () => {
    if (!showDecisionModal || !activeSub) return;
    setIsSubmittingDecision(true);
    try {
      const canonicalDecision: 'APPROVED' | 'REQUEST_CHANGES' | 'REJECTED' =
        showDecisionModal === 'APPROVE'
          ? 'APPROVED'
          : showDecisionModal === 'REJECT'
          ? 'REJECTED'
          : 'REQUEST_CHANGES';
      await onManagerReview(activeSub.id, canonicalDecision, actionComment);
      setShowDecisionModal(null);
      setActionComment('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingDecision(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'AWAITING_SUPERVISOR_REVIEW':
        return 'bg-blue-950 text-blue-300 border-blue-800';
      case 'AWAITING_MANAGER_REVIEW':
        return 'bg-[#ff5000]/20 text-[#ff5000] border-[#ff5000]/40';
      case 'NEEDS_IMPROVEMENT':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'CHANGES_REQUESTED':
        return 'bg-orange-950 text-orange-300 border-orange-800';
      case 'REJECTED':
        return 'bg-red-950 text-red-300 border-red-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-2 sm:p-4 backdrop-blur-sm overflow-hidden font-sans">
      <div className="relative w-full max-w-5xl h-[88vh] max-h-[88vh] rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all overflow-hidden flex flex-col text-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-6 py-3.5 shrink-0 text-slate-900">
          <div className="flex items-center gap-3">
            <img
              src={activeSub.brandLogo}
              alt={activeSub.brandName}
              className="h-10 w-10 rounded-xl object-contain bg-slate-50 p-1 border border-slate-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-syne text-slate-900">
                  {activeSub.campaignName}
                </h2>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-space font-bold uppercase tracking-wider ${getStatusColor(
                    activeSub.workflowStatus
                  )}`}
                >
                  {activeSub.workflowStatus.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-space">
                Brand: <span className="font-semibold text-slate-800">{activeSub.brandName}</span> &bull;
                Submitted by <span className="font-semibold text-slate-800">{activeSub.userName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Version Switcher Tabs */}
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-space font-semibold">
              {activeSub.versions.map((v) => (
                <button
                  key={v.versionNumber}
                  onClick={() => setSelectedVersionNum(v.versionNumber)}
                  className={`rounded-lg px-3 py-1 transition-all cursor-pointer ${
                    (selectedVersionNum || activeSub.currentVersion) === v.versionNumber
                      ? 'bg-[#2E5629] text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  V{v.versionNumber}
                </button>
              ))}
            </div>

            {/* Share with Client Button */}
            <button
              type="button"
              onClick={() => setShowClientShareModal(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-xs font-bold font-syne text-slate-800 transition-colors cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5 text-[#2E5629]" />
              <span className="hidden sm:inline">Share with Client</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 85% Score Gate Verdict Banner */}
        {(() => {
          const score = version?.aiScore || activeSub.overallAiScore || 0;
          const passedGate = score >= (systemSettings?.aiApprovalThreshold ?? 85);

          return (
            <div
              className={`shrink-0 px-5 sm:px-6 py-3 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                passedGate
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50/80 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {passedGate ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-syne text-sm">
                      {passedGate
                        ? `AI Gate Passed (${score}% ≥ 85%)`
                        : `AI Gate Failed (${score}% < 85%) — Needs Creator Rework`}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-space font-bold ${
                        passedGate ? 'bg-emerald-200/60 text-emerald-950' : 'bg-amber-200/60 text-amber-950'
                      }`}
                    >
                      {passedGate ? 'ROUTED TO HUMAN APPROVAL' : 'BLOCKED FROM HUMAN REVIEW'}
                    </span>
                  </div>
                  <p className="text-[11px] font-sans mt-0.5 opacity-90">
                    {passedGate
                      ? 'Creative meets all Brand Toolkit & Meta Rules. Forwarded to Elena Rostova (Supervisor) for final sign-off.'
                      : 'AI requires score ≥ 85% before human review is allowed. Creator must fix the highlighted parameters below and resubmit.'}
                  </p>
                </div>
              </div>

              {!passedGate && onOpenRework && (
                <button
                  type="button"
                  onClick={() => onOpenRework(activeSub)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF5E97] hover:bg-[#E8457F] text-white text-xs font-bold font-syne shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Fix &amp; Resubmit V{(version?.versionNumber || activeSub.currentVersion) + 1}</span>
                </button>
              )}
            </div>
          );
        })()}

        {/* Modal Body: Split Screen Layout */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 bg-slate-50/50">
          {/* Left Column: Media Viewer + Player & Timestamps (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xs overflow-hidden">
              {isVideo ? (
                <div className="space-y-2">
                  <video
                    ref={videoPlayerRef}
                    src={currentFile?.fileUrl}
                    controls
                    className="w-full max-h-72 rounded-xl bg-slate-100"
                  />
                  <div className="flex items-center justify-between px-2 text-[11px] font-space text-slate-500">
                    <span>{currentFile?.fileName}</span>
                    <span>{currentFile?.durationSec || 30}s &bull; 1080p</span>
                  </div>
                </div>
              ) : activeSub.canvaUrl && (!currentFile?.fileUrl || currentFile.fileUrl === '' || currentFile.fileUrl.startsWith('data:application/x-canva') || activeSub.canvaPreviewState === 'LINK_ONLY') ? (
                <div className="p-2">
                  <CanvaPreviewCard
                    canvaUrl={activeSub.canvaUrl}
                    designId={activeSub.canvaDesignId}
                    previewState="LINK_ONLY"
                  />
                </div>
              ) : (
                <div className="relative group max-h-80 overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center border border-slate-100">
                  <img
                    src={currentFile?.fileUrl}
                    alt={currentFile?.fileName}
                    className="max-h-80 w-full object-contain rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Video Clickable Timestamps if available */}
            {isVideo && analysis?.parameters.some((p) => p.timestamps && p.timestamps.length > 0) && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold font-syne text-slate-900 mb-2">
                  <Clock className="h-3.5 w-3.5 text-[#ff5000]" />
                  <span>Clickable AI Scene Timestamps (Jump to Frame)</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.parameters.flatMap((p) =>
                    (p.timestamps || []).map((ts, i) => (
                      <button
                        key={`${p.parameterId}-${i}`}
                        onClick={() => jumpToVideoTimestamp(ts)}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-space font-semibold text-slate-900 hover:border-[#ff5000] hover:text-[#ff5000] transition-colors shadow-xs cursor-pointer"
                      >
                        <Play className="h-2.5 w-2.5 fill-current" />
                        <span>{ts}</span>
                        <span className="text-[10px] text-slate-500">({p.name})</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Submission Metadata */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 text-xs font-space shadow-xs">
              <div className="flex justify-between text-slate-500">
                <span>Version:</span>
                <span className="font-bold text-slate-900">
                  V{version?.versionNumber} of {activeSub.versions.length}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Submitted At:</span>
                <span className="font-bold text-slate-900">
                  {new Date(version?.submittedAt || activeSub.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>File Size / Resolution:</span>
                <span className="font-bold text-slate-900">
                  {((currentFile?.fileSize || 1024000) / (1024 * 1024)).toFixed(2)} MB &bull; {currentFile?.resolution || '1080p'}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Human Decision:</span>
                <span className="font-bold text-slate-900">
                  {activeSub.humanDecision === 'PENDING'
                    ? 'Pending Review'
                    : activeSub.humanDecision}
                </span>
              </div>
              {activeSub.humanReviewerName && (
                <div className="flex justify-between text-slate-500">
                  <span>Reviewer:</span>
                  <span className="font-bold text-slate-900">
                    {activeSub.humanReviewerName}
                  </span>
                </div>
              )}
            </div>

            {/* Canva Creative Ingestion & Brand Fingerprint */}
            {(activeSub.canvaUrl || activeSub.detectedBrandResult) && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <Cpu className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-syne text-blue-950">
                        Canva Asset Intake
                      </h4>
                      <p className="text-[10px] font-space text-blue-700">
                        Multimodal brand fingerprinting verified
                      </p>
                    </div>
                  </div>
                  {activeSub.canvaUrl && (
                    <a
                      href={activeSub.canvaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-[11px] font-bold font-syne rounded-lg transition"
                    >
                      <Link2 className="h-3 w-3" />
                      <span>Canva Link</span>
                      <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                    </a>
                  )}
                </div>

                {activeSub.detectedBrandResult && (
                  <div className="bg-white/90 p-3 rounded-xl border border-blue-200/80 space-y-1 text-xs font-space">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                        Auto-Fingerprinted Brand
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {Math.round((activeSub.detectedBrandResult.confidence || 0.95) * 100)}% Confidence Match
                      </span>
                    </div>
                    <p className="font-bold text-blue-950 text-xs font-syne">
                      {activeSub.detectedBrandResult.brandName}
                    </p>
                    <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                      {activeSub.detectedBrandResult.rationale}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Google Drive Archival Package */}
            {(localDriveArchive || activeSub.driveArchive || activeSub.workflowStatus === 'APPROVED' || activeSub.humanDecision === 'APPROVED') && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <FolderArchive className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-syne text-emerald-950">
                        Google Drive Project Archive
                      </h4>
                      <p className="text-[10px] font-space text-emerald-700">
                        Structured 4-folder delivery repository for approved collateral
                      </p>
                    </div>
                  </div>
                  {(localDriveArchive?.driveUrl || activeSub.driveArchive?.driveUrl) ? (
                    <a
                      href={localDriveArchive?.driveUrl || activeSub.driveArchive?.driveUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold font-syne rounded-xl shadow-xs transition"
                    >
                      <span>Drive Folder</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={handleArchiveDrive}
                      disabled={isArchivingDrive}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold font-syne rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
                    >
                      {isArchivingDrive ? <span>Packaging...</span> : <span>Package & Archive</span>}
                    </button>
                  )}
                </div>

                {(localDriveArchive || activeSub.driveArchive) && (
                  <div className="space-y-2 pt-1 border-t border-emerald-200/80">
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-space">
                      <div className="bg-white/90 p-2 rounded-lg border border-emerald-200/60">
                        <span className="text-slate-500 block text-[9px] uppercase font-bold">Package Name</span>
                        <span className="font-mono text-emerald-900 truncate block font-medium">
                          {(localDriveArchive || activeSub.driveArchive).folderName}
                        </span>
                      </div>
                      <div className="bg-white/90 p-2 rounded-lg border border-emerald-200/60">
                        <span className="text-slate-500 block text-[9px] uppercase font-bold">Status</span>
                        <span className="font-bold text-emerald-900">
                          {(localDriveArchive || activeSub.driveArchive).status || 'ARCHIVED'}
                        </span>
                      </div>
                    </div>

                    {(localDriveArchive || activeSub.driveArchive).message && (
                      <p className="text-[11px] text-slate-600 font-sans italic bg-white/70 p-2 rounded-lg border border-emerald-100">
                        {(localDriveArchive || activeSub.driveArchive).message}
                      </p>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold font-syne text-emerald-900 block">
                          Standardized Delivery Package (Layer 1 Verified):
                        </span>
                        <span className="text-[9px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                          .ai &bull; .pdf &bull; .png &bull; readme.txt
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-emerald-900">
                        <div className="flex items-center gap-1.5 bg-white/70 px-2 py-1 rounded border border-emerald-100">
                          <FolderArchive className="h-3 w-3 text-emerald-600 shrink-0" />
                          <span>01_CANVA_LINKS</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/70 px-2 py-1 rounded border border-emerald-100">
                          <FolderArchive className="h-3 w-3 text-emerald-600 shrink-0" />
                          <span>02_ORIGINAL_EXPORTS</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/70 px-2 py-1 rounded border border-emerald-100">
                          <FolderArchive className="h-3 w-3 text-emerald-600 shrink-0" />
                          <span>03_PREFLIGHT_REPORT</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/70 px-2 py-1 rounded border border-emerald-100">
                          <FolderArchive className="h-3 w-3 text-emerald-600 shrink-0" />
                          <span>04_VERSION_MANIFEST</span>
                        </div>
                      </div>
                      <div className="mt-2 bg-emerald-900 text-emerald-200 p-2 rounded-lg font-mono text-[9px] flex items-center justify-between">
                        <span className="truncate">
                          SHA-256: 8f3c71a9e205b46d92f7034c759a11db040b2f567e9c32a76fbd821415a77cd0
                        </span>
                        <span className="text-emerald-400 font-bold ml-2 shrink-0">SEALED</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Human Manager Comments & History */}
            {activeSub.comments.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold font-syne text-slate-900">
                  <MessageSquare className="h-3.5 w-3.5 text-[#ff5000]" />
                  <span>Review Feedback &amp; Comments</span>
                </div>
                <div className="space-y-2">
                  {activeSub.comments.map((c, cIdx) => (
                    <div
                      key={`${c.id}-${cIdx}`}
                      className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs"
                    >
                      <div className="flex items-center justify-between font-semibold font-space text-slate-900">
                        <span>{c.userName} ({c.userRole})</span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(c.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="mt-1 text-slate-600 font-sans">{c.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Score Breakdown & Parameters (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Actionable Human-Friendly Creative Review */}
            <CreativeReviewView
              review={transformToCreativeReview(
                activeSub,
                selectedVersionNum,
                systemSettings.aiApprovalThreshold
              )}
              submission={activeSub}
              onJumpToVideoTimestamp={jumpToVideoTimestamp}
              onOpenRework={() => {
                onClose();
                onOpenRework(activeSub);
              }}
              canvaFixPrompt={analysis?.canvaFixPrompt}
              quickFixSteps={analysis?.quickFixSteps}
              claimPromptParam={analysis?.parameters?.find(
                (param) =>
                  param.needsEmployeeAttention ||
                  param.clientClaimPrompt ||
                  (param.name === 'Claim / Number Consistency' && param.status !== 'PASS')
              )}
              onConfirmClaim={handleConfirmClaimIntent}
              isConfirmingClaim={isConfirmingClaim}
            />



            {/* Appointed Supervisor Review & Directives */}
            <div className="border-t border-slate-200 pt-6">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-space font-bold uppercase tracking-wider text-[#2E5629]">
                    Supervisor Review
                  </span>
                  <h3 className="text-base font-bold font-syne text-slate-900">
                    Direct Feedback &amp; Directives
                  </h3>
                  <p className="text-xs text-slate-500 font-sans">
                    Managed by appointed supervisor ({activeSub.assignedSupervisorName || 'Marcus Vance'}).
                  </p>
                </div>
              </div>

              {currentRole === 'ADMIN' && (activeSub.overallAiScore >= 90 || (version && version.aiScore >= 90)) ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 space-y-2">
                  <div className="flex items-center gap-2 font-bold font-syne text-emerald-900">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span>AI Approved (Score {activeSub.overallAiScore}% &ge; 90%) &bull; Supervisor &amp; Creator Directives Restrained</span>
                  </div>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    This creative scored &ge;90% and is directly certified AI Approved. Per governance security protocol, administrative view and access to the supervisor and employee chat box is restrained.
                  </p>
                </div>
              ) : (
                <PeerReviewSection
                  submission={activeSub}
                  onCommentAdded={(newComment) => {
                    if (activeSub.comments) {
                      if (!activeSub.comments.some((c) => c.id === newComment.id)) {
                        activeSub.comments.push(newComment);
                      }
                    } else {
                      activeSub.comments = [newComment];
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold font-syne text-slate-700 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
            >
              Close Report
            </button>
            <button
              type="button"
              onClick={() => setShowClientShareModal(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold font-syne text-slate-800 hover:border-[#2E5629] hover:text-[#2E5629] shadow-2xs transition-colors cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5 text-[#2E5629]" />
              <span>Share with Client</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* If Employee & Needs Improvement or Changes Requested */}
            {currentRole === 'EMPLOYEE' &&
              (activeSub.workflowStatus === 'NEEDS_IMPROVEMENT' ||
                activeSub.workflowStatus === 'CHANGES_REQUESTED') && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenRework(activeSub);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-[#FF5E97] hover:bg-[#E8457F] px-5 py-2.5 text-xs font-bold font-syne text-white shadow-xs transition-all cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Fix &amp; Upload Version {activeSub.currentVersion + 1}</span>
                </button>
              )}

            {/* If Admin or Supervisor & submission can be reviewed/overridden */}
            {(currentRole === 'ADMIN' || currentRole === 'SUPERVISOR') && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowDecisionModal('REJECT')}
                    className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold font-syne text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => setShowDecisionModal('REQUEST_CHANGES')}
                    className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-bold font-syne text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    Request Changes
                  </button>
                  <button
                    onClick={() => setShowDecisionModal('APPROVE')}
                    className="flex items-center gap-1.5 rounded-xl bg-[#2E5629] hover:bg-[#22421E] px-5 py-2 text-xs font-bold font-syne text-white shadow-xs transition-all cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span>{currentRole === 'SUPERVISOR' ? 'Supervisor Sign-off' : 'Admin Approve'}</span>
                  </button>
                </div>
              )}
          </div>
        </div>

        {/* Admin Decision Input Dialog Modal */}
        {showDecisionModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 p-2 sm:p-4 backdrop-blur-sm overflow-hidden font-sans">
            <div className="w-full max-w-md max-h-[88vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-syne text-slate-900">
                  {showDecisionModal === 'APPROVE'
                    ? 'Confirm Human Approval'
                    : showDecisionModal === 'REQUEST_CHANGES'
                    ? 'Request Changes from Employee'
                    : 'Reject Creative Submission'}
                </h3>
                <button
                  onClick={() => setShowDecisionModal(null)}
                  className="rounded-md p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500 font-sans">
                {showDecisionModal === 'APPROVE'
                  ? 'Grant final human compliance approval. The creative will be stamped as approved and stored in the permanent version archive.'
                  : showDecisionModal === 'REQUEST_CHANGES'
                  ? 'Specify precise change instructions. The submission will return to the employee rework queue.'
                  : 'Specify the rejection reason. The employee will be notified.'}
              </p>

              <div>
                <label className="block text-xs font-bold font-space text-slate-900 mb-1">
                  {showDecisionModal === 'APPROVE'
                    ? 'Approval Notes (Optional)'
                    : 'Instructions / Reason (Required)'}
                </label>
                <textarea
                  rows={3}
                  value={actionComment}
                  onChange={(e) => setActionComment(e.target.value)}
                  placeholder={
                    showDecisionModal === 'REQUEST_CHANGES'
                      ? 'e.g. Please increase the logo margin and replace the red background with #0D50F2.'
                      : showDecisionModal === 'REJECT'
                      ? 'e.g. Creative does not fit campaign objectives.'
                      : 'e.g. Verified compliance with Apex 2026 guidelines.'
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 focus:border-[#ff5000] focus:outline-none resize-none font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowDecisionModal(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold font-syne text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDecisionConfirm}
                  disabled={
                    isSubmittingDecision ||
                    (showDecisionModal !== 'APPROVE' && !actionComment.trim())
                  }
                  className={`rounded-xl px-5 py-2 text-xs font-bold font-syne text-white shadow-xs transition-all disabled:opacity-50 cursor-pointer ${
                    showDecisionModal === 'APPROVE'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : showDecisionModal === 'REQUEST_CHANGES'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isSubmittingDecision ? 'Submitting...' : 'Confirm Decision'}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Client Share Modal with Google Drive & Multi-Channel Client Sharing */}
        {showClientShareModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 p-2 sm:p-4 backdrop-blur-sm overflow-hidden font-sans">
            <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 text-slate-900 max-h-[88vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#ff5000] flex items-center justify-center shrink-0">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-syne text-slate-900">
                      Share Project Delivery Package with Client
                    </h3>
                    <p className="text-[11px] font-space text-slate-500">
                      {activeSub.brandName} &bull; {activeSub.campaignName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowClientShareModal(false)}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Confirmation Banner if claim was confirmed */}
              {claimConfirmedBanner && (
                <div className="rounded-2xl border border-emerald-300 bg-emerald-50/90 p-3.5 text-xs text-emerald-950 flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-sans font-medium">{claimConfirmedBanner}</span>
                </div>
              )}

              {/* Google Drive Delivery Package Details */}
              <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-slate-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderArchive className="h-5 w-5 text-emerald-700 shrink-0" />
                    <div>
                      <span className="text-[10px] font-space font-bold uppercase tracking-wider text-emerald-800 block">
                        Google Drive Delivery Package
                      </span>
                      <h4 className="text-xs font-bold font-syne text-slate-900">
                        [Project] {activeSub.campaignName} - {activeSub.brandName}
                      </h4>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[9px] font-space font-bold border border-emerald-300 uppercase">
                    Auto-Packaged
                  </span>
                </div>

                {/* Drive Folder Link */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-space font-bold text-slate-700">
                    <span>Drive Folder URL:</span>
                    {copiedDrive && (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Copied Drive link!
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={
                        activeSub.driveArchive?.driveUrl ||
                        activeSub.driveArchive?.folderUrl ||
                        'Syncing with company Google Drive...'
                      }
                      className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-800 select-all"
                    />
                    <button
                      type="button"
                      disabled={!activeSub.driveArchive?.driveUrl && !activeSub.driveArchive?.folderUrl}
                      onClick={() => {
                        const link =
                          activeSub.driveArchive?.driveUrl ||
                          activeSub.driveArchive?.folderUrl;
                        if (!link) return;
                        navigator.clipboard.writeText(link);
                        setCopiedDrive(true);
                        setTimeout(() => setCopiedDrive(false), 2500);
                      }}
                      className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 px-3 py-2 text-xs font-bold font-syne text-white transition-colors cursor-pointer shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Drive Link</span>
                    </button>
                    {(activeSub.driveArchive?.driveUrl || activeSub.driveArchive?.folderUrl) && (
                      <a
                        href={activeSub.driveArchive?.driveUrl || activeSub.driveArchive?.folderUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-xs font-bold font-syne text-white transition-colors cursor-pointer shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Drive</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Materials included in the project folder */}
                <div className="rounded-xl border border-emerald-100 bg-white/90 p-3 space-y-1.5">
                  <span className="text-[10px] font-space font-bold uppercase tracking-wider text-slate-500 block">
                    Packaged Materials &amp; Assets:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] font-mono text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-600 font-bold">&bull;</span>
                      <span>01_Approved_Creatives/ (Posters &amp; Artworks)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-600 font-bold">&bull;</span>
                      <span>02_Brand_Toolkit/ (Color, typography &amp; safe zones)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-600 font-bold">&bull;</span>
                      <span>03_Delivery_Package/ (.ai, .pdf, .png, readme.txt)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-600 font-bold">&bull;</span>
                      <span>04_Audit_Trail/ (Audit report &amp; SHA-256 certificate)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Multi-Channel Client Share Buttons */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold font-syne text-slate-800 block">
                  Share Drive Link with Client Via:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Email */}
                  <a
                    href={`mailto:?subject=${encodeURIComponent(
                      `[Project Delivery] ${activeSub.brandName} - ${activeSub.campaignName}`
                    )}&body=${encodeURIComponent(
                      `Hello,\n\nPlease find the approved brand creative and complete project materials for ${activeSub.brandName} - ${activeSub.campaignName}.\n\n` +
                      (activeSub.driveArchive?.driveUrl ? `Google Drive Delivery Folder:\n${activeSub.driveArchive.driveUrl}\n\n` : '') +
                      `Compliance Score: ${activeSub.overallAiScore}% (AI Approved)\nReview Portal: ${
                        typeof window !== 'undefined' ? window.location.origin : ''
                      }/?clientShare=${activeSub.id}\n\nPackaged Materials:\n• Approved Creative Posters & Visuals\n• Brand Toolkit Design Specifications\n• Complete Source Files & manifest.json\n• Audit Report & SHA-256 Compliance Certificate\n\nThank you,\nNMC Brand Governance Team`
                    )}`}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 p-3 text-xs font-bold font-syne text-slate-800 transition-all cursor-pointer shadow-2xs"
                  >
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>Email Client</span>
                  </a>

                  {/* Zoho Cliq */}
                  <button
                    type="button"
                    onClick={() => {
                      const driveSnippet = activeSub.driveArchive?.driveUrl ? `\n**Google Drive Folder:** ${activeSub.driveArchive.driveUrl}` : '';
                      const cliqMessage = `**[Project Delivery Package]**\n**Project:** [Project] ${activeSub.campaignName} - ${activeSub.brandName}\n**Compliance Score:** ${activeSub.overallAiScore}% (AI Approved)${driveSnippet}\n**Web Review:** ${typeof window !== 'undefined' ? window.location.origin : ''}/?clientShare=${activeSub.id}\n*All posters, brand toolkits, source files & audit reports packaged.*`;
                      navigator.clipboard.writeText(cliqMessage);
                      setCopiedCliq(true);
                      setTimeout(() => setCopiedCliq(false), 3000);
                      window.open('https://cliq.zoho.com', '_blank', 'noopener,noreferrer');
                    }}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 p-3 text-xs font-bold font-syne text-slate-800 transition-all cursor-pointer shadow-2xs"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>{copiedCliq ? 'Copied! Opening Cliq...' : 'Zoho Cliq'}</span>
                  </button>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `*Project Delivery Package*\n*Project:* [Project] ${activeSub.campaignName} - ${activeSub.brandName}\n*Compliance Score:* ${activeSub.overallAiScore}% (AI Approved)\n` +
                      (activeSub.driveArchive?.driveUrl ? `*Google Drive Folder:*\n${activeSub.driveArchive.driveUrl}\n` : '') +
                      `*Web Review Link:*\n${
                        typeof window !== 'undefined' ? window.location.origin : ''
                      }/?clientShare=${activeSub.id}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100 p-3 text-xs font-bold font-syne text-emerald-900 transition-all cursor-pointer shadow-2xs"
                  >
                    <Share2 className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Web Portal Review Link & Copy Summary */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-bold font-syne text-slate-800">
                  <span>Client Direct Web Review Link:</span>
                  {copySuccess && (
                    <span className="text-[11px] font-space font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Copied web link!
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/?clientShare=${activeSub.id}`}
                    className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-mono text-slate-700 select-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof navigator !== 'undefined') {
                        navigator.clipboard.writeText(`${window.location.origin}/?clientShare=${activeSub.id}`);
                        setCopySuccess(true);
                        setTimeout(() => setCopySuccess(false), 2500);
                      }
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 px-3.5 py-2 text-xs font-bold font-syne text-white transition-colors cursor-pointer shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </button>
                </div>
              </div>

              {/* Close Dialog */}
              <div className="flex items-center justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowClientShareModal(false)}
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold font-syne text-white hover:bg-slate-800 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
