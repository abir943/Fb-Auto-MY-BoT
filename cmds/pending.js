module.exports = {
  name: "pending",
  aliases: ["pd"],
  usePrefix: true,
  description: "Approve or cancel pending group requests.",
  author: "Aminul Sordar",
  version: "1.0.4",

  execute: async (api, event, args) => {
    const { threadID, messageID, senderID } = event;

    // 🔐 Admin-only access
    if (senderID !== "100071880593545") {
      return api.sendMessage("🚫 | Sorry! Only the bot owner can use this command.", threadID, messageID);
    }

    // 📥 Fetch pending & spam group list
    let spam = [], pending = [];
    try {
      spam = await api.getThreadList(100, null, ["OTHER"]) || [];
      pending = await api.getThreadList(100, null, ["PENDING"]) || [];
    } catch (err) {
      return api.sendMessage("❌ | Failed to fetch pending group list!", threadID, messageID);
    }

    const list = [...spam, ...pending].filter(g => g.isGroup && g.isSubscribed);

    // 📋 Show list of pending groups
    if (args.length === 0) {
      if (list.length === 0) {
        return api.sendMessage("✅ | No pending groups found!", threadID, messageID);
      }

      let msg = "📂 𝗣𝗘𝗡𝗗𝗜𝗡𝗚 𝗚𝗥𝗢𝗨𝗣𝗦 𝗟𝗜𝗦𝗧\n━━━━━━━━━━━━━━\n";
      list.forEach((g, i) => {
        msg += `🔹 ${i + 1}. ${g.name || "Unnamed Group"}\n🆔 ${g.threadID}\n\n`;
      });
      msg += "━━━━━━━━━━━━━━\n";
      msg += "✅ To approve: `pending approve 1 2 ...`\n";
      msg += "❌ To cancel: `pending cancel 1 2 ...`";

      return api.sendMessage(msg, threadID, messageID);
    }

    // ✅ Approve or ❌ Cancel action
    const action = args[0].toLowerCase();
    const indexes = args.slice(1).map(i => parseInt(i));
    let count = 0;

    for (const index of indexes) {
      if (isNaN(index) || index <= 0 || index > list.length) {
        return api.sendMessage(`⚠️ | Invalid group number: ${index}`, threadID, messageID);
      }

      const target = list[index - 1];

      if (action === "cancel") {
        try {
          await api.removeUserFromGroup(api.getCurrentUserID(), target.threadID);
        } catch (err) {
          console.log("❌ Error removing bot from group:", err);
        }
      } else if (action === "approve") {
        const approvedMsg = 
`✅ 𝗚𝗥𝗢𝗨𝗣 𝗔𝗣𝗣𝗥𝗢𝗩𝗘𝗗!

━━━━━━━━━━━━━━
🎉 Hello everyone!
🤖 AminulBot is now activated in this group.

👑 𝗢𝘄𝗻𝗲𝗿: Aminul Sordar
📘 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: fb.com/profile.php?id=100071880593545
🕊 Bot powered by love & code 💻❤️
━━━━━━━━━━━━━━

🤗 Type 'help' to see all commands!
Thanks for trusting AminulBot 💌`;

        await api.sendMessage(approvedMsg, target.threadID);
      } else {
        return api.sendMessage("❌ | Invalid action! Use `approve` or `cancel`.", threadID, messageID);
      }

      count++;
    }

    const resultMsg = action === "approve"
      ? `✅ | Successfully approved ${count} group(s)!`
      : `❌ | Bot removed from ${count} group(s).`;

    return api.sendMessage(resultMsg, threadID, messageID);
  }
};
