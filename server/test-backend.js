async function testEndpoints() {
    const baseUrl = 'http://localhost:3000/lim-ai';

    console.log("--- Testing LIM AI Backend ---");

    // 1. Test /explain
    console.log("\n1. Testing /explain...");
    try {
        const response = await fetch(`${baseUrl}/explain`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                context: {
                    today_limit: 180,
                    spent_today: 140,
                    monthly_balance: 2100,
                    days_left: 12,
                    decision: "SOFT_BLOCK",
                    impact: "Next 2 days limit reduced by 40"
                }
            })
        });
        const data = await response.json();
        console.log("Response:", data);
    } catch (e) {
        console.error("Error:", e.message);
    }

    // 2. Test /ask
    console.log("\n2. Testing /ask...");
    try {
        const response = await fetch(`${baseUrl}/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: "Can I buy a coffee?",
                context: {
                    today_limit: 180,
                    spent_today: 140
                }
            })
        });
        const data = await response.json();
        console.log("Response:", data);
    } catch (e) {
        console.error("Error:", e.message);
    }

    // 3. Test /nudge
    console.log("\n3. Testing /nudge...");
    try {
        const response = await fetch(`${baseUrl}/nudge`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                context: {
                    today_limit: 180,
                    spent_today: 160,
                    breach_risk: "HIGH"
                }
            })
        });
        const data = await response.json();
        console.log("Response:", data);
    } catch (e) {
        console.error("Error:", e.message);
    }
}

testEndpoints();
