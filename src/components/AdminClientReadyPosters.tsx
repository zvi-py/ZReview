import React, { useState } from 'react';
import { Submission, Brand } from '../types';
import { CanvaThumbnailTile } from './CanvaPreviewCard';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import {
  Send,
  CheckCircle2,
  ExternalLink,
  Download,
  Share2,
  Mail,
  Search,
  Building2,
  User,
  Clock,
  Eye,
  Check,
  MessageSquare,
  ShieldCheck,
  FolderOpen,
  X,
} from 'lucide-react';

interface AdminClientReadyPostersProps {
  submissions: Submission[];
  brands: Brand[];
  onSelectSubmission: (submissionId: string) => void;
  onOpenScoreReport: (submission: Submission) => void;
}

const getSubmissionImageUrl = (sub: Submission): string => {
  const currentVer = sub.versions?.find((v) => v.versionNumber === sub.currentVersion) || sub.versions?.[0];
  const file = currentVer?.files?.[0];
  if (file?.thumbnailUrl && file.thumbnailUrl !== '') return file.thumbnailUrl;
  if (file?.fileUrl && file.fileUrl !== '' && !file.fileUrl.startsWith('data:application/x-canva')) return file.fileUrl;
  if ((sub as any).mediaUrl) return (sub as any).mediaUrl;
  if ((sub as any).thumbnailUrl) return (sub as any).thumbnailUrl;
  return '';
};

