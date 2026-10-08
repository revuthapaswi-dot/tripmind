import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, Compass, Coffee, CloudRain, Utensils, Feather } from 'lucide-react';

interface NaturalLanguageBarProps {
  onRefine: (prompt: string) => Promise<void>;
  isLoading: boolean;
  destinationName: string;
}

export const NaturalLanguageBar: React.FC<NaturalLanguageBarProps> = ({
  onRefine,
  isLoading,
  destinationName,
}) => {
  const [prompt, setPrompt] = useState('');

  const quickPrompts = [
    { label: 'Add quiet morning tea ceremony', icon: Coffee },
    { label: 'Rainy afternoon alternative', icon: CloudRain },
    { label: 'Curate a Michelin lunch', icon: Utensils },
    { label: 'Focus on artisanal crafts & woodcraft', icon: Feather },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onRefine(prompt);
    setPrompt('');
  };

  const handleSelectQuickPrompt = (text: string) => {
    if (isLoading) return;
    onRefine(text);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        {/* 56px Command Surface with 9999px radius */}
        <div className="relative flex items-center h-14 w-full rounded-full bg-white border border-[#e2e8f0] shadow-xs transition-all duration-200 focus-within:border-[#0d9488] focus-within:ring-4 focus-within:ring-[#0d9488]/15">
          <div className="pl-4 sm:pl-5 text-[#0d9488] flex items-center justify-center shrink-0">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#ff6448]" />
            ) : (
              <Sparkles className="w-5 h-5 text-[#0d9488]" />
            )}
          </div>

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            placeholder={`Instruct AI editor (e.g., "Add a quiet kissaten in Gion", "Optimize today for walking distance")...`}
            className="flex-1 h-full bg-transparent px-3 sm:px-4 text-xs sm:text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none disabled:opacity-60"
          />

          <div className="pr-2">
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="h-10 w-10 sm:h-10 sm:w-auto sm:px-4 rounded-full bg-[#0f172a] text-white flex items-center justify-center gap-1.5 text-xs font-semibold hover:bg-[#1e293b] active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <span className="hidden sm:inline">Refine</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </form>

      {/* Suggested Editorial Prompts */}
      <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-[11px] font-medium text-[#94a3b8] shrink-0 mr-1 hidden sm:inline">
          Inspirations:
        </span>
        {quickPrompts.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSelectQuickPrompt(item.label)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#e2e8f0] bg-white text-[#45464d] hover:border-[#cbd5e1] hover:text-[#0f172a] hover:bg-[#f8fafc] text-[11px] whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              <Icon className="w-3 h-3 text-[#0d9488]" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
