import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const HowItWorks = () => {
    const steps = [
        {
            icon: 'wallet',
            title: "Connect & Set",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20"
        },
        {
            icon: 'brain',
            title: "AI Analysis",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20"
        },
        {
            icon: 'bell',
            title: "Real-time Alerts",
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            border: "border-orange-500/20"
        },
        {
            icon: 'chart-line-up',
            title: "Build Wealth",
            color: "text-green-500",
            bg: "bg-green-500/10",
            border: "border-green-500/20"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-24"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                            Simple flow. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-500">
                                Powerful control.
                            </span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Transforming your financial life takes just four simple steps.
                        </p>
                    </motion.div>

                    {/* Visual Flowchart */}
                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0" />

                        {/* Connecting Line (Mobile) */}
                        <div className="block lg:hidden absolute top-0 bottom-0 left-1/2 w-0.5 bg-border -translate-x-1/2 z-0" />

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2, duration: 0.5 }}
                                    className="flex flex-col items-center"
                                >
                                    {/* Icon Circle */}
                                    <div className={`p-6 rounded-full ${step.bg} ${step.border} border-2 backdrop-blur-sm mb-6 relative group bg-card`}>
                                        <i className={`fi fi-rr-${step.icon} text-3xl ${step.color} transition-transform duration-300 group-hover:scale-110`}></i>

                                        {/* Step Number Badge */}
                                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center font-bold text-sm text-foreground">
                                            {index + 1}
                                        </div>
                                    </div>

                                    {/* Content Card - Minimal */}
                                    <div className="text-center bg-card/50 p-6 rounded-2xl border border-border hover:border-primary/50 transition-colors w-full max-w-xs backdrop-blur-sm shadow-sm">
                                        <h3 className="text-lg font-bold mb-2 text-foreground">{step.title}</h3>
                                        {/* Visual Cue instead of text */}
                                        <div className="flex justify-center mt-2">
                                            {index < steps.length - 1 ? (
                                                <i className="fi fi-rr-arrow-right text-xl text-muted-foreground rotate-90 lg:rotate-0"></i>
                                            ) : (
                                                <i className="fi fi-rr-shield-check text-xl text-green-500/50"></i>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-center mt-32"
                    >
                        <p className="text-muted-foreground text-sm uppercase tracking-widest mb-4">Ready to start?</p>
                        <Link to="/auth">
                            <Button size="lg" className="rounded-full text-lg h-14 px-8 group">
                                Get Started Now
                                <i className="fi fi-rr-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default HowItWorks;
