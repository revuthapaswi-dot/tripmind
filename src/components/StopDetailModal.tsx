import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  CheckCircle2, 
  Calendar,
  Share2,
  Bookmark
} from 'lucide-react';
import { ItineraryStop } from '../types';
import { MapsGroundingPanel } from './MapsGroundingPanel';

interface StopDetailModalProps {
  stop: ItineraryStop | null;
  onClose: () => void;
  onToggleVisited: (stopId: string) => void;
}

export const StopDetailModal: React.FC<StopDetailModalProps> = ({
  stop,
  onClose,
  onToggleVisited,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingAudio) {
      timer = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 5;
        });
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isPlayingAudio]);

  if (!stop) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl overflow-hidden border border-[#e2e8f0] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Hero Photography */}
          <div className="relative aspect-[16/9] w-full bg-[#f4f3f1]">
            <img
              src={stop.image}
              alt={stop.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#0d9488] bg-white/90 px-2.5 py-1 rounded-full">
                {stop.category}
              </span>
              <h2 className="font-editorial text-xl sm:text-2xl font-bold mt-2 text-white">
                {stop.title}
              </h2>
              {(stop.japaneseTitle || stop.italianTitle) && (
                <p className="text-xs text-white/80 mt-0.5">
                  {stop.japaneseTitle || stop.italianTitle}
                </p>
              )}
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-7 space-y-6">
            {/* Audio Curator Commentary Simulation */}
            <div className="p-4 rounded-2xl bg-[#faf9f6] border border-[#e2e8f0] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-10 h-10 rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white flex items-center justify-center shrink-0 shadow-xs transition-colors cursor-pointer"
                >
                  {isPlayingAudio ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <div>
                  <div className="text-xs font-semibold text-[#0f172a]">
                    Curator Audio Monograph
                  </div>
                  <div className="text-[11px] text-[#64748b]">
                    {isPlayingAudio ? `Playing commentary (${audioProgress}%)` : 'Narrated architectural context · 1 min 45 sec'}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {isPlayingAudio && (
                <div className="w-24 sm:w-32 h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0d9488] transition-all duration-300"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Editorial Essay */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                Editorial Essay & Context
              </h3>
              <p className="mt-2 text-sm sm:text-base text-[#1a1c1a] leading-relaxed">
                {stop.editorialNotes}
              </p>
            </div>

            {/* Curator Quote */}
            {stop.curatorQuote && (
              <blockquote className="p-4 rounded-2xl bg-[#f4f3f1] border-l-4 border-[#0f172a] text-xs sm:text-sm italic text-[#45464d] leading-relaxed">
                "{stop.curatorQuote}"
              </blockquote>
            )}

            {/* Insider Tip Box */}
            {stop.insiderTip && (
              <div className="p-4 rounded-2xl bg-[#faf9f6] border border-[#e2e8f0]">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-[#ff6448] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-[#0f172a]">
                      Editor’s Private Recommendation
                    </h4>
                    <p className="text-xs sm:text-sm text-[#45464d] mt-1 leading-relaxed">
                      {stop.insiderTip}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Practical Operations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border border-[#e2e8f0] bg-white">
                <div className="flex items-center gap-2 text-xs text-[#64748b]">
                  <Clock className="w-3.5 h-3.5 text-[#0d9488]" />
                  <span className="font-semibold text-[#0f172a]">Timing & Duration</span>
                </div>
                <div className="text-xs text-[#1a1c1a] mt-1 tabular-nums">
                  Arrive {stop.time} ({stop.duration})
                </div>
                {stop.bestTimeOfDay && (
                  <div className="text-[11px] text-[#64748b] mt-0.5">
                    Recommended: {stop.bestTimeOfDay}
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl border border-[#e2e8f0] bg-white">
                <div className="flex items-center gap-2 text-xs text-[#64748b]">
                  <Compass className="w-3.5 h-3.5 text-[#0d9488]" />
                  <span className="font-semibold text-[#0f172a]">Admission & Booking</span>
                </div>
                <div className="text-xs text-[#1a1c1a] mt-1 tabular-nums font-semibold">
                  {stop.cost}
                </div>
                <div className="text-[11px] text-[#64748b] mt-0.5">
                  Status: {stop.bookingStatus}
                </div>
              </div>
            </div>

            {/* Google Maps Live Grounding (gemini-3.5-flash with googleMaps tool) */}
            <MapsGroundingPanel
              placeName={stop.title}
              destination={stop.address}
              initialAddress={stop.address}
            />

            {/* Etiquette & Cultural Customs */}
            {stop.etiquetteNotes && (
              <div className="p-3.5 rounded-xl border border-[#e2e8f0] bg-[#faf9f6]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0f172a]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0d9488]" />
                  <span>Cultural Etiquette & Dress Protocol</span>
                </div>
                <p className="text-xs text-[#45464d] mt-1 leading-relaxed">
                  {stop.etiquetteNotes}
                </p>
              </div>
            )}

            {/* Exact Address */}
            <div className="text-xs text-[#64748b]">
              <span className="font-semibold text-[#0f172a]">Location: </span>
              <span>{stop.address}</span>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 border-t border-[#e2e8f0] bg-[#faf9f6] flex items-center justify-between gap-3">
          <button
            onClick={() => onToggleVisited(stop.id)}
            className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              stop.isVisited
                ? 'bg-[#0d9488] text-white shadow-xs'
                : 'border border-[#e2e8f0] bg-white text-[#0f172a] hover:bg-[#f8fafc]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{stop.isVisited ? 'Marked Visited' : 'Mark as Visited'}</span>
          </button>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${stop.title} ${stop.address}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open in Maps</span>
          </a>
        </div>
      </div>
    </div>
  );
};
