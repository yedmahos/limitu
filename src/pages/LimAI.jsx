import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { cn } from '../lib/utils';
import { limAiService } from '../services/LimAIService';
import { useSpending } from '../context/SpendingContext';

const LimAI = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content: "Hi! I'm Lim AI. I can help you analyze your spending, set budgets, or answer questions about financial discipline. How can I help you today?"
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const { dailyLimit, spentToday, allowance, transactions } = useSpending();

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = {
            id: Date.now(),
            role: 'user',
            content: inputValue
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            // Build Context
            const context = {
                daily_limit: dailyLimit,
                spent_today: spentToday,
                allowance: allowance,
                transactions_count: transactions.length,
                remaining_today: dailyLimit - spentToday
            };

            const aiResponseText = await limAiService.ask(userMsg.content, context);

            const aiMsg = {
                id: Date.now() + 1,
                role: 'assistant',
                content: aiResponseText
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            const errorMsg = {
                id: Date.now() + 1,
                role: 'assistant',
                content: "I'm having a bit of trouble connecting. Try again?"
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-background text-foreground">
            {/* Header */}
            <div className="flex items-center justify-center p-4 border-b border-border bg-background/50 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <i className="fi fi-rr-sparkles text-xl text-purple-400"></i>
                    <h1 className="font-semibold text-lg tracking-tight">Lim AI <span className="text-xs font-normal text-muted-foreground ml-2">Powered by Gemini</span></h1>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "flex gap-4 max-w-3xl mx-auto",
                            msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                        )}
                    >
                        {/* Avatar */}
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                            msg.role === 'user' ? "bg-primary/10 border border-primary/20" : "bg-accent/50 border border-border"
                        )}>
                            {msg.role === 'user' ? <i className="fi fi-rr-user text-base text-primary"></i> : <i className="fi fi-rr-robot text-base text-purple-400"></i>}
                        </div>

                        {/* Bubble */}
                        <div className={cn(
                            "rounded-2xl px-5 py-3 text-sm leading-relaxed max-w-[80%]",
                            msg.role === 'user'
                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                : "bg-card border border-border text-foreground rounded-tl-sm"
                        )}>
                            {msg.content}
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4 max-w-3xl mx-auto"
                    >
                        <div className="w-8 h-8 rounded-full bg-accent/50 border border-border flex items-center justify-center mt-1">
                            <i className="fi fi-rr-robot text-base text-purple-400"></i>
                        </div>
                        <div className="flex items-center gap-1 bg-card border border-border px-4 py-3 rounded-2xl rounded-tl-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0s' }} />
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-background border-t border-border">
                <form onSubmit={handleSend} className="max-w-3xl mx-auto relative">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask Lim AI about your spending..."
                        className="bg-card border-border focus:border-primary/50 pr-12 h-14 rounded-xl text-base"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!inputValue.trim() || isTyping}
                        className="absolute right-2 top-2 h-10 w-10 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                        {isTyping ? <i className="fi fi-rr-spinner text-base animate-spin"></i> : <i className="fi fi-rr-paper-plane text-base"></i>}
                    </Button>
                </form>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-muted-foreground">Lim AI can make mistakes. Consider checking important information.</p>
                </div>
            </div>
        </div>
    );
};

export default LimAI;
