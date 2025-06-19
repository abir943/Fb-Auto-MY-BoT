module.exports = {
  name: "groupinfo",
  aliases: ["ginfo", "threadinfo"],
  description: "Displays information about the current group.",
  version: "1.0",
  category: "info",
  usage: "",
author:" aminul Sorder",
  cooldown: 5,
  permissions: [],
  usePrefix: true,

  async execute(api, event) {
    try {
      const threadID = event.threadID;

      const threadInfo = await api.getThreadInfo(threadID);

      const groupName = threadInfo.threadName || "Unnamed Group";
      const memberCount = threadInfo.participantIDs.length;
      const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
      const adminCount = adminIDs.length;
      const emoji = threadInfo.emoji || "💬";
      const threadLink = `https://www.facebook.com/messages/t/${threadID}`;

      const message = `
━━━━━━━━━━━━━━━━━━━━━━
👥 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢
━━━━━━━━━━━━━━━━━━━━━━
🏷️ Name       : ${groupName}
🆔 Thread ID  : ${threadID}
👥 Members    : ${memberCount}
🛡️ Admins     : ${adminCount}
🔗 Link       : ${threadLink}
🎭 Emoji      : ${emoji}
━━━━━━━━━━━━━━━━━━━━━━
      `.trim();

      api.sendMessage(message, threadID);
    } catch (err) {
      console.error("❌ Error in groupinfo command:", err);
      api.sendMessage("❌ Failed to fetch group information.", event.threadID);
    }
  }
};
