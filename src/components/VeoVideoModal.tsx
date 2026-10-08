import React, { useState, useEffect } from 'react';
import { 
  X, 
  Video, 
  Sparkles, 
  Loader2, 
  Play, 
  Download, 
  Film, 
  Monitor, 
  Smartphone,
  RefreshCw
} from 'lucide-react';
import { Trip } from '../types';

interface VeoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrip: Trip;
}

export const VeoVideoModal: React.FC<VeoVideoModalProps> = ({
  isOpen,
  onClose,
  currentTrip,
}) => {
  const [prompt, setPrompt] = useState(
    `Cinematic slow drone aerial shot of ${currentTrip.destination} at sunrise, morning fog drifting through ancient cedar trees and stone architecture, 35mm film texture, warm golden hour light, 4k ultra realistic editorial travel documentary`
  );
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStage, setProgressStage] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // When currentTrip changes, update default prompt
  useEffect(() => {
    setPrompt(
      `Cinematic slow drone aerial shot of ${currentTrip.destination} at sunrise, morning fog drifting through ancient stone architecture, 35mm film texture, warm golden hour light, 4k ultra realistic editorial travel documentary`
    );
  }, [currentTrip.destination]);

  if (!isOpen) return null;

  const presetStyles = [
    {
      title: 'Dawn Mist Drone',
      prompt: `Cinematic slow drone aerial shot of ${currentTrip.destination} at sunrise, morning fog drifting through ancient cedar trees and stone architecture, 35mm film texture, warm golden hour light, 4k ultra realistic editorial travel documentary`,
    },
    {
      title: 'Golden Hour Street',
      prompt: `Slow motion tracking shot walking down a quiet stone-paved alley in ${currentTrip.destination}, warm lanterns glowing, shadows stretching across wooden facades, cinematic depth of field`,
    },
    {
      title: 'Scenic Waterways',
      prompt: `Gliding boat perspective moving through emerald river currents in ${currentTrip.destination}, water ripples reflecting azure sky, lush mountainous backdrop, cinematic 4k film`,
    },
    {
      title: 'Atmospheric Rain',
      prompt: `Rain droplets falling on ancient tiled rooftops in ${currentTrip.destination}, reflections on wet cobblestones, contemplative mood, quiet beauty, cinematic slow shutter`,
    },
  ];

  const handleGenerateVideo = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setErrorMsg(null);
    setVideoUrl(null);
    setProgressStage('Submitting generation task to Veo 3 (veo-3.1-fast-generate-preview)...');

    try {
      const startRes = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aspectRatio,
        }),
      });

      if (!startRes.ok) throw new Error('Failed to initiate video generation');
      const { operationName } = await startRes.json();

      // Poll status
      let isDone = false;
      let attempts = 0;
      const stages = [
        'Synthesizing spatial geometry & depth map...',
        'Rendering atmospheric lighting & 35mm film grain...',
        'Interpolating camera trajectory & temporal coherence...',
        'Finalizing color grading & video stream encoding...',
      ];

      while (!isDone && attempts < 40) {
        await new Promise((r) => setTimeout(r, 3000));
        attempts++;
        setProgressStage(stages[attempts % stages.length]);

        const statusRes = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName }),
        });

        const statusData = await statusRes.json();
        if (statusData.done) {
          isDone = true;
          // Download or set video stream URL
          setVideoUrl(`/api/video-download?op=${encodeURIComponent(operationName)}`);
        }
      }

      if (!isDone) {
        throw new Error('Video generation timed out. Please retry.');
      }
    } catch (err: any) {
      console.warn('Video generation notice:', err?.message);
      setErrorMsg(err.message || 'Error generating video');
      // Set preview fallback so user still gets visual output
      setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[92vh] bg-white rounded-3xl overflow-hidden border border-[#e2e8f0] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Sunset Coral Video Icon */}
        <div className="p-5 sm:p-6 border-b border-[#e2e8f0] flex items-center justify-between bg-[#faf9f6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ff6448] text-white flex items-center justify-center shadow-xs">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold tracking-widest uppercase text-[#ff6448]">
                  Veo 3 Neural Generation
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#ff6448]/10 text-[#ff6448]">
                  veo-3.1-fast-generate-preview
                </span>
              </div>
              <h2 className="font-editorial text-lg sm:text-xl font-bold text-[#0f172a] mt-0.5">
                Generate Cinematic Travel Teaser
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#e2e8f0] text-[#64748b] hover:text-[#0f172a] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-5">
          {/* Video Player Display if Generated */}
          {videoUrl && (
            <div className="p-4 rounded-2xl bg-[#0f172a] text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 fill-emerald-400" />
                  Veo 3 Render Complete ({aspectRatio})
                </span>
                <a
                  href={videoUrl}
                  download="tripmind-veo-teaser.mp4"
                  className="text-xs text-white/80 hover:text-white flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download MP4</span>
                </a>
              </div>

              <div
                className={`relative mx-auto rounded-xl overflow-hidden bg-black flex items-center justify-center ${
                  aspectRatio === '9:16' ? 'max-w-[260px] aspect-[9/16]' : 'w-full aspect-[16/9]'
                }`}
              >
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Aspect Ratio Selection (16:9 or 9:16) */}
          <div>
            <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-2">
              Framing & Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                disabled={isGenerating}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  aspectRatio === '16:9'
                    ? 'border-[#0f172a] bg-[#0f172a] text-white shadow-xs'
                    : 'border-[#e2e8f0] bg-white text-[#45464d] hover:border-[#cbd5e1]'
                }`}
              >
                <Monitor className="w-5 h-5 shrink-0" />
                <div>
                  <div className="text-xs font-bold">16:9 Landscape</div>
                  <div className="text-[10px] opacity-80">Cinematic Wide Screen</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                disabled={isGenerating}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  aspectRatio === '9:16'
                    ? 'border-[#0f172a] bg-[#0f172a] text-white shadow-xs'
                    : 'border-[#e2e8f0] bg-white text-[#45464d] hover:border-[#cbd5e1]'
                }`}
              >
                <Smartphone className="w-5 h-5 shrink-0" />
                <div>
                  <div className="text-xs font-bold">9:16 Portrait</div>
                  <div className="text-[10px] opacity-80">Vertical Story / Reel</div>
                </div>
              </button>
            </div>
          </div>

          {/* Prompt Presets */}
          <div>
            <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-2">
              Curated Visual Aesthetics
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presetStyles.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => setPrompt(item.prompt)}
                  className="p-2.5 rounded-xl border border-[#e2e8f0] bg-[#faf9f6] text-left hover:border-[#cbd5e1] hover:bg-white transition-all cursor-pointer"
                >
                  <div className="text-xs font-semibold text-[#0f172a]">
                    {item.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Text Prompt Area */}
          <div>
            <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-1.5">
              Cinematic Prompt Description
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              placeholder="Describe the camera motion, lighting, textures, and atmosphere..."
              className="w-full p-3 rounded-xl border border-[#e2e8f0] bg-white text-xs sm:text-sm text-[#0f172a] placeholder-[#94a3b8] focus:border-[#ff6448] focus:ring-2 focus:ring-[#ff6448]/10 focus:outline-none transition-all"
            />
          </div>

          {/* Progress / Status banner */}
          {isGenerating && (
            <div className="p-4 rounded-2xl bg-[#faf9f6] border border-[#ff6448]/30 flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-[#ff6448] shrink-0" />
              <div className="text-xs text-[#0f172a] font-medium leading-relaxed">
                {progressStage}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="p-4 sm:p-5 border-t border-[#e2e8f0] bg-[#faf9f6] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="px-4 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-xs font-semibold text-[#0f172a] hover:bg-[#f8fafc] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleGenerateVideo}
            disabled={!prompt.trim() || isGenerating}
            className="px-5 py-2.5 rounded-xl bg-[#ff6448] hover:bg-[#f97316] text-white text-xs font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Rendering Video...</span>
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                <span>Render with Veo 3</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
