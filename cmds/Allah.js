const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.name = "allah";
module.exports.aliases = ["আল্লাহ", "allahgif"];
module.exports.usePrefix = false;
module.exports.description = "আল্লাহু আকবর ✨ একটি ইসলামিক GIF সেন্ড করবে";
module.exports.cooldown = 5;

module.exports.execute = async (api, event) => {
  const gifs = [
    "https://i.imgur.com/7zLmJch.gif",
    "https://i.imgur.com/U07Yd3U.gif",
    "https://i.imgur.com/DHoZ9A1.gif",
    "https://i.imgur.com/oV4VMvm.gif",
    "https://i.imgur.com/ScGCmKE.gif",
    "https://i.imgur.com/r0ZE7lx.gif",
    "https://i.imgur.com/C2a3Cj3.gif",
    "https://i.imgur.com/98PjVxg.gif",
    "https://i.imgur.com/LvUF38x.gif",
    "https://i.imgur.com/2eewmJm.gif"
  ];

  const selectedGif = gifs[Math.floor(Math.random() * gifs.length)];
  const cacheDir = path.join(__dirname, "../cache");
  const gifPath = path.join(cacheDir, "allah.gif");

  try {
    // ✅ Ensure cache directory exists
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir);
    }

    // 📥 Download the GIF
    const response = await axios.get(selectedGif, {
      responseType: "stream",
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const writer = fs.createWriteStream(gifPath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      const banner = `
•—» ﷽ ✨『 𝗔𝗹𝗹𝗮𝗵 𝗚𝗜𝗙 』✨ «—•
•┄┅════❁🌺❁════┅┄•
🌙 بِسْمِ ٱللّٰهِ ٱلرَّحْمٰنِ ٱلرَّحِيمِ 🌙

✿ ─ আল্লাহু আকবার ─ ✿

•┄┅════❁🌺❁════┅┄•`;

      api.sendMessage({
        body: banner,
        attachment: fs.createReadStream(gifPath)
      }, event.threadID, () => {
        // 🧹 Clean up file after sending
        fs.unlinkSync(gifPath);
      });
    });

    writer.on("error", err => {
      console.error("❌ GIF write error:", err);
      api.sendMessage("❌ GIF পাঠাতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।", event.threadID);
    });

  } catch (err) {
    console.error("❌ Download error:", err.message || err);
    api.sendMessage("❌ GIF পাঠাতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।", event.threadID);
  }
};
