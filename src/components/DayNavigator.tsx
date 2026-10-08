import React from 'react';
import { Sun, Cloud, CloudRain, Wind, Footprints, Clock, Sparkles } from 'lucide-react';
import { ItineraryDay } from '../types';

interface DayNavigatorProps {
  days: ItineraryDay[];
  activeDayNumber: number;
  onSelectDay: (dayNumber: number) => void;
}

export const DayNavigator: React.FC<DayNavigatorProps> = ({
  days,
  activeDayNumber,
  onSelectDay,
}) => {
  const activeDay = days.find((d) => d.dayNumber === activeDayNumber) || days[0];

  const getWeatherIcon = (iconType: string) => {
    switch (iconType) {
      case 'sunny':
        return <Sun className="w-3.5 h-3.5 text-amber-500" />;
      case 'rain':
        return <CloudRain className="w-3.5 h-3.5 text-blue-500" />;
      case 'cloudy':
        return <Cloud className="w-3.5 h-3.5 text-slate-400" />;
      default:
        return <Wind className="w-3.5 h-3.5 text-teal-600" />;
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Day Selector Segmented Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-[#efeeeb] rounded-2xl overflow-x-auto scrollbar-none">
        {days.map((day) => {
          const isActive = day.dayNumber === activeDayNumber;
          return (
            <button
              key={day.dayNumber}
              onClick={() => onSelectDay(day.dayNumber)}
              className={`flex-1 min-w-[90px] sm:min-w-[120px] py-2 px-3 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-white text-[#0f172a] shadow-xs ring-1 ring-[#e2e8f0]'
                  : 'text-[#64748b] hover:text-[#0f172a] hover:bg-white/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-wide uppercase">
                  Day {day.dayNumber}
                </span>
                <span className="text-[10px] text-[#94a3b8] tabular-nums">
                  {day.stops.length} stops
                </span>
              </div>
              <div className="text-xs font-semibold truncate mt-0.5">
                {day.title.split('&')[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Day Meta Briefing Banner */}
      {activeDay && (
        <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#64748b]">
                <span className="font-semibold text-[#0d9488]">Day {activeDay.dayNumber}</span>
                <span aria-hidden="true">·</span>
                <span>{activeDay.date}</span>
              </div>
              <h2 className="font-editorial text-lg sm:text-xl font-bold text-[#0f172a] mt-0.5">
                {activeDay.title}
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                {activeDay.subtitle}
              </p>
            </div>

            {/* Weather & Logistics Metrics */}
            <div className="flex items-center gap-3 self-start sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f1f5f9] w-full sm:w-auto">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#faf9f6] border border-[#e2e8f0] text-xs">
                {getWeatherIcon(activeDay.weather.icon)}
                <span className="font-medium text-[#1a1c1a] tabular-nums">
                  {activeDay.weather.temp}
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#faf9f6] border border-[#e2e8f0] text-xs">
                <Footprints className="w-3.5 h-3.5 text-[#0d9488]" />
                <span className="font-medium text-[#1a1c1a] tabular-nums">
                  {activeDay.walkingDistanceKm} km walk
                </span>
              </div>

              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#faf9f6] border border-[#e2e8f0] text-xs">
                <Clock className="w-3.5 h-3.5 text-[#64748b]" />
                <span className="font-medium text-[#1a1c1a] tabular-nums">
                  {activeDay.estimatedTransitTime}
                </span>
              </div>
            </div>
          </div>

          {/* Highlights unboxed metadata list */}
          {activeDay.highlights && activeDay.highlights.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#f1f5f9] flex items-center gap-2 overflow-x-auto text-xs text-[#64748b]">
              <span className="text-[11px] font-semibold text-[#0f172a] shrink-0">
                Key chapters:
              </span>
              {activeDay.highlights.map((h, i) => (
                <React.Fragment key={i}>
                  <span className="truncate shrink-0">{h}</span>
                  {i < activeDay.highlights.length - 1 && (
                    <span aria-hidden="true" className="text-[#cbd5e1]">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
