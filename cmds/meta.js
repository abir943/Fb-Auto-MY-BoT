const axios = require("axios");

// Function to fetch the Gemini API base URL
async function getBaseApiUrl() {
  try {
    const res = await axios.get(
      "https://raw.githubusercontent.com/itzaryan008/ERROR/refs/heads/main/raw/api.json"
    );
    return `${res.data.apis}/aryan/gemini`;
  } catch (err) {
    console.error("Failed to fetch Gemini base API URL:", err.message);
    return null;
  }
}

module.exports = {
  name: "meta",
  aliases: ["gai", "gem"],
  usePrefix: false,
  description: "Chat with Gemini AI or caption a photo.",
  author: "ArYAN • Modified by Aminulsordar",
  version: "1.1.0",

  execute: async (api, event, args) => {
    const { threadID, messageID, type, messageReply } = event;
    const prompt = args.join(" ").trim();

    // Fetch the API URL
    const BASE_API_URL = await getBaseApiUrl();
    if (!BASE_API_URL) {
      return api.sendMessage("❌ Couldn't connect to the Gemini API.", threadID, messageID);
    }

    // No input and no image reply
    if (!prompt && !(type === "message_reply" && messageReply?.attachments?.length > 0)) {
      return api.sendMessage("⚠️ Please provide a prompt or reply to an image.", threadID, messageID);
    }

    // Handle image captioning
    if (type === "message_reply" && messageReply.attachments?.[0]?.type === "photo") {
      const imageUrl = messageReply.attachments[0].url;
      try {
        const response = await axios.get(
          `${BASE_API_URL}?ask=${encodeURIComponent(prompt || "Describe this image")}&url=${encodeURIComponent(imageUrl)}`
        );
        const reply = response.data.gemini || "❌ No caption returned from Gemini.";
        return api.sendMessage(reply, threadID, messageID);
      } catch (err) {
        console.error("Gemini image request failed:", err.message);
        return api.sendMessage("❌ Failed to get a response from Gemini for the image.", threadID, messageID);
      }
    }

    // Handle text-only input
    try {
      const response = await axios.get(`${BASE_API_URL}?ask=${encodeURIComponent(prompt)}`);
      const reply = response.data.gemini || "❌ No response returned from Gemini.";
      return api.sendMessage(reply, threadID, messageID);
    } catch (err) {
      console.error("Gemini text request failed:", err.message);
      return api.sendMessage("❌ Failed to get a response from Gemini.", threadID, messageID);
    }
  }
};
