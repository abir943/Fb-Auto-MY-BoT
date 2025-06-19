const moment = require("moment-timezone");

module.exports = {
  name: "event",

  async execute({ api, event }) {
    if (event.logMessageType === "log:subscribe") {
      try {
        const threadID = event.threadID;
        const botID = api.getCurrentUserID();
        const threadInfo = await api.getThreadInfo(threadID);

        const totalMembers = threadInfo.participantIDs.length;
        const adminsCount = threadInfo.adminIDs.length;
        const boxName = threadInfo.threadName || "এই গ্রুপ";

        const newUsers = event.logMessageData.addedParticipants;

        for (const user of newUsers) {
          const userID = user.userFbId;
          const userName = user.fullName || "নতুন সদস্য";

          const mentions = [{ tag: userName, id: userID }];

          const memberNumber = totalMembers;
          const dateTime = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");

          const message = {
            body: 
`╔════•|      💛      |•════╗
❤️আ্ঁস্ঁসা্ঁলা্ঁমু্ঁ💚আ্ঁলা্ঁই্ঁকু্ঁম্ঁ❤️
╚════•|      💛      |•════╝

━❯🅆🄴🄻🄲🄾🄼🄴➤

━❯🅽🅴🆆➤

━❯🇲‌🇪‌🇲‌🇧‌🇪‌🇷‌➤

━❯@${userName}➤

༄✺আ্ঁপ্ঁনা্ঁকে্ঁ আ্ঁমা্ঁদে্ঁর্ঁ✺࿐

『 ${boxName} 』

🌺🌿🌸—এ্ঁর্ঁ প্ঁক্ষ্ঁ🍀থে্ঁকে্ঁ🍀—🌸🌿

🌿_ভা্ঁলো্ঁবা্ঁসা্ঁ_অ্ঁভি্ঁরা্ঁম্ঁ_🌿

༄✺আঁপঁনিঁ এঁইঁ গ্রুঁপেঁর ${memberNumber} নঁং মে্ঁম্বা্ঁরঁ ࿐

📌 Total members: ${totalMembers}
👑 Total admins: ${adminsCount}

⏰ Current date and time: ${dateTime}

আমাদের সাথে সময় দেওয়া ও পাশে থাকার অনুরোধ রইলো !!-🍂🌺🥀

🦋༎❤❤༎

ⵗⵗ̥̥̊̊ⵗ̥̥̥̥̊̊̊ⵗ̥̥̥̥̥̊̊̊̊ⵗ̥̥̥̥̥̥̊̊̊̊̊ⵗ̥̥̥̥̥̥̥̊̊̊̊̊ⵗ̥̥̥̥̥̥̥̥̊̊̊̊ⵗ̥̥̥̥̥̥̥̥̥̊̊̊ⵗ̥̥̥̥̥̥̥̥̥̥̊̊ⵗ̥̥̥̥̥̥̥̥̥̥̥ⵗ̥̥̥̥̥̥̥̥̥̥̊̊ⵗ̥̥̥̥̥̥̥̥̥̊̊̊ⵗ̥̥̥̥̥̥̥̥̊̊̊̊ⵗ̥̥̥̥̥̥̥̊̊̊̊̊ⵗ̥̥̥̥̥̥̊̊̊̊̊ⵗ̥̥̥̥̥̊̊̊̊ⵗ̥̥̥̥̊̊̊ⵗ̥̥̊̊ 

🦋║ლ💞 💞 ლ║🦋

💐☘️-ধন্যবাদ প্রিয়-☘️💐
𝄞❤️⋆⃝⑅⑅⃝❤️»̶̶͓͓̽̽̽»̶̶͓͓̽̽̽.𝐁𝐎𝐓-𝐎𝐖𝐍𝐄𝐑: 𝗔𝗺𝗶𝗻𝘂𝗹 𝗦𝗼𝗿𝗱𝗮𝗿❤️⃪⃝⃘᭄⃕❤️`,
            mentions
          };

          await api.sendMessage(message, threadID);

          // If the bot itself is added to the group
          if (userID === botID) {
            await api.changeNickname("🤖 Bot Assistant", threadID, botID);
            await api.sendMessage(
              "✅ আমি বট, আমাকে গ্রুপে অ্যাড করার জন্য ধন্যবাদ!\n📌 লিখুন /help সমস্ত কমান্ড দেখতে।",
              threadID
            );
          }
        }
      } catch (error) {
        console.error("❌ Error handling welcome event:", error);
      }
    }
  }
};
