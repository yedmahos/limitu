const express = require('express');
const cors = require('cors');
require('dotenv').config();
const limAI = require('./limAI');
const financeLogic = require('./financeLogic');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- ROUTES ---

// 1. Explain Decision
app.post('/lim-ai/explain', async (req, res) => {
    try {
        const { context, attempted_spend } = req.body;

        if (!context) {
            return res.status(400).json({ error: "Context is required" });
        }

        // 1. Backend calculates decision deterministically
        const financialContext = { ...context, attempted_spend: attempted_spend || 0 };
        const evaluatedContext = financeLogic.evaluateSpend(financialContext);

        // 2. Backend sends evaluated context to Gemini for human-friendly explanation
        const explanation = await limAI.explainDecision(evaluatedContext);

        res.json({
            message: explanation,
            decision: evaluatedContext.decision,
            impact: evaluatedContext.impact
        });
    } catch (error) {
        console.error("Error in /explain:", error);
        res.status(500).json({ error: "Internal Context Error" });
    }
});

// 2. Ask Question
app.post('/lim-ai/ask', async (req, res) => {
    try {
        const { query, context } = req.body;

        if (!query || !context) {
            return res.status(400).json({ error: "Query and Context are required" });
        }

        const answer = await limAI.askQuestion(query, context);
        res.json({ message: answer });
    } catch (error) {
        console.error("Error in /ask:", error);
        res.status(500).json({ error: "Internal Context Error" });
    }
});

// 3. Generate Nudge
app.post('/lim-ai/nudge', async (req, res) => {
    try {
        const { context } = req.body;

        if (!context) {
            return res.status(400).json({ error: "Context is required" });
        }

        const nudge = await limAI.generateNudge(context);
        res.json({ message: nudge });
    } catch (error) {
        console.error("Error in /nudge:", error);
        res.status(500).json({ error: "Internal Context Error" });
    }
});

// Health check
app.get('/', (req, res) => {
    res.send('LIM AI Backend is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Gemini Model Initialized`);
});
