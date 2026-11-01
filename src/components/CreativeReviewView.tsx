import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldCheck,
  Check,
  ChevronDown,
  ChevronUp,
  Palette,
  Type,
  LayoutGrid,
  Eye,
  Megaphone,
  Smile,
  Film,
  FileCheck,
  Smartphone,
  Sliders,
  Play,
  RotateCcw,
  Copy,
  Info,
  ListChecks,
  History,
  ShieldAlert,
} from 'lucide-react';
import {
  CreativeReviewModel,
  CreativeIssueCard,
  CreativeCategorySummary,
  CreativeActionPriority,
  Submission,
} from '../types';

interface CreativeReviewViewProps {
  review: CreativeReviewModel;
  submission: Submission;
  onJumpToVideoTimestamp?: (timestamp: string) => void;
  onOpenRework?: () => void;
  canvaFixPrompt?: string;
  quickFixSteps?: string[];
  claimPromptParam?: any;
  onConfirmClaim?: (parameterId: string) => void;
  isConfirmingClaim?: boolean;
}

export const CreativeReviewView: React.FC<CreativeReviewViewProps> = ({
  review,
  submission,
  onJumpToVideoTimestamp,
  onOpenRework,
  canvaFixPrompt,
  quickFixSteps,
  claimPromptParam,
  onConfirmClaim,
  isConfirmingClaim,
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [expandedIssueIds, setExpandedIssueIds] = useState<Record<string, boolean>>({});
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [activeIssueFilter, setActiveIssueFilter] = useState<'ALL' | 'CRITICAL' | 'MEDIUM'>('ALL');
  const [copiedRecipe, setCopiedRecipe] = useState(false);

  const toggleIssueTech = (id: string) => {
    setExpandedIssueIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyRecipe = () => {
    if (!canvaFixPrompt) return;
    navigator.clipboard.writeText(canvaFixPrompt);
    setCopiedRecipe(true);
    setTimeout(() => setCopiedRecipe(false), 2500);
  };

  const getPriorityBadge = (priority: CreativeActionPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return {
          label: 'Critical',
          desc: 'Must fix before resubmission',
          className: 'bg-red-50 text-red-700 border-red-200',
          dotColor: 'bg-red-600',
        };
      case 'HIGH':
        return {
          label: 'High Priority',
          desc: 'Important brand issue',
          className: 'bg-amber-50 text-amber-800 border-amber-200',
          dotColor: 'bg-amber-600',
        };
      case 'MEDIUM':
        return {
          label: 'Medium',
          desc: 'Recommended improvement',
          className: 'bg-blue-50 text-blue-700 border-blue-200',
          dotColor: 'bg-blue-600',
        };
      case 'LOW':
      default:
        return {
          label: 'Low',
          desc: 'Optional polish',
          className: 'bg-slate-100 text-slate-700 border-slate-200',
          dotColor: 'bg-slate-500',
        };
    }
  };

  const getCategoryIcon = (iconType: CreativeCategorySummary['iconType']) => {
    const iconClass = 'h-4 w-4 shrink-0';
    switch (iconType) {
      case 'COLOR':
        return <Palette className={iconClass} />;
      case 'LOGO':
        return <ShieldCheck className={iconClass} />;
      case 'TYPE':
        return <Type className={iconClass} />;
      case 'LAYOUT':
        return <LayoutGrid className={iconClass} />;
      case 'READABILITY':
        return <Eye className={iconClass} />;
      case 'CTA':
        return <Megaphone className={iconClass} />;
      case 'TONE':
        return <Smile className={iconClass} />;
      case 'QUALITY':
        return <Film className={iconClass} />;
      case 'COMPLIANCE':
        return <FileCheck className={iconClass} />;
      case 'SPECS':
      default:
        return <Smartphone className={iconClass} />;
    }
  };

  const filteredIssues = review.issues.filter((iss) => {
    if (activeIssueFilter === 'CRITICAL') {
      return iss.priority === 'CRITICAL' || iss.priority === 'HIGH';
    }
    if (activeIssueFilter === 'MEDIUM') {
      return iss.priority === 'MEDIUM' || iss.priority === 'LOW';
    }
    return true;
  });

  return (
    <div className="space-y-6 text-slate-900">
      {/* 1. TOP-LEVEL RESULT HEADER */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-start gap-4">
            {/* Status Icon */}
            <div className="mt-1">
              {review.overallStatus === 'PASS' && (
                <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200 shadow-xs">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              )}
              {review.overallStatus === 'NEEDS_CHANGES' && (
                <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-200 shadow-xs">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              )}
              {review.overallStatus === 'FAIL' && (
                <div className="h-12 w-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center border border-red-200 shadow-xs">
                  <XCircle className="h-6 w-6" />
                </div>
              )}
              {review.overallStatus === 'PENDING_HUMAN_REVIEW' && (
                <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center border border-blue-200 shadow-xs">
                  <Clock className="h-6 w-6" />
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-syne tracking-wide uppercase border ${
                    review.overallStatus === 'PASS'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : review.overallStatus === 'NEEDS_CHANGES'
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : review.overallStatus === 'FAIL'
                      ? 'bg-red-50 text-red-900 border-red-300'
                      : 'bg-blue-50 text-blue-900 border-blue-300'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      review.overallStatus === 'PASS'
                        ? 'bg-emerald-600'
                        : review.overallStatus === 'NEEDS_CHANGES'
                        ? 'bg-amber-600'
                        : review.overallStatus === 'FAIL'
                        ? 'bg-red-600'
                        : 'bg-blue-600'
                    }`}
                  />
                  {review.overallStatus === 'PASS'
                    ? 'PASS'
                    : review.overallStatus === 'NEEDS_CHANGES'
                    ? 'NEEDS CHANGES'
                    : review.overallStatus === 'FAIL'
                    ? 'FAIL'
                    : 'PENDING HUMAN REVIEW'}
                </span>

                <span className="text-xs font-space font-medium text-slate-500">
                  Version {review.versionNumber} &bull; {review.assetType}
                </span>
              </div>

              <h2 className="text-xl font-bold font-syne text-slate-900 mt-2">
                {review.oneSentenceSummary}
              </h2>
            </div>
          </div>

          {/* Simple Clean Overall Score */}
          <div className="flex flex-col items-start sm:items-end justify-center rounded-2xl bg-slate-50 border border-slate-200 px-5 py-3 shrink-0">
            <span className="text-[10px] font-space font-bold uppercase tracking-wider text-slate-500">
              Overall AI Score
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span
                className={`text-3xl font-black font-syne ${
                  review.overallScore >= 80
                    ? 'text-emerald-600'
                    : review.overallScore >= 60
                    ? 'text-amber-600'
                    : 'text-red-600'
                }`}
              >
                {review.overallScore}
              </span>
              <span className="text-xs font-space font-semibold text-slate-400">/ 100</span>
            </div>
          </div>
        </div>

        {/* Campaign Meta & Critical Workflow Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-space text-slate-600 pt-1">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              Brand: <strong className="text-slate-900">{review.brandName}</strong>
            </span>
            <span className="text-slate-300">&bull;</span>
            <span>
              Campaign: <strong className="text-slate-900">{review.campaignName}</strong>
            </span>
            <span className="text-slate-300">&bull;</span>
            <span>Reviewed on {review.reviewDateTime}</span>
          </div>
        </div>

        {/* Workflow rule banner */}
        <div
          className={`flex items-center gap-2.5 rounded-xl p-3 text-xs font-medium border ${
            review.overallStatus === 'PASS'
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <Info className="h-4 w-4 text-[#ff5000] shrink-0" />
          <p className="font-sans leading-relaxed">
            <strong className="font-syne">Important:</strong> {review.workflowNotice}
          </p>
        </div>
      </div>

      {/* 2. QUICK ACTION SUMMARY ("What you need to do") */}
      {review.topActions.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-orange-100 text-[#ff5000] flex items-center justify-center">
                <ListChecks className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold font-syne text-slate-900">
                  What you need to do
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  The most important fixes sorted by priority ({review.topActions.length} actions)
                </p>
              </div>
            </div>

            {onOpenRework && (
              <button
                type="button"
                onClick={onOpenRework}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#ff5000] hover:bg-[#e04700] text-white text-xs font-bold font-syne shadow-xs transition cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Fix in Rework</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {review.topActions.map((action, idx) => {
              const priorityConfig = getPriorityBadge(action.priority);
              return (
                <div
                  key={action.id || idx}
                  className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white font-space text-xs font-bold">
                    {idx + 1}
                  </span>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-bold font-syne text-slate-900">
                        {action.title}
                      </h4>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-space font-bold uppercase border ${priorityConfig.className}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${priorityConfig.dotColor}`} />
                        {priorityConfig.label}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-sans leading-relaxed">
                      {action.fix}
                    </p>

                    {action.reason && (
                      <p className="text-[11px] text-slate-500 font-sans italic">
                        Why: {action.reason}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CREATOR INTENT PROMPT (If specific claims or metrics need decision) */}
      {claimPromptParam && onConfirmClaim && (
        <div className="rounded-3xl border-2 border-amber-300 bg-amber-50/70 p-6 shadow-xs space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold font-syne text-amber-950">
                  Creator Decision Required &bull; Campaign Claims
                </h4>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-space font-bold uppercase">
                  Action Prompt
                </span>
              </div>
              <p className="text-xs text-amber-900 font-sans leading-relaxed">
                {claimPromptParam.clientClaimPrompt?.prompt ||
                  'The campaign brief contains specific statistics. Would you like to proceed with your current design layout as is, or edit it to include these numbers?'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 sm:pl-12">
            <button
              type="button"
              disabled={isConfirmingClaim}
              onClick={() => onConfirmClaim(claimPromptParam.parameterId)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-syne transition shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              <span>
                {isConfirmingClaim
                  ? 'Confirming...'
                  : 'Proceed with current design (AI Approve)'}
              </span>
            </button>
            {onOpenRework && (
              <button
                type="button"
                onClick={onOpenRework}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold font-syne transition cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Edit in Canva (Rework)</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. ISSUE CARDS */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold font-syne text-slate-900">
              Issues &amp; Recommendations ({review.issues.length})
            </h3>
            <p className="text-xs text-slate-500 font-sans">
              Clear, practical feedback on what to change and why it matters
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 text-xs font-space font-semibold self-start">
            <button
              onClick={() => setActiveIssueFilter('ALL')}
              className={`rounded-lg px-3 py-1 transition-all cursor-pointer ${
                activeIssueFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All ({review.issues.length})
            </button>
            <button
              onClick={() => setActiveIssueFilter('CRITICAL')}
              className={`rounded-lg px-3 py-1 transition-all cursor-pointer ${
                activeIssueFilter === 'CRITICAL'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Critical &amp; High
            </button>
            <button
              onClick={() => setActiveIssueFilter('MEDIUM')}
              className={`rounded-lg px-3 py-1 transition-all cursor-pointer ${
                activeIssueFilter === 'MEDIUM'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Medium &amp; Low
            </button>
          </div>
        </div>

        {filteredIssues.length === 0 ? (
          <div className="rounded-2xl bg-emerald-50/60 border border-emerald-200 p-6 text-center space-y-2">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold font-syne text-emerald-900">
              No issues in this filter!
            </h4>
            <p className="text-xs text-emerald-700 font-sans">
              The creative passed all checks in this category cleanly.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIssues.map((issue, issueIdx) => {
              const priorityConfig = getPriorityBadge(issue.priority);
              const isExpanded = !!expandedIssueIds[issue.id];

              return (
                <div
                  key={`${issue.id || 'issue'}-${issueIdx}`}
                  className={`rounded-2xl border p-5 transition-all shadow-xs ${
                    issue.blocking
                      ? 'border-amber-200 bg-amber-50/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-space font-bold uppercase border ${priorityConfig.className}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${priorityConfig.dotColor}`} />
                        {priorityConfig.label}
                      </span>

                      {issue.blocking ? (
                        <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 text-[10px] font-space font-bold uppercase">
                          Blocking
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-space font-medium">
                          Non-blocking
                        </span>
                      )}

                      {issue.location && (
                        <span className="text-[11px] font-space text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          Location: {issue.location}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-space text-slate-500">
                      Rule: <strong className="text-slate-700">{issue.relatedRule}</strong>
                    </span>
                  </div>

                  {/* Issue Title */}
                  <h4 className="text-base font-bold font-syne text-slate-900 mt-3">
                    {issue.title}
                  </h4>

                  {/* 3-Part Creative Clarity: What We Found, Why It Matters, How to Fix */}
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <span className="text-[10px] font-space font-bold uppercase text-slate-500 block mb-1">
                        What we found
                      </span>
                      <p className="text-slate-700 font-sans leading-relaxed">
                        {issue.whatWeFound}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <span className="text-[10px] font-space font-bold uppercase text-slate-500 block mb-1">
                        Why it matters
                      </span>
                      <p className="text-slate-700 font-sans leading-relaxed">
                        {issue.whyItMatters}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200/60 text-xs">
                      <span className="text-[10px] font-space font-bold uppercase text-[#ff5000] block mb-1">
                        How to fix
                      </span>
                      <p className="text-orange-950 font-sans font-medium leading-relaxed">
                        {issue.howToFix}
                      </p>
                    </div>
                  </div>

                  {/* Collapsible Technical Details (Progressive Disclosure) */}
                  <div className="mt-3 pt-2">
                    <button
                      type="button"
                      onClick={() => toggleIssueTech(issue.id)}
                      className="flex items-center gap-1 text-[11px] font-space font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide technical details' : 'View technical details'}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 p-3 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono space-y-1.5">
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>Check ID: {issue.parameterId || issue.id}</span>
                          <span>Score: {issue.score ?? 'N/A'}%</span>
                        </div>
                        {issue.technicalEvidence && issue.technicalEvidence.length > 0 && (
                          <div className="pt-1 text-[11px] space-y-1 text-slate-300">
                            <span className="text-slate-400 font-bold block">Raw Evidence:</span>
                            {issue.technicalEvidence.map((ev, i) => (
                              <div key={i} className="pl-2 border-l border-slate-700">
                                &bull; {ev}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. CATEGORY SCORE SUMMARY (Creative Checklist) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold font-syne text-slate-900">
            Brand Checklist Summary
          </h3>
          <p className="text-xs text-slate-500 font-sans">
            How your creative performed across each core brand dimension
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {review.categorySummary.map((cat, catIdx) => {
            const isGood = cat.status === 'GOOD';
            const isNotChecked = cat.status === 'NOT_CHECKED';

            return (
              <div
                key={`${cat.id || 'cat'}-${catIdx}`}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-colors"
              >
                <div
                  className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isGood
                      ? 'bg-emerald-100 text-emerald-700'
                      : isNotChecked
                      ? 'bg-slate-200 text-slate-600'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {getCategoryIcon(cat.iconType)}
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold font-syne text-slate-900 truncate">
                      {cat.name}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-space font-bold uppercase ${
                        isGood
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isNotChecked
                          ? 'bg-slate-100 text-slate-500 border border-slate-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {isGood ? 'Good' : isNotChecked ? 'Not checked' : 'Needs attention'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                    {cat.summary}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. WHAT IS WORKING WELL */}
      {review.strengths.length > 0 && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-syne text-emerald-950">
                What is working well
              </h3>
              <p className="text-[11px] text-emerald-800 font-sans">
                Specific design strengths identified by the review
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {review.strengths.map((str, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 bg-white/90 p-3 rounded-xl border border-emerald-200/80 text-xs font-sans text-emerald-900"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. VIDEO-SPECIFIC REVIEW (If Video submission) */}
      {review.isVideo && review.videoChecks && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-slate-900 text-[#ff5000] flex items-center justify-center">
                <Film className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold font-syne text-slate-900">
                  Video Timing &amp; Pacing Review
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  Video-specific checks for reels, shorts, and video campaigns
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-space font-bold uppercase">
              Video Safe Zones
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-900 font-syne block">
                Opening Hook (00:00 - 00:03)
              </span>
              <p className="text-slate-600 font-sans">{review.videoChecks.openingHook?.note}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-900 font-syne block">Brand &amp; Logo Visibility</span>
              <p className="text-slate-600 font-sans">{review.videoChecks.brandVisibility?.note}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-900 font-syne block">Closing CTA Timing</span>
              <p className="text-slate-600 font-sans">{review.videoChecks.ctaTiming?.note}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-900 font-syne block">Platform Caption Placement</span>
              <p className="text-slate-600 font-sans">{review.videoChecks.audioCaptions?.note}</p>
            </div>
          </div>

          {/* Interactive Scene Timestamps */}
          {review.videoChecks.timelineEvents && review.videoChecks.timelineEvents.length > 0 && (
            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-space font-bold uppercase tracking-wider text-slate-500 block">
                Key Video Timestamps (Click to jump)
              </span>
              <div className="flex flex-wrap gap-2">
                {review.videoChecks.timelineEvents.map((evt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onJumpToVideoTimestamp && onJumpToVideoTimestamp(evt.timestamp)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-space font-semibold transition cursor-pointer border border-slate-200"
                  >
                    <Play className="h-3 w-3 fill-current text-[#ff5000]" />
                    <span>{evt.timestamp}</span>
                    <span className="text-slate-500 text-[10px]">({evt.label})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. VERSION COMPARISON ("What changed from previous version") */}
      {review.versionComparison && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <History className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold font-syne text-slate-900">
                  What changed from Version {review.versionComparison.comparedVersionNumber}
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  Progression comparison against the previous submission
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-space font-bold uppercase text-slate-400 block">
                Score Delta
              </span>
              <span
                className={`text-sm font-bold font-space ${
                  review.versionComparison.scoreDifference >= 0
                    ? 'text-emerald-600'
                    : 'text-red-600'
                }`}
              >
                {review.versionComparison.scoreDifference >= 0 ? '+' : ''}
                {review.versionComparison.scoreDifference}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Improved */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <h4 className="text-xs font-bold font-syne text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Improved ({review.versionComparison.improved.length})</span>
              </h4>
              {review.versionComparison.improved.length === 0 ? (
                <p className="text-xs text-slate-500 font-sans italic">
                  No previous issues resolved yet.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {review.versionComparison.improved.map((imp, idx) => (
                    <div key={idx} className="text-xs font-sans text-emerald-900">
                      <strong>{imp.title}:</strong> {imp.detail}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Still Needs Attention */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
              <h4 className="text-xs font-bold font-syne text-amber-950 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>Still Needs Attention ({review.versionComparison.stillNeedsAttention.length})</span>
              </h4>
              {review.versionComparison.stillNeedsAttention.length === 0 ? (
                <p className="text-xs text-slate-500 font-sans italic">
                  All previous issues have been addressed!
                </p>
              ) : (
                <div className="space-y-1.5">
                  {review.versionComparison.stillNeedsAttention.map((att, idx) => (
                    <div key={idx} className="text-xs font-sans text-amber-900">
                      <strong>{att.title}:</strong> {att.detail}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 8. BEFORE YOU RESUBMIT CHECKLIST */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold font-syne text-slate-900">
            Before you resubmit checklist
          </h3>
          <p className="text-xs text-slate-500 font-sans">
            Verify each item below before uploading Version {review.versionNumber + 1}
          </p>
        </div>

        <div className="space-y-2">
          {review.resubmissionChecklist.map((item, itemIdx) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <label
                key={`${item.id || 'item'}-${itemIdx}`}
                onClick={() => handleToggleCheck(item.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition cursor-pointer select-none ${
                  isChecked
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-md flex items-center justify-center transition ${
                    isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="h-3.5 w-3.5" />}
                </div>
                <span className={`text-xs font-sans ${isChecked ? 'font-medium' : ''}`}>
                  {item.label}
                </span>
              </label>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-400 font-sans italic">
          Note: This is a manual preflight checklist. Checking these items will not alter your score until you upload your revised creative for automated review.
        </p>
      </div>

      {/* 9. DETAILED ANALYSIS TOGGLE (Progressive Disclosure for Supervisors & Admins) */}
      <div className="rounded-3xl border border-slate-200 bg-slate-900 text-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-syne text-white">
                Detailed Technical Analysis
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Full parameter weights, bounding coordinates, raw model output, and Canva recipe
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowTechnicalDetails((prev) => !prev)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold font-syne transition cursor-pointer border border-slate-700"
          >
            <span>{showTechnicalDetails ? 'Hide Detailed Analysis' : 'View Detailed Analysis'}</span>
            {showTechnicalDetails ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        {showTechnicalDetails && (
          <div className="space-y-5 pt-4 border-t border-slate-800">
            {/* Canva Recipe if available */}
            {canvaFixPrompt && (
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-syne text-orange-400">
                    Canva Remediation Prompt
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyRecipe}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ff5000] text-white text-[10px] font-bold font-syne cursor-pointer hover:bg-[#e04700]"
                  >
                    {copiedRecipe ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedRecipe ? 'Copied!' : 'Copy Recipe'}</span>
                  </button>
                </div>
                <p className="text-xs font-mono text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800 leading-relaxed">
                  {canvaFixPrompt}
                </p>
                {quickFixSteps && quickFixSteps.length > 0 && (
                  <div className="space-y-1 text-xs text-slate-400 pt-1">
                    {quickFixSteps.map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#ff5000]" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Raw Parameter Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold font-space uppercase tracking-wider text-slate-400 block">
                All Evaluated Parameters ({submission.versions.find((v) => v.versionNumber === review.versionNumber)?.analysisResult?.parameters.length || 0})
              </span>
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs font-space">
                  <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Parameter</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Score</th>
                      <th className="p-3">Confidence</th>
                      <th className="p-3">Weight</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/60 text-slate-300">
                    {(
                      submission.versions.find((v) => v.versionNumber === review.versionNumber)
                        ?.analysisResult?.parameters || []
                    ).map((p, pIdx) => (
                      <tr key={`${p.parameterId || 'param'}-${pIdx}`} className="hover:bg-slate-800/40">
                        <td className="p-3 font-semibold text-white">{p.name}</td>
                        <td className="p-3 text-slate-400">{p.category}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.status === 'PASS'
                                ? 'bg-emerald-900/60 text-emerald-400'
                                : 'bg-red-900/60 text-red-400'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3 font-bold">{p.score}%</td>
                        <td className="p-3">{Math.round(p.confidence * 100)}%</td>
                        <td className="p-3 text-slate-400">{p.weight}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
