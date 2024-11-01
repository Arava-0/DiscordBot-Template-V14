const { ActivityType, Collection } = require("discord.js");
const { showInfo } = require("../Utils/customInformations");

async function initClient(client)
{
    client.cache = {};

    client.commands = new Collection();
    client.buttons = new Collection();
    client.selectMenus = new Collection();
    client.modals = new Collection();

    client.config = require('../../config.json');
    client.debugMode = client.config.debugMode;
    client.maintenance = client.config.maintenance;

    await client.user.setPresence({
        activities: [
            {
                name: "🚧 Je suis en train de démarrer...",
                type: ActivityType.Custom
            }
        ],
        status: 'dnd',
        afk: false
    });

    for (const guild of client.guilds.cache.values()) {
        await guild.members.fetch();
        await guild.roles.fetch();
        await guild.channels.fetch();
    }

    showInfo("CLIENT", "  Client discord initialisé !");
}

function ready()
{
    if (process.send)
        process.send("ready");
}

module.exports = {
    initClient,
    ready
}