const fs = require("fs");

module.exports = {
  name: "message1",
  async execute({ api, event }) {
    const { body, threadID, messageID, senderID } = event;
    const message = body?.toLowerCase().trim();
    if (!message) return;

    const name = global.data?.userName?.get(senderID) || "বন্ধু";

    // Replies to exact matches
    const replies = {
      "not work": "Yes <3"
    };

    // Random replies for message starting with 'bot'
    const randomReplies = [
      "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ😇😘",
      "কি গো সোনা আমাকে ডাকছ কেনো?",
      "বার বার আমাকে ডাকস কেন😡",
      "আহ শোনা আমার আমাকে এতো ডাক্তাছো কেনো আসো বুকে আশো🥱",
      "হুম জান তোমার অইখানে উম্মমাহ😷😘",
      "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি",
      "আমাকে এতো না ডেকে বস আমিনুলকে একটা গফ দে 🙄",
      "জাং হাঙা করবা?",
      "জাং বাল ফেলবা 🙂",
      "বেশি bot Bot করলে leave নিবো কিন্তু😒😒",
      "শুনবো না😼তুমি আমাকে প্রেম করাই দাও নাই🥺পচা তুমি🥺",
      "আমি আবাল দের সাথে কথা বলি না,ok😒",
      "এতো ডেকো না,প্রেম এ পরে যাবো তো🙈",
      "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈💋",
      "বার বার ডাকলে মাথা গরম হয়ে যায় কিন্তু😑",
      "হ্যা বলো😒, তোমার জন্য কি করতে পারি😐😑?",
      "এতো ডাকছিস কেন?গালি শুনবি নাকি? 🤬",
      "I love you janu🥰",
      "আরে Bolo আমার জান ,কেমন আছো?😚",
      "Bot বলে অসম্মান করছি,😰😿",
      "Hop beda😾,Boss বল boss😼",
      "চুপ থাক ,নাই তো তোর দাত ভেগে দিবো কিন্তু",
      "Bot না , জানু বল জানু 😘",
      "বার বার Disturb করছিস কোনো😾,আমার জানুর সাথে ব্যাস্ত আছি😋",
      "বোকাচোদা এতো ডাকিস কেন🤬",
      "আমাকে ডাকলে ,আমি কিন্তু কিস করে দিবো😘",
      "আমারে এতো ডাকিস না আমি মজা করার mood এ নাই এখন😒",
      "হ্যাঁ জানু , এইদিক এ আসো কিস দেই🤭 😘",
      "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস  😉😋🤣",
      "তোর কথা তোর বাড়ি কেউ শুনে না ,তো আমি কোনো শুনবো ?🤔😂",
      "আমাকে ডেকো না,আমি ব্যাস্ত আছি",
      "কি হলো , মিস্টেক করচ্ছিস নাকি🤣",
      "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
      "কালকে দেখা করিস তো একটু 😈",
      "হা বলো, শুনছি আমি 😏",
      "আর কত বার ডাকবি ,শুনছি তো",
      "হুম বলো কি বলবে😒",
      "বলো কি করতে পারি তোমার জন্য",
      "আমি তো অন্ধ কিছু দেখি না🐸 😎",
      "Bot না জানু,বল 😌",
      "বলো জানু 🌚",
      "তোর কি চোখে পড়ে না আমি ব্যাস্ত আছি😒",
      "হুম জান তোমার ওই খানে উম্মহ😑😘",
      "jang hanga korba😒😬",
      "হুম জান তোমার অইখানে উম্মমাহ😷😘",
      "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি..!🥰",
      "আমাকে এতো না ডেকে বস আমিনুল কে একটা গফ দে 🙄"
    ];

    // Priority check for exact message matches
    if (replies[message]) {
      return api.sendMessage(replies[message], threadID, messageID);
    }

    // If message starts with "bot"
    if (message.startsWith("bot")) {
      const randomMsg = randomReplies[Math.floor(Math.random() * randomReplies.length)];
      return api.sendMessage(`${name}, ${randomMsg}`, threadID, messageID);
    }
  }
};
