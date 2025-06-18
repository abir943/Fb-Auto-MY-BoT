const axios = require("axios");
const fs = require("fs");

module.exports = {
    name: "uid",
    aliases: ["userid", "fbid", "getid"],
    usePrefix: false,
    usage: "/uid [@mention]",
    version: "1.5",
    description: "Get the UID, profile link, and profile picture of a user.",
    
    async execute(api, event, args) {
        const { threadID, messageID, senderID, mentions } = event;
        let userIDs = [];
        let responseMessages = [];

        if (Object.keys(mentions).length === 0) {
            userIDs.push({ name: "Your UID", id: senderID });
        } else {
            for (const uid in mentions) {
                userIDs.push({ name: mentions[uid].replace("@", ""), id: uid });
            }
        }

        for (const user of userIDs) {
            const fbLink = `https://www.facebook.com/profile.php?id=${user.id}`;
            const messengerLink = `m.me/${user.id}`;
            const avatarURL = `https://graph.facebook.com/${user.id}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            const filePath = `profile_${user.id}.jpg`;

            responseMessages.push(
                `==== [ 𝗨𝗜𝗗 𝗨𝗦𝗘𝗥 ] ====\n━━━━━━━━━━━━━━━━━━\n` +
                `▶️ 𝗡𝗮𝗺𝗲: ${user.name}\n` +
                `▶️ 𝗜𝗗: ${user.id}\n` +
                `▶️ 𝗜𝗕: ${messengerLink}\n` +
                `▶️ 𝗟𝗶𝗻𝗸𝗙𝗕: ${fbLink}\n━━━━━━━━━━━━━━━━━━`
            );

            try {
                const attachment = await downloadProfilePicture(avatarURL, filePath);
                if (attachment) {
                    await api.sendMessage(
                        { body: responseMessages.join("\n\n"), attachment },
                        threadID,
                        messageID
                    );
                } else {
                    api.sendMessage(responseMessages.join("\n\n"), threadID, messageID);
                }
            } catch (error) {
                console.error("Error fetching profile picture:", error);
                api.sendMessage(responseMessages.join("\n\n"), threadID, messageID);
            }
        }
    }
};

async function downloadProfilePicture(url, filePath) {
    try {
        const response = await axios.get(url, { responseType: "arraybuffer" });
        fs.writeFileSync(filePath, response.data);
        return fs.createReadStream(filePath);
    } catch (error) {
        console.error("Failed to fetch profile picture:", error);
        return null;
    }
}
