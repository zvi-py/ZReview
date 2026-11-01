import React, { useState, useRef } from 'react';
import { Submission } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import {
  X,
  UploadCloud,
  RotateCcw,
  ShieldCheck,
  FileImage,
  FileVideo,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  History,
} from 'lucide-react';

interface ReworkModalProps {
  submission: Submission | null;
  isOpen: boolean;
  onClose: () => void;
  onVersionCreated: (updatedSubmission: Submission) => void;
}

export const ReworkModal: React.FC<ReworkModalProps> = ({
  submission,
  isOpen,
  onClose,
  onVersionCreated,
}) => {
  const { currentUser, systemSettings } = useAuth();

  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [changelog, setChangelog] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !submission) return null;

  const nextVersionNumber = submission.versions.length + 1;
  const previousVersion = submission.versions[submission.versions.length - 1];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > systemSettings.maxFileSizeMb * 1024 * 1024) {
      setErrorMsg(`File exceeds maximum size of ${systemSettings.maxFileSizeMb}MB`);
      return;
    }

    setErrorMsg(null);
    setFileName(file.name);
    setFileSize(file.size);
    const isVid = file.type.startsWith('video/');
    setMediaType(isVid ? 'video' : 'image');

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileDataUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const useSampleImprovedImage = () => {
    setMediaType('image');
    setFileName('apex_hyperstrata_v2_corrected_palette.jpg');
    setFileSize(2450000);
    setFileDataUrl('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=80');
    setChangelog('Replaced forbidden red background with official brand blue (#0D50F2) and adjusted logo safe zone margin.');
  };

  const handleSubmitRework = async () => {
    if (!fileDataUrl) {
      setErrorMsg('Please upload a revised media file or select a sample.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const updated = await api.submitNewVersion(submission.id, {
        userId: currentUser?.id,
        userName: currentUser?.name,
        changelog: changelog || `Version ${nextVersionNumber} revision addressing previous feedback.`,
        files: [
          {
            id: `file-v${nextVersionNumber}-${Date.now()}`,
            fileName: fileName || `revision_asset_v${nextVersionNumber}`,
            fileType: mediaType,
            mimeType: mediaType === 'video' ? 'video/mp4' : 'image/jpeg',
            fileSize: fileSize || 2048000,
            fileUrl: fileDataUrl,
          },
        ],
      });

      onVersionCreated(updated);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to submit revised version');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-2 sm:p-4 backdrop-blur-sm overflow-hidden font-sans">
      <div className="relative w-full max-w-2xl h-[88vh] max-h-[88vh] flex flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all overflow-hidden text-slate-900">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2E5629] text-white shadow-xs">
              <RotateCcw className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Fix &amp; Resubmit Creative — Version {nextVersionNumber}
              </h2>
              <p className="text-xs text-slate-500">
                {submission.campaignName} ({submission.brandName})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Previous Version Feedback Summary */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 text-xs text-amber-950">
            <div className="flex items-center justify-between font-bold mb-1">
              <span>Previous Version {previousVersion?.versionNumber} AI Score: {previousVersion?.aiScore}%</span>
              <span className="text-[10px] uppercase font-bold text-amber-800">
                Threshold: {systemSettings.aiApprovalThreshold}%
              </span>
            </div>
            <p className="text-[11px] text-amber-900">
              {previousVersion?.analysisResult?.executiveSummary ||
                'Creative was below the approval threshold. Upload corrected media addressing identified issues.'}
            </p>
          </div>

          {/* Changelog / Fix description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              What changes were made in Version {nextVersionNumber}?
            </label>
            <textarea
              rows={2}
              value={changelog}
              onChange={(e) => setChangelog(e.target.value)}
              placeholder="e.g. Fixed color palette to brand hex, repositioned logo into safe zone, added high-contrast call-to-action button..."
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          {/* Upload Dropzone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Upload Corrected Media Asset
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition-all cursor-pointer ${
                fileDataUrl
                  ? 'border-blue-500 bg-blue-50/20'
                  : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {!fileDataUrl ? (
                <>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-2">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    Click to select corrected file or drop here
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Images or Video up to {systemSettings.maxFileSizeMb}MB
                  </p>
                </>
              ) : (
                <div className="w-full">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileImage className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-semibold text-slate-900">{fileName}</span>
                    </div>
                    <span className="text-[10px] text-blue-600 font-semibold hover:underline">
                      Replace
                    </span>
                  </div>
                  <img
                    src={fileDataUrl}
                    alt="Preview"
                    className="max-h-44 w-full object-contain rounded-lg border border-slate-200 bg-slate-50"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Quick preset for easy testing */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">
              Want to simulate a successful fix immediately?
            </span>
            <button
              type="button"
              onClick={useSampleImprovedImage}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50 shadow-2xs transition-colors"
            >
              <ShieldCheck className="h-3 w-3 text-blue-600" />
              <span>Use High-Score V{nextVersionNumber} Preset</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-3.5">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmitRework}
            disabled={!fileDataUrl || isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-[#2E5629] hover:bg-[#22421E] px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-[#2E5629]/20 hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>{isSubmitting ? 'Evaluating V' + nextVersionNumber + '...' : 'Submit V' + nextVersionNumber + ' For AI Analysis'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
