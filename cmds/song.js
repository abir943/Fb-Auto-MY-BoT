const fs = require("fs");
const path = require("path");
const axios = require("axios");
const ytSearch = require("yt-search");

module.exports = {
    name: "song",
    aliases: ["music", "song"],
    usePrefix: true,
    description: "Search and play music from YouTube.",
    
    execute: async (api, event, args) => {
        try {
            const { threadID, messageID } = event;

            if (args.length === 0) {
                return api.sendMessage("❗ Please provide a song name.\n\nUsage: /sing <song name> [audio]", threadID, messageID);
            }

            // Check if the last arg is "audio" or "video"
            let type = "audio";
            if (["audio", "video"].includes(args[args.length - 1].toLowerCase())) {
                type = args.pop().toLowerCase();
            }
            const songName = args.join(" ");

            const waiting = await api.sendMessage("🎧 Searching for the song, please wait...", threadID, messageID);

            // Search song on YouTube
            const searchResults = await ytSearch(songName);
            if (!searchResults || !searchResults.videos.length) {
                return api.sendMessage("❌ No results found.", threadID, messageID);
            }

            const topResult = searchResults.videos[0];
            const videoId = topResult.videoId;

            // Aryan's API
            const apiUrl = `https://noobs-xyz-aryan.vercel.app/youtube?id=${videoId}&type=${type}&apikey=itzaryan`;

            api.setMessageReaction("⏳", messageID, () => {}, true);

            const downloadResponse = await axios.get(apiUrl);
            const downloadUrl = downloadResponse.data.downloadUrl;

            // Download file using axios
            const filename = `${topResult.title.replace(/[\\/:*?"<>|]/g, "")}.mp3`;
            const filepath = path.join(__dirname, filename);
            const fileResponse = await axios.get(downloadUrl, { responseType: "stream" });

            const writer = fs.createWriteStream(filepath);
            fileResponse.data.pipe(writer);

            writer.on("finish", () => {
                api.setMessageReaction("✅", messageID, () => {}, true);

                api.sendMessage({
                    attachment: fs.createReadStream(filepath),
                    body: `🎶 Now playing: ${topResult.title}`
                }, threadID, () => {
                    fs.unlinkSync(filepath);
                    api.unsendMessage(waiting.messageID);
                }, messageID);
            });

            writer.on("error", err => {
                throw err;
            });

        } catch (err) {
            console.error("❌ Error in sing command:", err.message);
            return api.sendMessage(`❌ Failed to play song:\n${err.message}`, event.threadID, event.messageID);
        }
    }
};
