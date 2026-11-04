import React, { useEffect, useRef, useState } from 'react';
import { X, Film, Monitor, Volume2, VolumeX, RotateCcw, Maximize, Minimize, Expand, Shrink } from 'lucide-react';

interface ZReviewVideoDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewSubmission?: () => void;
  onSetThreshold?: (threshold: number) => void;
}

// Extended high-definition videos: 31 seconds for platform walkthrough, 20 seconds for cafe film
export const DEMO_VIDEOS = {
  platform: '/assets/aistudio/zreview_extended_walkthrough.mp4',
  cafe: '/assets/aistudio/gemini_generated_video_b1c402ce_c5ef3847.mp4',
};

const PLATFORM_TOUR_STEPS = [
  {
    step: 1,
    title: 'Platform Overview',
    text: 'Welcome to ZReview, the enterprise multimodal AI compliance and creative approval system.',
    durationMs: 6000,
  },
  {
    step: 2,
    title: 'Multimodal Vision Pre-Flight',
    text: 'When a creator uploads a poster, our vision model audits the creative against brand guidelines in under 2.4 seconds.',
    durationMs: 6000,
  },
  {
    step: 3,
    title: '85% Approval Gate',
    text: 'Creatives scoring 85% or higher pass the AI gate and advance to the supervisor queue for human sign-off.',
    durationMs: 6000,
  },
  {
    step: 4,
    title: 'Explainable Feedback & Rework',
    text: 'Any asset scoring below 85% receives explainable parameter diagnostics and instant rework recommendations.',
    durationMs: 6000,
  },
  {
    step: 5,
    title: 'Human Sign-off & Delivery',
    text: 'Review leads approve client-ready packages, ensuring pristine visual standards across all campaigns.',
    durationMs: 7000,
  },
];

const CAFE_TOUR_STEPS = [
  {
    step: 1,
    title: 'Aesthetic Showcase',
    text: 'Explore our aesthetic cafe creative campaign featuring ceremonial Japanese Uji matcha and strawberry cold foam.',
    durationMs: 9000,
  },
  {
    step: 2,
    title: 'Brand Compliance',
    text: 'Every artisan drink poster and video is checked for Pantone color balance, logo margins, and typography hierarchy.',
    durationMs: 11000,
  },
];

