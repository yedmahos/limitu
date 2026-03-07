import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { evaluateSpend } from '../lib/engine';
import Mascot from '../components/Mascot';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 1, 0.5, 1] } }),
};

export default function Simulator() {
  const { dailyLimit, spentToday, remainingBalance, addSpend } = useApp();
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleSimulate = (e) => {
    e.preventDefault();
    const num = parseInt(amount, 10);
    if (!num || num <= 0) return;
    const res = evaluateSpend(num, dailyLimit, spentToday, remainingBalance);
    setResult(res);
    setConfirmed(false);
  };

  const handleConfirm = () => {
    if (result && result.status === 'allowed') {
      addSpend(parseInt(amount, 10));
      setConfirmed(true);
    } else if (result && result.status === 'partial' && result.allowedAmount > 0) {
      addSpend(result.allowedAmount);
      setConfirmed(true);
    }
  };

  const handleReset = () => {
    setAmount('');
    setResult(null);
    setConfirmed(false);
  };

  const statusConfig = {
    allowed: { bg: 'bg-lime/[0.06]', border: 'border-lime/[0.15]', text: 'text-lime', label: 'Allowed', mascot: 'happy' },
    partial: { bg: 'bg-gold/[0.06]', border: 'border-gold/[0.15]', text: 'text-gold', label: 'Partial', mascot: 'thinking' },
    blocked: { bg: 'bg-rust/[0.06]', border: 'border-rust/[0.15]', text: 'text-rust', label: 'Soft Block', mascot: 'alert' },
    invalid: { bg: 'bg-bone/[0.03]', border: 'border-bone/[0.06]', text: 'text-bone/40', label: 'Invalid', mascot: 'neutral' },
  };

  const config = result ? statusConfig[result.status] : null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 grain">
      <motion.div initial="hidden" animate="visible" className="max-w-2xl mx-auto">
        <motion.div variants={fadeUp} custom={0} className="mb-10">
          <h1 className="font-display font-extrabold text-[clamp(1.6rem,4vw,2.2rem)] text-bone tracking-tight">Spend Simulator</h1>
          <p className="font-mono text-[11px] text-bone/25 tracking-wider mt-1">Test a purchase before you make it</p>
        </motion.div>

        {/* Context Cards */}
        <motion.div variants={fadeUp} custom={1} className="grid grid-cols-3 gap-3 mb-6">
          <div className="card p-4 text-center">
            <span className="font-mono text-[9px] tracking-[0.2em] text-bone/20 uppercase block mb-1.5">Daily Limit</span>
            <span className="font-display font-bold text-[18px] text-lime/80">{'\u20B9'}{dailyLimit}</span>
          </div>
          <div className="card p-4 text-center">
            <span className="font-mono text-[9px] tracking-[0.2em] text-bone/20 uppercase block mb-1.5">Spent Today</span>
            <span className="font-display font-bold text-[18px] text-rust/70">{'\u20B9'}{spentToday}</span>
          </div>
          <div className="card p-4 text-center">
            <span className="font-mono text-[9px] tracking-[0.2em] text-bone/20 uppercase block mb-1.5">Remaining</span>
            <span className="font-display font-bold text-[18px] text-bone/70">{'\u20B9'}{Math.max(0, dailyLimit - spentToday)}</span>
          </div>
        </motion.div>

        {/* Simulator Input */}
        <motion.div variants={fadeUp} custom={2} className="card p-8 mb-5">
          <form onSubmit={handleSimulate} className="flex flex-col items-center gap-6">
            <div className="text-center">
              <Mascot size={48} expression={config?.mascot || 'neutral'} className="mx-auto mb-3" />
              <p className="font-mono text-[11px] text-bone/30">How much do you want to spend?</p>
            </div>

            <div className="relative w-full max-w-xs">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-bold text-[22px] text-bone/20">{'\u20B9'}</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setResult(null); setConfirmed(false); }}
                placeholder="0"
                min="1"
                className="w-full bg-bone/[0.03] border border-bone/[0.06] rounded-2xl pl-10 pr-4 py-5 font-display font-extrabold text-[2rem] text-bone text-center placeholder:text-bone/10 outline-none focus:border-lime/30 transition-all"
              />
            </div>

            <button type="submit" className="bg-lime text-ink font-display font-bold text-[13px] px-10 py-3.5 rounded-[14px] hover:shadow-[0_8px_32px_rgba(200,241,53,0.15)] transition-all cursor-pointer">
              Simulate Spend
            </button>
          </form>
        </motion.div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={result.status}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              className={`${config.bg} border ${config.border} rounded-2xl p-7`}
            >
              <div className="flex items-start gap-4">
                <div className={`font-display font-extrabold text-[1.8rem] ${config.text}`}>
                  {result.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`font-display font-bold text-[16px] ${config.text}`}>{config.label}</span>
                    <span className={`font-mono text-[9px] tracking-[0.2em] ${config.text} opacity-50 uppercase`}>{result.status}</span>
                  </div>
                  <p className="font-mono text-[12px] text-bone/45 leading-[1.8]">{result.message}</p>

                  {!confirmed && (result.status === 'allowed' || (result.status === 'partial' && result.allowedAmount > 0)) && (
                    <div className="flex gap-3 mt-5">
                      <button onClick={handleConfirm} className="bg-lime text-ink font-mono text-[11px] px-6 py-2.5 rounded-[10px] hover:shadow-[0_4px_16px_rgba(200,241,53,0.12)] transition-all cursor-pointer font-medium">
                        Confirm Spend
                      </button>
                      <button onClick={handleReset} className="border border-bone/[0.08] text-bone/35 font-mono text-[11px] px-6 py-2.5 rounded-[10px] hover:border-bone/15 transition-all cursor-pointer">
                        Cancel
                      </button>
                    </div>
                  )}

                  {confirmed && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-2">
                      <span className="text-lime/70">{'\u2713'}</span>
                      <span className="font-mono text-[11px] text-lime/50">Spend recorded successfully</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
