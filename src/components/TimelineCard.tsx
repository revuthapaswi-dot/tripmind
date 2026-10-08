import React from 'react';
import { 
  Clock, 
  MapPin, 
  ExternalLink, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Compass, 
  Footprints, 
  Train, 
  Bus, 
  Car, 
  Ship,
  Star,
  Bookmark
} from 'lucide-react';
import { ItineraryStop, TransitInfo } from '../types';

interface TimelineCardProps {
  stop: ItineraryStop;
  index: number;
  totalStops: number;
  isSelected: boolean;
  onSelect: () => void;
  onOpenDetails: () => void;
  onToggleVisited: (stopId: string) => void;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({
  stop,
  index,
  totalStops,
  isSelected,
  onSelect,
  onOpenDetails,
  onToggleVisited,
}) => {
  const isLast = index === totalStops - 1;

  const renderTransitIcon = (mode: TransitInfo['mode']) => {
    switch (mode) {
      case 'walk':
        return <Footprints className="w-3.5 h-3.5 text-[#0d9488]" />;
      case 'train':
      case 'metro':
        return <Train className="w-3.5 h-3.5 text-[#0d9488]" />;
      case 'bus':
        return <Bus className="w-3.5 h-3.5 text-[#0d9488]" />;
      case 'ferry':
        return <Ship className="w-3.5 h-3.5 text-[#0d9488]" />;
      case 'drive':
        return <Car className="w-3.5 h-3.5 text-[#0d9488]" />;
      default:
        return <Footprints className="w-3.5 h-3.5 text-[#0d9488]" />;
    }
  };

  return (
    <div className="relative flex group">
      {/* Dedicated Left Rail with Time Anchors & Status Connector */}
      <div className="w-16 sm:w-20 shrink-0 flex flex-col items-center pt-1 pr-3 sm:pr-4 select-none">
        {/* Time Anchor in Tabular Figures */}
        <span className="text-xs font-semibold tabular-nums text-[#0f172a] tracking-tight">
          {stop.time}
        </span>
        <span className="text-[10px] text-[#94a3b8] tabular-nums mt-0.5">
          {stop.duration}
        </span>

        {/* Emerald Status Dot (#0D9488) */}
        <div className="relative mt-2.5 flex items-center justify-center">
          <div
            className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
              stop.isVisited
                ? 'bg-[#0d9488] border-[#0d9488]'
                : isSelected
                ? 'bg-[#0d9488] border-[#0d9488] ring-4 ring-[#0d9488]/20'
                : 'bg-white border-[#0d9488] group-hover:scale-110'
            }`}
          >
            {stop.isVisited ? (
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-[#0d9488]" />
            )}
          </div>
        </div>

        {/* Continuous 1.5px Hairline Stroke (#E2E8F0) */}
        {!isLast && (
          <div className="w-[1.5px] flex-1 bg-[#e2e8f0] my-2 transition-colors group-hover:bg-[#cbd5e1]" />
        )}
      </div>

      {/* Main Content Card Container */}
      <div className="flex-1 pb-8 min-w-0">
        <div
          onClick={onSelect}
          className={`rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
            isSelected
              ? 'bg-white border-[#0f172a] shadow-lg ring-1 ring-[#0f172a]/10'
              : 'bg-white border-[#e2e8f0] shadow-xs hover:border-[#cbd5e1] hover:shadow-md'
          }`}
        >
          {/* 16:10 Curated Photography with 10px inner radius math */}
          <div className="p-3 sm:p-4 pb-0">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#f4f3f1]">
              <img
                src={stop.image}
                alt={stop.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Overlay Top Badges */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-white/90 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full tracking-wide uppercase">
                  {stop.category}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisited(stop.id);
                  }}
                  title={stop.isVisited ? 'Mark unvisited' : 'Mark visited'}
                  className={`p-1.5 rounded-full backdrop-blur-md transition-colors ${
                    stop.isVisited
                      ? 'bg-[#0d9488] text-white'
                      : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Overlay Bottom Neighborhood Kicker */}
              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                <div className="flex items-center gap-1.5 text-xs text-white/90">
                  <MapPin className="w-3 h-3 text-[#ff6448]" />
                  <span className="font-medium truncate">{stop.neighborhood}</span>
                  {stop.rating && (
                    <>
                      <span aria-hidden="true" className="text-white/40">·</span>
                      <span className="flex items-center gap-0.5 text-amber-300 tabular-nums">
                        <Star className="w-3 h-3 fill-amber-300" />
                        {stop.rating}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 pt-3 sm:px-5 sm:pb-5">
            {/* Title & Native Title */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-editorial text-base sm:text-lg font-bold text-[#0f172a] tracking-tight group-hover:text-[#0d9488] transition-colors">
                  {stop.title}
                </h3>
                {(stop.japaneseTitle || stop.italianTitle) && (
                  <p className="text-xs text-[#94a3b8] mt-0.5 font-light">
                    {stop.japaneseTitle || stop.italianTitle}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-[#0f172a] tabular-nums block">
                  {stop.cost}
                </span>
                <span className="text-[10px] text-[#64748b] block mt-0.5 font-medium">
                  {stop.bookingStatus}
                </span>
              </div>
            </div>

            {/* Zero-Pill Unboxed Metadata Bar */}
            <div className="mt-2.5 flex items-center flex-wrap gap-2 text-xs text-[#64748b]">
              <span>{stop.address.split(',')[0]}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{stop.duration} duration</span>
              {stop.bestTimeOfDay && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Best: {stop.bestTimeOfDay}</span>
                </>
              )}
            </div>

            {/* Editorial Prose Notes */}
            <p className="mt-2.5 text-xs sm:text-sm text-[#45464d] leading-relaxed line-clamp-3">
              {stop.editorialNotes}
            </p>

            {/* Curator Quote if exists */}
            {stop.curatorQuote && (
              <div className="mt-3 pl-3 border-l-2 border-[#0d9488] text-xs italic text-[#64748b]">
                "{stop.curatorQuote}"
              </div>
            )}

            {/* Insider Tip Box */}
            {stop.insiderTip && (
              <div className="mt-3 p-3 rounded-xl bg-[#faf9f6] border border-[#e2e8f0]/80">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff6448] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#1a1c1a] leading-relaxed">
                    <span className="font-semibold text-[#0f172a] mr-1">Insider note:</span>
                    {stop.insiderTip}
                  </div>
                </div>
              </div>
            )}

            {/* Card Action Controls */}
            <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetails();
                }}
                className="text-xs font-semibold text-[#0f172a] hover:text-[#0d9488] flex items-center gap-1 transition-colors cursor-pointer py-1"
              >
                <span>Read Full Monograph</span>
                <ExternalLink className="w-3 h-3 text-[#64748b]" />
              </button>

              <div className="flex items-center gap-1.5">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${stop.title} ${stop.address}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-2.5 py-1 text-[11px] font-medium text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc] rounded-lg transition-colors inline-flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-[#ff6448]" />
                  <span>Map Directions</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Transit Connector between Timeline Cards */}
        {stop.transitToNext && (
          <div className="mt-3.5 mb-1 px-3 py-2 rounded-xl bg-[#faf9f6] border border-[#e2e8f0] flex items-center gap-2.5 text-xs text-[#64748b]">
            <div className="p-1 rounded-md bg-white border border-[#e2e8f0] shrink-0">
              {renderTransitIcon(stop.transitToNext.mode)}
            </div>
            <div className="flex-1 truncate">
              <span className="font-medium text-[#0f172a] mr-1">
                {stop.transitToNext.durationMinutes} min transit:
              </span>
              <span>{stop.transitToNext.description}</span>
            </div>
            {stop.transitToNext.distanceKm && (
              <span className="text-[11px] text-[#94a3b8] tabular-nums shrink-0">
                {stop.transitToNext.distanceKm} km
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
