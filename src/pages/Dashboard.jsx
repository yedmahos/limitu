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
  const paceState = progressPct > 90 ? 'Risk Zone' : progressPct > 60 ? 'Watch Zone' : 'On Track';
  const gapFromLimit = Math.max(0, Math.round(avgDailySpend - dailyLimit));
  const bufferFromLimit = Math.max(0, Math.round(dailyLimit - avgDailySpend));

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 grain">
      <motion.div initial="hidden" animate="visible" className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div variants={fadeUp} custom={0} className="flex items-center justify-between mb-6 md:mb-10">
          <div>
            <h1 className="font-display font-extrabold text-[clamp(1.6rem,4vw,2.2rem)] text-bone tracking-tight">Dashboard</h1>
            <p className="font-mono text-[11px] text-bone/25 tracking-wider mt-1">
              Day {dayOfMonth} of {totalDays} &middot; {daysLeft} days remaining
            </p>
          </div>
          <Mascot size={44} expression={mascotExpression} />
        </motion.div>

        {/* --- MOBILE REDESIGN --- */}
        <div className="md:hidden space-y-4 mb-6">
          <motion.section variants={fadeUp} custom={1} className="card p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-bone/25 uppercase">Today Overview</p>
                <p className="font-display font-extrabold text-[2rem] leading-none mt-2">₹{dailyLimit.toLocaleString()}</p>
                <p className="font-mono text-[11px] text-bone/35 mt-1">Daily spend cap</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full border font-mono text-[9px] tracking-[0.14em] uppercase ${progressPct > 90 ? 'text-rust border-rust/40 bg-rust/10' : progressPct > 60 ? 'text-gold border-gold/40 bg-gold/10' : 'text-lime border-lime/40 bg-lime/10'}`}>
                {paceState}
              </span>
            </div>

            <div className="relative w-[150px] h-[150px] mx-auto mb-5 flex items-center justify-center">
              <svg width="150" height="150" viewBox="0 0 150 150" className="transform -rotate-90">
                <circle cx="75" cy="75" r="68" stroke="var(--color-bone)" strokeOpacity="0.04" strokeWidth="7" fill="none" />
                <motion.circle
                  cx="75" cy="75" r="68"
                  className={progressPct > 90 ? 'text-rust' : progressPct > 60 ? 'text-gold' : 'text-lime'}
                  stroke="currentColor"
                  strokeWidth="7"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 68}
                  initial={{ strokeDashoffset: 2 * Math.PI * 68 }}
                  animate={{ strokeDashoffset: (2 * Math.PI * 68) * Math.max(0, (1 - progressPct / 100)) }}
                  transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display font-extrabold text-[1.8rem] leading-none">₹{spentToday.toLocaleString()}</span>
                <span className="font-mono text-[10px] text-bone/35 mt-1">spent today</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono text-[11px] mb-2.5">
                <span className="text-bone/35">Progress</span>
                <span className={remainingDaily === 0 ? 'text-rust' : 'text-lime'}>₹{remainingDaily.toLocaleString()} left</span>
              </div>
              <div className="h-1.5 bg-bone/[0.04] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                  className={`h-full rounded-full ${progressPct > 90 ? 'bg-rust' : progressPct > 60 ? 'bg-gold' : 'bg-lime'}`}
                />
              </div>
            </div>
          </motion.section>

          <motion.section variants={fadeUp} custom={2} className="grid grid-cols-2 gap-2.5">
            <MobileMiniStat label="Balance" value={`₹${remainingBalance.toLocaleString()}`} />
            <MobileMiniStat label="Run-Out" value={runOutStr} tone={avgDailySpend > dailyLimit ? 'text-rust' : 'text-lime'} />
            <MobileMiniStat label="Days Left" value={`${daysLeft}`} />
            <MobileMiniStat label="Avg Daily" value={`₹${avgDailySpend.toLocaleString()}`} />
          </motion.section>

          <motion.section variants={fadeUp} custom={3} className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/25">Recent Activity</span>
              <span className="font-mono text-[10px] text-bone/30">{transactions.length} entries</span>
            </div>
            <div className="space-y-1">
              {transactions.slice(0, 4).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-bone/[0.04] last:border-0">
                  <div className="min-w-0">
                    <p className="font-mono text-[12px] text-bone/70 truncate">{tx.label}</p>
                    <p className="font-mono text-[10px] text-bone/20 mt-0.5">
                      {new Date(tx.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className="font-display font-bold text-[13px] text-rust/75">-₹{tx.amount}</span>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="font-mono text-[11px] text-bone/20 py-4 text-center">No transactions yet today</p>
              )}
            </div>
          </motion.section>
        </div>

        {/* Desktop Redesign */}
        <div className="hidden md:grid gap-4">
          <div className="grid grid-cols-12 gap-4">
            <motion.section variants={fadeUp} custom={1} className="col-span-12 lg:col-span-7 card p-6">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.25em] text-bone/20 uppercase mb-2">Today Overview</p>
                  <h2 className="font-display font-extrabold text-[2.3rem] leading-none tracking-tight text-bone">
                    ₹{dailyLimit.toLocaleString()}
                  </h2>
                  <p className="font-mono text-[11px] text-bone/30 mt-1">Daily spend limit</p>
                </div>
                <span className={`px-3 py-1 rounded-full border font-mono text-[10px] tracking-[0.15em] uppercase ${progressPct > 90 ? 'text-rust border-rust/40 bg-rust/10' : progressPct > 60 ? 'text-gold border-gold/40 bg-gold/10' : 'text-lime border-lime/40 bg-lime/10'}`}>
                  {paceState}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                <DesktopMetric label="Spent" value={`₹${spentToday.toLocaleString()}`} tone="text-rust/85" />
                <DesktopMetric label="Remaining" value={`₹${remainingDaily.toLocaleString()}`} tone="text-lime/85" />
                <DesktopMetric label="Avg Daily" value={`₹${avgDailySpend.toLocaleString()}`} tone="text-bone" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/25">Today's Consumption</span>
                  <span className="font-mono text-[11px] text-bone/40">{Math.round(progressPct)}%</span>
                </div>
                <div className="h-2 bg-bone/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
                    className={`h-full rounded-full ${progressPct > 90 ? 'bg-rust' : progressPct > 60 ? 'bg-gold' : 'bg-lime/80'}`}
                  />
                </div>
              </div>
            </motion.section>

            <motion.section variants={fadeUp} custom={2} className="col-span-12 lg:col-span-5 card p-6 space-y-4">
              <div>
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/20">Month Health</p>
                  <h3 className="font-display font-extrabold text-[2rem] leading-none mt-2">₹{remainingBalance.toLocaleString()}</h3>
                  <p className="font-mono text-[11px] text-bone/30 mt-1">Balance for remaining {daysLeft} days</p>
                </div>
              </div>

              <div className="rounded-xl border border-bone/[0.06] bg-bone/[0.015] p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/25">Month Progress</span>
                  <span className="font-mono text-[11px] text-bone/35">{Math.round(monthProgressPct)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-bone/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${monthProgressPct}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-sage/60"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-bone/[0.06] bg-bone/[0.015] p-4">
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/25 mb-2">Run-Out Forecast</p>
                <p className="font-display font-bold text-[1.35rem] leading-none">{runOutStr}</p>
                <p className="font-mono text-[11px] text-bone/35 mt-2 leading-relaxed">
                  {gapFromLimit > 0
                    ? `You are above the safe pace by ₹${gapFromLimit.toLocaleString()} per day.`
                    : `You have a safety buffer of ₹${bufferFromLimit.toLocaleString()} per day.`}
                </p>
              </div>
            </motion.section>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <motion.section variants={fadeUp} custom={3} className="col-span-12 lg:col-span-8 card p-6">
              <div className="flex items-center justify-between mb-5">
                <span className="font-mono text-[10px] tracking-[0.25em] text-bone/20 uppercase">Recent Activity</span>
                <span className="font-mono text-[10px] text-bone/30">{transactions.length} entries</span>
              </div>

              <div className="space-y-1">
                {transactions.slice(0, 6).map((tx) => (
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
            </motion.section>

            <motion.section variants={fadeUp} custom={4} className="col-span-12 lg:col-span-4 card p-6">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/20 mb-4">Discipline Notes</p>
              <div className="space-y-3">
                <InsightRow
                  label="Allowance"
                  value={`₹${profile.monthlyAllowance.toLocaleString()}`}
                />
                <InsightRow
                  label="Today Status"
                  value={progressPct > 90 ? 'Critical' : progressPct > 60 ? 'Moderate' : 'Healthy'}
                />
                <InsightRow
                  label="Suggested Cap"
                  value={`₹${Math.max(0, remainingBalance / Math.max(1, daysLeft)).toFixed(0)}`}
                />
              </div>

              <div className="mt-5 rounded-xl border border-bone/[0.06] bg-bone/[0.015] p-4">
                <p className="font-mono text-[10px] text-bone/25 uppercase tracking-[0.2em] mb-2">Guidance</p>
                <p className="font-mono text-[11px] text-bone/35 leading-relaxed">
                  {progressPct > 90
                    ? 'Avoid non-essential expenses for the rest of today to protect your monthly runway.'
                    : progressPct > 60
                      ? 'You are close to your threshold. Keep the next spend small and intentional.'
                      : 'Pace looks solid. Keep this rhythm to finish the month with surplus.'}
                </p>
              </div>
            </motion.section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DesktopMetric({ label, value, tone = 'text-bone' }) {
  return (
    <div className="rounded-xl border border-bone/[0.06] bg-bone/[0.015] p-4">
      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/25">{label}</p>
      <p className={`font-display font-bold text-[1.35rem] mt-2 leading-none ${tone}`}>{value}</p>
    </div>
  );
}

function MobileMiniStat({ label, value, tone = 'text-bone' }) {
  return (
    <div className="rounded-xl border border-bone/[0.08] bg-bone/[0.015] p-3.5">
      <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-bone/25">{label}</p>
      <p className={`font-display font-bold text-[1.05rem] mt-1.5 leading-none ${tone}`}>{value}</p>
    </div>
  );
}

function InsightRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-bone/[0.05] pb-2 last:border-0 last:pb-0">
      <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-bone/25">{label}</span>
      <span className="font-display font-bold text-[1rem] text-bone">{value}</span>
    </div>
  );
}
