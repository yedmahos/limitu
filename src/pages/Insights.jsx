import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { useApp } from '../context/AppContext';
import Mascot from '../components/Mascot';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 1, 0.5, 1] } }),
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="card px-3 py-2">
        <p className="font-mono text-[10px] text-bone/40">{label}</p>
        <p className="font-display font-bold text-[13px] text-lime">{'\u20B9'}{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function Insights() {
  const { weeklySpending, dailyLimits, habitScore, avgDailySpend, remainingBalance, daysLeft } = useApp();

  const weekData = DAYS.map((day, i) => ({
    day, spent: weeklySpending[i], limit: dailyLimits[i],
    over: weeklySpending[i] > dailyLimits[i],
  }));

  const weekdayAvg = Math.round(weeklySpending.slice(0, 5).reduce((a, b) => a + b, 0) / 5);
  const weekendAvg = Math.round(weeklySpending.slice(5).reduce((a, b) => a + b, 0) / 2);
  const weekendRatio = weekdayAvg > 0 ? (weekendAvg / weekdayAvg).toFixed(1) : '\u2014';

  const forecastDays = avgDailySpend > 0 ? Math.floor(remainingBalance / avgDailySpend) : daysLeft;
  const forecastOk = forecastDays >= daysLeft;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 grain">
      <motion.div initial="hidden" animate="visible" className="max-w-5xl mx-auto">
        <motion.div variants={fadeUp} custom={0} className="mb-10">
          <h1 className="font-display font-extrabold text-[clamp(1.6rem,4vw,2.2rem)] text-bone tracking-tight">Insights</h1>
          <p className="font-mono text-[11px] text-bone/25 tracking-wider mt-1">Understand your spending patterns</p>
        </motion.div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <motion.div variants={fadeUp} custom={1} className="card p-5 text-center">
            <span className="font-mono text-[9px] tracking-[0.2em] text-bone/20 uppercase block mb-3">Habit Score</span>
            <div className="relative w-16 h-16 mx-auto mb-2">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" stroke="rgba(245,240,232,0.06)" strokeWidth="5" fill="none" />
                <circle cx="40" cy="40" r="34"
                  stroke={habitScore >= 70 ? '#C8F135' : habitScore >= 40 ? '#D4A843' : '#E85D3A'}
                  strokeWidth="5" fill="none"
                  strokeDasharray={`${(habitScore / 100) * 213.6} 213.6`}
                  strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-display font-extrabold text-[18px] text-bone">{habitScore}</span>
            </div>
            <span className="font-mono text-[10px] text-bone/20">out of 100</span>
          </motion.div>

          <motion.div variants={fadeUp} custom={2} className="card p-5 text-center">
            <span className="font-mono text-[9px] tracking-[0.2em] text-bone/20 uppercase block mb-3">Avg Daily</span>
            <div className="font-display font-extrabold text-[1.8rem] text-bone mb-1">{'\u20B9'}{avgDailySpend}</div>
            <span className="font-mono text-[10px] text-bone/20">per day average</span>
          </motion.div>

          <motion.div variants={fadeUp} custom={3} className="card p-5 text-center">
            <span className="font-mono text-[9px] tracking-[0.2em] text-bone/20 uppercase block mb-3">Wknd vs Wkdy</span>
            <div className="font-display font-extrabold text-[1.8rem] text-bone mb-1">{weekendRatio}{'\u00D7'}</div>
            <span className="font-mono text-[10px] text-bone/20">weekend ratio</span>
          </motion.div>

          <motion.div variants={fadeUp} custom={4} className="card p-5 text-center">
            <span className="font-mono text-[9px] tracking-[0.2em] text-bone/20 uppercase block mb-3">Forecast</span>
            <div className={`font-display font-extrabold text-[1.8rem] ${forecastOk ? 'text-lime/80' : 'text-rust/80'} mb-1`}>{forecastDays}d</div>
            <span className="font-mono text-[10px] text-bone/20">{forecastOk ? 'looking good' : 'running short'}</span>
          </motion.div>
        </div>

        {/* Weekly Chart */}
        <motion.div variants={fadeUp} custom={5} className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono text-[10px] tracking-[0.25em] text-bone/20 uppercase">Weekly Spending</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-lime/60" />
                <span className="font-mono text-[10px] text-bone/20">Under</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-rust/60" />
                <span className="font-mono text-[10px] text-bone/20">Over</span>
              </div>
            </div>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData} barCategoryGap="20%">
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgba(245,240,232,0.2)', fontSize: 10, fontFamily: 'DM Mono' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(245,240,232,0.15)', fontSize: 10, fontFamily: 'DM Mono' }} tickFormatter={(v) => `\u20B9${v}`} />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Bar dataKey="spent" radius={[6, 6, 0, 0]}>
                  {weekData.map((entry, i) => (
                    <Cell key={i} fill={entry.over ? '#E85D3A' : '#C8F135'} fillOpacity={0.5} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Warnings */}
        <div className="grid md:grid-cols-2 gap-3">
          <motion.div variants={fadeUp} custom={6} className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mascot size={28} expression={forecastOk ? 'happy' : 'thinking'} />
              <span className="font-mono text-[10px] tracking-[0.25em] text-bone/20 uppercase">Forecast</span>
            </div>
            <p className="font-mono text-[12px] text-bone/35 leading-[1.8]">
              {forecastOk
                ? "You're on track to make it through the month. Your spending habits are consistent and sustainable."
                : `At your current pace of \u20B9${avgDailySpend}/day, you'll run out in ${forecastDays} days \u2014 that's ${daysLeft - forecastDays} days before month-end. Try reducing daily spending by \u20B9${Math.ceil((avgDailySpend * forecastDays - remainingBalance) / daysLeft)}.`
              }
            </p>
          </motion.div>

          <motion.div variants={fadeUp} custom={7} className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-gold/60 text-[14px]">{'\u25CE'}</span>
              <span className="font-mono text-[10px] tracking-[0.25em] text-bone/20 uppercase">Spending Pattern</span>
            </div>
            <p className="font-mono text-[12px] text-bone/35 leading-[1.8]">
              {parseFloat(weekendRatio) > 2
                ? `Your weekend spending is ${weekendRatio}\u00D7 higher than weekdays. Consider setting a weekend budget cap.`
                : `Your spending is relatively balanced across the week. Weekday avg: \u20B9${weekdayAvg}, Weekend avg: \u20B9${weekendAvg}.`
              }
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
