import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { useSpending } from '../../context/SpendingContext';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

const DailyLimitCard = () => {
    const { dailyLimit, spentToday, updateDailyLimit } = useSpending();
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(dailyLimit);

    const remaining = dailyLimit - spentToday;
    const percentageUsed = Math.min(100, (spentToday / dailyLimit) * 100);

    const isDanger = percentageUsed > 90;
    const isWarning = percentageUsed > 70;

    const handleEdit = () => {
        setEditValue(dailyLimit);
        setIsEditing(true);
    };

    const handleSave = () => {
        const newLimit = parseInt(editValue);
        if (newLimit > 0) {
            updateDailyLimit(newLimit);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditValue(dailyLimit);
        setIsEditing(false);
    };

    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Card className={cn(
                "relative overflow-hidden border-2",
                isDanger ? "border-red-500/50 shadow-red-900/20" :
                    isWarning ? "border-yellow-500/50 shadow-yellow-900/20" :
                        "border-primary/50 shadow-primary/20"
            )}>
                {/* Background Radial Gradient */}
                <div className={cn(
                    "absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -z-10 opacity-20",
                    isDanger ? "bg-red-500" : isWarning ? "bg-yellow-500" : "bg-primary"
                )} />

                <CardContent className="p-8 text-center relative z-10">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-muted-foreground uppercase tracking-widest text-xs font-semibold">
                            Today's Spending Limit
                        </h3>
                        {!isEditing && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={handleEdit}
                                title="Edit daily limit"
                            >
                                <i className="fi fi-rr-edit text-base"></i>
                            </Button>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="mb-4">
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-2xl text-muted-foreground">₹</span>
                                <input
                                    type="number"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="text-4xl font-bold bg-transparent border-b-2 border-primary w-32 text-center focus:outline-none"
                                    autoFocus
                                />
                            </div>
                            <div className="flex items-center justify-center gap-2 mt-4">
                                <Button size="sm" onClick={handleSave} className="gap-1">
                                    <i className="fi fi-rr-check text-base"></i> Save
                                </Button>
                                <Button size="sm" variant="ghost" onClick={handleCancel} className="gap-1">
                                    <i className="fi fi-rr-cross text-base"></i> Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-6xl font-bold tracking-tighter mb-4 flex items-center justify-center gap-1">
                            <span className="text-2xl text-muted-foreground mt-2">₹</span>
                            <span className={cn(
                                "transition-colors",
                                remaining < 0 ? "text-red-500" : "text-foreground"
                            )}>
                                {Math.abs(remaining).toLocaleString()}
                            </span>
                        </div>
                    )}

                    {!isEditing && (
                        <div className="text-sm font-medium mb-6">
                            {remaining < 0 ? (
                                <span className="text-red-400 flex items-center justify-center gap-2">
                                    <i className="fi fi-rr-exclamation text-base"></i> Overspent by ₹{Math.abs(remaining)}
                                </span>
                            ) : (
                                <span className="text-emerald-400 flex items-center justify-center gap-2">
                                    <i className="fi fi-rr-chart-line-up text-base"></i> Safe to spend
                                </span>
                            )}
                        </div>
                    )}

                    {/* Progress Bar */}
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                            className={cn(
                                "h-full rounded-full transition-all duration-1000",
                                isDanger ? "bg-red-500" : isWarning ? "bg-yellow-500" : "bg-primary"
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentageUsed}%` }}
                        />
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>₹{spentToday} used</span>
                        <span>Limit: ₹{dailyLimit}</span>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export { DailyLimitCard };
