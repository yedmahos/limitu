import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { useSpending } from '../../context/SpendingContext';
import { limAiService } from '../../services/LimAIService';

const CoachWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hey! I'm your spending coach. Need help deciding on a purchase?" }
    ]);
    const [input, setInput] = useState('');
    const { dailyLimit, spentToday, allowance } = useSpending();

    // 1. Fetch proactive nudge on mount
    React.useEffect(() => {
        const fetchNudge = async () => {
            const context = { daily_limit: dailyLimit, spent_today: spentToday, allowance };
            try {
                const nudge = await limAiService.getNudge(context);
                setMessages([{ role: 'assistant', text: nudge }]);
            } catch (err) {
                // Fallback already handled in service, but just in case
                console.error("Failed to fetch nudge");
            }
        };
        fetchNudge();
    }, [dailyLimit, spentToday]); // Re-fetch if spending changes significantly? Maybe just on mount is better to avoid spam.

    const handleSend = async () => {
        if (!input.trim()) return;

        // Add user message
        const newMessages = [...messages, { role: 'user', text: input }];
        setMessages(newMessages);
        setInput('');

        // 2. Call LIM AI Backend
        try {
            const context = { daily_limit: dailyLimit, spent_today: spentToday, allowance };
            const answer = await limAiService.ask(input, context);
            setMessages(prev => [...prev, { role: 'assistant', text: answer }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', text: "I'm having trouble connecting right now." }]);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-36 right-4 md:bottom-24 md:right-6 w-80 z-50"
                    >
                        <Card className="flex flex-col h-96 shadow-2xl border-primary/20">
                            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-primary/10">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="font-semibold">Coach Limit</span>
                                </div>
                                <button onClick={() => setIsOpen(false)}>
                                    <i className="fi fi-rr-cross text-xs text-muted-foreground"></i>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-br-none'
                                            : 'bg-secondary text-secondary-foreground rounded-bl-none'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-3 border-t border-white/10 flex gap-2">
                                <Input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Ask me..."
                                    className="h-9 text-sm"
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                />
                                <Button size="icon" className="h-9 w-9" onClick={handleSend}>
                                    <i className="fi fi-rr-paper-plane text-base"></i>
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence >

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-20 right-4 md:bottom-6 md:right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center z-50"
            >
                {isOpen ? <i className="fi fi-rr-cross text-2xl"></i> : <i className="fi fi-rr-comment text-2xl"></i>}
            </motion.button>
        </>
    );
};

export { CoachWidget };
