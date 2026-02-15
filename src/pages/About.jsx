import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-6">
                <div className="container mx-auto px-6 max-w-5xl">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-24"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Redefining Student <span className="text-primary">Finance</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            We're on a mission to help every student build financial discipline, one day at a time.
                        </p>
                    </motion.div>

                    {/* Our Story */}
                    <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl font-bold mb-6">The Story</h2>
                            <p className="text-muted-foreground leading-relaxed mb-6">
                                Limit U started in a college dorm room. We realized that while everyone talks about "budgeting," nobody teaches students how to actually *control* their daily spending habits.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Most students run out of money before the month ends simply because they don't know their "safe to spend" number for today. We built Limit U to fix that—using AI to simplify complex finances into a single daily number.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-3xl blur-2xl top-4 left-4" />
                            <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 p-8 rounded-3xl relative">
                                <i className="fi fi-rr-rocket-lunch text-6xl text-primary mb-4 block"></i>
                                <span className="text-2xl font-bold">Built by Students, <br /> For Students.</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Values */}
                    <div className="mb-32">
                        <h2 className="text-3xl font-bold text-center mb-16">Why We Do It</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: "diamond",
                                    title: "Simplicity First",
                                    desc: "Finance shouldn't be complicated. We believe in the power of simple, daily actions."
                                },
                                {
                                    icon: "brain-circuit",
                                    title: "AI Powered",
                                    desc: "We leverage GenAI to provide personalized, judgment-free financial coaching."
                                },
                                {
                                    icon: "shield-check",
                                    title: "Privacy Focused",
                                    desc: "Your data is yours. We don't sell it. We just help you optimize it."
                                }
                            ].map((value, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className="p-8 rounded-2xl bg-secondary/20 border border-white/5 hover:border-primary/30 transition-colors text-center"
                                >
                                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
                                        <i className={`fi fi-rr-${value.icon} text-2xl`}></i>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                                    <p className="text-muted-foreground">{value.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-6">Join the Movement</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                            Ready to take control of your financial future? Start your journey with Limit U today.
                        </p>
                        <Link to="/auth">
                            <Button size="lg" className="rounded-full px-8 h-12 text-lg">
                                Get Started <i className="fi fi-rr-arrow-right ml-2 text-sm mt-1"></i>
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default About;
