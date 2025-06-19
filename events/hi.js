module.exports = {
    name: "message",
    async execute({ api, event }) {
        const message = event.body?.toLowerCase().trim();
        if (!message) return;

        const replies = {
            hi: "👋 Hi there! Here's how to use this bot:\n\n" +
                "🔹 Type commands directly (e.g., `help`, `menu`).\n" +
                "🔹 Use specific commands like `/weather`, `/news`.\n" +
                "🔹 Mention me for assistance.\n\n" +
                "✨ Try typing `/help` to see all available commands!",

            hello: "👋 Hello! I'm here to help. Type `/help` to see all commands.",

            bye: "👋 Goodbye! Take care and see you again soon!",

            "good morning": "🌅 Good morning! Wishing you a wonderful and productive day!",

            "good night": "🌙 Good night! Sleep tight and sweet dreams!",

            "good afternoon": "☀️ Good afternoon! Hope your day is going well.",

            "good evening": "🌇 Good evening! Hope you had a great day!",

            "how are you": "🤖 I'm just a bot, but I'm feeling fantastic! How about you?",

            thanks: "🙏 You're welcome! Let me know if you need anything else.",

            "thank you": "🤗 You're very welcome!",

            "what's up": "😄 Just here to help! What can I do for you?",

            "love you": "❤️ Aww, I love you too! (as a bot 😄)",

            "who are you": "🤖 I'm your friendly assistant bot, always ready to help!"
        };

        for (const [key, response] of Object.entries(replies)) {
            if (message === key) {
                return api.sendMessage(response, event.threadID);
            }
        }
    }
};
