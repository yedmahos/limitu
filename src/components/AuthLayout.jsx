import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

export default function AuthLayout({ children }) {
    const location = useLocation();
    const isSignIn = location.pathname === '/signin';

    return (
        <div className="min-h-[100dvh] lg:h-[100dvh] lg:min-h-0 flex grain relative lg:overflow-hidden bg-ink">

            {/* Global Top-Left Navigation */}
            <div className="absolute top-6 left-6 md:top-8 md:left-8 z-50">
                <Link to="/" className="flex items-center gap-2 font-mono text-[11px] text-bone/40 hover:text-bone/80 transition-colors bg-bone/[0.03] backdrop-blur-md px-3 py-1.5 rounded-lg border border-bone/[0.05]">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                    Home
                </Link>
            </div>

            {/* ─── LEFT PANEL (Animated Visual Showcase) ─── */}
            <div className="hidden lg:flex w-[55%] relative flex-col justify-center items-center overflow-hidden border-r border-bone/[0.05]">

                {/* Ambient Glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-lime/[0.035] rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-rust/[0.02] rounded-full blur-[120px]" />

                {/* Grid Background */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'linear-gradient(rgba(245,240,232,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,240,232,0.5) 1px, transparent 1px)',
                    backgroundSize: '100px 100px',
                }} />

                {/* Dynamic Mockup Showcase */}
                <div className="relative w-full max-h-[380px] lg:h-[40vh] xl:h-[420px] flex items-center justify-center pointer-events-none perspective-[2000px] z-10 mt-0 mb-4 xl:mt-8 xl:mb-8">

                    {/* Main Dashboard Mockup */}
                    <motion.img
                        initial={{ opacity: 0, y: 50, scale: 0.9, rotateY: 15 }}
                        animate={{ opacity: 1, y: [0, -20, 0], scale: 1, rotateY: 15 }}
                        transition={{
                            opacity: { duration: 1, ease: "easeOut" },
                            scale: { duration: 1, ease: "easeOut" },
                            y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                        }}
                        src="/dashboard-tilted.png"
                        alt="Dashboard mockup"
                        className="absolute w-[280px] lg:w-[320px] xl:w-[420px] drop-shadow-[0_45px_100px_rgba(0,0,0,0.6)] z-10"
                    />

                    {/* LIM AI Mockup (overlapping offset) */}
                    <motion.img
                        initial={{ opacity: 0, x: -50, y: 50, scale: 0.8, rotateZ: -5 }}
                        animate={{ opacity: 1, x: -100, y: [40, 20, 40], scale: 0.95, rotateZ: -5 }}
                        transition={{
                            opacity: { duration: 1, delay: 0.3 },
                            scale: { duration: 1, delay: 0.3 },
                            x: { duration: 1, delay: 0.3, type: "spring", damping: 20 },
                            y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                        }}
                        src="/lim.png"
                        alt="LIM AI mockup"
                        className="absolute w-[160px] lg:w-[180px] xl:w-[240px] drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-20"
                    />

                </div>

                {/* Text content below showcase */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="relative z-20 text-center max-w-[440px] mt-4 mb-4 xl:mt-10 xl:mb-8"
                >
                    <h2 className="font-display font-bold text-[28px] xl:text-[36px] text-bone tracking-tight mb-2 xl:mb-4 leading-[1.1]">
                        Mindful spending,<br /> <span className="text-lime italic font-serif font-normal text-[32px] xl:text-[40px]">automated.</span>
                    </h2>
                    <p className="font-mono text-[12px] text-bone/40 leading-[1.8] max-w-[380px] mx-auto">
                        Set your limits, chat with your AI mentor, and build wealth one day at a time without the confusing spreadsheets.
                    </p>
                </motion.div>

                {/* Bottom Logo watermark */}
                <div className="absolute bottom-12 left-12 opacity-30">
                    <Logo size={24} />
                </div>
            </div>

            {/* ─── RIGHT PANEL (Form/Content) ─── */}
            <div className="flex-1 flex flex-col items-center justify-center relative overflow-y-auto bg-[radial-gradient(circle_at_center,rgba(200,241,53,0.02)_0%,transparent_100%)]">

                {/* Mobile styling - simple background */}
                <div className="lg:hidden absolute inset-0 bg-ink z-0">
                    <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-lime/[0.04] rounded-full blur-[100px]" />
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(245,240,232,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,240,232,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                </div>

                <div className="w-full lg:h-auto flex flex-col justify-center max-w-[380px] lg:max-w-[440px] px-6 py-6 lg:py-0 relative z-10">
                    {/* Glass Card Form wrapper */}
                    <div className="w-full lg:bg-white/[0.02] lg:border lg:border-white/[0.05] lg:rounded-[2rem] lg:p-6 xl:p-8 lg:shadow-2xl lg:backdrop-blur-xl">

                        {/* Mobile Logo centered above form */}
                        <div className="lg:hidden flex justify-center mb-4">
                            <Logo size={28} />
                        </div>

                        {/* Auth Mode Toggle Pill (Mobile & Desktop) */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="mb-6 w-full"
                        >
                            <div className="flex bg-bone/[0.04] rounded-2xl p-1.5 border border-bone/[0.06] backdrop-blur-md shadow-inner">
                                <Link
                                    to="/signin"
                                    className={`flex-1 py-2.5 text-center rounded-xl font-display font-bold text-[13px] tracking-wide transition-all duration-300 ${isSignIn ? 'bg-lime text-ink shadow-[0_4px_16px_rgba(200,241,53,0.2)] cursor-default' : 'text-bone/40 hover:text-bone/70 cursor-pointer'}`}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className={`flex-1 py-2.5 text-center rounded-xl font-display font-bold text-[13px] tracking-wide transition-all duration-300 ${!isSignIn ? 'bg-lime text-ink shadow-[0_4px_16px_rgba(200,241,53,0.2)] cursor-default' : 'text-bone/40 hover:text-bone/70 cursor-pointer'}`}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </motion.div>

                        {/* Child Form Container */}
                        <div className="w-full">
                            {children}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
