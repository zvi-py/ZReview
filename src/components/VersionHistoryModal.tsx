import React, { useState } from 'react';
import { Submission, SubmissionVersion } from '../types';
import {
  X,
  GitBranch,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Calendar,
} from 'lucide-react';

interface VersionHistoryModalProps {
  submission: Submission | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectVersion?: (versionNum: number) => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  submission,
  isOpen,
  onClose,
  onSelectVersion,
}) => {
  const [selectedVersionNum, setSelectedVersionNum] = useState<number>(
    submission?.currentVersion || 1
  );

  if (!isOpen || !submission) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-2 sm:p-4 backdrop-blur-sm overflow-hidden font-sans">
      <div className="relative w-full max-w-4xl h-[88vh] max-h-[88vh] flex flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all overflow-hidden text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 text-white px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ff5000] text-white shadow-xs">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#ff5000]">
                  [ VERSION ARCHIVE ]
                </span>
                <span className="text-white/20">&bull;</span>
                <h2 className="text-base font-bold font-syne text-white">
                  Creative Progression Archive
                </h2>
              </div>
              <p className="text-xs font-space text-slate-400 mt-0.5">
                {submission.campaignName} &bull; {submission.brandName} (Total {submission.versions.length} versions)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 font-sans bg-slate-50/50">
          {/* Progression Timeline Visualizer */}
          <div className="flex items-center justify-between overflow-x-auto pb-4 pt-2">
            {submission.versions.map((v, i) => {
              const isSelected = selectedVersionNum === v.versionNumber;
              const isPass = (v.aiScore || 0) >= 85;

              return (
                <div key={v.versionNumber} className="flex items-center">
                  <div
                    onClick={() => setSelectedVersionNum(v.versionNumber)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all text-center min-w-36 ${
                      isSelected
                        ? 'border-[#ff5000] bg-slate-900 text-white shadow-md ring-2 ring-[#ff5000]/25'
                        : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="rounded-md bg-[#ff5000] px-2 py-0.5 text-[10px] font-bold font-space text-white">
                        V{v.versionNumber}
                      </span>
                      <span
                        className={`text-xs font-black font-space ${
                          isPass ? 'text-emerald-400' : 'text-[#ff5000]'
                        }`}
                      >
                        {v.aiScore}%
                      </span>
                    </div>

                    <span className={`text-[10px] font-space block ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                      {new Date(v.submittedAt).toLocaleDateString()}
                    </span>

                    <span
                      className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[9px] font-space font-bold uppercase tracking-wider ${
                        v.workflowStatus === 'APPROVED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : v.workflowStatus === 'AWAITING_SUPERVISOR_REVIEW' ||
                            (v.workflowStatus as string) === 'AWAITING_MANAGER_REVIEW'
                          ? 'bg-[#ff5000]/20 text-[#ff5000] border border-[#ff5000]/40'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {v.workflowStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {i < submission.versions.length - 1 && (
                    <div className="mx-3 flex items-center text-slate-400">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Version Deep Dive */}
          {(() => {
            const v =
              submission.versions.find((x) => x.versionNumber === selectedVersionNum) ||
              submission.versions[0];
            const file = v?.files[0];

            return (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="md:col-span-5 space-y-2">
                  <div className="max-h-56 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 flex items-center justify-center">
                    <img
                      src={file?.fileUrl}
                      alt={file?.fileName}
                      className="max-h-56 w-full object-contain"
                    />
                  </div>
                  <div className="flex justify-between text-xs font-space text-slate-500 px-1">
                    <span>{file?.fileName}</span>
                    <span>{file?.fileType.toUpperCase()}</span>
                  </div>
                </div>

                <div className="md:col-span-7 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold font-syne text-slate-900">
                      Version {v?.versionNumber} Details
                    </h3>
                    <span className="text-sm font-black font-space text-[#ff5000]">
                      Compliance Score: {v?.aiScore}%
                    </span>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 space-y-1">
                    <span className="font-bold font-syne text-slate-900 block">Changelog Notes:</span>
                    <p className="text-slate-600 font-sans">
                      {v?.changelog || 'Initial submission baseline.'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 space-y-1">
                    <span className="font-bold font-syne text-slate-900 block">AI Executive Analysis:</span>
                    <p className="text-slate-600 font-sans">
                      {v?.analysisResult?.executiveSummary || 'Multimodal AI grading completed.'}
                    </p>
                  </div>

                  {v?.humanDecisionAt && (
                    <div className="rounded-2xl border border-emerald-800 bg-emerald-950 p-3.5 text-emerald-200">
                      <span className="font-bold font-syne block">
                        Human Decision: {v.humanDecision} by {v.humanReviewerName}
                      </span>
                      {v.humanComment && <p className="mt-0.5 text-[11px] font-sans">&ldquo;{v.humanComment}&rdquo;</p>}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-200 bg-white px-6 py-4 shrink-0">
          <button
            onClick={onClose}
            className="rounded-xl bg-[#ff5000] hover:bg-[#e04700] px-5 py-2.5 text-xs font-bold font-syne text-white transition-colors cursor-pointer shadow-xs"
          >
            Close Version History
          </button>
        </div>
      </div>
    </div>
  );
};
