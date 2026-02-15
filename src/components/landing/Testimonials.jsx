import React from 'react';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';

const testimonials = [
    {
        name: "Priya Sharma",
        role: "Engineering Student",
        avatar: "PS",
        rating: 5,
        text: "Limit U completely changed how I manage my allowance. No more broke weeks before the month ends!"
    },
    {
        name: "Rahul Verma",
        role: "MBA Student",
        avatar: "RV",
        rating: 5,
        text: "The AI coach is like having a financial advisor in my pocket. It's helped me save 40% more each month."
    },
    {
        name: "Ananya Patel",
        role: "Medical Student",
        avatar: "AP",
        rating: 5,
        text: "Weekend boosts are a game-changer. I can enjoy my weekends without guilt or overspending."
    }
];

const Testimonials = () => {
    return (
        <section className="py-24 bg-secondary/30 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Loved by <span className="text-primary">Students Everywhere</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Join thousands of students who've taken control of their finances
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                        >
                            <Card className="p-6 h-full hover:shadow-xl transition-shadow duration-300 relative">
                                <i className="fi fi-rr-quote-right absolute top-4 right-4 text-3xl text-primary/20"></i>

                                {/* Rating */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <i key={i} className="fi fi-rr-star text-base fill-yellow-500 text-yellow-500"></i>
                                    ))}
                                </div>

                                {/* Testimonial Text */}
                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                    "{testimonial.text}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-bold">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{testimonial.name}</div>
                                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-12"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="flex -space-x-2">
                            {['PS', 'RV', 'AP', 'SK', 'MJ'].map((initials, i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-bold">
                                    {initials}
                                </div>
                            ))}
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                            Join 5,000+ students managing smarter
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export { Testimonials };
