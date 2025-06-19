const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  name: "poli",
  aliases: [],
  usePrefix: true,
  description: "Generate an image from text using Pollinations AI.",
  author: "𝐈𝐬𝐥𝐚𝐦𝐢𝐜𝐤 𝐂𝐲𝐛𝐞𝐫",
  version: "1.0.2",
  cooldowns: 2,

  execute: async (api, event, args) => {
    const { threadID, messageID, senderID } = event;

    const query = args.join(" ");
    if (!query) {
      return api.sendMessage("❌ Please provide a prompt to generate an image.\n\n📌 Example:\n`poli beautiful galaxy`", threadID, messageID);
    }

    const cacheDir = path.join(__dirname, "cache");
    const filePath = path.join(cacheDir, `poli_${Date.now()}.png`);

    try {
      // Ensure the cache directory exists
      fs.ensureDirSync(cacheDir);

      // Download the image
      const response = await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(query)}`, {
        responseType: "arraybuffer",
      });

      // Save to file
      fs.writeFileSync(filePath, Buffer.from(response.data, "utf-8"));

      // Send the image
      api.sendMessage({
        body: `🌸 𝗣𝗼𝗹𝗹𝗶𝗻𝗮𝘁𝗶𝗼𝗻 𝗔𝗜 𝗜𝗺𝗮𝗴𝗲 𝗚𝗲𝗻𝗲𝗿𝗮𝘁𝗲𝗱 🌸\n\n📝 Prompt: ${query}`,
        attachment: fs.createReadStream(filePath)
      }, threadID, () => fs.unlinkSync(filePath), messageID);

    } catch (error) {
      console.error("❌ Failed to generate image from Pollinations:", error);
      api.sendMessage("⚠️ Could not generate the image. Please try again later.", threadID, messageID);
    }
  }
};
