const fs = require("fs");
const jimp = require("jimp");

module.exports = {
    name: "love",
    aliases: ["mylove", "crush"],
    version: "1.0.0",
    usePrefix: true,
    description: "Express your love to someone by mentioning them.",
    
    execute: async (api, event, args) => {
        const { threadID, messageID, senderID, mentions } = event;
        const mention = Object.keys(mentions);

        if (mention.length === 0) {
            return api.sendMessage("💔 Please mention your lover...", threadID, messageID);
        }

        let one, two;

        if (mention.length === 1) {
            one = senderID;
            two = mention[0];
        } else {
            one = mention[1];
            two = mention[0];
        }

        try {
            const path = await generateLoveImage(one, two);
            api.sendMessage({
                body: "Please babe... accept my love </100%",
                attachment: fs.createReadStream(path)
            }, threadID, () => fs.unlinkSync(path), messageID);
        } catch (error) {
            console.error("❌ Error generating love image:", error);
            api.sendMessage("⚠️ Failed to generate love image. Try again later!", threadID, messageID);
        }
    }
};

async function generateLoveImage(one, two) {
    const avOne = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    const avTwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    
    avOne.circle();
    avTwo.circle();

    const background = await jimp.read("https://i.imgur.com/PLNYNUV.jpeg");
    const outputPath = __dirname + "/cache/love_result.jpg";

    background
        .resize(1000, 560)
        .composite(avOne.resize(268, 280), 108, 155)
        .composite(avTwo.resize(258, 275), 627, 155);

    await background.writeAsync(outputPath);
    return outputPath;
}
