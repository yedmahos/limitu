import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Mascot from '../components/Mascot';

const ease = [0.25, 1, 0.5, 1];

 

function generateReply(text, ctx) {
  const q = text.toLowerCase();
  const spentPct = ctx.dailyLimit > 0 ? Math.round((ctx.spentToday / ctx.dailyLimit) * 100) : 0;
  const remaining = Math.max(ctx.dailyLimit - ctx.spentToday, 0);

  if (q.includes('overspend') || q.includes('risk')) {
    if (spentPct >= 90) return `You are at ${spentPct}% of your daily limit. Risk is high. Keep the rest of today essential-only.`;
    if (spentPct >= 65) return `You are at ${spentPct}% of your daily limit. Risk is medium. One controlled expense is okay.`;
    return `You are at ${spentPct}% of your daily limit. Risk is low right now.`;
  }

  if (q.includes('save') || q.includes('tip')) {
    return 'Try the 24-hour rule for non-essential buys. Add it to a list first, then re-check tomorrow.';
  }

  if (q.includes('daily limit') || q.includes('explain')) {
    return 'Daily limit is your safe spend amount for today so you can finish the month without running out.';
  }

  if (q.includes('summarize') || q.includes('summary')) {
    return `Today you spent ₹${ctx.spentToday}. Your limit is ₹${ctx.dailyLimit}. You have about ₹${remaining} left for the day.`;
  }

  return `Your current stats: limit ₹${ctx.dailyLimit}, spent ₹${ctx.spentToday}, days left ${ctx.daysLeft}. Ask me for risk, saving tips, or action plan.`;
}

