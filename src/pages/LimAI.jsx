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
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 grain">
      <div className="max-w-2xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <Mascot size={40} expression="happy" />
          <div>
            <h1 className="font-display font-bold text-[20px] text-bone tracking-tight">LIM AI</h1>
            <p className="font-mono text-[10px] text-lime/40 tracking-wider">Your financial assistant</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'items-start gap-2.5'}`}
              >
                {msg.from === 'lim' && <Mascot size={24} expression="neutral" className="shrink-0 mt-1" />}
                <div className={`max-w-[80%] px-4 py-3 ${
                  msg.from === 'user'
                    ? 'bg-lime/[0.06] border border-lime/[0.1] rounded-2xl rounded-tr-md'
                    : 'bg-bone/[0.04] border border-bone/[0.04] rounded-2xl rounded-tl-md'
                }`}>
                  <p className={`font-mono text-[12px] leading-[1.8] ${msg.from === 'user' ? 'text-lime/60' : 'text-bone/50'}`}>
                    {msg.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2.5">
              <Mascot size={24} expression="thinking" className="shrink-0 mt-1" />
              <div className="bg-bone/[0.04] border border-bone/[0.04] rounded-2xl rounded-tl-md px-4 py-3">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} className="w-1.5 h-1.5 bg-lime/40 rounded-full" />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {suggestions.map((s) => (
            <button key={s} onClick={() => sendMessage(s)} className="font-mono text-[10px] text-bone/30 bg-bone/[0.03] px-3 py-1.5 rounded-full border border-bone/[0.05] hover:border-lime/20 hover:text-lime/50 transition-all cursor-pointer truncate">
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2.5">
          <input
            type="text" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Ask LIM anything..."
            className="flex-1 bg-bone/[0.03] border border-bone/[0.06] rounded-[14px] px-4 py-3 font-mono text-[12px] text-bone placeholder:text-bone/20 outline-none focus:border-lime/30 transition-all"
          />
          <button type="submit" className="bg-lime text-ink font-display font-bold text-[12px] px-5 py-3 rounded-[14px] hover:shadow-[0_4px_16px_rgba(200,241,53,0.12)] transition-all cursor-pointer">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
