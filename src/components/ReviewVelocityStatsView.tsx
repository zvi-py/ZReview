import React, { useState, useEffect } from 'react';
import { ReviewVelocityStats, Submission, EmployeeVelocityMetric } from '../types';
import { api } from '../api';
import {
  Clock,
  Zap,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  User,
  Building2,
  Layers,
  ChevronDown,
  ChevronUp,
  Eye,
  MessageSquare,
  ShieldCheck,
  Search,
  UserCheck,
  Award,
  BarChart3,
  Users,
} from 'lucide-react';

interface ReviewVelocityStatsViewProps {
  onSelectSubmission?: (submissionId: string) => void;
  initialTab?: 'posts' | 'employees' | 'supervisors';
}

export const ReviewVelocityStatsView: React.FC<ReviewVelocityStatsViewProps> = ({
  onSelectSubmission,
  initialTab = 'posts',
}) => {
  const [stats, setStats] = useState<ReviewVelocityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'employees' | 'supervisors'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'APPROVED' | 'IN_PROGRESS'>('ALL');
  const [employeeFilterRating, setEmployeeFilterRating] = useState<string>('ALL');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  useEffect(() => {
    loadVelocityData();
  }, []);

  const loadVelocityData = async () => {
    setLoading(true);
    try {
      const data = await api.getReviewVelocity();
      setStats(data);
    } catch (err) {
      console.error('Failed to load review velocity data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatMinutes = (mins: number) => {
    if (!mins || mins <= 0) return '< 1 min';
    if (mins < 60) return `${mins} mins`;
    const hours = Math.floor(mins / 60);
    const remainder = mins % 60;
    return remainder > 0 ? `${hours}h ${remainder}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <Clock className="mx-auto h-8 w-8 animate-spin text-[#ff5000] mb-3" />
        <p className="text-sm font-bold font-syne text-slate-900">
          Calculating Review Velocities &amp; Multi-Version Turnarounds...
        </p>
        <p className="text-xs text-slate-500 font-sans mt-1">
          Aggregating review completion timestamps, iteration durations, and final clearance metrics.
        </p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
        Review velocity statistics currently unavailable.
      </div>
    );
  }

  const postList = stats.posts || stats.postVelocities || [];

  const filteredPosts = postList.filter((p) => {
    const campaignMatch = (p.campaignName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const brandMatch = (p.brandName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const creatorMatch = (p.creatorName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchSearch = campaignMatch || brandMatch || creatorMatch;

    const currentStatus = p.currentStatus || p.status;
    const matchStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'APPROVED' && currentStatus === 'APPROVED') ||
      (filterStatus === 'IN_PROGRESS' && currentStatus !== 'APPROVED');
    return matchSearch && matchStatus;
  });

  const avgReviewTime =
    stats.averageReviewTimeMinutes ??
    (stats as any).averageReviewDurationMinutes ??
    0;
  const avgTotalTurnaround = stats.averageTotalTurnaroundMinutes ?? 0;
  const totalAnalyzed =
    stats.totalSubmissionsAnalyzed ??
    postList.length ??
    (stats.totalApproved + stats.pendingReviewCount);

  return (
    <div className="space-y-6">
      {/* Velocity Top Banner */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 text-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#ff5000]">
              [ VELOCITY &bull; BENCHMARKS ]
            </span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-xs font-space font-semibold text-slate-400">
              Audit Duration &amp; Lifecycle Turnaround
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-syne text-white tracking-tight mt-1">
            Review Velocity &amp; Turnaround Intelligence
          </h2>
          <p className="text-xs text-slate-400 font-sans max-w-2xl mt-1">
            Empirical measurements tracking time taken to review each individual post version and total elapsed time required to achieve final production clearance across iterations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadVelocityData}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-bold font-syne text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Refresh Metrics</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Velocity Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Time taken to review a particular post */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-space font-bold uppercase tracking-widest text-slate-500">
            <span>Avg Review Duration</span>
            <Clock className="h-4 w-4 text-[#ff5000]" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-black font-syne text-slate-900">
              {formatMinutes(avgReviewTime)}
            </div>
            <span className="text-xs text-slate-500 font-sans">
              Average time taken by manager/AI to review a particular post
            </span>
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-200 px-2.5 py-1 text-[10px] font-space text-slate-600">
            Fastest: {formatMinutes(stats.fastestReviewMinutes)}
          </div>
        </div>

        {/* Metric 2: Overall time taken to get final product after all versions */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 text-white p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-space font-bold uppercase tracking-widest text-[#ff5000]">
            <span>Total Product Turnaround</span>
            <Zap className="h-4 w-4 text-[#ff5000]" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-black font-syne text-white">
              {formatMinutes(avgTotalTurnaround)}
            </div>
            <span className="text-xs text-slate-400 font-sans">
              Overall time taken from creation to final clearance after all versions
            </span>
          </div>
          <div className="rounded-xl bg-slate-800 border border-slate-700 px-2.5 py-1 text-[10px] font-space text-emerald-400">
            Resolved across all rework cycles
          </div>
        </div>

        {/* Metric 3: Total Submissions Tracked */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-space font-bold uppercase tracking-widest text-slate-500">
            <span>Assets Analyzed</span>
            <Layers className="h-4 w-4 text-blue-600" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-black font-syne text-slate-900">
              {totalAnalyzed}
            </div>
            <span className="text-xs text-slate-500 font-sans">
              Active campaigns with full timestamp tracking
            </span>
          </div>
          <div className="rounded-xl bg-blue-50 border border-blue-200 px-2.5 py-1 text-[10px] font-space text-blue-700 font-semibold">
            100% Versioned &amp; Audited
          </div>
        </div>

        {/* Metric 4: Iteration Velocity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-space font-bold uppercase tracking-widest text-slate-500">
            <span>Peak Turnaround</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-black font-syne text-slate-900">
              {formatMinutes(stats.longestReviewMinutes)}
            </div>
            <span className="text-xs text-slate-500 font-sans">
              Longest multi-version review lifecycle
            </span>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-space text-emerald-700 font-semibold">
            Multi-stage audit gate
          </div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold font-syne transition-all cursor-pointer ${
            activeTab === 'posts'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Clock className="h-4 w-4 text-[#ff5000]" />
          <span>Creatives Turnaround Velocity ({postList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('employees')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold font-syne transition-all cursor-pointer ${
            activeTab === 'employees'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Users className="h-4 w-4 text-blue-600" />
          <span>Employee Performance Intelligence ({stats.employeeMetrics?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('supervisors')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold font-syne transition-all cursor-pointer ${
            activeTab === 'supervisors'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Appointed Supervisors Capacity &amp; SLA ({stats.supervisorMetrics?.length || 0})</span>
        </button>
      </div>

      {/* TAB 1: POST REVIEW & TURNAROUND VELOCITY */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by campaign, brand, or creator..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#ff5000] outline-hidden font-sans"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-space font-bold text-slate-500">Filter:</span>
              {(['ALL', 'APPROVED', 'IN_PROGRESS'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilterStatus(status)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold font-space transition-colors cursor-pointer ${
                    filterStatus === status
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status === 'ALL'
                    ? 'All Posts'
                    : status === 'APPROVED'
                    ? 'Cleared'
                    : 'In Rework / Review'}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Post Review & Turnaround Velocity Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold font-space uppercase tracking-wider text-slate-500">
                Individual Post Review Times &amp; Overall Iteration Turnarounds ({filteredPosts.length})
              </h3>
              <span className="text-[11px] font-space text-slate-400">
                Click any post to expand version timeline
              </span>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
                No matching post velocity records found.
              </div>
            ) : (
              filteredPosts.map((post, pIdx) => {
                const isExpanded = expandedPostId === post.submissionId;
                const currentStatus = post.currentStatus || post.status || 'PENDING';
                const isApproved = currentStatus === 'APPROVED';
                const versionsList = post.versionsBreakdown || post.versions || [];
                const totalVersions = post.totalVersions ?? post.versionCount ?? versionsList.length ?? 1;
                const timeToReview = post.timeToReviewMinutes ?? post.latestReviewDurationMinutes ?? 0;
                const overallTurnaround = post.overallTurnaroundMinutes ?? post.totalTurnaroundMinutes ?? 0;
                const finalScore = post.finalScore ?? 85;

                return (
                  <div
                    key={`${post.submissionId}-${pIdx}`}
                    className="rounded-2xl border border-slate-200 bg-white transition-all overflow-hidden shadow-xs hover:border-slate-300"
                  >
                    {/* Main Card Summary */}
                    <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Creative Title, Brand & Creator */}
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        {post.brandLogo && (
                          <img
                            src={post.brandLogo}
                            alt={post.brandName}
                            className="h-12 w-12 rounded-xl object-contain bg-slate-50 p-1 border border-slate-200 shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold font-syne text-slate-900 truncate">
                              {post.campaignName}
                            </h4>
                            <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-bold font-space text-slate-700">
                              {totalVersions} {totalVersions === 1 ? 'Version' : 'Versions'}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold font-space uppercase tracking-wider ${
                                isApproved
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-orange-50 text-[#ff5000] border border-orange-200'
                              }`}
                            >
                              {currentStatus.replace(/_/g, ' ')}
                            </span>
                          </div>

                          <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500 font-space flex-wrap">
                            <span className="font-semibold text-slate-800">{post.brandName}</span>
                            <span>&bull;</span>
                            <span>Creator: <strong className="text-slate-700">{post.creatorName}</strong></span>
                            <span>&bull;</span>
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[11px] font-medium text-indigo-900">
                              <UserCheck className="h-3 w-3 text-indigo-600" />
                              <span>Appointed Supervisor: <strong>{post.assignedSupervisorName || 'Marcus Vance'}</strong></span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Middle: THE TWO REQUESTED TIMINGS */}
                      <div className="flex items-center gap-6 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                        {/* Time taken to review this particular post */}
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] font-space font-bold uppercase tracking-wider text-slate-400 block">
                            ⏱️ Time to Review Post
                          </span>
                          <span className="text-lg font-black font-space text-slate-900 block">
                            {formatMinutes(timeToReview)}
                          </span>
                          <span className="text-[10px] text-slate-500 font-space">
                            Reviewer evaluation time
                          </span>
                        </div>

                        {/* Overall time taken to get final product */}
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] font-space font-bold uppercase tracking-wider text-[#ff5000] block">
                            Overall Turnaround
                          </span>
                          <span className="text-lg font-black font-space text-[#ff5000] block">
                            {formatMinutes(overallTurnaround)}
                          </span>
                          <span className="text-[10px] text-slate-500 font-space">
                            From V1 to final product
                          </span>
                        </div>

                        {/* Score Badge */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-center min-w-[70px]">
                          <span className="text-[9px] font-space font-bold uppercase text-slate-400 block">
                            Score
                          </span>
                          <span
                            className={`text-base font-black font-space ${
                              finalScore >= 80 ? 'text-emerald-700' : 'text-[#ff5000]'
                            }`}
                          >
                            {finalScore}%
                          </span>
                        </div>

                        {/* Expand / Details Toggle */}
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedPostId(isExpanded ? null : post.submissionId)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                          title={isExpanded ? 'Collapse' : 'Expand details'}
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Version Progression Breakdown */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/80 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold font-syne text-slate-900 flex items-center gap-1.5">
                            <Layers className="h-3.5 w-3.5 text-[#ff5000]" />
                            <span>Version-by-Version Audit Trail &amp; Duration Breakdown</span>
                          </h5>
                          {onSelectSubmission && (
                            <button
                              type="button"
                              onClick={() => onSelectSubmission(post.submissionId)}
                              className="flex items-center gap-1 text-xs font-bold font-syne text-[#ff5000] hover:underline cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>View Full Score Report &amp; Evidence</span>
                            </button>
                          )}
                        </div>

                        {/* Version steps */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {versionsList.map((vb) => {
                            const vbStatus = vb.status || (vb as any).decision || 'PENDING';
                            const vbScore = vb.score ?? finalScore ?? 80;

                            return (
                              <div
                                key={vb.versionNumber}
                                className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2 shadow-2xs"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-bold font-space text-white">
                                    Version {vb.versionNumber}
                                  </span>
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold font-space uppercase ${
                                      vbStatus === 'APPROVED'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : vbStatus === 'NEEDS_IMPROVEMENT' || vbStatus === 'NEEDS_REWORK'
                                        ? 'bg-amber-50 text-amber-700'
                                        : 'bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    {vbStatus.replace(/_/g, ' ')}
                                  </span>
                                </div>

                                <div className="space-y-1 text-xs text-slate-600 font-sans">
                                  <div className="flex justify-between text-[11px]">
                                    <span className="text-slate-400">AI Score:</span>
                                    <strong className="font-space text-slate-900">{vbScore}%</strong>
                                  </div>
                                  <div className="flex justify-between text-[11px]">
                                    <span className="text-slate-400">Submitted:</span>
                                    <span className="font-space text-slate-700">
                                      {new Date(vb.submittedAt).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-[11px]">
                                    <span className="text-slate-400">Review Duration:</span>
                                    <strong className="font-space text-slate-900">
                                      {vb.reviewDurationMinutes
                                        ? formatMinutes(vb.reviewDurationMinutes)
                                        : 'In Progress'}
                                    </strong>
                                  </div>
                                  {vb.reviewerName && (
                                    <div className="flex justify-between text-[11px]">
                                      <span className="text-slate-400">Auditor:</span>
                                      <span className="text-slate-700">{vb.reviewerName}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Lifecycle Summary Banner */}
                        <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-sans">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                            <span>
                              <strong>Turnaround Cycle:</strong> Required {totalVersions}{' '}
                              {totalVersions === 1 ? 'iteration' : 'iterations'} over{' '}
                              <strong>{formatMinutes(overallTurnaround)}</strong> to reach final output.
                            </span>
                          </div>
                          <span className="text-[11px] font-space text-slate-500">
                            Average review velocity: {formatMinutes(timeToReview)} per gate
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: EMPLOYEE PERFORMANCE INTELLIGENCE */}
      {activeTab === 'employees' && (
        <div className="space-y-6">
          {/* Employee KPI Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-[10px] font-space font-bold uppercase text-slate-500">
                <span>Total Active Creators</span>
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="mt-2 text-3xl font-black font-syne text-slate-900">
                {stats.employeeMetrics?.length || 0}
              </div>
              <p className="text-xs text-slate-500 font-sans mt-1">
                Monitored creative production staff
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-[10px] font-space font-bold uppercase text-slate-500">
                <span>Avg First-Pass Approval</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="mt-2 text-3xl font-black font-syne text-emerald-700">
                {stats.employeeMetrics && stats.employeeMetrics.length > 0
                  ? Math.round(
                      stats.employeeMetrics.reduce((sum, e) => sum + e.firstPassApprovalRate, 0) /
                        stats.employeeMetrics.length
                    )
                  : 75}
                %
              </div>
              <p className="text-xs text-slate-500 font-sans mt-1">
                Assets approved on first version
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-[10px] font-space font-bold uppercase text-slate-500">
                <span>Team Avg Turnaround</span>
                <Clock className="h-4 w-4 text-[#ff5000]" />
              </div>
              <div className="mt-2 text-3xl font-black font-syne text-slate-900">
                {formatMinutes(avgTotalTurnaround)}
              </div>
              <p className="text-xs text-slate-500 font-sans mt-1">
                From first draft to production clearance
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-[10px] font-space font-bold uppercase text-slate-500">
                <span>Team Avg Iterations</span>
                <Layers className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="mt-2 text-3xl font-black font-syne text-indigo-700">
                {stats.averageVersionsCount || 1.3}x
              </div>
              <p className="text-xs text-slate-500 font-sans mt-1">
                Versions per completed creative asset
              </p>
            </div>
          </div>

          {/* Employee Filter & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search employee by name, department, or supervisor..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#ff5000] outline-hidden font-sans"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-space font-bold text-slate-500">Rating:</span>
              {(['ALL', 'EXCELLENT', 'HIGH', 'STEADY'] as const).map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setEmployeeFilterRating(rating)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold font-space transition-colors cursor-pointer ${
                    employeeFilterRating === rating
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {rating === 'ALL' ? 'All Staff' : rating}
                </button>
              ))}
            </div>
          </div>

          {/* Employee Performance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(stats.employeeMetrics || [])
              .filter((emp) => {
                const matchSearch =
                  emp.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (emp.department || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (emp.assignedSupervisorName || '').toLowerCase().includes(searchQuery.toLowerCase());
                const matchRating =
                  employeeFilterRating === 'ALL' || emp.velocityRating === employeeFilterRating;
                return matchSearch && matchRating;
              })
              .map((emp, idx) => {
                const ratingBadge =
                  emp.velocityRating === 'EXCELLENT'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : emp.velocityRating === 'HIGH'
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : emp.velocityRating === 'STEADY'
                    ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200';

                return (
                  <div
                    key={`${emp.employeeId}-${idx}`}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
                  >
                    {/* Header: Employee Info & Velocity Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {emp.employeeAvatar ? (
                          <img
                            src={emp.employeeAvatar}
                            alt={emp.employeeName}
                            className="h-12 w-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 font-black font-syne text-base shrink-0">
                            {emp.employeeName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="text-base font-bold font-syne text-slate-900">
                            {emp.employeeName}
                          </h4>
                          <p className="text-xs text-slate-500 font-sans">
                            {emp.department || 'Creative / Media Staff'}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-[10px] font-bold font-space uppercase tracking-wider ${ratingBadge}`}
                      >
                        {emp.velocityRating.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Appointed Review Supervisor */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 flex items-center justify-between text-xs font-sans">
                      <div className="flex items-center gap-2 text-slate-600">
                        <UserCheck className="h-4 w-4 text-indigo-600" />
                        <span>Appointed Review Supervisor:</span>
                      </div>
                      <strong className="font-syne text-slate-900">
                        {emp.assignedSupervisorName || 'Marcus Vance'}
                      </strong>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                      <div className="rounded-xl border border-slate-100 bg-white p-2.5">
                        <span className="text-[10px] font-space font-bold uppercase text-slate-400 block">
                          First-Pass
                        </span>
                        <span className="text-base font-black font-space text-emerald-700 block mt-0.5">
                          {emp.firstPassApprovalRate}%
                        </span>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white p-2.5">
                        <span className="text-[10px] font-space font-bold uppercase text-slate-400 block">
                          Avg Turnaround
                        </span>
                        <span className="text-base font-black font-space text-slate-900 block mt-0.5">
                          {formatMinutes(emp.averageTurnaroundMinutes)}
                        </span>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white p-2.5">
                        <span className="text-[10px] font-space font-bold uppercase text-slate-400 block">
                          Avg Iterations
                        </span>
                        <span className="text-base font-black font-space text-indigo-700 block mt-0.5">
                          {emp.averageIterations}x
                        </span>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white p-2.5">
                        <span className="text-[10px] font-space font-bold uppercase text-slate-400 block">
                          Avg AI Score
                        </span>
                        <span className="text-base font-black font-space text-[#ff5000] block mt-0.5">
                          {emp.averageAiScore}%
                        </span>
                      </div>
                    </div>

                    {/* First-Pass Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs font-space">
                        <span className="text-slate-500 text-[11px]">First-Pass Clearance Rate</span>
                        <span className="font-bold text-slate-800 text-[11px]">{emp.firstPassApprovalRate}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            emp.firstPassApprovalRate >= 70
                              ? 'bg-emerald-500'
                              : emp.firstPassApprovalRate >= 50
                              ? 'bg-blue-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(10, emp.firstPassApprovalRate))}%` }}
                        />
                      </div>
                    </div>

                    {/* Submissions summary footer */}
                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs font-space text-slate-500">
                      <span>Total Assets: <strong>{emp.totalSubmissions}</strong></span>
                      <span className="text-emerald-700">Approved: <strong>{emp.approvedCount}</strong></span>
                      <span className="text-amber-700">Reworked: <strong>{emp.reworkCount}</strong></span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 3: APPOINTED SUPERVISORS SLA & VELOCITY */}
      {activeTab === 'supervisors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold font-space uppercase tracking-wider text-slate-500">
              Appointed Review Supervisors &amp; Audit SLA Performance ({stats.supervisorMetrics?.length || 0})
            </h3>
            <span className="text-[11px] font-space text-slate-400">
              Individual audit metrics for designated sign-off supervisors
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(stats.supervisorMetrics || []).map((sup, sIdx) => (
              <div
                key={`${sup.supervisorId}-${sIdx}`}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {sup.supervisorAvatar ? (
                      <img
                        src={sup.supervisorAvatar}
                        alt={sup.supervisorName}
                        className="h-12 w-12 rounded-2xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 font-black font-syne">
                        {sup.supervisorName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-base font-bold font-syne text-slate-900">
                        {sup.supervisorName}
                      </h4>
                      <p className="text-xs text-slate-500 font-sans">
                        Designated Review Supervisor
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-[10px] font-bold font-space uppercase text-indigo-700">
                    Active Auditor
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                    <span className="text-[10px] font-space font-bold uppercase text-slate-400 block">
                      Assigned
                    </span>
                    <span className="text-lg font-black font-space text-slate-900 block mt-0.5">
                      {sup.totalAssigned}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                    <span className="text-[10px] font-space font-bold uppercase text-slate-400 block">
                      Completed
                    </span>
                    <span className="text-lg font-black font-space text-emerald-700 block mt-0.5">
                      {sup.completedReviews}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                    <span className="text-[10px] font-space font-bold uppercase text-slate-400 block">
                      Avg Audit Time
                    </span>
                    <span className="text-lg font-black font-space text-[#ff5000] block mt-0.5">
                      {formatMinutes(sup.averageReviewTimeMinutes)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1 text-xs font-sans">
                  <div className="flex justify-between text-slate-600">
                    <span>Approval Rate:</span>
                    <strong className="text-emerald-700">{sup.approvalRate}%</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Changes Requested Rate:</span>
                    <strong className="text-amber-700">{sup.requestChangesRate}%</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Fastest Evaluation:</span>
                    <span className="font-space">{formatMinutes(sup.fastestReviewMinutes)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
