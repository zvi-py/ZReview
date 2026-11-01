import React, { useState, useEffect, useRef } from 'react';
import { Brand, Campaign, Submission } from '../types';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { ClientShareModal } from './ClientShareModal';
import {
  X,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileImage,
  ArrowRight,
  Loader2,
  Building2,
  ShieldCheck,
  Link2,
  Cpu,
  Zap,
  ExternalLink,
  Share2,
  Eye,
} from 'lucide-react';

interface NewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmissionComplete: (submission: Submission) => void;
  preselectedBrandId?: string;
  onOpenScoreReport?: (submission: Submission) => void;
  onShareWithClient?: (submission: Submission) => void;
}

const CANVA_SAMPLE_LINKS = [
  {
    name: 'Apex Sovereign AI Summit',
    url: 'https://www.canva.com/design/DAF9apex-summit/view',
    expectedBrand: 'Apex Global Technologies',
    badge: 'Enterprise AI & Cloud',
    accentColor: '#00F2FE',
  },
  {
    name: 'Nova Apex GT Premiere',
    url: 'https://www.canva.com/design/DAF9nova-ev/view',
    expectedBrand: 'Nova Electric Mobility',
    badge: 'Autonomous EV',
    accentColor: '#10B981',
  },
  {
    name: 'Lumina Clinical Therapeutics',
    url: 'https://www.canva.com/design/DAF9lumina-health/view',
    expectedBrand: 'Lumina Health Sciences',
    badge: 'Precision Genomics',
    accentColor: '#0284C7',
  },
  {
    name: 'Veloce Algorithmic Wealth',
    url: 'https://www.canva.com/design/DAF9veloce-wealth/view',
    expectedBrand: 'Veloce Institutional FinTech',
    badge: 'Institutional Treasury',
    accentColor: '#F59E0B',
  },
];

interface SamplePoster {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  title: string;
  assetPath: string;
  badge: string;
  accentColor: string;
}

const COMPANY_SAMPLE_POSTERS: SamplePoster[] = [
  {
    id: 'sample-apex-summit',
    name: 'Apex Sovereign AI Summit',
    brandId: 'brand-apex',
    brandName: 'Apex Global Technologies',
    title: 'Sovereign AI & Superclusters Global Keynote',
    assetPath: '/assets/posters/apex-summit.svg',
    badge: 'Enterprise Cloud & AI',
    accentColor: '#00F2FE',
  },
  {
    id: 'sample-nova-gt',
    name: 'Nova Apex Gran Turismo',
    brandId: 'brand-nova',
    brandName: 'Nova Electric Mobility',
    title: 'Apex Gran Turismo World Premiere',
    assetPath: '/assets/posters/nova-ev.svg',
    badge: 'Autonomous EV',
    accentColor: '#10B981',
  },
  {
    id: 'sample-lumina-health',
    name: 'Lumina Clinical Phase III',
    brandId: 'brand-lumina',
    brandName: 'Lumina Health Sciences',
    title: 'Precision Biomarker Clinical Trial Enrollment',
    assetPath: '/assets/posters/lumina-health.svg',
    badge: 'Clinical Therapeutics',
    accentColor: '#0284C7',
  },
  {
    id: 'sample-veloce-wealth',
    name: 'Veloce Private Wealth',
    brandId: 'brand-veloce',
    brandName: 'Veloce Institutional FinTech',
    title: 'Algorithmic Wealth & Sovereign Treasury Launch',
    assetPath: '/assets/posters/veloce-wealth.svg',
    badge: 'Institutional FinTech',
    accentColor: '#F59E0B',
  },
];

