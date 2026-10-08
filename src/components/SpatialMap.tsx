import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ExternalLink, 
  Clock, 
  Sparkles,
  Image as ImageIcon,
  Compass,
  Star,
  BookOpen
} from 'lucide-react';
import { Trip, ItineraryDay, ItineraryStop } from '../types';

interface SpatialMapProps {
  trip: Trip;
  activeDay: ItineraryDay;
  selectedStopId: string | null;
  onSelectStop: (stopId: string) => void;
  onOpenDetails: (stop: ItineraryStop) => void;
}

export const SpatialMap: React.FC<SpatialMapProps> = ({
  trip,
  activeDay,
  selectedStopId,
  onSelectStop,
  onOpenDetails,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeLayer, setActiveLayer] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'map' | 'lookbook'>('map');

  const selectedStop = 
    activeDay.stops.find((s) => s.id === selectedStopId) || activeDay.stops[0];

  const filteredStops = activeDay.stops.filter((stop) => {
    if (activeLayer === 'All') return true;
    if (activeLayer === 'Culture') return stop.category === 'Culture & Heritage' || stop.category === 'Craft & Architecture';
    if (activeLayer === 'Dining') return stop.category === 'Epicurean & Dining' || stop.category === 'Tea & Coffee Culture';
    if (activeLayer === 'Scenic') return stop.category === 'Nature & Scenic' || stop.category === 'Sanctuary & Stay';
    return true;
  });

  // Calculate SVG route path through the stops
  const generateRoutePath = () => {
    if (activeDay.stops.length < 2) return '';
    return activeDay.stops.reduce((acc, stop, i) => {
      const x = stop.coordinates.mapX;
      const y = stop.coordinates.mapY;
      if (i === 0) return `M ${x} ${y}`;
      // Smooth quadratic curve towards next stop
      const prevStop = activeDay.stops[i - 1];
      const midX = (prevStop.coordinates.mapX + x) / 2;
      const midY = (prevStop.coordinates.mapY + y) / 2;
      return `${acc} Q ${prevStop.coordinates.mapX} ${y}, ${x} ${y}`;
    }, '');
  };

  return (
    <div className="relative w-full h-[600px] lg:h-[calc(100vh-130px)] rounded-3xl overflow-hidden border border-[#e2e8f0] bg-[#f8f7f4] shadow-xs flex flex-col">
      {/* Top Map Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Layer Filters (Interactive buttons) */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 bg-white/90 backdrop-blur-md rounded-2xl border border-[#e2e8f0] shadow-sm">
          {['All', 'Culture', 'Dining', 'Scenic'].map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeLayer === layer
                  ? 'bg-[#0f172a] text-white shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>

        {/* View Mode & Zoom Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-white/90 backdrop-blur-md rounded-2xl border border-[#e2e8f0] shadow-sm">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-[#0f172a] text-white shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Spatial Map</span>
            </button>
            <button
              onClick={() => setViewMode('lookbook')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                viewMode === 'lookbook'
                  ? 'bg-[#0f172a] text-white shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lookbook</span>
            </button>
          </div>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center p-1 bg-white/90 backdrop-blur-md rounded-2xl border border-[#e2e8f0] shadow-sm">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
              className="p-1.5 text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9] rounded-lg transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
              className="p-1.5 text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9] rounded-lg transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9] rounded-lg transition-colors cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'map' ? (
        <div className="relative flex-1 w-full h-full overflow-hidden select-none bg-[#f5f4ef]">
          {/* Custom Stylized Editorial SVG Canvas Map */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="w-full h-full transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* Soft Ambient Geography / Rivers / Terraces */}
            <defs>
              <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e3f2fd" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#d1eafc" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="parkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e8f5e9" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#c8e6c9" stopOpacity="0.8" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#0f172a" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* Background Grid Coordinates */}
            <g opacity="0.15" stroke="#76777d" strokeWidth="0.1" strokeDasharray="1,2">
              <line x1="20" y1="0" x2="20" y2="100" />
              <line x1="40" y1="0" x2="40" y2="100" />
              <line x1="60" y1="0" x2="60" y2="100" />
              <line x1="80" y1="0" x2="80" y2="100" />
              <line x1="0" y1="25" x2="100" y2="25" />
              <line x1="0" y1="50" x2="100" y2="50" />
              <line x1="0" y1="75" x2="100" y2="75" />
            </g>

            {/* Natural Contours / Waterways / Hills */}
            <path
              d="M 55,0 Q 60,30 54,50 T 62,100 L 70,100 Q 62,50 68,0 Z"
              fill="url(#waterGradient)"
            />
            <path
              d="M 0,35 Q 20,40 25,60 T 0,85 Z"
              fill="url(#parkGradient)"
            />
            <path
              d="M 75,10 Q 95,20 100,45 L 100,0 Z"
              fill="url(#parkGradient)"
            />

            {/* Stylized Secondary Arterial Road Network */}
            <g stroke="#e2e8f0" strokeWidth="0.35" fill="none">
              <path d="M 0,20 Q 50,22 100,18" />
              <path d="M 0,45 Q 40,48 100,42" />
              <path d="M 0,70 Q 60,68 100,75" />
              <path d="M 25,0 Q 22,50 28,100" />
              <path d="M 45,0 Q 48,50 42,100" />
              <path d="M 78,0 Q 75,50 82,100" />
            </g>

            {/* Primary Connected Day Route Vector Line */}
            {activeDay.stops.length > 1 && (
              <path
                d={generateRoutePath()}
                fill="none"
                stroke="#0d9488"
                strokeWidth="0.8"
                strokeDasharray="1.5, 1"
                className="animate-pulse"
                opacity="0.85"
              />
            )}

            {/* Stop Location Pins */}
            {filteredStops.map((stop, idx) => {
              const isSelected = stop.id === selectedStopId;
              const originalIndex = activeDay.stops.findIndex((s) => s.id === stop.id) + 1;

              return (
                <g
                  key={stop.id}
                  onClick={() => onSelectStop(stop.id)}
                  className="cursor-pointer transition-transform duration-200"
                  style={{ transformOrigin: `${stop.coordinates.mapX}% ${stop.coordinates.mapY}%` }}
                >
                  {/* Selected Stop Outer Pulsing Beacon */}
                  {isSelected && (
                    <circle
                      cx={stop.coordinates.mapX}
                      cy={stop.coordinates.mapY}
                      r="4"
                      fill="#ff6448"
                      opacity="0.25"
                      className="animate-ping"
                    />
                  )}

                  {/* Pin Base Shadow */}
                  <ellipse
                    cx={stop.coordinates.mapX}
                    cy={stop.coordinates.mapY + 1.2}
                    rx="1.5"
                    ry="0.6"
                    fill="#0f172a"
                    opacity="0.2"
                  />

                  {/* Pin Head Circle */}
                  <circle
                    cx={stop.coordinates.mapX}
                    cy={stop.coordinates.mapY}
                    r={isSelected ? '2.5' : '2'}
                    fill={isSelected ? '#0f172a' : '#ffffff'}
                    stroke={isSelected ? '#ff6448' : '#0d9488'}
                    strokeWidth="0.6"
                    filter="url(#glow)"
                  />

                  {/* Stop Number Inside Pin */}
                  <text
                    x={stop.coordinates.mapX}
                    y={stop.coordinates.mapY + 0.6}
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : '#0f172a'}
                    fontSize="1.6"
                    fontWeight="700"
                    fontFamily="Manrope, sans-serif"
                  >
                    {originalIndex}
                  </text>

                  {/* Label Text Bubble on Hover/Selected */}
                  {isSelected && (
                    <g>
                      <rect
                        x={stop.coordinates.mapX - 12}
                        y={stop.coordinates.mapY - 6.5}
                        width="24"
                        height="4"
                        rx="1"
                        fill="#0f172a"
                        opacity="0.95"
                      />
                      <text
                        x={stop.coordinates.mapX}
                        y={stop.coordinates.mapY - 4}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="1.5"
                        fontWeight="600"
                        fontFamily="Inter, sans-serif"
                      >
                        {stop.title.length > 22 ? `${stop.title.slice(0, 20)}...` : stop.title}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Compass Rose Watermark */}
          <div className="absolute bottom-32 left-4 z-10 pointer-events-none opacity-40">
            <div className="flex items-center gap-1.5 text-[10px] text-[#64748b] font-mono tracking-widest uppercase">
              <Compass className="w-4 h-4 text-[#0f172a]" />
              <span>
                {trip.mapCenter.lat.toFixed(4)}° N, {trip.mapCenter.lng.toFixed(4)}° E
              </span>
            </div>
          </div>

          {/* Floating Selected Stop Card at Bottom */}
          {selectedStop && (
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <div className="max-w-xl mx-auto p-3.5 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#e2e8f0] shadow-xl flex items-center gap-3 sm:gap-4 transition-all">
                <img
                  src={selectedStop.image}
                  alt={selectedStop.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-[#64748b]">
                    <span className="font-semibold text-[#0d9488]">{selectedStop.time}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{selectedStop.neighborhood}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{selectedStop.cost}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#0d9488] font-medium inline-flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5" />
                      Maps Grounded
                    </span>
                  </div>

                  <h4 className="font-editorial text-sm sm:text-base font-bold text-[#0f172a] truncate mt-0.5">
                    {selectedStop.title}
                  </h4>

                  <p className="text-xs text-[#64748b] line-clamp-1 mt-0.5">
                    {selectedStop.editorialNotes}
                  </p>

                  <div className="mt-2 flex items-center gap-3">
                    <button
                      onClick={() => onOpenDetails(selectedStop)}
                      className="text-xs font-semibold text-[#0f172a] hover:text-[#0d9488] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#0d9488]" />
                      <span>Curator Monograph</span>
                    </button>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${selectedStop.title} ${selectedStop.address}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-[#64748b] hover:text-[#0f172a] flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Open Navigation</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Editorial Lookbook / Photo Journal Mode */
        <div className="flex-1 w-full h-full overflow-y-auto p-4 sm:p-6 bg-white pt-18">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="border-b border-[#f1f5f9] pb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0d9488]">
                Visual Journal · Day {activeDay.dayNumber}
              </span>
              <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#0f172a] mt-1">
                {activeDay.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#64748b] mt-1">
                {activeDay.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {activeDay.stops.map((stop, i) => (
                <div
                  key={stop.id}
                  onClick={() => onOpenDetails(stop)}
                  className="group cursor-pointer rounded-2xl border border-[#e2e8f0] overflow-hidden hover:border-[#cbd5e1] hover:shadow-md transition-all"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#f4f3f1]">
                    <img
                      src={stop.image}
                      alt={stop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-semibold">
                      Stop 0{i + 1} · {stop.time}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="flex items-center justify-between text-xs text-[#64748b]">
                      <span>{stop.neighborhood}</span>
                      <span className="font-semibold text-[#0f172a]">{stop.cost}</span>
                    </div>

                    <h4 className="font-editorial text-base sm:text-lg font-bold text-[#0f172a] mt-1 group-hover:text-[#0d9488] transition-colors">
                      {stop.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-[#45464d] leading-relaxed mt-2 line-clamp-2">
                      {stop.editorialNotes}
                    </p>

                    <div className="mt-3 text-xs font-semibold text-[#0d9488] flex items-center gap-1">
                      <span>View full archival profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
