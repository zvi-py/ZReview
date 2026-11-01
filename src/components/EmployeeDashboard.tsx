import React, { useState } from 'react';
import { Submission } from '../types';
import { useAuth } from '../context/AuthContext';
import { CanvaThumbnailTile } from './CanvaPreviewCard';
import {
  Search,
  Plus,
  Eye,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Info,
  Clock,
  Layers,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

interface EmployeeDashboardProps {
  submissions: Submission[];
  initialView?: 'creatives' | 'peer-review';
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenNewSubmission: () => void;
  onSelectSubmission: (submission: Submission) => void;
  onOpenRework: (submission: Submission) => void;
  onOpenDemo?: () => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  submissions,
  onOpenNewSubmission,
  onSelectSubmission,
  onOpenRework,
  onOpenDemo,
}) => {
  const { currentUser, systemSettings } = useAuth();
  const approvalGateThreshold = systemSettings?.aiApprovalThreshold ?? 85;

  // View state: 'GATE_VIEW' (split by <85% vs >=85%) or 'ALL_GRID'
  const [viewMode, setViewMode] = useState<'GATE_VIEW' | 'ALL_GRID'>('GATE_VIEW');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');

  // Extract unique brands
  const uniqueBrands = Array.from(
    new Set<string>(submissions.map((s) => JSON.stringify({ id: s.brandId, name: s.brandName })))
  ).map((str: string) => JSON.parse(str) as { id: string; name: string });

  // Filtered submissions
  const filteredSubmissions = submissions.filter((s) => {
    const matchSearch =
      s.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.creatorName && s.creatorName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchBrand = selectedBrand === 'ALL' || s.brandId === selectedBrand;
    return matchSearch && matchBrand;
  });

  // Separate into the two core 85% gate buckets
  // 1. Below 85%: Blocked from human review, creator rework required
  const reworkQueue = filteredSubmissions.filter(
    (s) => s.overallAiScore < approvalGateThreshold || s.workflowStatus === 'NEEDS_IMPROVEMENT' || s.workflowStatus === 'CHANGES_REQUESTED'
  );

  // 2. 85% and above: Gate passed, routed to human supervisor for final sign-off
  const humanReviewQueue = filteredSubmissions.filter(
    (s) => s.overallAiScore >= approvalGateThreshold && s.workflowStatus !== 'NEEDS_IMPROVEMENT' && s.workflowStatus !== 'CHANGES_REQUESTED'
  );

  // Helper to extract why a creative must change
  const getWhyToChangeReasons = (sub: Submission): string[] => {
    // Specific real poster diagnostics matching user's uploaded posters
    if (sub.id === 'SUB-101' || sub.campaignName?.toLowerCase().includes('macaron')) {
      return [
        'Body Copy Syntax Error: Critical typo "we off evry indipendent day" violates brand editorial guidelines.',
        'Contradictory Operating Hours: "OPEN DAILY 9 am - 10 am" specifies an invalid 1-hour service duration.',
        'Missing statutory bakery food safety license & allergen disclaimer in lower container.',
      ];
    }

    if (sub.id === 'SUB-104' || sub.campaignName?.toLowerCase().includes('cheesecake') || sub.campaignName?.toLowerCase().includes('dobong')) {
      return [
        'Unresolved Template Placeholder: Header location "123 Distreet, Somewhere in city" must be updated with verified branch address.',
        'CTA Coordinate Failure: Dummy phone numbers "012345678" fail direct contact verification check.',
        'Safe Margin Encroachment: Top-left pin icon is positioned at 2.1% from the canvas edge (minimum 5.0% required).',
      ];
    }

    if (sub.id === 'SUB-107' || sub.campaignName?.toLowerCase().includes('amor próprio') || sub.campaignName?.toLowerCase().includes('discurso')) {
      return [
        'Safe Area Margin Violation: Lower handle signature is partially clipped by bottom photo grid boundary.',
        'Professional Accreditation: CRP registry clearance ("CRP 08/41447") requires 6% separation from top margin.',
      ];
    }

    const latestVer = sub.versions?.[sub.versions.length - 1];
    const params = latestVer?.analysisResult?.parameters || [];
    const failingParams = params.filter((p) => p.status === 'FAIL' || p.status === 'UNCERTAIN' || p.score < 80);

    if (failingParams.length > 0) {
      return failingParams.slice(0, 3).map((p) => {
        if (p.remedy) return p.remedy;
        if (p.reason) return p.reason;
        return `${p.name}: Does not satisfy ${p.metaGuideline || 'toolkit criteria'}`;
      });
    }

    if (sub.humanComment) {
      return [sub.humanComment];
    }

    if (sub.comments && sub.comments.length > 0) {
      return [sub.comments[sub.comments.length - 1].content];
    }

    return [
      'Logo clear space is below 6.0% boundary margin.',
      'Missing mandatory 24/7 client helpline & regulatory disclaimer in bottom safe area.',
    ];
  };

  const getPosterPreview = (sub: Submission) => {
    const latestVer = sub.versions?.[sub.versions.length - 1];
    const file = latestVer?.files?.[0];

    // If user uploaded a custom creative (e.g. data URL)
    if (file?.fileUrl && file.fileUrl.startsWith('data:image')) {
      return file.fileUrl;
    }

    // Direct real poster bindings matching user uploaded cute cafe & coffee images
    if (sub.campaignName?.toLowerCase().includes('strawberry') || sub.id === 'SUB-104') {
      return '/assets/aistudio/image_4178a031.png';
    }
    if (sub.campaignName?.toLowerCase().includes('matcha time') || sub.id === 'SUB-103') {
      return '/assets/aistudio/image_3cdcff8b.png';
    }
    if (sub.campaignName?.toLowerCase().includes('morning mood') || sub.id === 'SUB-101' || sub.id === 'SUB-102') {
      return '/assets/aistudio/image_b41c8e2c.png';
    }
    if (sub.campaignName?.toLowerCase().includes('noon coffee')) {
      return '/assets/aistudio/image_89d665aa.png';
    }
    if (sub.campaignName?.toLowerCase().includes('cheesecake') || sub.campaignName?.toLowerCase().includes('dobong') || sub.id === 'SUB-105') {
      return '/assets/aistudio/image_36da4e00.png';
    }
    if (sub.campaignName?.toLowerCase().includes('helado') || sub.campaignName?.toLowerCase().includes('dulce tierra') || sub.id === 'SUB-106') {
      return '/assets/aistudio/image_7685044f.png';
    }
    if (sub.campaignName?.toLowerCase().includes('macaron') || sub.campaignName?.toLowerCase().includes('framboise') || sub.id === 'SUB-107') {
      return '/assets/aistudio/image_3de7b998.png';
    }
    if (sub.campaignName?.toLowerCase().includes('new ritual') || sub.campaignName?.toLowerCase().includes('revitalizer') || sub.id === 'SUB-108') {
      return '/assets/aistudio/image_91ac2035.png';
    }
    if (sub.campaignName?.toLowerCase().includes('amor próprio')) {
      return '/assets/aistudio/image_88b4743e.png';
    }
    if (sub.campaignName?.toLowerCase().includes('saint') || sub.campaignName?.toLowerCase().includes('petersburg')) {
      return '/assets/aistudio/image_2db42f96.png';
    }

    if (file?.fileUrl && file.fileUrl.startsWith('/assets/aistudio/')) {
      return file.fileUrl;
    }

    if (file?.fileUrl) {
      return file.fileUrl;
    }

    return sub.overallAiScore < approvalGateThreshold
      ? '/assets/aistudio/image_36da4e00.png'
      : '/assets/aistudio/image_4178a031.png';
  };

  return (
    <div className="w-full space-y-6 pb-20 font-sans text-[#182817]">
      {/* =========================================================================
          1. HEADER WITH CORE PURPOSE & UPLOAD ACTION
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E3D5]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-syne text-[#182817] tracking-tight flex items-center gap-2">
            <span>Poster Compliance &amp; Approval System</span>
          </h1>
          <p className="text-xs text-[#526850] font-sans mt-0.5">
            Active Creator: <span className="text-[#182817] font-semibold">{currentUser?.name || 'Alex Rivera'}</span>
            <span className="mx-2 text-[#D5CFBF]">·</span>
            Appointed Human Supervisor: <span className="text-[#182817] font-semibold">Elena Rostova</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onOpenDemo && (
            <button
              type="button"
              onClick={onOpenDemo}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#FFD0E0] bg-[#FFF0F5] hover:bg-[#FFE4ED] text-[#D82666] px-3.5 py-2 text-xs font-bold font-syne transition-colors cursor-pointer shadow-2xs"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF5E97] animate-ping" />
              <span>Watch Video Tour</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenNewSubmission}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2E5629] hover:bg-[#22421E] text-white px-4 py-2 text-xs font-bold font-syne transition-all cursor-pointer shadow-sm shadow-[#2E5629]/20"
          >
            <Plus className="h-4 w-4" />
            <span>Upload New Poster</span>
          </button>
        </div>
      </div>

      {/* 85% Gate Summary Bar (Clean, compact, uncluttered) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#E8E3D5] bg-white px-4 py-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2E5629] text-white text-xs font-bold font-syne shrink-0">
            85%
          </span>
          <div className="text-xs text-[#526850] font-sans">
            <strong className="text-[#182817]">Autonomous AI Pre-Flight Gate:</strong> Scores &ge; 85% advance to human supervisor Elena Rostova. Scores &lt; 85% require creator rework.
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenDemo && (
            <button
              type="button"
              onClick={onOpenDemo}
              className="text-xs font-bold font-syne text-[#D82666] hover:text-[#B01A50] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Watch Video Tour</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          3. CONTROLS & VIEW TOGGLE
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#677A65]" />
          <input
            type="text"
            placeholder="Search poster title or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white border border-[#E8E3D5] text-[#182817] focus:outline-none focus:border-[#2E5629] focus:ring-1 focus:ring-[#2E5629] transition-colors shadow-2xs"
          />
        </div>

        {/* Filter & View Switcher */}
        <div className="flex items-center gap-2">
          <select
            aria-label="Filter by Brand"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-white border border-[#E8E3D5] text-[#182817] cursor-pointer shadow-2xs font-medium"
          >
            <option value="ALL">All Brands ({submissions.length})</option>
            {uniqueBrands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <div className="flex items-center p-0.5 rounded-xl bg-[#F0ECE1] border border-[#E8E3D5] text-xs font-medium">
            <button
              type="button"
              onClick={() => setViewMode('GATE_VIEW')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-syne ${
                viewMode === 'GATE_VIEW'
                  ? 'bg-white text-[#182817] font-bold shadow-2xs border border-[#E8E3D5]'
                  : 'text-[#526850] hover:text-[#182817]'
              }`}
            >
              85% Gate View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('ALL_GRID')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-syne ${
                viewMode === 'ALL_GRID'
                  ? 'bg-white text-[#182817] font-bold shadow-2xs border border-[#E8E3D5]'
                  : 'text-[#526850] hover:text-[#182817]'
              }`}
            >
              All Grid ({filteredSubmissions.length})
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. VIEW MODE A: 85% GATE VIEW (TWO HIGH-IMPACT BUCKETS)
          ========================================================================= */}
      {viewMode === 'GATE_VIEW' && (
        <div className="space-y-8">
          {/* -------------------------------------------------------------
              BUCKET 1: NEEDS CREATOR REWORK (< 85% SCORE)
              ------------------------------------------------------------- */}
          <section className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#FFD0E0]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FF5E97] text-white font-bold text-xs shadow-xs">
                  <AlertTriangle className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold font-syne text-[#182817] tracking-tight">
                    Needs Creator Rework (AI Score &lt; 85%)
                  </h2>
                  <p className="text-[11px] text-[#526850] font-sans">
                    Blocked from human review. Creator must fix parameter defects and resubmit.
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-space bg-[#FFF0F5] text-[#D82666] border border-[#FFD0E0]">
                {reworkQueue.length} {reworkQueue.length === 1 ? 'Poster' : 'Posters'}
              </span>
            </div>

            {reworkQueue.length === 0 ? (
              <div className="rounded-2xl border border-[#BED8B9] bg-[#F4F9F2] p-6 text-center text-xs text-[#2E5629]">
                <CheckCircle2 className="mx-auto h-5 w-5 text-[#2E5629] mb-1" />
                No posters currently failing the 85% threshold. All creatives meet or exceed quality standards.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {reworkQueue.map((sub) => {
                  const previewImg = getPosterPreview(sub);
                  const reasons = getWhyToChangeReasons(sub);

                  return (
                    <div
                      key={sub.id}
                      className="rounded-2xl border-2 border-[#FFD0E0] bg-white p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-left space-y-4"
                    >
                      <div className="space-y-3">
                        {/* Card Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-space font-bold uppercase tracking-wider text-[#D82666] bg-[#FFF0F5] px-2 py-0.5 rounded border border-[#FFD0E0]">
                              {sub.brandName}
                            </span>
                            <h3
                              onClick={() => onSelectSubmission(sub)}
                              className="text-base font-bold font-syne text-[#182817] hover:text-[#2E5629] transition-colors mt-1 cursor-pointer leading-snug"
                            >
                              {sub.campaignName}
                            </h3>
                            <div className="text-[11px] text-[#677A65] font-mono mt-0.5">
                              Version {sub.currentVersion} &bull; Created by {sub.userName || 'Alex Rivera'}
                            </div>
                          </div>

                          {/* Score Badge */}
                          <div className="flex flex-col items-end shrink-0">
                            <span className="text-2xl font-black font-syne text-[#D82666] leading-none">
                              {sub.overallAiScore}%
                            </span>
                            <span className="text-[10px] font-space font-bold text-[#D82666] bg-[#FFF0F5] px-2 py-0.5 rounded-full mt-1 border border-[#FFD0E0]">
                              GATE FAILED (&lt;85%)
                            </span>
                          </div>
                        </div>

                        {/* Visual & Reasons Container */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                          {/* Poster Thumbnail */}
                          <div
                            onClick={() => onSelectSubmission(sub)}
                            className="sm:col-span-5 relative aspect-[3/4] max-h-72 overflow-hidden rounded-xl bg-slate-950 flex items-center justify-center cursor-pointer border border-[#E8E3D5] group shadow-inner"
                          >
                            <img
                              src={previewImg}
                              alt={sub.campaignName}
                              className="h-full w-full object-contain p-1 group-hover:scale-102 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none" />
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-xs text-white text-[9px] font-mono border border-white/20">
                              Click to Inspect
                            </div>
                          </div>

                          {/* WHY TO CHANGE Box */}
                          <div className="sm:col-span-7 rounded-xl bg-[#FFF8FA] border border-[#FFD0E0] p-3 space-y-1.5 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-1.5 text-[#911846] font-bold font-syne text-xs pb-1 border-b border-[#FFD0E0]/60">
                                <AlertTriangle className="h-3 w-3 text-[#D82666] shrink-0" />
                                <span>Why You Must Change This:</span>
                              </div>
                              <ul className="mt-1.5 space-y-1 text-[11px] text-[#7A1D3E] font-sans">
                                {reasons.map((r, rIdx) => (
                                  <li key={rIdx} className="flex items-start gap-1.5 leading-snug">
                                    <span className="text-[#D82666] font-bold">&bull;</span>
                                    <span>{r}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <p className="text-[10px] text-[#911846] italic pt-1 border-t border-[#FFD0E0]/50">
                              Elena Rostova (Supervisor) will not review until score reaches &ge; 85%.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Controls */}
                      <div className="flex items-center gap-2 pt-3 border-t border-[#F0ECE1]">
                        <button
                          type="button"
                          onClick={() => onSelectSubmission(sub)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#E8E3D5] hover:bg-[#FAF8F3] text-xs font-bold font-syne text-[#182817] transition-colors cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 text-[#677A65]" />
                          <span>AI Diagnostics</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenRework(sub)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#FF5E97] hover:bg-[#E8457F] text-xs font-bold font-syne text-white transition-all cursor-pointer shadow-xs"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Fix &amp; Resubmit V{sub.currentVersion + 1}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* -------------------------------------------------------------
              BUCKET 2: READY FOR / PASSED HUMAN APPROVAL (>= 85% SCORE)
              ------------------------------------------------------------- */}
          <section className="space-y-3 pt-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#BED8B9]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#2E5629] text-white font-bold text-xs shadow-xs">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold font-syne text-[#182817] tracking-tight">
                    Passed AI Gate (Score &ge; 85%) &bull; Routed to Human Review
                  </h2>
                  <p className="text-[11px] text-[#526850] font-sans">
                    Meets brand toolkit and meta parameters. Forwarded to Elena Rostova for human sign-off.
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-space bg-[#EBF5E9] text-[#244A20] border border-[#BED8B9]">
                {humanReviewQueue.length} {humanReviewQueue.length === 1 ? 'Poster' : 'Posters'}
              </span>
            </div>

            {humanReviewQueue.length === 0 ? (
              <div className="rounded-2xl border border-[#E8E3D5] bg-[#FAF8F3] p-6 text-center text-xs text-[#526850]">
                No posters currently in the human approval queue.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {humanReviewQueue.map((sub) => {
                  const previewImg = getPosterPreview(sub);
                  const isApproved = sub.workflowStatus === 'APPROVED' || sub.humanDecision === 'APPROVED';

                  return (
                    <div
                      key={sub.id}
                      className="rounded-2xl border border-[#E8E3D5] bg-white p-4 shadow-xs hover:border-[#BED8B9] transition-all flex flex-col justify-between text-left space-y-3"
                    >
                      <div>
                        {/* Header & Score */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-space font-bold uppercase tracking-wider text-[#677A65] truncate">
                            {sub.brandName}
                          </span>

                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-space bg-[#EBF5E9] text-[#244A20] border border-[#BED8B9]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#2E5629]" />
                            {sub.overallAiScore}% GATE PASSED
                          </span>
                        </div>

                        {/* Thumbnail */}
                        <div
                          onClick={() => onSelectSubmission(sub)}
                          className="relative aspect-[3/4] max-h-72 overflow-hidden rounded-xl bg-slate-950 flex items-center justify-center mb-3 cursor-pointer border border-[#E8E3D5] group shadow-inner"
                        >
                          <img
                            src={previewImg}
                            alt={sub.campaignName}
                            className="h-full w-full object-contain p-1 group-hover:scale-102 transition-transform duration-300"
                          />
                          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 text-[9px] font-mono border border-emerald-500/30">
                            Gate &ge; 85%
                          </div>
                        </div>

                        {/* Title and Human Status */}
                        <div>
                          <h3
                            onClick={() => onSelectSubmission(sub)}
                            className="text-sm font-bold font-syne text-[#182817] hover:text-[#2E5629] transition-colors leading-snug cursor-pointer truncate"
                          >
                            {sub.campaignName}
                          </h3>

                          {/* Human Supervisor Status Pill */}
                          <div className="mt-2 p-2 rounded-xl bg-[#FAF8F3] border border-[#E8E3D5] text-[11px] font-sans">
                            {isApproved ? (
                              <div className="flex items-center gap-1.5 text-[#244A20] font-medium">
                                <CheckCircle2 className="h-3.5 w-3.5 text-[#2E5629] shrink-0" />
                                <span>Approved by Elena Rostova</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-[#2A52BE] font-medium">
                                <Clock className="h-3.5 w-3.5 text-[#2A52BE] shrink-0" />
                                <span>In Review: Assigned to Elena Rostova</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Controls */}
                      <div className="pt-2 border-t border-[#F0ECE1] flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => onSelectSubmission(sub)}
                          className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-[#E8E3D5] hover:bg-[#FAF8F3] text-xs font-bold font-syne text-[#182817] transition-colors cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 text-[#677A65]" />
                          <span>View Diagnostics</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}

      {/* =========================================================================
          5. VIEW MODE B: ALL POSTERS GRID (ALTERNATIVE SIMPLE VIEW)
          ========================================================================= */}
      {viewMode === 'ALL_GRID' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubmissions.map((sub) => {
            const previewImg = getPosterPreview(sub);
            const passedGate = sub.overallAiScore >= approvalGateThreshold;

            return (
              <div
                key={sub.id}
                className="rounded-2xl border border-[#E8E3D5] bg-white p-4 shadow-xs hover:border-[#BED8B9] transition-all flex flex-col justify-between text-left space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-space font-bold uppercase tracking-wider text-[#677A65] truncate">
                      {sub.brandName}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-space border ${
                        passedGate
                          ? 'bg-[#EBF5E9] text-[#244A20] border-[#BED8B9]'
                          : 'bg-[#FFF0F5] text-[#D82666] border-[#FFD0E0]'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${passedGate ? 'bg-[#2E5629]' : 'bg-[#FF5E97]'}`} />
                      {sub.overallAiScore}% {passedGate ? 'PASSED (≥85%)' : 'REWORK (<85%)'}
                    </span>
                  </div>

                  <div
                    onClick={() => onSelectSubmission(sub)}
                    className="relative aspect-4/3 overflow-hidden rounded-xl bg-slate-100 mb-3 cursor-pointer border border-[#E8E3D5] group"
                  >
                    <img
                      src={previewImg}
                      alt={sub.campaignName}
                      className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  </div>

                  <h3
                    onClick={() => onSelectSubmission(sub)}
                    className="text-sm font-bold font-syne text-[#182817] hover:text-[#2E5629] transition-colors leading-snug cursor-pointer truncate"
                  >
                    {sub.campaignName}
                  </h3>
                  <p className="text-[11px] text-[#677A65] font-mono mt-0.5">
                    v{sub.currentVersion} &bull; {sub.workflowStatus.replace(/_/g, ' ')}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F0ECE1] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectSubmission(sub)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-[#E8E3D5] hover:bg-[#FAF8F3] text-xs font-bold font-syne text-[#182817] transition-colors cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 text-[#677A65]" />
                    <span>Diagnostics</span>
                  </button>

                  {!passedGate && (
                    <button
                      type="button"
                      onClick={() => onOpenRework(sub)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#FF5E97] hover:bg-[#E8457F] text-xs font-bold font-syne text-white transition-all cursor-pointer shadow-xs"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Rework</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
