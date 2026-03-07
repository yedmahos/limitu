// Finance calculation engine for Limit U

export function calculateDailyLimit(monthlyAllowance, fixedExpenses, dayInMonth, totalDaysInMonth, spentThisMonth) {
  const disposable = monthlyAllowance - fixedExpenses;
  const remaining = disposable - spentThisMonth;
  const daysLeft = totalDaysInMonth - dayInMonth + 1;
  if (remaining <= 0 || daysLeft <= 0) return 0;
  return Math.round(remaining / daysLeft);
}

export function getDaysInMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function getDayOfMonth(date = new Date()) {
  return date.getDate();
}

export function getDaysLeftInMonth(date = new Date()) {
  return getDaysInMonth(date) - getDayOfMonth(date) + 1;
}

export function getRunOutDate(remainingBalance, avgDailySpend) {
  if (avgDailySpend <= 0) return null;
  const daysUntilRunOut = Math.floor(remainingBalance / avgDailySpend);
  const runOutDate = new Date();
  runOutDate.setDate(runOutDate.getDate() + daysUntilRunOut);
  return runOutDate;
}

export function evaluateSpend(amount, dailyLimit, spentToday, remainingBalance) {
  const remainingDaily = dailyLimit - spentToday;

  if (amount <= 0) {
    return { status: 'invalid', message: 'Please enter a valid amount.' };
  }

  if (amount <= remainingDaily && amount <= remainingBalance) {
    return {
      status: 'allowed',
      message: `You're good! ₹${amount} fits within your daily limit.`,
      emoji: '✓',
    };
  }

  if (amount > remainingBalance) {
    return {
      status: 'blocked',
      message: `This exceeds your remaining monthly balance of ₹${remainingBalance}.`,
      emoji: '✕',
    };
  }

  if (amount > remainingDaily) {
    const allowed = Math.max(0, remainingDaily);
    return {
      status: 'partial',
      message: `You can spend ₹${allowed} today. The rest would exceed your daily limit.`,
      emoji: '⚡',
      allowedAmount: allowed,
    };
  }

  return { status: 'blocked', message: 'Spending not recommended right now.', emoji: '✕' };
}

export function getHabitScore(weeklySpending, dailyLimits) {
  if (!weeklySpending.length || !dailyLimits.length) return 0;
  let withinLimitDays = 0;
  for (let i = 0; i < weeklySpending.length; i++) {
    if (weeklySpending[i] <= (dailyLimits[i] || Infinity)) withinLimitDays++;
  }
  return Math.round((withinLimitDays / weeklySpending.length) * 100);
}

export function generateLimResponse(query, context) {
  const q = query.toLowerCase();
  const { dailyLimit, spentToday, remainingBalance, daysLeft, avgDailySpend, habitScore, weekendPref } = context;
  const remainingDaily = dailyLimit - spentToday;

  if (q.includes('limit') && q.includes('low')) {
    if (daysLeft < 7) {
      return `Your limit is adjusted because there are only ${daysLeft} days left this month and you need to spread your remaining ₹${remainingBalance} carefully. Smaller daily limits help you avoid running out early.`;
    }
    if (avgDailySpend > dailyLimit * 1.2) {
      return `You've been spending above your limit recently, so I've tightened today's amount to help you recover. Think of it as a small reset — you'll have more room soon.`;
    }
    return `Your daily limit is calculated by dividing your remaining balance across the days left this month. If it feels low, try cutting one small expense today.`;
  }

  if (q.includes('spend') && q.match(/₹?\d+/)) {
    const match = q.match(/₹?(\d+)/);
    const amount = parseInt(match[1], 10);
    if (amount <= remainingDaily) {
      return `Yes, you can spend ₹${amount}. You'll still have ₹${remainingDaily - amount} left for today. Go ahead!`;
    }
    return `₹${amount} would exceed today's remaining limit of ₹${remainingDaily}. Can you bring it closer to ₹${Math.floor(remainingDaily * 0.8)}?`;
  }

  if (q.includes('run out') || q.includes('last')) {
    if (avgDailySpend > 0) {
      const days = Math.floor(remainingBalance / avgDailySpend);
      return `At your current pace, your balance will last about ${days} more days. ${days < daysLeft ? "That's before month-end — try spending a little less each day." : "You're on track to make it through the month."}`;
    }
    return `You haven't spent much yet, so your balance should last well through the month. Keep it up!`;
  }

  if (q.includes('habit') || q.includes('score')) {
    if (habitScore >= 80) return `Your habit score is ${habitScore}/100 — excellent! You're consistently staying within limits. That discipline will pay off.`;
    if (habitScore >= 50) return `Your habit score is ${habitScore}/100 — decent, but there's room to improve. Try sticking to your daily limit for the next 3 days.`;
    return `Your habit score is ${habitScore}/100. Let's work on this together — start by tracking every small purchase today.`;
  }

  if (q.includes('weekend')) {
    return weekendPref === 'more'
      ? `Your weekends have higher limits since you prefer spending more on those days. Weekday budgets are slightly tighter to compensate.`
      : `Your budget is spread evenly across all days. If you want more on weekends, update your preference in Profile.`;
  }

  if (q.includes('save') || q.includes('tip')) {
    return `Here's a quick tip: before buying something, wait 10 minutes. If you still want it, go ahead. This "pause rule" helps avoid impulse buys and can save you ₹200-500 per week.`;
  }

  return `Your daily limit is ₹${dailyLimit}, you've spent ₹${spentToday} today with ₹${remainingDaily} remaining. You have ${daysLeft} days left this month. Ask me anything specific!`;
}
