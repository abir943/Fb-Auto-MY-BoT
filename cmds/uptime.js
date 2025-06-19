const os = require('os');
const pidusage = require('pidusage');
const moment = require('moment');
require('moment-duration-format');

function formatTime(seconds) {
    return moment.duration(seconds, 'seconds').format("h [hr], m [min], s [sec]");
}

function byte2mb(bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
}

function getCpuModel() {
    const cpus = os.cpus();
    return cpus.length > 0 ? cpus[0].model : 'Unknown CPU';
}

function getEmojiLoad(percentage) {
    if (percentage < 20) return '🟢';
    if (percentage < 50) return '🟡';
    if (percentage < 75) return '🟠';
    return '🔴';
}

module.exports = {
    name: "uptime",
    version: "2.0.0",
    usePrefix: true,
    usage: "/uptime",
    description: "Displays bot and system uptime with detailed statistics.",
    
    execute: async (api, event) => {
        try {
            const uptime = process.uptime();
            const osUptime = os.uptime();
            const usage = await pidusage(process.pid);
            const cpuUsage = usage.cpu.toFixed(1);
            const memUsage = byte2mb(usage.memory);
            const totalMem = byte2mb(os.totalmem());
            const freeMem = byte2mb(os.freemem());
            const currentTime = moment().format('MMMM Do YYYY, h:mm:ss A');

            const msg = 
`━━━━━━━━━━━━━━━━━━━━━━━
⏰ 𝗕𝗢𝗧 𝗨𝗣𝗧𝗜𝗠𝗘 𝗦𝗧𝗔𝗧𝗦
━━━━━━━━━━━━━━━━━━━━━━━
🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲: 𝐀𝐌𝐈𝐍𝐔𝐋-𝐁𝐎𝐓
👑 𝗔𝗱𝗺𝗶𝗻: Aminulsordar
🕓 𝗧𝗶𝗺𝗲: ${currentTime}
━━━━━━━━━━━━━━━━━━━━━━━
🔹 𝗕𝗼𝘁 𝗨𝗽𝘁𝗶𝗺𝗲: ${formatTime(uptime)}
🔹 𝗦𝘆𝘀𝘁𝗲𝗺 𝗨𝗽𝘁𝗶𝗺𝗲: ${formatTime(osUptime)}
━━━━━━━━━━━━━━━━━━━━━━━
${getEmojiLoad(cpuUsage)} 𝗖𝗣𝗨 𝗨𝘀𝗮𝗴𝗲: ${cpuUsage}%
🧠 𝗥𝗔𝗠 𝗨𝘀𝗮𝗴𝗲: ${memUsage} / ${totalMem}
📉 𝗙𝗿𝗲𝗲 𝗥𝗔𝗠: ${freeMem}
━━━━━━━━━━━━━━━━━━━━━━━
⚙️ 𝗢𝗦: ${os.platform().toUpperCase()} | 𝗔𝗿𝗰𝗵: ${os.arch()}
🧩 𝗖𝗣𝗨: ${getCpuModel()}
━━━━━━━━━━━━━━━━━━━━━━━
✨ 𝗧𝗵𝗮𝗻𝗸 𝘆𝗼𝘂 𝗳𝗼𝗿 𝘂𝘀𝗶𝗻𝗴 AminulBot!
━━━━━━━━━━━━━━━━━━━━━━━`;

            return api.sendMessage(msg, event.threadID, event.messageID);
        } catch (err) {
            console.error("❌ Uptime command error:", err);
            return api.sendMessage("❌ An error occurred while fetching uptime stats.", event.threadID, event.messageID);
        }
    }
};
