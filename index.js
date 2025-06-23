// ======================================
// 🤖 AMINUL MULTI-BOT SERVER
// Created by: Aminulsordar
// Description: Modular, multi-instance Facebook bot server
// ======================================

// 🌐 Built-In & External Dependencies
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const login = require('ws3-fca');
const scheduleTasks = require('./custom'); // Optional: if you're using task scheduling

// 🧠 App Init
const app = express();
const PORT = 3000;

// 🛡️ Middleware Setup
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// 🌍 Global Variables for Runtime Storage
global.events = new Map();
global.commands = new Map();
global.activeBots = new Map();
global.handleReply = new Map();
global.handleReaction = new Map();
global.handleEvent = new Map();

const apiRoutes = [];

// 🌟 Server Info Banner
console.log("\n===============================");
console.log("🤖 BOT SERVER: AMINUL MULTI-BOT");
console.log("👤 CREATED BY: Aminulsordar");
console.log(`🌐 API & DASHBOARD: http://localhost:${PORT}`);
console.log("===============================\n");

// 🔧 Configuration Loader
const loadConfig = (filePath) => {
    if (!fs.existsSync(filePath)) {
        console.error(`❌ Missing config at ${filePath}`);
        process.exit(1);
    }
    try {
        return JSON.parse(fs.readFileSync(filePath));
    } catch (err) {
        console.error(`❌ Failed to parse config at ${filePath}`, err);
        process.exit(1);
    }
};

const config = loadConfig('./config.json');
const botPrefix = config.prefix || "!";

// 📷 Serve Generated Image File
app.get('/api/image', (req, res) => {
    const imagePath = path.join(__dirname, './api/generated-image.png');
    res.sendFile(imagePath, err => {
        if (err) res.status(404).json({ error: "Image not found" });
    });
});

// 🧩 Loader Functions
const loadEvents = () => {
    const files = fs.readdirSync('./events').filter(f => f.endsWith('.js'));
    for (const file of files) {
        const event = require(`./events/${file}`);
        if (event.name && event.execute) {
            global.events.set(event.name, event);
            console.log(`📥 Event Loaded: ${event.name}`);
        }
    }
};

const loadCommands = () => {
    const files = fs.readdirSync('./cmds').filter(f => f.endsWith('.js'));
    for (const file of files) {
        const command = require(`./cmds/${file}`);
        if (command.name && command.execute) {
            global.commands.set(command.name, command);
            console.log(`📦 Command Loaded: ${command.name}`);
        }
    }
};

const loadAPIs = () => {
    const apiPath = path.join(__dirname, 'api');
    if (!fs.existsSync(apiPath)) return;

    fs.readdirSync(apiPath).forEach(file => {
        if (file.endsWith('.js')) {
            const apiModule = require(`./api/${file}`);
            const route = apiModule.route || `/api/${apiModule.name}`;
            const method = apiModule.method?.toLowerCase() || 'get';

            if (!apiModule.name || !apiModule.execute) return;

            app[method](route, async (req, res) => {
                try {
                    await apiModule.execute({ req, res });
                } catch (err) {
                    console.error(`❌ API ${apiModule.name} failed`, err);
                    res.status(500).json({ error: "Internal Server Error" });
                }
            });

            apiRoutes.push({
                name: apiModule.name,
                category: apiModule.category || 'uncategorized',
                route,
                method: method.toUpperCase(),
                usage: apiModule.usage || 'No usage provided'
            });

            console.log(`🌐 API Registered: ${apiModule.name} [${method.toUpperCase()}]`);
        }
    });
};

// 💾 Bot State Loaders
const loadBots = () => {
    if (!fs.existsSync('./appState.json')) return {};
    return JSON.parse(fs.readFileSync('./appState.json'));
};

const saveBots = (bots) => {
    fs.writeFileSync('./appState.json', JSON.stringify(bots, null, 2));
};

// 🤖 Bot Login and Event Handling
const startBot = (botID, botData) => {
    login({ appState: botData.appState }, (err, api) => {
        if (err) return console.error(`❌ Failed to login bot ${botID}`, err);

        api.setOptions(config.option);
        global.activeBots.set(botID, {
            api,
            ownerUid: botData.ownerUid || null,
            selectedCommands: botData.selectedCommands || []
        });

        console.log(`✅ Bot Active: ${botID}`);

        // Notify owner on startup
        if (botData.ownerUid) {
            api.sendMessage(`🤖 Your bot (${botID}) is online!`, botData.ownerUid, (err) => {
                if (err) console.error(`❌ Failed to notify ${botData.ownerUid}`);
            });
        }

        // 🔄 Event Listener
        api.listenMqtt(async (err, event) => {
            if (err) return console.error(`❌ Event error for ${botID}`, err);

            const botInstance = global.activeBots.get(botID);

            // Handle Events
            if (global.events.has(event.type)) {
                try {
                    await global.events.get(event.type).execute({ api, event });
                } catch (e) {
                    console.error(`❌ Error in event '${event.type}'`, e);
                }
            }

            // Handle Commands
            if (event.body) {
                const args = event.body.trim().split(/ +/);
                const commandName = args.shift().toLowerCase();

                for (const [name, cmd] of global.commands.entries()) {
                    const allowed = cmd.admin ||
                        botInstance.selectedCommands.length === 0 ||
                        botInstance.selectedCommands.includes(name);

                    const matches = (cmd.usePrefix && event.body.startsWith(botPrefix) && commandName === name)
                        || (!cmd.usePrefix && commandName === name);

                    if (allowed && matches) {
                        try {
                            await cmd.execute({ api, event, args, ownerUid: botInstance.ownerUid });
                        } catch (e) {
                            console.error(`❌ Command '${name}' failed on ${botID}`, e);
                        }
                        return;
                    }
                }
            }
        });
    });
};

const startAllBots = () => {
    const bots = loadBots();
    for (const [botID, botData] of Object.entries(bots)) {
        startBot(botID, botData);
    }
};

// 📡 REST API Endpoints
app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/list', (_, res) => {
    res.json(apiRoutes);
});

app.get('/api/bots', (_, res) => {
    const bots = loadBots();
    res.json(Object.keys(bots).map(botID => ({ botID })));
});

app.get('/api/available-cmds', (_, res) => {
    const cmds = Array.from(global.commands.values()).map(cmd => ({
        name: cmd.name,
        usage: cmd.usage || "No usage provided",
        admin: cmd.admin || false
    }));
    res.json(cmds);
});

app.post('/api/add-bot', (req, res) => {
    const { appState, ownerUid, selectedCommands } = req.body;
    if (!appState) return res.status(400).json({ error: "Missing appState" });

    const botID = `bot_${Date.now()}`;
    const bots = loadBots();
    const adminCmds = Array.from(global.commands.values())
        .filter(cmd => cmd.admin).map(cmd => cmd.name);

    bots[botID] = {
        appState,
        ownerUid: ownerUid || null,
        selectedCommands: [...new Set([...(selectedCommands || []), ...adminCmds])]
    };

    saveBots(bots);
    startBot(botID, bots[botID]);

    res.json({ success: true, botID });
});

// 🚀 Launch Server
const bootServer = () => {
    loadEvents();
    loadCommands();
    loadAPIs();
    startAllBots();

    app.listen(PORT, () => {
        console.log(`🚀 Server Ready at: http://localhost:${PORT}`);
    });
};

bootServer();
