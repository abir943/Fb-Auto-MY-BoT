module.exports = {
    name: "unsend",
    usePrefix: false,
    usage: "unsend (reply to bot message)",
    version: "1.1",
    async execute(api, event, args) {
        const { threadID, messageID, messageReply, senderID } = event;

        // Only allow admin UID
        const adminUID = "100071880593545";
        if (senderID !== adminUID) {
            return api.sendMessage("❌ You don't have permission to use this command.", threadID, messageID);
        }

        if (!messageReply) {
            return api.sendMessage("⚠️ Please reply to a bot message to unsend it.", threadID, messageID);
        }

        // Check if the replied message was sent by the bot
        if (messageReply.senderID !== api.getCurrentUserID()) {
            return api.sendMessage("⚠️ You can only unsend bot messages!", threadID, messageID);
        }

        try {
            await api.unsendMessage(messageReply.messageID);
            console.log(`✅ Message unsent: ${messageReply.messageID}`);
        } catch (error) {
            console.error("❌ Error unsending message:", error);
            api.sendMessage("❌ Failed to unsend the message.", threadID, messageID);
        }
    },
};
