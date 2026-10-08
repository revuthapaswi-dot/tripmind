import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Send, 
  Radio, 
  AlertCircle,
  MessageSquare,
  Bot,
  Play,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { Trip } from '../types';

interface VoiceGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrip: Trip;
}

export const VoiceGuideModal: React.FC<VoiceGuideModalProps> = ({
  isOpen,
  onClose,
  currentTrip,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isCuratorSpeaking, setIsCuratorSpeaking] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<Array<{ sender: 'user' | 'curator'; text: string }>>([
    {
      sender: 'curator',
      text: `Greetings. I am your personal curator for ${currentTrip.destination}. Ask me about quiet morning walks, architectural secrets, kissaten culture, or bespoke reservations.`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [statusMessage, setStatusMessage] = useState('Connecting to Gemini 3.8 Live...');

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextScheduledTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const micStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  // Suggested voice questions
  const samplePrompts = [
    `What are the most tranquil spots in ${currentTrip.destination} at dawn?`,
    'Tell me about the architectural history of this region.',
    'Where can I find an authentic, unhurried kissaten or local espresso bar?',
    'How should I pack for the current season here?',
  ];

  // Initialize or resume AudioContext safely
  const ensureAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  // Stop all active playing audio chunks (for interruptions)
  const stopAllAudio = () => {
    for (const source of activeSourcesRef.current) {
      try {
        source.stop();
        source.disconnect();
      } catch (e) {}
    }
    activeSourcesRef.current = [];
    if (audioContextRef.current) {
      nextScheduledTimeRef.current = audioContextRef.current.currentTime;
    }
    setIsCuratorSpeaking(false);
  };

  // Helper to play 24kHz raw PCM chunks from Gemini Live with precise scheduling queue
  const playAudioChunk = (base64Audio: string) => {
    try {
      const ctx = ensureAudioContext();
      setIsCuratorSpeaking(true);

      // Reset speaking indicator when chunks finish
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        setIsCuratorSpeaking(false);
      }, 1200);

      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const int16View = new Int16Array(bytes.buffer);
      const float32Data = new Float32Array(int16View.length);
      for (let i = 0; i < int16View.length; i++) {
        float32Data[i] = int16View[i] / 32768.0;
      }

      const audioBuffer = ctx.createBuffer(1, float32Data.length, 24000);
      audioBuffer.copyToChannel(float32Data, 0);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      // Critical fix: schedule chunks sequentially so they don't overlap or stutter
      const currentTime = ctx.currentTime;
      if (nextScheduledTimeRef.current < currentTime) {
        nextScheduledTimeRef.current = currentTime;
      }

      source.start(nextScheduledTimeRef.current);
      nextScheduledTimeRef.current += audioBuffer.duration;
      activeSourcesRef.current.push(source);

      source.onended = () => {
        const idx = activeSourcesRef.current.indexOf(source);
        if (idx !== -1) activeSourcesRef.current.splice(idx, 1);
        if (activeSourcesRef.current.length === 0) {
          setIsCuratorSpeaking(false);
        }
      };
    } catch (err: any) {
      console.warn('Audio playback notice:', err?.message);
    }
  };

  // Play synthesized speech for a specific message (TTS fallback & repeat)
  const speakMessage = async (text: string) => {
    ensureAudioContext();
    stopAllAudio();
    setIsCuratorSpeaking(true);

    try {
      setStatusMessage('Synthesizing curator voice...');
      const res = await fetch('/api/synthesize-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceName: 'Zephyr' }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audio) {
          const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
          audio.onended = () => {
            setIsCuratorSpeaking(false);
            setStatusMessage('Curator listening (Gemini 3.8 Live)');
          };
          audio.onerror = () => {
            setIsCuratorSpeaking(false);
          };
          await audio.play();
          setStatusMessage('Playing Curator audio...');
          return;
        }
      }

      // Native browser speech synthesis fallback
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.onend = () => {
          setIsCuratorSpeaking(false);
          setStatusMessage('Curator listening (Ready)');
        };
        utterance.onerror = () => {
          setIsCuratorSpeaking(false);
        };
        window.speechSynthesis.speak(utterance);
        setStatusMessage('Playing curator narration...');
      } else {
        setIsCuratorSpeaking(false);
      }
    } catch (e: any) {
      console.warn('TTS playback notice:', e?.message);
      setIsCuratorSpeaking(false);
    }
  };

  // Convert Float32 16kHz microphone stream to Base64 PCM
  const pcmToBase64 = (float32Array: Float32Array): string => {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    const bytes = new Uint8Array(int16Array.buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Connect WebSocket when modal opens
  useEffect(() => {
    if (!isOpen) return;

    ensureAudioContext();
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/live`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setStatusMessage('Connected to Gemini 3.8 Live (Zephyr Voice)');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.audio) {
          playAudioChunk(data.audio);
        }
        if (data.text) {
          setTranscript((prev) => [...prev, { sender: 'curator', text: data.text }]);
          // Auto speak text if no binary audio was provided
          if (!data.audio) {
            speakMessage(data.text);
          }
        }
        if (data.interrupted) {
          stopAllAudio();
          setStatusMessage('Curator listening (Interrupted)');
        }
        if (data.error) {
          setStatusMessage(data.error);
        }
      } catch (e: any) {
        console.warn('Live WS message notice:', e?.message);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setStatusMessage('Voice session ended. Tap to reconnect.');
    };

    ws.onerror = () => {
      setIsConnected(false);
      setStatusMessage('Live API connection notice. Tap to reconnect.');
    };

    return () => {
      stopAllAudio();
      stopMicrophone();
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [isOpen]);

  // Start microphone recording safely
  const startMicrophone = async () => {
    setMicError(null);
    ensureAudioContext();

    // Start Web Speech Recognition if supported
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      try {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.onresult = (event: any) => {
          const lastResult = event.results[event.results.length - 1];
          if (lastResult && lastResult[0]?.transcript) {
            const recognized = lastResult[0].transcript.trim();
            if (recognized) {
              handleSendText(recognized);
            }
          }
        };
        recognition.onerror = () => {};
        recognition.start();
        recognitionRef.current = recognition;
      } catch (recErr) {}
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });
      micStreamRef.current = stream;

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        const channelData = e.inputBuffer.getChannelData(0);
        const base64Pcm = pcmToBase64(channelData);
        wsRef.current.send(JSON.stringify({ audio: base64Pcm }));
      };

      const muteGain = inputCtx.createGain();
      muteGain.gain.value = 0;
      source.connect(processor);
      processor.connect(muteGain);
      muteGain.connect(inputCtx.destination);

      setIsMicActive(true);
      setStatusMessage('Microphone streaming (Speak freely)');
    } catch (err: any) {
      console.warn('Microphone stream notice:', err?.message);
      setIsMicActive(true);
      setStatusMessage('Voice recognition active');
    }
  };

  const stopMicrophone = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
      } catch (e) {}
      processorRef.current = null;
    }
    setIsMicActive(false);
    setStatusMessage('Microphone paused');
  };

  const toggleMic = () => {
    ensureAudioContext();
    if (isMicActive) {
      stopMicrophone();
    } else {
      startMicrophone();
    }
  };

  const handleSendText = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    ensureAudioContext();
    stopAllAudio();

    setTranscript((prev) => [...prev, { sender: 'user', text }]);
    setInputText('');

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text }));
      setStatusMessage('Curator synthesizing live voice response...');
    } else {
      // Reconnect and send
      setStatusMessage('Reconnecting to voice session...');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl overflow-hidden border border-[#e2e8f0] shadow-2xl flex flex-col"
        onClick={(e) => {
          e.stopPropagation();
          ensureAudioContext();
        }}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e2e8f0] flex items-center justify-between bg-[#faf9f6]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs transition-colors ${
              isCuratorSpeaking ? 'bg-[#ff6448] text-white' : 'bg-[#0d9488] text-white'
            }`}>
              <Radio className={`w-5 h-5 ${isCuratorSpeaking ? 'animate-bounce' : 'animate-pulse'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold tracking-widest uppercase text-[#0d9488]">
                  Gemini 3.8 Live Audio
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <h2 className="font-editorial text-lg sm:text-xl font-bold text-[#0f172a] mt-0.5">
                Curator Live Voice Guide
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => speakMessage("Hello! I am your personal travel curator. The audio is working perfectly.")}
              title="Test audio output"
              className="px-2.5 py-1.5 rounded-xl border border-[#e2e8f0] bg-white text-xs font-semibold text-[#0f172a] hover:bg-[#f8fafc] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#0d9488]" />
              <span className="hidden sm:inline">Test Audio</span>
            </button>
            <button
              onClick={() => {
                stopAllAudio();
                stopMicrophone();
                onClose();
              }}
              className="p-2 rounded-full hover:bg-[#e2e8f0] text-[#64748b] hover:text-[#0f172a] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Audio Visualizer Banner */}
        <div className="p-4 bg-[#0f172a] text-white flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            {/* Animated Waveform Bars */}
            <div className="flex items-center gap-1 h-6">
              {[40, 75, 30, 95, 60, 85, 50, 100, 45, 80].map((height, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isCuratorSpeaking 
                      ? 'bg-[#ff6448]' 
                      : isMicActive 
                      ? 'bg-[#0d9488]' 
                      : 'bg-slate-600'
                  }`}
                  style={{
                    height: isCuratorSpeaking ? `${height}%` : isMicActive ? `${height * 0.7}%` : '20%',
                    animation: (isCuratorSpeaking || isMicActive) ? `pulse 0.4s infinite ${i * 0.08}s` : 'none',
                  }}
                />
              ))}
            </div>
            <div>
              <span className="text-xs text-white/90 font-medium block">
                {statusMessage}
              </span>
              <span className="text-[10px] text-white/60">
                {isCuratorSpeaking ? '🔊 Speaking live...' : isMicActive ? '🎙️ Listening to you...' : 'Ready'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isCuratorSpeaking && (
              <button
                onClick={stopAllAudio}
                title="Mute current speech"
                className="px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1 cursor-pointer"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>Mute</span>
              </button>
            )}

            <button
              onClick={toggleMic}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isMicActive
                  ? 'bg-[#ff6448] text-white shadow-md animate-pulse'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {isMicActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
              <span>{isMicActive ? 'Stop Mic' : 'Start Mic'}</span>
            </button>
          </div>
        </div>

        {/* Microphone Notice if restricted */}
        {micError && (
          <div className="p-3 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs flex items-center gap-2 px-6">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <div className="flex-1">{micError}</div>
          </div>
        )}

        {/* Live Conversation Transcript */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-4 bg-[#faf9f6]/50">
          {transcript.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-[#0f172a] text-white'
                    : 'bg-[#0d9488] text-white'
                }`}
              >
                {msg.sender === 'user' ? 'You' : <Bot className="w-4 h-4" />}
              </div>

              <div className="max-w-[80%] space-y-1">
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#0f172a] text-white rounded-tr-xs'
                      : 'bg-white border border-[#e2e8f0] text-[#1a1c1a] shadow-xs rounded-tl-xs'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.sender === 'curator' && (
                  <button
                    onClick={() => speakMessage(msg.text)}
                    className="text-[10px] text-[#64748b] hover:text-[#0d9488] flex items-center gap-1 ml-1 cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Play voice audio</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Voice Prompt Suggestions */}
        <div className="p-3 border-t border-[#f1f5f9] bg-white flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-semibold text-[#94a3b8] shrink-0 mr-1">
            Voice queries:
          </span>
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendText(p)}
              className="px-3 py-1 rounded-full border border-[#e2e8f0] bg-[#faf9f6] text-[11px] text-[#45464d] hover:border-[#cbd5e1] hover:text-[#0f172a] hover:bg-white transition-colors cursor-pointer shrink-0"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Message Input Bar */}
        <div className="p-4 border-t border-[#e2e8f0] bg-white flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
            placeholder="Type a question or speak with the microphone..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-xs sm:text-sm text-[#0f172a] focus:outline-none focus:border-[#0d9488] bg-[#faf9f6]"
          />
          <button
            onClick={() => handleSendText()}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white transition-colors cursor-pointer disabled:opacity-30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
