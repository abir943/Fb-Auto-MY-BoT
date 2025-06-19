module.exports = {
  name: "message1",
  async execute({ api, event }) {
    const { body, threadID, messageID, senderID } = event;
    const message = body?.toLowerCase().trim();
    if (!message) return;

    const name = global.data?.userName?.get(senderID) || "বন্ধু";

    const randomReplies = [
      "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ😇😘",
      "কি গো সোনা আমাকে ডাকছ কেনো?",
      "বার বার আমাকে ডাকস কেন😡",
      "আহ শোনা আমার আমাকে এতো ডাক্তাছো কেনো আসো বুকে আশো🥱",
      "হুম জান তোমার অইখানে উম্মমাহ😷😘",
      "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি",
      "আমাকে এতো না ডেকে বস আমিনুলকে একটা গফ দে 🙄",
      "জাং হাঙা করবা?",
      "জাং বাল ফেলবা 🙂"
  ];

    const replies = {
      "love you": "❤️ Aww, I love you too!",
      "i love you": "Hmm... বস আমিনুলও তোমাকে ভালোবাসে😇😻",
      "i love you bot": "আমি রোবট তাই প্রেম করতে পারবো না😥\nআমার বস আমিনুল সাথে প্রেম কর😇😻",
      "will you marry me bot": "আমি বিয়ে করবো না! বস আমিনুলের সাথে যোগাযোগ করুন🫡",
      "does bot love you": "Hi, Bot loves you more than me, love bot <3",
      "bot loves you": "Bot loves you more 😍",
      "bot goes to sleep": "I'm a bot, you're the one who should go to sleep <3",
      "assalamu alaikum": "️- ওয়ালাইকুমুস-সালাম-!!🖤",
      "আসসালামুয়ালাইকুম": "️- ওয়ালাইকুমুস-সালাম-!!🖤",
      "assalamualaikum": "️- ওয়ালাইকুমুস-সালাম-!!🖤",
      "আস-সালামু আলাইকুম": "️- ওয়ালাইকুমুস-সালাম-!!🖤",
      "salam": "কিরে সালাম দিতে কষ্ট হয়😡\nতাও পাপ কামাই করিস না🙂",
      "cc": "️কিরে ছিছি করিস কেন 😡\nতরা যেবাবে আমাকে ব্যবহার করবি আমিতো সেভাবেই সার্ভিস দিবো😈",
      "ccc": "️কিরে ছিছি করিস কেন 😡\nতরা যেবাবে আমাকে ব্যবহার করবি আমিতো সেভাবেই সার্ভিস দিবো😈",
      "cc bot": "️তরা যেবাবে আমাকে ব্যবহার করবি আমিতো সেভাবেই সার্ভিস দিবো😈",
      "bal": "~এখনো বাল উঠে নাই নাকি?❌",
      "bsvv nha mng": "Hello dear, have a nice day ❤️",
      "btvv nha mng": "Hello dear, have a nice day ❤️",
      "btvv nha mn": "Hello dear, have a nice day ❤️",
      "bsvv nha mn": "Hello dear, have a nice day ❤️",
      "hi ae": "Hello dear, have a nice day ❤️",
      "hiii": "Hello dear, have a nice day ❤️",
      "nn nha mng": "️Sleep well <3 Wish you sweet dreams <3",
      "tt go mn": "️1 is interaction, 2 is kick :))))",
      "tt go mng": "️1 is interaction, 2 is kick :))))",
      "tt mng oi": "️1 is interaction, 2 is kick :))))",
      "let's go": "️1 is interaction, 2 is kick :))))",
      "flop over": "️1 is interaction, 2 is kick :))))",
      "clmm bot": "️Swear something dog :) you've been holding it too long",
      "what's the bot swearing": "Damn you, shame on hahaha :>>",
      "bot cursing": "Damn you, shame on hahaha :>>",
      "is the bot sad": "Why can't I be sad? Everyone hurts me 😔",
      "does the bot love you": "Yes I love you and everyone so much ❤️",
      "does the bot have a brand": "Yes <3",
      "does the bot fall": "Yes <3"
    };

    if (replies.hasOwnProperty(message)) {
      return api.sendMessage(replies[message], threadID, messageID);
    }

    if (message.startsWith("bot")) {
      const randomMsg = randomReplies[Math.floor(Math.random() * randomReplies.length)];
      return api.sendMessage({ body: `${name}, ${randomMsg}` }, threadID, messageID);
    }
  }
};
