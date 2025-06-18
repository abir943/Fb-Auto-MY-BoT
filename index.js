// 📦 Dependencies
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const login = require("ws3-fca");

// 🌐 Express Setup
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// 🌍 Globals
global.commands = new Map();
global.aliases = new Map();
global.events = new Map();
global.cooldowns = new Map();
global.handleReply = new Map();
global.handleReaction = new Map();
global.handleEvent = new Map();
const detectedURLs = new Set();

// 🧩 Utility: Load JSON config
const loadConfig = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Missing ${filePath}`);
      process.exit(1);
    }
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    console.error(`❌ Failed to load ${filePath}:`, error);
    process.exit(1);
  }
};

const config = loadConfig("./config.json");
const botPrefix = config.prefix || "/";
const apiRoutes = [];

// 🎭 Load Events
const loadEvents = () => {
  const files = fs.readdirSync("./events").filter(f => f.endsWith(".js"));
  for (const file of files) {
    const event = require(`./events/${file}`);
    if (event.name && event.execute) {
      global.events.set(event.name, event);
      console.log(`🎭 Event Loaded: ${event.name}`);
    }
  }
};

// ⚙️ Load Commands
const loadCommands = () => {
  const files = fs.readdirSync("./cmds").filter(f => f.endsWith(".js"));
  for (const file of files) {
    const command = require(`./cmds/${file}`);
    if (command.name && command.execute) {
      global.commands.set(command.name, command);
      if (command.aliases) {
        for (const alias of command.aliases) {
          global.aliases.set(alias, command.name);
        }
      }
      console.log(`📜 Command Loaded: ${command.name}`);
    }
  }
};

// 🧠 Load APIs
const loadAPIs = () => {
  const apiPath = path.join(__dirname, "api");
  if (!fs.existsSync(apiPath)) return;
  const files = fs.readdirSync(apiPath).filter(f => f.endsWith(".js"));
  for (const file of files) {
    const api = require(`./api/${file}`);
    const route = api.route || `/api/${api.name}`;
    const method = (api.method || "get").toLowerCase();

    app[method](route, async (req, res) => {
      try {
        await api.execute({ req, res });
      } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    apiRoutes.push({
      name: api.name,
      route,
      method: method.toUpperCase(),
      category: api.category || "uncategorized",
      usage: api.usage || "No usage info"
    });

    console.log(`🔗 API Loaded: ${api.name} (${method.toUpperCase()} ${route})`);
  }
};

// 🖼 Serve static image
app.get("/api/image", (req, res) => {
  const imagePath = path.join(__dirname, "api/generated-image.png");
  res.sendFile(imagePath, err => {
    if (err) res.status(404).json({ error: "Image not found" });
  });
});

app.get("/api/list", (req, res) => res.json(apiRoutes));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));

// 💾 Bot State
const loadBots = () => {
  try {
    if (!fs.existsSync("./appState.json")) return {};
    return JSON.parse(fs.readFileSync("./appState.json"));
  } catch (err) {
    console.error("❌ Failed to load bots:", err);
    return {};
  }
};

const saveBots = (bots) => {
  try {
    fs.writeFileSync("./appState.json", JSON.stringify(bots, null, 2));
  } catch (err) {
    console.error("❌ Failed to save bots:", err);
  }
};

// 🤖 Bot Login & Handling
const startBot = async (botID, data) => {
  try {
    login({ appState: data.appState }, (err, api) => {
      if (err) return console.error(`❌ ${botID} login failed:`, err);

      api.setOptions(config.option);

      global.activeBots.set(botID, {
        api,
        ownerUid: data.ownerUid || null,
        selectedCommands: data.selectedCommands || []
      });

      console.log(`🤖 ${botID} is online!`);

      if (data.ownerUid) {
        api.sendMessage(`✅ Bot ${botID} is online!`, data.ownerUid);
      }

      api.listenMqtt(async (err, event) => {
        if (err) return console.error(`❌ MQTT error (${botID}):`, err);

        if (global.events.has(event.type)) {
          try {
            await global.events.get(event.type).execute({ api, event });
          } catch (e) {
            console.error(`❌ Event error: ${event.type}`, e);
          }
        }

        if (event.body) {
          const args = event.body.trim().split(/ +/);
          const name = args.shift().toLowerCase();
          const bot = global.activeBots.get(botID);

          const commandName = global.aliases.get(name) || name;
          const command = global.commands.get(commandName);

          if (
            command &&
            ((command.usePrefix && event.body.startsWith(botPrefix)) || !command.usePrefix)
          ) {
            const allowed =
              command.admin ||
              bot.selectedCommands.length === 0 ||
              bot.selectedCommands.includes(commandName);

            if (allowed) {
              try {
                await command.execute({ api, event, args, ownerUid: bot.ownerUid });
              } catch (e) {
                console.error(`❌ Command '${commandName}' error:`, e);
              }
            }
          }
        }
      });
    });
  } catch (e) {
    console.error(`❌ Crash in bot ${botID}:`, e);
  }
};

const startAllBots = () => {
  const bots = loadBots();
  for (const [id, data] of Object.entries(bots)) {
    startBot(id, data);
  }
};

// ➕ Add Bot API
app.post("/api/add-bot", (req, res) => {
  const { appState, ownerUid, selectedCommands } = req.body;
  if (!appState) return res.status(400).json({ error: "Missing appState" });

  const botID = `bot_${Date.now()}`;
  const bots = loadBots();

  const adminCmds = Array.from(global.commands.values())
    .filter(c => c.admin)
    .map(c => c.name);

  bots[botID] = {
    appState,
    ownerUid: ownerUid || null,
    selectedCommands: [...new Set([...(selectedCommands || []), ...adminCmds])]
  };

  saveBots(bots);
  startBot(botID, bots[botID]);

  res.json({ success: true, botID });
});

// 📃 Get Bots
app.get("/api/bots", (req, res) => {
  const bots = loadBots();
  res.json(Object.keys(bots).map(botID => ({ botID })));
});

// 📜 Get All Commands
app.get("/api/available-cmds", (req, res) => {
  const cmds = Array.from(global.commands.values()).map(c => ({
    name: c.name,
    usage: c.usage,
    admin: c.admin || false
  }));
  res.json(cmds);
});

// 📢 Display Bot Info
const displayBotInfo = () => {
  console.log("\n===============================");
  console.log("🤖  BOT NAME: AMINUL-BOT");
  console.log("👤  CREATED BY: Aminulsordar");
  console.log("🚀  VERSION: 1.0.0");
  console.log(`📜  Commands Loaded: ${global.commands.size}`);
  console.log(`🎭  Events Loaded: ${global.events.size}`);
  console.log("===============================\n");
};

// 🔃 Init
loadEvents();
loadCommands();
loadAPIs();
startAllBots();
displayBotInfo();

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`🌐 Web Server running → http://localhost:${PORT}`);
});
