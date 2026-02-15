import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useSpending } from '../context/SpendingContext';
import { limAiService } from '../services/LimAIService';
import { motion, AnimatePresence } from 'framer-motion';

const Simulation = () => {
    const navigate = useNavigate();
    const { dailyLimit, spentToday, addTransaction, allowance } = useSpending();
    const [amount, setAmount] = useState('');
    const [desc, setDesc] = useState('');
    const [status, setStatus] = useState('input'); // input, checking, success, rejected
    const [message, setMessage] = useState('');

    const handlePay = async () => {
        if (!amount || !desc) return;
        setStatus('checking');

        const val = Number(amount);

        try {
            // Build Context for Backend
            const context = {
                today_limit: dailyLimit,
                spent_today: spentToday,
                allowance: allowance
            };

            const result = await limAiService.explain({ context, attempted_spend: val });

            setMessage(result.message);

            // Decision mapping: ALLOW and WARN are considered "allowed" for transaction processing
            // SOFT_BLOCK and BLOCK are rejected (though SOFT_BLOCK allows override in UI)
            if (result.decision === 'ALLOW' || result.decision === 'WARN') {
                addTransaction(val, desc, 'UPI Simulation');
                setStatus('success');
            } else {
                setStatus('rejected');
            }
        } catch (error) {
            console.error("Simulation Error:", error);
            setMessage("I'm having trouble analyzing this transaction. Please try again.");
            setStatus('input');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center pt-20 px-6">
            <div className="w-full max-w-sm">
                <div className="flex items-center mb-8">
                    <Button variant="ghost" className="text-white" onClick={() => navigate('/dashboard')}>
                        <i className="fi fi-rr-arrow-left text-xl"></i>
                    </Button>
                    <span className="ml-4 font-semibold text-lg">Scan & Pay</span>
                </div>

                <AnimatePresence mode="wait">
                    {status === 'input' && (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />

                                <div className="flex justify-center mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center animate-pulse">
                                        <i className="fi fi-rr-qrcode text-3xl text-blue-400"></i>
                                    </div>
                                </div>

                                <div className="text-center mb-6">
                                    <p className="text-gray-400 text-sm mb-2">Paying</p>
                                    <Input
                                        autoFocus
                                        type="number"
                                        placeholder="0"
                                        className="text-center text-4xl font-bold bg-transparent border-none focus-visible:ring-0 placeholder:text-gray-600 h-auto py-2"
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                    />
                                </div>

                                <Input
                                    placeholder="What for? (e.g. Coffee)"
                                    className="mb-8 bg-gray-800 border-gray-700 text-center"
                                    value={desc}
                                    onChange={e => setDesc(e.target.value)}
                                />

                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12"
                                    onClick={handlePay}
                                    disabled={!amount || !desc}
                                >
                                    Pay Securely
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {status === 'checking' && (
                        <motion.div
                            key="checking"
                            className="text-center pt-20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <i className="fi fi-rr-spinner animate-spin text-5xl mx-auto text-blue-500 mb-4"></i>
                            <h3 className="text-xl font-medium">Analyzing Spend Risk...</h3>
                            <p className="text-gray-400 mt-2">Checking against your daily limit</p>
                        </motion.div>
                    )}

                    {status === 'success' && (
                        <motion.div
                            key="success"
                            className="text-center pt-10"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                        >
                            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="fi fi-rr-check text-5xl text-green-500"></i>
                            </div>
                            <h2 className="text-3xl font-bold mb-2">Payment Allowed</h2>
                            <p className="text-gray-400 mb-8 max-w-xs mx-auto">{message}</p>
                            <Button className="w-full" onClick={() => navigate('/dashboard')}>Done</Button>
                        </motion.div>
                    )}

                    {status === 'rejected' && (
                        <motion.div
                            key="rejected"
                            className="text-center pt-10"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                        >
                            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="fi fi-rr-exclamation text-5xl text-red-500"></i>
                            </div>
                            <h2 className="text-3xl font-bold mb-2">Limit Exceeded</h2>
                            <p className="text-gray-400 mb-8 max-w-xs mx-auto">{message}</p>
                            <div className="flex gap-4">
                                <Button variant="secondary" className="w-full" onClick={() => setStatus('input')}>Cancel</Button>
                                <Button variant="danger" className="w-full" onClick={() => {
                                    addTransaction(Number(amount), desc, 'Forced Spend');
                                    setStatus('success');
                                    setMessage("Forced payment. This will hurt your weekend budget.");
                                }}>Override</Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Simulation;
