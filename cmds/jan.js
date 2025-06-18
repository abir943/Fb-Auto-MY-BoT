const axios = require('axios');

module.exports = {
    name: "jan",
    description: "Chat with Jan AI or teach new responses",
    version: "1.0.0",
    usePrefix: true,
    cooldowns: 5,
    async execute(api, event, args) {
        const { threadID, messageID } = event;

        if (args.length === 0) {
            return api.sendMessage('⚠️ Usage:\n- `/jan <message>` (Chat with Jan AI)\n- `/jan add <question> - <answer>` (Teach Jan AI)\n- `/jan count` (Check stored responses)', threadID, messageID);
        }

        const subCommand = args[0].toLowerCase();

        // Teach Jan AI
        if (subCommand === "add") {
            const input = args.slice(1).join(" ").split(" - ");
            if (input.length < 2) {
                return api.sendMessage('⚠️ Usage: `/jan add <question> - <answer>`', threadID, messageID);
            }

            const [question, answer] = input.map(text => text.trim());
            try {
                await axios.post("https://jan-api-v2-siamthefrog-0ud6.onrender.com/teach", { question, answer });
                return api.sendMessage(`✅ Successfully taught: **"${question}" → "${answer}"**`, threadID, messageID);
            } catch (error) {
                console.error("❌ Teach API Error:", error);
                return api.sendMessage("❌ Failed to teach Jan AI. Try again later.", threadID, messageID);
            }
        }

        // Check stored response count
        if (subCommand === "count") {
            try {
                const response = await axios.get("https://jan-api-v2-siamthefrog-0ud6.onrender.com/count");
                return api.sendMessage(`📊 Jan AI has learned **${response.data.count}** responses.`, threadID, messageID);
            } catch (error) {
                console.error("❌ Count API Error:", error);
                return api.sendMessage("❌ Failed to get response count. Try again later.", threadID, messageID);
            }
        }

        // Chat with Jan AI
        try {
            const question = args.join(" ");
            const response = await axios.get(`https://jan-api-v2-siamthefrog-0ud6.onrender.com/answer/${encodeURIComponent(question)}`);
            const reply = response.data.answer || "❌ No answer found.";
            return api.sendMessage(`🤖 **Jan AI:** ${reply}`, threadID, messageID);
        } catch (error) {
            console.error("❌ Chat API Error:", error);
            return api.sendMessage("❌ Jan AI is unavailable. Try again later.", threadID, messageID);
        }
    },
};
