import React, { useState, useEffect } from 'react';
import { Submission, Campaign, Brand, SupervisorMetric } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Building2,
  Search,
  Filter,
  Eye,
  Check,
  XCircle,
  CalendarPlus,
  TrendingUp,
  MessageSquare,
  Users,
  UserCheck,
  ChevronRight,
  ExternalLink,
  Layers,
  FileCheck2,
} from 'lucide-react';
import { PeerReviewSection } from './PeerReviewSection';

interface SupervisorDashboardProps {
  submissions: Submission[];
  onSelectSubmission: (submission: Submission) => void;
  initialTab?: 'queue' | 'campaigns' | 'peer-review';
}

export const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({
  submissions,
  onSelectSubmission,
  initialTab = 'queue',
}) => {
  const { currentUser, systemSettings } = useAuth();

  const [activeTab, setActiveTab] = useState<'queue' | 'campaigns' | 'peer-review'>(
    initialTab === 'peer-review' ? 'peer-review' : initialTab === 'campaigns' ? 'campaigns' : 'queue'
  );
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [supervisorMetrics, setSupervisorMetrics] = useState<SupervisorMetric[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBrand, setFilterBrand] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDirectiveId, setSelectedDirectiveId] = useState<string>('');

  useEffect(() => {
    loadSupervisorData();
  }, [currentUser?.id]);

  const loadSupervisorData = async () => {
    setIsLoading(true);
    try {
      const [cList, sMetrics] = await Promise.all([
        api.getCampaigns(),
        api.getSupervisorMetrics().catch(() => []),
      ]);
      setCampaigns(Array.isArray(cList) ? cList : []);
      setSupervisorMetrics(Array.isArray(sMetrics) ? sMetrics : []);
    } catch (err) {
      console.warn('Could not load supervisor specific data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Find assigned campaigns for current supervisor
  const myAssignedCampaigns = campaigns.filter(
    (c) =>
      c.assignedSupervisorId === currentUser?.id ||
      (currentUser?.assignedBrands && currentUser.assignedBrands.includes(c.brandId))
  );

  const assignedCampaignIds = new Set(myAssignedCampaigns.map((c) => c.id));

  // Submissions assigned to this supervisor directly or through assigned campaigns
  const myAssignedSubmissions = submissions.filter(
    (s) =>
      s.assignedSupervisorId === currentUser?.id ||
      (s.campaignId && assignedCampaignIds.has(s.campaignId)) ||
      (currentUser?.assignedBrands && currentUser.assignedBrands.includes(s.brandId))
  );

  // Filtered queue
  const queueSubmissions = myAssignedSubmissions.filter((s) => {
    const matchSearch =
      s.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.brandName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchBrand = filterBrand === 'ALL' || s.brandId === filterBrand;
    const matchStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'PENDING' &&
        (s.workflowStatus === 'AWAITING_SUPERVISOR_REVIEW' ||
          s.workflowStatus === 'AWAITING_MANAGER_REVIEW')) ||
      s.workflowStatus === filterStatus;
    return matchSearch && matchBrand && matchStatus;
  });

  // Metrics
  const pendingCount = myAssignedSubmissions.filter(
    (s) =>
      s.workflowStatus === 'AWAITING_SUPERVISOR_REVIEW' ||
      s.workflowStatus === 'AWAITING_MANAGER_REVIEW'
  ).length;

  const approvedCount = myAssignedSubmissions.filter((s) => s.workflowStatus === 'APPROVED').length;
  const reworkCount = myAssignedSubmissions.filter(
    (s) => s.workflowStatus === 'CHANGES_REQUESTED' || s.workflowStatus === 'NEEDS_IMPROVEMENT'
  ).length;

  const myMetric = supervisorMetrics.find((m) => m.supervisorId === currentUser?.id);
  const avgTurnaround = myMetric?.avgReviewTimeMinutes ?? 12;
  const approvalRate = myMetric?.approvalRate ?? (approvedCount + reworkCount > 0 ? Math.round((approvedCount / (approvedCount + reworkCount)) * 100) : 92);

  const formatMinutes = (mins: number) => {
    if (!mins || mins <= 0) return '< 1 min';
    if (mins < 60) return `${mins} mins`;
    const hours = Math.floor(mins / 60);
    const remainder = mins % 60;
    return remainder > 0 ? `${hours}h ${remainder}m` : `${hours}h`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#ff5000]">
              Supervisor Human Approval Queue
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-xs font-space text-slate-500">
              Elena Rostova &bull; VP of Brand Quality
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-syne text-slate-900 tracking-tight">
            Human Sign-Off Desk (AI Score &ge; 85%)
          </h1>
          <p className="text-xs text-slate-600 font-sans max-w-2xl leading-relaxed">
            Multimodal AI pre-screens all posters against Brand Toolkits and Meta Rules. Only posters scoring <strong className="text-slate-900">&ge; 85%</strong> are unlocked for your review. Posters scoring &lt; 85% are automatically returned to the creator with revision directives.
          </p>
        </div>

        {/* Quick KPI Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="text-[10px] font-space font-bold uppercase tracking-wider text-slate-400">
              In Queue
            </span>
            <p className="text-xl font-black font-syne text-amber-600">{pendingCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="text-[10px] font-space font-bold uppercase tracking-wider text-slate-400">
              Approved
            </span>
            <p className="text-xl font-black font-syne text-emerald-600">{approvedCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="text-[10px] font-space font-bold uppercase tracking-wider text-slate-400">
              Turnaround
            </span>
            <p className="text-xl font-black font-syne text-slate-900">{avgTurnaround}m</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="text-[10px] font-space font-bold uppercase tracking-wider text-slate-400">
              Pass Rate
            </span>
            <p className="text-xl font-black font-syne text-[#ff5000]">{approvalRate}%</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold font-syne transition-colors cursor-pointer ${
            activeTab === 'queue'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Assigned Queue ({pendingCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('campaigns')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold font-syne transition-colors cursor-pointer ${
            activeTab === 'campaigns'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <CalendarPlus className="h-4 w-4" />
          <span>Assigned Campaigns ({myAssignedCampaigns.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('peer-review')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold font-syne transition-colors cursor-pointer ${
            activeTab === 'peer-review'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>Directives &amp; Inquiries</span>
        </button>
      </div>

      {/* TAB 1: ASSIGNED QUEUE */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by creative title, employee, or brand..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#ff5000] focus:bg-white outline-none font-sans"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-space font-bold text-slate-500">Status:</span>
              <button
                type="button"
                onClick={() => setFilterStatus('ALL')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold font-space transition-colors cursor-pointer ${
                  filterStatus === 'ALL'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('PENDING')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold font-space transition-colors cursor-pointer ${
                  filterStatus === 'PENDING'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                Needs Review ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('APPROVED')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold font-space transition-colors cursor-pointer ${
                  filterStatus === 'APPROVED'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                Approved ({approvedCount})
              </button>
            </div>
          </div>

          {/* Submissions List */}
          {queueSubmissions.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
              <h3 className="text-base font-bold font-syne text-slate-900">
                All Assigned Items Cleared!
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-1">
                No submissions currently waiting in your supervisor queue.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {queueSubmissions.map((sub, qIdx) => {
                const latestVersion = sub.versions[sub.versions.length - 1];
                const previewImg = latestVersion?.files[0]?.fileUrl || '/assets/posters/jgi-banking.svg';
                const isPending =
                  sub.workflowStatus === 'AWAITING_SUPERVISOR_REVIEW' ||
                  sub.workflowStatus === 'AWAITING_MANAGER_REVIEW';
                const isApproved = sub.workflowStatus === 'APPROVED';

                return (
                  <div
                    key={`${sub.id}-${qIdx}`}
                    onClick={() => onSelectSubmission(sub)}
                    className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:border-[#ff5000] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Preview Container */}
                      <div className="relative aspect-4/3 bg-slate-100 overflow-hidden border-b border-slate-100">
                        <img
                          src={previewImg}
                          alt={sub.campaignName}
                          className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-space font-bold uppercase tracking-wider backdrop-blur-md border shadow-xs ${
                              isApproved
                                ? 'bg-emerald-600 text-white border-emerald-500'
                                : isPending
                                ? 'bg-amber-500 text-white border-amber-400'
                                : 'bg-red-600 text-white border-red-500'
                            }`}
                          >
                            {sub.workflowStatus.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="rounded-xl bg-white/95 backdrop-blur-md px-2.5 py-1 text-xs font-black font-space text-slate-900 border border-slate-200/80 shadow-xs">
                            {sub.overallAiScore}% GATE PASSED
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-[11px] font-space text-slate-500">
                          <span className="font-bold text-slate-800">{sub.brandName}</span>
                          <span>V{sub.currentVersion}</span>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold font-syne text-slate-900 group-hover:text-[#ff5000] transition-colors leading-snug">
                            {sub.campaignName}
                          </h4>
                          <p className="text-xs text-slate-500 font-sans mt-0.5">
                            Author: {sub.userName}
                          </p>
                        </div>

                        {/* Supervisor Routing Note */}
                        {sub.assignedSupervisorName && (
                          <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-2.5 text-[11px] font-space text-blue-900 flex items-center justify-between">
                            <span className="font-bold">Assigned:</span>
                            <span>{sub.assignedSupervisorName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer action */}
                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-space text-slate-400">
                        {sub.comments && sub.comments.length > 0
                          ? `${sub.comments.length} peer notes`
                          : 'Ready for review'}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSubmission(sub);
                        }}
                        className="flex items-center gap-1.5 rounded-xl bg-slate-900 group-hover:bg-[#ff5000] text-white px-3.5 py-1.5 text-xs font-bold font-syne transition-colors cursor-pointer"
                      >
                        <span>Review &amp; Sign-off</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ASSIGNED CAMPAIGNS */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-syne text-slate-900">
              Campaigns Under Your Direct Supervision ({myAssignedCampaigns.length})
            </h3>
            <span className="text-xs font-space text-slate-500">
              Assigned by Admin Governance
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {myAssignedCampaigns.map((camp, cIdx) => {
              const campSubmissions = submissions.filter((s) => s.campaignId === camp.id);
              const campApproved = campSubmissions.filter((s) => s.workflowStatus === 'APPROVED').length;
              const campPending = campSubmissions.filter(
                (s) =>
                  s.workflowStatus === 'AWAITING_SUPERVISOR_REVIEW' ||
                  s.workflowStatus === 'AWAITING_MANAGER_REVIEW'
              ).length;

              return (
                <div
                  key={`${camp.id}-${cIdx}`}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-space font-bold uppercase tracking-wider text-[#ff5000]">
                        {camp.brandId.replace('brand-', '').toUpperCase()}
                      </span>
                      <h4 className="text-lg font-bold font-syne text-slate-900">{camp.name}</h4>
                    </div>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-space font-bold text-emerald-700">
                      ACTIVE
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {camp.description || camp.product}
                  </p>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                    <div>
                      <span className="text-[10px] font-space text-slate-400 block">Total Posters</span>
                      <strong className="text-sm font-black font-space text-slate-900">
                        {campSubmissions.length}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-space text-slate-400 block">Pending</span>
                      <strong className="text-sm font-black font-space text-amber-600">
                        {campPending}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-space text-slate-400 block">Cleared</span>
                      <strong className="text-sm font-black font-space text-emerald-600">
                        {campApproved}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-space pt-2 border-t border-slate-100 text-slate-500">
                    <span>Supervisor: <strong className="text-slate-900">{camp.assignedSupervisorName || currentUser?.name}</strong></span>
                    <span>Timeline: {camp.startDate} to {camp.endDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SUPERVISOR DIRECTIVES & REVIEWS */}
      {activeTab === 'peer-review' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <h3 className="text-base font-bold font-syne text-slate-900">
              Appointed Supervisor Directives &amp; Inquiries
            </h3>
            <p className="text-xs text-slate-600 font-sans">
              Direct 1-on-1 communication for your assigned campaigns. Issue official directives, clarification answers, and sign-offs directly to the creative author.
            </p>
          </div>

          {(() => {
            const effectiveList = myAssignedSubmissions.length > 0 ? myAssignedSubmissions : submissions;
            if (effectiveList.length === 0) {
              return (
                <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
                  <p className="text-sm font-bold font-syne">No submissions currently in queue</p>
                </div>
              );
            }

            const activeSub =
              effectiveList.find((s) => s.id === (selectedDirectiveId || effectiveList[0]?.id)) ||
              effectiveList[0];

            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold font-syne text-slate-800">
                      Creatives ({effectiveList.length})
                    </span>
                    <span className="text-[10px] font-space text-slate-400">Select to Review</span>
                  </div>

                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                    {effectiveList.map((sub, eIdx) => {
                      const isSelected = sub.id === activeSub.id;
                      return (
                        <button
                          key={`${sub.id}-${eIdx}`}
                          type="button"
                          onClick={() => setSelectedDirectiveId(sub.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                          }`}
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            <p className="text-xs font-bold font-syne truncate">{sub.campaignName}</p>
                            <p className={`text-[10px] font-space truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                              By {sub.userName} &bull; {sub.brandName}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-bold font-space shrink-0 ${
                              sub.workflowStatus === 'APPROVED'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-[#ff5000]/20 text-[#ff5000] border border-[#ff5000]/30'
                            }`}
                          >
                            {sub.overallAiScore}%
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <PeerReviewSection submission={activeSub} />
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
