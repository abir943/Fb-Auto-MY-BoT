const fs = require("fs-extra");

module.exports = {
  name: "message",
  async execute({ api, event }) {
    const message = event.body?.toLowerCase().trim();
    if (!message) return;

    const replies = {
      hi: "👋 Hi there! Here's how to use this bot:\n\n🔹 Type commands directly (e.g., `help`, `menu`).\n🔹 Use specific commands like `/weather`, `/news`.\n🔹 Mention me for assistance.\n\n✨ Try typing `/help` to see all available commands!",
      hello: "👋 Hello! I'm here to help. Type `/help` to see all commands.",
      bye: "👋 Goodbye! Take care and see you again soon!",
      "good morning": "🌅 Good morning! Wishing you a wonderful and productive day!",
      "good night": "🌙 Good night! Sleep tight and sweet dreams!",
      "good afternoon": "☀️ Good afternoon! Hope your day is going well.",
      "good evening": "🌇 Good evening! Hope you had a great day!",
      "how are you": "🤖 I'm just a bot, but I'm feeling fantastic! How about you?",
      thanks: "🙏 You're welcome! Let me know if you need anything else.",
      "thank you": "🤗 You're very welcome!",
      "what's up": "😄 Just here to help! What can I do for you?",
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
      salam: "কিরে সালাম দিতে কষ্ট হয়😡\nতাও পাপ কামাই করিস না🙂",
      cc: "️কিরে ছিছি করিস কেন 😡\nতরা যেবাবে আমাকে ব্যবহার করবি আমিতো সেভাবেই সার্ভিস দিবো😈",
      ccc: "️কিরে ছিছি করিস কেন 😡\nতরা যেবাবে আমাকে ব্যবহার করবি আমিতো সেভাবেই সার্ভিস দিবো😈",
      "cc bot": "️তরা যেবাবে আমাকে ব্যবহার করবি আমিতো সেভাবেই সার্ভিস দিবো😈",
      bal: "~এখনো বাল উঠে নাই নাকি?❌",
      "🤔": "☹︎シ︎আমি ভাবি ই একটু আলাদা আর যা করি নিজের মন মতো করি  ಠ★\n\n༆কারোরমতো হওয়ার ইচ্ছা  আমার নাইシ︎\n\n☺︎︎কারন আমি নিজেই ব্যান্ড তোমার মতো আবাল না🤟\n\n𓂀 𝔸𝕞𝕚𝕟𝕦𝕝 𝕊𝕠𝕣𝕕𝕒𝕣 𓂀🤟💥",
      "🕵️‍♀️": "☹︎シ︎আমি ভাবি ই একটু আলাদা আর যা করি নিজের মন মতো করি  ಠ★\n\n༆কারোরমতো হওয়ার ইচ্ছা  আমার নাইシ︎\n\n☺︎︎কারন আমি নিজেই ব্যান্ড তোমার মতো আবাল না🤟\n\n𓂀 𝔸𝕞𝕚𝕟𝕦𝕝 𝕊𝕠𝕣𝕕𝕒𝕣 𓂀🤟💥",
      "😘": "কিস দিস না তোর মুখে দূর গন্ধ কয়দিন ধরে দাঁত ব্রাশ করিস নাই🤬",
      "😽": "কিস দিস না তোর মুখে দূর গন্ধ কয়দিন ধরে দাঁত ব্রাশ করিস নাই🤬",
      "👍": "সর এখান থেকে লাইকার আবাল..!🐸🤣👍⛏️",
      hlw: "এত হাই-হ্যালো ..!🍆⛏️🐸🤣",
      helo: "এত হাই-হ্যালো ..!🍆⛏️🐸🤣",
      "🎭": "༎🎭༅•─༅༅─•༅🎭༎\n\nচুলা জ্বালাইতে পারে না  একটা  ༎﹏ღ\n❌༅༎সম্পর্কে আগুন লাগাইতে।পারে༎❌\n\n༊_༎কিছু মাদারচোদ লোক🎭\n\n༎🎭༅•༅༅༎༅•༅🎭༎\n꧁✨☬̈́☆☆☆☬̈́✨꧂\n𝔸𝕞𝕚𝕟𝕦𝕝 𝕊𝕠𝕣𝕕𝕒𝕣 𓂀😈",
      "👏": "༎🎭༅•─༅༅─•༅🎭༎\n\nচুলা জ্বালাইতে পারে না  একটা  ༎﹏ღ\n❌༅༎সম্পর্কে আগুন লাগাইতে।পারে༎❌\n\n༊_༎কিছু মাদারচোদ লোক🎭\n\n༎🎭༅•༅༅༎༅•༅🎭༎\n꧁✨☬̈́☆☆☆☬̈́✨꧂\n𝔸𝕞𝕚𝕟𝕦𝕝 𝕊𝕠𝕣𝕕𝕒𝕣 𓂀😈",
      "✍️": "༎🎭༅•─༅༅─•༅🎭༎\n\n༊_༎ আগে আমি অনেক ভালো ছিলাম  \n\n﹏😌ღ\n\n༅༎﹏ আগে তবে এখন না 😈👿🎭\n\n༎🎭༅•༅༅༎༅•༅🎭༎\n𓂀 𝔸𝕞𝕚𝕟𝕦𝕝 𝕊𝕠𝕣𝕕𝕒𝕣 𓂀😈",
      "ami vlo": "༎🎭༅•─༅༅─•༅🎭༎\n\n༊_༎ আগে আমি অনেক ভালো ছিলাম  \n\n﹏😌ღ\n\n༅༎﹏ আগে তবে এখন না 😈👿🎭\n\n༎🎭༅•༅༅༎༅•༅🎭༎\n𓂀 𝔸𝕞𝕚𝕟𝕦𝕝 𝕊𝕠𝕣𝕕𝕒𝕣 𓂀😈",
      kharap: "༎🎭༅•─༅༅─•༅🎭༎\n\n༊_༎ আগে আমি অনেক ভালো ছিলাম  \n\n﹏😌ღ\n\n༅༎﹏ আগে তবে এখন না 😈👿🎭\n\n༎🎭༅•༅༅༎༅•༅🎭༎\n𓂀 𝔸𝕞𝕚𝕟𝕦𝕝 𝕊𝕠𝕣𝕕𝕒𝕣 𓂀😈",
      morning: "Hello dear, have a nice day ❤️",
      anyone: "Main Hun Naw JaNyMan ❤️",
      any: "Main Hun Naw JaNyMan ❤️",
      aminul: "উনি এখন কাজে বিজি আছে যা বলার আমাকে বলতে পারেন😘",
      "aminul sordar": "উনি এখন কাজে বিজি আছে যা বলার আমাকে বলতে পারেন😘",
      "@aminul sordar": "উনি এখন কাজে বিজি আছে যা বলার আমাকে বলতে পারেন😘",
      "bsvv nha mng": "Hello dear, have a nice day ❤️",
      "btvv nha mng": "Hello dear, have a nice day ❤️",
      "btvv nha mn": "Hello dear, have a nice day ❤️",
      "bsvv nha mn": "Hello dear, have a nice day ❤️",
      "hi ae": "Hello dear, have a nice day ❤️",
      hiii: "Hello dear, have a nice day ❤️",
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

    if (replies[message]) {
      return api.sendMessage(replies[message], event.threadID);
    }
  }
};
