 const os = require("os");

module.exports = {
  name: "stats",
  aliases: ["status", "botstats", "serverinfo", "sysinfo"],
  description: "Shows bot and server statistics together.",
  version: "2.0",
  author: "Aminul Sordar",
  category: "info",
  usage: "",
  cooldown: 5,
  permissions: [],
  usePrefix: true,

  async execute(api, event) {
    try {
      // Bot Info
      const totalCommands = global.commands.size;
      const totalEvents = global.events.size;

      const uptimeMS = process.uptime() * 1000;
      const formatUptime = (ms) => {
        const sec = Math.floor((ms / 1000) % 60);
        const min = Math.floor((ms / (1000 * 60)) % 60);
        const hrs = Math.floor((ms / (1000 * 60 * 60)) % 24);
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        return `${days}d ${hrs}h ${min}m ${sec}s`;
      };
      const botUptime = formatUptime(uptimeMS);
      const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

      // Server Info
      const cpu = os.cpus()[0].model;
      const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
      const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
      const platform = os.platform();
      const arch = os.arch();
      const hostname = os.hostname();
      const systemUptime = formatUptime(os.uptime());

      // Final Message
      const message = `
╭━━━━━━━━━━━━━━━━━━━━━━━╮
┃   📊 BOT & SERVER STATS
┃━━━━━━━━━━━━━━━━━━━━━━━┃
┃ 🧠 Author        : Aminul Sordar
┃ 📦 Commands      : ${totalCommands}
┃ 🎭 Events        : ${totalEvents}
┃ ⏱️ Bot Uptime     : ${botUptime}
┃ 💾 RAM Usage     : ${memoryUsage} MB
┃━━━━━━━━━━━━━━━━━━━━━━━┃
┃ 🧮 CPU           : ${cpu}
┃ 💾 Total RAM     : ${totalMem} GB
┃ 🪫 Free RAM      : ${freeMem} GB
┃ ⏱️ Sys Uptime     : ${systemUptime}
┃ 🖥️ OS/Arch        : ${platform} (${arch})
┃ 🏷️ Hostname       : ${hostname}
╰━━━━━━━━━━━━━━━━━━━━━━━╯
      `.trim();

      api.sendMessage(message, event.threadID);
    } catch (error) {
      console.error("❌ stats.js error:", error);
      api.sendMessage("❌ Failed to fetch bot/server statistics.", event.threadID);
    }
  }
};
