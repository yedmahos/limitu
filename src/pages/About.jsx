import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const ease = [0.25, 1, 0.5, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease },
});

const pillars = [
  { index: '01', title: 'Built for students', desc: 'Every decision is shaped around student life — allowances, peer pressure, and the chaos of irregular expenses.' },
  { index: '02', title: 'Radical simplicity', desc: 'One number. Your daily limit. No spreadsheets, no jargon, no friction.' },
  { index: '03', title: 'Honest by design', desc: 'We never nudge you to spend more. LIM only exists to help you spend smarter.' },
];

const stats = [
  { val: '73%', label: 'run out before month-end', color: 'text-rust/70' },
  { val: '10 days', label: 'avg allowance lifespan', color: 'text-gold/70' },
  { val: '₹0', label: 'monthly savings for most', color: 'text-rust/70' },
  { val: '4×', label: 'weekend overspend ratio', color: 'text-gold/70' },
];

const SectionLabel = ({ children }) => (
  <span className="font-mono text-[10px] tracking-[0.3em] text-bone/20 uppercase block mb-8">{children}</span>
);

const Divider = () => (
  <div className="mx-6 md:mx-20 h-px bg-bone/[0.05]" />
);

export default function About() {
  return (
    <div className="min-h-screen bg-ink text-bone flex flex-col">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative px-6 md:px-20 pt-40 pb-28 overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] bg-lime/[0.04] rounded-full blur-[140px]" />
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_auto] gap-10 items-end">
          <div>
            <motion.p {...fadeUp(0)} className="font-mono text-[10px] tracking-[0.3em] text-bone/20 uppercase mb-6">
              About LIM
            </motion.p>
            <motion.h1 {...fadeUp(0.07)} className="font-display font-bold text-[clamp(2.6rem,6vw,5rem)] leading-[1.05] tracking-tight mb-6">
              Financial clarity,<br />
              <span className="text-lime">without the noise.</span>
            </motion.h1>
            <motion.p {...fadeUp(0.16)} className="font-mono text-[12px] text-bone/25 max-w-sm leading-[1.9]">
              LIM converts your monthly allowance into a single daily number — the one thing you need to make every spending decision with confidence.
            </motion.p>
          </div>
          <motion.div {...fadeUp(0.22)} className="shrink-0 self-end pb-1">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 font-mono text-[11px] bg-lime text-ink px-5 py-2.5 rounded-xl hover:bg-lime/85 transition-all tracking-wide font-medium"
            >
              Try it free
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ── THE PROBLEM ──────────────────────────────────── */}
      <section className="px-6 md:px-20 py-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <motion.div {...fadeUp(0.05)}>
            <SectionLabel>The problem</SectionLabel>
            <h2 className="font-display font-bold text-[clamp(1.7rem,3.5vw,2.5rem)] leading-[1.1] tracking-tight mb-5">
              Students get their allowance.<br />
              <span className="text-rust/70">It vanishes in 10 days.</span>
            </h2>
            <p className="font-mono text-[12px] text-bone/25 leading-[1.9]">
              Without a daily structure, money disappears the moment it arrives. There's no overspending alert, no guardrails — just a balance that silently drains to zero.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 + 0.1, duration: 0.55, ease }}
                className="rounded-2xl border border-bone/[0.05] bg-bone/[0.015] p-6 group hover:border-bone/[0.1] transition-colors duration-300"
              >
                <p className={`font-display font-extrabold text-[1.5rem] ${s.color} mb-1 group-hover:scale-105 transition-transform origin-left`}>{s.val}</p>
                <p className="font-mono text-[10px] text-bone/20 tracking-wide leading-relaxed">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── OUR PRINCIPLES ───────────────────────────────── */}
      <section className="px-6 md:px-20 py-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_2fr] gap-16 items-start">
          <motion.div {...fadeUp(0.05)}>
            <SectionLabel>Our principles</SectionLabel>
            <p className="font-mono text-[12px] text-bone/20 leading-[1.9]">
              The values that shape how we build — and how we treat every student who trusts us with their finances.
            </p>
          </motion.div>

          <div className="divide-y divide-bone/[0.06]">
            {pillars.map((item, i) => (
              <motion.div
                key={item.index}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.1, duration: 0.6, ease }}
                className="group flex items-start gap-6 py-7 first:pt-0 last:pb-0"
              >
                <span className="font-mono text-[10px] text-lime/25 tabular-nums mt-1 shrink-0 group-hover:text-lime/60 transition-colors duration-300">{item.index}</span>
                <div>
                  <p className="font-display font-semibold text-[15px] tracking-tight text-bone/85 mb-2">{item.title}</p>
                  <p className="font-mono text-[11px] text-bone/28 tracking-wide leading-[1.85]">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="px-6 md:px-20 py-24">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <motion.div {...fadeUp(0.05)}>
            <p className="font-mono text-[10px] tracking-[0.3em] text-bone/20 uppercase mb-4">Get started</p>
            <h2 className="font-display font-bold text-[clamp(1.6rem,3.5vw,2.4rem)] leading-[1.1] tracking-tight">
              Ready to take control?
            </h2>
          </motion.div>
          <motion.div {...fadeUp(0.12)} className="shrink-0">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 font-mono text-[11px] bg-lime text-ink px-6 py-3 rounded-xl hover:bg-lime/85 transition-all tracking-wide font-medium"
            >
              Create free account
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
