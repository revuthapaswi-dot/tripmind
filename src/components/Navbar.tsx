import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  BookOpen, 
  Share2, 
  Layers, 
  MapPin, 
  ChevronDown, 
  Check,
  Radio,
  Film,
  MessageSquare,
  Globe
} from 'lucide-react';
import { Trip } from '../types';

interface NavbarProps {
  currentTrip: Trip;
  allTrips: Trip[];
  onSelectTrip: (trip: Trip) => void;
  onOpenNewTripModal: () => void;
  onOpenLogisticsModal: () => void;
  onOpenExportModal: () => void;
  onOpenVoiceGuide: () => void;
  onOpenVeoVideo: () => void;
  onOpenChatbot: () => void;
  onOpenSearchGrounding: () => void;
  activeView: 'split' | 'planner' | 'map';
  setActiveView: (view: 'split' | 'planner' | 'map') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTrip,
  allTrips,
  onSelectTrip,
  onOpenNewTripModal,
  onOpenLogisticsModal,
  onOpenExportModal,
  onOpenVoiceGuide,
  onOpenVeoVideo,
  onOpenChatbot,
  onOpenSearchGrounding,
  activeView,
  setActiveView,
}) => {
  const [showTripDropdown, setShowTripDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e2e8f0] bg-[#faf9f6]/90 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0f172a] text-white flex items-center justify-center font-bold font-editorial shadow-xs">
              <span className="text-sm tracking-tight text-white">TM</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial font-bold text-lg tracking-tight text-[#0f172a]">
                  TripMind
                </span>
                <span className="text-[10px] font-semibold tracking-widest uppercase px-1.5 py-0.5 rounded bg-[#0d9488]/10 text-[#0d9488]">
                  Editorial AI
                </span>
              </div>
              <p className="text-[11px] text-[#64748b] hidden sm:block">
                Bespoke Travel Intelligence & Computational Itineraries
              </p>
            </div>
          </div>

          <div className="h-6 w-px bg-[#e2e8f0] hidden md:block" />

          {/* Active Trip Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowTripDropdown(!showTripDropdown)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-[#e2e8f0] bg-white text-left hover:border-[#cbd5e1] hover:bg-[#f8fafc] transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-[#0d9488]" />
              <div className="max-w-[180px] sm:max-w-[260px] truncate">
                <span className="block text-xs font-semibold text-[#0f172a] truncate">
                  {currentTrip.title}
                </span>
                <span className="block text-[10px] text-[#64748b] truncate">
                  {currentTrip.destination} · {currentTrip.recommendedDuration}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748b] ml-1 shrink-0" />
            </button>

            {/* Dropdown Menu */}
            {showTripDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowTripDropdown(false)}
                />
                <div className="absolute left-0 mt-2 w-80 rounded-2xl border border-[#e2e8f0] bg-white shadow-xl py-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">
                    Curated Destinations
                  </div>
                  {allTrips.map((trip) => {
                    const isSelected = trip.id === currentTrip.id;
                    return (
                      <button
                        key={trip.id}
                        onClick={() => {
                          onSelectTrip(trip);
                          setShowTripDropdown(false);
                        }}
                        className={`w-full px-3 py-2.5 text-left flex items-start gap-3 transition-colors ${
                          isSelected ? 'bg-[#f4f3f1]' : 'hover:bg-[#faf9f6]'
                        }`}
                      >
                        <img
                          src={trip.heroImage}
                          alt={trip.destination}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#0f172a] truncate">
                              {trip.destination}
                            </span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-[#0d9488] shrink-0" />
                            )}
                          </div>
                          <span className="text-[11px] text-[#64748b] line-clamp-1">
                            {trip.subtitle}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                  <div className="border-t border-[#f1f5f9] mt-2 pt-2 px-2">
                    <button
                      onClick={() => {
                        setShowTripDropdown(false);
                        onOpenNewTripModal();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-[#ff6448] bg-[#ff6448]/10 hover:bg-[#ff6448]/15 rounded-xl transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Synthesize New Custom Trip
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Controls & Responsive View Switchers */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile view switchers */}
          <div className="flex xl:hidden bg-[#f4f3f1] p-0.5 rounded-xl border border-[#e2e8f0]">
            <button
              onClick={() => setActiveView('planner')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                activeView === 'planner'
                  ? 'bg-white text-[#0f172a] shadow-xs'
                  : 'text-[#64748b]'
              }`}
            >
              Planner
            </button>
            <button
              onClick={() => setActiveView('map')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                activeView === 'map'
                  ? 'bg-white text-[#0f172a] shadow-xs'
                  : 'text-[#64748b]'
              }`}
            >
              Map
            </button>
          </div>

          {/* Gemini Chatbot CTA (Multi-Turn Chat with Pro/Flash/Flash-Lite) */}
          <button
            onClick={onOpenChatbot}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#0f172a]/20 bg-white text-xs font-semibold text-[#0f172a] hover:bg-[#f8fafc] transition-all cursor-pointer shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#0d9488]" />
            <span className="hidden sm:inline">Gemini Chat</span>
          </button>

          {/* Google Search Live Grounding CTA */}
          <button
            onClick={onOpenSearchGrounding}
            className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-blue-200 bg-blue-50/70 text-xs font-semibold text-blue-700 hover:bg-blue-100/70 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Search Grounding</span>
          </button>

          {/* Live Voice Guide CTA (Gemini 3.8 Live) */}
          <button
            onClick={onOpenVoiceGuide}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#0d9488]/30 bg-[#0d9488]/10 text-xs font-semibold text-[#0d9488] hover:bg-[#0d9488]/15 transition-all cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#0d9488]" />
            <span className="hidden sm:inline">Voice Guide</span>
          </button>

          {/* Veo 3 Video Teaser CTA (veo-3.1-fast-generate-preview) */}
          <button
            onClick={onOpenVeoVideo}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#ff6448]/30 bg-[#ff6448]/10 text-xs font-semibold text-[#ff6448] hover:bg-[#ff6448]/15 transition-all cursor-pointer"
          >
            <Film className="w-3.5 h-3.5 text-[#ff6448]" />
            <span>Veo 3 Cinema</span>
          </button>

          {/* Logistics & Budget button */}
          <button
            onClick={onOpenLogisticsModal}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#e2e8f0] bg-white text-xs font-medium text-[#0f172a] hover:bg-[#f8fafc] transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#0d9488]" />
            <span>Logistics & Budget</span>
          </button>

          {/* Export & Share button */}
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#e2e8f0] bg-white text-xs font-medium text-[#0f172a] hover:bg-[#f8fafc] transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-[#64748b]" />
            <span className="hidden md:inline">Export & Share</span>
          </button>

          {/* AI Generator CTA button (Coral Accent) */}
          <button
            onClick={onOpenNewTripModal}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-[#ff6448] text-white text-xs font-semibold shadow-xs hover:bg-[#f97316] transition-all hover:shadow-md cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
            <span className="hidden sm:inline">Synthesize Trip</span>
            <span className="sm:hidden">New Trip</span>
          </button>
        </div>
      </div>
    </header>
  );
};
