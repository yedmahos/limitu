import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion';
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




export default function Landing() {
  const [activeStep, setActiveStep] = useState(0);
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev === 0 ? 1 : 0));
    }, 4000); // toggle every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => setActiveStep((prev) => Math.min(2, prev + 1));
  const handlePrev = () => setActiveStep((prev) => Math.max(0, prev - 1));

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.5, 1]);
  return (
    <div className="min-h-screen bg-ink grain relative overflow-x-hidden">

      {/* Hero */}
      <section ref={heroRef} className="relative w-full overflow-hidden min-h-[90svh] lg:min-h-[100vh] pt-[10vh] lg:pt-[12vh] pb-[4vh] lg:pb-[6vh] px-4 sm:px-6 md:px-12 lg:px-20 flex flex-col justify-center">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-[10%] right-[-5%] w-[800px] h-[800px] rounded-full bg-lime/[0.035] blur-[200px]"
            animate={{
              x: ['0%', '-20%', '0%'],
              y: ['0%', '15%', '0%'],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-rust/[0.02] blur-[150px]"
            animate={{
              x: ['0%', '30%', '0%'],
              y: ['0%', '-20%', '0%'],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          />
        </div>

        <div className="max-w-[1400px] mx-auto w-full relative z-10 flex flex-col-reverse lg:grid lg:grid-cols-2 gap-0 lg:gap-8 items-center mt-4 lg:mt-0">

          {/* Left Text Column */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left max-w-2xl mx-auto lg:mx-0 relative z-20 lg:z-10 w-full pt-16 lg:pt-0 -mt-[15vh] lg:mt-0 pb-6 lg:pb-0">

            {/* Smooth Frosted Glass Overlay for Mobile */}
            <div className="absolute inset-x-0 -top-16 -mx-[5vw] -bottom-[30vh] pointer-events-none -z-10 lg:hidden overflow-hidden">
              <div className="absolute inset-x-0 -top-0 bottom-0 bg-gradient-to-t from-ink via-ink/90 to-transparent" />
              <div className="absolute inset-x-0 -top-0 bottom-0 backdrop-blur-[12px] [mask-image:linear-gradient(to_bottom,transparent_0%,black_35%)]" />
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
              className="font-display font-bold text-bone leading-[1.05] md:leading-[0.9] tracking-tight text-[clamp(2.15rem,7.5vw,5.5rem)] mb-3 lg:mb-6 text-balance"
            >
              Control your money <br className="hidden md:block lg:block" />
              <span className="text-lime">before it controls</span>{' '}
              <span className="font-serif italic font-normal text-bone/40">you.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <Link to="/signup" className="group inline-flex items-center justify-center gap-2.5 bg-lime text-ink font-display font-bold text-[14px] px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_40px_rgba(200,241,53,0.25)] hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden min-w-[200px]">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                Get Started Free
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </motion.div>
          </div>

          {/* Right Image/Mockup Column */}
          <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[550px] flex items-center justify-center pointer-events-none perspective-[2000px] z-10 -ml-2 lg:ml-0 overflow-visible">
            <AnimatePresence>
              {heroImageIndex === 0 && (
                <motion.img
                  key="dashboard"
                  src="/dashboard-tilted.png"
                  alt="LIM Dashboard Mockup"
                  initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute w-[95%] max-w-[340px] sm:max-w-[450px] lg:max-w-[500px] xl:max-w-[550px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] lg:drop-shadow-[0_45px_100px_rgba(0,0,0,0.6)] z-10 pb-12 lg:pb-0"
                  style={{ rotateY: rotateX }}
                />
              )}
              {heroImageIndex === 1 && (
                <motion.img
                  key="limai"
                  src="/lim.png"
                  alt="LIM AI Chat Interface Mockup"
                  initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute w-[280px] sm:w-[360px] lg:w-[380px] xl:w-[420px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] lg:drop-shadow-[0_45px_100px_rgba(0,0,0,0.6)] z-10 pb-12 lg:pb-0"
                />
              )}
            </AnimatePresence>
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

            <div className="relative mt-8 md:mt-16 h-[500px] flex items-center justify-center w-full group">

              {/* Left Arrow */}
              <button
                onClick={handlePrev}
                disabled={activeStep === 0}
                className="absolute left-0 md:left-4 z-30 w-12 h-12 rounded-full border border-bone/[0.08] bg-ink/40 backdrop-blur-md flex items-center justify-center text-bone/60 hover:text-lime hover:border-lime/30 hover:bg-lime/5 transition-all disabled:opacity-0 disabled:pointer-events-none"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Right Arrow */}
              <button
                onClick={handleNext}
                disabled={activeStep === 2}
                className="absolute right-0 md:right-4 z-30 w-12 h-12 rounded-full border border-bone/[0.08] bg-ink/40 backdrop-blur-md flex items-center justify-center text-bone/60 hover:text-lime hover:border-lime/30 hover:bg-lime/5 transition-all disabled:opacity-0 disabled:pointer-events-none"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {[
                {
                  id: 0,
                  content: (
                    <div className="card p-6 h-full flex flex-col group transition-all duration-500 w-full min-h-[400px]">
                      <div className="flex-1 mb-6 -mt-2 -mx-2 rounded-xl bg-gradient-to-br from-bone/[0.04] to-transparent border border-bone/[0.03] p-4 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(200,241,53,0.03),transparent_70%)]" />
                        <div className="w-full space-y-2.5 relative z-10">
                          <div className="flex justify-between items-center text-[10px] sm:text-[12px] font-mono border-b border-bone/[0.05] pb-2">
                            <span className="text-bone/45">Monthly Allowance</span>
                            <span className="text-lime/90 font-bold">₹12,000</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] sm:text-[12px] font-mono border-b border-bone/[0.05] pb-2">
                            <span className="text-bone/45">Fixed Subscriptions</span>
                            <span className="text-rust/90">- ₹1,400</span>
                          </div>
                          <div className="flex justify-between items-center text-[11px] sm:text-[14px] font-display font-bold pt-1">
                            <span className="text-bone/70">Safe to spend</span>
                            <span className="text-bone text-[13px] sm:text-[16px]">₹10,600</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="font-display font-extrabold text-[12px] text-lime/60 group-hover:text-lime/90 transition-colors">01</div>
                          <h3 className="font-display font-bold text-[16px] sm:text-[18px] text-bone tracking-tight">Set your allowance</h3>
                        </div>
                        <p className="font-mono text-[11px] sm:text-[13px] text-bone/45 leading-[1.8] transition-colors">Monthly amount + fixed expenses. 30 seconds.</p>
                      </div>
                    </div>
                  )
                },
                {
                  id: 1,
                  content: (
                    <div className="card p-6 h-full flex flex-col group transition-all duration-500 w-full min-h-[400px]">
                      <div className="flex-1 mb-6 -mt-2 -mx-2 rounded-xl bg-gradient-to-bl from-bone/[0.04] to-transparent border border-bone/[0.03] p-4 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(200,241,53,0.03),transparent_70%)]" />
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-2 z-10 transition-transform duration-500">
                          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                            <circle cx="50" cy="50" r="42" stroke="rgba(245,240,232,0.08)" strokeWidth="6" fill="none" />
                            <motion.circle
                              cx="50" cy="50" r="42" stroke="#C8F135" strokeWidth="6" fill="none"
                              strokeDasharray="263.9" strokeDashoffset={activeStep === 1 ? 100 : 263.9} strokeLinecap="round"
                              transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="font-display font-bold text-[15px] sm:text-[20px] text-bone">₹467</span>
                            <span className="font-mono text-[9px] sm:text-[11px] text-bone/45 uppercase tracking-widest mt-0.5">Today</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="font-display font-extrabold text-[12px] text-lime/60 group-hover:text-lime/90 transition-colors">02</div>
                          <h3 className="font-display font-bold text-[16px] sm:text-[18px] text-bone tracking-tight">Get daily limits</h3>
                        </div>
                        <p className="font-mono text-[11px] sm:text-[13px] text-bone/45 leading-[1.8] transition-colors">We calculate your optimal daily spend.</p>
                      </div>
                    </div>
                  )
                },
                {
                  id: 2,
                  content: (
                    <div className="card p-6 h-full flex flex-col group transition-all duration-500 w-full min-h-[400px]">
                      <div className="flex-1 mb-6 -mt-2 -mx-2 rounded-xl bg-gradient-to-tr from-bone/[0.04] to-transparent border border-bone/[0.03] p-4 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute w-full h-full inset-0 bg-[radial-gradient(circle_at_0%_50%,rgba(200,241,53,0.03),transparent_70%)]" />
                        <div className="w-full space-y-3 z-10 px-2 sm:px-6">
                          <div className="flex justify-end">
                            <div className="bg-lime/[0.09] border border-lime/[0.2] text-lime/90 font-mono text-[10px] sm:text-[12px] px-4 py-2.5 rounded-2xl rounded-tr-md max-w-[85%]">
                              Can I buy a ₹300 coffee?
                            </div>
                          </div>
                          <div className="flex justify-start">
                            <div className="bg-bone/[0.07] border border-bone/[0.11] text-bone/70 font-mono text-[10px] sm:text-[12px] px-4 py-3 rounded-2xl rounded-tl-md max-w-[90%] leading-[1.6]">
                              Yes! You'll still have ₹167 left in today's budget.
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="font-display font-extrabold text-[12px] text-lime/60 group-hover:text-lime/90 transition-colors">03</div>
                          <h3 className="font-display font-bold text-[16px] sm:text-[18px] text-bone tracking-tight">Spend mindfully</h3>
                        </div>
                        <p className="font-mono text-[11px] sm:text-[13px] text-bone/45 leading-[1.8] transition-colors">Simulate, track, and let LIM guide you.</p>
                      </div>
                    </div>
                  )
                }
              ].map((step, idx) => {
                const isActive = activeStep === idx;
                const offset = idx - activeStep; // -1, 0, 1

                return (
                  <motion.div
                    key={step.id}
                    initial={false}
                    animate={{
                      x: `calc(${offset * 85}% + ${offset * 1}rem)`,
                      scale: isActive ? 1 : 0.85,
                      opacity: isActive ? 1 : 0.4,
                      filter: isActive ? 'blur(0px)' : 'blur(4px)',
                      zIndex: isActive ? 10 : 0
                    }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute w-[88%] sm:w-full max-w-[320px] md:max-w-sm"
                  >
                    {step.content}
                  </motion.div>
                );
              })}
            </div>

            {/* Carousel Dots */}
            <div className="flex justify-center gap-3 mt-8 relative z-20">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-500 cursor-pointer ${activeStep === i ? 'bg-lime w-6' : 'bg-bone/[0.2] hover:bg-bone/[0.4]'}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* LIM AI Preview */}
      < section className="py-20 px-6 md:px-12 lg:px-20 relative overflow-hidden" >
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
                  <motion.button
                    key={q}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(200, 241, 53, 0.08)' }}
                    whileTap={{ scale: 0.95 }}
                    className="font-mono text-[10px] text-lime/35 bg-lime/[0.04] px-3 py-1.5 rounded-full border border-lime/[0.06] transition-colors cursor-pointer"
                  >
                    {q}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="card-elevated p-5 space-y-3 relative">
                {/* Glow behind chat */}
                <div className="absolute inset-0 bg-lime/[0.02] rounded-3xl blur-2xl -z-10" />

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={{
                    visible: { transition: { staggerChildren: 0.6 } }
                  }}
                  className="space-y-4"
                >
                  <motion.div
                    variants={fadeUp}
                    className="flex items-start gap-3"
                  >
                    <div className="shrink-0 mt-0.5"><div className="w-7 h-7 rounded-lg bg-lime/20 flex items-center justify-center"><span className="text-lime text-[12px] font-bold">L</span></div></div>
                    <div className="bg-bone/[0.04] rounded-2xl rounded-tl-md px-4 py-3 border border-bone/[0.04]">
                      <p className="font-mono text-[11px] text-bone/45 leading-[1.8]">Your limit is ₹400 today. Adjusted for this week — more room by Thursday!</p>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, scale: 0.9, x: 20 },
                      visible: { opacity: 1, scale: 1, x: 0, transition: { type: 'spring', damping: 20, stiffness: 100 } }
                    }}
                    className="flex justify-end"
                  >
                    <div className="bg-lime/[0.06] border border-lime/[0.1] rounded-2xl rounded-tr-md px-4 py-3 max-w-[75%]">
                      <p className="font-mono text-[11px] text-lime/50">Can I spend ₹200 on lunch?</p>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    className="flex items-start gap-3"
                  >
                    <div className="shrink-0 mt-0.5"><div className="w-7 h-7 rounded-lg bg-lime/20 flex items-center justify-center relative">
                      <span className="text-lime text-[12px] font-bold">L</span>
                      <motion.div
                        className="absolute -right-1 -top-1 w-2 h-2 bg-lime rounded-full"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </div></div>
                    <div className="bg-bone/[0.04] rounded-2xl rounded-tl-md px-4 py-3 border border-bone/[0.04]">
                      <p className="font-mono text-[11px] text-bone/45 leading-[1.8]">Yes! ₹200 fits. You'll have ₹120 left. Enjoy! 🍜</p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section >

      {/* Testimonials */}
      < section className="py-20 px-6 md:px-12 lg:px-20 relative" >
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
      </section >

      {/* CTA */}
      <section className="py-24 px-6 md:px-12 lg:px-20 relative overflow-hidden" >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bone/[0.06] to-transparent z-10" />

        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Main Lime Orb - sweeps across */}
          <motion.div
            className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-lime/[0.04] rounded-full blur-[150px]"
            animate={{
              x: ['0%', '50%', '0%'],
              y: ['0%', '30%', '0%'],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Secondary Bone Orb - rises from bottom right */}
          <motion.div
            className="absolute -bottom-[20%] -right-[10%] w-[400px] h-[400px] bg-bone/[0.03] rounded-full blur-[120px]"
            animate={{
              x: ['0%', '-40%', '0%'],
              y: ['0%', '-30%', '0%'],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />

          {/* Small Accent Rust Orb - gentle drift in center */}
          <motion.div
            className="absolute top-[30%] left-[30%] w-[300px] h-[300px] bg-rust/[0.02] rounded-full blur-[100px]"
            animate={{
              x: ['0%', '20%', '0%'],
              y: ['0%', '-20%', '0%'],
              scale: [0.8, 1, 0.8],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
          />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
            <motion.h2 variants={fadeUp} custom={0} className="font-display font-extrabold text-[clamp(2.5rem,6vw,4.5rem)] text-bone leading-[1.1] tracking-tight mb-8">
              <div className="tl-main">Spend with <em className="font-serif italic text-lime/80 font-normal">intention,</em><br />not regret.</div>
            </motion.h2>

            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="group inline-flex items-center gap-2.5 bg-lime text-ink font-display font-bold text-[14px] px-9 py-4 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_40px_rgba(200,241,53,0.25)] hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                Start For Free
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section >

      <Footer />
    </div >
  );
}
