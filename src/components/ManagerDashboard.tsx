import React, { useState } from 'react';
import { Submission, Brand } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  Check,
  Building2,
  FileVideo,
  FileImage,
  Layers,
  FolderArchive,
  Link2,
} from 'lucide-react';

interface ManagerDashboardProps {
  submissions: Submission[];
  brands: Brand[];
  onOpenReviewScreen: (submission: Submission) => void;
  onOpenScoreReport: (submission: Submission) => void;
  onManagerReview: (
    submissionId: string,
    decision: 'APPROVED' | 'REQUEST_CHANGES' | 'REJECTED',
    comment?: string
  ) => Promise<void>;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  submissions,
  brands,
  onOpenReviewScreen,
  onOpenScoreReport,
  onManagerReview,
}) => {
  const { currentUser, systemSettings } = useAuth();

  const [filterBrand, setFilterBrand] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('AWAITING_SUPERVISOR_REVIEW');
  const [filterMediaType, setFilterMediaType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Metrics
  const pendingReview = submissions.filter(
    (s) =>
      s.workflowStatus === 'AWAITING_SUPERVISOR_REVIEW' ||
      (s.workflowStatus as string) === 'AWAITING_MANAGER_REVIEW'
  );
  const approved = submissions.filter((s) => s.workflowStatus === 'APPROVED');
  const changesRequested = submissions.filter((s) => s.workflowStatus === 'CHANGES_REQUESTED');
  const rejected = submissions.filter((s) => s.workflowStatus === 'REJECTED');

  const avgAiScore =
    submissions.length > 0
      ? Math.round(submissions.reduce((acc, s) => acc + s.overallAiScore, 0) / submissions.length)
      : 0;

  const filtered = submissions.filter((s) => {
    const matchSearch =
      s.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.brandName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBrand = filterBrand === 'ALL' || s.brandId === filterBrand;
    const matchStatus = filterStatus === 'ALL' || s.workflowStatus === filterStatus;
    const matchMedia = filterMediaType === 'ALL' || s.mediaType === filterMediaType;
    return matchSearch && matchBrand && matchStatus && matchMedia;
  });

  return (
    <div className="space-y-6">
      {/* Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Review &amp; Governance
            </span>
            <span className="text-xs text-slate-500 font-sans">
              Signed in as <strong className="text-slate-800 font-medium">{currentUser?.name || 'Elena Rostova'}</strong>
            </span>
          </div>
          <h1 className="text-xl font-bold font-syne text-slate-900 tracking-tight mt-1">
            Human Approval Queue
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Audit high-scoring media creatives (&ge;{systemSettings.aiApprovalThreshold}%), verify parameter citations, and issue supervisor sign-off.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-right">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Pending Review</div>
            <div className="text-lg font-bold font-syne text-slate-900">{pendingReview.length}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-right">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Pass Gate</div>
            <div className="text-lg font-bold font-syne text-slate-900">{systemSettings.aiApprovalThreshold}%</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div
          onClick={() => setFilterStatus('AWAITING_SUPERVISOR_REVIEW')}
          className={`cursor-pointer rounded-xl border p-4 shadow-2xs transition-all ${
            filterStatus === 'AWAITING_SUPERVISOR_REVIEW' || filterStatus === 'AWAITING_MANAGER_REVIEW'
              ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-blue-800">
            <span>Awaiting Review</span>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{pendingReview.length}</div>
          <p className="mt-1 text-[10px] text-slate-500">
            Passed AI threshold &ge;{systemSettings.aiApprovalThreshold}%
          </p>
        </div>

        <div
          onClick={() => setFilterStatus('APPROVED')}
          className={`cursor-pointer rounded-xl border p-4 shadow-2xs transition-all ${
            filterStatus === 'APPROVED'
              ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            <span>Human Approved</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{approved.length}</div>
          <p className="mt-1 text-[10px] text-slate-500">Cleared for live launch</p>
        </div>

        <div
          onClick={() => setFilterStatus('CHANGES_REQUESTED')}
          className={`cursor-pointer rounded-xl border p-4 shadow-2xs transition-all ${
            filterStatus === 'CHANGES_REQUESTED'
              ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-amber-800">
            <span>Changes Requested</span>
            <RotateCcw className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{changesRequested.length}</div>
          <p className="mt-1 text-[10px] text-slate-500">Returned with manager instructions</p>
        </div>

        <div
          onClick={() => setFilterStatus('REJECTED')}
          className={`cursor-pointer rounded-xl border p-4 shadow-2xs transition-all ${
            filterStatus === 'REJECTED'
              ? 'border-red-500 bg-red-50/50 ring-2 ring-red-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-red-800">
            <span>Rejected</span>
            <XCircle className="h-4 w-4 text-red-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{rejected.length}</div>
          <p className="mt-1 text-[10px] text-slate-500">Non-compliant / cancelled</p>
        </div>
      </div>

      {/* Review Queue Table with Interactive Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        {/* Table Filter Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {filterStatus === 'AWAITING_SUPERVISOR_REVIEW' || filterStatus === 'AWAITING_MANAGER_REVIEW'
                ? 'Active Review Queue (Awaiting Decision)'
                : 'All Reviewed Media Submissions'}
            </h2>
            <p className="text-xs text-slate-500">
              Inspect multimodal evidence, frame-by-frame timestamps, and grant approval
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search creative, brand, employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Brand Filter */}
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">All Brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="AWAITING_SUPERVISOR_REVIEW">Awaiting Supervisor Review</option>
              <option value="APPROVED">Approved</option>
              <option value="CHANGES_REQUESTED">Changes Requested</option>
              <option value="REJECTED">Rejected</option>
              <option value="NEEDS_IMPROVEMENT">Needs Improvement (Employee Rework)</option>
            </select>

            {/* Media Type */}
            <select
              value={filterMediaType}
              onChange={(e) => setFilterMediaType(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">All Media</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
            </select>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <FileCheck2 className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-600">No submissions in queue</p>
              <p className="text-[11px] text-slate-400 mt-1">
                All high-scoring media assets have been evaluated or no matching filter.
              </p>
            </div>
          ) : (
            filtered.map((sub, mIdx) => {
              const latestFile = sub.versions[sub.versions.length - 1]?.files[0];
              const isAwaiting =
                sub.workflowStatus === 'AWAITING_SUPERVISOR_REVIEW' ||
                (sub.workflowStatus as string) === 'AWAITING_MANAGER_REVIEW';

              return (
                <div
                  key={`${sub.id}-${mIdx}`}
                  className="flex flex-col gap-4 p-4 transition-colors hover:bg-slate-50/80 sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
                      <img
                        src={latestFile?.fileUrl}
                        alt={sub.campaignName}
                        className="h-full w-full object-cover"
                      />
                      {sub.mediaType === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                          <FileVideo className="h-4 w-4" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xs font-bold text-slate-900 truncate">
                          {sub.campaignName}
                        </h3>
                        <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-bold text-slate-600 border border-slate-200">
                          V{sub.currentVersion}
                        </span>
                        {sub.canvaUrl && (
                          <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-space font-bold bg-[#ff5000]/10 text-[#ff5000] border border-[#ff5000]/20">
                            <Link2 className="w-2.5 h-2.5" />
                            <span>Canva</span>
                          </span>
                        )}
                        {sub.driveArchive && (
                          <a
                            href={sub.driveArchive.folderUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-space font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
                            title="Open Google Drive Project Archive"
                          >
                            <FolderArchive className="w-2.5 h-2.5" />
                            <span>Drive Archive</span>
                          </a>
                        )}
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-800">{sub.brandName}</span>
                        <span>•</span>
                        <span>By {sub.userName}</span>
                        <span>•</span>
                        <span>{new Date(sub.updatedAt).toLocaleDateString()}</span>
                      </div>

                      {/* Brief AI note */}
                      <p className="mt-1 text-[11px] text-slate-500 line-clamp-1">
                        {sub.versions[sub.versions.length - 1]?.analysisResult?.executiveSummary}
                      </p>
                    </div>
                  </div>

                  {/* Center: AI Score & Confidence */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                        <span
                          className={`text-lg font-black ${
                            sub.overallAiScore >= systemSettings.aiApprovalThreshold
                              ? 'text-emerald-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {sub.overallAiScore}%
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        Conf: {Math.round(sub.overallAiConfidence * 100)}%
                      </span>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                        sub.workflowStatus === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : sub.workflowStatus === 'AWAITING_SUPERVISOR_REVIEW' ||
                            (sub.workflowStatus as string) === 'AWAITING_MANAGER_REVIEW'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : sub.workflowStatus === 'CHANGES_REQUESTED'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {sub.workflowStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onOpenScoreReport(sub)}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                    >
                      <Eye className="h-3.5 w-3.5 text-slate-500" />
                      <span>Score Report</span>
                    </button>

                    {isAwaiting ? (
                      <button
                        onClick={() => onOpenReviewScreen(sub)}
                        className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-blue-700 active:scale-95 transition-all"
                      >
                        <FileCheck2 className="h-3.5 w-3.5" />
                        <span>Review &amp; Decide</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenReviewScreen(sub)}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <span>Inspect</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
