import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Calendar, 
  Copy, 
  Check, 
  Share2, 
  FileText, 
  Download,
  Sparkles
} from 'lucide-react';
import { Trip } from '../types';

interface ExportModalProps {
  trip: Trip;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ trip, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  // Generate .ics calendar download
  const handleDownloadICS = () => {
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//TripMind Editorial AI//Itinerary Calendar//EN',
      `X-WR-CALNAME:${trip.title}`,
    ];

    trip.days.forEach((day, dIdx) => {
      day.stops.forEach((stop, sIdx) => {
        const timeParts = stop.time.split(':');
        const hour = timeParts[0] || '09';
        const minute = timeParts[1] || '00';
        
        icsContent.push(
          'BEGIN:VEVENT',
          `UID:tripmind-${trip.id}-d${day.dayNumber}-s${sIdx}@tripmind.editorial`,
          `SUMMARY:${stop.title} (${stop.category})`,
          `DESCRIPTION:${stop.editorialNotes.replace(/\n/g, ' ')}\\n\\nInsider Tip: ${stop.insiderTip}`,
          `LOCATION:${stop.address}`,
          `DTSTART:202610${14 + dIdx}T${hour}${minute}00`,
          `DTEND:202610${14 + dIdx}T${parseInt(hour) + 1}${minute}00`,
          'STATUS:CONFIRMED',
          'END:VEVENT'
        );
      });
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${trip.destination.toLowerCase().replace(/\s+/g, '-')}-itinerary.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate and copy Markdown
  const handleCopyMarkdown = () => {
    let md = `# ${trip.title}\n`;
    md += `*${trip.subtitle}*\n\n`;
    md += `**Destination:** ${trip.destination}, ${trip.country} | **Duration:** ${trip.recommendedDuration} | **Season:** ${trip.season}\n\n`;
    md += `## Editorial Preamble\n${trip.editorialPreamble}\n\n`;

    trip.days.forEach((day) => {
      md += `### Day ${day.dayNumber}: ${day.title}\n`;
      md += `*${day.subtitle}* (Walking distance: ${day.walkingDistanceKm} km)\n\n`;
      day.stops.forEach((stop) => {
        md += `#### ${stop.time} - ${stop.title}\n`;
        md += `- **Category:** ${stop.category} | **Cost:** ${stop.cost} | **Duration:** ${stop.duration}\n`;
        md += `- **Address:** ${stop.address}\n`;
        md += `- **Notes:** ${stop.editorialNotes}\n`;
        md += `- **Insider Tip:** ${stop.insiderTip}\n\n`;
      });
    });

    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2500);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden border border-[#e2e8f0] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6 border-b border-[#e2e8f0] flex items-center justify-between bg-[#faf9f6]">
          <div>
            <span className="text-[10px] font-semibold tracking-widest uppercase text-[#0d9488]">
              Publication & Export
            </span>
            <h2 className="font-editorial text-lg sm:text-xl font-bold text-[#0f172a] mt-0.5">
              Export Itinerary & Share
            </h2>
            <p className="text-xs text-[#64748b]">
              Print-ready travel monograph, calendar integration, or shareable dossier
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#e2e8f0] text-[#64748b] hover:text-[#0f172a] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {/* Option 1: Print / PDF Monograph */}
          <div className="p-4 rounded-2xl border border-[#e2e8f0] bg-white hover:border-[#0f172a] transition-all flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#0f172a] text-white">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0f172a]">
                  Editorial PDF / Print Monograph
                </h4>
                <p className="text-xs text-[#64748b]">
                  Clean, print-optimized typographical layout formatted for paper or PDF export
                </p>
              </div>
            </div>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-[#0f172a] text-white text-xs font-semibold hover:bg-[#1e293b] transition-colors cursor-pointer shrink-0"
            >
              Print / Save PDF
            </button>
          </div>

          {/* Option 2: Apple / Google Calendar (.ics) */}
          <div className="p-4 rounded-2xl border border-[#e2e8f0] bg-white hover:border-[#0d9488] transition-all flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#0d9488]/15 text-[#0d9488]">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0f172a]">
                  Calendar Sync (.ics)
                </h4>
                <p className="text-xs text-[#64748b]">
                  Download calendar events with exact times, addresses, and curator notes
                </p>
              </div>
            </div>
            <button
              onClick={handleDownloadICS}
              className="px-3.5 py-2 rounded-xl border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#0f172a] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-[#0d9488]" />
              <span>Download .ics</span>
            </button>
          </div>

          {/* Option 3: Copy Markdown for Notion / Obsidian */}
          <div className="p-4 rounded-2xl border border-[#e2e8f0] bg-white hover:border-[#cbd5e1] transition-all flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#faf9f6] text-[#45464d] border border-[#e2e8f0]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0f172a]">
                  Markdown Dossier
                </h4>
                <p className="text-xs text-[#64748b]">
                  Copy formatted markdown text to paste directly into Notion, Obsidian, or Notes
                </p>
              </div>
            </div>
            <button
              onClick={handleCopyMarkdown}
              className="px-3.5 py-2 rounded-xl border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#0f172a] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              {copiedMarkdown ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#0d9488]" />
                  <span className="text-[#0d9488]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>

          {/* Option 4: Shareable Link */}
          <div className="p-4 rounded-2xl border border-[#e2e8f0] bg-white hover:border-[#cbd5e1] transition-all flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#ff6448]/10 text-[#ff6448]">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0f172a]">
                  Shareable Trip URL
                </h4>
                <p className="text-xs text-[#64748b]">
                  Copy direct link to share this customized editorial itinerary with companions
                </p>
              </div>
            </div>
            <button
              onClick={handleCopyShareLink}
              className="px-3.5 py-2 rounded-xl border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#0f172a] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#0d9488]" />
                  <span className="text-[#0d9488]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
