import React, { useState, useRef } from 'react';
import { Submission, SubmissionVersion } from '../types';
import { useAuth } from '../context/AuthContext';
import { PeerReviewSection } from './PeerReviewSection';
import { CanvaPreviewCard } from './CanvaPreviewCard';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Play,
  Check,
  RotateCcw,
  XCircle,
  MessageSquare,
  Building2,
  FileVideo,
  FileImage,
  Shield,
  Send,
} from 'lucide-react';

interface ManagerReviewScreenProps {
  submission: Submission;
  onBack: () => void;
  onManagerReview: (
    submissionId: string,
    decision: 'APPROVED' | 'REQUEST_CHANGES' | 'REJECTED',
    comment?: string
  ) => Promise<void>;
}

export const ManagerReviewScreen: React.FC<ManagerReviewScreenProps> = ({
  submission,
  onBack,
  onManagerReview,
}) => {
  const { currentUser, systemSettings } = useAuth();
  const [selectedVersionNum, setSelectedVersionNum] = useState<number>(submission.currentVersion);
  const [activeTab, setActiveTab] = useState<'parameters' | 'comments' | 'peer' | 'history'>('parameters');
  const [commentText, setCommentText] = useState('');
  const [decisionModal, setDecisionModal] = useState<
    'APPROVED' | 'REQUEST_CHANGES' | 'REJECTED' | null
  >(null);
  const [decisionReason, setDecisionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  const currentVersion =
    submission.versions.find((v) => v.versionNumber === selectedVersionNum) ||
    submission.versions[submission.versions.length - 1];

  const analysis = currentVersion?.analysisResult;
  const currentFile = currentVersion?.files[0];
  const isVideo = currentFile?.fileType === 'video';

  const jumpToTime = (timestampStr: string) => {
    if (!videoPlayerRef.current) return;
    const parts = timestampStr.split(':');
    if (parts.length === 2) {
      const sec = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
      videoPlayerRef.current.currentTime = sec;
      videoPlayerRef.current.play().catch(() => {});
    }
  };

  const handleExecuteDecision = async () => {
    if (!decisionModal) return;
    setIsSubmitting(true);
    try {
      await onManagerReview(submission.id, decisionModal, decisionReason);
      setDecisionModal(null);
      setDecisionReason('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-800 bg-slate-900 text-white p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 hover:bg-[#ff5000] hover:text-white transition-colors cursor-pointer text-slate-300"
            title="Back to Queue"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#ff5000]">
                [ MANAGER AUDIT ]
              </span>
              <span className="text-white/20">&bull;</span>
              <h1 className="text-lg font-bold font-syne text-white">{submission.campaignName}</h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-space font-bold uppercase tracking-wider ${
                  submission.workflowStatus === 'APPROVED'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : submission.workflowStatus === 'AWAITING_SUPERVISOR_REVIEW' ||
                      (submission.workflowStatus as string) === 'AWAITING_MANAGER_REVIEW'
                    ? 'bg-[#ff5000]/20 text-[#ff5000] border border-[#ff5000]/40'
                    : submission.workflowStatus === 'CHANGES_REQUESTED'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {submission.workflowStatus.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-space mt-0.5">
              Brand: <span className="font-semibold text-white">{submission.brandName}</span> &bull;
              Created by <span className="font-semibold text-white">{submission.userName}</span>{' '}
              ({submission.userEmail})
            </p>
          </div>
        </div>

        {/* Action Decision Buttons */}
        <div className="flex items-center gap-2">
          {/* Version Switcher */}
          <div className="flex items-center rounded-xl border border-slate-700 bg-slate-800 p-1 text-xs font-space font-semibold mr-2">
            {submission.versions.map((v) => (
              <button
                key={v.versionNumber}
                onClick={() => setSelectedVersionNum(v.versionNumber)}
                className={`rounded-lg px-3 py-1 transition-all cursor-pointer ${
                  selectedVersionNum === v.versionNumber
                    ? 'bg-[#ff5000] text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                V{v.versionNumber}
              </button>
            ))}
          </div>

          <button
            onClick={() => setDecisionModal('REJECTED')}
            className="rounded-xl border border-red-800 bg-red-950 px-3.5 py-2 text-xs font-bold font-syne text-red-300 hover:bg-red-900 transition-colors shadow-xs cursor-pointer"
          >
            Reject
          </button>

          <button
            onClick={() => setDecisionModal('REQUEST_CHANGES')}
            className="rounded-xl border border-amber-800 bg-amber-950 px-4 py-2 text-xs font-bold font-syne text-amber-300 hover:bg-amber-900 transition-colors shadow-xs cursor-pointer"
          >
            Request Changes
          </button>

          <button
            onClick={() => setDecisionModal('APPROVED')}
            className="flex items-center gap-1.5 rounded-xl bg-[#ff5000] hover:bg-[#e04700] px-5 py-2 text-xs font-bold font-syne text-white shadow-xs transition-all cursor-pointer"
          >
            <Check className="h-4 w-4" />
            <span>Approve Submission</span>
          </button>
        </div>
      </div>

      {/* Split Screen Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-slate-900">
        {/* Left Column: Media Player / Scrubber / Scene Evidence (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-3 shadow-inner overflow-hidden">
            {isVideo ? (
              <div className="space-y-2">
                <video
                  ref={videoPlayerRef}
                  src={currentFile?.fileUrl}
                  controls
                  className="w-full max-h-[420px] rounded-2xl bg-black"
                />
                <div className="flex items-center justify-between px-3 py-1 text-xs font-space text-slate-400">
                  <span>{currentFile?.fileName}</span>
                  <span>{currentFile?.durationSec || 30}s &bull; 1080p &bull; H.264</span>
                </div>
              </div>
            ) : submission.canvaUrl && (!currentFile?.fileUrl || currentFile.fileUrl === '' || currentFile.fileUrl.startsWith('data:application/x-canva') || submission.canvaPreviewState === 'LINK_ONLY') ? (
              <div className="p-4 bg-slate-900 rounded-2xl">
                <CanvaPreviewCard
                  canvaUrl={submission.canvaUrl}
                  designId={submission.canvaDesignId}
                  previewState="LINK_ONLY"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center max-h-[420px] overflow-hidden rounded-2xl bg-black/40">
                <img
                  src={currentFile?.fileUrl}
                  alt={currentFile?.fileName}
                  className="max-h-[420px] w-full object-contain rounded-xl"
                />
              </div>
            )}
          </div>

          {/* Temporal Frame Scrubber & Clickable Timestamps */}
          {isVideo && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold font-syne text-slate-900">
                  <Clock className="h-4 w-4 text-[#ff5000]" />
                  <span>Temporal Timeline &amp; Keyframe Analysis</span>
                </div>
                <span className="text-[11px] font-space text-slate-500">
                  Click any marker to seek video player
                </span>
              </div>

              {/* Timestamp Chips */}
              <div className="flex flex-wrap gap-2">
                {[
                  { time: '00:02', label: 'Opening Scene & Background' },
                  { time: '00:08', label: 'Product Hero Closeup' },
                  { time: '00:15', label: 'Lifestyle Action Context' },
                  { time: '00:22', label: 'Feature Highlights' },
                  { time: '00:28', label: 'Final Logo & Call to Action' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => jumpToTime(item.time)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-space font-semibold text-slate-900 hover:border-[#ff5000] hover:text-[#ff5000] transition-colors shadow-xs cursor-pointer"
                  >
                    <Play className="h-3 w-3 fill-current text-[#ff5000]" />
                    <span>{item.time}</span>
                    <span className="text-[10px] text-slate-500">({item.label})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Asset & Version Details Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs text-xs space-y-2 font-space">
            <h3 className="font-bold font-syne text-slate-900 text-sm mb-2">Creative Version Metadata</h3>
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div>
                <span className="text-slate-400">Version:</span> V{currentVersion?.versionNumber}
              </div>
              <div>
                <span className="text-slate-400">Media Type:</span>{' '}
                {submission.mediaType.toUpperCase()}
              </div>
              <div>
                <span className="text-slate-400">Resolution:</span>{' '}
                {currentFile?.resolution || '1920x1080'}
              </div>
              <div>
                <span className="text-slate-400">File Size:</span>{' '}
                {((currentFile?.fileSize || 1500000) / (1024 * 1024)).toFixed(2)} MB
              </div>
            </div>

            {currentVersion?.changelog && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block mb-0.5">Version Changelog / Notes:</span>
                <p className="text-slate-800 font-sans font-medium">{currentVersion.changelog}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Score Breakdown & Parameter Citations (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Top Score Summary Banner */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 text-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#ff5000]">
                  Multimodal Compliance Score
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-5xl font-black font-syne text-white">
                    {currentVersion?.aiScore || submission.overallAiScore}%
                  </span>
                  <span className="text-xs font-space font-semibold text-slate-400">
                    (Threshold: {systemSettings.aiApprovalThreshold}%)
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-space font-bold uppercase tracking-wider text-slate-400 block">
                  AI Confidence
                </span>
                <span className="text-base font-black font-space text-white">
                  {Math.round((currentVersion?.aiConfidence || submission.overallAiConfidence) * 100)}%
                </span>
                <span className="text-[10px] text-slate-400 font-space block mt-0.5">Gemini Multimodal</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400 leading-relaxed font-sans">
              {analysis?.executiveSummary}
            </p>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex border-b border-slate-200 gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('parameters')}
              className={`pb-2.5 text-xs font-bold font-syne transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'parameters'
                  ? 'border-b-2 border-[#ff5000] text-[#ff5000]'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Parameter Breakdown ({analysis?.parameters.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('peer')}
              className={`pb-2.5 text-xs font-bold font-syne transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'peer'
                  ? 'border-b-2 border-[#ff5000] text-[#ff5000]'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Peer Quality Reviews ({submission.comments.filter((c) => c.type === 'PEER_REVIEW' || c.peerTag).length})
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`pb-2.5 text-xs font-bold font-syne transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'comments'
                  ? 'border-b-2 border-[#ff5000] text-[#ff5000]'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Review Discussion ({submission.comments.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-2.5 text-xs font-bold font-syne transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'history'
                  ? 'border-b-2 border-[#ff5000] text-[#ff5000]'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Version Progression ({submission.versions.length})
            </button>
          </div>

          {/* TAB 1: Parameters */}
          {activeTab === 'parameters' && (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {analysis?.parameters.map((param) => {
                const isPass = param.status === 'PASS';
                const isUncertain = param.status === 'UNCERTAIN';
                return (
                  <div
                    key={param.parameterId}
                    className="rounded-2xl border border-slate-200 bg-white p-4 transition-colors shadow-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {isPass ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        ) : isUncertain ? (
                          <HelpCircle className="h-4 w-4 text-amber-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                        )}
                        <span className="text-xs font-bold font-syne text-slate-900">{param.name}</span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-space font-bold text-slate-600 border border-slate-200">
                          {param.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black font-space text-slate-900">{param.score}%</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-space font-bold uppercase tracking-wider ${
                            isPass
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isUncertain
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {param.status}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2.5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          param.score >= 80
                            ? 'bg-emerald-600'
                            : param.score >= 60
                            ? 'bg-amber-600'
                            : 'bg-red-600'
                        }`}
                        style={{ width: `${param.score}%` }}
                      />
                    </div>

                    {/* Meta Guideline Rule Badge */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] font-space text-slate-500">
                      <span className="font-bold text-slate-700">Meta Guideline:</span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-700 border border-slate-200 font-medium">
                        {param.metaGuideline || `${param.name} Compliance Rule (§${param.category})`}
                      </span>
                    </div>

                    {/* Explicit Reason & Evaluation Standing */}
                    {!isPass ? (
                      <div className="mt-2.5 rounded-xl border border-red-200 bg-red-50/80 p-3 text-xs space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold font-syne text-red-900">
                          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                          <span>Why It Failed Meta Guideline (Root Cause):</span>
                        </div>
                        <p className="text-red-800 font-sans leading-relaxed text-[11px]">
                          {param.reason || (param.evidence && param.evidence[0]) || 'Parameter score falls below required compliance threshold.'}
                        </p>
                        {param.remedy && (
                          <div className="mt-1 pt-1.5 border-t border-red-200/60 text-[11px] text-red-800 flex items-start gap-1">
                            <span className="font-bold font-space text-red-950 shrink-0">Remedy Action:</span>
                            <span className="font-medium">{param.remedy}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-2 rounded-xl border border-emerald-100 bg-emerald-50/50 p-2.5 text-[11px] space-y-1">
                        <div className="flex items-center gap-1 font-bold font-syne text-emerald-900">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>Meta Guideline Standing: True / Verified Compliant</span>
                        </div>
                        <p className="text-emerald-800 font-sans">
                          {param.reason || param.evidence?.[0] || 'Fully stands true to brand design specifications and safe-zone tolerances.'}
                        </p>
                      </div>
                    )}

                    {/* Evidence Citations */}
                    <div className="mt-2.5 space-y-1 text-xs text-slate-600 font-sans">
                      <span className="text-[10px] font-bold uppercase tracking-wider font-space text-slate-400 block">
                        Visual Observations
                      </span>
                      {param.evidence.map((ev, i) => (
                        <p key={i} className="text-[11px] flex items-start gap-1.5">
                          <span className="text-[#ff5000]">&bull;</span>
                          <span>{ev}</span>
                        </p>
                      ))}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] font-space text-slate-400 border-t border-slate-100 pt-1.5">
                      <span>Weight: {param.weight}%</span>
                      <span>Severity: {param.severity}</span>
                      <span>Confidence: {Math.round(param.confidence * 100)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: Peer Quality Reviews */}
          {activeTab === 'peer' && (
            <div className="space-y-4">
              <PeerReviewSection
                submission={submission}
                onCommentAdded={(newComment) => {
                  if (submission.comments) {
                    if (!submission.comments.some((c) => c.id === newComment.id)) {
                      submission.comments.push(newComment);
                    }
                  } else {
                    submission.comments = [newComment];
                  }
                }}
              />
            </div>
          )}

          {/* TAB 2: Comments & Discussion */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {submission.comments.length === 0 ? (
                  <p className="text-xs text-slate-500 font-space text-center py-6">
                    No comments or feedback yet.
                  </p>
                ) : (
                  submission.comments.map((c, cIdx) => (
                    <div key={`${c.id}-${cIdx}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs">
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
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Version Progression */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {submission.versions.map((v) => (
                <div
                  key={v.versionNumber}
                  onClick={() => setSelectedVersionNum(v.versionNumber)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    selectedVersionNum === v.versionNumber
                      ? 'border-[#ff5000] bg-slate-900 text-white'
                      : 'border-slate-200 bg-white hover:bg-slate-50 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-[#ff5000] px-2 py-0.5 text-xs font-bold font-space text-white">
                        V{v.versionNumber}
                      </span>
                      <span className={`text-xs font-bold font-syne ${selectedVersionNum === v.versionNumber ? 'text-white' : 'text-slate-900'}`}>
                        AI Score: {v.aiScore}%
                      </span>
                    </div>
                    <span className="text-[10px] font-space text-slate-400">
                      {new Date(v.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`mt-1 text-xs font-sans ${selectedVersionNum === v.versionNumber ? 'text-slate-400' : 'text-slate-600'}`}>{v.changelog}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Decision Confirmation Modal Dialog */}
      {decisionModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 p-2 sm:p-4 backdrop-blur-sm overflow-hidden font-sans">
          <div className="w-full max-w-md max-h-[88vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 text-slate-900">
            <h3 className="text-sm font-bold font-syne text-slate-900">
              {decisionModal === 'APPROVED'
                ? 'Confirm Manager Approval'
                : decisionModal === 'REQUEST_CHANGES'
                ? 'Request Changes from Creator'
                : 'Reject Submission'}
            </h3>

            <p className="text-xs text-slate-500 font-sans">
              {decisionModal === 'APPROVED'
                ? 'Granting approval marks this asset as compliant for deployment. An immutable audit log entry will record your approval.'
                : decisionModal === 'REQUEST_CHANGES'
                ? 'Specify instructions on what the creator must fix before this asset can be approved.'
                : 'Specify the non-compliance reason for rejecting this submission.'}
            </p>

            <div>
              <label className="block text-xs font-bold font-space text-slate-900 mb-1">
                {decisionModal === 'APPROVED' ? 'Approval Note (Optional)' : 'Instructions (Required)'}
              </label>
              <textarea
                rows={3}
                value={decisionReason}
                onChange={(e) => setDecisionReason(e.target.value)}
                placeholder={
                  decisionModal === 'REQUEST_CHANGES'
                    ? 'e.g. Please replace background color and reposition the brand logo.'
                    : decisionModal === 'REJECTED'
                    ? 'e.g. Serious brand violation.'
                    : 'e.g. Approved for release.'
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 focus:border-[#ff5000] focus:outline-none resize-none font-sans"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDecisionModal(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold font-syne text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteDecision}
                disabled={isSubmitting || (decisionModal !== 'APPROVED' && !decisionReason.trim())}
                className={`rounded-xl px-5 py-2 text-xs font-bold font-syne text-white shadow-xs transition-all disabled:opacity-50 cursor-pointer ${
                  decisionModal === 'APPROVED'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : decisionModal === 'REQUEST_CHANGES'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isSubmitting ? 'Saving Decision...' : 'Confirm Decision'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
