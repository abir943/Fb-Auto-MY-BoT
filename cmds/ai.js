const axios = require("axios");

module.exports = {
    name: "ai",
    aliases: ["ask", "chatgpt", "gpt"],
    usePrefix: false,
    description: "Ask ChatGPT a question using the Aryan API.",
    version: "1.0.0",
    author: "Aminul Sordar",

    execute: async (api, event, args) => {
        const { threadID, messageID, senderID } = event;
        const question = args.join(" ");

        if (!question) {
            return api.sendMessage(
                "❌ Please provide a question to ask.\n\n📌 Example: ai who is Elon Musk?",
                threadID,
                messageID
            );
        }

        const apiUrl = `https://api-aryan-xyz.vercel.app/chatgpt?ask=${encodeURIComponent(question)}&uid=${senderID}&apikey=ArYAN`;

        try {
            const res = await axios.get(apiUrl);
            let answer = res?.data?.result;

            // Fix: Convert object to string if needed
            if (typeof answer === "object") {
                answer = JSON.stringify(answer, null, 2);
            }

            return api.sendMessage(`🤖 ChatGPT:\n${answer}`, threadID, messageID);

        } catch (error) {
            console.error("❌ ChatGPT API Error:", error?.response?.data || error.message);
            return api.sendMessage(
                "⚠️ Failed to get a response from ChatGPT. Please try again later.",
                threadID,
                messageID
            );
        }
    }
};
