const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Initialize Gemini
if (!process.env.GEMINI_API_KEY) {
    console.warn("WARNING: GEMINI_API_KEY is not defined in environment variables.");
} else {
    console.log("GEMINI_API_KEY detected. Length:", process.env.GEMINI_API_KEY.length);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelName = "gemini-1.5-flash";
const model = genAI.getGenerativeModel({ model: modelName });

console.log(`Gemini Model configured: ${modelName}`);

// 1. Immutable System Prompt
const SYSTEM_PROMPT = `
You are LIM AI, a financial mentor for students aged 13–25.
Your role is to explain spending limits and guide responsible decisions.

Rules:
- Never shame or judge
- Keep responses under 80 words
- Always explain the reason behind limits
- Suggest safer alternatives
- Speak simply and clearly
- You do not approve or block payments- this is handled by the backend
`;

// Helper to sanitize and send prompt
async function callGemini(taskInstruction, contextData) {
    try {
        const prompt = `
${SYSTEM_PROMPT}

Context:
${JSON.stringify(contextData, null, 2)}

Task:
${taskInstruction}
`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Limits are active. Explanation is temporarily unavailable."; // Fallback
    }
}

// 2. Core Method Implementations

/**
 * Explain a backend decision (e.g., Block/Soft Block)
 * @param {Object} context - The structured financial context
 * @returns {Promise<string>} - The explanation
 */
async function explainDecision(context) {
    return await callGemini(
        "Explain the decision to the user based on the provided context.",
        context
    );
}

/**
 * Answer a user's financial question
 * @param {string} query - The user's question
 * @param {Object} context - The structured financial context
 * @returns {Promise<string>} - The advice
 */
async function askQuestion(query, context) {
    return await callGemini(
        `Answer the user's question: "${query}" based on their financial context.`,
        context
    );
}

/**
 * Generate a proactive nudge
 * @param {Object} context - The structured financial context
 * @returns {Promise<string>} - A short nudge
 */
async function generateNudge(context) {
    return await callGemini(
        "Generate a short (1-2 lines) proactive nudge based on this context.",
        context
    );
}

module.exports = {
    explainDecision,
    askQuestion,
    generateNudge
};