export const AdminClientReadyPosters: React.FC<AdminClientReadyPostersProps> = ({
  submissions,
  brands,
  onSelectSubmission,
  onOpenScoreReport,
}) => {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState<string>('ALL');
  const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState<'ALL' | 'READY' | 'SENT'>('ALL');

  // Client Email Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedSubForEmail, setSelectedSubForEmail] = useState<Submission | null>(null);
  const [clientEmail, setClientEmail] = useState('');
  const [clientName, setClientName] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendErrorMessage, setSendErrorMessage] = useState<string | null>(null);

  // Local state for tracking which posters have been sent to clients
  const [sentPosters, setSentPosters] = useState<Record<string, { sentAt: string; recipient: string }>>({
    'sub-approved-1': { sentAt: 'Today at 11:20 AM', recipient: 'marketing@client.com' },
  });

  // Filter approved posters only (selected by supervisor or passed threshold)
  const clientReadyPosters = submissions.filter((sub) => {
    const isApproved =
      sub.workflowStatus === 'APPROVED' ||
      sub.approvalStatus === 'APPROVED' ||
      sub.status === 'APPROVED';
    return isApproved;
  });

  const filteredPosters = clientReadyPosters.filter((sub) => {
    const matchesSearch =
      sub.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.brandName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBrand = selectedBrandId === 'ALL' || sub.brandId === selectedBrandId;

    const isSent = !!sentPosters[sub.id] || sub.deliveryStatus === 'DISPATCHED';
    const matchesDelivery =
      selectedDeliveryStatus === 'ALL' ||
      (selectedDeliveryStatus === 'SENT' && isSent) ||
      (selectedDeliveryStatus === 'READY' && !isSent);

    return matchesSearch && matchesBrand && matchesDelivery;
  });

  const handleOpenEmailModal = async (sub: Submission) => {
    const brand = brands.find((b) => b.id === sub.brandId);
    setSelectedSubForEmail(sub);
    setClientName(brand?.name || 'Client Partner');
    setClientEmail(
      brand?.clientContactEmail ||
        `client@${(brand?.name || 'company').toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
    );
    setEmailSubject(`[Approved Creative Package] ${sub.brandName} - ${sub.campaignName}`);

    const driveFolderText = sub.driveArchive?.driveUrl
      ? `\n\nGoogle Drive Deliverables Repository:\n${sub.driveArchive.driveUrl}`
      : '';

    setEmailMessage(
      `Hello ${brand?.name || 'Team'},\n\nPlease find attached the final approved poster collateral for "${sub.campaignName}".\n\nThis creative has passed formal supervisor verification and multimodal brand guidelines audit.\n\nPreview Asset:\n${getSubmissionImageUrl(sub)}${driveFolderText}\n\nBest regards,\nCreative Quality Team`
    );
    setSendSuccess(false);
    setSendErrorMessage(null);
    setIsEmailModalOpen(true);

    // Auto-prepare delivery package if not already generated
    if (!sub.deliveryPackage) {
      try {
        await api.prepareDeliveryPackage(sub.id, currentUser?.id, currentUser?.name);
      } catch (e) {
        console.warn('Delivery package pre-generation note:', e);
      }
    }
  };

  const handleSendEmail = async () => {
    if (!selectedSubForEmail) return;
    setIsSending(true);
    setSendErrorMessage(null);
    try {
      await api.dispatchDelivery(selectedSubForEmail.id, {
        channel: 'EMAIL',
        recipientEmail: clientEmail,
        recipientName: clientName,
        deliveryMessage: emailMessage,
        sentBy: currentUser?.id,
        sentByName: currentUser?.name || 'Administrator',
      });

      setSendSuccess(true);
      setSentPosters((prev) => ({
        ...prev,
        [selectedSubForEmail.id]: {
          sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recipient: clientEmail,
        },
      }));
      setTimeout(() => {
        setIsEmailModalOpen(false);
        setSendSuccess(false);
      }, 1500);
    } catch (err: any) {
      console.error('Failed to dispatch delivery package:', err);
      setSendErrorMessage(err.message || 'Failed to dispatch delivery.');
    } finally {
      setIsSending(false);
    }
  };

  const handleShareWhatsApp = async (sub: Submission) => {
    try {
      // Ensure delivery package record is logged
      await api.dispatchDelivery(sub.id, {
        channel: 'WHATSAPP',
        recipientEmail: 'WhatsApp Broadcast',
        recipientName: sub.brandName,
        deliveryMessage: `WhatsApp dispatch for ${sub.campaignName}`,
        sentBy: currentUser?.id,
        sentByName: currentUser?.name || 'Administrator',
      });
      setSentPosters((prev) => ({
        ...prev,
        [sub.id]: {
          sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recipient: 'WhatsApp',
        },
      }));
    } catch (e) {
      console.warn('WhatsApp log warning:', e);
    }

    const driveSnippet = sub.driveArchive?.driveUrl ? `\nDrive Folder: ${sub.driveArchive.driveUrl}` : '';
    const text = encodeURIComponent(
      `*Final Approved Poster for Client*\nBrand: ${sub.brandName}\nCampaign: ${sub.campaignName}\nStatus: Approved by Supervisor\nView Asset: ${getSubmissionImageUrl(sub)}${driveSnippet}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleToggleSentStatus = (submissionId: string) => {
    setSentPosters((prev) => {
      if (prev[submissionId]) {
        const next = { ...prev };
        delete next[submissionId];
        return next;
      }
      return {
        ...prev,
        [submissionId]: {
          sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recipient: 'client@company.com',
        },
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & KPI Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-space font-bold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Supervisor Cleared &bull; Ready for Client Delivery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-syne text-slate-900">
              Final Posters Selected by Supervisors
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-sans max-w-2xl">
              These posters have been reviewed, verified, and approved by supervisors. You can send them directly to clients via email, WhatsApp, or Google Drive deliverables.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-center min-w-[120px]">
              <span className="text-[10px] font-space font-bold uppercase text-emerald-800 block">
                Ready for Clients
              </span>
              <span className="text-2xl font-black font-syne text-emerald-700 block">
                {clientReadyPosters.length}
              </span>
              <span className="text-[10px] text-emerald-600 font-sans">
                Posters Approved
              </span>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-center min-w-[120px]">
              <span className="text-[10px] font-space font-bold uppercase text-blue-800 block">
                Sent to Clients
              </span>
              <span className="text-2xl font-black font-syne text-blue-700 block">
                {Object.keys(sentPosters).length}
              </span>
              <span className="text-[10px] text-blue-600 font-sans">
                Dispatched
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by campaign, employee name, or brand..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#ff5000] outline-hidden font-sans"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Brand Filter */}
          <select
            value={selectedBrandId}
            onChange={(e) => setSelectedBrandId(e.target.value)}
            aria-label="Filter by Brand"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:border-[#ff5000] outline-hidden cursor-pointer"
          >
            <option value="ALL">All Brands ({brands.length})</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Delivery Status Filter */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1">
            {(['ALL', 'READY', 'SENT'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedDeliveryStatus(status)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold font-space transition-colors cursor-pointer ${
                  selectedDeliveryStatus === status
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status === 'ALL' ? 'All' : status === 'READY' ? 'Ready to Send' : 'Sent'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Approved Posters */}
      {filteredPosters.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-slate-300 mb-3" />
          <h3 className="text-base font-bold font-syne text-slate-900">
            No supervisor-approved posters match this filter
          </h3>
          <p className="text-xs text-slate-500 font-sans mt-1">
            When supervisors approve posters from the review queue, they will appear here ready to send to clients.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosters.map((sub, pIdx) => {
            const isSent = !!sentPosters[sub.id];
            const deliveryInfo = sentPosters[sub.id];
            const brand = brands.find((b) => b.id === sub.brandId);
            const currentVer = sub.versions?.find((v) => v.versionNumber === sub.currentVersion) || sub.versions?.[0];
            const file = currentVer?.files?.[0];
            const isCanvaLinkOnly =
              !!sub.canvaUrl &&
              (!file?.fileUrl || file.fileUrl === '' || file.fileUrl.startsWith('data:application/x-canva') || sub.canvaPreviewState === 'LINK_ONLY');
            const imgUrl = getSubmissionImageUrl(sub);

            return (
              <div
                key={`${sub.id}-${pIdx}`}
                className="group flex flex-col rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:border-slate-300 hover:shadow-md transition-all"
              >
                {/* Poster Preview Image with Zoom & Badges */}
                {isCanvaLinkOnly ? (
                  <div className="p-3 bg-slate-900">
                    <CanvaThumbnailTile
                      canvaUrl={sub.canvaUrl!}
                      designId={sub.canvaDesignId}
                      campaignName={sub.campaignName}
                      onClick={() => onSelectSubmission(sub.id)}
                    />
                  </div>
                ) : (
                  <div className="relative aspect-4/3 bg-slate-900 overflow-hidden cursor-pointer" onClick={() => onSelectSubmission(sub.id)}>
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={sub.campaignName}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs">
                        Poster Asset
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-space font-bold text-white border border-white/20">
                        {sub.brandName}
                      </span>
                      <span className="rounded-lg bg-emerald-500/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-space font-bold text-white border border-emerald-400/40 flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        <span>Approved</span>
                      </span>
                    </div>

                    {/* Bottom Image Overlay Details */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div>
                        <span className="text-[10px] font-space text-white/80 uppercase block">
                          Campaign
                        </span>
                        <h4 className="text-sm font-bold font-syne text-white truncate max-w-[200px]">
                          {sub.campaignName}
                        </h4>
                      </div>
                      <div className="rounded-xl bg-emerald-600 px-2.5 py-1 text-center text-white shadow-xs">
                        <span className="text-[9px] font-space font-bold uppercase block opacity-80">
                          AI Score
                        </span>
                        <span className="text-sm font-black font-space">
                          {sub.overallAiScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Content & Details */}
                <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
                  {/* Creator and Supervisor Information */}
                  <div className="space-y-2 text-xs font-sans">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-space text-[11px]">Creator (Employee):</span>
                      <div className="flex items-center gap-1.5">
                        {((sub as any).creatorAvatar || sub.userAvatar) ? (
                          <img
                            src={(sub as any).creatorAvatar || sub.userAvatar}
                            alt={(sub as any).creatorName || sub.userName}
                            className="h-5 w-5 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-3.5 w-3.5 text-slate-400" />
                        )}
                        <span className="font-bold text-slate-900">{(sub as any).creatorName || sub.userName}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-space text-[11px]">Approved By:</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                        {(sub as any).supervisorFeedback?.reviewerName || sub.assignedSupervisorName || sub.humanReviewerName || 'Elena Rostova (Lead)'}
                      </span>
                    </div>

                    {/* Delivery Status Indicator */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-slate-500 font-space text-[11px]">Client Status:</span>
                      {isSent ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          <CheckCircle2 className="h-3 w-3 text-blue-600" />
                          <span>Sent ({deliveryInfo.sentAt})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Clock className="h-3 w-3 text-amber-600" />
                          <span>Ready to Send</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEmailModal(sub)}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-[#ff5000] hover:bg-[#e04700] text-white py-2 text-xs font-bold font-syne transition-colors cursor-pointer shadow-xs"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        <span>Send to Client</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleShareWhatsApp(sub)}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-xs font-bold font-syne transition-colors cursor-pointer shadow-xs"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        <span>WhatsApp</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenScoreReport(sub)}
                        className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 py-1.5 text-[11px] font-space font-medium transition cursor-pointer"
                      >
                        <Eye className="h-3 w-3 text-slate-500" />
                        <span>View Review</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleSentStatus(sub.id)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-space font-bold border transition cursor-pointer ${
                          isSent
                            ? 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                        }`}
                        title={isSent ? 'Mark as Not Sent' : 'Mark as Sent to Client'}
                      >
                        {isSent ? 'Undo Sent' : 'Mark as Sent'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Send to Client Email Modal */}
      {isEmailModalOpen && selectedSubForEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-orange-100 p-3 text-[#ff5000]">
                  <Send className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-syne text-slate-900">
                    Send Poster to Client
                  </h3>
                  <p className="text-xs text-slate-500 font-sans">
                    Deliver final approved creative directly to client contacts
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {sendSuccess ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-2">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600 animate-bounce" />
                <h4 className="text-sm font-bold font-syne text-emerald-900">
                  Poster Successfully Sent to Client!
                </h4>
                <p className="text-xs text-emerald-700 font-sans">
                  The approved package and download links were dispatched to {clientEmail}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold font-space text-slate-700 block mb-1">
                    Client Email Recipient:
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="client@company.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-[#ff5000] outline-hidden font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold font-space text-slate-700 block mb-1">
                    Subject Line:
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-[#ff5000] outline-hidden font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold font-space text-slate-700 block mb-1">
                    Message Body &amp; Deliverables Link:
                  </label>
                  <textarea
                    rows={6}
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 focus:border-[#ff5000] outline-hidden font-sans leading-relaxed"
                  />
                </div>

                {/* Attached Asset Preview */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 flex items-center gap-3">
                  <img
                    src={selectedSubForEmail.mediaUrl || selectedSubForEmail.thumbnailUrl}
                    alt={selectedSubForEmail.campaignName}
                    className="h-12 w-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold font-syne text-slate-900 truncate">
                      {selectedSubForEmail.campaignName}
                    </p>
                    <p className="text-[11px] text-slate-500 font-sans">
                      Verified by Supervisor &bull; {selectedSubForEmail.overallAiScore}% AI Compliance
                    </p>
                  </div>
                </div>

                {sendErrorMessage && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-red-500 shrink-0" />
                    <span>{sendErrorMessage}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEmailModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold font-syne text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSending || !clientEmail}
                    onClick={handleSendEmail}
                    className="flex items-center gap-2 rounded-xl bg-[#ff5000] hover:bg-[#e04700] disabled:opacity-50 text-white px-5 py-2 text-xs font-bold font-syne shadow-xs transition cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSending ? 'Sending to Client...' : 'Dispatch to Client'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
