import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';


const ease = [0.25, 1, 0.5, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.7, ease } }),
};

const steps = [
  { num: '01', title: 'Set your allowance', desc: 'Monthly amount + fixed expenses. 30 seconds.' },
  { num: '02', title: 'Get daily limits', desc: 'We calculate your optimal daily spend.' },
  { num: '03', title: 'Spend mindfully', desc: 'Simulate, track, and let LIM guide you.' },
];

const testimonials = [
  { quote: 'I used to run out by the 15th. Now I actually save.', name: 'Priya K.', school: 'BITS Pilani, 2nd Year' },
  { quote: 'LIM AI is like having a friend who\u2019s good with money.', name: 'Arjun R.', school: 'IIT Delhi, 3rd Year' },
  { quote: 'The simulator stopped me from buying things I didn\'t need.', name: 'Sara M.', school: 'Christ University, 1st Year' },
];

const stagger = { visible: { transition: { staggerChildren: 0.07 } } };
const itemFade = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

const chatMessages = [
  { from: 'user', text: 'Can I spend ₹200 on lunch?' },
  { from: 'lim', expression: 'thinking', text: 'Checking your budget for today...' },
  { from: 'lim', expression: 'happy', text: 'Yes! ₹200 fits perfectly. You\'ll have ₹267 left today. Enjoy! 🍜' },
];

