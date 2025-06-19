module.exports = {
    name: "rules",
    usePrefix: false,
    version: "1.2",
    usage: "Simply type 'rules' to view the group rules.",
    description: "Displays the group rules to ensure a safe and friendly environment.",
    category: "Moderation",

    execute(api, event) {
        const rules = [
            "❌ **No spamming** – Avoid sending unnecessary messages or links.",
            "😡 **No hate speech** – Racism, sexism, and discrimination are not allowed.",
            "⚠️ **Respect others** – Treat everyone with kindness and respect.",
            "📛 **No personal attacks** – Bullying or harassment will not be tolerated.",
            "🚫 **No self-promotion** – Advertising or promotions require admin approval.",
            "🔞 **No NSFW content** – Keep the group clean and safe for everyone.",
            "🔊 **Follow admin instructions** – Obey the admins to maintain order.",
            "🤖 **No bot abuse** – Don't spam or misuse the bot.",
            "📜 **English/Bengali only** – Communicate in a language everyone understands."
        ];

        const rulesMessage = `📜 **Group Rules** (Version 1.2) 📜\n\n${rules.map((rule, index) => `${index + 1}. ${rule}`).join("\n")}\n\n⚠️ **Failure to follow these rules may result in a warning or ban.**`;

        return api.sendMessage({ body: rulesMessage }, event.threadID, event.messageID);
    }
};
