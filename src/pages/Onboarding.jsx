import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useSpending } from '../context/SpendingContext';
import { cn } from '../lib/utils'; // Make sure utils is imported correctly

const Onboarding = () => {
    const navigate = useNavigate();
    const { setAllowance, setFixedExpenses, setWeekendBias, allowance } = useSpending();
    const [step, setStep] = useState(1);

    // Local state for inputs
    const [localAllowance, setLocalAllowance] = useState('');
    const [localFixed, setLocalFixed] = useState('');
    const [localBias, setLocalBias] = useState('balanced');

    const handleNext = () => {
        if (step === 3) {
            // Save all data
            setAllowance(Number(localAllowance));
            setFixedExpenses(Number(localFixed));
            setWeekendBias(localBias);
            navigate('/dashboard');
        } else {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const fadeIn = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
        transition: { duration: 0.3 }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center bg-background">
            <div className="w-full max-w-lg">
                {/* Progress Bar */}
                <div className="w-full h-1 bg-secondary rounded-full mb-8 overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: '33%' }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" {...fadeIn}>
                            <Card className="p-8">
                                <h2 className="text-2xl font-bold mb-2">Let's talk money</h2>
                                <p className="text-muted-foreground mb-6">What is your total monthly allowance?</p>

                                <div className="relative mb-6">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                                    <Input
                                        type="number"
                                        placeholder="5000"
                                        className="pl-8 text-lg"
                                        value={localAllowance}
                                        onChange={(e) => setLocalAllowance(e.target.value)}
                                        autoFocus
                                    />
                                </div>

                                <p className="text-sm text-muted-foreground mb-8">
                                    Don't worry, this stays private. We just use it to calculate your safe limit.
                                </p>

                                <Button
                                    className="w-full"
                                    onClick={handleNext}
                                    disabled={!localAllowance}
                                >
                                    Next <i className="fi fi-rr-arrow-right ml-2 text-base"></i>
                                </Button>
                            </Card>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" {...fadeIn}>
                            <Card className="p-8">
                                <div className="mb-6">
                                    <Button variant="ghost" size="sm" className="-ml-4 mb-2 text-muted-foreground" onClick={handleBack}>
                                        <i className="fi fi-rr-arrow-left mr-2 text-base"></i> Back
                                    </Button>
                                    <h2 className="text-2xl font-bold mb-2">Fixed Expenses</h2>
                                    <p className="text-muted-foreground">Any unavoidable costs? (Rent, Mess, Bus Pass, etc.)</p>
                                </div>

                                <div className="relative mb-6">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        className="pl-8 text-lg"
                                        value={localFixed}
                                        onChange={(e) => setLocalFixed(e.target.value)}
                                    />
                                </div>

                                <div className="bg-secondary/50 p-4 rounded-lg mb-8">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-muted-foreground">Total Allowance</span>
                                        <span>₹{localAllowance}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-muted-foreground">Fixed Costs</span>
                                        <span className="text-red-400">- ₹{localFixed || 0}</span>
                                    </div>
                                    <div className="border-t border-white/10 my-2"></div>
                                    <div className="flex justify-between font-medium">
                                        <span>Safe to Spend</span>
                                        <span className="text-primary">₹{Math.max(0, localAllowance - localFixed)}</span>
                                    </div>
                                </div>

                                <Button className="w-full" onClick={handleNext}>
                                    Next <i className="fi fi-rr-arrow-right ml-2 text-base"></i>
                                </Button>
                            </Card>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" {...fadeIn}>
                            <Card className="p-8">
                                <div className="mb-6">
                                    <Button variant="ghost" size="sm" className="-ml-4 mb-2 text-muted-foreground" onClick={handleBack}>
                                        <i className="fi fi-rr-arrow-left mr-2 text-base"></i> Back
                                    </Button>
                                    <h2 className="text-2xl font-bold mb-2">Weekend Vibes</h2>
                                    <p className="text-muted-foreground">How do you want to handle weekends?</p>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <button
                                        onClick={() => setLocalBias('strict')}
                                        className={cn(
                                            "w-full p-4 rounded-xl border text-left transition-all",
                                            localBias === 'strict'
                                                ? "border-primary bg-primary/10"
                                                : "border-white/10 hover:bg-white/5"
                                        )}
                                    >
                                        <div className="font-semibold mb-1">Strict Mode</div>
                                        <div className="text-sm text-muted-foreground">Keep my limit same every day.</div>
                                    </button>

                                    <button
                                        onClick={() => setLocalBias('balanced')}
                                        className={cn(
                                            "w-full p-4 rounded-xl border text-left transition-all",
                                            localBias === 'balanced'
                                                ? "border-primary bg-primary/10"
                                                : "border-white/10 hover:bg-white/5"
                                        )}
                                    >
                                        <div className="font-semibold mb-1">Balanced (Recommended)</div>
                                        <div className="text-sm text-muted-foreground">Save ~10% for weekend fun.</div>
                                    </button>

                                    <button
                                        onClick={() => setLocalBias('flexible')}
                                        className={cn(
                                            "w-full p-4 rounded-xl border text-left transition-all",
                                            localBias === 'flexible'
                                                ? "border-primary bg-primary/10"
                                                : "border-white/10 hover:bg-white/5"
                                        )}
                                    >
                                        <div className="font-semibold mb-1">Party Mode</div>
                                        <div className="text-sm text-muted-foreground">Save heavily for big weekends.</div>
                                    </button>
                                </div>

                                <Button className="w-full" onClick={handleNext}>
                                    Calculate My Limit <i className="fi fi-rr-check ml-2 text-base"></i>
                                </Button>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Onboarding;
