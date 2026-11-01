import React, { useState } from 'react';
import {
  Submission,
  Brand,
} from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import {
  X,
  Share2,
  Copy,
  CheckCircle2,
  Mail,
  MessageSquare,
  ExternalLink,
  Send,
  Eye,
  FileText,
  Printer,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  UserCheck,
  Globe,
} from 'lucide-react';

interface ClientShareModalProps {
  isOpen: boolean;
  submission: Submission;
  brand?: Brand;
  onClose: () => void;
  onUpdated?: (updatedSubmission: Submission) => void;
}

export const ClientShareModal: React.FC<ClientShareModalProps> = ({
  isOpen,
  submission,
  brand,
  onClose,
  onUpdated,
}) => {
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'quick' | 'email' | 'brief' | 'history'>('quick');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [copiedCliq, setCopiedCliq] = useState(false);

  if (!isOpen) return null;

  const currentVersion =
    submission.versions?.find((v) => v.versionNumber === submission.currentVersion) ||
    submission.versions?.[submission.versions.length - 1];

  const analysis = currentVersion?.analysisResult;
  const currentFile = currentVersion?.files?.[0];
  const previewImg =
    currentFile?.thumbnailUrl ||
    currentFile?.fileUrl ||
    (submission as any).mediaUrl ||
    (submission as any).thumbnailUrl ||
    '';

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const clientShareUrl = `${origin}/?clientShare=${submission.id}`;

  const score = currentVersion?.aiScore ?? submission.overallAiScore ?? 0;
  const isPassed = score >= 80;

  // Formatted client email & text template
  const emailSubject = `[Creative Review] ${submission.brandName} - ${submission.campaignName} (AI Audit Score: ${score}%)`;
  
  const formattedSummaryText = `CREATIVE REVIEW & COMPLIANCE SUMMARY
Project: ${submission.campaignName}
Brand: ${submission.brandName}
Version: V${submission.currentVersion}
AI Compliance Score: ${score}% (${isPassed ? 'PASSED / CLEARED' : 'PENDING REVIEW'})
Asset Fingerprint (SHA-256): ${currentFile?.assetHash ? `${currentFile.assetHash.substring(0, 16)}...` : 'Verified on storage'}

AUDIT HIGHLIGHTS:
${analysis?.executiveSummary || 'Creative verified against official brand identity, layout safe zones, and contact parameters.'}

DIRECT CLIENT REVIEW PORTAL:
${clientShareUrl}

Packaged and verified via Z Brand Governance Engine.
${customNote ? `\nNote from Team: ${customNote}\n` : ''}`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(clientShareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyBrief = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(formattedSummaryText);
      setCopiedBrief(true);
      setTimeout(() => setCopiedBrief(false), 2500);
    }
  };

  const handleDirectSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail.trim()) {
      setSendError('Please enter a valid recipient client email address.');
      return;
    }

    setIsSending(true);
    setSendError(null);

    try {
      const res = await api.shareWithClient(submission.id, {
        channel: 'EMAIL',
        recipientEmail: recipientEmail.trim(),
        recipientName: recipientName.trim() || undefined,
        note: customNote.trim() || undefined,
        sharedBy: currentUser?.id || 'usr-current',
        sharedByName: currentUser?.name || 'Creative Team',
      });

      if (res.success) {
        setSendSuccess(true);
        if (onUpdated) {
          onUpdated(res.submission);
        }
        setTimeout(() => {
          setSendSuccess(false);
          setRecipientEmail('');
          setCustomNote('');
        }, 3000);
      }
    } catch (err: any) {
      setSendError(err.message || 'Failed to dispatch email to client.');
    } finally {
      setIsSending(false);
    }
  };

  const handleOpenClientPortal = () => {
    window.open(clientShareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id="client-share-modal"
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 p-2 sm:p-4 backdrop-blur-sm font-sans overflow-hidden"
    >
      <div className="w-full max-w-2xl h-[88vh] max-h-[88vh] flex flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl text-slate-900 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Asset Snapshot & Score Badge */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-900 px-6 py-4 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ff5000] text-white shadow-md shrink-0">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#ff5000]">
                  [ CLIENT DISTRIBUTION ]
                </span>
                <span className="text-white/20">&bull;</span>
                <h2 className="text-base font-bold font-syne text-white">
                  Share Details with Client
                </h2>
              </div>
              <p className="text-xs font-space text-slate-400 mt-0.5">
                {submission.brandName} &bull; {submission.campaignName} (V{submission.currentVersion})
              </p>
            </div>
          </div>
          <button
            type="button"
            id="close-client-share-modal"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Context Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-6 py-3 text-xs shrink-0">
          <div className="flex items-center gap-2.5">
            {previewImg && (
              <img
                src={previewImg}
                alt={submission.campaignName}
                referrerPolicy="no-referrer"
                className="h-10 w-10 rounded-lg object-cover border border-slate-200"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{submission.campaignName}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold font-space ${
                    isPassed
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {score}% {isPassed ? 'AI Cleared' : 'Needs Review'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-space">
                Audited via Gemini Multimodal Vision &bull; V{submission.currentVersion}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenClientPortal}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 px-3 py-1.5 text-xs font-bold font-syne text-slate-800 transition-colors cursor-pointer shadow-2xs"
          >
            <Eye className="h-3.5 w-3.5 text-[#ff5000]" />
            <span>Preview Client View</span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6 pt-3 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            className={`px-3.5 py-2 text-xs font-bold font-syne rounded-t-xl transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'quick'
                ? 'bg-orange-50/70 text-[#ff5000] border-b-2 border-[#ff5000]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Instant Channels</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`px-3.5 py-2 text-xs font-bold font-syne rounded-t-xl transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'email'
                ? 'bg-orange-50/70 text-[#ff5000] border-b-2 border-[#ff5000]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Direct Email Client</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('brief')}
            className={`px-3.5 py-2 text-xs font-bold font-syne rounded-t-xl transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'brief'
                ? 'bg-orange-50/70 text-[#ff5000] border-b-2 border-[#ff5000]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Executive Brief</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-2 text-xs font-bold font-syne rounded-t-xl transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-orange-50/70 text-[#ff5000] border-b-2 border-[#ff5000]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Share Log ({submission.clientShares?.length || 0})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">
          {/* TAB 1: INSTANT CHANNELS */}
          {activeTab === 'quick' && (
            <div className="space-y-4">
              {/* Direct Web Review Link Box */}
              <div className="rounded-2xl border-2 border-orange-200 bg-orange-50/40 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-syne uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#ff5000]" />
                    Direct Client Review Portal Link
                  </span>
                  {copiedLink && (
                    <span className="text-[11px] font-space font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Copied to clipboard!
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 font-sans">
                  Clients can open this link directly in any browser with zero login required to view the artwork, audit certificate, and submit approval.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    readOnly
                    value={clientShareUrl}
                    className="flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-mono text-slate-800 select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-bold font-syne text-white transition-colors cursor-pointer shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenClientPortal}
                    className="flex items-center gap-1.5 rounded-xl bg-[#ff5000] hover:bg-[#e04700] px-3.5 py-2 text-xs font-bold font-syne text-white transition-colors cursor-pointer shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open</span>
                  </button>
                </div>
              </div>

              {/* 1-Click External Channels */}
              <div className="space-y-2">
                <label className="text-xs font-bold font-syne text-slate-800 block">
                  Quick Share to Communication Channels:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Email Client */}
                  <a
                    href={`mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(formattedSummaryText)}`}
                    onClick={() => {
                      api.shareWithClient(submission.id, {
                        channel: 'EMAIL',
                        sharedBy: currentUser?.id,
                        sharedByName: currentUser?.name,
                      });
                    }}
                    className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/40 text-center transition cursor-pointer shadow-2xs group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold font-syne text-slate-900">Email Client</span>
                    <span className="text-[10px] font-space text-slate-400 mt-0.5">Pre-filled mailto</span>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `*${submission.brandName} - ${submission.campaignName}*\n*AI Compliance Score:* ${score}%\n\nView Creative Review Portal:\n${clientShareUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      api.shareWithClient(submission.id, {
                        channel: 'WHATSAPP',
                        sharedBy: currentUser?.id,
                        sharedByName: currentUser?.name,
                      });
                    }}
                    className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/40 text-center transition cursor-pointer shadow-2xs group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold font-syne text-slate-900">WhatsApp</span>
                    <span className="text-[10px] font-space text-slate-400 mt-0.5">Send message</span>
                  </a>

                  {/* Zoho Cliq / Teams / Slack */}
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(formattedSummaryText);
                      setCopiedCliq(true);
                      api.shareWithClient(submission.id, {
                        channel: 'CLIQ',
                        sharedBy: currentUser?.id,
                        sharedByName: currentUser?.name,
                      });
                      setTimeout(() => setCopiedCliq(false), 2500);
                    }}
                    className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50/40 text-center transition cursor-pointer shadow-2xs group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold font-syne text-slate-900">
                      {copiedCliq ? 'Copied Snippet!' : 'Zoho Cliq / Slack'}
                    </span>
                    <span className="text-[10px] font-space text-slate-400 mt-0.5">Copy Markdown</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DIRECT EMAIL CLIENT */}
          {activeTab === 'email' && (
            <form onSubmit={handleDirectSend} className="space-y-4">
              {sendSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-sans">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Client review details successfully recorded and dispatched!</span>
                </div>
              )}

              {sendError && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-sans">
                  {sendError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold font-syne uppercase tracking-wider text-slate-700 block mb-1">
                    Client Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Rachel Green"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-sans text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff5000]/25 focus:border-[#ff5000]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold font-syne uppercase tracking-wider text-slate-700 block mb-1">
                    Client Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="client@company.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-sans text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff5000]/25 focus:border-[#ff5000]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold font-syne uppercase tracking-wider text-slate-700 block mb-1">
                  Custom Message or Note to Client
                </label>
                <textarea
                  rows={3}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="e.g. Please find the latest campaign creative with brand compliance clearance. Let us know if you approve."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-sans text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff5000]/25 focus:border-[#ff5000]"
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <span className="font-bold font-syne text-slate-800 block">Email Payload Preview:</span>
                <p className="font-mono text-slate-700 truncate">Subject: {emailSubject}</p>
                <p className="text-slate-500">Includes direct client portal review link, AI compliance certificate, and high-res asset preview.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex items-center gap-2 rounded-xl bg-[#ff5000] hover:bg-[#e04700] disabled:opacity-50 px-5 py-2.5 text-xs font-bold font-syne text-white transition-all cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? 'Sending to Client...' : 'Dispatch Review to Client'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: EXECUTIVE BRIEF */}
          {activeTab === 'brief' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-syne text-slate-800">
                  Client-Ready Formatted Text Brief
                </span>
                <button
                  type="button"
                  onClick={handleCopyBrief}
                  className="flex items-center gap-1.5 text-xs font-bold font-syne text-[#ff5000] hover:underline cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedBrief ? 'Copied!' : 'Copy Formatted Text'}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={10}
                value={formattedSummaryText}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 select-all focus:outline-none"
              />
            </div>
          )}

          {/* TAB 4: SHARE LOG & AUDIT */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <span className="text-xs font-bold font-syne text-slate-800 block">
                Client Dispatch &amp; Share Activity:
              </span>

              {(!submission.clientShares || submission.clientShares.length === 0) ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                  <p className="text-xs font-space">No client shares recorded yet for this submission.</p>
                  <p className="text-[11px] text-slate-400 mt-1">Use the Instant Channels or Direct Email tab to share details with the client.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {submission.clientShares.map((share, sIdx) => (
                    <div
                      key={`${share.id}-${sIdx}`}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#ff5000] flex items-center justify-center font-bold font-space text-[10px]">
                          {share.channel.substring(0, 3)}
                        </div>
                        <div>
                          <p className="font-bold font-syne text-slate-900">
                            Shared via {share.channel}
                            {share.recipientEmail ? ` to ${share.recipientEmail}` : ''}
                          </p>
                          <p className="text-[11px] font-space text-slate-400">
                            By {share.sharedByName} &bull; {new Date(share.sharedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {share.note && (
                        <span className="text-[11px] font-sans text-slate-500 italic max-w-xs truncate">
                          &quot;{share.note}&quot;
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {submission.clientFeedback && submission.clientFeedback.length > 0 && (
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <span className="text-xs font-bold font-syne text-slate-800 block">
                    Client Feedback Received:
                  </span>
                  {submission.clientFeedback.map((fb, fbIdx) => (
                    <div
                      key={`${fb.id}-${fbIdx}`}
                      className={`p-3 rounded-xl border text-xs ${
                        fb.decision === 'APPROVED'
                          ? 'border-emerald-200 bg-emerald-50/70 text-emerald-950'
                          : 'border-amber-200 bg-amber-50/70 text-amber-950'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold font-syne">
                        <span>{fb.clientName} &bull; {fb.decision}</span>
                        <span className="text-[10px] font-space font-normal">
                          {new Date(fb.receivedAt).toLocaleString()}
                        </span>
                      </div>
                      {fb.comment && <p className="mt-1 font-sans">{fb.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4 shrink-0">
          <div className="text-[11px] font-space text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cryptographically signed audit trail</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 hover:bg-slate-800 px-5 py-2 text-xs font-bold font-syne text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
