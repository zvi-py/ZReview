import React, { useEffect, useRef, useState } from 'react';
import { X, Film, Monitor } from 'lucide-react';

interface ZReviewVideoDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewSubmission?: () => void;
  onSetThreshold?: (threshold: number) => void;
}

export const DEMO_VIDEOS = {
  cafe: '/assets/aistudio/gemini_generated_video_ae3562fe_c175d25a.mp4',
  platform: '/assets/aistudio/gemini_generated_video_9aa61371_eeb1a658.mp4',
};

export const ZReviewVideoDemoModal: React.FC<ZReviewVideoDemoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeVideo, setActiveVideo] = useState<'cafe' | 'platform'>('cafe');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Autoplay immediately on open with 5% decreased playback speed (0.95x)
  useEffect(() => {
    if (!isOpen) return;

    const startPlayback = async () => {
      if (!videoRef.current) return;
      try {
        videoRef.current.currentTime = 0;
        videoRef.current.playbackRate = 0.95;
        await videoRef.current.play();
      } catch {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.playbackRate = 0.95;
          videoRef.current.play().catch(() => {});
        }
      }
    };

    const timer = setTimeout(startPlayback, 50);
    return () => clearTimeout(timer);
  }, [isOpen, activeVideo]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 h-screen w-screen bg-black flex items-center justify-center overflow-hidden font-sans select-none animate-in fade-in duration-200">
      {/* Full Screen Video - Takes Up The Whole Screen */}
      <video
        key={activeVideo}
        ref={videoRef}
        src={DEMO_VIDEOS[activeVideo]}
        className="w-full h-full object-contain cursor-pointer"
        autoPlay
        loop
        playsInline
        controls={false}
        onClick={() => {
          if (!videoRef.current) return;
          if (videoRef.current.paused) {
            videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
        }}
      />

      {/* Top Controls Bar: Minimalist Film Switcher + Exit Button */}
      <div className="absolute top-6 left-6 right-6 z-50 flex items-center justify-between pointer-events-none">
        {/* Video Mode Selector */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
          <button
            type="button"
            onClick={() => setActiveVideo('cafe')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold font-syne transition-all cursor-pointer ${
              activeVideo === 'cafe'
                ? 'bg-[#2E5629] text-white shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Film className="h-3 w-3" />
            <span>Cafe Film</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveVideo('platform')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold font-syne transition-all cursor-pointer ${
              activeVideo === 'platform'
                ? 'bg-[#2E5629] text-white shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Monitor className="h-3 w-3" />
            <span>Platform Demo</span>
          </button>
        </div>

        {/* Exit Button */}
        <button
          type="button"
          onClick={onClose}
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-black/75 hover:bg-[#2E5629] text-white border border-white/20 hover:border-[#2E5629] px-4 py-2.5 text-xs font-bold font-syne transition-all duration-200 cursor-pointer shadow-2xl backdrop-blur-md group"
          title="Exit Demo (ESC)"
        >
          <span>Exit</span>
          <X className="h-4 w-4 transition-transform group-hover:rotate-90" />
          <span className="hidden sm:inline-block rounded bg-white/20 px-1.5 py-0.2 text-[10px] font-mono text-white/80">
            ESC
          </span>
        </button>
      </div>
    </div>
  );
};
