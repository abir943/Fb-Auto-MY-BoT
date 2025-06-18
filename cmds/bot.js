const axios = require("axios");

module.exports = {
  name: "bot",
  usePrefix: false,
  aliases: ["ai", "jan"],
  description: "Chat with bot or ask anything",
  usage: "[your question or chat text]",
  version: "1.1",
  author: "Aminul Sordar",

  async execute(api, event, args) {
    const { body, messageReply, threadID, messageID, senderID } = event;
    const botID = api.getCurrentUserID();
    const question = body.trim();

    const randomTexts = [
      "হা বলো, শুনছি আমি 🤸‍♂️🫂",
      "Ato daktasen kn bujhlam na 😡",
      "jan bal falaba,🙂",
      "ask amr mon vlo nei dakben na🙂",
      "Hmm jan ummah😘😘",
      "jang hanga korba 🙂🖤",
      "iss ato dako keno lojja lage to 🫦🙈",
      "suna tomare amar valo lage,🙈😽"
    ];

    const isJustBot = ["bot", "বট", "Bot", "BOT"].includes(question.toLowerCase());

    // Just 'bot' => random response
    if (isJustBot) {
      const reply = randomTexts[Math.floor(Math.random() * randomTexts.length)];
      return api.sendMessage(reply, threadID, (err, info) => {
        if (!err) {
          global.handleReply.set(info.messageID, {
            name: module.exports.name,
            author: senderID,
            type: "random" // mark this as random message
          });
        }
      }, messageID);
    }

    // If reply to a message from bot, send API-based answer
    if (messageReply && messageReply.senderID == botID) {
      const res = await axios.get(`https://jan-api-by-aminul-sordar.vercel.app/answer/${encodeURIComponent(question)}`).catch(() => null);
      const answer = res?.data?.answer || "😓 উত্তর দিতে পারলাম না।";

      return api.sendMessage(answer, threadID, (err, info) => {
        if (!err) {
          global.handleReply.set(info.messageID, {
            name: module.exports.name,
            author: senderID
          });
        }
      }, messageID);
    }

    // Direct question
    const res = await axios.get(`https://jan-api-by-aminul-sordar.vercel.app/answer/${encodeURIComponent(question)}`).catch(() => null);
    const answer = res?.data?.answer || "😓 কিছু একটা সমস্যা হয়েছে।";

    return api.sendMessage(answer, threadID, (err, info) => {
      if (!err) {
        global.handleReply.set(info.messageID, {
          name: module.exports.name,
          author: senderID
        });
      }
    }, messageID);
  },

  async handleReply({ api, event, replyData }) {
    const { body, senderID, threadID, messageID } = event;
    if (replyData.author !== senderID) return;

    const res = await axios.get(`https://jan-api-by-aminul-sordar.vercel.app/answer/${encodeURIComponent(body.trim())}`).catch(() => null);
    const answer = res?.data?.answer || "😓 এখন কিছু বলতে পারছি না...";

    return api.sendMessage(answer, threadID, (err, info) => {
      if (!err) {
        global.handleReply.set(info.messageID, {
          name: module.exports.name,
          author: senderID
        });
      }
    }, messageID);
  }
};
