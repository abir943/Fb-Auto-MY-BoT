const os = require("os");
const moment = require("moment");

module.exports = {
    name: "botinfo",
    version: "1.0.0",
    usage: "/botinfo",
    description: "Displays detailed information about the bot system.",
    
    execute: async (api, event) => {
        const botName = "✨ AMINUL-BOT ✨";
        const developer = "⛩️ Aminulsordar";
        const version = "1.0.0";
        const prefix = "/";
        const uptime = moment.duration(process.uptime(), "seconds").humanize();
        const platform = os.platform();
        const cpuModel = os.cpus()[0].model;
        const coreCount = os.cpus().length;
        const architecture = os.arch();
        const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const usedMem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const nodeVersion = process.version;
        const threadCount = os.cpus().length;
        const hostname = os.hostname();
        const currentDate = moment().format("dddd, MMMM Do YYYY");

        const message = `
━━━━━━━━━━━━━━━━━━━━
✨ ${botName} Info Panel
━━━━━━━━━━━━━━━━━━━━

👑 Developer: ${developer}
🔖 Version: v${version}
📌 Prefix: ${prefix}
⏱️ Uptime: ${uptime}
📅 Date: ${currentDate}

━━━━━━━━━━━━━━━━━━━━
🖥️ System Information
━━━━━━━━━━━━━━━━━━━━
📟 Hostname: ${hostname}
🧠 CPU: ${cpuModel}
🧩 Architecture: ${architecture}
⚙️ Cores/Threads: ${coreCount}
🗂️ Platform: ${platform}
🧮 Node.js: ${nodeVersion}

━━━━━━━━━━━━━━━━━━━━
💾 Memory Usage
━━━━━━━━━━━━━━━━━━━━
📈 Used: ${usedMem} MB
📊 Total: ${totalMem} GB

━━━━━━━━━━━━━━━━━━━━
🤖 Status: ONLINE | Running Smoothly
━━━━━━━━━━━━━━━━━━━━
        `.trim();

        api.sendMessage(message, event.threadID);
    }
};
