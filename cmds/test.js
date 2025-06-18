module.exports = {
    name: "test", // Command name
    aliases: ["t"], // Aliases for the command
    usePrefix: true, // Require bot prefix to execute
    description: "A test command to check if the bot is working.",
    execute: async (api, event, args) => {
        try {
            const { threadID, messageID, senderID } = event;
            
            // Respond with a test message
            api.sendMessage("✅ The bot is working perfectly!", threadID, messageID);
        } catch (error) {
            console.error("❌ Error executing test command:", error);
        }
    }
};
