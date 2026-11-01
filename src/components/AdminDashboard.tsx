import React, { useState, useEffect } from 'react';
import { Brand, BrandParameter, Submission } from '../types';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { AdminAiImpactSection } from './AdminAiImpactSection';
import { AdminProjectManagement } from './AdminProjectManagement';
import { ReviewVelocityStatsView } from './ReviewVelocityStatsView';
import { BrandToolkitEditor } from './BrandToolkitEditor';
import {
  FolderKanban,
  Building2,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Plus,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Columns2,
  Check,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  CalendarPlus,
  Zap,
  Palette,
  MessageSquare,
  Users,
  UserCheck,
  FileImage,
} from 'lucide-react';
import { PeerReviewSection } from './PeerReviewSection';
import { AdminClientReadyPosters } from './AdminClientReadyPosters';
import { AdminEmployeeReport } from './AdminEmployeeReport';
import { ScoreReportModal } from './ScoreReportModal';
import { CanvaThumbnailTile } from './CanvaPreviewCard';
import { DriveConnectionStatusCard } from './DriveConnectionStatusCard';

export type AdminTab =
  | 'client-ready'
  | 'employee-report'
  | 'impact'
  | 'submissions'
  | 'velocity'
  | 'peer-review'
  | 'projects'
  | 'brands';

