import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useSpending } from '../context/SpendingContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

const Insights = () => {
    const { dailyLimit, spentToday, weekendBias, transactions } = useSpending();

    // Calculate weekly data correctly
    // MOCK: Assuming 'today' is Friday for visual consistency with the prompt, 
    // OR we can map actual days. Let's map actual days for realism.

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();

    // Initialize last 7 days data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() - (6 - i));
        return {
            date: d.toISOString().split('T')[0],
            day: days[d.getDay()],
            spend: 0,
            limit: dailyLimit,
            isWeekend: d.getDay() === 0 || d.getDay() === 6
        };
    });

    // Aggregate spending
    transactions.forEach(tx => {
        const txDate = tx.date.split('T')[0];
        const dayData = last7Days.find(d => d.date === txDate);
        if (dayData) {
            dayData.spend += tx.amount;
        }
    });

    // Forecasting Logic
    const monthlyTotal = 30 * dailyLimit; // Approx
    const totalSpentMonth = spentToday; // Simplified for MVP (should be sum of all tx)
    const remainingBudget = Math.max(0, monthlyTotal - totalSpentMonth);
    const avgDailySpend = spentToday || dailyLimit; // Avoid div by zero
    const daysUntilRunout = Math.floor(remainingBudget / avgDailySpend);

    const runoutDate = new Date();
    runoutDate.setDate(today.getDate() + daysUntilRunout);

    // Weekend Projection
    const weekendSavings = (dailyLimit - spentToday) * 0.5; // Mock logic: saved 50% of unused
    const weekendFund = Math.max(0, weekendSavings * 5); // Projected for Friday

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 container mx-auto max-w-5xl">
            <header className="mb-10">
                <h1 className="text-3xl font-bold mb-2">Spending Insights</h1>
                <p className="text-muted-foreground">Analyze your habits and forecast.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="p-6">
                    <CardHeader className="p-0 mb-6">
                        <CardTitle className="text-lg">Weekly Discipline</CardTitle>
                    </CardHeader>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={last7Days}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={value => `₹${value}`} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-card border border-border p-3 rounded-lg shadow-xl">
                                                    <p className="font-bold text-foreground mb-2">{label}</p>
                                                    {payload.map((entry, index) => (
                                                        <div key={index} className="flex items-center gap-2 text-sm">
                                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                                            <span className="text-muted-foreground capitalize">{entry.name}:</span>
                                                            <span className="font-semibold text-foreground">₹{entry.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="spend" name="Spend" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="limit" name="Limit" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6">
                    <CardHeader className="p-0 mb-6">
                        <CardTitle className="text-lg">Weekend Fund Projection</CardTitle>
                    </CardHeader>
                    <div className="h-64 w-full flex items-center justify-center flex-col">
                        <div className="text-5xl font-bold text-foreground mb-2">₹{Math.floor(weekendFund)}</div>
                        <p className="text-muted-foreground text-center mb-6">Estimated available for this Weekend</p>

                        <div className="w-full bg-secondary rounded-full h-4 overflow-hidden">
                            <div className="bg-purple-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (weekendFund / 2000) * 100)}%` }} />
                        </div>
                        <div className="flex justify-between w-full text-xs text-muted-foreground mt-2">
                            <span>Based on current habits</span>
                            <span>{daysUntilRunout > 10 ? 'Healthy Pace' : 'High Spending'}</span>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-red-500/10 border-red-500/20">
                    <h3 className="font-semibold text-red-400 mb-2">Overspend Alert</h3>
                    <p className="text-sm text-muted-foreground">You tend to overspend on <span className="text-foreground font-medium">Food</span> on Wednesdays.</p>
                </Card>
                <Card className="p-6 bg-green-500/10 border-green-500/20">
                    <h3 className="font-semibold text-green-400 mb-2">Savings Streak</h3>
                    <p className="text-sm text-muted-foreground">You've stayed under limit for <span className="text-foreground font-medium">3 days</span> in a row!</p>
                </Card>
                <Card className="p-6 bg-blue-500/10 border-blue-500/20">
                    <h3 className="font-semibold text-blue-400 mb-2">Strategy: {weekendBias}</h3>
                    <p className="text-sm text-muted-foreground">You are currently saving 10% daily for weekends.</p>
                </Card>
            </div>
        </div>
    );
};

export default Insights;
