const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  name: "noti",
  aliases: ["notify", "noti"],
  description: "Send a decorated notification to all group chats. Only the admin can use this.",
  usage: "[Prefix]notification <message>",
  usePrefix: true,
  author: "Aminulsordar",
  version: "1.2.1",

  execute: async (api, event, args) => {
    const adminID = "100071880593545";
    const { threadID, messageID, attachments, messageReply, senderID, messageReplyID } = event;

    // 🔐 Restrict to admin
    if (senderID !== adminID) {
      return api.sendMessage("❌ Only the bot admin can use this command.", threadID, messageID);
    }

    // 🔁 If this is a reply to the bot's notification, forward it to admin
    if (messageReplyID) {
      api.getMessageInfo(messageReplyID, (err, info) => {
        const isFromBot = !err && info.senderID === api.getCurrentUserID() && info.body?.includes("[ADMIN NOTICE]");
        if (isFromBot) {
          const replyMsg = `📩 Reply from user ${senderID} in group ${threadID}:\n\n${args.join(" ")}`;
          return api.sendMessage(replyMsg, adminID);
        }
      });
      return;
    }

    // ⛔ Missing message
    if (!args[0]) {
      return api.sendMessage("⚠️ Please enter a message to send as a notification.", threadID, messageID);
    }

    // 📥 Get group chats
    let threads;
    try {
      const inbox = await api.getThreadList(100, null, ["INBOX"]);
      threads = inbox.filter(t => t.isGroup && t.isSubscribed);
    } catch (err) {
      console.error("❌ Failed to get thread list:", err);
      return api.sendMessage("❌ Failed to retrieve group list.", threadID, messageID);
    }

    if (threads.length === 0) {
      return api.sendMessage("⚠️ No active groups found to send the notification.", threadID, messageID);
    }

    // 📎 Collect attachments
    const allAttachments = [...attachments, ...(messageReply?.attachments || [])];
    const validTypes = ["photo", "png", "animated_image", "video", "audio"];
    const files = [];

    for (const item of allAttachments.filter(a => validTypes.includes(a.type))) {
      try {
        const ext = item.type === "audio" ? ".mp3" : path.extname(item.url).split("?")[0] || ".jpg";
        const filePath = path.join(__dirname, `cache_notify_${Date.now()}${ext}`);
        const res = await axios.get(item.url, { responseType: "arraybuffer" });
        fs.writeFileSync(filePath, res.data);
        files.push(fs.createReadStream(filePath));
      } catch (err) {
        console.warn("⚠️ Failed to download attachment:", err.message);
      }
    }

    // ✉️ Build the message
    const decoratedMessage = `🛎️ [ADMIN NOTICE]\n━━━━━━━━━━━━━━━━━━\n${args.join(" ")}\n━━━━━━━━━━━━━━━━━━\n💬 You can reply to this message to contact the admin.`;
    const messageData = {
      body: decoratedMessage,
      attachment: files.length > 0 ? files : undefined
    };

    // ⏳ Sending notification
    await api.sendMessage(`🔄 Sending notification to ${threads.length} groups...`, threadID, messageID);

    const delay = 300;
    let success = 0;
    const failed = [];

    for (const group of threads) {
      try {
        await api.sendMessage(messageData, group.threadID);
        success++;
        await new Promise(res => setTimeout(res, delay));
      } catch (err) {
        failed.push({ id: group.threadID, error: err.message });
      }
    }

    // 📊 Report
    let summary = `✅ Notification sent to ${success} group(s).`;
    if (failed.length > 0) {
      summary += `\n⚠️ Failed to send to ${failed.length} group(s):\n` +
        failed.map(f => `- ${f.id}: ${f.error}`).join("\n");
    }

    api.sendMessage(summary, threadID, messageID);

    // 🧹 Cleanup
    for (const f of files) {
      if (f.path && fs.existsSync(f.path)) {
        fs.unlinkSync(f.path);
      }
    }
  }
};
