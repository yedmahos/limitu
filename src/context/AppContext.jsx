import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  calculateDailyLimit,
  getDaysInMonth,
  getDayOfMonth,
  getDaysLeftInMonth,
  getRunOutDate,
} from '../lib/engine';

const AppContext = createContext(null);

const DEMO_WEEKLY_SPENDING = [320, 280, 410, 150, 500, 360, 290];
const DEMO_DAILY_LIMITS = [400, 400, 400, 400, 400, 400, 400];

const defaultProfile = {
  name: 'Student',
  email: 'student@limitu.app',
  monthlyAllowance: 12000,
  fixedExpenses: 3000,
  weekendPref: 'equal',
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(defaultProfile);
  const [spentToday, setSpentToday] = useState(680);
  const [spentThisMonth, setSpentThisMonth] = useState(4200);
  const [transactions, setTransactions] = useState([
    { id: 1, label: 'Coffee', amount: 80, date: new Date().toISOString() },
    { id: 2, label: 'Lunch', amount: 250, date: new Date().toISOString() },
    { id: 3, label: 'Bus fare', amount: 50, date: new Date().toISOString() },
    { id: 4, label: 'Snacks', amount: 120, date: new Date().toISOString() },
    { id: 5, label: 'Stationery', amount: 180, date: new Date().toISOString() },
  ]);

  const weeklySpending = DEMO_WEEKLY_SPENDING;
  const dailyLimits = DEMO_DAILY_LIMITS;

  const today = new Date();
  const totalDays = getDaysInMonth(today);
  const dayOfMonth = getDayOfMonth(today);
  const daysLeft = getDaysLeftInMonth(today);

  const disposable = profile.monthlyAllowance - profile.fixedExpenses;
  const remainingBalance = disposable - spentThisMonth;
  const dailyLimit = calculateDailyLimit(
    profile.monthlyAllowance,
    profile.fixedExpenses,
    dayOfMonth,
    totalDays,
    spentThisMonth
  );

  const avgDailySpend = dayOfMonth > 1 ? Math.round(spentThisMonth / (dayOfMonth - 1)) : spentToday;
  const runOutDate = getRunOutDate(remainingBalance, avgDailySpend);
  const habitScore = (() => {
    let within = 0;
    weeklySpending.forEach((s, i) => { if (s <= (dailyLimits[i] || Infinity)) within++; });
    return Math.round((within / weeklySpending.length) * 100);
  })();

  const addSpend = useCallback((amount) => {
    setSpentToday((p) => p + amount);
    setSpentThisMonth((p) => p + amount);
    setTransactions((prev) => [
      { id: Date.now(), label: 'Spend', amount, date: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  const updateProfile = useCallback((updates) => {
    setProfile((p) => ({ ...p, ...updates }));
  }, []);

  const login = useCallback((email, name) => {
    setUser({ email, name: name || email.split('@')[0] });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      profile,
      spentToday,
      spentThisMonth,
      transactions,
      dailyLimit,
      remainingBalance,
      daysLeft,
      dayOfMonth,
      totalDays,
      avgDailySpend,
      runOutDate,
      habitScore,
      weeklySpending,
      dailyLimits,
      addSpend,
      updateProfile,
      login,
      logout,
    }),
    [user, profile, spentToday, spentThisMonth, transactions, dailyLimit, remainingBalance, daysLeft, dayOfMonth, totalDays, avgDailySpend, runOutDate, habitScore, weeklySpending, dailyLimits, addSpend, updateProfile, login, logout]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
