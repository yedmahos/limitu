import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';

const Walkthrough = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    const steps = [
        {
            title: "Welcome to Limit U",
            description: "Your intelligent financial operating system. We're here to help you build wealth, not just track spending.",
            target: null // Center modal
        },
        {
            title: "Your Daily Limit",
            description: "Use this number as your compass. If you stay under this today, you're winning.",
            target: "daily-card"
        },
        {
            title: "LIM AI Coach",
            description: "I'm right here. tap 'LIM AI' anytime to ask for advice or simulate a purchase.",
            target: "coach-widget"
        }
    ];

    const currentStep = steps[step];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            >
                <motion.div
                    key={step}
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-[#0f172a] border border-white/10 p-8 rounded-3xl max-w-sm w-full relative shadow-2xl"
                >
                    {/* Progress Dots */}
                    <div className="flex gap-2 mb-6 justify-center">
                        {steps.map((_, i) => (
                            <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-8 bg-primary' : 'w-2 bg-white/20'}`} />
                        ))}
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold mb-3">{currentStep.title}</h2>
                        <p className="text-muted-foreground leading-relaxed">{currentStep.description}</p>
                    </div>

                    <Button onClick={handleNext} className="w-full h-12 text-base">
                        {step === steps.length - 1 ? 'Let\'s Go' : 'Next'} <i className="fi fi-rr-arrow-right ml-2 text-base"></i>
                    </Button>

                    <button onClick={onComplete} className="absolute top-4 right-4 text-muted-foreground p-2 hover:text-white">
                        <i className="fi fi-rr-cross text-base"></i>
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Walkthrough;
