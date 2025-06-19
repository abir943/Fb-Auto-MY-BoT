module.exports = {
    name: "test",
    description: "A simple test command to check bot functionality.",
    usage: "{p}test [your_message]",
    usePrefix: true,
    admin: false,

    async execute({ api, event, args, ownerUid }) {
        const { senderID: userId, threadID: threadId, body } = event;

        let reply = "✅ Hello! This is a test command from Aminul Multi-Bot.";

        if (args.length > 0) {
            const userMsg = args.join(" ");
            reply += `\n🗨️ You said: "${userMsg}"`;
        }

        reply += `\n👤 Your User ID: ${userId}`;
        reply += `\n💬 Conversation ID: ${threadId}`;

        // Notify bot owner if command used by someone else
        if (ownerUid && ownerUid !== userId) {
            api.sendMessage(
                `📢 [BOT OWNER NOTICE]\n🔹 User: ${userId}\n🔹 Thread: ${threadId}\n🔹 Message: "${body}"`,
                ownerUid
            );
        }

        try {
            await api.sendMessage(reply, threadId);
            console.log(`✅ Test command executed by ${userId} in ${threadId}`);
        } catch (err) {
            console.error("❌ Failed to send test command message:", err);
            api.sendMessage("⚠️ An error occurred while executing the test command.", threadId);
        }
    }
};
