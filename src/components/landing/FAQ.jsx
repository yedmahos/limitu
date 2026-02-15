import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: "How does Limit U calculate my daily limit?",
        answer: "We take your monthly allowance, subtract fixed expenses, and divide it intelligently across the month. You can also set weekend preferences to save more for weekends."
    },
    {
        question: "Is my financial data secure?",
        answer: "Absolutely! We use bank-level encryption and never store sensitive information. Your data stays on your device and is only used to provide personalized insights."
    },
    {
        question: "Can I adjust my daily limit manually?",
        answer: "Yes! While we calculate smart limits automatically, you can always edit them manually to fit your needs. Just click the edit icon on your dashboard."
    },
    {
        question: "What makes the AI coach different?",
        answer: "Our AI coach is powered by Google's Gemini and understands student life. It gives contextual advice based on your spending patterns, not generic tips."
    },
    {
        question: "Is Limit U free to use?",
        answer: "Yes! Limit U is completely free for students. We believe financial literacy should be accessible to everyone."
    },
    {
        question: "Can I track multiple categories?",
        answer: "Absolutely! Track spending across Food, Transport, Shopping, and more. Get visual breakdowns to see exactly where your money goes."
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-background relative" id="faq">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <div className="inline-flex items-center gap-2 mb-4">
                        <i className="fi fi-rr-interrogation text-2xl text-primary"></i>
                        <span className="text-sm font-semibold text-primary uppercase tracking-wider">FAQ</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Got Questions? <span className="text-primary">We've Got Answers</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Everything you need to know about Limit U
                    </p>
                </motion.div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.05 }}
                        >
                            <Card
                                className={`p-6 cursor-pointer transition-all duration-300 ${openIndex === idx ? 'border-primary/50 shadow-lg' : 'hover:border-border'
                                    }`}
                                onClick={() => toggleFAQ(idx)}
                            >
                                <div className="flex justify-between items-center gap-4">
                                    <h3 className="font-semibold text-lg">{faq.question}</h3>
                                    <motion.div
                                        animate={{ rotate: openIndex === idx ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <i className="fi fi-rr-angle-down text-xl text-muted-foreground flex-shrink-0"></i>
                                    </motion.div>
                                </div>

                                <AnimatePresence>
                                    {openIndex === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="text-muted-foreground mt-4 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <p className="text-muted-foreground mb-4">Still have questions?</p>
                    <a href="mailto:team.limitu@gmail.com" className="text-primary font-semibold hover:underline">
                        Contact our support team →
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export { FAQ };
