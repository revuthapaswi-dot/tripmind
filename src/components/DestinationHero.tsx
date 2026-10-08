import React from 'react';
import { Sparkles, Calendar, Clock, Compass, Layers, Globe } from 'lucide-react';
import { Trip } from '../types';

interface DestinationHeroProps {
  trip: Trip;
  onOpenSearchGrounding?: () => void;
}

export const DestinationHero: React.FC<DestinationHeroProps> = ({ 
  trip,
  onOpenSearchGrounding,
}) => {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-[#e2e8f0] bg-white shadow-xs">
      {/* Cover Imagery with Linear Dark Scrim */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#f4f3f1]">
        <img
          src={trip.heroImage}
          alt={trip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

        {/* Floating Top-Right Metadata Chips */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {onOpenSearchGrounding && (
            <button
              onClick={onOpenSearchGrounding}
              className="px-3 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide flex items-center gap-1.5 hover:bg-blue-700 transition-colors cursor-pointer shadow-xs"
            >
              <Globe className="w-3 h-3" />
              <span>Live Search Grounding</span>
            </button>
          )}
          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#0f172a] text-[11px] font-semibold tracking-wide">
            {trip.season}
          </span>
          <span className="px-3 py-1 rounded-full bg-[#0d9488]/90 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide">
            {trip.recommendedDuration}
          </span>
        </div>

        {/* Hero Title & Scrim Text Overlay */}
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <div className="flex items-center gap-2 text-xs text-white/80 uppercase tracking-widest font-semibold">
            <span>{trip.country}</span>
            <span aria-hidden="true">·</span>
            <span>{trip.destination}</span>
          </div>

          <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mt-1">
            {trip.title}
          </h1>

          <p className="text-xs sm:text-sm text-white/90 max-w-2xl mt-1.5 leading-relaxed line-clamp-2">
            {trip.subtitle}
          </p>
        </div>
      </div>

      {/* Editorial Preamble & Curator Colophon */}
      <div className="p-5 sm:p-6 bg-white">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          {/* Preamble Narrative */}
          <div className="flex-1">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-[#94a3b8] block">
              Editorial Preamble
            </span>
            <p className="mt-1.5 text-xs sm:text-sm text-[#45464d] leading-relaxed">
              {trip.editorialPreamble}
            </p>

            {/* Unboxed Vibe Tags with dot separators */}
            <div className="mt-3 flex items-center flex-wrap gap-2 text-xs text-[#64748b]">
              <span className="font-semibold text-[#0f172a]">Aesthetic pillars:</span>
              {trip.vibeTags.map((tag, i) => (
                <React.Fragment key={i}>
                  <span className="text-[#45464d]">{tag}</span>
                  {i < trip.vibeTags.length - 1 && (
                    <span aria-hidden="true" className="text-[#cbd5e1]">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Curator Colophon Signature Block */}
          <div className="shrink-0 p-3.5 rounded-2xl bg-[#faf9f6] border border-[#e2e8f0] flex items-center gap-3 w-full md:w-auto">
            <img
              src={trip.curator.avatar}
              alt={trip.curator.name}
              className="w-10 h-10 rounded-full object-cover border border-[#e2e8f0] shrink-0"
            />
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-[#94a3b8] font-semibold">
                Curated By
              </span>
              <span className="block text-xs font-bold text-[#0f172a]">
                {trip.curator.name}
              </span>
              <span className="block text-[11px] text-[#64748b]">
                {trip.curator.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
