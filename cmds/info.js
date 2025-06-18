const os = require('os');
const moment = require('moment');

module.exports = {
    name: "info",
    version: "1.0.0",
    usage: "/info",
    description: "Display bot and system information in a stylish format.",
    
    execute: async (api, event) => {
        const botName = "✨ AMINUL-BOT ✨";
        const botVersion = "1.0.0";
        const botPrefix = "/";
        const owner = "⛩️ Aminulsordar";
        const age = "18";
        const address = "📍 Dhaka, Bangladesh";
        const religion = "☪️ Islam";
        const nationality = "🌐 Bangladeshi";
        const work = "💻 Software Developer";

        const currentDate = moment().format('dddd, MMMM Do YYYY');
        const uptime = moment.duration(process.uptime(), 'seconds').humanize();
        const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const cpuModel = os.cpus()[0].model;
        const osType = `${os.type()} ${os.arch()}`;

        const decoratedMessage = `
━━━━━━━━━━━━━━━
🌟 ${botName}
━━━━━━━━━━━━━━━

👑 Owner Info:
   ├─ 🧑 Name: ${owner}
   ├─ 🎂 Age: ${age}
   ├─ 🏡 Address: ${address}
   ├─ 🕌 Religion: ${religion}
   └─ 🌍 Nationality: ${nationality}

💼 Profession:
   └─ ${work}

━━━━━━━━━━━━━━━
⚙️ System Stats
━━━━━━━━━━━━━━━
   ├─ ⏱️ Uptime: ${uptime}
   ├─ 🗓️ Date: ${currentDate}
   ├─ 💾 RAM Used: ${memoryUsage} MB
   ├─ 🧠 CPU: ${cpuModel}
   └─ 🖥️ OS: ${osType}

━━━━━━━━━━━━━━━
🤖 Bot Details
━━━━━━━━━━━━━━━
   ├─ 🤖 Name: ${botName}
   ├─ 🔢 Version: v${botVersion}
   └─ 🏷️ Prefix: ${botPrefix}

━━━━━━━━━━━━━━━
        `.trim();

        api.sendMessage(decoratedMessage, event.threadID);
    }
};
