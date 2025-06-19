const fs = require("fs-extra");
const axios = require("axios");
const request = require("request");

module.exports = {
    name: "download",
    usePrefix: false,
    usage: "Automatically downloads a video when a link is detected.",
    version: "1.1",
 author:" (nayon) Modify by Aminul sordar ",
    description: "Detects a video link in messages and downloads the video automatically.",

    async execute(api, event) {
        const threadID = event.threadID;
        const message = event.body;

        // Match and extract a valid link
        const linkMatch = message.match(/(https?:\/\/[^\s]+)/);
        if (!linkMatch) return;

        const url = linkMatch[0];

        // React to the message with ⏳ to indicate processing
        api.setMessageReaction("⏳", event.messageID, () => {}, true);

        try {
            // Fetch video download links
            const res = await axios.get(`https://nayan-video-downloader.vercel.app/alldown?url=${encodeURIComponent(url)}`);

            if (!res.data.data || (!res.data.data.high && !res.data.data.low)) {
                api.sendMessage("⚠️ Unable to fetch video. The link might not be supported.", threadID, event.messageID);
                return;
            }

            // Extract video details
            const { title, high, low } = res.data.data;
            const msg = `✨《 VIDEO TITLE 》✨\n\n🎬 *${title}*\n\n━━━━━━━━━━━━━━━━━━\n\n📥 *Downloaded by Aminul Bot*\n🕌 *An Islamic Bot for Muslims*\n\n📿 *Bismillah Hir Rahman Nir Rahim*\n🤲 *May Allah bless us all*\n\n🔰 *Use this bot responsibly*`;
            const videoUrl = high || low;

            // Download the video
            const filePath = "video.mp4";
            request(videoUrl)
                .pipe(fs.createWriteStream(filePath))
                .on("close", () => {
                    api.sendMessage(
                        { body: msg, attachment: fs.createReadStream(filePath) },
                        threadID,
                        () => {
                            // Delete file after sending
                            fs.unlinkSync(filePath);
                        }
                    );
                });

        } catch (err) {
            console.error("❌ Error fetching video:", err);
            api.sendMessage("❌ Error while fetching video. Please try again later.", threadID, event.messageID);
        }
    }
};