export default function LimAI() {
  const app = useApp();
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [isVoiceInput, setIsVoiceInput] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'lim',
      text: 'Hello! I am LIM AI. I can help with spending decisions, budget clarity, and daily finance actions.',
      time: '10:25',
    },
  ]);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const endRef = useRef(null);
  const nextIdRef = useRef(2);

  const dailyLimit = Number.isFinite(app?.dailyLimit) ? app.dailyLimit : 400;
  const spentToday = Number.isFinite(app?.spentToday) ? app.spentToday : 120;
  const daysLeft = Number.isFinite(app?.daysLeft) ? app.daysLeft : 14;

  const canRecognize = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (!canRecognize) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = 'en-IN';
    rec.interimResults = true;
    rec.continuous = false;

    rec.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript.trim());
      setIsVoiceInput(true);
    };

    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;

    return () => {
      recognitionRef.current = null;
    };
  }, [canRecognize]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (canSpeak) window.speechSynthesis.cancel();
  }, [canSpeak]);

  const nowTime = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });

  const speakReply = (text) => {
    if (!voiceEnabled || !canSpeak) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);

    // Pick the most natural-sounding voice available
    const voices = window.speechSynthesis.getVoices();

    // Prefer premium / neural voices first (these sound much more human)
    const premium = voices.filter(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Enhanced') || v.name.includes('Premium') || v.name.includes('Neural'))
    );

    const preferred = [
      'Samantha',              // macOS Siri default
      'Karen',                 // macOS high-quality
      'Microsoft Jenny',       // Windows 11 neural voice
      'Microsoft Aria',        // Windows 11 neural voice  
      'Microsoft Zira',        // Windows fallback
      'Google US English',
    ];

    let chosen = premium[0] || null;
    if (!chosen) {
      for (const name of preferred) {
        chosen = voices.find((v) => v.name.includes(name));
        if (chosen) break;
      }
    }
    if (!chosen) chosen = voices.find((v) => v.lang.startsWith('en'));
    if (chosen) u.voice = chosen;

    u.lang = chosen?.lang || 'en-US';
    u.rate = 0.95;   // Slightly slower = more natural pacing
    u.pitch = 1.0;   // Neutral pitch
    window.speechSynthesis.speak(u);
  };

  const sendMessage = (rawText) => {
    const text = rawText.trim();
    if (!text || typing) return;

    const shouldSpeak = isVoiceInput;
    setIsVoiceInput(false);

    setMessages((prev) => [
      ...prev,
      { id: nextIdRef.current, from: 'user', text, time: nowTime() },
    ]);
    nextIdRef.current += 1;
    setInput('');
    setTyping(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const reply = generateReply(text, { dailyLimit, spentToday, daysLeft });
      setMessages((prev) => [
        ...prev,
        { id: nextIdRef.current, from: 'lim', text: reply, time: nowTime() },
      ]);
      nextIdRef.current += 1;
      setTyping(false);
      if (shouldSpeak) speakReply(reply);
    }, 600);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const toggleListening = () => {
    if (!canRecognize || !recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-ink pt-28 pb-8 px-4 md:px-8 grain relative overflow-hidden flex flex-col items-center selection:bg-lime selection:text-ink font-mono">
      {/* Dynamic Ambient Backgrounds */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
           className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-lime/[0.04] blur-[150px]"
           animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
           transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
           className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] rounded-full bg-bone/[0.02] blur-[120px]"
           animate={{ scale: [1, 1.1, 1], y: [0, -40, 0] }}
           transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      <div className="max-w-3xl w-full flex-1 flex flex-col relative z-10">
        
        {/* Chat Messages rounded spacing */}
        <div className="flex-1 w-full flex flex-col space-y-8 md:space-y-10 pb-40 pt-10 md:pt-16">
            
            {/* Welcome Header & Quick Actions for empty state */}
            {messages.length <= 2 && (
                <div className="flex flex-col w-full px-2 mb-2">
                    <div className="mb-10 md:mb-12">
                        <h1 className="font-display font-black text-[36px] md:text-[44px] text-bone tracking-widest uppercase leading-none mb-3">LIM AI</h1>
                        <p className="font-mono text-[14px] md:text-[16px] text-lime/90 font-medium">Your personal financial mentor</p>
                    </div>

                </div>
            )}

            <AnimatePresence initial={false}>
                {messages.map((m) => (
                <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.5, ease }}
                    className={`flex px-2 md:px-0 ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div className={`flex flex-col group max-w-[90%] md:max-w-[75%] ${m.from === 'user' ? 'items-end' : 'items-start'}`}>
                        {m.from === 'user' ? (
                            <div className="px-5 py-4 lg:px-6 lg:py-5 rounded-[24px] rounded-br-[8px] bg-lime/[0.06] border border-lime/20 backdrop-blur-md shadow-[0_4px_24px_rgba(200,241,53,0.04)]">
                                <p className="font-mono text-[13px] md:text-[14px] text-bone/90 leading-[1.6] whitespace-pre-wrap tracking-wide">{m.text}</p>
                            </div>
                        ) : (
                            <div className="flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-full bg-lime/[0.08] border border-lime/30 flex items-center justify-center shrink-0 mt-1 shadow-[0_0_12px_rgba(200,241,53,0.05)]">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-lime/80">
                                        <circle cx="12" cy="8" r="3.5" />
                                        <path d="M5.5 19.5c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div className="px-5 py-4 lg:px-6 lg:py-5 rounded-[24px] rounded-bl-[8px] bg-[#141516]/90 border border-white/[0.05] backdrop-blur-md shadow-sm">
                                    <p className="font-mono text-[13px] md:text-[14px] text-bone/90 leading-[1.6] whitespace-pre-wrap tracking-wide">{m.text}</p>
                                </div>
                            </div>
                        )}
                        <span className="font-mono text-[9px] text-bone/20 mt-2 mx-2 opacity-0 group-hover:opacity-100 transition-opacity">{m.time}</span>
                    </div>
                </motion.div>
                ))}
            </AnimatePresence>

            {/* Minimal Typing Indicator */}
            {typing && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="flex justify-start px-2 md:px-0"
                >
                    <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-lime/[0.08] border border-lime/30 flex items-center justify-center shrink-0 mt-1 shadow-[0_0_12px_rgba(200,241,53,0.05)]">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-lime/80">
                                <circle cx="12" cy="8" r="3.5" />
                                <path d="M5.5 19.5c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="bg-[#141516]/90 backdrop-blur-md px-6 py-4 lg:py-5 rounded-[24px] rounded-bl-[8px] flex items-center gap-2.5 border border-white/[0.05] shadow-sm">
                            {[0, 1, 2].map((i) => (
                                <motion.span
                                    key={i}
                                    className="w-1.5 h-1.5 rounded-full bg-lime/60 shadow-[0_0_5px_rgba(200,241,53,0.5)]"
                                    animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
                                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            <div ref={endRef} className="h-10" />
        </div>
        
      </div>

      {/* Floating Input Pill */}
      <div className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl z-40">
        
        {/* Soft backdrop fade to ensure text behind input is readable */}
        <div className="absolute inset-x-[-20%] bottom-[-50px] h-[200px] bg-gradient-to-t from-ink via-ink/90 to-transparent pointer-events-none -z-10 blur-xl" />

        <form onSubmit={onSubmit} className="relative group">
            
            {/* Outline Glow Effect */}
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-r from-lime/10 via-white/5 to-white/10 blur-md opacity-30 group-focus-within:opacity-100 group-focus-within:from-lime/30 transition-all duration-700" />
            
            <div className="relative flex items-center bg-[#131315]/80 backdrop-blur-2xl border border-white/[0.08] group-focus-within:border-lime/30 group-focus-within:bg-[#1A1A1D]/90 transition-all duration-500 rounded-[32px] overflow-hidden shadow-2xl">
                
                <AnimatePresence>
                    {listening && (
                        <motion.div 
                            initial={{ opacity: 0, width: 0 }} 
                            animate={{ opacity: 1, width: 'auto' }} 
                            exit={{ opacity: 0, width: 0 }}
                            className="flex items-center gap-1 pl-5 h-full overflow-hidden shrink-0"
                        >
                            <div className="w-2 h-2 rounded-full bg-rust animate-pulse mr-2" />
                            {Array.from({ length: 4 }).map((_, i) => (
                            <motion.span
                                key={i}
                                className="w-[3px] rounded-full bg-lime/80"
                                animate={{ height: [4, 12 + (i % 2) * 6, 4] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                            />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <input
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        setIsVoiceInput(false);
                    }}
                    placeholder={listening ? "Listening..." : "Message Lim..."}
                    className={`w-full bg-transparent py-4 md:py-5 text-[15px] text-bone placeholder:text-bone/30 outline-none transition-all ${listening ? 'pl-4 opacity-70' : 'pl-6'} pr-28`}
                    disabled={listening}
                />
                
                <div className="absolute right-2 flex items-center gap-1.5 p-1">
                   <button
                        type="button"
                        onClick={toggleListening}
                        disabled={!canRecognize}
                        className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            listening 
                            ? 'bg-rust/20 text-rust hover:bg-rust/30' 
                            : 'text-bone/40 hover:bg-white/5 hover:text-bone'
                        } disabled:opacity-20 disabled:cursor-not-allowed`}
                   >
                        {listening ? (
                             <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
                        ) : (
                            <svg className="w-4 h-4 md:w-4.5 md:h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        )}
                   </button>
                   <button
                        type="submit"
                        disabled={!input.trim() || typing || listening}
                        className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            input.trim() && !typing && !listening
                            ? 'bg-lime text-ink shadow-[0_0_20px_rgba(200,241,53,0.3)] hover:scale-105 active:scale-95'
                            : 'bg-white/5 text-bone/30 cursor-not-allowed'
                        }`}
                   >
                       <svg className="w-4 h-4 md:w-4.5 md:h-4.5 translate-x-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                   </button>
                </div>
            </div>
        </form>
        {!canRecognize && (
            <p className="font-mono text-[9px] text-rust/60 mt-3 text-center tracking-widest uppercase">Voice input unavailable</p>
        )}
      </div>

    </div>
  );
}
