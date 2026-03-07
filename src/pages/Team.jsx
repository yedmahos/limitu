import { motion } from 'framer-motion';
import Footer from '../components/Footer';

const ease = [0.25, 1, 0.5, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease },
});

const team = [
  {
    name: 'Soham Dey',
    role: 'Founder & CEO',
    initials: 'SD',
    accent: 'lime',
    bio: 'Founder. Builds the product.',  
  },
  {
    name: 'Suparna Raha',
    role: 'Co-Founder & COO',
    initials: 'SR',
    accent: 'lime',
    bio: 'Co-Founder. Runs operations.',

  },
];

const Divider = () => <div className="mx-6 md:mx-20 h-px bg-bone/[0.05]" />;

export default function Team() {
  return (
    <div className="min-h-screen bg-ink text-bone flex flex-col">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative px-6 md:px-20 pt-32 pb-16 overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-0 w-[500px] h-[500px] bg-lime/[0.03] rounded-full blur-[160px]" />
        <div className="max-w-5xl mx-auto">
          <motion.p {...fadeUp(0)} className="font-mono text-[10px] tracking-[0.3em] text-bone/20 uppercase mb-4">
            The team
          </motion.p>
          <motion.h1 {...fadeUp(0.07)} className="font-display font-bold text-[clamp(2.6rem,6vw,5rem)] leading-[1.05] tracking-tight">
            Meet the <span class="font-serif italic font-normal text-lime/60">founders.</span>
          </motion.h1>
        </div>
      </section>

      <Divider />

      {/* ── MEMBERS ──────────────────────────────────────── */}
      <section className="px-6 md:px-20 py-16">
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-5">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.13 + 0.05, duration: 0.65, ease }}
              className="group relative rounded-3xl overflow-hidden border border-bone/[0.07] bg-[#0e1512]"
            >
              {/* Upper card — avatar area */}
              <div className="relative flex items-center justify-center h-56 overflow-hidden">
                {/* Radial glow background */}
                <div className="absolute inset-0 bg-gradient-to-b from-lime/[0.12] via-lime/[0.04] to-transparent" />
                <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-64 h-64 bg-lime/[0.15] rounded-full blur-[60px]" />

                {/* Circle avatar */}
                <div className="relative z-10 w-24 h-24 rounded-full bg-[#0a0f0d] border border-lime/[0.15] flex items-center justify-center shadow-[0_0_40px_rgba(200,241,53,0.08)]">
                  <span className="font-display font-bold text-[22px] text-lime">{member.initials}</span>
                </div>
              </div>

              {/* Lower card — info */}
              <div className="px-7 pb-7 pt-5 text-center border-t border-bone/[0.05]">
                <h3 className="font-display font-bold text-[17px] tracking-tight text-bone mb-1">{member.name}</h3>
                <p className="font-mono text-[11px] text-lime/70 tracking-wide mb-4">{member.role}</p>
                <p className="font-mono text-[11px] text-bone/30 leading-[1.85] tracking-wide">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── FOOTER CTA ───────────────────────────────────── */}
      <section className="px-6 md:px-20 py-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <motion.div {...fadeUp(0.1)}>
            <h2 className="font-display font-bold text-[clamp(1.5rem,3vw,2.2rem)] tracking-tight leading-[1.1]">
              Get in touch.
            </h2>
          </motion.div>
          <motion.div {...fadeUp(0.18)} className="shrink-0">
            <a
              href="mailto:team.limitu@gmail.com"
              className="inline-flex items-center gap-2 font-mono text-[11px] bg-lime text-ink px-6 py-3 rounded-xl hover:bg-lime/85 transition-all tracking-wide font-medium"
            >
              Get in touch
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
