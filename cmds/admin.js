const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../config.json');

module.exports = {
    name: "admin",
    description: "Manage bot admins (add/remove/list)",
    version: "1.4.0",
    usePrefix: true, 
    cooldowns: 5,
    async execute(api, event, args) {
        const { threadID, messageID, senderID } = event;

        try {
            // Load config file
            let config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

            // Ensure botAdmins is an array
            if (!Array.isArray(config.botAdmins)) {
                config.botAdmins = [config.botAdmins];
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            }

            // Check if sender is an admin
            if (!config.botAdmins.includes(senderID)) {
                return api.sendMessage('⚠️ Only existing admins can use this command.', threadID, messageID);
            }

            if (args.length === 0) {
                return api.sendMessage('⚠️ Usage: admin add <uid> | admin remove <uid> | admin list | admin v', threadID, messageID);
            }

            const action = args[0].toLowerCase();
            const targetUID = args[1];

            if (action === "add") {
                if (!targetUID || isNaN(targetUID)) {
                    return api.sendMessage('⚠️ Please provide a valid numeric UID to add.', threadID, messageID);
                }

                if (config.botAdmins.includes(targetUID)) {
                    return api.sendMessage(`✅ UID ${targetUID} is already an admin.`, threadID, messageID);
                }

                config.botAdmins.push(targetUID);
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                return api.sendMessage(`✅ Successfully added UID ${targetUID} as an admin.`, threadID, messageID);

            } else if (action === "remove") {
                if (!targetUID || isNaN(targetUID)) {
                    return api.sendMessage('⚠️ Please provide a valid numeric UID to remove.', threadID, messageID);
                }

                if (!config.botAdmins.includes(targetUID)) {
                    return api.sendMessage(`❌ UID ${targetUID} is not an admin.`, threadID, messageID);
                }

                if (targetUID === config.ownerID) {
                    return api.sendMessage('⚠️ The owner cannot be removed as an admin.', threadID, messageID);
                }

                if (config.botAdmins.length === 1) {
                    return api.sendMessage('⚠️ You cannot remove the last admin.', threadID, messageID);
                }

                config.botAdmins = config.botAdmins.filter(uid => uid !== targetUID);
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                return api.sendMessage(`✅ Successfully removed UID ${targetUID} from admins.`, threadID, messageID);

            } else if (action === "list") {
                return api.sendMessage(`📌 **Admin List:**\n${config.botAdmins.join("\n")}`, threadID, messageID);

            } else if (action === "v") {
                return api.sendMessage(`📌 **Admin Management Command**\n- Version: 1.4.0\n- Prefix Required: ${module.exports.usePrefix ? "Yes" : "No"}\n- Cooldown: ${module.exports.cooldowns} sec\n- Current Admins: ${config.botAdmins.length}`, threadID, messageID);

            } else {
                return api.sendMessage('⚠️ Invalid action! Use: admin add <uid> | admin remove <uid> | admin list | admin v', threadID, messageID);
            }

        } catch (error) {
            console.error("[ERROR] Admin management failed:", error);
            return api.sendMessage("❌ An error occurred. Please try again.", threadID, messageID);
        }
    },
};
