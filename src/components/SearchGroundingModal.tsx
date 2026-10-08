import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Globe, 
  Sparkles, 
  Loader2, 
  ExternalLink, 
  Calendar, 
  CloudSun, 
  ShieldCheck, 
  RefreshCw,
  Compass
} from 'lucide-react';
import { Trip } from '../types';

interface SearchGroundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrip: Trip;
}

export const SearchGroundingModal: React.FC<SearchGroundingModalProps> = ({
  isOpen,
  onClose,
  currentTrip,
}) => {
  const [query, setQuery] = useState(
    `Current seasonal weather advisory, cultural festivals, temple night illuminations, and transit schedule for ${currentTrip.destination}`
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState<any>(null);

  const handleFetchGrounding = async (targetQuery?: string) => {
    const q = targetQuery || query;
    if (!q.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q.trim(),
          destination: currentTrip.destination,
        }),
      });

      if (!res.ok) throw new Error('Failed to retrieve search data');
      const data = await res.json();
      setSearchData(data);
    } catch (err: any) {
      console.warn('Search grounding notice:', err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleFetchGrounding();
    }
  }, [isOpen, currentTrip.destination]);

  if (!isOpen) return null;

  const quickInquiries = [
    `Current temple night illuminations & foliage timings in ${currentTrip.destination}`,
    `Transit strikes or rail schedule modifications today`,
    `Local festivals and artisan market schedules this weekend`,
    `Current seasonal rainfall and temperature advisories`,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[88vh] bg-white rounded-3xl overflow-hidden border border-[#e2e8f0] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#e2e8f0] flex items-center justify-between bg-[#faf9f6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold tracking-widest uppercase text-blue-600">
                  Google Search Live Grounding
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">
                  gemini-3.5-flash
                </span>
              </div>
              <h2 className="font-editorial text-lg sm:text-xl font-bold text-[#0f172a] mt-0.5">
                Real-Time Destination Grounding
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
          {/* Query Search Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFetchGrounding();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#94a3b8]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Inquire about live events, weather alerts, exhibitions..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e2e8f0] bg-[#faf9f6] text-xs sm:text-sm text-[#0f172a] focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {/* Quick Inquiry Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-semibold text-[#94a3b8] shrink-0 mr-1">
              Suggestions:
            </span>
            {quickInquiries.map((q, i) => (
              <button
                key={i}
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setQuery(q);
                  handleFetchGrounding(q);
                }}
                className="px-3 py-1 rounded-full border border-[#e2e8f0] bg-white text-[11px] text-[#45464d] hover:border-[#cbd5e1] hover:text-[#0f172a] transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Search Result Output */}
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs text-[#64748b]">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span>Querying live web index via gemini-3.5-flash with googleSearch tool...</span>
            </div>
          ) : searchData ? (
            <div className="space-y-4">
              {/* Summary text */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#faf9f6] border border-[#e2e8f0]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0f172a] mb-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Verified Google Search Grounded Intelligence</span>
                </div>
                <div className="text-xs sm:text-sm text-[#1a1c1a] leading-relaxed whitespace-pre-line">
                  {searchData.summary}
                </div>
              </div>

              {/* Source citations */}
              {searchData.groundingMetadata?.groundingChunks &&
                searchData.groundingMetadata.groundingChunks.length > 0 && (
                  <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0]">
                    <span className="text-xs font-bold text-[#0f172a] block mb-2">
                      Live Grounded Web Sources
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {searchData.groundingMetadata.groundingChunks.map(
                        (chunk: any, idx: number) => {
                          if (!chunk.web?.title) return null;
                          return (
                            <a
                              key={idx}
                              href={chunk.web.uri || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 rounded-xl border border-[#f1f5f9] bg-[#faf9f6] hover:bg-white hover:border-[#cbd5e1] transition-all flex items-center justify-between gap-2 group"
                            >
                              <span className="text-xs font-medium text-[#0f172a] group-hover:text-blue-600 truncate">
                                {chunk.web.title}
                              </span>
                              <ExternalLink className="w-3.5 h-3.5 text-[#94a3b8] shrink-0 group-hover:text-blue-600" />
                            </a>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
