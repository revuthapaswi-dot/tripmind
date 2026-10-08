import React, { useState } from 'react';
import { 
  Compass, 
  Footprints, 
  Calendar, 
  Sparkles, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Layers, 
  Bookmark,
  Award
} from 'lucide-react';
import { Trip } from '../types';

interface ExecutiveSummaryProps {
  trip: Trip;
  onSelectHighlight?: (stopTitle: string) => void;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  trip,
  onSelectHighlight,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Aggregate metrics across all days
  const totalDays = trip.days.length;
  const totalWalkingDistance = trip.days.reduce(
    (acc, day) => acc + (day.walkingDistanceKm || 0),
    0
  );
  const avgDailyWalk = totalDays > 0 ? (totalWalkingDistance / totalDays).toFixed(1) : '0';
  const totalStopsCount = trip.days.reduce(
    (acc, day) => acc + (day.stops?.length || 0),
    0
  );

  // Collect all day highlights
  const allHighlights = trip.days.flatMap((day) => 
    day.highlights ? day.highlights.map(h => ({ highlight: h, dayNumber: day.dayNumber })) : []
  );

  // Prominent signature highlights to show initially (first 4 or all if expanded)
  const displayedHighlights = isExpanded ? allHighlights : allHighlights.slice(0, 4);

  return (
    <div className="w-full rounded-2xl border border-[#e2e8f0] bg-white p-4 sm:p-5 shadow-xs transition-all hover:border-[#cbd5e1]">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#f1f5f9]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0f172a] text-white flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4 text-[#86f2e4]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-editorial text-sm sm:text-base font-bold text-[#0f172a]">
                Executive Itinerary Summary
              </h3>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#0d9488]/10 text-[#0d9488]">
                Curated Dossier
              </span>
            </div>
            <p className="text-[11px] text-[#64748b]">
              High-level navigational scope, physical pacing, and signature monuments
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-[#0f172a] tabular-nums hidden sm:block">
          {trip.season}
        </span>
      </div>

      {/* High-Level Analytical KPI Metrics */}
      <div className="pt-4 grid grid-cols-3 gap-2.5 sm:gap-3">
        {/* Metric 1: Duration */}
        <div className="p-3 rounded-xl bg-[#faf9f6] border border-[#e2e8f0]">
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
            <Calendar className="w-3.5 h-3.5 text-[#0d9488]" />
            <span>Duration</span>
          </div>
          <span className="block text-base sm:text-lg font-bold font-editorial text-[#0f172a] tabular-nums mt-1">
            {totalDays} {totalDays === 1 ? 'Day' : 'Days'}
          </span>
          <span className="block text-[10px] text-[#94a3b8] truncate mt-0.5">
            {trip.recommendedDuration}
          </span>
        </div>

        {/* Metric 2: Distance Covered */}
        <div className="p-3 rounded-xl bg-[#faf9f6] border border-[#e2e8f0]">
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
            <Footprints className="w-3.5 h-3.5 text-[#0d9488]" />
            <span>Total Walking</span>
          </div>
          <span className="block text-base sm:text-lg font-bold font-editorial text-[#0f172a] tabular-nums mt-1">
            {totalWalkingDistance.toFixed(1)} km
          </span>
          <span className="block text-[10px] text-[#94a3b8] tabular-nums truncate mt-0.5">
            ~{avgDailyWalk} km / day avg
          </span>
        </div>

        {/* Metric 3: Chapters / Stops */}
        <div className="p-3 rounded-xl bg-[#faf9f6] border border-[#e2e8f0]">
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
            <Layers className="w-3.5 h-3.5 text-[#0d9488]" />
            <span>Curated Stops</span>
          </div>
          <span className="block text-base sm:text-lg font-bold font-editorial text-[#0f172a] tabular-nums mt-1">
            {totalStopsCount} Stops
          </span>
          <span className="block text-[10px] text-[#94a3b8] truncate mt-0.5">
            Across {totalDays} chapters
          </span>
        </div>
      </div>

      {/* Major Highlights Section */}
      <div className="mt-4 pt-3.5 border-t border-[#f1f5f9]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0f172a] uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-[#ff6448]" />
            <span>Signature Highlights & Key Encounters</span>
          </div>

          {allHighlights.length > 4 && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[11px] font-semibold text-[#0d9488] hover:text-[#005049] transition-colors cursor-pointer"
            >
              {isExpanded ? 'Show Less' : `View All (${allHighlights.length})`}
            </button>
          )}
        </div>

        {/* Highlights List (Zero-Pill Editorial Typography) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          {displayedHighlights.map((item, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl border border-[#e2e8f0] bg-[#faf9f6] hover:bg-white hover:border-[#cbd5e1] transition-all flex items-start gap-2.5 group"
            >
              <div className="w-5 h-5 rounded-md bg-[#0f172a] text-white flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                D{item.dayNumber}
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-semibold text-[#0f172a] group-hover:text-[#0d9488] transition-colors leading-snug truncate">
                  {item.highlight}
                </span>
                <span className="block text-[10px] text-[#64748b] mt-0.5">
                  Day {item.dayNumber} Signature Feature
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pacing & Spatial Trajectory Colophon */}
      <div className="mt-3.5 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[11px] text-[#64748b]">
        <div className="flex items-center gap-1.5 truncate">
          <Clock className="w-3.5 h-3.5 text-[#0d9488] shrink-0" />
          <span className="truncate">
            Pacing Index: Leisurely Slow (2–4 chapters/day with private midday rest)
          </span>
        </div>
        <span className="font-semibold text-[#0f172a] shrink-0 ml-2">
          {trip.destination}
        </span>
      </div>
    </div>
  );
};
