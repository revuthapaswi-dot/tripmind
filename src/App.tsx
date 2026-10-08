import React, { useState } from 'react';
import { MessageSquare, Radio } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { DestinationHero } from './components/DestinationHero';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { NaturalLanguageBar } from './components/NaturalLanguageBar';
import { DayNavigator } from './components/DayNavigator';
import { BudgetTracker } from './components/BudgetTracker';
import { TimelineCard } from './components/TimelineCard';
import { SpatialMap } from './components/SpatialMap';
import { StopDetailModal } from './components/StopDetailModal';
import { LogisticsModal } from './components/LogisticsModal';
import { ExportModal } from './components/ExportModal';
import { NewTripModal } from './components/NewTripModal';
import { VoiceGuideModal } from './components/VoiceGuideModal';
import { VeoVideoModal } from './components/VeoVideoModal';
import { GeminiChatbotModal } from './components/GeminiChatbotModal';
import { SearchGroundingModal } from './components/SearchGroundingModal';
import { INITIAL_TRIPS } from './data/trips';
import { Trip, ItineraryStop } from './types';

export default function App() {
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [currentTrip, setCurrentTrip] = useState<Trip>(INITIAL_TRIPS[0]);
  const [activeDayNumber, setActiveDayNumber] = useState<number>(1);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(
    INITIAL_TRIPS[0].days[0].stops[0]?.id || null
  );

  // Responsive view toggle: 'split' | 'planner' | 'map'
  const [activeView, setActiveView] = useState<'split' | 'planner' | 'map'>('split');

  // Modals state
  const [isNewTripModalOpen, setIsNewTripModalOpen] = useState(false);
  const [isLogisticsModalOpen, setIsLogisticsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isVoiceGuideOpen, setIsVoiceGuideOpen] = useState(false);
  const [isVeoVideoOpen, setIsVeoVideoOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isSearchGroundingOpen, setIsSearchGroundingOpen] = useState(false);
  const [detailStop, setDetailStop] = useState<ItineraryStop | null>(null);

  // AI Refine state
  const [isRefining, setIsRefining] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const activeDay =
    currentTrip.days.find((d) => d.dayNumber === activeDayNumber) ||
    currentTrip.days[0];

  // Trip selection handler
  const handleSelectTrip = (trip: Trip) => {
    setCurrentTrip(trip);
    setActiveDayNumber(1);
    setSelectedStopId(trip.days[0]?.stops[0]?.id || null);
  };

  // Day selection handler
  const handleSelectDay = (dayNum: number) => {
    setActiveDayNumber(dayNum);
    const day = currentTrip.days.find((d) => d.dayNumber === dayNum);
    if (day && day.stops.length > 0) {
      setSelectedStopId(day.stops[0].id);
    }
  };

  // Toggle visited status for stop
  const handleToggleVisited = (stopId: string) => {
    const updatedDays = currentTrip.days.map((day) => ({
      ...day,
      stops: day.stops.map((stop) =>
        stop.id === stopId ? { ...stop, isVisited: !stop.isVisited } : stop
      ),
    }));
    const updatedTrip = { ...currentTrip, days: updatedDays };
    setCurrentTrip(updatedTrip);
    setTrips((prev) => prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)));
  };

  // Refine itinerary via natural language prompt
  const handleRefine = async (prompt: string) => {
    setIsRefining(true);
    try {
      const response = await fetch('/api/refine-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip: currentTrip,
          prompt,
          activeDayNumber,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refine itinerary');
      }

      const refinedTrip: Trip = await response.json();
      setCurrentTrip(refinedTrip);
      setTrips((prev) =>
        prev.map((t) => (t.id === refinedTrip.id ? refinedTrip : t))
      );

      setNotification(`Editorial adjustment applied: "${prompt.slice(0, 36)}..."`);
      setTimeout(() => setNotification(null), 4000);
    } catch (error) {
      console.warn('Itinerary refine notice:', error);
      setNotification('Unable to apply adjustment. Please retry.');
      setTimeout(() => setNotification(null), 4000);
    } finally {
      setIsRefining(false);
    }
  };

  // Handle new synthesized trip from AI
  const handleTripGenerated = (newTrip: Trip) => {
    setTrips((prev) => [newTrip, ...prev]);
    setCurrentTrip(newTrip);
    setActiveDayNumber(1);
    setSelectedStopId(newTrip.days[0]?.stops[0]?.id || null);
    setNotification(`Successfully synthesized monograph for ${newTrip.destination}!`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1c1a] flex flex-col font-sans">
      {/* Sticky Editorial Navigation Header */}
      <Navbar
        currentTrip={currentTrip}
        allTrips={trips}
        onSelectTrip={handleSelectTrip}
        onOpenNewTripModal={() => setIsNewTripModalOpen(true)}
        onOpenLogisticsModal={() => setIsLogisticsModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenVoiceGuide={() => setIsVoiceGuideOpen(true)}
        onOpenVeoVideo={() => setIsVeoVideoOpen(true)}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        onOpenSearchGrounding={() => setIsSearchGroundingOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Floating Status / AI Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="px-4 py-3 rounded-2xl bg-[#0f172a] text-white text-xs font-semibold shadow-xl border border-white/10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0d9488] animate-ping" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Main Dual-Pane Workspace */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Pane (5 Columns): Fluid Narrative Planner */}
          <div
            className={`space-y-6 lg:col-span-5 ${
              activeView === 'map' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Destination Overview Hero Monograph */}
            <DestinationHero 
              trip={currentTrip} 
              onOpenSearchGrounding={() => setIsSearchGroundingOpen(true)}
            />

            {/* Executive Summary: Duration, Distance Covered & Major Highlights */}
            <ExecutiveSummary trip={currentTrip} />

            {/* AI Natural Language Command Bar */}
            <div className="pt-1">
              <NaturalLanguageBar
                onRefine={handleRefine}
                isLoading={isRefining}
                destinationName={currentTrip.destination}
              />
            </div>

            {/* Multi-Day Navigation & Weather Briefing */}
            <DayNavigator
              days={currentTrip.days}
              activeDayNumber={activeDayNumber}
              onSelectDay={handleSelectDay}
            />

            {/* Budget Tracker Card (Aggregates Logistics Costs & Spend) */}
            <BudgetTracker
              trip={currentTrip}
              activeDay={activeDay}
              onOpenLogisticsModal={() => setIsLogisticsModalOpen(true)}
            />

            {/* Timeline Cards Container */}
            <div className="pt-2">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#e2e8f0]">
                <h3 className="font-editorial text-sm font-bold text-[#0f172a] uppercase tracking-wider">
                  Itinerary Timeline · Day {activeDay.dayNumber}
                </h3>
                <span className="text-xs text-[#64748b] tabular-nums">
                  {activeDay.stops.length} chapters scheduled
                </span>
              </div>

              {/* Sequential Stops Rail */}
              <div className="relative">
                {activeDay.stops.map((stop, index) => (
                  <TimelineCard
                    key={stop.id}
                    stop={stop}
                    index={index}
                    totalStops={activeDay.stops.length}
                    isSelected={stop.id === selectedStopId}
                    onSelect={() => setSelectedStopId(stop.id)}
                    onOpenDetails={() => setDetailStop(stop)}
                    onToggleVisited={handleToggleVisited}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Pane (7 Columns): Spatial Context & Interactive Map */}
          <div
            className={`lg:col-span-7 sticky top-22 ${
              activeView === 'planner' ? 'hidden lg:block' : 'block'
            }`}
          >
            <SpatialMap
              trip={currentTrip}
              activeDay={activeDay}
              selectedStopId={selectedStopId}
              onSelectStop={(stopId) => setSelectedStopId(stopId)}
              onOpenDetails={(stop) => setDetailStop(stop)}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <StopDetailModal
        stop={detailStop}
        onClose={() => setDetailStop(null)}
        onToggleVisited={handleToggleVisited}
      />

      {isLogisticsModalOpen && (
        <LogisticsModal
          logistics={currentTrip.logistics}
          destination={currentTrip.destination}
          onClose={() => setIsLogisticsModalOpen(false)}
        />
      )}

      {isExportModalOpen && (
        <ExportModal
          trip={currentTrip}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      <NewTripModal
        isOpen={isNewTripModalOpen}
        onClose={() => setIsNewTripModalOpen(false)}
        onTripGenerated={handleTripGenerated}
      />

      <VoiceGuideModal
        isOpen={isVoiceGuideOpen}
        onClose={() => setIsVoiceGuideOpen(false)}
        currentTrip={currentTrip}
      />

      <VeoVideoModal
        isOpen={isVeoVideoOpen}
        onClose={() => setIsVeoVideoOpen(false)}
        currentTrip={currentTrip}
      />

      <GeminiChatbotModal
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        currentTrip={currentTrip}
      />

      <SearchGroundingModal
        isOpen={isSearchGroundingOpen}
        onClose={() => setIsSearchGroundingOpen(false)}
        currentTrip={currentTrip}
      />

      {/* Floating Action Buttons for Gemini Chat & Live Voice */}
      <div className="fixed bottom-6 right-6 z-30 flex items-center gap-2.5">
        <button
          onClick={() => setIsVoiceGuideOpen(true)}
          title="Open Voice Guide (gemini-3.8-live)"
          className="p-3.5 rounded-full bg-[#0d9488] text-white shadow-xl hover:bg-[#006f66] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Radio className="w-5 h-5 animate-pulse" />
        </button>

        <button
          onClick={() => setIsChatbotOpen(true)}
          title="Open Gemini Multi-Turn Chat"
          className="px-4 py-3 rounded-full bg-[#0f172a] text-white shadow-xl hover:bg-[#1e293b] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer font-semibold text-xs border border-white/10"
        >
          <MessageSquare className="w-4 h-4 text-[#ff6448]" />
          <span className="hidden sm:inline">Gemini Chat</span>
        </button>
      </div>
    </div>
  );
}
