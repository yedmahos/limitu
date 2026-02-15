import React from 'react';
import { Card } from '../ui/Card';
import { useSpending } from '../../context/SpendingContext';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const CategoryBreakdown = () => {
    const { transactions } = useSpending();

    // Calculate category totals
    const categoryTotals = transactions.reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
    }, {});

    const categories = Object.entries(categoryTotals).map(([name, amount]) => ({
        name,
        amount,
        icon: getCategoryIcon(name),
        color: getCategoryColor(name)
    }));

    const total = categories.reduce((sum, cat) => sum + cat.amount, 0);

    if (categories.length === 0) {
        return null; // Don't show if no transactions
    }

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
            <div className="space-y-3">
                {categories.map((cat, idx) => {
                    const percentage = ((cat.amount / total) * 100).toFixed(0);


                    return (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center gap-3"
                        >
                            <div className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center flex-shrink-0`}>
                                <i className={`fi fi-rr-${cat.icon} text-xl text-white`}></i>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-sm">{cat.name}</span>
                                    <span className="text-sm font-semibold">₹{cat.amount}</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full ${cat.color}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    />
                                </div>
                            </div>
                            <span className="text-xs text-muted-foreground w-10 text-right">{percentage}%</span>
                        </motion.div>
                    );
                })}
            </div>
        </Card>
    );
};

const getCategoryIcon = (category) => {
    const icons = {
        'Food': 'coffee',
        'Transport': 'bus',
        'Shopping': 'shopping-bag',
    };
    return icons[category] || 'circle';
};

const getCategoryColor = (category) => {
    const colors = {
        'Food': 'bg-orange-500',
        'Transport': 'bg-blue-500',
        'Shopping': 'bg-purple-500',
    };
    return colors[category] || 'bg-gray-500';
};

export { CategoryBreakdown };
