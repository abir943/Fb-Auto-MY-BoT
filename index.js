const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const login = require('ws3-fca');
const scheduleTasks = require('./custom');

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Global Maps
global.events = new Map();
global.commands = new Map();
global.activeBots = new Map();
global.handleReply = new Map();
global.handleReaction = new Map();
global.handleEvent = new Map();

const apiRoutes = [];

// Display Server Info
console.log("\n===============================");
console.log("🤖 BOT SERVER: AMINUL MULTI-BOT");
console.log("👤 CREATED BY: Aminulsordar");
console.log("🌐 API & DASHBOARD: http://localhost:" + PORT);
console.log("===============================\n");

// Load Config
const loadConfig = (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            console.error(`❌ Missing ${filePath}! Make sure it exists.`);
            process.exit(1);
        }
        return JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
        console.error(`❌ Error loading ${filePath}:`, error);
        process.exit(1);
    }
};

const config = loadConfig("./config.json");
const botPrefix = config.prefix || "!";

// Serve Generated Image
app.get("/api/image", (req, res) => {
    const imagePath = path.join(__dirname, "./api/generated-image.png");
    res.sendFile(imagePath, (err) => {
        if (err) res.status(404).json({ error: "Image not found" });
    });
});

// Loaders
const loadEvents = () => {
    try {
        const files = fs.readdirSync('./events').filter(f => f.endsWith('.js'));
        for (const file of files) {
            const event = require(`./events/${file}`);
            if (event.name && event.execute) {
                global.events.set(event.name, event);
                console.log(`📥 Event Loaded: ${event.name}`);
            }
        }
    } catch (error) {
        console.error("❌ Error loading events:", error);
    }
};

const loadCommands = () => {
    try {
        const files = fs.readdirSync('./cmds').filter(f => f.endsWith('.js'));
        for (const file of files) {
            const command = require(`./cmds/${file}`);
            if (command.name && command.execute) {
                global.commands.set(command.name, command);
                console.log(`📦 Command Loaded: ${command.name}`);
            }
        }
    } catch (error) {
        console.error("❌ Error loading commands:", error);
    }
};

const loadAPIs = () => {
    try {
        const apiPath = path.join(__dirname, 'api');
        if (!fs.existsSync(apiPath)) return console.warn("⚠️ No 'api/' directory found.");

        fs.readdirSync(apiPath).forEach(file => {
            if (file.endsWith('.js')) {
                const apiModule = require(`./api/${file}`);
                const route = apiModule.route || `/api/${apiModule.name}`;
                const method = apiModule.method?.toLowerCase() || 'get';

                if (!apiModule.name || !apiModule.execute)
                    throw new Error(`Missing properties in ${file}`);

                app[method](route, async (req, res) => {
                    try {
                        await apiModule.execute({ req, res });
                    } catch (error) {
                        console.error(`❌ API '${apiModule.name}' Error:`, error);
                        res.status(500).json({ error: "Internal Server Error" });
                    }
                });

                apiRoutes.push({
                    name: apiModule.name,
                    category: apiModule.category || "uncategorized",
                    route,
                    method: method.toUpperCase(),
                    usage: apiModule.usage || "No usage info"
                });

                console.log(`🌐 API Loaded: ${apiModule.name} [${method.toUpperCase()} ${route}]`);
            }
        });
    } catch (error) {
        console.error("❌ Error loading APIs:", error);
    }
};

// Config Loaders
const loadBots = () => {
    try {
        if (!fs.existsSync("./appState.json")) return {};
        return JSON.parse(fs.readFileSync("./appState.json"));
    } catch (error) {
        console.error("❌ Error loading appState.json:", error);
        return {};
    }
};

const saveBots = (bots) => {
    try {
        fs.writeFileSync("./appState.json", JSON.stringify(bots, null, 2));
    } catch (error) {
        console.error("❌ Error saving appState.json:", error);
    }
};

// Bot Logic
const startBot = async (botID, botData) => {
    try {
        login({ appState: botData.appState }, (err, api) => {
            if (err) return console.error(`❌ Bot ${botID} login failed:`, err.error || err);

            api.setOptions(config.option);
            global.activeBots.set(botID, {
                api,
                ownerUid: botData.ownerUid || null,
                selectedCommands: botData.selectedCommands || []
            });

            console.log(`🤖 Bot Online: ${botID}`);

            if (botData.ownerUid) {
                api.sendMessage(`✅ Your bot (${botID}) is now online.`, botData.ownerUid, (err) => {
                    if (err) console.error(`❌ Couldn't message owner ${botData.ownerUid}:`, err);
                    else console.log(`📤 Owner ${botData.ownerUid} notified`);
                });
            }

            api.listenMqtt(async (err, event) => {
                if (err) return console.error(`❌ Event error on bot ${botID}:`, err);

                const botInstance = global.activeBots.get(botID);

                // Run events
                if (global.events.has(event.type)) {
                    try {
                        await global.events.get(event.type).execute({ api, event });
                    } catch (e) {
                        console.error(`❌ Error in event '${event.type}' for bot ${botID}:`, e);
                    }
                }

                // Run commands
                if (event.body) {
                    const args = event.body.trim().split(/ +/);
                    const commandName = args.shift().toLowerCase();

                    for (const [name, command] of global.commands) {
                        const allowed = command.admin ||
                            botInstance.selectedCommands.length === 0 ||
                            botInstance.selectedCommands.includes(name);

                        const matches = (command.usePrefix && event.body.startsWith(botPrefix) && commandName === name)
                            || (!command.usePrefix && commandName === name);

                        if (allowed && matches) {
                            try {
                                await command.execute({ api, event, args, ownerUid: botInstance.ownerUid });
                            } catch (e) {
                                console.error(`❌ Command '${name}' failed on ${botID}:`, e);
                            }
                            return;
                        }
                    }
                }
            });
        });
    } catch (error) {
        console.error(`❌ Bot ${botID} crashed:`, error);
        global.activeBots.delete(botID);
    }
};

const startAllBots = () => {
    const bots = loadBots();
    Object.entries(bots).forEach(([botID, botData]) => {
        startBot(botID, botData);
    });
};

// API Endpoints
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/list', (req, res) => {
    res.json(apiRoutes);
});

app.get('/api/bots', (req, res) => {
    const bots = loadBots();
    res.json(Object.keys(bots).map(botID => ({ botID })));
});

app.get('/api/available-cmds', (req, res) => {
    const cmds = Array.from(global.commands.values()).map(cmd => ({
        name: cmd.name,
        usage: cmd.usage,
        admin: cmd.admin || false
    }));
    res.json(cmds);
});

app.post('/api/add-bot', (req, res) => {
    const { appState, ownerUid, selectedCommands } = req.body;
    if (!appState) return res.status(400).json({ error: "appState is required" });

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

// Boot Function
const bootServer = () => {
    loadEvents();
    loadCommands();
    loadAPIs();
    startAllBots();

    app.listen(PORT, () => {
        console.log(`🚀 Server Running at: http://localhost:${PORT}`);
    });
};

bootServer();
