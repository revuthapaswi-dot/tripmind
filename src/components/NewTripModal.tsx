import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Loader2, 
  MapPin, 
  Calendar, 
  Compass, 
  Sliders, 
  Coins,
  ArrowRight
} from 'lucide-react';
import { Trip } from '../types';

interface NewTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripGenerated: (trip: Trip) => void;
}

export const NewTripModal: React.FC<NewTripModalProps> = ({
  isOpen,
  onClose,
  onTripGenerated,
}) => {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [vibe, setVibe] = useState('Architectural Heritage & Slow Travel');
  const [pace, setPace] = useState('Balanced');
  const [budget, setBudget] = useState('Curated Boutique');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const popularDestinations = [
    'Paris',
    'Oaxaca',
    'Swiss Alps',
    'Tokyo',
    'Lisbon',
    'Marrakech',
    'Edinburgh'
  ];

  const vibeOptions = [
    'Architectural Heritage & Slow Travel',
    'Hidden Epicurean & Natural Wine',
    'Zen Sanctuaries & Wabi-Sabi',
    'Nordic Volcanic Solitude',
    'Coastal Living & Terraced Groves',
    'Contemporary Craft & Independent Ateliers'
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || isGenerating) return;

    setIsGenerating(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: destination.trim(),
          days,
          vibe,
          pace,
          budget
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate trip');
      }

      const generatedTrip: Trip = await response.json();
      onTripGenerated(generatedTrip);
      onClose();
    } catch (err: any) {
      console.warn('Trip generation notice:', err?.message);
      setErrorMsg('Could not synthesize trip at this moment. Please retry.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl max-h-[90vh] bg-white rounded-3xl overflow-hidden border border-[#e2e8f0] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Sunset Coral Accents */}
        <div className="p-5 sm:p-6 border-b border-[#e2e8f0] flex items-center justify-between bg-[#faf9f6]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ff6448] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-[#ff6448]">
                Computational Synthesis
              </span>
              <h2 className="font-editorial text-lg sm:text-xl font-bold text-[#0f172a] mt-0.5">
                Synthesize New Itinerary
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-2 rounded-full hover:bg-[#e2e8f0] text-[#64748b] hover:text-[#0f172a] transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleGenerate} className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-5">
          {/* Destination Input */}
          <div>
            <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-1.5">
              Target Destination / Region
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-[#94a3b8]" />
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Paris, Oaxaca, Swiss Alps, Kyoto..."
                disabled={isGenerating}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-sm text-[#0f172a] placeholder-[#94a3b8] focus:border-[#0f172a] focus:ring-2 focus:ring-[#0f172a]/10 focus:outline-none transition-all"
              />
            </div>

            {/* Destination Inspiration Chips */}
            <div className="flex items-center flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] text-[#94a3b8] mr-1">Inspirations:</span>
              {popularDestinations.map((city) => (
                <button
                  key={city}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => setDestination(city)}
                  className="px-2.5 py-1 rounded-full border border-[#e2e8f0] bg-[#faf9f6] text-[11px] font-medium text-[#45464d] hover:border-[#cbd5e1] hover:text-[#0f172a] hover:bg-white transition-colors cursor-pointer"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                Trip Duration
              </label>
              <span className="text-xs font-semibold text-[#0d9488] tabular-nums">
                {days} {days === 1 ? 'Day' : 'Days'}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={7}
              step={1}
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value, 10))}
              disabled={isGenerating}
              className="w-full accent-[#0d9488] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#94a3b8] mt-1">
              <span>1 Day (Micro-Escape)</span>
              <span>4 Days</span>
              <span>7 Days (Immersive)</span>
            </div>
          </div>

          {/* Vibe / Atmosphere Selector */}
          <div>
            <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-1.5">
              Curatorial Vibe
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {vibeOptions.map((v) => (
                <button
                  key={v}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => setVibe(v)}
                  className={`p-2.5 text-left rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    vibe === v
                      ? 'border-[#0f172a] bg-[#0f172a] text-white shadow-xs'
                      : 'border-[#e2e8f0] bg-white text-[#45464d] hover:border-[#cbd5e1]'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Pace & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-1.5">
                Travel Pacing
              </label>
              <select
                value={pace}
                onChange={(e) => setPace(e.target.value)}
                disabled={isGenerating}
                className="w-full px-3 py-2 rounded-xl border border-[#e2e8f0] bg-white text-xs text-[#0f172a] focus:outline-none focus:border-[#0f172a]"
              >
                <option value="Leisurely Slow">Leisurely Slow (2-3 stops/day)</option>
                <option value="Balanced">Balanced (3-4 stops/day)</option>
                <option value="Comprehensive">Comprehensive (4-5 stops/day)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-1.5">
                Financial Tier
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                disabled={isGenerating}
                className="w-full px-3 py-2 rounded-xl border border-[#e2e8f0] bg-white text-xs text-[#0f172a] focus:outline-none focus:border-[#0f172a]"
              >
                <option value="Curated Boutique">Curated Boutique</option>
                <option value="Ultra-Curated Luxury">Ultra-Curated Luxury</option>
                <option value="Artisanal & Independent">Artisanal & Independent</option>
              </select>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
              {errorMsg}
            </div>
          )}

          {/* Footer Submit Button */}
          <div className="pt-3 border-t border-[#f1f5f9]">
            <button
              type="submit"
              disabled={!destination.trim() || isGenerating}
              className="w-full py-3.5 rounded-2xl bg-[#ff6448] hover:bg-[#f97316] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing Monograph & Route Coordinates...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Editorial Itinerary</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
