const axios = require("axios");
const fs = require("fs");
const path = require("path");
const os = require("os");

module.exports = {
  name: "lv",
  version: "1.2",
  description: "Send a random romantic video with a sweet message.",
  usage: "{pn}",
  usePrefix: true,

  execute: async (api, event) => {
    const title = "😍💖 তুমি আমার কল্পনায় জড়িয়ে থাকা এক অদ্ভুত মায়া.!!🌸❤️‍🩹";

    const videos = [   { "url": "https://i.imgur.com/6ZTPX8w.mp4", "name": "video1.mp4" },
  { "url": "https://i.imgur.com/D1YKkPq.mp4", "name": "video2.mp4" },
  { "url": "https://i.imgur.com/u6w2wCw.mp4", "name": "video3.mp4" },
  { "url": "https://i.imgur.com/qbHb4TV.mp4", "name": "video4.mp4" },
  { "url": "https://i.imgur.com/oVOPILK.mp4", "name": "video5.mp4" },
  { "url": "https://i.imgur.com/XYIixNU.mp4", "name": "video6.mp4" },
  { "url": "https://i.imgur.com/V3TqiXF.mp4", "name": "video7.mp4" },
  { "url": "https://i.imgur.com/3hx98bS.mp4", "name": "video8.mp4" },
  { "url": "https://i.imgur.com/hdx7x0j.mp4", "name": "video9.mp4" },
  { "url": "https://i.imgur.com/ofB5UPz.mp4", "name": "video10.mp4" },
  { "url": "https://i.imgur.com/pljQEPg.mp4", "name": "video11.mp4" },
  { "url": "https://i.imgur.com/SE3DgRT.mp4", "name": "video12.mp4" },
  { "url": "https://i.imgur.com/a9yHovY.mp4", "name": "video13.mp4" },
  { "url": "https://i.imgur.com/0ldaQFb.mp4", "name": "video14.mp4" },
  { "url": "https://i.imgur.com/cfcMX0i.mp4", "name": "video15.mp4" },
  { "url": "https://i.imgur.com/OwzP64Y.mp4", "name": "video16.mp4" },
  { "url": "https://i.imgur.com/65dBzTD.mp4", "name": "video17.mp4" },
  { "url": "https://i.imgur.com/Q5z7xZt.mp4", "name": "video18.mp4" },
  { "url": "https://i.imgur.com/rBvRkAq.mp4", "name": "video19.mp4" },
  { "url": "https://i.imgur.com/dE2aFPX.mp4", "name": "video20.mp4" },
  { "url": "https://i.imgur.com/B5myZLc.mp4", "name": "video21.mp4" },
  { "url": "https://i.imgur.com/d7al0kz.mp4", "name": "video22.mp4" },
  { "url": "https://i.imgur.com/wG07lxC.mp4", "name": "video23.mp4" },
  { "url": "https://i.imgur.com/XYsmu14.mp4", "name": "video24.mp4" },
  { "url": "https://i.imgur.com/RVsTiRm.mp4", "name": "video25.mp4" },
  { "url": "https://i.imgur.com/0ukh2CK.mp4", "name": "video26.mp4" },
  { "url": "https://i.imgur.com/sEtUDg2.mp4", "name": "video27.mp4" },
  { "url": "https://i.imgur.com/e9B6Xqx.mp4", "name": "video28.mp4" },
  { "url": "https://i.imgur.com/W5dKfLc.mp4", "name": "video29.mp4" },
  { "url": "https://i.imgur.com/vSMFyaD.mp4", "name": "video30.mp4" },
  { "url": "https://i.imgur.com/ZJsfgkG.mp4", "name": "video31.mp4" },
  { "url": "https://i.imgur.com/P1QJVHY.mp4", "name": "video32.mp4" },
  { "url": "https://i.imgur.com/bObkvGD.mp4", "name": "video33.mp4" },
  { "url": "https://i.imgur.com/NIqTG8M.mp4", "name": "video34.mp4" },
  { "url": "https://i.imgur.com/M91EfGI.mp4", "name": "video35.mp4" },
  { "url": "https://i.imgur.com/0CMwrAd.mp4", "name": "video36.mp4" },
  { "url": "https://i.imgur.com/tYKOyDc.mp4", "name": "video37.mp4" },
  { "url": "https://i.imgur.com/8Vw9amU.mp4", "name": "video38.mp4" },
  { "url": "https://i.imgur.com/WXu5ya9.mp4", "name": "video39.mp4" },
  { "url": "https://i.imgur.com/UFY34nW.mp4", "name": "video40.mp4" },
  { "url": "https://i.imgur.com/q3S90Lf.mp4", "name": "video41.mp4" },
  { "url": "https://i.imgur.com/XShMmw7.mp4", "name": "video42.mp4" },
  { "url": "https://i.imgur.com/h5vzrRn.mp4", "name": "video43.mp4" },
  { "url": "https://i.imgur.com/n9p47dE.mp4", "name": "video44.mp4" },
  { "url": "https://i.imgur.com/qOqcH9X.mp4", "name": "video45.mp4" },
  { "url": "https://i.imgur.com/zushfTd.mp4", "name": "video46.mp4" },
  { "url": "https://i.imgur.com/ekiBvTv.mp4", "name": "video47.mp4" },
  { "url": "https://i.imgur.com/UlMuPLT.mp4", "name": "video48.mp4" },
  { "url": "https://i.imgur.com/8tvEoBg.mp4", "name": "video49.mp4" },
  { "url": "https://i.imgur.com/DGI0rOF.mp4", "name": "video50.mp4" } ];

    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    const tempFilePath = path.join(os.tmpdir(), randomVideo.name);

    // Step 1: Notify user
    api.sendMessage("⏳ অনুগ্রহ করে অপেক্ষা করুন, ভালোবাসার ভিডিও পাঠানো হচ্ছে...", event.threadID, async () => {
      try {
        // Step 2: Download video
        const response = await axios.get(randomVideo.url, {
          responseType: "arraybuffer",
          timeout: 20000,
          headers: {
            "User-Agent": "Mozilla/5.0"
          }
        });

        // Save to temp
        fs.writeFileSync(tempFilePath, Buffer.from(response.data));

        // Step 3: Send video
        api.sendMessage(
          {
            body: `🎬 **Love Video**\n\n💌 ${title}\n\n🌹 ভালোবাসা অনুভবে জীবন্ত থাকে 💖`,
            attachment: fs.createReadStream(tempFilePath)
          },
          event.threadID,
          () => {
            // Step 4: Delete file
            fs.unlink(tempFilePath, (err) => {
              if (err) console.error("Temp file delete failed:", err);
            });
          }
        );
      } catch (err) {
        console.error("❌ Video send error:", err.message);
        api.sendMessage("❌ ভিডিও পাঠাতে সমস্যা হয়েছে। দয়া করে পরে আবার চেষ্টা করুন।", event.threadID);
      }
    });
  },
};
