import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Mascot from '../components/Mascot';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 1, 0.5, 1] } }),
};

export default function Dashboard() {
  const {
    profile, dailyLimit, spentToday, remainingBalance,
    daysLeft, dayOfMonth, totalDays, avgDailySpend, runOutDate, transactions,
  } = useApp();

  const remainingDaily = Math.max(0, dailyLimit - spentToday);
  const progressPct = dailyLimit > 0 ? Math.min(100, (spentToday / dailyLimit) * 100) : 0;
  const monthProgressPct = (dayOfMonth / totalDays) * 100;

  const runOutStr = runOutDate
    ? runOutDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    : '\u2014';

  const mascotExpression = progressPct > 90 ? 'alert' : progressPct > 60 ? 'thinking' : 'happy';

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 grain">
      <motion.div initial="hidden" animate="visible" className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div variants={fadeUp} custom={0} className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display font-extrabold text-[clamp(1.6rem,4vw,2.2rem)] text-bone tracking-tight">Dashboard</h1>
            <p className="font-mono text-[11px] text-bone/25 tracking-wider mt-1">
              Day {dayOfMonth} of {totalDays} &middot; {daysLeft} days remaining
            </p>
          </div>
          <Mascot size={44} expression={mascotExpression} />
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {/* Today's Limit */}
          <motion.div variants={fadeUp} custom={1} className="card p-6">
            <span className="font-mono text-[10px] tracking-[0.25em] text-bone/20 uppercase block mb-4">Today's Limit</span>
            <div className="font-display font-extrabold text-[2.4rem] text-bone leading-none mb-4">
              ₹{dailyLimit.toLocaleString()}
            </div>
            <div className="flex items-center gap-4">
              <div>
                <span className="font-mono text-[10px] text-bone/20 block mb-0.5">Spent</span>
                <span className="font-display font-bold text-[17px] text-rust/80">₹{spentToday.toLocaleString()}</span>
              </div>
              <div className="w-px h-8 bg-bone/[0.06]" />
              <div>
                <span className="font-mono text-[10px] text-bone/20 block mb-0.5">Remaining</span>
                <span className="font-display font-bold text-[17px] text-lime/80">₹{remainingDaily.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>

          {/* Monthly Balance */}
          <motion.div variants={fadeUp} custom={2} className="card p-6">
            <span className="font-mono text-[10px] tracking-[0.25em] text-bone/20 uppercase block mb-4">Monthly Balance</span>
            <div className="font-display font-extrabold text-[2.4rem] text-bone leading-none mb-4">
              ₹{remainingBalance.toLocaleString()}
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="font-mono text-[10px] text-bone/20">{daysLeft} days left</span>
                <span className="font-mono text-[10px] text-bone/20">{Math.round(monthProgressPct)}%</span>
              </div>
              <div className="h-1 bg-bone/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${monthProgressPct}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-sage/50 rounded-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Run-Out Prediction */}
          <motion.div variants={fadeUp} custom={3} className="card p-6">
            <span className="font-mono text-[10px] tracking-[0.25em] text-bone/20 uppercase block mb-4">Run-Out Date</span>
            <div className="font-display font-extrabold text-[2.4rem] text-bone leading-none mb-4">
              {runOutStr}
            </div>
            <p className="font-mono text-[11px] text-bone/25 leading-[1.8]">
              {avgDailySpend > dailyLimit
                ? "At current pace, you'll run out early. Consider reducing daily spending."
                : "You're on track to make it through the month. Keep it up!"
              }
            </p>
          </motion.div>
        </div>

        {/* Spending Progress */}
        <motion.div variants={fadeUp} custom={4} className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <span className="font-mono text-[10px] tracking-[0.25em] text-bone/20 uppercase">Today's Spending</span>
            <span className="font-mono text-[11px] text-bone/30">{Math.round(progressPct)}% used</span>
          </div>
          <div className="h-2 bg-bone/[0.06] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
              className={`h-full rounded-full ${
                progressPct > 90 ? 'bg-rust' : progressPct > 60 ? 'bg-gold' : 'bg-lime/80'
              }`}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-mono text-[10px] text-bone/15">₹0</span>
            <span className="font-mono text-[10px] text-bone/15">₹{dailyLimit.toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div variants={fadeUp} custom={5} className="card p-6">
          <span className="font-mono text-[10px] tracking-[0.25em] text-bone/20 uppercase block mb-5">Recent Activity</span>
          <div className="space-y-1">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-bone/[0.04] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-bone/[0.04] flex items-center justify-center">
                    <span className="text-lime/40 text-[12px] font-mono">₹</span>
                  </div>
                  <div>
                    <span className="font-mono text-[13px] text-bone/70 block">{tx.label}</span>
                    <span className="font-mono text-[10px] text-bone/20">
                      {new Date(tx.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <span className="font-display font-bold text-[14px] text-rust/70">-₹{tx.amount}</span>
              </div>
            ))}
            {transactions.length === 0 && (
              <p className="font-mono text-[11px] text-bone/20 py-6 text-center">No transactions yet today</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