export const NewSubmissionModal: React.FC<NewSubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmissionComplete,
  preselectedBrandId,
  onOpenScoreReport,
  onShareWithClient,
}) => {
  const { currentUser, systemSettings } = useAuth();

  const [activeTab, setActiveTab] = useState<'CANVA' | 'DIRECT'>('CANVA');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  // Canva Form State
  const [canvaUrl, setCanvaUrl] = useState<string>('');
  const [canvaTitle, setCanvaTitle] = useState<string>('');
  const [canvaNotes, setCanvaNotes] = useState<string>('');
  const [canvaTargetBrandId, setCanvaTargetBrandId] = useState<string>(preselectedBrandId || 'brand-nmc');

  // Direct Form State
  const [title, setTitle] = useState<string>('');
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [selectedSampleId, setSelectedSampleId] = useState<string>('');

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStepText, setAnalysisStepText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Post-AI Audit Completion & Direct Client Share State
  const [auditCompletedSub, setAuditCompletedSub] = useState<Submission | null>(null);
  const [showClientShareModal, setShowClientShareModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCloseModal = () => {
    setAuditCompletedSub(null);
    setShowClientShareModal(false);
    setErrorMsg(null);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      api.getBrands().then((data) => {
        const active = data.filter((b) => b.isActive);
        setBrands(active);
        if (preselectedBrandId) {
          const found = active.find((b) => b.id === preselectedBrandId);
          if (found) setSelectedBrand(found);
        } else if (active.length > 0 && !selectedBrand) {
          setSelectedBrand(active[0]);
        }
      });
      api.getCampaigns().then(setCampaigns);
    }
  }, [isOpen, preselectedBrandId]);

  if (!isOpen) return null;

  const handleSelectCanvaSample = (sample: (typeof CANVA_SAMPLE_LINKS)[0]) => {
    setCanvaUrl(sample.url);
    setCanvaTitle(sample.name);
    if (sample.url.includes('nmc') || sample.expectedBrand.includes('NMC')) {
      setCanvaTargetBrandId('brand-nmc');
    } else if (sample.url.includes('h200') || sample.expectedBrand.includes('NMCTech')) {
      setCanvaTargetBrandId('brand-nmctech');
    } else if (sample.url.includes('samsung') || sample.expectedBrand.includes('Samsung')) {
      setCanvaTargetBrandId('brand-samsung');
    } else if (sample.url.includes('dmi') || sample.expectedBrand.includes('DMI')) {
      setCanvaTargetBrandId('brand-dmi');
    } else if (sample.url.includes('sms') || sample.expectedBrand.includes('SMS')) {
      setCanvaTargetBrandId('brand-sms');
    } else if (sample.url.includes('jdc') || sample.expectedBrand.includes('Jain')) {
      setCanvaTargetBrandId('brand-jdc');
    }
    setErrorMsg(null);
  };

  const handleSelectSamplePoster = (sample: SamplePoster) => {
    setSelectedSampleId(sample.id);
    setFileDataUrl(sample.assetPath);
    setFileName(sample.assetPath.split('/').pop() || 'poster.svg');
    setFileSize(2.8 * 1024 * 1024);
    setTitle(sample.title);

    const matchBrand = brands.find((b) => b.id === sample.brandId);
    if (matchBrand) {
      setSelectedBrand(matchBrand);
    }
    setErrorMsg(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && !file.name.endsWith('.svg')) {
      setErrorMsg('Please upload an image file (PNG, JPG, WEBP, or SVG).');
      return;
    }

    if (file.size > systemSettings.maxFileSizeMb * 1024 * 1024) {
      setErrorMsg(`File size exceeds maximum permitted limit (${systemSettings.maxFileSizeMb}MB).`);
      return;
    }

    setSelectedSampleId('');
    setFileName(file.name);
    setFileSize(file.size);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = () => {
      setFileDataUrl(reader.result as string);
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRunCanvaAudit = async () => {
    if (!canvaUrl.trim()) {
      setErrorMsg('Please enter or select a Canva design URL.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    const steps = [
      'Ingesting Canva design & extracting creative preview buffer...',
      'Gemini Multimodal AI analyzing OCR, logo crests & hex palettes...',
      'Automated Brand Fingerprinting: matching against enterprise registered brands...',
      'Auditing compliance against brand parameters and threshold gate...',
      `Generating explainable audit score against ${systemSettings.aiApprovalThreshold}% threshold...`,
    ];

    let currentStep = 0;
    setAnalysisStepText(steps[0]);
    const stepInterval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setAnalysisStepText(steps[currentStep]);
      }
    }, 450);

    try {
      const newSubmission = await api.importCanvaSubmission({
        canvaUrl: canvaUrl.trim(),
        brandId: canvaTargetBrandId || undefined,
        title: canvaTitle.trim() || undefined,
        changelog: canvaNotes.trim() || undefined,
        userId: currentUser?.id,
        userName: currentUser?.name,
        userEmail: currentUser?.email,
        userAvatar: currentUser?.avatar,
      });

      clearInterval(stepInterval);
      setIsAnalyzing(false);
      onSubmissionComplete(newSubmission);
      setAuditCompletedSub(newSubmission);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      setErrorMsg(err.message || 'Canva import failed. Please verify the URL.');
    }
  };

  const handleRunAudit = async () => {
    if (!selectedBrand) {
      setErrorMsg('Please select a company brand.');
      return;
    }
    if (!fileDataUrl) {
      setErrorMsg('Please upload or select a company poster to audit.');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('Please provide a campaign title for this poster.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    const steps = [
      'Validating poster resolution & aspect ratio...',
      `Loading brand guidelines for ${selectedBrand.name}...`,
      'Evaluating logo placement, typography & color fidelity via Gemini multimodal AI...',
      'Checking contact information, call-to-action & regulatory disclaimers...',
      `Generating explainable audit score against ${systemSettings.aiApprovalThreshold}% approval threshold...`,
    ];

    let currentStep = 0;
    setAnalysisStepText(steps[0]);
    const stepInterval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setAnalysisStepText(steps[currentStep]);
      }
    }, 450);

    try {
      // Find or generate campaign id
      const matchCamp = campaigns.find((c) => c.brandId === selectedBrand.id);
      const campId = matchCamp ? matchCamp.id : `camp-${selectedBrand.id}`;

      const newSubmission = await api.createSubmission({
        campaignId: campId,
        brandId: selectedBrand.id,
        title: title.trim(),
        fileType: 'image',
        fileName: fileName || 'poster.svg',
        fileSizeMb: Number((fileSize / (1024 * 1024)).toFixed(2)) || 2.5,
        fileUrl: fileDataUrl,
        notes: 'Submitted via simplified pre-flight poster auditor.',
      });

      clearInterval(stepInterval);
      setIsAnalyzing(false);
      onSubmissionComplete(newSubmission);
      setAuditCompletedSub(newSubmission);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      setErrorMsg(err.message || 'Audit failed. Please try again.');
    }
  };

  return (
    <div
      id="new-submission-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-2 sm:p-4 overflow-hidden font-sans"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl h-[88vh] max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2E5629] text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#2E5629]">
                  {auditCompletedSub ? '[ AUDIT COMPLETE ]' : '[ PRE-FLIGHT AUDIT ]'}
                </span>
                <span className="text-white/20">&bull;</span>
                <h2 className="text-lg font-bold font-syne text-white">
                  {auditCompletedSub ? 'AI Review Finished' : 'Company Poster Intake'}
                </h2>
              </div>
              <p className="text-xs font-space text-slate-400 mt-0.5">
                {auditCompletedSub
                  ? `${auditCompletedSub.campaignName} evaluated against ${auditCompletedSub.brandName} guidelines`
                  : 'Upload or test enterprise posters against automated multimodal brand guidelines'}
              </p>
            </div>
          </div>
          <button
            id="close-submission-modal"
            onClick={handleCloseModal}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {auditCompletedSub ? (
          <div className="flex-1 min-h-0 p-6 space-y-6 overflow-y-auto font-sans bg-slate-50/50">
            {/* Completion Banner */}
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 text-center space-y-3">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold font-space text-emerald-800 border border-emerald-300 uppercase">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Multimodal AI Analysis Complete
                </div>
                <h3 className="text-xl font-bold font-syne text-slate-900">
                  {auditCompletedSub.campaignName}
                </h3>
                <p className="text-xs text-slate-500 font-space">
                  Brand: <span className="font-semibold text-slate-800">{auditCompletedSub.brandName}</span> &bull; 
                  Version: <span className="font-semibold text-slate-800">V{auditCompletedSub.currentVersion}</span>
                </p>
              </div>

              <div className="inline-flex items-center gap-3 rounded-2xl bg-white border border-slate-200 px-5 py-2.5 shadow-2xs">
                <span className="text-2xl font-bold font-syne text-[#2E5629]">
                  {auditCompletedSub.overallAiScore}%
                </span>
                <div className="text-left text-xs font-space border-l border-slate-200 pl-3">
                  <span className="font-bold text-slate-900 block">
                    {auditCompletedSub.overallAiScore >= 80 ? 'Passed Approval Gate' : 'Pending Review'}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Audited via Gemini Multimodal Vision
                  </span>
                </div>
              </div>
            </div>

            {/* Asset Snapshot & Findings */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {auditCompletedSub.versions?.[0]?.files?.[0]?.thumbnailUrl || auditCompletedSub.versions?.[0]?.files?.[0]?.fileUrl ? (
                  <img
                    src={auditCompletedSub.versions[0].files[0].thumbnailUrl || auditCompletedSub.versions[0].files[0].fileUrl}
                    alt={auditCompletedSub.campaignName}
                    referrerPolicy="no-referrer"
                    className="h-28 w-28 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                ) : null}
                <div className="space-y-2 text-left flex-1">
                  <span className="text-[10px] font-space font-bold uppercase tracking-wider text-slate-400 block">
                    Executive Summary:
                  </span>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {auditCompletedSub.versions?.[0]?.analysisResult?.executiveSummary ||
                      'Asset parameters evaluated for typography safe zones, crest fidelity, and legal disclaimers.'}
                  </p>
                  {auditCompletedSub.versions?.[0]?.files?.[0]?.assetHash && (
                    <div className="text-[10px] font-mono text-slate-400">
                      SHA-256: {auditCompletedSub.versions[0].files[0].assetHash.substring(0, 24)}...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions: Direct Share with Client */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                id="btn-share-with-client-now"
                type="button"
                onClick={() => setShowClientShareModal(true)}
                className="flex items-center gap-2 rounded-2xl bg-[#2E5629] hover:bg-[#22421E] px-6 py-3.5 text-sm font-bold font-syne text-white transition-all shadow-md shadow-[#2E5629]/20 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Details with Client Now</span>
              </button>

              {onOpenScoreReport && (
                <button
                  id="btn-inspect-score-report"
                  type="button"
                  onClick={() => {
                    onOpenScoreReport(auditCompletedSub);
                    handleCloseModal();
                  }}
                  className="flex items-center gap-2 rounded-2xl bg-slate-900 hover:bg-slate-800 px-5 py-3.5 text-sm font-bold font-syne text-white transition-all cursor-pointer shadow-xs"
                >
                  <Eye className="w-4 h-4" />
                  <span>Inspect Score Report</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-2xl border border-slate-300 hover:bg-slate-100 px-5 py-3.5 text-xs font-bold font-syne text-slate-700 transition cursor-pointer"
              >
                Done / Back to Workspace
              </button>
            </div>

            {/* Client Share Modal Dialog */}
            {showClientShareModal && (
              <ClientShareModal
                isOpen={showClientShareModal}
                submission={auditCompletedSub}
                brand={brands.find((b) => b.id === auditCompletedSub.brandId)}
                onClose={() => setShowClientShareModal(false)}
                onUpdated={(up) => setAuditCompletedSub(up)}
              />
            )}
          </div>
        ) : (
          <>
            {/* Tab Switcher */}
            <div className="shrink-0 flex border-b border-slate-200 bg-slate-100/80 px-6 pt-3 gap-2">
              <button
                id="tab-canva-intake"
                type="button"
                onClick={() => {
                  setActiveTab('CANVA');
                  setErrorMsg(null);
                }}
                className={`px-4 py-2.5 text-xs font-bold font-syne rounded-t-xl transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'CANVA'
                    ? 'bg-white text-slate-900 border-t-2 border-x border-[#2E5629] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Link2 className="w-4 h-4 text-[#2E5629]" />
                <span>Canva Link Ingestion</span>
                <span className="px-1.5 py-0.5 text-[9px] font-space font-bold rounded-md bg-[#2E5629]/10 text-[#2E5629] uppercase">
                  Auto Brand Detect
                </span>
              </button>
              <button
                id="tab-direct-upload"
                type="button"
                onClick={() => {
                  setActiveTab('DIRECT');
                  setErrorMsg(null);
                }}
                className={`px-4 py-2.5 text-xs font-bold font-syne rounded-t-xl transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'DIRECT'
                    ? 'bg-white text-slate-900 border-t-2 border-x border-[#2E5629] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <UploadCloud className="w-4 h-4 text-slate-600" />
                <span>Direct File Upload &amp; Posters</span>
              </button>
            </div>

        {/* Content */}
        <div className="flex-1 min-h-0 p-6 space-y-6 overflow-y-auto font-sans bg-slate-50/50">
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs font-space">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'CANVA' ? (
            /* CANVA INTAKE TAB */
            <div className="space-y-6">
              {/* Automated Brand Fingerprinting Notice */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white border border-slate-700/60 shadow-xs flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#2E5629]/20 text-[#BED8B9] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#BED8B9]/30">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold font-syne text-white uppercase tracking-wider">
                      Automated Brand Fingerprinting Engine
                    </h3>
                    <span className="px-2 py-0.5 text-[9px] font-space font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Zero Manual Brand Select Needed
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Paste any public Canva design URL. Gemini Multimodal Vision will automatically resolve the creative snapshot, extract OCR text, detect enterprise crests &amp; logos, verify hex color palettes, and fingerprint the exact matching brand (JDC, NMC, NMCTech, Samsung Belagavi, DMI Mart, SMS System) before running the pre-flight compliance audit.
                  </p>
                </div>
              </div>

              {/* Target Brand Selection for Guidelines Compliance */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold font-syne uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#2E5629]" />
                    Target Brand &amp; Compliance Rules
                  </label>
                  <span className="text-[11px] font-space text-slate-500">
                    Ensures design is evaluated against the correct brand
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {brands.map((b, bIdx) => {
                    const isSelected = canvaTargetBrandId === b.id;
                    return (
                      <button
                        key={`${b.id}-${bIdx}`}
                        type="button"
                        onClick={() => setCanvaTargetBrandId(b.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition cursor-pointer ${
                          isSelected
                            ? 'border-[#2E5629] bg-[#FAF7EE] text-slate-900 ring-2 ring-[#2E5629]/25 shadow-xs font-semibold'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: b.colorPalette?.primary || '#ff5000' }}
                        />
                        <div className="truncate text-xs">
                          <p className="truncate font-syne">{b.name}</p>
                          <p className="text-[10px] font-space text-slate-400">
                            {b.id === 'brand-nmc' ? 'Primary' : b.id.replace('brand-', '').toUpperCase()}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Canva URL Input Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold font-syne uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-[#2E5629]" />
                  Canva / Review Link (Required)
                </label>
                <div className="relative">
                  <input
                    id="input-canva-url"
                    type="url"
                    value={canvaUrl}
                    onChange={(e) => setCanvaUrl(e.target.value)}
                    placeholder="https://www.canva.com/design/DAF9.../view or https://canva.link/..."
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2E5629]/25 focus:border-[#2E5629] shadow-xs"
                  />
                  {canvaUrl && (
                    <button
                      type="button"
                      onClick={() => setCanvaUrl('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* 1-Click Canva Samples for Fast Demonstration */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-bold font-syne uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#2E5629]" />
                    Preset Canva Designs (1-Click Test Ingestion)
                  </label>
                  <span className="text-[11px] font-space text-slate-500">Click to autofill Canva URL</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {CANVA_SAMPLE_LINKS.map((sample, sIdx) => {
                    const isSelected = canvaUrl === sample.url;
                    return (
                      <button
                        key={`${sample.url}-${sIdx}`}
                        type="button"
                        onClick={() => handleSelectCanvaSample(sample)}
                        className={`text-left p-3 rounded-2xl border transition flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'border-[#2E5629] bg-slate-900 text-white ring-2 ring-[#2E5629]/25 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className="px-2 py-0.5 rounded-md text-[9px] font-space font-bold uppercase tracking-wider"
                            style={{
                              backgroundColor: `${sample.accentColor}20`,
                              color: sample.accentColor,
                            }}
                          >
                            {sample.badge}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                        </div>
                        <p className="text-xs font-bold font-syne">{sample.name}</p>
                        <p className={`text-[10px] font-space mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          Targets: {sample.expectedBrand}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Campaign Title & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold font-syne uppercase tracking-wider text-slate-700 block mb-1.5">
                    Campaign Title (Optional - auto-inferred if blank)
                  </label>
                  <input
                    id="input-canva-title"
                    type="text"
                    value={canvaTitle}
                    onChange={(e) => setCanvaTitle(e.target.value)}
                    placeholder="e.g. Banking Career Opportunities 2026"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-sans text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff5000]/25 focus:border-[#ff5000]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold font-syne uppercase tracking-wider text-slate-700 block mb-1.5">
                    Designer Notes / Version Changelog
                  </label>
                  <input
                    id="input-canva-notes"
                    type="text"
                    value={canvaNotes}
                    onChange={(e) => setCanvaNotes(e.target.value)}
                    placeholder="e.g. Ingested from marketing team Canva board"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-sans text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff5000]/25 focus:border-[#ff5000]"
                  />
                </div>
              </div>

              {/* Analysis Progress */}
              {isAnalyzing && (
                <div className="p-4 bg-slate-900 border border-[#ff5000]/40 rounded-2xl flex items-center gap-3 text-white animate-pulse">
                  <Loader2 className="w-5 h-5 text-[#ff5000] animate-spin flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold font-syne text-white">Multimodal Vision Fingerprinting &amp; Auditing...</p>
                    <p className="text-xs font-space text-slate-400 mt-0.5">{analysisStepText}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Quick Select Real Company Posters */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold font-syne uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#ff5000]" />
                Select Company Poster (1-Click Evaluation)
              </label>
              <span className="text-[11px] font-space text-[#ff5000] font-bold">Auto-populates brand &amp; creative</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {COMPANY_SAMPLE_POSTERS.map((sample, sIdx) => {
                const isSelected = selectedSampleId === sample.id || fileDataUrl === sample.assetPath;
                return (
                  <button
                    key={`${sample.id}-${sIdx}`}
                    id={`sample-poster-${sample.id}`}
                    type="button"
                    onClick={() => handleSelectSamplePoster(sample)}
                    className={`relative rounded-2xl border text-left p-2.5 transition flex flex-col items-center group cursor-pointer ${
                      isSelected
                        ? 'border-[#ff5000] bg-slate-900 text-white shadow-md ring-2 ring-[#ff5000]/25'
                        : 'border-slate-200 bg-white text-slate-900 hover:border-[#ff5000]'
                    }`}
                  >
                    <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-neutral-900 border border-slate-200 mb-2 relative">
                      <img
                        src={sample.assetPath}
                        alt={sample.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                        referrerPolicy="no-referrer"
                      />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#ff5000] text-white rounded-full flex items-center justify-center shadow">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <span className={`text-[11px] font-bold font-syne text-center line-clamp-1 w-full ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {sample.name}
                    </span>
                    <span className={`text-[9px] font-space text-center truncate w-full mt-0.5 ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                      {sample.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Media Upload / Preview */}
              <div>
                <label className="block text-xs font-bold font-syne uppercase tracking-wider text-slate-900 mb-2">
                  Poster Visual Asset
                </label>
                {fileDataUrl ? (
                  <div className="relative border border-slate-200 rounded-2xl overflow-hidden bg-slate-900 aspect-[4/3] flex items-center justify-center group shadow-xs">
                    <img
                      src={fileDataUrl}
                      alt="Poster Preview"
                      className="max-h-full max-w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-1.5 bg-white text-slate-900 text-xs font-bold font-syne rounded-xl shadow hover:bg-slate-100 cursor-pointer"
                      >
                        Replace Image
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFileDataUrl('');
                          setFileName('');
                          setSelectedSampleId('');
                        }}
                        className="px-3.5 py-1.5 bg-red-600 text-white text-xs font-bold font-syne rounded-xl shadow hover:bg-red-700 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-[#ff5000] rounded-2xl p-8 text-center cursor-pointer bg-white hover:bg-slate-50 transition flex flex-col items-center justify-center aspect-[4/3] shadow-xs"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#ff5000]/15 text-[#ff5000] flex items-center justify-center mb-3">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold font-syne text-slate-900">
                      Upload company poster image
                    </p>
                    <p className="text-xs font-space text-slate-500 mt-1">
                      PNG, JPG, WEBP, or SVG up to {systemSettings.maxFileSizeMb}MB
                    </p>
                    <span className="mt-3 text-xs font-space font-bold text-[#ff5000] bg-[#ff5000]/10 px-3.5 py-1 rounded-full border border-[#ff5000]/20">
                      Browse Files
                    </span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Right Column: Brand & Campaign Parameters */}
              <div className="space-y-4">
                {/* Brand Selection */}
                <div>
                  <label className="block text-xs font-bold font-syne uppercase tracking-wider text-slate-900 mb-1.5">
                    Target Brand Identity
                  </label>
                  <select
                    id="select-brand"
                    value={selectedBrand?.id || ''}
                    onChange={(e) => {
                      const b = brands.find((brand) => brand.id === e.target.value);
                      if (b) setSelectedBrand(b);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-space font-semibold text-slate-900 focus:outline-none focus:border-[#ff5000] shadow-xs"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Campaign Title */}
                <div>
                  <label className="block text-xs font-bold font-syne uppercase tracking-wider text-slate-900 mb-1.5">
                    Poster / Campaign Title
                  </label>
                  <input
                    id="input-submission-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Independence Day Special Creative"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-space text-slate-900 focus:outline-none focus:border-[#ff5000] shadow-xs"
                  />
                </div>

                {/* Brand Guidelines Quick Summary */}
                {selectedBrand && (
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold font-syne text-slate-900">Evaluation Guidelines</span>
                      <span className="text-[#ff5000] font-space font-bold text-[11px]">6 Active Parameters</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-space text-slate-500">
                      <span>Brand Palette:</span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-4 h-4 rounded-full border border-slate-300 shadow-xs"
                          style={{ backgroundColor: selectedBrand.colorPalette.primary }}
                          title={`Primary: ${selectedBrand.colorPalette.primary}`}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-slate-300 shadow-xs"
                          style={{ backgroundColor: selectedBrand.colorPalette.secondary }}
                          title={`Secondary: ${selectedBrand.colorPalette.secondary}`}
                        />
                        {selectedBrand.colorPalette.accent && (
                          <span
                            className="w-4 h-4 rounded-full border border-slate-300 shadow-xs"
                            style={{ backgroundColor: selectedBrand.colorPalette.accent }}
                            title={`Accent: ${selectedBrand.colorPalette.accent}`}
                          />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 font-sans">
                      {selectedBrand.creativeRules.ctaRequirement}
                    </p>
                  </div>
                )}

                {/* Analysis In-Progress Banner */}
                {isAnalyzing && (
                  <div className="p-4 bg-slate-900 border border-[#ff5000]/40 rounded-2xl flex items-center gap-3 text-white">
                    <Loader2 className="w-5 h-5 text-[#ff5000] animate-spin flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold font-syne text-white">Evaluating Brand Compliance...</p>
                      <p className="text-xs font-space text-slate-400">{analysisStepText}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white text-slate-900">
          <div className="text-xs font-space text-slate-500">
            Compliance threshold: <strong className="text-slate-900 font-bold">{systemSettings.aiApprovalThreshold}%</strong>
            {activeTab === 'CANVA' && (
              <span className="ml-2 text-emerald-600 font-medium">
                &bull; Auto Brand Fingerprinting Active
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isAnalyzing}
              className="px-4 py-2 text-xs font-bold font-syne text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            {activeTab === 'CANVA' ? (
              <button
                id="btn-run-canva-audit"
                type="button"
                disabled={isAnalyzing || !canvaUrl.trim()}
                onClick={handleRunCanvaAudit}
                className="px-5 py-2.5 bg-[#2E5629] hover:bg-[#22421E] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold font-syne rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Fingerprinting &amp; Auditing...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4" />
                    <span>Import &amp; Fingerprint Brand</span>
                  </>
                )}
              </button>
            ) : (
              <button
                id="btn-run-audit"
                type="button"
                disabled={isAnalyzing || !fileDataUrl || !title.trim()}
                onClick={handleRunAudit}
                className="px-5 py-2.5 bg-[#2E5629] hover:bg-[#22421E] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold font-syne rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Auditing Creative...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Run Multimodal Pre-Flight Audit</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
};
