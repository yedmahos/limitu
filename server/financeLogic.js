/**
 * Deterministic Financial Logic Service
 * Responsible for calculations and decision outcomes.
 */
const financeLogic = {
    /**
     * Calculate spending decision based on current context
     * @param {Object} context 
     * @returns {Object} Updated context with decision and impact
     */
    evaluateSpend(context) {
        const { today_limit, spent_today, attempted_spend } = context;
        const totalAfterSpend = (spent_today || 0) + (attempted_spend || 0);

        let decision = "ALLOW";
        let impact = "Normal spending";

        if (totalAfterSpend > today_limit) {
            const overage = totalAfterSpend - today_limit;

            // Hard block if significantly over
            if (overage > today_limit * 0.5) {
                decision = "BLOCK";
                impact = "Budget severely exceeded. Transaction prohibited to protect your monthly goal.";
            } else {
                decision = "SOFT_BLOCK";
                impact = `Overage of ₹${overage.toFixed(2)} detected. Next 2 days limit will be reduced to compensate.`;
            }
        } else if (totalAfterSpend > today_limit * 0.8) {
            decision = "WARN";
            impact = "Approaching daily limit. Stay mindful!";
        }

        return {
            ...context,
            decision,
            impact
        };
    },

    /**
     * Detection for weekend patterns or repetitive breaches
     * @param {Object} userData 
     * @returns {string|null} Nudge trigger condition
     */
    detectTriggers(userData) {
        const { spent_today, today_limit, recent_breaches } = userData;
        const usagePercent = (spent_today / today_limit) * 100;

        if (usagePercent >= 80) return "LIMIT_APPROACHING";
        if (recent_breaches > 2) return "REPETITIVE_BREACHES";

        const isWeekend = [0, 6].includes(new Date().getDay());
        if (isWeekend && usagePercent > 50) return "WEEKEND_SPENDING_PATTERN";

        return null;
    }
};

module.exports = financeLogic;