function HeroShowcase() {
  const [view, setView] = useState(0); // 0 = budget, 1 = chat
  const [chatStep, setChatStep] = useState(0);
  const [amount, setAmount] = useState(0);

  // Cycle between budget and chat views
  useEffect(() => {
    const timer = setTimeout(() => setView((v) => (v + 1) % 2), view === 0 ? 5000 : 7000);
    return () => clearTimeout(timer);
  }, [view]);

  // Animate the amount counting up
  useEffect(() => {
    if (view !== 0) { setAmount(0); return; }
    let frame;
    const target = 467;
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAmount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [view]);

  // Stagger chat messages
  useEffect(() => {
    if (view !== 1) { setChatStep(0); return; }
    const timers = [
      setTimeout(() => setChatStep(1), 600),
      setTimeout(() => setChatStep(2), 2000),
      setTimeout(() => setChatStep(3), 3500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [view]);

  return (
    <div className="relative h-[360px]">
      <AnimatePresence mode="wait">
        {view === 0 ? (
          <motion.div
            key="budget"
            initial={{ opacity: 0, y: 16, rotateX: -4 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -12, rotateX: 4 }}
            transition={{ duration: 0.5, ease }}
            className="absolute inset-0"
          >
            <div className="card-elevated p-4 space-y-3">
              {/* Header */}
              <motion.div initial="hidden" animate="visible" variants={stagger}>
                <motion.div variants={itemFade} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-lime/20 flex items-center justify-center">
                      <span className="text-lime text-[11px] font-bold">L</span>
                    </div>
                    <div>
                      <div className="font-display font-bold text-[12px] text-bone/70">Today's Budget</div>
                      <div className="font-mono text-[9px] text-bone/20 tracking-wider">March 7, 2026</div>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-lime/50 animate-pulse" />
                </motion.div>

                {/* Amount */}
                <motion.div variants={itemFade} className="text-center py-2">
                  <div className="font-display font-extrabold text-[2rem] text-bone tracking-tight leading-none tabular-nums">
                    ₹{amount}
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="font-mono text-[10px] text-lime/40 tracking-wider mt-1.5"
                  >
                    safe to spend
                  </motion.div>
                </motion.div>

                {/* Progress */}
                <motion.div variants={itemFade}>
                  <div className="flex justify-between mb-2">
                    <span className="font-mono text-[9px] text-bone/20">spent today</span>
                    <span className="font-mono text-[9px] text-bone/30">₹183 / ₹650</span>
                  </div>
                  <div className="h-1.5 bg-bone/[0.04] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '28%' }}
                      transition={{ delay: 0.6, duration: 1, ease }}
                      className="h-full bg-lime/60 rounded-full"
                    />
                  </div>
                </motion.div>

                {/* LIM hint */}
                <motion.div variants={itemFade} className="bg-bone/[0.03] rounded-lg p-2.5 border border-bone/[0.04]">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded bg-lime/15 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-lime text-[8px] font-bold">L</span>
                    </div>
                    <p className="font-mono text-[9px] text-bone/35 leading-[1.6]">
                      You're on track! Save ₹1,200 this month.
                    </p>
                  </div>
                </motion.div>

                {/* Stats */}
                <motion.div variants={itemFade} className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: 'Streak', val: '8 days' },
                    { label: 'Saved', val: '₹2.4k' },
                    { label: 'Score', val: '82' },
                  ].map((s) => (
                    <div key={s.label} className="text-center py-1.5 bg-bone/[0.02] rounded-lg">
                      <div className="font-display font-bold text-[10px] text-bone/60">{s.val}</div>
                      <div className="font-mono text-[7px] text-bone/15 tracking-wider mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 16, rotateX: -4 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -12, rotateX: 4 }}
            transition={{ duration: 0.5, ease }}
            className="absolute inset-0"
          >
            <div className="card-elevated p-4 h-full flex flex-col">
              {/* Chat header */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2.5 pb-3 border-b border-bone/[0.04] mb-3"
              >
                <div className="relative">
                  <div className="w-6 h-6 rounded-lg bg-lime/20 flex items-center justify-center">
                    <span className="text-lime text-[11px] font-bold">L</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-lime/70 border-2 border-card" />
                </div>
                <div>
                  <div className="font-display font-bold text-[12px] text-bone/70">LIM AI</div>
                  <div className="font-mono text-[9px] text-lime/35 tracking-wider">online · ready to help</div>
                </div>
              </motion.div>

              {/* Messages */}
              <div className="flex-1 space-y-2.5 overflow-hidden">
                <AnimatePresence>
                  {chatStep >= 1 && (
                    <motion.div
                      key="msg-0"
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.35, ease }}
                      className="flex justify-end"
                    >
                      <div className="bg-lime/[0.06] border border-lime/[0.1] rounded-2xl rounded-tr-md px-3 py-2 max-w-[85%]">
                        <p className="font-mono text-[10px] text-lime/50">{chatMessages[0].text}</p>
                      </div>
                    </motion.div>
                  )}

                  {chatStep >= 2 && (
                    <motion.div
                      key="msg-1"
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.35, ease }}
                      className="flex items-start gap-2.5"
                    >
                      <div className="w-5 h-5 rounded bg-lime/15 flex items-center justify-center shrink-0">
                        <span className="text-lime text-[9px] font-bold">L</span>
                      </div>
                      <div className="bg-bone/[0.04] rounded-2xl rounded-tl-md px-3 py-2 border border-bone/[0.04]">
                        <div className="flex items-center gap-1.5">
                          <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                            className="flex gap-1"
                          >
                            <span className="w-1 h-1 rounded-full bg-bone/30" />
                            <span className="w-1 h-1 rounded-full bg-bone/30" />
                            <span className="w-1 h-1 rounded-full bg-bone/30" />
                          </motion.div>
                          <p className="font-mono text-[10px] text-bone/35">{chatMessages[1].text}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {chatStep >= 3 && (
                    <motion.div
                      key="msg-2"
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.35, ease }}
                      className="flex items-start gap-2.5"
                    >
                      <div className="w-5 h-5 rounded bg-lime/15 flex items-center justify-center shrink-0">
                        <span className="text-lime text-[9px] font-bold">L</span>
                      </div>
                      <div className="bg-bone/[0.04] rounded-2xl rounded-tl-md px-3 py-2 border border-bone/[0.04]">
                        <p className="font-mono text-[10px] text-bone/45 leading-[1.6]">{chatMessages[2].text}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Fake input */}
              <div className="mt-3 pt-2.5 border-t border-bone/[0.04]">
                <div className="flex items-center gap-2 bg-bone/[0.02] rounded-lg px-2.5 py-2 border border-bone/[0.04]">
                  <span className="font-mono text-[10px] text-bone/15 flex-1">Ask LIM anything...</span>
                  <div className="w-6 h-6 rounded-lg bg-lime/10 flex items-center justify-center">
                    <svg className="w-3 h-3 text-lime/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" /></svg>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View indicator dots */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {[0, 1].map((i) => (
          <button
            key={i}
            onClick={() => setView(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              view === i ? 'bg-lime/50 w-4' : 'bg-bone/10'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-ink grain">
      {/* Hero */}
      <section className="relative min-h-[100vh] flex flex-col justify-center px-6 md:px-12 lg:px-20 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-lime/[0.035] blur-[180px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-rust/[0.02] blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full relative z-10 pt-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Copy */}
            <motion.div initial="hidden" animate="visible" className="flex flex-col gap-6">
              <motion.h1 variants={fadeUp} custom={1} className="font-display font-extrabold text-bone leading-[0.95] tracking-[-0.03em] text-[clamp(2.4rem,5vw,4rem)]">
                Control your money{' '}
                <span className="text-lime">before it controls</span>{' '}
                <span className="font-serif italic font-normal text-bone/40">you.</span>
              </motion.h1>

              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap items-center gap-4 mt-1">
                <Link to="/auth" className="group inline-flex items-center gap-2.5 bg-lime text-ink font-display font-bold text-[13px] px-7 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_40px_rgba(200,241,53,0.2)] hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  Start Managing
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
                <a href="#how-it-works" className="font-mono text-[11px] text-bone/30 hover:text-bone/60 transition-colors tracking-wider">
                  See how it works →
                </a>
              </motion.div>

              {/* Social proof strip */}
              <motion.div variants={fadeUp} custom={4} className="flex items-center gap-5 mt-2">
                <div className="flex -space-x-2">
                  {['#C8F135', '#A8BFA0', '#D4A843', '#E85D3A'].map((c, i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-ink" style={{ background: c }} />
                  ))}
                </div>
                <div>
                  <span className="font-display font-bold text-[13px] text-bone/70">2,400+</span>
                  <span className="font-mono text-[10px] text-bone/20 ml-1.5 tracking-wide">students saving smarter</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right — HeroShowcase */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.9, ease }}
              className="hidden lg:flex justify-end"
            >
              <div className="relative w-[340px]">
                <div className="absolute -inset-16 bg-lime/[0.04] blur-[80px] rounded-full pointer-events-none" />
                <HeroShowcase />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 md:px-12 lg:px-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bone/[0.06] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-lime/[0.01] to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
            <motion.span variants={fadeUp} custom={0} className="font-mono text-[10px] tracking-[0.25em] text-lime/30 uppercase mb-6 block">How It Works</motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="font-display font-bold text-[clamp(1.8rem,4vw,2.8rem)] text-bone leading-[1.1] tracking-tight">
              Three steps to{' '}<span className="font-serif italic font-normal text-lime/60">financial calm.</span>
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-4 relative mt-12">
              {/* Connecting line (desktop) */}
              <div className="hidden md:block absolute top-[60px] left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-lime/[0.06] via-lime/[0.12] to-lime/[0.06]" />

              {steps.map((step, i) => (
                <motion.div key={step.num} variants={fadeUp} custom={i + 2} className="relative">
                  <div className="card p-8 group hover:border-lime/[0.08] transition-all duration-500">
                    {/* Step number with glow */}
                    <div className="relative mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-lime/[0.06] border border-lime/[0.08] flex items-center justify-center group-hover:bg-lime/[0.1] group-hover:border-lime/[0.15] transition-all duration-500">
                        <span className="font-display font-extrabold text-[14px] text-lime/60 group-hover:text-lime/80 transition-colors">{step.num}</span>
                      </div>
                    </div>
                    <h3 className="font-display font-bold text-[15px] text-bone mb-3 tracking-tight">{step.title}</h3>
                    <p className="font-mono text-[11px] text-bone/25 leading-[1.8] group-hover:text-bone/35 transition-colors">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* LIM AI Preview */}
      <section className="py-20 px-6 md:px-12 lg:px-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bone/[0.06] to-transparent" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-lime/[0.02] rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeUp} custom={0}>
              <span className="font-mono text-[10px] tracking-[0.25em] text-lime/30 uppercase mb-6 block">Meet LIM AI</span>
              <h2 className="font-display font-bold text-[clamp(1.8rem,4vw,2.8rem)] text-bone leading-[1.1] tracking-tight mb-6">
                Your pocket-sized<br /><span className="font-serif italic font-normal text-lime/60">financial mentor.</span>
              </h2>
              <p className="font-mono text-[12px] text-bone/25 leading-[1.9] mb-8 max-w-sm">
                Short, helpful explanations. No jargon — just guidance.
              </p>
              <div className="flex flex-wrap gap-2">
                {['"Why is my limit low?"', '"Can I spend ₹200?"', '"When will I run out?"'].map((q) => (
                  <span key={q} className="font-mono text-[10px] text-lime/35 bg-lime/[0.04] px-3 py-1.5 rounded-full border border-lime/[0.06]">{q}</span>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeUp} custom={1}>
              <div className="card-elevated p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5"><div className="w-7 h-7 rounded-lg bg-lime/20 flex items-center justify-center"><span className="text-lime text-[12px] font-bold">L</span></div></div>
                  <div className="bg-bone/[0.04] rounded-2xl rounded-tl-md px-4 py-3 border border-bone/[0.04]">
                    <p className="font-mono text-[11px] text-bone/45 leading-[1.8]">Your limit is ₹400 today. Adjusted for this week — more room by Thursday!</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-lime/[0.06] border border-lime/[0.1] rounded-2xl rounded-tr-md px-4 py-3 max-w-[75%]">
                    <p className="font-mono text-[11px] text-lime/50">Can I spend ₹200 on lunch?</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5"><div className="w-7 h-7 rounded-lg bg-lime/20 flex items-center justify-center"><span className="text-lime text-[12px] font-bold">L</span></div></div>
                  <div className="bg-bone/[0.04] rounded-2xl rounded-tl-md px-4 py-3 border border-bone/[0.04]">
                    <p className="font-mono text-[11px] text-bone/45 leading-[1.8]">Yes! ₹200 fits. You'll have ₹120 left. Enjoy! 🍜</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 md:px-12 lg:px-20 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bone/[0.06] to-transparent" />

        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
            <motion.h2 variants={fadeUp} custom={0} className="font-display font-bold text-[clamp(1.8rem,4vw,2.4rem)] text-bone leading-[1.1] tracking-tight mb-12 text-center">
              What students{' '}<span className="font-serif italic font-normal text-lime/60">say.</span>
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-4">
              {testimonials.map((t, i) => (
                <motion.div key={t.name} variants={fadeUp} custom={i + 2} className="card p-7 flex flex-col justify-between group">
                  <div>
                    <div className="flex gap-1 mb-5">
                      {[...Array(5)].map((_, j) => (
                        <svg key={j} className="w-3.5 h-3.5 text-lime/40" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      ))}
                    </div>
                    <p className="font-serif italic text-[15px] text-bone/50 leading-relaxed mb-6">"{t.quote}"</p>
                  </div>
                  <div>
                    <div className="font-display font-bold text-[12px] text-bone/60">{t.name}</div>
                    <div className="font-mono text-[10px] text-bone/15 tracking-wider">{t.school}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 md:px-12 lg:px-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bone/[0.06] to-transparent" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime/[0.03] rounded-full blur-[200px] pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
            <motion.h2 variants={fadeUp} custom={0} className="font-display font-extrabold text-[clamp(2rem,5vw,3.2rem)] text-bone leading-[1.1] tracking-tight mb-5">
              Built for students,<br />by people who{' '}<span className="font-serif italic font-normal text-lime/60">get it.</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="font-mono text-[12px] text-bone/25 max-w-md mx-auto leading-[1.9] mb-10">
              No bank accounts. No jargon. Just a clean tool that helps you make your allowance last — completely free.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth" className="group inline-flex items-center gap-2.5 bg-lime text-ink font-display font-bold text-[14px] px-9 py-4 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_40px_rgba(200,241,53,0.25)] hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                Start For Free
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
              <span className="font-mono text-[10px] text-bone/15 tracking-wider">No credit card required</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
