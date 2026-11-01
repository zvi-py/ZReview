import React, { useState } from 'react';
import {
  Clock,
  Zap,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Cpu,
  BarChart3,
  Layers,
  ArrowUpRight,
  Calculator,
  CheckCircle2,
  Sliders,
  FileCheck,
} from 'lucide-react';

interface AdminAiImpactSectionProps {
  totalSubmissionsCount?: number;
}

export const AdminAiImpactSection: React.FC<AdminAiImpactSectionProps> = ({
  totalSubmissionsCount = 24,
}) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'ytd'>('month');

  // Simple Estimator Form State
  const [monthlyAssets, setMonthlyAssets] = useState<number>(140);
  const [reviewTimePerAsset, setReviewTimePerAsset] = useState<number>(45); // in minutes
  const [hourlyRate, setHourlyRate] = useState<number>(85); // in USD

  // Dynamic calculations based on timeframes
  const multiplier = timeframe === 'week' ? 0.25 : timeframe === 'month' ? 1 : 12;

  const baselineHoursSaved = Math.round(186.5 * multiplier);
  const baselineAutomatedChecks = Math.round(1840 * multiplier);
  const baselineCostSaved = Math.round(15850 * multiplier);
  const autoApprovedPercentage = 92.4;

  // Real-time custom form calculations
  const calculatedMonthlyHoursSaved = (monthlyAssets * reviewTimePerAsset) / 60;
  const calculatedMonthlyCostSaved = calculatedMonthlyHoursSaved * hourlyRate;
  const calculatedAnnualHoursSaved = calculatedMonthlyHoursSaved * 12;
  const calculatedAnnualCostSaved = calculatedMonthlyCostSaved * 12;

  const automationBreakdown = [
    {
      category: 'Safe Margins & Logo Spacing',
      pct: 100,
      description: 'Automatically checks margins around logos and edges so designs never look cramped.',
      timeSavedPerAsset: '12 min',
    },
    {
      category: 'Brand Colors & Palette Check',
      pct: 100,
      description: 'Instantly verifies that only approved brand colors are used and flags forbidden colors.',
      timeSavedPerAsset: '8 min',
    },
    {
      category: 'Contact Info & Required Disclaimers',
      pct: 94.6,
      description: 'Checks that phone numbers, website links, and required legal disclaimers are present and readable.',
      timeSavedPerAsset: '15 min',
    },
    {
      category: 'Font Styles & Heading Hierarchy',
      pct: 91.2,
      description: 'Ensures headlines stand out clearly and body text meets minimum readable sizes.',
      timeSavedPerAsset: '7 min',
    },
    {
      category: 'Key Visual Details & Image Quality',
      pct: 88.5,
      description: 'Checks that images are crisp and free from unwanted watermarks or artifacts.',
      timeSavedPerAsset: '22 min',
    },
  ];

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      {/* Top Section Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 text-slate-900 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ff5000]/20 bg-[#ff5000]/10 px-3 py-1 text-xs font-space font-bold text-[#ff5000]">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>[ AUTOMATION &amp; ROI ANALYTICS ]</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-syne tracking-tight text-slate-900">
              Work Automated &amp; Time Saved
            </h2>
            <p className="text-xs sm:text-sm font-sans text-slate-500 max-w-2xl leading-relaxed">
              Consolidated intelligence on how Gemini 2.5 multimodal evaluation eliminates manual brand inspection,
              accelerates campaign deployment, and saves creative team hours.
            </p>
          </div>

          {/* Timeframe Selector Buttons */}
          <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setTimeframe('week')}
              className={`rounded-xl px-3 py-1.5 text-xs font-space font-bold transition-all cursor-pointer ${
                timeframe === 'week'
                  ? 'bg-[#ff5000] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Past 7 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('month')}
              className={`rounded-xl px-3 py-1.5 text-xs font-space font-bold transition-all cursor-pointer ${
                timeframe === 'month'
                  ? 'bg-[#ff5000] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Past 30 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('ytd')}
              className={`rounded-xl px-3 py-1.5 text-xs font-space font-bold transition-all cursor-pointer ${
                timeframe === 'ytd'
                  ? 'bg-[#ff5000] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Time (YTD)
            </button>
          </div>
        </div>
      </div>

      {/* 4 High-Impact KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Work Automated */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-space uppercase tracking-wider text-slate-500">
              Work Automated by AI
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-[#ff5000]">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-syne tracking-tight text-slate-900">
              {autoApprovedPercentage}%
            </span>
            <span className="text-xs font-bold font-space text-emerald-700 flex items-center">
              <ArrowUpRight className="h-3.5 w-3.5" /> +4.2%
            </span>
          </div>
          <p className="mt-1 text-xs font-space text-slate-500 leading-normal">
            <strong className="text-slate-900">{baselineAutomatedChecks.toLocaleString()}</strong> guideline checks
            executed without manual measurement.
          </p>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#ff5000]"
              style={{ width: `${autoApprovedPercentage}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Time Saved */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-space uppercase tracking-wider text-slate-500">
              Time Saved
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-[#ff5000]">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-syne tracking-tight text-slate-900">
              {baselineHoursSaved} hrs
            </span>
            <span className="text-xs font-bold font-space text-emerald-700 flex items-center">
              <ArrowUpRight className="h-3.5 w-3.5" /> 160x faster
            </span>
          </div>
          <p className="mt-1 text-xs font-space text-slate-500 leading-normal">
            Manual inspection cut from <strong className="text-slate-900">48h</strong> to an average of{' '}
            <strong className="text-[#ff5000]">18 seconds</strong>.
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] font-space font-semibold text-slate-500">
            <span>~45 min saved / asset</span>
            <span className="text-[#ff5000] font-bold">Instant Feedback</span>
          </div>
        </div>

        {/* Metric 3: Effort & Iteration Reduction */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-space uppercase tracking-wider text-slate-500">
              Effort &amp; Rework Reduction
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-[#ff5000]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-syne tracking-tight text-slate-900">
              68.4%
            </span>
            <span className="text-xs font-space font-semibold text-emerald-700">
              Fewer Iterations
            </span>
          </div>
          <p className="mt-1 text-xs font-space text-slate-500 leading-normal">
            Average rework cycles dropped from <strong className="text-slate-900">3.2</strong> down to{' '}
            <strong className="text-slate-900">1.0 round</strong> before sign-off.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-space font-semibold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span>Violations flagged prior to launch</span>
          </div>
        </div>

        {/* Metric 4: Estimated Cost Savings */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-space uppercase tracking-wider text-slate-500">
              Est. Financial Value
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-[#ff5000]">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-bold font-syne tracking-tight text-slate-900">
              ${baselineCostSaved.toLocaleString()}
            </span>
            <span className="text-xs font-space font-bold text-slate-500">USD</span>
          </div>
          <p className="mt-1 text-xs font-space text-slate-500 leading-normal">
            Saved in internal review hours and agency compliance audit overhead.
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] font-space font-semibold text-slate-500">
            <span>Blended rate: $85/hr</span>
            <span className="font-bold text-[#ff5000]">High ROI</span>
          </div>
        </div>
      </div>

      {/* Two-Column Section: Simple ROI Estimator Form + Guideline Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
        
        {/* Left Column: Clean & Simple Time/Effort Saved Form */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-[#ff5000] shadow-xs">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-syne text-slate-900">
                Interactive Savings Estimator
              </h3>
              <p className="text-xs font-space text-slate-500">
                Adjust team parameters to project operational savings
              </p>
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="mt-5 space-y-4 font-sans">
            {/* Input 1: Monthly Assets */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold font-syne text-slate-900">
                  Monthly Assets Evaluated
                </label>
                <span className="text-xs font-bold font-space text-[#ff5000]">
                  {monthlyAssets} assets
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="500"
                step="10"
                value={monthlyAssets}
                onChange={(e) => setMonthlyAssets(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#ff5000]"
              />
              <div className="flex justify-between text-[10px] font-space text-slate-500 mt-1 font-semibold">
                <span>20 assets</span>
                <span>250 assets</span>
                <span>500 assets</span>
              </div>
            </div>

            {/* Input 2: Review Time per Asset */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold font-syne text-slate-900">
                  Avg. Manual Review Time per Asset
                </label>
                <span className="text-xs font-bold font-space text-[#ff5000]">
                  {reviewTimePerAsset} mins
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="120"
                step="5"
                value={reviewTimePerAsset}
                onChange={(e) => setReviewTimePerAsset(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#ff5000]"
              />
              <div className="flex justify-between text-[10px] font-space text-slate-500 mt-1 font-semibold">
                <span>15 mins (Quick)</span>
                <span>60 mins (Standard)</span>
                <span>120 mins (Video)</span>
              </div>
            </div>

            {/* Input 3: Hourly Reviewer Labor Rate */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold font-syne text-slate-900">
                  Blended Labor Rate ($/hour)
                </label>
                <span className="text-xs font-bold font-space text-[#ff5000]">
                  ${hourlyRate}/hr
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="200"
                step="5"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#ff5000]"
              />
              <div className="flex justify-between text-[10px] font-space text-slate-500 mt-1 font-semibold">
                <span>$40/hr</span>
                <span>$85/hr</span>
                <span>$200/hr (Agency)</span>
              </div>
            </div>

            {/* Calculated Output Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 mt-4 space-y-3 shadow-xs">
              <span className="text-[11px] font-bold font-space uppercase tracking-wider text-slate-500 block">
                Calculated Projected Savings
              </span>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white p-3 border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold font-space text-slate-500 block">
                    Monthly Time Saved
                  </span>
                  <span className="text-xl font-bold font-syne text-slate-900">
                    {Math.round(calculatedMonthlyHoursSaved)} hrs
                  </span>
                  <span className="text-[10px] font-space text-emerald-700 block font-semibold mt-0.5">
                    ~{(calculatedMonthlyHoursSaved / 8).toFixed(1)} work days
                  </span>
                </div>

                <div className="rounded-xl bg-white p-3 border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold font-space text-slate-500 block">
                    Monthly Cost Saved
                  </span>
                  <span className="text-xl font-bold font-syne text-[#ff5000]">
                    ${Math.round(calculatedMonthlyCostSaved).toLocaleString()}
                  </span>
                  <span className="text-[10px] font-space text-slate-500 block font-semibold mt-0.5">
                    direct labor cost
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs font-space">
                <span className="font-semibold text-slate-900">Annualized Impact:</span>
                <span className="font-bold text-slate-900">
                  {Math.round(calculatedAnnualHoursSaved)} hrs /{' '}
                  <span className="text-[#ff5000]">
                    ${Math.round(calculatedAnnualCostSaved).toLocaleString()}
                  </span>
                </span>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Work Automated Breakdown by Guideline Area */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold font-syne text-slate-900">
                Guideline Automation Breakdown
              </h3>
              <p className="text-xs font-space text-slate-500">
                Percentage of manual measurement tasks completely handled by AI vision &amp; OCR
              </p>
            </div>
            <span className="rounded-xl border border-[#ff5000]/30 bg-[#ff5000]/10 px-3 py-1 text-xs font-bold font-space text-[#ff5000]">
              Avg: 94.9%
            </span>
          </div>

          <div className="space-y-4">
            {automationBreakdown.map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-space">
                  <span className="font-bold text-slate-900">{item.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                      Saved {item.timeSavedPerAsset}/asset
                    </span>
                    <span className="font-bold text-[#ff5000]">{item.pct}%</span>
                  </div>
                </div>

                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#ff5000]"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>

                <p className="text-[11px] font-space text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Workflow Comparison: Manual vs AI */}
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 shadow-xs">
            <span className="text-[11px] font-bold font-space uppercase tracking-wider text-slate-500 block mb-3">
              Workflow Comparison: Manual vs. AI-Assisted
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <span className="font-bold font-syne text-red-900 block mb-1">Traditional Manual Process</span>
                <ul className="space-y-1 font-space text-[11px] text-red-700 list-disc list-inside">
                  <li>48h avg turnaround in queue</li>
                  <li>Manual pixel ruler measurements</li>
                  <li>3.2 rework rounds per campaign</li>
                  <li>Inconsistent subjective feedback</li>
                </ul>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <span className="font-bold font-syne text-emerald-900 block mb-1">Automated Process</span>
                <ul className="space-y-1 font-space text-[11px] text-emerald-700 list-disc list-inside">
                  <li>18s instant multimodal scan</li>
                  <li>Precise sub-pixel bounding boxes</li>
                  <li>Immediate creator rework guidance</li>
                  <li>100% auditable rule records</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
