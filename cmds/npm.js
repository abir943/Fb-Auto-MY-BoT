const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

module.exports = {
    name: "npm",
    aliases: ["npminstall", "pkg", "list"],
    usePrefix: true,
    description: "Install, update, or list npm packages (admin only)",
    async execute(api, event, args) {
        const adminID = "100071880593545";
        if (event.senderID !== adminID) {
            return api.sendMessage("❌ Only the bot admin can use this command.", event.threadID);
        }

        const [subcommand, ...restArgs] = args;
        const action = (subcommand || "").toLowerCase();
        const pkgName = restArgs.join(" ");

        const reloadCommands = () => {
            try {
                global.commands.clear();
                global.aliases.clear();
                const files = fs.readdirSync("./cmds").filter(f => f.endsWith(".js"));
                for (const file of files) {
                    delete require.cache[require.resolve(`./${file}`)];
                    const cmd = require(`./${file}`);
                    if (cmd.name && cmd.execute) {
                        global.commands.set(cmd.name, cmd);
                        if (cmd.aliases) {
                            cmd.aliases.forEach(a => global.aliases.set(a, cmd.name));
                        }
                    }
                }
                console.log("✅ Commands reloaded after npm operation.");
            } catch (e) {
                console.error("❌ Failed to reload commands:", e);
            }
        };

        if (!action) {
            return api.sendMessage(
                "📦 NPM Command Usage:\n\n" +
                "• npm install <package>\n" +
                "• npm update <package>\n" +
                "• npm list",
                event.threadID
            );
        }

        if (action === "install" || action === "update") {
            if (!pkgName) return api.sendMessage(`❌ Please specify a package to ${action}.`, event.threadID);

            api.sendMessage(`⏳ ${action === "install" ? "Installing" : "Updating"} '${pkgName}'...`, event.threadID);

            exec(`npm ${action} ${pkgName}`, (err, stdout, stderr) => {
                if (err) {
                    console.error(`❌ NPM ${action} error:`, stderr);
                    return api.sendMessage(`❌ ${action} failed:\n${stderr}`, event.threadID);
                }

                reloadCommands();
                return api.sendMessage(`✅ Successfully ${action === "install" ? "installed" : "updated"} '${pkgName}' and reloaded commands.`, event.threadID);
            });

        } else if (action === "list") {
            const packageJsonPath = path.join(__dirname, "..", "package.json");

            if (!fs.existsSync(packageJsonPath)) {
                return api.sendMessage("❌ package.json not found!", event.threadID);
            }

            try {
                const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
                const dependencies = pkg.dependencies || {};
                const devDependencies = pkg.devDependencies || {};

                const depList = Object.entries(dependencies)
                    .map(([name, version]) => `📦 ${name}@${version}`)
                    .join("\n");

                const devDepList = Object.entries(devDependencies)
                    .map(([name, version]) => `🛠️ ${name}@${version}`)
                    .join("\n");

                const message =
                    `✅ Installed Packages:\n\n${depList || "📭 No dependencies."}\n\n` +
                    `🔧 Dev Packages:\n\n${devDepList || "📭 No devDependencies."}`;

                api.sendMessage(message, event.threadID);
            } catch (err) {
                console.error(err);
                api.sendMessage("❌ Error reading package.json!", event.threadID);
            }

        } else {
            return api.sendMessage(
                "❌ Unknown subcommand.\nTry: `npm install <pkg>`, `npm update <pkg>` or `npm list`",
                event.threadID
            );
        }
    }
};
