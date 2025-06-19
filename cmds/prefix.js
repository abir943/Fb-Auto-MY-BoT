const fs = require("fs");
const axios = require("axios");
const path = require("path");

// Define helpful tips array
const tips = [
    "Use /help to discover commands!",
    "Admins can customize prefix per group!",
    "Use commands without prefix if allowed!"
];

// Function to format uptime in h m s
function formatUptime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs}h ${mins}m ${secs}s`;
}

// Ensure config.json exists before trying to read it.
const configPath = "./config.json";
if (!fs.existsSync(configPath)) {
    console.error("Error: config.json not found! Please create it with at least 'prefix' and 'botName' fields.");
    process.exit(1);
}
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// In a real bot, you'd track the bot's start time globally.
// For this example, let's simulate a start time or assume a global variable `botStartTime` exists.
const botStartTime = Date.now() - (1 * 3600 * 1000 + 49 * 60 * 1000 + 59 * 1000); // Simulating 1h 49m 59s uptime for demonstration

module.exports = {
    name: "prefix",
    usePrefix: false,
    usage: "prefix",
    version: "1.1",
    description: "Displays the bot's prefix, name, and other useful information along with a GIF.",
    cooldown: 5,
    admin: false,

    execute: async ({ api, event }) => {
        const { threadID, messageID } = event;

        // Retrieve bot information from config or use defaults
        const botPrefix = config.prefix || "/";
        const botName = config.botName || "Aminul-Bot";
        const ownerID = config.ownerID || "N/A"; // Assuming ownerID is in config, default to N/A

        // Calculate actual uptime
        const currentUptimeSeconds = Math.floor((Date.now() - botStartTime) / 1000);
        const formattedUptime = formatUptime(currentUptimeSeconds);
        
        // Get a random tip
        const randomTip = tips[Math.floor(Math.random() * tips.length)];

        // Get current time in Bangladesh time zone
        const currentTime = new Date().toLocaleString("en-US", {
            timeZone: "Asia/Dhaka",
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });

        const gifUrl = "https://media.giphy.com/media/1UwhOK8VX95TcfPBML/giphy.gif";
        const tempFilePath = path.join(__dirname, "prefix.gif");

        try {
            // Download GIF
            const response = await axios({
                url: gifUrl,
                method: "GET",
                responseType: "stream",
            });

            const writer = fs.createWriteStream(tempFilePath);
            response.data.pipe(writer);

            writer.on("finish", () => {
                // Construct the detailed bot information message
                // Removed '📦 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: ${commandsCount}' line
                const messageBody = `━━━━━━━━━━━━━━━━━━━━━━\n🤖 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡\n━━━━━━━━━━━━━━━━━━━━━━\n✨ 𝗡𝗮𝗺𝗲: ${botName}\n🔑 𝗣𝗿𝗲𝗳𝗶𝘅: ${botPrefix}\n👑 𝗢𝘄𝗻𝗲𝗿 𝗜𝗗: ${ownerID}\n⏱️ 𝗨𝗽𝘁𝗶𝗺𝗲: ${formattedUptime}\n🕒 𝗧𝗶𝗺𝗲: ${currentTime}\n✅ 𝗦𝘁𝗮𝘁𝘂𝘀: Online & Running\n💡 𝗧𝗶𝗽: ${randomTip}\n━━━━━━━━━━━━━━━━━━━━━━`;

                api.sendMessage(
                    {
                        body: messageBody,
                        attachment: fs.createReadStream(tempFilePath),
                    },
                    threadID,
                    (err) => {
                        fs.unlinkSync(tempFilePath); // Delete after sending
                        if (err) console.error("Error sending message:", err);
                    }
                );
            });

            writer.on("error", (err) => {
                console.error("Error saving GIF:", err);
                api.sendMessage("⚠️ Failed to download or save GIF.", threadID, messageID);
            });

        } catch (error) {
            console.error("Error fetching GIF or sending message:", error);
            api.sendMessage("⚠️ Could not retrieve bot information or GIF.", threadID, messageID);
        }
    },
};
