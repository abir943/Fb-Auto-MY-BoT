const fs = require('fs');
const os = require('os');
const path = require('path');
const chalk = require('chalk');
const axios = require('axios');
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

// Format uptime in h m s
function formatUptime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs}h ${mins}m ${secs}s`;
}

// Helpful tips
const tips = [
    "Use /help to discover commands!",
    "Admins can customize prefix per group!",
    "Use commands without prefix if allowed!"
];

module.exports = {
    name: "prefix",
    usePrefix: false,
    usage: "prefix",
    version: "2.0",
    author:"Aminul sordar",
    description: "Show current bot prefix, name, and system info",

    async execute(api, event, args) {
        const botName = config.botName || "My Bot";
        const botPrefix = config.botPrefix || "/";
        const ownerID = config.ownerID || "Unknown";
        const uptime = formatUptime(process.uptime());
        const date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
        const commandCount = fs.readdirSync('./cmds/').filter(file => file.endsWith('.js')).length;
        const randomTip = tips[Math.floor(Math.random() * tips.length)];

        const message = 
`━━━━━━━━━━━━━━━━━━━━━━
🤖 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡
━━━━━━━━━━━━━━━━━━━━━━
✨ 𝗡𝗮𝗺𝗲: ${botName}
🔑 𝗣𝗿𝗲𝗳𝗶𝘅: ${botPrefix}
👑 𝗢𝘄𝗻𝗲𝗿 𝗜𝗗: ${ownerID}
📦 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: ${commandCount}
⏱️ 𝗨𝗽𝘁𝗶𝗺𝗲: ${uptime}
🕒 𝗧𝗶𝗺𝗲: ${date}
✅ 𝗦𝘁𝗮𝘁𝘂𝘀: Online & Running
💡 𝗧𝗶𝗽: ${randomTip}
━━━━━━━━━━━━━━━━━━━━━━`;

        // Setup GIF
        const gifUrl = 'https://media.giphy.com/media/1UwhOK8VX95TcfPBML/giphy.gif';
        const gifPath = path.join(__dirname, 'cache', 'prefix.gif');

        // Auto-create cache folder if missing
        if (!fs.existsSync(path.dirname(gifPath))) {
            fs.mkdirSync(path.dirname(gifPath), { recursive: true });
        }

        // Download GIF if not already saved
        if (!fs.existsSync(gifPath)) {
            try {
                const response = await axios.get(gifUrl, { responseType: 'arraybuffer' });
                fs.writeFileSync(gifPath, Buffer.from(response.data, 'binary'));
            } catch (err) {
                console.error(chalk.red("[PREFIX] Failed to download GIF:"), err);
            }
        }

        // Send message with image
        const msg = {
            body: message,
            attachment: fs.existsSync(gifPath) ? fs.createReadStream(gifPath) : null
        };

        api.sendMessage(msg, event.threadID, event.messageID);

        // Terminal log
        console.log(chalk.green(`[PREFIX] Info sent to thread ${event.threadID}`));
    }
};
