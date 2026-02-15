const API_URL = 'http://localhost:3000/lim-ai';

/**
 * Service to interact with the LIM AI Backend
 */
export const limAiService = {
    /**
     * Ask a question to LIM AI
     * @param {string} query - The user's question
     * @param {Object} context - Financial context
     * @returns {Promise<string>} - The AI's answer
     */
    async ask(query, context) {
        try {
            const response = await fetch(`${API_URL}/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, context })
            });
            const data = await response.json();
            return data.message;
        } catch (error) {
            console.error("LIM AI Service Error (Ask):", error);
            return "I'm having trouble connecting to my brain right now. Please try again later.";
        }
    },

    /**
     * Get an explanation for a financial decision
     * @param {Object} context - Financial context including decision details
     * @returns {Promise<string>} - The explanation
     */
    async explain(context) {
        try {
            const response = await fetch(`${API_URL}/explain`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ context })
            });
            const data = await response.json();
            return data.message;
        } catch (error) {
            console.error("LIM AI Service Error (Explain):", error);
            return "Limits are active. Explanation is unavailable.";
        }
    },

    /**
     * Generate a pro-active nudge
     * @param {Object} context - Financial context
     * @returns {Promise<string>} - The nudge
     */
    async getNudge(context) {
        try {
            const response = await fetch(`${API_URL}/nudge`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ context })
            });
            const data = await response.json();
            return data.message;
        } catch (error) {
            console.error("LIM AI Service Error (Nudge):", error);
            return "Stay disciplined!";
        }
    }
};
