const fs = require("fs");
const path = require("path");

module.exports = {
    name: "cmd",
    aliases: ["install", "create", "uninstall", "remove", "list", "view", "edit", "reload"],
    usePrefix: true,
    description: "Manage custom bot commands (install, remove, list, view, edit, reload).",
    execute: async (api, event, args) => {
        const botAdmins = ["100071880593545"]; // Bot admin IDs
        if (!botAdmins.includes(event.senderID)) {
            return api.sendMessage("⛔ You are not authorized to use this command!", event.threadID);
        }

        if (!args.length) {
            return api.sendMessage("⚠️ Usage:\n- Install: /cmd install <filename.js> <code>\n- Uninstall: /cmd uninstall <filename.js>\n- List: /cmd list\n- View: /cmd view <filename.js>\n- Edit: /cmd edit <filename.js> <new code>\n- Reload: /cmd reload", event.threadID);
        }

        const action = args.shift().toLowerCase();
        const filePath = path.join(__dirname, "..", "cmds");

        // Install action: Adds a new custom command
        if (action === "install") {
            const fileName = args.shift();
            if (!fileName.endsWith(".js")) return api.sendMessage("⚠️ The file must have a `.js` extension!", event.threadID);
            const fileContent = args.join(" ");

            try {
                fs.writeFileSync(path.join(filePath, fileName), fileContent, "utf8");
                api.sendMessage(`✅ Installed: ${fileName}\n📂 Path: cmds/${fileName}`, event.threadID);

                // Auto-reload commands after installation
                global.commands.clear();
                const commandFiles = fs.readdirSync(filePath).filter(file => file.endsWith(".js"));
                for (const file of commandFiles) {
                    delete require.cache[require.resolve(`../cmds/${file}`)];
                    const command = require(`../cmds/${file}`);
                    if (command.name && command.execute) {
                        global.commands.set(command.name, command);
                    }
                }
                api.sendMessage(`🔄 Reloaded ${global.commands.size} commands!`, event.threadID);
            } catch (error) {
                api.sendMessage(`❌ Error saving file: ${error.message}`, event.threadID);
            }
        } 
        
        // Uninstall action: Removes a custom command
        else if (action === "uninstall") {
            const fileName = args[0];
            const fullPath = path.join(filePath, fileName);

            if (!fs.existsSync(fullPath)) return api.sendMessage(`❌ File not found: ${fileName}`, event.threadID);
            try {
                fs.unlinkSync(fullPath);
                api.sendMessage(`✅ Uninstalled: ${fileName}`, event.threadID);
            } catch (error) {
                api.sendMessage(`❌ Error deleting file: ${error.message}`, event.threadID);
            }
        } 
        
        // List action: Lists all installed commands
        else if (action === "list") {
            const files = fs.readdirSync(filePath).filter(file => file.endsWith(".js"));
            if (!files.length) return api.sendMessage("📂 No installed commands found!", event.threadID);
            api.sendMessage(`📜 Installed Commands:\n${files.join("\n")}`, event.threadID);
        } 
        
        // View action: Views content of a specific command
        else if (action === "view") {
            const fileName = args[0];
            const fullPath = path.join(filePath, fileName);

            if (!fs.existsSync(fullPath)) return api.sendMessage(`❌ File not found: ${fileName}`, event.threadID);
            const fileContent = fs.readFileSync(fullPath, "utf8");
            api.sendMessage(`📂 ${fileName} content:\n\`\`\`${fileContent.slice(0, 2000)}\`\`\``, event.threadID);
        } 
        
        // Edit action: Edits the content of a specific command
        else if (action === "edit") {
            const fileName = args.shift();
            const fullPath = path.join(filePath, fileName);
            const newContent = args.join(" ");

            if (!fs.existsSync(fullPath)) return api.sendMessage(`❌ File not found: ${fileName}`, event.threadID);
            try {
                fs.writeFileSync(fullPath, newContent, "utf8");
                api.sendMessage(`✅ Updated: ${fileName}`, event.threadID);
            } catch (error) {
                api.sendMessage(`❌ Error updating file: ${error.message}`, event.threadID);
            }
        } 
        
        // Reload action: Reloads all custom commands
        else if (action === "reload") {
            global.commands.clear();
            const commandFiles = fs.readdirSync(filePath).filter(file => file.endsWith(".js"));
            for (const file of commandFiles) {
                delete require.cache[require.resolve(`../cmds/${file}`)];
                const command = require(`../cmds/${file}`);
                if (command.name && command.execute) {
                    global.commands.set(command.name, command);
                }
            }
            api.sendMessage(`🔄 Reloaded ${global.commands.size} commands!`, event.threadID);
        } 
        
        // Invalid action handler
        else {
            api.sendMessage("❌ Invalid action! Use `install`, `uninstall`, `list`, `view`, `edit`, or `reload`.", event.threadID);
        }
    }
};
