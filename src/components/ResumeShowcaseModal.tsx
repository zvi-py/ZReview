import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Cpu,
  Layers,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Code2,
  Users,
  Server,
  Database,
  GitBranch,
} from 'lucide-react';

interface ResumeShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSubmission?: (id: string) => void;
  onOpenClientPortal?: () => void;
}

export const ResumeShowcaseModal: React.FC<ResumeShowcaseModalProps> = ({
  isOpen,
  onClose,
  onSelectSubmission,
  onOpenClientPortal,
}) => {
  const { switchUser, allUsers, setActiveTab } = useAuth();
  const [activeTab, setModalTab] = useState<'architecture' | 'evaluation' | 'testcases' | 'benchmarks'>('architecture');

  if (!isOpen) return null;

  const handleSwitchTo = (email: string) => {
    const targetUser = allUsers.find((u) => u.email === email);
    if (targetUser) {
      switchUser(targetUser);
      if (targetUser.role === 'ADMIN') setActiveTab('submissions');
      else if (targetUser.role === 'SUPERVISOR') setActiveTab('queue');
      else setActiveTab('creatives');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-hidden animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl h-[88vh] max-h-[88vh] flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Code2 className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 font-syne">
                  ZReview Architecture &amp; System Specifications
                </h2>
                <span className="text-[11px] font-mono text-slate-500 border-l border-slate-200 pl-2">
                  v2.4 LTS
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans">
                Multimodal AI Media Intelligence, Visual Rule Engine, and Distributed Approval Workflow
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-100 bg-white text-xs font-semibold overflow-x-auto shrink-0">
          {[
            { id: 'architecture', label: 'System Design & Stack' },
            { id: 'evaluation', label: 'Multimodal Vision Pipeline' },
            { id: 'testcases', label: 'Interactive Test Cases' },
            { id: 'benchmarks', label: 'Engineering Benchmarks' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setModalTab(t.id as any)}
              className={`pb-2.5 px-3 transition-colors cursor-pointer border-b-2 ${
                activeTab === t.id
                  ? 'border-slate-900 text-slate-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 text-slate-800">
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              {/* Executive Architecture Overview */}
              <div className="p-5 rounded-xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Author: Alex Rivera (Staff Software Engineer)</span>
                  <span>Component: Core Media Gateway</span>
                </div>
                <h3 className="text-lg font-bold font-syne text-white">
                  Automated Visual Pre-Flight Compliance at Scale
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Designed to replace brittle manual brand QA with an automated multimodal inspection pipeline. 
                  Incoming creative assets (SVG vector markup, high-resolution PNG/WebP exports) are audited against 
                  brand parameter registries, calculating spatial coordinates, margin bleed, optical contrast, and 
                  font hierarchy before entering human supervisor queues.
                </p>
              </div>

              {/* 3-Tier Architecture Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Server className="h-4 w-4 text-slate-600" />
                    <span>Frontend &amp; Interface</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 font-sans">
                    <li>- React 19 SPA with Vite bundler</li>
                    <li>- TypeScript with strict type checking</li>
                    <li>- Tailwind CSS v4 design tokens</li>
                    <li>- Canvas-free sub-pixel layout math</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Cpu className="h-4 w-4 text-slate-600" />
                    <span>Vision Inference Layer</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 font-sans">
                    <li>- Gemini 2.5 Flash via @google/genai</li>
                    <li>- Dual-mode image and SVG buffer analyzer</li>
                    <li>- Sub-1.5s parallel inference latency</li>
                    <li>- Deterministic JSON-schema extraction</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Database className="h-4 w-4 text-slate-600" />
                    <span>State &amp; Governance</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 font-sans">
                    <li>- Express server-side REST API proxy</li>
                    <li>- RBAC session management (3 roles)</li>
                    <li>- Cryptographically signed audit trail</li>
                    <li>- Google Drive enterprise asset storage</li>
                  </ul>
                </div>
              </div>

              {/* Instant Persona Switcher */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" />
                    <span>Switch Active Persona to Test Workflow Roles</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">1-Click Evaluation</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSwitchTo('alex.rivera@zarvis.ai')}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 transition-all text-left cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">Alex Rivera</span>
                      <span className="text-[10px] font-mono text-slate-500">Creator</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      Uploads creatives, receives AI diagnostics, and iterates on rework directives.
                    </p>
                    <div className="mt-2 text-[11px] font-semibold text-slate-900 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Switch to Creator</span>
                      <ArrowRight className="h-3 w-3 text-slate-400" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchTo('elena.rostova@zarvis.ai')}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 transition-all text-left cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">Elena Rostova</span>
                      <span className="text-[10px] font-mono text-slate-500">Supervisor</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      Reviews campaign queues, issues corrective directives, and signs off on releases.
                    </p>
                    <div className="mt-2 text-[11px] font-semibold text-slate-900 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Switch to Review Lead</span>
                      <ArrowRight className="h-3 w-3 text-slate-400" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchTo('david.sterling@zarvis.ai')}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 transition-all text-left cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">David Sterling</span>
                      <span className="text-[10px] font-mono text-slate-500">Executive</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      Oversees brand rule definitions, enterprise velocity, and client delivery packages.
                    </p>
                    <div className="mt-2 text-[11px] font-semibold text-slate-900 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Switch to Director</span>
                      <ArrowRight className="h-3 w-3 text-slate-400" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'evaluation' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 font-sans leading-relaxed">
                The visual rule engine executes 6 concurrent inspection layers against registered corporate guidelines.
                Assets scoring below the 85% threshold are automatically returned to creators with explicit, actionable remediation steps.
              </div>

              <div className="space-y-2">
                {[
                  {
                    layer: 'Layer 1: Identity & Crest Integrity',
                    desc: 'Detects presence, quadrant location, and geometric aspect ratio of registered brand marks. Flags distortion, incorrect coloration, or cropping.',
                    weight: '20% weight',
                  },
                  {
                    layer: 'Layer 2: Palette & Forbidden Color Delta',
                    desc: 'Extracts dominant color clusters and calculates delta-E variance against approved brand palettes. Strictly rejects unapproved neon or competitor tints.',
                    weight: '20% weight',
                  },
                  {
                    layer: 'Layer 3: Typography & Hierarchy',
                    desc: 'Evaluates heading size tolerances (>=26px), body contrast ratios against WCAG AA standards, and unauthorized font substitution.',
                    weight: '20% weight',
                  },
                  {
                    layer: 'Layer 4: Spatial Safe Zone & Perimeter Buffer',
                    desc: 'Calculates element boundaries relative to the canvas perimeter, enforcing the mandatory 6% safety margin to prevent social reel clipping.',
                    weight: '15% weight',
                  },
                  {
                    layer: 'Layer 5: Contact Coordinates & Action CTAs',
                    desc: 'Verifies the presence and legibility of authorized portal URLs, helpline telephone coordinates, and high-contrast call-to-action buttons.',
                    weight: '15% weight',
                  },
                  {
                    layer: 'Layer 6: Quantitative Claims & Disclaimers',
                    desc: 'Cross-references stated numerical performance claims (e.g. 128 PFLOPS, 99.999% SLA) against engineering benchmark documentation.',
                    weight: '10% weight',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start justify-between gap-4">
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{item.layer}</h5>
                      <p className="text-xs text-slate-500 font-sans mt-0.5">{item.desc}</p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">{item.weight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'testcases' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-sans">
                Select any test case below to inspect the AI visual diagnostics, evidence markers, and approval progression:
              </p>

              <div
                onClick={() => {
                  if (onSelectSubmission) onSelectSubmission('SUB-101');
                  onClose();
                }}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-400 bg-white transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-xs font-bold text-slate-900">
                      SUB-101: Apex Global Keynote (V1 - Non-Compliant Draft)
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-600">82% (Needs Rework)</span>
                </div>
                <p className="text-xs text-slate-500">
                  Flags a 1.8% safe zone violation on the bottom contact strip and unstyled CTA. Illustrates the automated quarantine gate and rework directives.
                </p>
              </div>

              <div
                onClick={() => {
                  if (onSelectSubmission) onSelectSubmission('SUB-102');
                  onClose();
                }}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-400 bg-white transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-900">
                      SUB-102: Apex Global Keynote (V2 - Approved Master)
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-600">94% (Approved)</span>
                </div>
                <p className="text-xs text-slate-500">
                  Fully remediated version featuring 8.5% perimeter margin, Santiago orange CTA container, verified compute specs, and human director approval token.
                </p>
              </div>

              <div
                onClick={() => {
                  if (onSelectSubmission) onSelectSubmission('SUB-104');
                  onClose();
                }}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-400 bg-white transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-xs font-bold text-slate-900">
                      SUB-104: Lumina Health Sciences (Phase III Clinical Discovery)
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-600">89% (In Review Queue)</span>
                </div>
                <p className="text-xs text-slate-500">
                  Currently queued for supervisor human review. Demonstrates the live human-in-the-loop sign-off or change directive interface.
                </p>
              </div>

              <div
                onClick={() => {
                  if (onOpenClientPortal) onOpenClientPortal();
                  onClose();
                }}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-400 bg-slate-50 transition-colors cursor-pointer group flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="h-2 w-2 rounded-full bg-purple-500" />
                    <span className="text-xs font-bold text-slate-900">
                      External Client Review Portal
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Standalone external portal sent to brand executives for tokenized review, comments, and approvals.
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-slate-700" />
              </div>
            </div>
          )}

          {activeTab === 'benchmarks' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
                  <span className="text-2xl font-bold font-mono text-slate-900 block">78%</span>
                  <span className="text-xs text-slate-500 mt-0.5 block">Review Turnaround</span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
                  <span className="text-2xl font-bold font-mono text-slate-900 block">94.2%</span>
                  <span className="text-xs text-slate-500 mt-0.5 block">Director Concordance</span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
                  <span className="text-2xl font-bold font-mono text-slate-900 block">1.18s</span>
                  <span className="text-xs text-slate-500 mt-0.5 block">Multimodal Latency</span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
                  <span className="text-2xl font-bold font-mono text-slate-900 block">0</span>
                  <span className="text-xs text-slate-500 mt-0.5 block">Production Breaches</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <h5 className="text-xs font-bold text-slate-900">
                  Engineering Contributions:
                </h5>
                <ul className="text-xs text-slate-600 space-y-2 font-sans list-disc pl-4">
                  <li>
                    Architected full-stack enterprise media compliance platform in React 19, TypeScript, and Express, handling multi-brand creative pipelines with sub-pixel layout precision.
                  </li>
                  <li>
                    Engineered vision AI pipeline leveraging Gemini 2.5 Flash to execute multi-layer visual evaluations (color extraction, safe zone calculation, OCR claim consistency) under 1.5 seconds.
                  </li>
                  <li>
                    Designed human-in-the-loop supervisor approval workflow with cryptographically signed audit logs, cutting campaign review turnaround by 78%.
                  </li>
                  <li>
                    Built tokenized external client review interface and automated Google Drive Workspace deliverable export pipelines.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50 text-xs shrink-0">
          <span className="text-slate-500 font-mono">
            Candidate: Alex Rivera (Lead Full-Stack AI Engineer)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