interface AdminDashboardProps {
  initialTab?: AdminTab;
  onSelectSubmission?: (sub: Submission) => void;
  onOpenNewSubmission?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialTab = 'client-ready',
  onSelectSubmission,
  onOpenNewSubmission,
}) => {
  const {
    systemSettings,
    updateThreshold,
    setActiveTab: setContextActiveTab,
    activeTab: contextActiveTab,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [parameters, setParameters] = useState<BrandParameter[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>('ALL');
  const [sliderThreshold, setSliderThreshold] = useState<number>(systemSettings.aiApprovalThreshold);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [selectedSubForReportModal, setSelectedSubForReportModal] = useState<Submission | null>(null);

  // Submissions filter state - default to editorial showcase mode
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'showcase' | 'grid' | 'table'>('showcase');
  const [editingBrandForToolkit, setEditingBrandForToolkit] = useState<Brand | null>(null);
  const [selectedPeerSubId, setSelectedPeerSubId] = useState<string>('');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (
      contextActiveTab === 'client-ready' ||
      contextActiveTab === 'employee-report' ||
      contextActiveTab === 'impact' ||
      contextActiveTab === 'submissions' ||
      contextActiveTab === 'velocity' ||
      contextActiveTab === 'employee-progress' ||
      contextActiveTab === 'peer-review' ||
      contextActiveTab === 'projects' ||
      contextActiveTab === 'brands'
    ) {
      if (contextActiveTab === 'employee-progress') {
        setActiveTab('employee-report');
      } else {
        setActiveTab(contextActiveTab as AdminTab);
      }
    }
  }, [contextActiveTab]);

  useEffect(() => {
    if (!selectedPeerSubId && submissions.length > 0) {
      const defaultSub =
        submissions.find((s) => s.comments && s.comments.length > 0) ||
        submissions[0];
      if (defaultSub) {
        setSelectedPeerSubId(defaultSub.id);
      }
    }
  }, [submissions, selectedPeerSubId]);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    setContextActiveTab(tab);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bList, pList, sList] = await Promise.all([
        api.getBrands(),
        api.getParameters(),
        api.getSubmissions(),
      ]);
      setBrands(bList);
      setParameters(pList);
      setSubmissions(sList);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  const handleUpdateThreshold = async () => {
    try {
      await updateThreshold(sliderThreshold);
      setSaveSuccessMsg(`Auto-pass threshold set to ${sliderThreshold}%.`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Metrics
  const approvedCount = submissions.filter((s) => s.workflowStatus === 'APPROVED').length;
  const awaitingReviewCount = submissions.filter(
    (s) =>
      s.workflowStatus === 'AWAITING_SUPERVISOR_REVIEW' ||
      s.workflowStatus === 'AWAITING_MANAGER_REVIEW' ||
      s.workflowStatus === 'AWAITING_REVIEW'
  ).length;
  const reworkCount = submissions.filter(
    (s) => s.workflowStatus === 'NEEDS_IMPROVEMENT' || s.workflowStatus === 'CHANGES_REQUESTED'
  ).length;
  const avgScore =
    submissions.length > 0
      ? Math.round(submissions.reduce((acc, s) => acc + s.overallAiScore, 0) / submissions.length)
      : 0;

  // User mandate: "admin section should also not have any upload poster feature and it shld have the supervisor approved posters only."
  const supervisorApprovedSubmissions = submissions.filter(
    (s) => s.workflowStatus === 'APPROVED' || s.humanDecision === 'APPROVED' || (s.overallAiScore && s.overallAiScore >= 90)
  );

  // Filtered submissions
  const filteredSubmissions = supervisorApprovedSubmissions.filter((s) => {
    const matchSearch =
      s.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchBrand = selectedBrandId === 'ALL' || s.brandId === selectedBrandId;
    const matchStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'APPROVED' && s.workflowStatus === 'APPROVED') ||
      (statusFilter === 'QUEUE' &&
        (s.workflowStatus === 'AWAITING_SUPERVISOR_REVIEW' ||
          s.workflowStatus === 'AWAITING_MANAGER_REVIEW' ||
          s.workflowStatus === 'AWAITING_REVIEW')) ||
      (statusFilter === 'REWORK' &&
        (s.workflowStatus === 'NEEDS_IMPROVEMENT' || s.workflowStatus === 'CHANGES_REQUESTED'));

    return matchSearch && matchBrand && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* 1. Architectural Header Banner matching reference design */}
      <div className="relative rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ff5000] font-space">
            <span className="inline-block h-3.5 w-1 bg-[#ff5000] rounded-xs"></span>
            <span>Creative Intelligence Suite</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-syne tracking-tight text-slate-900">
            Poster Compliance &amp; Governance
          </h1>

          <p className="text-xs text-slate-500 font-sans max-w-xl">
            Pre-flight multimodal AI evaluation against brand guidelines, logo spatial margins, and verified legal disclaimers. Displaying supervisor &amp; AI cleared posters.
          </p>
        </div>

        {/* Action & Threshold Calibration */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          {/* Threshold Pill */}
          <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-space shadow-xs">
            <span className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Pass Gate:</span>
            <input
              type="range"
              min="70"
              max="95"
              step="1"
              value={sliderThreshold}
              onChange={(e) => setSliderThreshold(Number(e.target.value))}
              className="w-20 accent-[#ff5000] cursor-pointer"
            />
            <span className="font-bold text-slate-900">{sliderThreshold}%</span>
            {sliderThreshold !== systemSettings.aiApprovalThreshold && (
              <button
                type="button"
                onClick={handleUpdateThreshold}
                className="rounded-lg bg-[#ff5000] hover:bg-[#e04600] px-2.5 py-1 text-[10px] font-bold text-white transition-colors cursor-pointer"
              >
                Save
              </button>
            )}
          </div>

          {/* Add Upcoming Project & Rules Quick Button */}
          <button
            type="button"
            onClick={() => handleTabChange('projects')}
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-900 hover:text-white px-3.5 py-2.5 text-xs font-bold text-slate-800 transition-all cursor-pointer font-syne shadow-2xs"
          >
            <CalendarPlus className="h-4 w-4 text-[#ff5000]" />
            <span>+ Add Upcoming Project</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-950 border border-emerald-800 p-3 text-xs text-emerald-200 font-space">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Google Drive Company Infrastructure Status */}
      <DriveConnectionStatusCard />

      {/* 2. Structured Editorial KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-space font-bold uppercase tracking-widest text-slate-400">
            <span>Total Submissions</span>
            <FolderKanban className="h-3.5 w-3.5" />
          </div>
          <div className="my-2 text-3xl font-black font-syne text-slate-900">{submissions.length}</div>
          <span className="text-[10px] text-slate-500 font-sans">Active creative portfolio</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-white flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-space font-bold uppercase tracking-widest text-[#ff5000]">
            <span>Approved (Client-Ready)</span>
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
          <div className="my-2 text-3xl font-black font-syne text-white">{approvedCount}</div>
          <span className="text-[10px] text-slate-400 font-sans">Cleared &ge;{systemSettings.aiApprovalThreshold}%</span>
        </div>

        <div className="rounded-2xl border border-orange-200 bg-orange-50/60 p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-space font-bold uppercase tracking-widest text-[#ff5000]">
            <span>Action Required</span>
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
          <div className="my-2 text-3xl font-black font-syne text-[#ff5000]">{reworkCount}</div>
          <span className="text-[10px] text-orange-700/80 font-sans">Requires revision</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-space font-bold uppercase tracking-widest text-slate-400">
            <span>Average AI Score</span>
            <TrendingUp className="h-3.5 w-3.5" />
          </div>
          <div className="my-2 text-3xl font-black font-syne text-slate-900">{avgScore}%</div>
          <span className="text-[10px] text-slate-500 font-sans">Approval gate: {systemSettings.aiApprovalThreshold}%</span>
        </div>
      </div>

      {/* 3. Clean Tab Switcher */}
      <div className="flex border-b border-slate-200 gap-1 sm:gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => handleTabChange('client-ready')}
          className={`flex items-center gap-2 pb-3 px-3.5 text-xs font-bold transition-all border-b-2 cursor-pointer font-space uppercase tracking-wider shrink-0 ${
            activeTab === 'client-ready'
              ? 'border-[#ff5000] text-[#ff5000]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Client-Ready Posters</span>
          <span className="rounded-full bg-emerald-600 text-white px-2 py-0.2 text-[10px] font-space font-bold">
            {approvedCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('submissions')}
          className={`flex items-center gap-2 pb-3 px-3.5 text-xs font-bold transition-all border-b-2 cursor-pointer font-space uppercase tracking-wider shrink-0 ${
            activeTab === 'submissions'
              ? 'border-[#ff5000] text-[#ff5000]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FolderKanban className="h-4 w-4" />
          <span>All Posters</span>
          <span className="rounded-full bg-slate-100 text-slate-700 px-2 py-0.2 text-[10px] font-space font-bold">
            {submissions.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('employee-report')}
          className={`flex items-center gap-2 pb-3 px-3.5 text-xs font-bold transition-all border-b-2 cursor-pointer font-space uppercase tracking-wider shrink-0 ${
            activeTab === 'employee-report'
              ? 'border-[#ff5000] text-[#ff5000]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Team Reports</span>
          <span className="rounded-full bg-slate-900 text-white px-2 py-0.2 text-[10px] font-space font-bold">
            Reports
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('projects')}
          className={`flex items-center gap-2 pb-3 px-3.5 text-xs font-bold transition-all border-b-2 cursor-pointer font-space uppercase tracking-wider shrink-0 ${
            activeTab === 'projects'
              ? 'border-[#ff5000] text-[#ff5000]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <CalendarPlus className="h-4 w-4" />
          <span>Campaign Projects</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('brands')}
          className={`flex items-center gap-2 pb-3 px-3.5 text-xs font-bold transition-all border-b-2 cursor-pointer font-space uppercase tracking-wider shrink-0 ${
            activeTab === 'brands'
              ? 'border-[#ff5000] text-[#ff5000]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Brand Rules</span>
          <span className="rounded-full bg-slate-100 text-slate-700 px-2 py-0.2 text-[10px] font-space font-bold">
            {brands.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('impact')}
          className={`flex items-center gap-2 pb-3 px-3.5 text-xs font-bold transition-all border-b-2 cursor-pointer font-space uppercase tracking-wider shrink-0 ${
            activeTab === 'impact'
              ? 'border-[#ff5000] text-[#ff5000]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>AI Impact</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('peer-review')}
          className={`flex items-center gap-2 pb-3 px-3.5 text-xs font-bold transition-all border-b-2 cursor-pointer font-space uppercase tracking-wider shrink-0 ${
            activeTab === 'peer-review'
              ? 'border-[#ff5000] text-[#ff5000]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>Supervisor Directives</span>
        </button>
      </div>

      {/* ==================== TAB: CLIENT READY POSTERS ==================== */}
      {activeTab === 'client-ready' && (
        <AdminClientReadyPosters
          submissions={submissions}
          brands={brands}
          onSelectSubmission={(subId) => {
            const found = submissions.find((s) => s.id === subId);
            if (found && onSelectSubmission) {
              onSelectSubmission(found);
            }
          }}
          onOpenScoreReport={(sub) => setSelectedSubForReportModal(sub)}
        />
      )}

      {/* ==================== TAB: EMPLOYEE REPORT ==================== */}
      {activeTab === 'employee-report' && (
        <AdminEmployeeReport
          submissions={submissions}
          onSelectSubmission={(subId) => {
            const found = submissions.find((s) => s.id === subId);
            if (found && onSelectSubmission) {
              onSelectSubmission(found);
            }
          }}
          onOpenScoreReport={(sub) => setSelectedSubForReportModal(sub)}
        />
      )}

      {/* ==================== TAB 1: ALL POSTERS & SUBMISSIONS ==================== */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          {/* Controls Bar: Search, Brand Filter, Status Filter, Layout Toggle */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              <div className="relative min-w-[220px] flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search campaign, brand or creator..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#ff5000] focus:bg-white focus:outline-none font-sans"
                />
              </div>

              {/* Brand Filter Pill Select */}
              <select
                value={selectedBrandId}
                onChange={(e) => setSelectedBrandId(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-[#ff5000] focus:outline-none cursor-pointer font-space font-medium"
              >
                <option value="ALL">All Brands ({brands.length})</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-[#ff5000] focus:outline-none cursor-pointer font-space font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="APPROVED">AI Approved</option>
                <option value="QUEUE">Pending Review</option>
                <option value="REWORK">Needs Rework</option>
              </select>
            </div>

            {/* View Mode Switcher: Showcase / Grid / Table */}
            <div className="flex items-center gap-1 self-end sm:self-auto border border-slate-200 rounded-xl p-1 bg-slate-50">
              <button
                type="button"
                onClick={() => setViewMode('showcase')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-space font-bold transition-all cursor-pointer ${
                  viewMode === 'showcase'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Editorial Showcase View"
              >
                <Columns2 className="h-3.5 w-3.5 text-[#ff5000]" />
                <span className="hidden sm:inline">Showcase</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-slate-900 text-[#ff5000] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-slate-900 text-[#ff5000] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Table View"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* 1. EDITORIAL SHOWCASE VIEW (Matching reference design directly) */}
          {viewMode === 'showcase' && (
            <div className="space-y-6">
              {filteredSubmissions.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
                  <FolderKanban className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                  <h3 className="text-sm font-bold font-syne text-slate-900">No Submissions Matching Filter</h3>
                  <p className="text-xs text-slate-500 mt-1">Try resetting the brand or status filters to view creatives.</p>
                </div>
              ) : (
                filteredSubmissions.map((sub, index) => {
                  const isApproved = sub.workflowStatus === 'APPROVED';
                  const isAwaiting =
                    sub.workflowStatus === 'AWAITING_SUPERVISOR_REVIEW' ||
                    sub.workflowStatus === 'AWAITING_MANAGER_REVIEW' ||
                    sub.workflowStatus === 'AWAITING_REVIEW';
                  const latestFile = sub.versions[sub.versions.length - 1]?.files[0];
                  const indexNumber = String(index + 1).padStart(2, '0');
                  const formattedDate = new Date(sub.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  });

                  return (
                    <div
                      key={`${sub.id}-${index}`}
                      className="group rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl transition-all hover:border-[#ff5000]/60"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
                        {/* LEFT HALF (6 cols): Visual Viewport + High-Octane Vermilion Orange Block */}
                        <div className="lg:col-span-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#383842]">
                          {/* Top: Media Viewport */}
                          {sub.canvaUrl && (!latestFile?.fileUrl || latestFile.fileUrl === '' || latestFile.fileUrl.startsWith('data:application/x-canva') || sub.canvaPreviewState === 'LINK_ONLY') ? (
                            <div className="p-4 bg-[#121215]">
                              <CanvaThumbnailTile
                                canvaUrl={sub.canvaUrl!}
                                designId={sub.canvaDesignId}
                                campaignName={sub.campaignName}
                                onClick={() => onSelectSubmission && onSelectSubmission(sub)}
                              />
                            </div>
                          ) : (
                            <div
                              className="relative h-64 sm:h-72 bg-[#121215] flex items-center justify-center p-4 cursor-pointer overflow-hidden group/img"
                              onClick={() => onSelectSubmission && onSelectSubmission(sub)}
                            >
                              <img
                                src={latestFile?.fileUrl}
                                alt={sub.campaignName}
                                className="max-h-full max-w-full object-contain rounded-xl transition-transform duration-500 group-hover/img:scale-105"
                              />

                              {/* Index Counter */}
                              <div className="absolute top-4 left-4 rounded-full bg-[#19191d]/85 backdrop-blur-md border border-white/15 px-3 py-1 text-xs font-space font-semibold text-white">
                                {index + 1} / {filteredSubmissions.length}
                              </div>

                              {/* Brand Chip */}
                              <div className="absolute top-4 right-4 rounded-full bg-[#ff5000] px-3.5 py-1 text-[11px] font-space font-bold uppercase tracking-wider text-white shadow-md">
                                {sub.brandName}
                              </div>

                              {/* Plus inspect button */}
                              <button
                                type="button"
                                className="absolute bottom-4 right-4 h-9 w-9 rounded-full bg-[#19191d]/85 hover:bg-[#ff5000] text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg"
                                title="Inspect Creative"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectSubmission && onSelectSubmission(sub);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          )}

                          {/* Bottom: Solid Electric Vermilion Orange Block */}
                          <div className="bg-[#ff5000] text-white p-6 sm:p-7 flex flex-col justify-between gap-5 flex-1">
                            <div className="flex items-center justify-between text-xs font-space font-bold tracking-wider">
                              <span className="text-2xl font-space font-black">{indexNumber}</span>
                              <span className="opacity-90">{formattedDate}</span>
                            </div>

                            <div>
                              <h3 className="text-2xl sm:text-3xl font-black font-syne tracking-tight leading-tight text-white drop-shadow-xs">
                                {sub.campaignName}
                              </h3>
                              <p className="text-xs text-white/85 font-space mt-1 uppercase tracking-wide">
                                Brand: {sub.brandName} &bull; Creator: {sub.userName}
                              </p>
                            </div>

                            {/* Structured coordinates & parameters grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/25 text-xs font-space">
                              <div>
                                <span className="block text-[10px] text-white/75 uppercase tracking-wider">AI Gate Score</span>
                                <strong className="block text-sm text-white font-bold">{sub.overallAiScore}% PASS</strong>
                              </div>
                              <div>
                                <span className="block text-[10px] text-white/75 uppercase tracking-wider">Revision</span>
                                <strong className="block text-sm text-white font-bold">V{sub.currentVersion} Active</strong>
                              </div>
                              <div>
                                <span className="block text-[10px] text-white/75 uppercase tracking-wider">Pass Threshold</span>
                                <strong className="block text-sm text-white font-bold">&ge;{systemSettings.aiApprovalThreshold}% Minimum</strong>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT HALF (6 cols): Matte Obsidian Charcoal Editorial Panel */}
                        <div className="lg:col-span-6 bg-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between gap-6">
                          <div className="space-y-6">
                            {/* Section 1: "About Creative" with vertical line & circle node */}
                            <div className="relative pl-6">
                              {/* Thin vertical line with circle node at top right */}
                              <div className="absolute left-0 top-1 bottom-1 w-[1px] bg-slate-700">
                                <div className="absolute -top-1 -left-[3.5px] h-2 w-2 rounded-full border border-[#ff5000] bg-slate-900"></div>
                              </div>

                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-space">
                                  About poster compliance
                                </h4>
                                <span
                                  className={`rounded-full px-3 py-0.5 text-[10px] font-space font-bold uppercase tracking-wider ${
                                    isApproved
                                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                      : isAwaiting
                                      ? 'bg-[#ff5000]/20 text-[#ff5000] border border-[#ff5000]/40'
                                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                                  }`}
                                >
                                  {isApproved ? 'AI Approved' : isAwaiting ? 'Passing Gate' : 'Needs Rework'}
                                </span>
                              </div>

                              {(() => {
                                const latestVer = sub.versions[sub.versions.length - 1];
                                const params = latestVer?.analysisResult?.parameters || [];
                                const summary =
                                  latestVer?.analysisResult?.executiveSummary ||
                                  'Pre-flight creative audit verifying quadrant logo margins, compliant palette fidelity, legibility ratios, and mandatory legal disclaimers.';

                                return (
                                  <>
                                    <p className="mt-2 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans font-light">
                                      {summary}
                                    </p>

                                    <button
                                      type="button"
                                      onClick={() => onSelectSubmission && onSelectSubmission(sub)}
                                      className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-[#ff5000] hover:text-[#ff7333] transition-colors cursor-pointer font-space"
                                    >
                                      <span>Read full parameter breakdown</span>
                                      <span>&rarr;</span>
                                    </button>
                                  </>
                                );
                              })()}
                            </div>

                            {/* Section 2: "Guideline Rules Evaluated" */}
                            <div className="relative pl-6 pt-2">
                              <div className="absolute left-0 top-1 bottom-1 w-[1px] bg-slate-700">
                                <div className="absolute -top-1 -left-[3.5px] h-2 w-2 rounded-full border border-slate-600 bg-slate-900"></div>
                              </div>

                              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-space">
                                Evaluated Brand Rules
                              </h4>

                              {(() => {
                                const latestVer = sub.versions[sub.versions.length - 1];
                                const params = latestVer?.analysisResult?.parameters || [];

                                return (
                                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {params.slice(0, 4).map((ev) => (
                                      <div
                                        key={ev.parameterId || ev.name}
                                        className="rounded-xl border border-slate-800 bg-slate-800/80 p-3 text-xs flex items-center justify-between"
                                      >
                                        <div className="min-w-0 pr-2">
                                          <p className="font-semibold text-white truncate text-[11px] font-sans">
                                            {ev.name}
                                          </p>
                                          <span className="text-[10px] text-slate-400 font-space">
                                            Weight: {ev.weight}x
                                          </span>
                                        </div>
                                        <span
                                          className={`font-space font-bold text-xs px-2 py-0.5 rounded ${
                                            ev.score >= systemSettings.aiApprovalThreshold
                                              ? 'bg-emerald-950 text-emerald-400'
                                              : 'bg-amber-950 text-amber-400'
                                          }`}
                                        >
                                          {ev.score}%
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>

                          {/* Bottom Controls Bar */}
                          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => onSelectSubmission && onSelectSubmission(sub)}
                              className="text-xs font-space font-medium text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <span>&larr;</span>
                              <span>Inspect Revision History</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onSelectSubmission && onSelectSubmission(sub)}
                              className="flex items-center gap-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 px-4 py-2.5 text-xs font-bold font-syne transition-all cursor-pointer shadow-md hover:shadow-lg"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>Audit Report</span>
                              <span>&rarr;</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* GRID VIEW */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubmissions.map((sub, gIdx) => {
                const isApproved = sub.workflowStatus === 'APPROVED';
                const isAwaiting =
                  sub.workflowStatus === 'AWAITING_SUPERVISOR_REVIEW' ||
                  sub.workflowStatus === 'AWAITING_MANAGER_REVIEW' ||
                  sub.workflowStatus === 'AWAITING_REVIEW';
                const latestFile = sub.versions[sub.versions.length - 1]?.files[0];

                return (
                  <div
                    key={`${sub.id}-${gIdx}`}
                    className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-md hover:border-[#ff5000]/60 transition-all flex flex-col"
                  >
                    {/* Poster Preview */}
                    {sub.canvaUrl && (!latestFile?.fileUrl || latestFile.fileUrl === '' || latestFile.fileUrl.startsWith('data:application/x-canva') || sub.canvaPreviewState === 'LINK_ONLY') ? (
                      <div className="p-3 bg-slate-900">
                        <CanvaThumbnailTile
                          canvaUrl={sub.canvaUrl!}
                          designId={sub.canvaDesignId}
                          campaignName={sub.campaignName}
                          onClick={() => onSelectSubmission && onSelectSubmission(sub)}
                        />
                      </div>
                    ) : (
                      <div
                        className="relative h-56 bg-slate-900 overflow-hidden cursor-pointer flex items-center justify-center p-3"
                        onClick={() => onSelectSubmission && onSelectSubmission(sub)}
                      >
                        <img
                          src={latestFile?.fileUrl}
                          alt={sub.campaignName}
                          className="max-h-full max-w-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Brand Pill */}
                        <span className="absolute top-2.5 left-2.5 rounded-md bg-slate-900/85 backdrop-blur-xs border border-white/15 px-2 py-0.5 text-[10px] font-bold text-white font-space">
                          {sub.brandName}
                        </span>

                        {/* Score Badge */}
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-md bg-white/95 px-2 py-0.5 shadow-xs font-space">
                          <span
                            className={`text-xs font-black ${
                              sub.overallAiScore >= systemSettings.aiApprovalThreshold
                                ? 'text-emerald-700'
                                : 'text-[#ff5000]'
                            }`}
                          >
                            {sub.overallAiScore}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 font-syne line-clamp-1">
                          {sub.campaignName}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-space mt-0.5">
                          Submitted by {sub.userName} &bull; V{sub.currentVersion}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        {/* Status Label */}
                        <div className="flex items-center gap-1 text-[11px] font-space font-bold">
                          {isApproved && (
                            <span className="flex items-center gap-1 text-emerald-700">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>AI Approved</span>
                            </span>
                          )}
                          {isAwaiting && (
                            <span className="flex items-center gap-1 text-[#ff5000]">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Passing Gate</span>
                            </span>
                          )}
                          {!isApproved && !isAwaiting && (
                            <span className="flex items-center gap-1 text-amber-700">
                              <AlertTriangle className="h-3.5 w-3.5" />
                              <span>Needs Rework</span>
                            </span>
                          )}
                        </div>

                        {/* View Button */}
                        <button
                          type="button"
                          onClick={() => onSelectSubmission && onSelectSubmission(sub)}
                          className="flex items-center gap-1 rounded-lg bg-slate-900 hover:bg-[#ff5000] text-white px-2.5 py-1 text-xs font-bold font-syne transition-colors cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Audit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TABLE VIEW */}
          {viewMode === 'table' && (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-800">
                  <thead className="bg-slate-50 text-[10px] uppercase font-space font-bold tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Asset &amp; Campaign</th>
                      <th className="py-3 px-4">Brand</th>
                      <th className="py-3 px-4">Submitted By</th>
                      <th className="py-3 px-4">AI Score</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredSubmissions.map((sub, tIdx) => {
                      const isApproved = sub.workflowStatus === 'APPROVED';
                      const latestFile = sub.versions[sub.versions.length - 1]?.files[0];

                      return (
                        <tr key={`${sub.id}-${tIdx}`} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={latestFile?.fileUrl}
                                alt=""
                                className="h-10 w-10 rounded-lg object-contain bg-slate-900 border border-slate-200"
                              />
                              <div>
                                <div className="font-bold text-slate-900 font-syne">{sub.campaignName}</div>
                                <div className="text-[10px] text-slate-500 font-space">
                                  V{sub.currentVersion} &bull; Image Creative
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 font-semibold text-slate-900 font-space">{sub.brandName}</td>
                          <td className="py-3 px-4 text-slate-500">{sub.userName}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`font-space font-black text-xs ${
                                sub.overallAiScore >= systemSettings.aiApprovalThreshold
                                  ? 'text-emerald-700'
                                  : 'text-[#ff5000]'
                              }`}
                            >
                              {sub.overallAiScore}%
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-space font-bold uppercase tracking-wider ${
                                isApproved
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {isApproved ? 'Approved' : 'Needs Rework'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => onSelectSubmission && onSelectSubmission(sub)}
                              className="rounded-lg bg-slate-900 hover:bg-[#ff5000] text-white px-3 py-1.5 text-xs font-bold font-syne transition-colors cursor-pointer"
                            >
                              View Report
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredSubmissions.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500 font-space">
              No creative submissions match your current filters.
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB: REVIEW VELOCITY & TURNAROUND STATS ==================== */}
      {activeTab === 'velocity' && (
        <ReviewVelocityStatsView
          onSelectSubmission={(subId) => {
            const found = submissions.find((s) => s.id === subId);
            if (found && onSelectSubmission) {
              onSelectSubmission(found);
            }
          }}
        />
      )}

      {/* ==================== TAB: PEER REVIEW & TEAM DISCUSSIONS ==================== */}
      {activeTab === 'peer-review' && (() => {
        const activeSub =
          submissions.find((s) => s.id === selectedPeerSubId) ||
          submissions.find((s) => s.comments && s.comments.length > 0) ||
          submissions[0];
        const latestVer = activeSub?.versions?.[activeSub.versions.length - 1];
        const file = latestVer?.files?.[0];

        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 text-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#ff5000]">
                    [ APPOINTED SUPERVISOR OVERSIGHT &bull; DIRECT REVIEWS ]
                  </span>
                  <span className="text-slate-500">&bull;</span>
                  <span className="text-xs font-space font-semibold text-slate-400">
                    1-on-1 Review Directives
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black font-syne text-white tracking-tight mt-1">
                  Appointed Supervisor Review &amp; Directives Governance
                </h2>
                <p className="text-xs text-slate-400 font-sans max-w-2xl mt-1">
                  Oversight of designated supervisor review pipelines. Direct 1-on-1 feedback between appointed supervisors (Marcus Vance, Elena Rostova, David Cho) and creators. Replaces whole-team crowdsourcing with accountable individual leadership.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-3 text-right">
                <span className="text-[10px] font-space font-bold uppercase tracking-widest text-slate-400 block">
                  Total Directives &amp; Notes
                </span>
                <span className="text-2xl font-black font-space text-[#ff5000]">
                  {submissions.reduce((acc, s) => acc + (s.comments?.length || 0), 0)}
                </span>
              </div>
            </div>

            {/* Main Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Submissions Selector (4 cols) */}
              <div className="lg:col-span-4 space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold font-syne text-slate-900">
                      Creatives &amp; Appointed Supervisors
                    </span>
                    <span className="text-[10px] font-space font-bold text-slate-400">
                      {submissions.length} Posts
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                    {submissions.map((s, sIdx) => {
                      const isSelected = s.id === activeSub?.id;
                      const cCount = s.comments?.length || 0;
                      const sFile = s.versions?.[s.versions.length - 1]?.files?.[0];

                      return (
                        <button
                          key={`${s.id}-${sIdx}`}
                          type="button"
                          onClick={() => setSelectedPeerSubId(s.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#ff5000] bg-orange-50/60 ring-1 ring-[#ff5000]'
                              : 'border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="h-12 w-12 rounded-lg bg-slate-200 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                            {sFile?.fileUrl ? (
                              <img
                                src={sFile.fileUrl}
                                alt={s.campaignName}
                                className="h-full w-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <FileImage className="h-5 w-5 text-slate-400" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold font-syne text-slate-900 truncate">
                              {s.campaignName}
                            </p>
                            <p className="text-[11px] font-space text-slate-500 truncate">
                              {s.brandName} &bull; {s.creatorName}
                            </p>
                            <p className="text-[10px] font-space font-semibold text-[#ff5000] truncate">
                              Supervisor: {s.assignedSupervisorName || 'Marcus Vance'}
                            </p>
                            <div className="mt-1 flex items-center justify-between">
                              <span
                                className={`rounded px-1.5 py-0.2 text-[9px] font-space font-bold ${
                                  s.overallAiScore >= systemSettings.aiApprovalThreshold
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                AI: {s.overallAiScore}%
                              </span>
                              <span
                                className={`flex items-center gap-1 text-[10px] font-space font-semibold px-2 py-0.5 rounded-full ${
                                  cCount > 0
                                    ? 'bg-[#ff5000]/15 text-[#ff5000] border border-[#ff5000]/30'
                                    : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                <MessageSquare className="h-3 w-3" />
                                {cCount} {cCount === 1 ? 'Note' : 'Notes'}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Selected Creative & Peer Discussion (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                {activeSub && (
                  <>
                    {/* Header Summary for Selected Post */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-14 rounded-xl bg-slate-900 overflow-hidden border border-slate-200 shrink-0 flex items-center justify-center">
                          {file?.fileUrl ? (
                            <img
                              src={file.fileUrl}
                              alt={activeSub.campaignName}
                              className="h-full w-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <FileImage className="h-6 w-6 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-slate-900 text-white px-2 py-0.5 text-[10px] font-space font-bold">
                              {activeSub.brandName}
                            </span>
                            <span className="text-slate-300">&bull;</span>
                            <span className="text-xs font-space text-slate-500">
                              Creator: <strong>{activeSub.creatorName}</strong>
                            </span>
                          </div>
                          <h3 className="text-lg font-black font-syne text-slate-900 mt-1">
                            {activeSub.campaignName}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] font-space font-bold uppercase tracking-wider text-slate-400 block">
                            AI Score
                          </span>
                          <span
                            className={`text-xl font-black font-space ${
                              activeSub.overallAiScore >= systemSettings.aiApprovalThreshold
                                ? 'text-emerald-600'
                                : 'text-[#ff5000]'
                            }`}
                          >
                            {activeSub.overallAiScore}%
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => onSelectSubmission && onSelectSubmission(activeSub)}
                          className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 text-xs font-bold font-syne transition-colors cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 text-[#ff5000]" />
                          <span>Audit Report</span>
                        </button>
                      </div>
                    </div>

                    {/* Embedded Supervisor / Employee Directives Section */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                      {activeSub.overallAiScore >= 90 ? (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 text-center space-y-2">
                          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm mb-1">
                            <ShieldCheck className="h-5 w-5" />
                          </div>
                          <h4 className="text-sm font-bold font-syne text-emerald-900">
                            AI Approved (Score {activeSub.overallAiScore}% &ge; 90%)
                          </h4>
                          <p className="text-xs text-slate-600 font-sans max-w-md mx-auto leading-relaxed">
                            This asset achieved {activeSub.overallAiScore}% compliance and is certified AI Approved. Per governance protocol, administrative access to the supervisor and employee chat box is restrained.
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
                            loadData();
                          }}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ==================== TAB 2: UPCOMING PROJECTS & GUIDELINES ==================== */}
      {activeTab === 'projects' && (
        <AdminProjectManagement onProjectCreated={() => loadData()} />
      )}

      {/* ==================== TAB 3: BRAND GUIDELINES & TOOLKIT ==================== */}
      {activeTab === 'brands' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold font-syne text-slate-900">
                Enterprise Brand Design Systems &amp; Pre-flight Toolkits
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                Each brand maintains explicit color themes, allowed font families, safe margins, and disclaimer requirements checked by Gemini multimodal vision.
              </p>
            </div>
            <span className="rounded-full bg-[#ff5000]/10 text-[#ff5000] px-3 py-1 text-xs font-bold font-space">
              {brands.length} Active Brand Profiles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands.map((b, bIdx) => {
              const brandParams = parameters.filter((p) => p.brandId === b.id);
              const brandSubs = submissions.filter((s) => s.brandId === b.id);
              const primaryColors: string[] = Array.isArray(b.colorPalette?.primary)
                ? b.colorPalette.primary
                : typeof b.colorPalette?.primary === 'string'
                ? [b.colorPalette.primary]
                : ['#ff5000', '#19191d'];

              return (
                <div
                  key={`${b.id}-${bIdx}`}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={b.logo || '/assets/posters/nmc-independence.svg'}
                          alt={b.name}
                          className="h-10 w-10 rounded-xl object-contain bg-slate-900 p-1 border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="font-bold text-base font-syne text-slate-900 truncate">{b.name}</h3>
                          <span className="text-[10px] uppercase font-space font-bold tracking-wider text-slate-500">
                            {b.description || 'Enterprise Brand'}
                          </span>
                        </div>
                      </div>
                      <span className="rounded-full bg-slate-900 text-white px-3 py-1 text-[10px] font-space font-bold shrink-0">
                        {brandSubs.length} Posters
                      </span>
                    </div>

                    {/* Colors */}
                    <div>
                      <span className="text-[10px] font-space font-bold uppercase tracking-wider text-slate-500 block mb-2">
                        Official Color Palette
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {primaryColors.map((hex, hIdx) => (
                          <div key={`${hex}-${hIdx}`} className="flex items-center gap-1.5 text-[10px] font-space font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 shadow-xs">
                            <div
                              className="h-3.5 w-3.5 rounded-full border border-black/15 shadow-xs"
                              style={{ backgroundColor: hex }}
                            />
                            <span>{hex}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Allowed Fonts & Toolkit Preview */}
                    <div>
                      <span className="text-[10px] font-space font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                        Allowed Fonts &amp; Safe Margins
                      </span>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {(b.toolkit?.allowedFonts || [b.typography?.primaryFont || 'Inter', 'Montserrat']).map((f, fIdx) => (
                          <span key={`${f}-${fIdx}`} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold font-syne text-slate-700">
                            {f}
                          </span>
                        ))}
                      </div>
                      <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside font-sans">
                        <li>Safe zone buffer: {b.toolkit?.safeMargins?.dangerZoneBufferPercent ?? b.logoRules?.safeZonePercent ?? 12}%</li>
                        <li>{brandParams.length} automated check parameters</li>
                      </ul>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingBrandForToolkit(b)}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-xs font-bold font-syne text-slate-800 transition-colors cursor-pointer"
                    >
                      <Palette className="h-3.5 w-3.5 text-[#ff5000]" />
                      <span>Edit Toolkit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBrandId(b.id);
                        handleTabChange('submissions');
                      }}
                      className="rounded-xl bg-slate-900 hover:bg-[#ff5000] text-white px-3.5 py-1.5 text-xs font-bold font-syne transition-colors cursor-pointer"
                    >
                      Filter Posters &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Brand Toolkit Editor Modal */}
      {editingBrandForToolkit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl my-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-base font-bold font-syne text-slate-900">
                  Configure Brand Toolkit: {editingBrandForToolkit.name}
                </h2>
                <p className="text-xs text-slate-500 font-sans">
                  Allowed fonts, color palettes, safe margins, and disclaimer text for this brand.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingBrandForToolkit(null)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <BrandToolkitEditor
              brandId={editingBrandForToolkit.id}
              brandName={editingBrandForToolkit.name}
              initialToolkit={editingBrandForToolkit.toolkit}
              initialColors={{
                primary: typeof editingBrandForToolkit.colorPalette?.primary === 'string'
                  ? editingBrandForToolkit.colorPalette.primary
                  : '#0F172A',
                secondary: typeof editingBrandForToolkit.colorPalette?.secondary === 'string'
                  ? editingBrandForToolkit.colorPalette.secondary
                  : '#ff5000',
                forbidden: editingBrandForToolkit.colorPalette?.forbidden || [],
              }}
              initialFonts={{
                primaryFont: editingBrandForToolkit.typography?.primaryFont || 'Inter',
                minHeadingSize: editingBrandForToolkit.typography?.minHeadingSize || '24px',
                minBodySize: editingBrandForToolkit.typography?.minBodySize || '14px',
              }}
              onSave={() => {
                loadData();
                setEditingBrandForToolkit(null);
              }}
            />
          </div>
        </div>
      )}

      {/* ==================== TAB: AI IMPACT (STRICTLY LAST) ==================== */}
      {activeTab === 'impact' && (
        <AdminAiImpactSection totalSubmissionsCount={submissions.length} />
      )}

      {/* Score Report Modal */}
      {selectedSubForReportModal && (
        <ScoreReportModal
          isOpen={!!selectedSubForReportModal}
          submission={selectedSubForReportModal}
          onClose={() => setSelectedSubForReportModal(null)}
          onOpenRework={() => {
            setSelectedSubForReportModal(null);
          }}
        />
      )}
    </div>
  );
};
