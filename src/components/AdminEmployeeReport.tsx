import React, { useState } from 'react';
import { Submission, EmployeeVelocityMetric } from '../types';
import { CanvaThumbnailTile } from './CanvaPreviewCard';
import {
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Award,
  ChevronDown,
  ChevronUp,
  Eye,
  Send,
  Building2,
  UserCheck,
  BarChart3,
  Layers,
  FileCheck,
  TrendingUp,
} from 'lucide-react';

interface AdminEmployeeReportProps {
  submissions: Submission[];
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

export const AdminEmployeeReport: React.FC<AdminEmployeeReportProps> = ({
  submissions,
  onSelectSubmission,
  onOpenScoreReport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEmployeeId, setExpandedEmployeeId] = useState<string | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string>('ALL');

  // Compute Employee metrics dynamically from the actual submissions list
  const employeeMap = new Map<
    string,
    {
      id: string;
      name: string;
      avatar?: string;
      department: string;
      supervisorName: string;
      submissions: Submission[];
    }
  >();

  // Base list of creators known in the company
  const defaultEmployees = [
    {
      id: 'usr-001',
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      department: 'Lead Full-Stack AI & Creative Engineering',
      supervisorName: 'Elena Rostova',
    },
    {
      id: 'usr-002',
      name: 'Sophia Martinez',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      department: 'Senior Visual & Brand Systems',
      supervisorName: 'Elena Rostova',
    },
    {
      id: 'usr-003',
      name: 'Liam Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      department: 'Digital Collateral & Motion Graphics',
      supervisorName: 'Maya Lin',
    },
  ];

  const usedIds = new Set<string>(defaultEmployees.map((e) => e.id));

  defaultEmployees.forEach((emp) => {
    employeeMap.set(emp.name.toLowerCase().trim(), {
      id: emp.id,
      name: emp.name,
      avatar: emp.avatar,
      department: emp.department,
      supervisorName: emp.supervisorName,
      submissions: [],
    });
  });

  // Group submissions by employee
  submissions.forEach((sub) => {
    const creatorName = ((sub as any).creatorName || sub.userName || 'Team Member').trim();
    const creatorAvatar = (sub as any).creatorAvatar || sub.userAvatar;
    const key = creatorName.toLowerCase();
    if (!employeeMap.has(key)) {
      const baseId = (sub as any).userId || `emp-${key.replace(/[^a-z0-9]/g, '') || 'creator'}`;
      let uniqueId = baseId;
      let counter = 1;
      while (usedIds.has(uniqueId)) {
        uniqueId = `${baseId}-${counter}`;
        counter++;
      }
      usedIds.add(uniqueId);

      employeeMap.set(key, {
        id: uniqueId,
        name: creatorName,
        avatar: creatorAvatar,
        department: 'Creative Staff',
        supervisorName: sub.assignedSupervisorName || 'Elena Rostova',
        submissions: [],
      });
    }
    employeeMap.get(key)!.submissions.push(sub);
  });

  // Calculate detailed performance metrics per employee
  const employeeReportData = Array.from(employeeMap.values()).map((emp) => {
    const totalSubmitted = emp.submissions.length;
    // Passed AI report: overall score >= 80 or status approved/passed
    const passedAiReport = emp.submissions.filter(
      (s) => s.overallAiScore >= 80 || s.workflowStatus === 'APPROVED' || s.humanDecision === 'APPROVED'
    ).length;

    const neededRework = emp.submissions.filter(
      (s) => s.overallAiScore < 80 && s.workflowStatus !== 'APPROVED' && s.humanDecision !== 'APPROVED'
    ).length;

    // Selected by supervisor for clients
    const supervisorApproved = emp.submissions.filter(
      (s) => s.workflowStatus === 'APPROVED' || s.humanDecision === 'APPROVED'
    ).length;

    const avgAiScore =
      totalSubmitted > 0
        ? Math.round(
            emp.submissions.reduce((acc, s) => acc + (s.overallAiScore || 0), 0) / totalSubmitted
          )
        : 85;

    const passRate = totalSubmitted > 0 ? Math.round((passedAiReport / totalSubmitted) * 100) : 100;

    return {
      ...emp,
      totalSubmitted,
      passedAiReport,
      neededRework,
      supervisorApproved,
      avgAiScore,
      passRate,
    };
  });

  // Total team-wide aggregates
  const totalSubmissionsAcrossTeam = submissions.length;
  const totalPassedAi = submissions.filter(
    (s) => s.overallAiScore >= 80 || s.workflowStatus === 'APPROVED'
  ).length;
  const totalNeededRework = totalSubmissionsAcrossTeam - totalPassedAi;
  const totalSupervisorApproved = submissions.filter(
    (s) => s.workflowStatus === 'APPROVED' || s.approvalStatus === 'APPROVED'
  ).length;
  const overallTeamPassRate =
    totalSubmissionsAcrossTeam > 0
      ? Math.round((totalPassedAi / totalSubmissionsAcrossTeam) * 100)
      : 88;

  // Filtered employees
  const filteredEmployees = employeeReportData.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.supervisorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      filterDepartment === 'ALL' || emp.department.toLowerCase() === filterDepartment.toLowerCase();

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Overview */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-space font-bold text-[#ff5000]">
              <Users className="h-3.5 w-3.5" />
              <span>Employee Performance &amp; AI Evaluation Report</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-syne text-slate-900">
              Employee Production &amp; Review Report
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-sans max-w-2xl">
              Track how many posters each team member submitted, how many passed the AI quality report, how many required rework, and which final posters were approved by supervisors for client delivery.
            </p>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Posters Submitted */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <span className="text-[10px] font-space font-bold uppercase text-slate-500 block">
              Total Posters Submitted
            </span>
            <span className="text-2xl sm:text-3xl font-black font-syne text-slate-900 mt-1 block">
              {totalSubmissionsAcrossTeam}
            </span>
            <span className="text-[11px] text-slate-500 font-sans">
              Across all {employeeReportData.length} team members
            </span>
          </div>

          {/* Passed AI Report */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
            <span className="text-[10px] font-space font-bold uppercase text-emerald-800 block">
              Passed AI Report
            </span>
            <span className="text-2xl sm:text-3xl font-black font-syne text-emerald-700 mt-1 block">
              {totalPassedAi}
              <span className="text-sm font-semibold font-space text-emerald-600 ml-1.5">
                ({overallTeamPassRate}%)
              </span>
            </span>
            <span className="text-[11px] text-emerald-600 font-sans">
              Met quality standard on 1st run
            </span>
          </div>

          {/* Needed Rework */}
          <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
            <span className="text-[10px] font-space font-bold uppercase text-amber-800 block">
              Needed Rework
            </span>
            <span className="text-2xl sm:text-3xl font-black font-syne text-amber-700 mt-1 block">
              {totalNeededRework}
            </span>
            <span className="text-[11px] text-amber-600 font-sans">
              Canva edits requested by AI
            </span>
          </div>

          {/* Supervisor Approved / Client Ready */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
            <span className="text-[10px] font-space font-bold uppercase text-blue-800 block">
              Ready for Clients
            </span>
            <span className="text-2xl sm:text-3xl font-black font-syne text-blue-700 mt-1 block">
              {totalSupervisorApproved}
            </span>
            <span className="text-[11px] text-blue-600 font-sans">
              Approved by supervisors
            </span>
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
            placeholder="Search employee by name, department, or supervisor..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#ff5000] outline-hidden font-sans"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-space font-bold text-slate-500">Department:</span>
          {(['ALL', 'Brand Design', 'Visual Identity', 'Marketing Creative'] as const).map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setFilterDepartment(dept)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold font-space transition-colors cursor-pointer ${
                filterDepartment === dept
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept === 'ALL' ? 'All Staff' : dept}
            </button>
          ))}
        </div>
      </div>

      {/* Employee List with Detailed Counts & Expandable Posters */}
      <div className="space-y-4">
        {filteredEmployees.map((emp, idx) => {
          const isExpanded = expandedEmployeeId === emp.id;

          return (
            <div
              key={`${emp.id}-${idx}`}
              className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:border-slate-300 transition-all"
            >
              {/* Employee Header Row */}
              <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Profile info (No photo fixture, clean name & details) */}
                <div className="flex items-center gap-4 min-w-0">

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold font-syne text-slate-900 truncate">
                        {emp.name}
                      </h3>
                      <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold font-space text-slate-700">
                        {emp.department}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 font-sans">
                      <span>Supervisor: <strong>{emp.supervisorName}</strong></span>
                      <span>&bull;</span>
                      <span className="text-emerald-700 font-semibold">
                        {emp.passRate}% AI Pass Rate
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4 Stats Chips for this Employee */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                  {/* Total Submitted */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center min-w-[90px]">
                    <span className="text-[9px] font-space font-bold uppercase text-slate-400 block">
                      Submitted
                    </span>
                    <span className="text-lg font-black font-syne text-slate-900 block">
                      {emp.totalSubmitted}
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans">
                      Posters
                    </span>
                  </div>

                  {/* Passed AI Report */}
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3 text-center min-w-[90px]">
                    <span className="text-[9px] font-space font-bold uppercase text-emerald-800 block">
                      Passed AI
                    </span>
                    <span className="text-lg font-black font-syne text-emerald-700 block">
                      {emp.passedAiReport}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-sans">
                      {emp.passRate}% Pass
                    </span>
                  </div>

                  {/* Needed Rework */}
                  <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-3 text-center min-w-[90px]">
                    <span className="text-[9px] font-space font-bold uppercase text-amber-800 block">
                      Rework
                    </span>
                    <span className="text-lg font-black font-syne text-amber-700 block">
                      {emp.neededRework}
                    </span>
                    <span className="text-[10px] text-amber-600 font-sans">
                      Revisions
                    </span>
                  </div>

                  {/* Supervisor Approved (Ready for Client) */}
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-3 text-center min-w-[90px]">
                    <span className="text-[9px] font-space font-bold uppercase text-blue-800 block">
                      Client Ready
                    </span>
                    <span className="text-lg font-black font-syne text-blue-700 block">
                      {emp.supervisorApproved}
                    </span>
                    <span className="text-[10px] text-blue-600 font-sans">
                      Approved
                    </span>
                  </div>
                </div>

                {/* Toggle View Posters */}
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setExpandedEmployeeId(isExpanded ? null : emp.id)}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2.5 text-xs font-bold font-syne transition cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide Posters' : `View Posters (${emp.submissions.length})`}</span>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Posters Created by this Employee */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/70 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-syne text-slate-900 flex items-center gap-1.5">
                      <Layers className="h-4 w-4 text-[#ff5000]" />
                      <span>Posters Submitted by {emp.name}</span>
                    </h4>
                    <span className="text-xs text-slate-500 font-sans">
                      Click any poster to inspect or view AI score report
                    </span>
                  </div>

                  {emp.submissions.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-xs text-slate-500">
                      No posters submitted yet for this cycle.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {emp.submissions.map((post, postIdx) => {
                        const passedAi = post.overallAiScore >= 80;
                        const isApprovedBySupervisor =
                          post.workflowStatus === 'APPROVED' || post.humanDecision === 'APPROVED';
                        const currentVer = post.versions?.find((v) => v.versionNumber === post.currentVersion) || post.versions?.[0];
                        const file = currentVer?.files?.[0];
                        const isCanvaLinkOnly =
                          !!post.canvaUrl &&
                          (!file?.fileUrl || file.fileUrl === '' || file.fileUrl.startsWith('data:application/x-canva') || post.canvaPreviewState === 'LINK_ONLY');
                        const imgUrl = getSubmissionImageUrl(post);

                        return (
                          <div
                            key={`${post.id}-${postIdx}`}
                            className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                          >
                            {/* Thumbnail */}
                            {isCanvaLinkOnly ? (
                              <CanvaThumbnailTile
                                canvaUrl={post.canvaUrl!}
                                designId={post.canvaDesignId}
                                campaignName={post.campaignName}
                                onClick={() => onSelectSubmission(post.id)}
                              />
                            ) : (
                              <div
                                className="relative aspect-4/3 bg-slate-900 overflow-hidden cursor-pointer"
                                onClick={() => onSelectSubmission(post.id)}
                              >
                                {imgUrl ? (
                                  <img
                                    src={imgUrl}
                                    alt={post.campaignName}
                                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs">
                                    Poster Asset
                                  </div>
                                )}
                                <div className="absolute top-2 left-2">
                                  <span className="rounded bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[9px] font-space font-bold text-white">
                                    {post.brandName}
                                  </span>
                                </div>

                                <div className="absolute top-2 right-2">
                                  <span
                                    className={`rounded-md px-2 py-0.5 text-[9px] font-space font-bold uppercase ${
                                      isApprovedBySupervisor
                                        ? 'bg-emerald-500 text-white'
                                        : passedAi
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-amber-500 text-white'
                                    }`}
                                  >
                                    {isApprovedBySupervisor
                                      ? 'Client Ready'
                                      : passedAi
                                      ? 'Passed AI'
                                      : 'Needs Rework'}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Content */}
                            <div className="p-3.5 space-y-2 text-xs">
                              <h5 className="font-bold font-syne text-slate-900 truncate">
                                {post.campaignName}
                              </h5>

                              <div className="flex items-center justify-between text-[11px] font-space text-slate-500">
                                <span>AI Score:</span>
                                <span
                                  className={`font-black ${
                                    post.overallAiScore >= 80 ? 'text-emerald-600' : 'text-[#ff5000]'
                                  }`}
                                >
                                  {post.overallAiScore}%
                                </span>
                              </div>

                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                                <button
                                  type="button"
                                  onClick={() => onOpenScoreReport(post)}
                                  className="flex-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 py-1 text-[10px] font-space font-bold transition text-center cursor-pointer"
                                >
                                  View Report
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onSelectSubmission(post.id)}
                                  className="flex-1 rounded-lg bg-slate-900 hover:bg-black text-white py-1 text-[10px] font-space font-bold transition text-center cursor-pointer"
                                >
                                  Inspect
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
