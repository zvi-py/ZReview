import React, { useState, useEffect } from 'react';
import { AnalyticsData } from '../types';
import { api } from '../api';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  Building2,
  PieChart,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">
        Loading Trend Intelligence &amp; Analytics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="rounded-md bg-blue-500/20 border border-blue-400/30 px-2 py-0.5 text-xs font-semibold text-blue-200">
            Trend Intelligence
          </span>
          <span className="text-xs text-blue-200">Creative Performance Analytics</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight">Enterprise Compliance Intelligence</h1>
        <p className="text-xs text-blue-100 max-w-xl mt-1">
          Systemic failure root cause analysis, first-pass compliance rates, rework velocity, and
          brand compliance comparisons.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Submissions
          </span>
          <div className="mt-1 text-2xl font-black text-slate-900">{data.totalSubmissions}</div>
          <span className="text-[10px] text-slate-500">Across all active campaigns</span>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            Approval Rate
          </span>
          <div className="mt-1 text-2xl font-black text-emerald-700">{data.approvalRate}%</div>
          <span className="text-[10px] text-emerald-800/80">
            {Math.round((data.totalSubmissions * data.approvalRate) / 100)} assets passed &amp; approved
          </span>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            Rework Frequency
          </span>
          <div className="mt-1 text-2xl font-black text-amber-700">{data.reworkRate}%</div>
          <span className="text-[10px] text-amber-800/80">Creatives requiring V2 or higher</span>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
            Avg AI Compliance
          </span>
          <div className="mt-1 text-2xl font-black text-blue-700">
            {data.averageAiScore ?? data.averageFinalScore ?? 0}%
          </div>
          <span className="text-[10px] text-blue-800/80">Average Z rating</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Most Common Failure Reasons (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Top Creative Compliance Bottlenecks
              </h2>
              <p className="text-xs text-slate-500">
                Recurring parameter failure frequency across all rejected/reworked assets
              </p>
            </div>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>

          <div className="space-y-3">
            {data.commonFailures.map((failure, idx) => {
              const rate = failure.percentage ?? (failure as any).failureRate ?? 0;
              return (
                <div key={failure.parameterName || `failure-${idx}`} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{failure.parameterName}</span>
                    <span className="font-semibold text-slate-600">
                      {rate}% failure rate ({failure.count} assets)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 text-xs text-amber-950 mt-4">
            <span className="font-bold block mb-1">AI Recommendation for Creative Teams:</span>
            <p className="text-[11px] text-amber-900">
              Logo safe zone margin violations and low-contrast call-to-action buttons account for
              over 45% of first-submission rework loops. Ensuring 6% corner margins before submission
              drastically shortens approval turnaround.
            </p>
          </div>
        </div>

        {/* Brand Compliance Benchmarking (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Brand Portfolio Compliance</h2>
              <p className="text-xs text-slate-500">First-pass compliance by brand</p>
            </div>
            <Building2 className="h-4 w-4 text-blue-600" />
          </div>

          <div className="space-y-4">
            {data.brandCompliance.map((b, idx) => {
              const score = b.score ?? (b as any).averageScore ?? 0;
              const totalSubs = b.total ?? (b as any).totalSubmissions ?? 0;
              const passRate =
                totalSubs > 0
                  ? Math.round(((b.approved ?? 0) / totalSubs) * 100)
                  : ((b as any).passRate ?? 0);
              return (
                <div
                  key={b.brandName || (b as any).brandId || `brand-${idx}`}
                  className="rounded-xl border border-slate-200 p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{b.brandName}</span>
                    <span className="font-black text-blue-600">{score}% avg score</span>
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: `${score}%` }} />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                    <span>Submissions: {totalSubs}</span>
                    <span>Pass Rate: {passRate}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
