import React, { createContext, useContext, useState, useEffect } from 'react';

const SpendingContext = createContext();

export const useSpending = () => useContext(SpendingContext);

export const SpendingProvider = ({ children }) => {
    // Persist state to local storage for a "real" feel
    const [allowance, setAllowance] = useState(() => Number(localStorage.getItem('allowance')) || 0);
    const [fixedExpenses, setFixedExpenses] = useState(() => Number(localStorage.getItem('fixedExpenses')) || 0);
    const [weekendBias, setWeekendBias] = useState(() => localStorage.getItem('weekendBias') || 'balanced'); // strict, balanced, flexible

    // Daily Tracking
    const [spentToday, setSpentToday] = useState(() => Number(localStorage.getItem('spentToday')) || 0);
    const [transactions, setTransactions] = useState(() => JSON.parse(localStorage.getItem('transactions')) || []);

    // Derived state
    const [dailyLimit, setDailyLimit] = useState(0);

    useEffect(() => {
        localStorage.setItem('allowance', allowance);
        localStorage.setItem('fixedExpenses', fixedExpenses);
        localStorage.setItem('weekendBias', weekendBias);
        localStorage.setItem('spentToday', spentToday);
        localStorage.setItem('transactions', JSON.stringify(transactions));

        calculateDailyLimit();
    }, [allowance, fixedExpenses, weekendBias, spentToday, transactions]);

    const calculateDailyLimit = () => {
        // Simple logic for MVP:
        // (Allowance - Fixed) / DaysRemaining
        // But let's just do a standardized "Daily Limit" for the whole month for simplicity, 
        // or arguably "Safe Daily Spend".

        if (allowance <= 0) {
            setDailyLimit(0);
            return;
        }

        const disposable = Math.max(0, allowance - fixedExpenses);
        const daysInMonth = 30; // Simplify for MVP

        // Adjust for weekend bias
        // Strict: Even spread
        // Balanced: Save 10% for weekends
        // Flexible: Save 20% for weekends

        let reserveFactor = 0; // 0 means even spread
        if (weekendBias === 'balanced') reserveFactor = 0.1;
        else if (weekendBias === 'flexible') reserveFactor = 0.2;
        // Strict = 0

        const monthlyReserve = disposable * reserveFactor;
        const standardDailyTotal = disposable - monthlyReserve;
        const baseDaily = standardDailyTotal / daysInMonth;

        // This is the "Base Daily Limit"
        // Weekends get (monthlyReserve / 8) + baseDaily (approx 8 weekend days)

        // Check if there's a manual override
        const manualLimit = localStorage.getItem('manualDailyLimit');
        if (manualLimit) {
            setDailyLimit(Number(manualLimit));
            return;
        }

        setDailyLimit(Math.floor(baseDaily));
    };

    const addTransaction = (amount, description, category) => {
        const newTx = {
            id: Date.now(),
            amount,
            description,
            category,
            date: new Date().toISOString()
        };
        setTransactions(prev => [newTx, ...prev]);
        setSpentToday(prev => prev + amount);
    };

    const deleteTransaction = (id) => {
        const transaction = transactions.find(tx => tx.id === id);
        if (transaction) {
            setTransactions(prev => prev.filter(tx => tx.id !== id));
            setSpentToday(prev => Math.max(0, prev - transaction.amount));
        }
    };

    const updateDailyLimit = (newLimit) => {
        // Manually override the daily limit
        setDailyLimit(newLimit);
        // Store it separately so it persists
        localStorage.setItem('manualDailyLimit', newLimit);
    };

    const resetToday = () => {
        setSpentToday(0);
    };

    const resetData = () => {
        localStorage.clear();
        setAllowance(0);
        setFixedExpenses(0);
        setTransactions([]);
        setSpentToday(0);
    };

    return (
        <SpendingContext.Provider value={{
            allowance, setAllowance,
            fixedExpenses, setFixedExpenses,
            weekendBias, setWeekendBias,
            dailyLimit,
            spentToday,
            addTransaction,
            deleteTransaction,
            updateDailyLimit,
            transactions,
            resetToday,
            resetData
        }}>
            {children}
        </SpendingContext.Provider>
    );
};
