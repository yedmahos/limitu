import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { generateLimResponse } from '../lib/engine';
import Mascot from '../components/Mascot';

const suggestions = [
  'Why is my limit low today?',
  'Can I spend \u20B9200 now?',
  'When will my money run out?',
  "What's my habit score?",
  'Any saving tips?',
  'How does my weekend budget work?',
];

export default function LimAI() {
  const app = useApp();
  const [messages, setMessages] = useState([
    {
      id: 0, from: 'lim',
      text: `Hey ${app.profile.name}! I'm LIM, your spending assistant. Your daily limit is \u20B9${app.dailyLimit} today. Ask me anything about your finances!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const context = {
        dailyLimit: app.dailyLimit, spentToday: app.spentToday,
        remainingBalance: app.remainingBalance, daysLeft: app.daysLeft,
        avgDailySpend: app.avgDailySpend, habitScore: app.habitScore,
        weekendPref: app.profile.weekendPref,
      };
      const response = generateLimResponse(text, context);
      setMessages((prev) => [...prev, { id: Date.now() + 1, from: 'lim', text: response }]);
      setTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleSubmit = (e) => { e.preventDefault(); sendMessage(input); };

  return (
    <div className="min-h-[100dvh] pt-20 pb-4 px-3 md:pt-24 md:pb-8 md:px-8 grain relative overflow-hidden flex flex-col">
      {/* Background Orbs for Aesthetic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-lime/[0.04] blur-[150px]"
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-bone/[0.02] blur-[120px]"
          animate={{ scale: [1, 1.1, 1], x: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      <div className="max-w-3xl w-full mx-auto flex flex-col flex-1 relative z-10 h-[calc(100dvh-6rem)] md:h-[calc(100vh-8rem)] bg-ink/40 backdrop-blur-xl border border-bone/[0.04] rounded-[24px] md:rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">

        {/* Header - Glassmorphism Sticky */}
        <div className="flex items-center justify-between px-4 py-4 md:px-6 md:py-5 border-b border-bone/[0.06] bg-ink/60 backdrop-blur-md shrink-0">
          <div className="flex items-center">
            <div>
              <h1 className="font-display font-extrabold text-[18px] md:text-[22px] text-bone tracking-tight flex items-center gap-2">
                LIM AI
                {typing && <span className="inline-flex h-2 w-2 rounded-full bg-lime animate-pulse" />}
              </h1>
              <p className="font-mono text-[10px] md:text-[11px] text-lime/70 tracking-wider">Your personal financial mentor</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 md:space-y-6 scrollbar-hide">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 300 }}
                className={`flex w-full ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[90%] md:max-w-[80%] ${msg.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {msg.from === 'lim' && (
                    <div className="shrink-0 mt-1 drop-shadow-md">
                      <Mascot size={32} expression="neutral" />
                    </div>
                  )}

                  <div className={`px-4 py-3 md:px-5 md:py-4 shadow-lg ${msg.from === 'user'
                    ? 'bg-gradient-to-br from-lime/[0.15] to-lime/[0.05] border border-lime/[0.15] rounded-[24px] rounded-tr-[8px] backdrop-blur-md'
                    : 'bg-bone/[0.03] border border-bone/[0.08] rounded-[24px] rounded-tl-[8px] backdrop-blur-md'
                    }`}>
                    <p className={`text-[13px] md:text-[14px] leading-relaxed ${msg.from === 'user'
                      ? 'font-sans text-bone'
                      : 'font-mono text-bone/80'
                      }`}>
                      {msg.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {typing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start w-full"
            >
              <div className="flex gap-3 max-w-[85%]">
                <div className="shrink-0 mt-1 drop-shadow-md">
                  <Mascot size={32} expression="thinking" />
                </div>
                <div className="bg-bone/[0.03] border border-bone/[0.08] rounded-[24px] rounded-tl-[8px] px-5 py-4 md:px-6 md:py-5 backdrop-blur-md flex items-center justify-center shadow-lg">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -4, 0], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                        className="w-2 h-2 bg-lime rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} className="h-4" />
        </div>

        {/* Bottom Input Area */}
        <div className="p-3 md:p-6 bg-ink/40 backdrop-blur-md border-t border-bone/[0.04] shrink-0">
          {/* Suggestions */}
          <div className="flex overflow-x-auto pb-3 md:pb-4 gap-2 scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {suggestions.map((s) => (
              <motion.button
                key={s}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(200,241,53,0.08)', borderColor: 'rgba(200,241,53,0.25)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => sendMessage(s)}
                className="shrink-0 font-mono text-[11px] text-bone/50 bg-bone/[0.02] px-4 py-2 rounded-full border border-bone/[0.06] transition-all cursor-pointer whitespace-nowrap hover:text-lime/90"
              >
                {s}
              </motion.button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative flex items-center group mt-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask LIM anything..."
              className="w-full bg-bone/[0.03] border border-bone/[0.08] rounded-full pl-5 pr-[85px] py-3 md:pl-6 md:pr-[110px] md:py-4 font-mono text-[12px] md:text-[13px] text-bone placeholder:text-bone/30 outline-none focus:border-lime/40 focus:bg-bone/[0.05] transition-all shadow-inner group-hover:border-bone/[0.12]"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 md:right-2 md:top-2 md:bottom-2 md:px-6 bg-lime text-ink font-display font-bold text-[12px] md:text-[13px] rounded-full hover:bg-lime/90 hover:shadow-[0_0_20px_rgba(200,241,53,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 md:gap-2"
            >
              <span className="hidden sm:inline">Send</span>
              <svg className="w-4 h-4 md:transition-transform md:group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
