const fs = require("fs");
const path = require("path");
const request = require("request");
const chalk = require("chalk");

module.exports = {
  name: "messi",
  aliases: ["goat", "leo"],
  version: "1.0.0",
  usePrefix: true,
  description: "Sends a random picture of Lionel Messi.",
  
  execute: async (api, event) => {
    const { threadID, messageID } = event;
    const cacheDir = path.join(__dirname, "cache");
    const filePath = path.join(cacheDir, "messi.jpg");

    const messiLinks = [
      "https://i.postimg.cc/SKyn3RW9/images-52.jpg",
      "https://i.postimg.cc/8crcM6V2/images-51.jpg",
      "https://i.postimg.cc/8zGdk1Rp/images-50.jpg",
      "https://i.postimg.cc/Z5jNT6YH/Lionel-Messi-20180626.jpg",
      "https://i.postimg.cc/zfcRh5gR/images-43.jpg",
      "https://i.postimg.cc/Y0k2GybW/images-42.jpg",
      "https://i.postimg.cc/NMvBSzhz/images-41.jpg",
      "https://i.postimg.cc/9QvhwnfQ/images-40.jpg",
      "https://i.postimg.cc/WpXcw34K/images-38.jpg",
      "https://i.postimg.cc/gJjH9Nv3/images-37.jpg",
      "https://i.postimg.cc/zXrpvS5Y/images-61.jpg",
      "https://i.postimg.cc/BvXBkm5H/images-60.jpg",
      "https://i.postimg.cc/BbG58srB/images-59.jpg",
      "https://i.postimg.cc/tRhtKZ6S/images-58.jpg",
      "https://i.postimg.cc/pXs8vDLZ/images-57.jpg",
      "https://i.postimg.cc/cHGthhFs/images-56.jpg",
      "https://i.postimg.cc/R0KNWf42/images-55.jpg",
      "https://i.postimg.cc/yxYdpbcz/images-54.jpg",
      "https://i.postimg.cc/mDT2h5dF/images-63.jpg",
      "https://i.postimg.cc/RCsVVGwN/images-62.jpg"
    ];

    try {
      // Ensure cache directory exists
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

      const imgURL = messiLinks[Math.floor(Math.random() * messiLinks.length)];

      // Download image
      request(encodeURI(imgURL))
        .pipe(fs.createWriteStream(filePath))
        .on("close", () => {
          api.sendMessage({
            body: "Here's the GOAT – Lionel Messi!",
            attachment: fs.createReadStream(filePath)
          }, threadID, () => fs.unlinkSync(filePath), messageID);
        });
    } catch (err) {
      console.log(chalk.red("❌ Error in messi command:"), err);
      api.sendMessage("Oops! Something went wrong while fetching Messi's image.", threadID, messageID);
    }
  }
};
