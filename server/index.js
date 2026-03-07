import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory state (demo purposes)
const state = {
  user: null,
  profile: {
    name: 'Student',
    email: 'student@limitu.app',
    monthlyAllowance: 12000,
    fixedExpenses: 3000,
    weekendPref: 'equal',
  },
  spentToday: 680,
  spentThisMonth: 4200,
  transactions: [
    { id: 1, label: 'Coffee', amount: 80, date: new Date().toISOString() },
    { id: 2, label: 'Lunch', amount: 250, date: new Date().toISOString() },
    { id: 3, label: 'Bus fare', amount: 50, date: new Date().toISOString() },
    { id: 4, label: 'Snacks', amount: 120, date: new Date().toISOString() },
    { id: 5, label: 'Stationery', amount: 180, date: new Date().toISOString() },
  ],
};

function getDaysInMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function getDayOfMonth() {
  return new Date().getDate();
}

function calculateDailyLimit() {
  const disposable = state.profile.monthlyAllowance - state.profile.fixedExpenses;
  const remaining = disposable - state.spentThisMonth;
  const daysLeft = getDaysInMonth() - getDayOfMonth() + 1;
  if (remaining <= 0 || daysLeft <= 0) return 0;
  return Math.round(remaining / daysLeft);
}

// Auth
app.post('/api/auth/login', (req, res) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  state.user = { email, name: name || email.split('@')[0] };
  res.json({ user: state.user });
});

app.post('/api/auth/logout', (_req, res) => {
  state.user = null;
  res.json({ ok: true });
});

// Dashboard
app.get('/api/dashboard', (_req, res) => {
  const totalDays = getDaysInMonth();
  const dayOfMonth = getDayOfMonth();
  const daysLeft = totalDays - dayOfMonth + 1;
  const dailyLimit = calculateDailyLimit();
  const disposable = state.profile.monthlyAllowance - state.profile.fixedExpenses;
  const remainingBalance = disposable - state.spentThisMonth;
  const avgDailySpend = dayOfMonth > 1 ? Math.round(state.spentThisMonth / (dayOfMonth - 1)) : state.spentToday;

  res.json({
    dailyLimit,
    spentToday: state.spentToday,
    remainingBalance,
    daysLeft,
    dayOfMonth,
    totalDays,
    avgDailySpend,
    transactions: state.transactions.slice(0, 10),
  });
});

// Spend simulation
app.post('/api/spend/simulate', (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  const dailyLimit = calculateDailyLimit();
  const remainingDaily = dailyLimit - state.spentToday;
  const disposable = state.profile.monthlyAllowance - state.profile.fixedExpenses;
  const remainingBalance = disposable - state.spentThisMonth;

  if (amount <= remainingDaily && amount <= remainingBalance) {
    return res.json({ status: 'allowed', message: `You're good! ₹${amount} fits within your daily limit.` });
  }
  if (amount > remainingBalance) {
    return res.json({ status: 'blocked', message: `This exceeds your remaining monthly balance of ₹${remainingBalance}.` });
  }
  const allowed = Math.max(0, remainingDaily);
  return res.json({ status: 'partial', message: `You can spend ₹${allowed} today.`, allowedAmount: allowed });
});

// Confirm spend
app.post('/api/spend/confirm', (req, res) => {
  const { amount, label } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  state.spentToday += amount;
  state.spentThisMonth += amount;
  state.transactions.unshift({
    id: Date.now(),
    label: label || 'Spend',
    amount,
    date: new Date().toISOString(),
  });

  res.json({ ok: true, spentToday: state.spentToday, spentThisMonth: state.spentThisMonth });
});

// Profile
app.get('/api/profile', (_req, res) => {
  res.json(state.profile);
});

app.put('/api/profile', (req, res) => {
  const { monthlyAllowance, fixedExpenses, weekendPref } = req.body;
  if (monthlyAllowance !== undefined) state.profile.monthlyAllowance = monthlyAllowance;
  if (fixedExpenses !== undefined) state.profile.fixedExpenses = fixedExpenses;
  if (weekendPref !== undefined) state.profile.weekendPref = weekendPref;
  res.json({ profile: state.profile, newDailyLimit: calculateDailyLimit() });
});

// Insights
app.get('/api/insights', (_req, res) => {
  const weeklySpending = [320, 280, 410, 150, 500, 360, 290];
  const dailyLimits = [400, 400, 400, 400, 400, 400, 400];
  const dayOfMonth = getDayOfMonth();
  const avgDailySpend = dayOfMonth > 1 ? Math.round(state.spentThisMonth / (dayOfMonth - 1)) : state.spentToday;

  let withinCount = 0;
  weeklySpending.forEach((s, i) => { if (s <= dailyLimits[i]) withinCount++; });
  const habitScore = Math.round((withinCount / weeklySpending.length) * 100);

  res.json({ weeklySpending, dailyLimits, habitScore, avgDailySpend });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Limit U API running on http://localhost:${PORT}`);
});
