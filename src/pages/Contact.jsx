import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import Footer from '../components/Footer';

const ease = [0.16, 1, 0.3, 1];

const fadeUpText = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease } }
};

const staggerChildren = {
    visible: { transition: { staggerChildren: 0.15 } }
};

// Custom Input Field with Floating Label
function Field({ label, type = "text", value, onChange, isTextArea, error }) {
    const [focused, setFocused] = useState(false);
    const active = focused || value.length > 0;

    return (
        <div className="relative group w-full">
            {isTextArea ? (
                <textarea
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className={`w-full bg-bone/[0.03] text-bone font-mono text-[13px] rounded-xl outline-none transition-all duration-300 px-4 pt-6 pb-2 min-h-[120px] resize-y ${error ? 'border border-rust/50 shadow-[0_0_15px_rgba(232,93,58,0.1)]'
                        : focused ? 'border border-lime/50 bg-bone/[0.05] shadow-[0_0_20px_rgba(200,241,53,0.1)]'
                            : 'border border-bone/[0.08] hover:border-bone/20 hover:bg-bone/[0.04]'
                        }`}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className={`w-full bg-bone/[0.03] text-bone font-mono text-[13px] rounded-xl outline-none transition-all duration-300 px-4 pt-5 pb-2 ${error ? 'border border-rust/50 shadow-[0_0_15px_rgba(232,93,58,0.1)]'
                        : focused ? 'border border-lime/50 bg-bone/[0.05] shadow-[0_0_20px_rgba(200,241,53,0.1)]'
                            : 'border border-bone/[0.08] hover:border-bone/20 hover:bg-bone/[0.04]'
                        }`}
                />
            )}

            <label
                className={`absolute left-4 font-mono transition-all duration-300 pointer-events-none ${error ? 'text-rust'
                    : active ? 'text-lime'
                        : 'text-bone/40 group-hover:text-bone/60'
                    } ${active ? 'text-[9px] top-2 uppercase tracking-wider'
                        : isTextArea ? 'text-[13px] top-[14px]' : 'text-[13px] top-[14px]'
                    }`}
            >
                {error || label}
            </label>
        </div>
    );
}

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

export default function Contact() {
    const scrollRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ["start start", "end start"]
    });

    const yHero = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle');

    const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('loading');
        // Simulate network request
        setTimeout(() => {
            setStatus('success');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-ink text-bone font-mono relative" ref={scrollRef}>
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.015]" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
            }} />

            {/* ── MINIMAL HERO ── */}
            <section className="relative min-h-[70vh] flex flex-col justify-center items-center px-6 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-lime/[0.03] rounded-full blur-[120px] pointer-events-none" />

                <motion.div style={{ y: yHero, opacity: opacityHero }} className="text-center z-10 w-full max-w-5xl mx-auto pt-24">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerChildren}
                        className="flex flex-col gap-2 md:gap-4 items-center justify-center"
                    >
                        <div className="overflow-hidden">
                            <motion.h1 variants={fadeUpText} className="font-display font-bold text-[clamp(2.5rem,8vw,6.5rem)] leading-[1.05] tracking-tight">
                                Get in touch
                            </motion.h1>
                        </div>
                        <div className="overflow-hidden">
                            <motion.p variants={fadeUpText} className="font-mono mt-6 text-[14px] text-bone/40 max-w-xl mx-auto leading-relaxed">
                                Whether you have a question, feedback, or just want to say hi, our inbox is always open.
                            </motion.p>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ── CONTACT INFO & FORM ── */}
            <div className="px-6 md:px-12 lg:px-20 max-w-6xl mx-auto pb-16">
                <FadeSection className="pb-24 grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20">

                    {/* Left side: Contact Blocks */}
                    <div className="flex flex-col gap-6">
                        {/* Email Block */}
                        <a href="mailto:team.limitu@gmail.com" className="group block p-8 rounded-3xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 flex-1">
                            <div className="w-12 h-12 rounded-2xl bg-lime/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" /></svg>
                            </div>
                            <h3 className="font-display font-medium text-2xl text-bone mb-2">Email Us</h3>
                            <p className="text-bone/40 text-[13px] mb-6">Drop us an email and we'll get back to you as soon as possible.</p>
                            <span className="text-lime text-[14px] flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                                team.limitu@gmail.com
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </span>
                        </a>

                        {/* WhatsApp / Mobile Contact Block */}
                        <a href="https://wa.me/919475565982" target="_blank" rel="noopener noreferrer" className="group block p-8 rounded-3xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 flex-1">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-[#25D366]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-colors transition-transform duration-300">
                                <svg className="w-6 h-6 text-bone group-hover:text-[#25D366] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                            </div>
                            <h3 className="font-display font-medium text-2xl text-bone mb-2">WhatsApp</h3>
                            <p className="text-bone/40 text-[13px] mb-6">Need a quick response? Message us directly on WhatsApp and we'll reply right there.</p>
                            <span className="text-bone/60 group-hover:text-[#25D366] text-[14px] flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                                +91 94755 65982
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </span>
                        </a>
                    </div>

                    {/* Right side: Contact Form */}
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2rem] p-8 lg:p-12 relative overflow-hidden">
                        {/* Background glow for form */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-lime/[0.03] rounded-full blur-[80px] pointer-events-none" />

                        <h3 className="font-display font-medium text-[28px] text-bone mb-8">Send a message</h3>

                        <AnimatePresence mode="wait">
                            {status === 'success' ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center text-center py-12 h-full"
                                >
                                    <div className="w-16 h-16 rounded-full bg-lime/10 flex items-center justify-center mb-6">
                                        <svg className="w-8 h-8 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                    </div>
                                    <h4 className="font-display font-medium text-2xl text-bone mb-3">Message sent!</h4>
                                    <p className="font-mono text-[13px] text-bone/40 max-w-xs">
                                        Thanks for reaching out, {form.name.split(' ')[0] || 'there'}. We'll get back to you shortly.
                                    </p>
                                    <button
                                        onClick={() => { setForm({ name: '', email: '', message: '' }); setStatus('idle'); }}
                                        className="mt-8 px-6 py-2.5 rounded-full border border-bone/10 text-bone/60 font-mono text-[12px] hover:bg-bone/5 hover:text-bone transition-colors cursor-pointer"
                                    >
                                        Send another message
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-4 relative z-10"
                                >
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <Field
                                            label="Full Name"
                                            value={form.name}
                                            onChange={update('name')}
                                        />
                                        <Field
                                            label="Email Address"
                                            type="email"
                                            value={form.email}
                                            onChange={update('email')}
                                        />
                                    </div>

                                    <Field
                                        label="How can we help?"
                                        isTextArea
                                        value={form.message}
                                        onChange={update('message')}
                                    />

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={status === 'loading' || !form.name || !form.email || !form.message}
                                            className="group w-full md:w-auto px-8 py-3.5 bg-lime text-ink font-display font-bold text-[14px] rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:shadow-[0_8px_30px_rgba(200,241,53,0.2)] hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden"
                                        >
                                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                                            {status === 'loading' ? (
                                                <span className="flex items-center gap-2">
                                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-ink/15 border-t-ink rounded-full" />
                                                    Sending...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    Send Message
                                                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </FadeSection>
            </div>

            <Footer />
        </div>
    );
}
