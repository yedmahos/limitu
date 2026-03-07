import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import Footer from '../components/Footer';

const ease = [0.16, 1, 0.3, 1]; // ultra-smooth sleek easing

const fadeUpText = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease } }
};

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.15 } }
};

/* ───── Minimal Section Component ───── */
function FadeSection({ children, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUpText}
      className={className}
    >
      {children}
    </motion.section>
  );
}

const Divider = () => (
  <div className="w-full max-w-5xl mx-auto h-px bg-gradient-to-r from-transparent via-bone/[0.08] to-transparent my-12 md:my-20" />
);

export default function About() {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"]
  });

  const yHero = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-ink text-bone font-mono relative" ref={scrollRef}>
      {/* Background Noise/Grain for texture */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.015]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
      }} />

      {/* ── 1. MINIMAL HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-lime/[0.03] rounded-full blur-[120px] pointer-events-none" />

        <motion.div style={{ y: yHero, opacity: opacityHero }} className="text-center z-10 w-full max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="flex flex-col gap-2 md:gap-4 items-center justify-center"
          >
            <div className="overflow-hidden">
              <motion.h1 variants={fadeUpText} className="font-display font-bold text-[clamp(2.5rem,8vw,6.5rem)] leading-[1.05] tracking-tight">
                Finance shouldn't be
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1 variants={fadeUpText} className="font-display font-bold text-[clamp(2.5rem,8vw,6.5rem)] leading-[1.05] tracking-tight text-bone/40">
                a spreadsheet.
              </motion.h1>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-bone/20">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-bone/20 to-transparent" />
        </motion.div>
      </section>

      {/* ── 2. THE ETHOS ── */}
      <div className="px-6 md:px-12 lg:px-20 max-w-5xl mx-auto pb-16">
        <FadeSection className="py-16 md:py-24">
          <p className="font-display text-[clamp(1.5rem,4vw,3.2rem)] leading-[1.2] tracking-tight text-bone/90 max-w-4xl">
            We built <span className="text-lime">Limit U</span> because the existing tools were built for accountants, not students. You don't need complex graphs. You just need to know <span className="font-serif italic text-bone/50">what you can spend today</span>.
          </p>
        </FadeSection>

        <Divider />

        {/* ── 3. PHILOSOPHY ── */}
        <div className="py-8 md:py-16 space-y-16 md:space-y-24">
          {[
            {
              num: "01",
              title: "Subtract the noise.",
              desc: "We stripped away categories, charts, and financial jargon. By distilling your monthly budget into a single daily number, we've made tracking completely frictionless."
            },
            {
              num: "02",
              title: "Guided by intuition.",
              desc: "Money is emotional. Instead of making you feel guilty for spending, LIM AI acts as an objective, non-judgmental mentor that helps you make decisions in real-time."
            },
            {
              num: "03",
              title: "Honesty as a design system.",
              desc: "We don't sell your data, we don't push credit cards, and we don't encourage you to spend more. Our only goal is to give you clarity and peace of mind."
            }
          ].map((item) => (
            <FadeSection key={item.num} className="grid md:grid-cols-[100px_1fr] gap-6 md:gap-12 items-start group">
              <span className="font-mono text-[14px] text-lime/40 group-hover:text-lime transition-colors duration-500">
                {item.num}
              </span>
              <div className="max-w-2xl">
                <h3 className="font-display font-medium text-[clamp(1.5rem,3vw,2.5rem)] text-bone mb-6 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[13px] md:text-[15px] font-mono text-bone/40 leading-[1.8] group-hover:text-bone/60 transition-colors duration-500">
                  {item.desc}
                </p>
              </div>
            </FadeSection>
          ))}
        </div>

        <Divider />

        {/* ── 4. MINIMAL CTA ── */}
        <FadeSection className="py-20 md:py-24 flex flex-col items-center text-center">
          <h2 className="font-display font-bold text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.1] tracking-tight mb-8">
            Know your limit.<br /><span className="text-lime font-serif italic font-normal">Own your month.</span>
          </h2>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/auth"
              className="group inline-flex items-center gap-3 bg-bone text-ink font-display font-bold text-[14px] px-8 py-4 rounded-full transition-all duration-300 hover:bg-lime hover:shadow-[0_0_40px_rgba(200,241,53,0.3)]"
            >
              Start using LIM
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </motion.div>
        </FadeSection>
      </div>

      <Footer />
    </div>
  );
}
