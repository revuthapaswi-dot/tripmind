import React from 'react';
import { 
  X, 
  Plane, 
  Building2, 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Clock, 
  MapPin, 
  Ticket, 
  CheckCircle2,
  PieChart
} from 'lucide-react';
import { TripLogistics } from '../types';

interface LogisticsModalProps {
  logistics: TripLogistics;
  destination: string;
  onClose: () => void;
}

export const LogisticsModal: React.FC<LogisticsModalProps> = ({
  logistics,
  destination,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl overflow-hidden border border-[#e2e8f0] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#e2e8f0] flex items-center justify-between bg-[#faf9f6]">
          <div>
            <span className="text-[10px] font-semibold tracking-widest uppercase text-[#0d9488]">
              Operational Ledger
            </span>
            <h2 className="font-editorial text-lg sm:text-xl font-bold text-[#0f172a] mt-0.5">
              Trip Logistics & Financial Ledger
            </h2>
            <p className="text-xs text-[#64748b]">
              Real-time transit confirmations and budget reconciliation for {destination}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#e2e8f0] text-[#64748b] hover:text-[#0f172a] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-7">
          {/* Budget Reconciliation Summary Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] text-white shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs text-white/60">Estimated Total Expenditure</span>
                <div className="text-2xl sm:text-3xl font-bold font-editorial tabular-nums tracking-tight mt-0.5">
                  {logistics.budgetSummary.totalEstimate}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-white/10 text-xs">
                  <span className="text-white/60 mr-1.5">Committed:</span>
                  <span className="font-bold text-[#86f2e4] tabular-nums">
                    {logistics.budgetSummary.spent}
                  </span>
                </div>
              </div>
            </div>

            {/* Itemized Category Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
              <div>
                <span className="text-white/60 block text-[11px]">Accommodations</span>
                <span className="font-semibold tabular-nums mt-0.5 block text-white/90">
                  {logistics.budgetSummary.breakdown.stays}
                </span>
              </div>
              <div>
                <span className="text-white/60 block text-[11px]">Epicurean & Dining</span>
                <span className="font-semibold tabular-nums mt-0.5 block text-white/90">
                  {logistics.budgetSummary.breakdown.dining}
                </span>
              </div>
              <div>
                <span className="text-white/60 block text-[11px]">Cultural Admittance</span>
                <span className="font-semibold tabular-nums mt-0.5 block text-white/90">
                  {logistics.budgetSummary.breakdown.experiences}
                </span>
              </div>
              <div>
                <span className="text-white/60 block text-[11px]">Local Transit</span>
                <span className="font-semibold tabular-nums mt-0.5 block text-white/90">
                  {logistics.budgetSummary.breakdown.transit}
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Transit & Flight Confirmations */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Plane className="w-4 h-4 text-[#0d9488]" />
              <h3 className="font-editorial text-sm font-bold text-[#0f172a] uppercase tracking-wider">
                Transit & Shinkansen Boarding Passes
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {logistics.flights.map((flight, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-[#e2e8f0] bg-white shadow-xs hover:border-[#cbd5e1] transition-all"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0f172a]">{flight.airline}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#0d9488]/10 text-[#0d9488] font-semibold text-[10px]">
                      {flight.status}
                    </span>
                  </div>

                  <div className="mt-2 text-sm font-semibold text-[#0f172a] tabular-nums">
                    {flight.flightNumber}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs border-t border-[#f1f5f9] pt-2 text-[#64748b]">
                    <div>
                      <span className="block text-[10px] text-[#94a3b8]">Origin</span>
                      <span className="font-medium text-[#0f172a]">{flight.from}</span>
                      <span className="block text-[11px] tabular-nums mt-0.5">
                        {flight.departureTime}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] text-[#94a3b8]">Destination</span>
                      <span className="font-medium text-[#0f172a]">{flight.to}</span>
                      <span className="block text-[11px] tabular-nums mt-0.5">
                        {flight.arrivalTime}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Accommodations & Sanctuaries */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-[#0d9488]" />
              <h3 className="font-editorial text-sm font-bold text-[#0f172a] uppercase tracking-wider">
                Sanctuary & Hotel Reservations
              </h3>
            </div>

            <div className="space-y-3">
              {logistics.accommodations.map((hotel, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-[#e2e8f0] bg-white flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-xs"
                >
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full sm:w-24 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-[#0d9488] uppercase tracking-wider">
                        {hotel.type}
                      </span>
                      <span className="text-xs font-bold text-[#0f172a] tabular-nums">
                        {hotel.ratePerNight}
                      </span>
                    </div>
                    <h4 className="font-editorial text-sm sm:text-base font-bold text-[#0f172a] truncate mt-0.5">
                      {hotel.name}
                    </h4>
                    <p className="text-xs text-[#64748b] truncate mt-0.5">
                      {hotel.neighborhood}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-[#64748b] tabular-nums">
                      <span>Check-in: {hotel.checkIn}</span>
                      <span aria-hidden="true">·</span>
                      <span>Check-out: {hotel.checkOut}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Passes & Cards */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Ticket className="w-4 h-4 text-[#0d9488]" />
              <h3 className="font-editorial text-sm font-bold text-[#0f172a] uppercase tracking-wider">
                Transit Passes & Heritage Entry Credentials
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {logistics.passes.map((pass, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-[#e2e8f0] bg-[#faf9f6]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0f172a]">{pass.name}</span>
                    <span className="text-[10px] text-[#0d9488] font-semibold uppercase">
                      {pass.type}
                    </span>
                  </div>
                  <p className="text-xs text-[#45464d] mt-1">{pass.details}</p>
                  <div className="mt-2 text-[11px] text-[#64748b]">
                    Validity: <span className="font-medium text-[#0f172a]">{pass.validity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
