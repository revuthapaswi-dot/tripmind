import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  ExternalLink, 
  Clock, 
  Star, 
  ShieldCheck, 
  Loader2, 
  Sparkles, 
  Navigation,
  Compass
} from 'lucide-react';

interface MapsGroundingPanelProps {
  placeName: string;
  destination: string;
  initialAddress?: string;
}

export const MapsGroundingPanel: React.FC<MapsGroundingPanelProps> = ({
  placeName,
  destination,
  initialAddress,
}) => {
  const [loading, setLoading] = useState(false);
  const [groundedData, setGroundedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMapsGrounding = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeName,
          destination,
        }),
      });

      if (!res.ok) throw new Error('Failed to retrieve Google Maps data');
      const data = await res.json();
      setGroundedData(data);
    } catch (err: any) {
      console.warn('Maps grounding notice:', err?.message);
      setError('Unable to fetch live Google Maps data at this moment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapsGrounding();
  }, [placeName, destination]);

  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#0f172a]">
                Google Maps Live Grounding
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#0d9488]/10 text-[#0d9488]">
                gemini-3.5-flash
              </span>
            </div>
            <p className="text-[11px] text-[#64748b]">
              Accurate verified schedule, ratings, and navigation data
            </p>
          </div>
        </div>

        <button
          onClick={fetchMapsGrounding}
          disabled={loading}
          className="text-[11px] font-medium text-[#0d9488] hover:text-[#005049] flex items-center gap-1 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          <span>Refresh</span>
        </button>
      </div>

      {/* Body Content */}
      <div className="mt-3">
        {loading ? (
          <div className="py-6 flex flex-col items-center justify-center gap-2 text-xs text-[#64748b]">
            <Loader2 className="w-5 h-5 animate-spin text-[#0d9488]" />
            <span>Consulting Google Maps live grounding API...</span>
          </div>
        ) : error ? (
          <div className="text-xs text-red-500 py-2">{error}</div>
        ) : groundedData ? (
          <div className="space-y-3">
            {/* Grounded Summary text from gemini-3.5-flash with googleMaps tool */}
            {groundedData.summary && (
              <div className="p-3 rounded-xl bg-[#faf9f6] border border-[#e2e8f0] text-xs leading-relaxed text-[#1a1c1a] whitespace-pre-line">
                {groundedData.summary}
              </div>
            )}

            {/* Verification highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl border border-[#f1f5f9] bg-[#f8fafc]">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#0f172a]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0d9488]" />
                  <span>Verified Google Maps Place</span>
                </div>
                <div className="text-[11px] text-[#64748b] mt-0.5 truncate">
                  {groundedData.placeName}
                </div>
              </div>

              <div className="p-2.5 rounded-xl border border-[#f1f5f9] bg-[#f8fafc]">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#0f172a]">
                  <Compass className="w-3.5 h-3.5 text-[#ff6448]" />
                  <span>Direct Navigation</span>
                </div>
                <a
                  href={groundedData.googleMapsUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-medium text-[#0d9488] hover:underline flex items-center gap-1 mt-0.5"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-[#64748b]">No live data retrieved yet.</div>
        )}
      </div>
    </div>
  );
};