export const ZReviewVideoDemoModal: React.FC<ZReviewVideoDemoModalProps> = ({
  isOpen,
  onClose,
}) => {
  // First video is Platform Demo in the whole screen
  const [activeVideo, setActiveVideo] = useState<'platform' | 'cafe'>('platform');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [showCaptions, setShowCaptions] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);

  const modalContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const stepTimerRef = useRef<any>(null);

  const activeSteps = activeVideo === 'platform' ? PLATFORM_TOUR_STEPS : CAFE_TOUR_STEPS;
  const currentStep = activeSteps[currentStepIndex] || activeSteps[0];

  // Stop speech synthesis & audio on unmount or close
  const stopAllAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (stepTimerRef.current) {
      clearTimeout(stepTimerRef.current);
      stepTimerRef.current = null;
    }
  };

  // Track native fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsNativeFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleNativeFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (modalContainerRef.current?.requestFullscreen) {
          await modalContainerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch {
      // Fullscreen not supported or blocked
    }
  };

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        stopAllAudio();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stopAllAudio();
    };
  }, [isOpen, onClose]);

  // Autoplay video immediately on open with 5% decreased playback speed (0.95x)
  useEffect(() => {
    if (!isOpen) {
      stopAllAudio();
      return;
    }

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

  // Play narration track for current video
  const playNarrationSequence = (startIndex = 0) => {
    stopAllAudio();
    if (!isAudioEnabled || !isOpen) return;

    let index = startIndex;
    setCurrentStepIndex(index);

    const speakStep = (idx: number) => {
      if (!isOpen || !isAudioEnabled) return;
      const step = activeSteps[idx];
      if (!step) {
        // Loop narration after brief pause
        stepTimerRef.current = setTimeout(() => {
          speakStep(0);
        }, 2000);
        return;
      }

      setCurrentStepIndex(idx);

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(step.text);
        utterance.rate = 0.95; // 5% slower for crystal clear explanation
        utterance.pitch = 1.0;

        // Pick best natural voice if available
        const voices = window.speechSynthesis.getVoices();
        const englishVoice =
          voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))) ||
          voices.find((v) => v.lang.startsWith('en'));
        if (englishVoice) {
          utterance.voice = englishVoice;
        }

        utterance.onend = () => {
          stepTimerRef.current = setTimeout(() => {
            speakStep((idx + 1) % activeSteps.length);
          }, 800);
        };

        utterance.onerror = () => {
          stepTimerRef.current = setTimeout(() => {
            speakStep((idx + 1) % activeSteps.length);
          }, step.durationMs);
        };

        window.speechSynthesis.speak(utterance);
      } else {
        stepTimerRef.current = setTimeout(() => {
          speakStep((idx + 1) % activeSteps.length);
        }, step.durationMs);
      }
    };

    // Small delay so video starts first
    stepTimerRef.current = setTimeout(() => {
      speakStep(index);
    }, 400);
  };

  // Try fetching Gemini TTS audio from server, fallback seamlessly to speech synthesis
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    fetch('/api/demo/narrative-audio')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.audioBase64 && isAudioEnabled) {
          try {
            const audioBlob = new Blob([Uint8Array.from(atob(data.audioBase64), (c) => c.charCodeAt(0))], {
              type: data.mimeType || 'audio/wav',
            });
            const audioUrl = URL.createObjectURL(audioBlob);
            if (audioRef.current) {
              audioRef.current.src = audioUrl;
              audioRef.current.play().catch(() => {
                playNarrationSequence(0);
              });
              return;
            }
          } catch {
            playNarrationSequence(0);
          }
        } else {
          playNarrationSequence(0);
        }
      })
      .catch(() => {
        if (isMounted) playNarrationSequence(0);
      });

    return () => {
      isMounted = false;
      stopAllAudio();
    };
  }, [isOpen, activeVideo, isAudioEnabled]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalContainerRef}
      className="fixed inset-0 z-50 h-screen w-screen bg-black flex items-center justify-center overflow-hidden font-sans select-none animate-in fade-in duration-200"
    >
      {/* Audio element for server TTS WAV fallback */}
      <audio ref={audioRef} className="hidden" />

      {/* Full Screen Video - Takes Up The Whole Screen Edge-to-Edge */}
      <video
        key={activeVideo}
        ref={videoRef}
        src={DEMO_VIDEOS[activeVideo]}
        className={`w-full h-full cursor-pointer transition-all duration-300 ${
          fitMode === 'cover' ? 'object-cover' : 'object-contain'
        }`}
        autoPlay
        loop
        playsInline
        controls={false}
        onDoubleClick={toggleNativeFullscreen}
        onClick={() => {
          if (!videoRef.current) return;
          if (videoRef.current.paused) {
            videoRef.current.play();
            if (isAudioEnabled) playNarrationSequence(currentStepIndex);
          } else {
            videoRef.current.pause();
            stopAllAudio();
          }
        }}
        title="Click to Play/Pause, Double-click for Full Screen"
      />

      {/* Top Controls Bar: Film Switcher + Narration Toggle + Fit/Fill + Fullscreen + Exit */}
      <div className="absolute top-6 left-6 right-6 z-50 flex items-center justify-between pointer-events-none gap-2">
        {/* Left Side: Video Mode Selector + Audio Narration Controls + Screen Mode */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-black/75 backdrop-blur-xl border border-white/20 shadow-2xl">
          {/* Platform Demo Button (31s Extended) */}
          <button
            type="button"
            onClick={() => setActiveVideo('platform')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold font-syne transition-all cursor-pointer ${
              activeVideo === 'platform'
                ? 'bg-[#FF5E97] text-white shadow-sm'
                : 'text-white/75 hover:text-white'
            }`}
          >
            <Monitor className="h-3 w-3" />
            <span>Platform Demo</span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-black/30 text-white/90">31s</span>
          </button>

          {/* Cafe Film Button (20s Extended) */}
          <button
            type="button"
            onClick={() => setActiveVideo('cafe')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold font-syne transition-all cursor-pointer ${
              activeVideo === 'cafe'
                ? 'bg-[#FF5E97] text-white shadow-sm'
                : 'text-white/75 hover:text-white'
            }`}
          >
            <Film className="h-3 w-3" />
            <span>Cafe Film</span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-black/30 text-white/90">20s</span>
          </button>

          {/* Voiceover Narration Toggle */}
          <button
            type="button"
            onClick={() => {
              if (isAudioEnabled) {
                stopAllAudio();
                setIsAudioEnabled(false);
              } else {
                setIsAudioEnabled(true);
                playNarrationSequence(0);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              isAudioEnabled
                ? 'bg-white/20 text-white border-white/40 shadow-xs'
                : 'bg-transparent text-white/50 border-white/10 hover:text-white/80'
            }`}
            title={isAudioEnabled ? 'Mute Audio Explanation' : 'Turn On Audio Explanation'}
          >
            {isAudioEnabled ? (
              <>
                <Volume2 className="h-3 w-3 text-[#FF5E97] animate-pulse" />
                <span className="font-space">Audio: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3 w-3" />
                <span className="font-space">Audio: OFF</span>
              </>
            )}
          </button>

          {/* Restart Narration */}
          {isAudioEnabled && (
            <button
              type="button"
              onClick={() => playNarrationSequence(0)}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/75 hover:text-white transition-colors cursor-pointer"
              title="Restart Audio Explanation"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          )}

          {/* Subtitles (CC) Toggle */}
          <button
            type="button"
            onClick={() => setShowCaptions(!showCaptions)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-space font-bold transition-all cursor-pointer ${
              showCaptions
                ? 'bg-white/20 text-white'
                : 'text-white/40 hover:text-white'
            }`}
            title="Toggle Subtitles"
          >
            CC
          </button>

          {/* Fit / Fill Screen Toggle */}
          <button
            type="button"
            onClick={() => setFitMode(fitMode === 'cover' ? 'contain' : 'cover')}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
              fitMode === 'cover'
                ? 'bg-white/20 text-white border-white/40'
                : 'bg-transparent text-white/70 border-white/10 hover:text-white'
            }`}
            title={fitMode === 'cover' ? 'Switch to Fit Screen (Letterbox)' : 'Switch to Fill Full Screen (Edge-to-edge)'}
          >
            {fitMode === 'cover' ? (
              <>
                <Shrink className="h-3 w-3 text-[#FF5E97]" />
                <span className="text-[11px] font-space">Fill Screen</span>
              </>
            ) : (
              <>
                <Expand className="h-3 w-3" />
                <span className="text-[11px] font-space">Fit Screen</span>
              </>
            )}
          </button>
        </div>

        {/* Right Side: Native Full Screen + Exit */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Native Browser Fullscreen Button */}
          <button
            type="button"
            onClick={toggleNativeFullscreen}
            className="flex items-center gap-1.5 rounded-full bg-black/75 hover:bg-white/20 text-white border border-white/20 px-3 py-2.5 text-xs font-bold font-syne transition-all duration-200 cursor-pointer shadow-2xl backdrop-blur-md"
            title={isNativeFullscreen ? 'Exit Native Full Screen' : 'Enter Native Full Screen (F11)'}
          >
            {isNativeFullscreen ? (
              <>
                <Minimize className="h-3.5 w-3.5 text-[#FF5E97]" />
                <span className="hidden sm:inline">Exit Full</span>
              </>
            ) : (
              <>
                <Maximize className="h-3.5 w-3.5 text-[#FF5E97]" />
                <span className="hidden sm:inline">Full Screen</span>
              </>
            )}
          </button>

          {/* Exit Button */}
          <button
            type="button"
            onClick={() => {
              stopAllAudio();
              onClose();
            }}
            className="flex items-center gap-2 rounded-full bg-black/75 hover:bg-[#FF5E97] text-white border border-white/20 hover:border-[#FF5E97] px-4 py-2.5 text-xs font-bold font-syne transition-all duration-200 cursor-pointer shadow-2xl backdrop-blur-md group shrink-0"
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

      {/* =========================================================================
          LIVE AUDIO SUBTITLES & EXPLANATION BANNER (Bottom Center)
          Synchronized closed-captions explaining how the system works
          ========================================================================= */}
      {showCaptions && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-2xl pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="pointer-events-auto rounded-2xl bg-black/80 backdrop-blur-2xl border border-white/25 px-5 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.3)] text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#FF5E97] animate-ping" />
              <span className="text-[10px] font-space font-bold uppercase tracking-wider text-[#FF85B3]">
                {currentStep.title} &bull; Step {currentStep.step} of {activeSteps.length}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-sans text-white/95 leading-relaxed font-medium">
              &ldquo;{currentStep.text}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

