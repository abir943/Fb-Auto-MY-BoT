module.exports = {
    name: "ping",
    description: "Check bot's response time.",
    execute: async (api, event) => {
        const start = Date.now();
        api.sendMessage("🏓 Pinging...", event.threadID, (err, info) => {
            if (!err) {
                const latency = Date.now() - start;
                api.sendMessage(`🏓 Pong! Latency: ${latency}ms`, event.threadID, info.messageID);
            }
        });
    }
};
