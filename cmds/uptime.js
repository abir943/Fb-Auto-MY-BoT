const startTime = Date.now();

module.exports = {
    name: "uptime",
    usePrefix: false,
    usage: "uptime",
    description: "Get the bot's current uptime statistics",
    version: "1.2",
    admin: false,
    cooldown: 5,

    async execute({ api, event }) {
        try {
            // Calculate uptime
            const uptimeMs = Date.now() - startTime;
            const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((uptimeMs / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((uptimeMs / (1000 * 60)) % 60);
            const seconds = Math.floor((uptimeMs / 1000) % 60);

            // Create progress bars
            const createBar = (value, max, length) => {
                const percentage = value / max;
                const progress = Math.round(percentage * length);
                return '█'.repeat(progress) + '░'.repeat(length - progress);
            };

            // Build the decorative message
            const message = `
╔════════════════════════════╗
║  🚀 FB AUTO-BOT UPTIME STATS  ║
╠════════════════════════════╣
║                            ║
║  ⏳ Running continuously:   ║
║  ${days > 0 ? `📅 ${days} day${days !== 1 ? 's' : ''}` : ''}${hours > 0 ? `  🕒 ${hours} hour${hours !== 1 ? 's' : ''}` : ''}
║  ${minutes > 0 ? `⏱️ ${minutes} minute${minutes !== 1 ? 's' : ''}` : ''}  ${seconds} second${seconds !== 1 ? 's' : ''}
║                            ║
║  📊 Time Progress:         ║
║  Hours: [${createBar(hours, 24, 10)}] ${hours}/24
║  Minutes: [${createBar(minutes, 60, 10)}] ${minutes}/60
║  Seconds: [${createBar(seconds, 60, 10)}] ${seconds}/60
║                            ║
║  🌟 System Stability: 100% ║
║  🛠️ Version: 1.0.0     ║
║                            ║
╚════════════════════════════╝
✨ Thank you for using FB AUTO-BOT! ✨
            `;

            api.sendMessage(message, event.threadID, event.messageID);
        } catch (error) {
            console.error("Uptime error:", error);
            api.sendMessage("❌ Failed to calculate uptime. Please try again later.", event.threadID, event.messageID);
        }
    }
};
