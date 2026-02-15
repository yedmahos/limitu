import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [end, duration]);

    return <span>{count.toLocaleString()}{suffix}</span>;
};

const Hero = () => {
    const { user } = useAuth();

    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-50 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto space-y-8"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm md:text-base backdrop-blur-sm mb-4"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="font-medium text-muted-foreground">The #1 Financial Control App for Students</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                        Control Your Money. <br />
                        <span className="text-primary">Don't Let It Control You.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Stop the month-end broke syndrome. Limit U converts your monthly allowance into smart daily limits, powered by AI to keep you on track.
                    </p>

                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap items-center justify-center gap-8 py-6"
                    >
                        <div className="flex items-center gap-2">
                            <i className="fi fi-rr-users text-2xl text-primary"></i>
                            <div className="text-left">
                                <div className="text-2xl font-bold"><AnimatedCounter end={5000} suffix="+" /></div>
                                <div className="text-xs text-muted-foreground">Active Users</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fi fi-rr-chart-line-up text-2xl text-emerald-500"></i>
                            <div className="text-left">
                                <div className="text-2xl font-bold"><AnimatedCounter end={75} suffix="%" /></div>
                                <div className="text-xs text-muted-foreground">Save More</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fi fi-sr-star text-2xl text-yellow-500"></i>
                            <div className="text-left">
                                <div className="text-2xl font-bold">4.9/5</div>
                                <div className="text-xs text-muted-foreground">User Rating</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                    >
                        <Link to={user ? "/dashboard" : "/auth"}>
                            <Button size="lg" className="rounded-full text-lg h-14 px-8 w-full sm:w-auto group">
                                {user ? "Go to Dashboard" : "Start Managing Smart"}
                                <i className="fi fi-rr-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                            </Button>
                        </Link>
                        <Link to="/how-it-works">
                            <Button variant="outline" size="lg" className="rounded-full text-lg h-14 px-8 w-full sm:w-auto border-white/10 bg-white/5 hover:bg-white/10">
                                See How It Works
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="pt-12 flex items-center justify-center gap-8 text-muted-foreground text-sm font-medium"
                    >
                        <div className="flex items-center gap-2">
                            <i className="fi fi-rr-shield-check text-xl text-green-500"></i>
                            <span>100% Secure</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fi fi-rr-bolt text-xl text-yellow-500"></i>
                            <span>Instant Insights</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export { Hero };
