import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
    {
        number: "01",
        icon: "chart-histogram",
        title: "Daily Spending Limits",
        description: "Your monthly allowance converted into smart daily budgets that adapt to your lifestyle.",
        color: "text-blue-400"
    },
    {
        number: "02",
        icon: "brain",
        title: "AI Finance Coach",
        description: "Get personalized spending advice powered by Gemini AI. Ask anything about your finances.",
        color: "text-purple-400"
    },
    {
        number: "03",
        icon: "lock",
        title: "Discipline, Not Just Tracking",
        description: "Real-time alerts and insights that help you build lasting financial habits.",
        color: "text-green-400"
    },
    {
        number: "04",
        icon: "wallet",
        title: "Weekend Boosts",
        description: "Flexible budgeting that saves extra for weekends when you need it most.",
        color: "text-orange-400"
    }
];

const Features = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleStep = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-background relative" id="features">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            What We Provide?
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Four simple steps to take control of your finances
                        </p>
                    </motion.div>
                </div>

                {/* Numbered Steps Accordion */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                        >
                            <Card
                                className={`cursor-pointer transition-all duration-300 overflow-hidden ${openIndex === idx ? 'border-primary/50 shadow-lg' : 'hover:border-border'
                                    }`}
                                onClick={() => toggleStep(idx)}
                            >
                                {/* Header - Always Visible */}
                                <div className="p-6 flex items-center gap-4">
                                    {/* Number Badge */}
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                                        <span className="text-xl font-bold text-primary">{step.number}</span>
                                    </div>

                                    {/* Icon */}
                                    <div className={`flex-shrink-0 ${step.color}`}>
                                        <i className={`fi fi-rr-${step.icon} text-3xl`}></i>
                                    </div>

                                    {/* Title */}
                                    <h3 className="flex-1 font-bold text-xl">{step.title}</h3>

                                    {/* Chevron */}
                                    <motion.div
                                        animate={{ rotate: openIndex === idx ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex-shrink-0"
                                    >
                                        <i className="fi fi-rr-angle-down text-xl text-muted-foreground"></i>
                                    </motion.div>
                                </div>

                                {/* Description - Expandable */}
                                <AnimatePresence>
                                    {openIndex === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 pt-0">
                                                <p className="text-muted-foreground leading-relaxed pl-16">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export { Features };
