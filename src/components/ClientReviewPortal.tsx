import React, { useState, useEffect } from 'react';
import { Submission, BrandParameter } from '../types';
import { api } from '../api';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  Printer,
  ExternalLink,
  MessageSquare,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  HelpCircle,
  Hash,
  Send,
  Loader2,
} from 'lucide-react';

interface ClientReviewPortalProps {
  submissionId: string;
  onExit?: () => void;
}

export const ClientReviewPortal: React.FC<ClientReviewPortalProps> = ({
  submissionId,
  onExit,
}) => {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Client Feedback Form State
  const [isDecisionOpen, setIsDecisionOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<'APPROVED' | 'CHANGES_REQUESTED'>('APPROVED');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientComment, setClientComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/submissions/${submissionId}`);
        if (!res.ok) {
          throw new Error('Creative submission not found or link has expired.');
        }
        const data = await res.json();
        setSubmission(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load creative review details.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [submissionId]);

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      alert('Please enter your name.');
      return;
    }

    setSubmittingFeedback(true);
    try {
      const res = await api.submitClientFeedback(submissionId, {
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim() || undefined,
        decision: decisionType,
        comment: clientComment.trim() || undefined,
      });

      if (res.success && res.submission) {
        setSubmission(res.submission);
        setFeedbackSuccess(true);
        setTimeout(() => {
          setIsDecisionOpen(false);
          setFeedbackSuccess(false);
        }, 2000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit response.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#ff5000] animate-spin" />
          <p className="text-xs font-space tracking-widest uppercase text-slate-400">
            Loading Official Creative Review Package...
          </p>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4 font-sans">
        <div className="max-w-md w-full rounded-3xl border border-slate-800 bg-slate-950 p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold font-syne text-white">Review Unavailable</h2>
          <p className="text-xs text-slate-400 font-sans">{error || 'This creative review link is invalid or no longer active.'}</p>
          {onExit && (
            <button
              onClick={onExit}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold font-syne text-white transition-colors cursor-pointer"
            >
              Back to Main Workspace
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentVersion =
    submission.versions?.find((v) => v.versionNumber === submission.currentVersion) ||
    submission.versions?.[submission.versions.length - 1];

  const analysis = currentVersion?.analysisResult;
  const currentFile = currentVersion?.files?.[0];
  const isVideo = submission.mediaType === 'video' || currentFile?.fileType === 'video';

  const previewImg =
    currentFile?.thumbnailUrl ||
    currentFile?.fileUrl ||
    (submission as any).mediaUrl ||
    (submission as any).thumbnailUrl ||
    '';

  const score = currentVersion?.aiScore ?? submission.overallAiScore ?? 0;
  const isPassed = score >= 80;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-[#ff5000] selection:text-white">
      {/* Top Client Portal Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ff5000] text-white shadow-md">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-syne tracking-wide text-white">
                  Z BRAND GOVERNANCE
                </span>
                <span className="rounded-full bg-emerald-950 border border-emerald-800 px-2 py-0.5 text-[9px] font-space font-bold uppercase tracking-wider text-emerald-400">
                  Official Client Portal
                </span>
              </div>
              <p className="text-[11px] font-space text-slate-400">
                {submission.brandName} &bull; {submission.campaignName} (V{submission.currentVersion})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 text-xs font-bold font-syne text-white transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            {previewImg && (
              <a
                href={previewImg}
                download={`${submission.campaignName}_v${submission.currentVersion}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 text-xs font-bold font-syne text-white transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download Creative</span>
              </a>
            )}

            {onExit && (
              <button
                type="button"
                onClick={onExit}
                className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold font-syne text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Back
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-8 py-8 space-y-8">
        {/* Banner with Client Status */}
        {submission.clientApprovalStatus === 'CLIENT_APPROVED' && (
          <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-950/60 p-4 text-xs text-emerald-200 flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold font-syne text-emerald-300 block text-sm">
                  Creative Approved by Client
                </span>
                <span className="text-[11px] font-space text-emerald-400">
                  {submission.clientFeedback?.[0]?.clientName || 'Client'} approved this asset on{' '}
                  {submission.clientFeedback?.[0]?.receivedAt
                    ? new Date(submission.clientFeedback[0].receivedAt).toLocaleString()
                    : 'record'}
                  .
                </span>
              </div>
            </div>
            <span className="rounded-full bg-emerald-900 border border-emerald-600 px-3 py-1 text-[10px] font-space font-bold uppercase text-emerald-200">
              Verified Approval
            </span>
          </div>
        )}

        {/* 2-Column Responsive Layout: Left Media & Verification, Right Audit Findings & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Media Stage (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-3 shadow-2xl overflow-hidden">
              {isVideo ? (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black">
                  <video
                    src={previewImg}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="relative w-full rounded-2xl overflow-hidden bg-black/60 flex items-center justify-center p-2 min-h-[400px]">
                  {previewImg ? (
                    <img
                      src={previewImg}
                      alt={submission.campaignName}
                      className="max-h-[620px] w-auto rounded-xl object-contain shadow-2xl"
                    />
                  ) : (
                    <div className="p-12 text-center text-slate-500 font-space text-xs">
                      No visual asset preview available
                    </div>
                  )}
                </div>
              )}

              {/* Metadata Footer bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 text-xs text-slate-400 font-space border-t border-slate-800/60 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{submission.campaignName}</span>
                  <span className="text-slate-600">&bull;</span>
                  <span>Version {submission.currentVersion}</span>
                </div>
                {currentFile?.assetHash && (
                  <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                    <Hash className="w-3 h-3 text-slate-400" />
                    <span>SHA-256: {currentFile.assetHash.substring(0, 16)}...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Client Action Bar */}
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-syne text-white">
                    Client Decision &amp; Feedback
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Review the creative asset and brand audit findings below, then record your official approval or revision requests.
                  </p>
                </div>
              </div>

              {!isDecisionOpen ? (
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDecisionType('APPROVED');
                      setIsDecisionOpen(true);
                    }}
                    className="flex-1 min-w-[180px] flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 p-3 text-xs font-bold font-syne text-white shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Creative Asset</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDecisionType('CHANGES_REQUESTED');
                      setIsDecisionOpen(true);
                    }}
                    className="flex-1 min-w-[180px] flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 hover:bg-slate-800 p-3 text-xs font-bold font-syne text-slate-200 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    <span>Request Changes / Notes</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleClientSubmit} className="space-y-4 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold font-syne uppercase tracking-wider ${
                        decisionType === 'APPROVED' ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {decisionType === 'APPROVED' ? 'Approve Creative Asset' : 'Request Changes & Provide Feedback'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsDecisionOpen(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  {feedbackSuccess && (
                    <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Response recorded successfully! Thank you.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold font-syne uppercase tracking-wider text-slate-300 block mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Marketing Director"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#ff5000]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold font-syne uppercase tracking-wider text-slate-300 block mb-1">
                        Your Email (Optional)
                      </label>
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="e.g. director@client.com"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#ff5000]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold font-syne uppercase tracking-wider text-slate-300 block mb-1">
                      {decisionType === 'APPROVED' ? 'Approval Notes (Optional)' : 'Change Directives & Feedback *'}
                    </label>
                    <textarea
                      rows={3}
                      required={decisionType === 'CHANGES_REQUESTED'}
                      value={clientComment}
                      onChange={(e) => setClientComment(e.target.value)}
                      placeholder={
                        decisionType === 'APPROVED'
                          ? 'e.g. Looks great, approved for scheduled publication.'
                          : 'e.g. Please update the admission date to May 15th and make helpline number larger.'
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#ff5000]"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="submit"
                      disabled={submittingFeedback}
                      className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold font-syne text-white transition-all cursor-pointer ${
                        decisionType === 'APPROVED'
                          ? 'bg-emerald-600 hover:bg-emerald-500'
                          : 'bg-[#ff5000] hover:bg-[#e04700]'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submittingFeedback ? 'Submitting...' : 'Confirm & Submit to Team'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: AI Compliance Audit & Findings (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Score & Certificate Card */}
            <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#ff5000] block">
                    [ AI COMPLIANCE AUDIT ]
                  </span>
                  <h2 className="text-lg font-bold font-syne text-white">
                    Brand Fidelity Certification
                  </h2>
                </div>
                <div
                  className={`flex flex-col items-center justify-center rounded-2xl px-4 py-2 border ${
                    isPassed
                      ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300'
                      : 'border-amber-500/40 bg-amber-950/60 text-amber-300'
                  }`}
                >
                  <span className="text-2xl font-bold font-syne">{score}%</span>
                  <span className="text-[9px] font-space font-bold uppercase tracking-wider">
                    {isPassed ? 'CLEARED' : 'NEEDS REVIEW'}
                  </span>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-2">
                <span className="text-[10px] font-space font-bold uppercase tracking-wider text-slate-400 block">
                  Executive Summary
                </span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {analysis?.executiveSummary ||
                    'Creative asset has undergone multimodal vision auditing against official enterprise brand guidelines, measuring safe zone margins, crest fidelity, typographic balance, and regulatory disclosures.'}
                </p>
              </div>

              {/* Key Highlights */}
              <div className="space-y-2">
                <span className="text-[10px] font-space font-bold uppercase tracking-wider text-slate-400 block">
                  Audited Guidelines Breakdown:
                </span>

                <div className="space-y-2">
                  {analysis?.parameters && analysis.parameters.length > 0 ? (
                    analysis.parameters.slice(0, 6).map((p) => {
                      const isParamPass = p.status === 'PASS' || p.score >= 80;
                      return (
                        <div
                          key={p.parameterId}
                          className="flex items-start justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 text-xs"
                        >
                          <div className="flex items-start gap-2.5">
                            {isParamPass ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <p className="font-bold font-syne text-white">{p.name}</p>
                              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                                {p.reason || p.evidence?.[0] || 'Verified according to brand toolkit.'}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-space font-bold uppercase shrink-0 ${
                              isParamPass
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            {p.score}%
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-xl border border-slate-800 p-4 text-center text-xs text-slate-400">
                      Brand parameters successfully verified.
                    </div>
                  )}
                </div>
              </div>

              {/* Security & Verification Metadata */}
              <div className="border-t border-slate-800 pt-4 space-y-1 text-[11px] font-space text-slate-400">
                <div className="flex justify-between">
                  <span>Audited Brand:</span>
                  <span className="text-white font-semibold">{submission.brandName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Assigned Supervisor:</span>
                  <span className="text-white">{submission.assignedSupervisorName || 'Marcus Vance'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Audit Timestamp:</span>
                  <span className="text-white">
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
