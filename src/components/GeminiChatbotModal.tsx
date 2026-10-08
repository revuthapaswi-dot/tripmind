import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Loader2, 
  Search, 
  ExternalLink, 
  Globe, 
  Zap, 
  Compass, 
  BrainCircuit, 
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { Trip } from '../types';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  modelUsed?: string;
  roleUsed?: string;
  groundingMetadata?: {
    webSearchQueries?: string[];
    groundingChunks?: Array<{
      web?: {
        title?: string;
        uri?: string;
      };
    }>;
  };
  timestamp: string;
}

interface GeminiChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrip: Trip;
}

export const GeminiChatbotModal: React.FC<GeminiChatbotModalProps> = ({
  isOpen,
  onClose,
  currentTrip,
}) => {
  // Three roles & models as required:
  // - gemini-3.1-pro-preview for particularly complex tasks
  // - gemini-3.5-flash for general tasks
  // - gemini-3.1-flash-lite for tasks that should happen fast
  const [selectedRole, setSelectedRole] = useState<'editorial-concierge' | 'fast-scout' | 'master-architect'>('editorial-concierge');
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'model',
      text: `Welcome to the TripMind Editorial Intelligence Salon. I am your Editorial Concierge for ${currentTrip.destination}. You can switch roles above for instant rapid facts (gemini-3.1-flash-lite), general curations (gemini-3.5-flash), or complex spatial architecture (gemini-3.1-pro-preview). How may I assist your itinerary today?`,
      modelUsed: 'gemini-3.5-flash',
      roleUsed: 'editorial-concierge',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const rolesConfig = {
    'fast-scout': {
      title: 'Rapid Scout',
      model: 'gemini-3.1-flash-lite',
      desc: 'Instant answers & quick facts (Fast tasks)',
      icon: Zap,
      badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-200',
    },
    'editorial-concierge': {
      title: 'Editorial Concierge',
      model: 'gemini-3.5-flash',
      desc: 'Refined curation & local tips (General tasks)',
      icon: Compass,
      badgeColor: 'bg-[#0d9488]/10 text-[#0d9488] border-[#0d9488]/20',
    },
    'master-architect': {
      title: 'Master Architect',
      model: 'gemini-3.1-pro-preview',
      desc: 'Deep spatial planning & pacing (Complex tasks)',
      icon: BrainCircuit,
      badgeColor: 'bg-purple-500/10 text-purple-700 border-purple-200',
    },
  };

  const currentRoleConfig = rolesConfig[selectedRole];

  const quickPrompts = [
    `Recommend 3 hidden artisan cafes in ${currentTrip.destination}`,
    'What seasonal events or festivals are happening right now?',
    'How should I rebalance the walking distance for Day 2?',
    'What is the cultural etiquette for private tea houses and temples here?',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, text: m.text })),
          model: currentRoleConfig.model,
          role: selectedRole,
          useSearchGrounding,
          destination: currentTrip.destination,
        }),
      });

      if (!response.ok) throw new Error('Chat failed');

      const data = await response.json();
      const modelMessage: Message = {
        id: `mod-${Date.now()}`,
        role: 'model',
        text: data.text,
        modelUsed: data.modelUsed,
        roleUsed: data.roleUsed,
        groundingMetadata: data.groundingMetadata,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err: any) {
      console.warn('Chat request notice:', err?.message);
      setMessages((prev) => [
        ...prev,
        {
          id: `mod-err-${Date.now()}`,
          role: 'model',
          text: `Apologies, I encountered a brief network interruption. Please ask your question again.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'model',
        text: `Conversation history refreshed. Ask me anything about ${currentTrip.destination}.`,
        modelUsed: currentRoleConfig.model,
        roleUsed: selectedRole,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl h-[88vh] bg-white rounded-3xl overflow-hidden border border-[#e2e8f0] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title and Close */}
        <div className="p-4 sm:p-5 border-b border-[#e2e8f0] bg-[#faf9f6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0f172a] text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial font-bold text-base text-[#0f172a]">
                  TripMind Gemini Intelligence
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-white text-[#0f172a] border-[#e2e8f0]">
                  Multi-Turn Chat
                </span>
              </div>
              <p className="text-[11px] text-[#64748b]">
                Specialized role architecture with Google Search Grounding
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearHistory}
              title="Clear conversation history"
              className="p-2 rounded-xl text-[#94a3b8] hover:text-[#0f172a] hover:bg-white transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[#e2e8f0] text-[#64748b] hover:text-[#0f172a] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Roles & Models Selection Bar */}
        <div className="px-4 py-2.5 bg-white border-b border-[#f1f5f9] flex flex-wrap items-center justify-between gap-3">
          {/* Role Segmented Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-[#faf9f6] rounded-xl border border-[#e2e8f0]">
            {(
              [
                'fast-scout',
                'editorial-concierge',
                'master-architect',
              ] as const
            ).map((roleKey) => {
              const cfg = rolesConfig[roleKey];
              const isSelected = selectedRole === roleKey;
              const Icon = cfg.icon;
              return (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => setSelectedRole(roleKey)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0f172a] text-white shadow-xs'
                      : 'text-[#64748b] hover:text-[#0f172a] hover:bg-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cfg.title}</span>
                  <span className="text-[10px] opacity-75 hidden md:inline">({cfg.model})</span>
                </button>
              );
            })}
          </div>

          {/* Google Search Grounding Switcher */}
          <button
            type="button"
            onClick={() => setUseSearchGrounding(!useSearchGrounding)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              useSearchGrounding
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-[#e2e8f0] text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Search Grounding</span>
            <span
              className={`w-2 h-2 rounded-full ${
                useSearchGrounding ? 'bg-blue-600 animate-pulse' : 'bg-slate-300'
              }`}
            />
          </button>
        </div>

        {/* Scrollable Chat Thread */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4 bg-[#faf9f6]/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.role === 'user'
                    ? 'bg-[#0f172a] text-white'
                    : 'bg-white border border-[#e2e8f0] text-[#0d9488] shadow-xs'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] sm:max-w-[75%] space-y-1.5`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-[#0f172a] text-white rounded-tr-xs shadow-xs'
                      : 'bg-white border border-[#e2e8f0] text-[#1a1c1a] rounded-tl-xs shadow-xs'
                  }`}
                >
                  {msg.text}

                  {/* Grounding Citations Chips if Google Search was used */}
                  {msg.groundingMetadata?.groundingChunks &&
                    msg.groundingMetadata.groundingChunks.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#f1f5f9] text-[11px]">
                        <span className="font-semibold text-[#64748b] flex items-center gap-1 mb-1.5">
                          <Globe className="w-3 h-3 text-blue-500" />
                          <span>Google Search Grounding Sources:</span>
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.groundingMetadata.groundingChunks.map((chunk, cIdx) => {
                            if (!chunk.web?.title) return null;
                            return (
                              <a
                                key={cIdx}
                                href={chunk.web.uri || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#faf9f6] border border-[#e2e8f0] text-[#0f172a] hover:text-[#0d9488] hover:border-[#cbd5e1] text-[10px] transition-colors"
                              >
                                <span className="truncate max-w-[160px]">{chunk.web.title}</span>
                                <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-60" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                </div>

                {/* Message Meta Info */}
                <div
                  className={`flex items-center gap-2 text-[10px] text-[#94a3b8] px-1 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.modelUsed && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{msg.modelUsed}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white border border-[#e2e8f0] flex items-center justify-center text-[#0d9488] shadow-xs">
                <Loader2 className="w-4 h-4 animate-spin text-[#ff6448]" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white border border-[#e2e8f0] text-xs text-[#64748b] flex items-center gap-2 shadow-xs">
                <span>{currentRoleConfig.title} is synthesizing with {currentRoleConfig.model}...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Suggestions */}
        <div className="p-2.5 border-t border-[#f1f5f9] bg-white flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-semibold text-[#94a3b8] shrink-0 mr-1">
            Try:
          </span>
          {quickPrompts.map((q, qIdx) => (
            <button
              key={qIdx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSend(q)}
              className="px-3 py-1 rounded-full border border-[#e2e8f0] bg-[#faf9f6] text-[11px] text-[#45464d] hover:border-[#cbd5e1] hover:text-[#0f172a] hover:bg-white transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Input Footer */}
        <div className="p-3.5 sm:p-4 border-t border-[#e2e8f0] bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              placeholder={`Ask ${currentRoleConfig.title} about ${currentTrip.destination}...`}
              className="flex-1 px-4 py-3 rounded-2xl border border-[#e2e8f0] bg-[#faf9f6] text-xs sm:text-sm text-[#0f172a] focus:outline-none focus:border-[#0f172a] transition-all disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-4 py-3 rounded-2xl bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
