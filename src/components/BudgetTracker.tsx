import React, { useState } from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  PieChart, 
  ChevronRight, 
  Building2, 
  Utensils, 
  Compass, 
  Train, 
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { Trip, ItineraryDay } from '../types';

interface BudgetTrackerProps {
  trip: Trip;
  activeDay: ItineraryDay;
  onOpenLogisticsModal: () => void;
}

export const BudgetTracker: React.FC<BudgetTrackerProps> = ({
  trip,
  activeDay,
  onOpenLogisticsModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { budgetSummary } = trip.logistics;

  // Extract numerical values if possible for percentage calculation
  const parseAmount = (str: string): number => {
    const num = parseFloat(str.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const totalNum = parseAmount(budgetSummary.totalEstimate);
  const spentNum = parseAmount(budgetSummary.spent);
  const percentageSpent = totalNum > 0 ? Math.min(Math.round((spentNum / totalNum) * 100), 100) : 64;

  // Calculate today's stops estimated spend
  const todayStopsSpend = activeDay.stops.reduce((acc, stop) => {
    const val = parseAmount(stop.cost);
    return acc + val;
  }, 0);

  // Currency symbol detection
  const currencySymbol = budgetSummary.totalEstimate.match(/^[^\d\s]+/)?.[0] || '$';

  const categoryItems = [
    {
      key: 'stays',
      label: 'Stays & Heritage Lodging',
      amount: budgetSummary.breakdown.stays,
      icon: Building2,
      color: 'bg-[#0f172a] text-white',
      accentColor: '#0f172a',
    },
    {
      key: 'dining',
      label: 'Epicurean & Dining',
      amount: budgetSummary.breakdown.dining,
      icon: Utensils,
      color: 'bg-[#ff6448] text-white',
      accentColor: '#ff6448',
    },
    {
      key: 'experiences',
      label: 'Cultural Admittance',
      amount: budgetSummary.breakdown.experiences,
      icon: Compass,
      color: 'bg-[#0d9488] text-white',
      accentColor: '#0d9488',
    },
    {
      key: 'transit',
      label: 'Shinkansen & Transit',
      amount: budgetSummary.breakdown.transit,
      icon: Train,
      color: 'bg-[#64748b] text-white',
      accentColor: '#64748b',
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-[#e2e8f0] bg-white p-4 sm:p-5 shadow-xs transition-all hover:border-[#cbd5e1]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#f1f5f9]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0d9488]/10 text-[#0d9488] flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-editorial text-sm sm:text-base font-bold text-[#0f172a]">
                Trip Budget & Spend Tracker
              </h3>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#0d9488]/10 text-[#0d9488]">
                On Budget
              </span>
            </div>
            <p className="text-[11px] text-[#64748b]">
              Real-time financial reconciliation for {trip.destination}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenLogisticsModal}
          className="text-xs font-semibold text-[#0d9488] hover:text-[#005049] flex items-center gap-0.5 transition-colors cursor-pointer group"
        >
          <span>Full Ledger</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Primary KPI Figures */}
      <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-[#faf9f6] border border-[#e2e8f0]">
          <span className="block text-[11px] text-[#64748b]">Total Projected</span>
          <span className="block text-base sm:text-lg font-bold font-editorial text-[#0f172a] tabular-nums mt-0.5">
            {budgetSummary.totalEstimate}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#faf9f6] border border-[#e2e8f0]">
          <span className="block text-[11px] text-[#64748b]">Committed / Paid</span>
          <span className="block text-base sm:text-lg font-bold font-editorial text-[#0d9488] tabular-nums mt-0.5">
            {budgetSummary.spent}
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-[#faf9f6] border border-[#e2e8f0]">
          <span className="block text-[11px] text-[#64748b]">Day {activeDay.dayNumber} Stop Estimate</span>
          <span className="block text-base sm:text-lg font-bold font-editorial text-[#0f172a] tabular-nums mt-0.5">
            {todayStopsSpend > 0 ? `${currencySymbol}${todayStopsSpend.toLocaleString()}` : 'Included in Passes'}
          </span>
        </div>
      </div>

      {/* Progress Bar Gauge */}
      <div className="mt-4 pt-1">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[#64748b] text-[11px]">
            Budget Commitment Velocity
          </span>
          <span className="font-semibold text-[#0f172a] tabular-nums text-xs">
            {percentageSpent}% allocated
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-[#f1f5f9] overflow-hidden flex">
          <div
            className="h-full bg-[#0d9488] rounded-full transition-all duration-500"
            style={{ width: `${percentageSpent}%` }}
          />
        </div>
      </div>

      {/* Itemized Categories Grid */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {categoryItems.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(isSelected ? null : cat.key)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#0f172a] bg-[#f8fafc] ring-1 ring-[#0f172a]/10'
                  : 'border-[#f1f5f9] bg-[#faf9f6] hover:border-[#cbd5e1] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-5 h-5 rounded-md ${cat.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-3 h-3" />
                </div>
                <span className="text-[10px] text-[#94a3b8] font-medium">Breakdown</span>
              </div>
              <span className="block text-[11px] text-[#64748b] mt-2 truncate">
                {cat.label}
              </span>
              <span className="block text-xs font-bold text-[#0f172a] tabular-nums mt-0.5">
                {cat.amount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Contextual Tip / Notes footer */}
      <div className="mt-3.5 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[11px] text-[#64748b]">
        <div className="flex items-center gap-1.5 truncate">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#0d9488] shrink-0" />
          <span className="truncate">
            All accommodations and rail passes locked under guaranteed rate.
          </span>
        </div>
        <span className="tabular-nums shrink-0 ml-2 font-medium text-[#0f172a]">
          {trip.logistics.accommodations.length} stays booked
        </span>
      </div>
    </div>
  );
};
