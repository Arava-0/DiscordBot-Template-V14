const { EmbedBuilder, WebhookClient, ActivityType } = require('discord.js')
const { showInfo } = require("../Utils/customInformations");

async function initClient(client)
{
    client.cache = {};

    client.loader = {
        commands: [],
        events: [],
        buttons: [],
        selectMenus: [],
        modals: [],
    };

    client.config = require('../../config.json');
    client.debugMode = client.config.debugMode;
    client.maintenance = client.config.maintenance;
    client.cache["webhookURL"] = client.config.webhookURL;

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

function ready(client)
{
    if (process.send)
        process.send("ready");

    const webhookCheck = /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/;
    if (client.cache["webhookURL"] && webhookCheck.test(client.cache["webhookURL"])) {
        try {
            let webhookInstance = new WebhookClient({
                url: client.cache["webhookURL"]
            })

            let description = `- Je suis sur ${client.guilds.cache.size} serveur${client.guilds.cache.size > 1 ? "s" : ""} !\n` +
                `**__Informations__**\n` +
                `> - ${client.loader.commands.length} commande${client.loader.commands.length > 1 ? "s" : ""} chargée${client.loader.commands.length > 1 ? "s" : ""}\n` +
                `> - ${client.loader.events.length} événement${client.loader.events.length > 1 ? "s" : ""} chargé${client.loader.events.length > 1 ? "s" : ""}\n` +
                `> - ${client.loader.buttons.length} bouton${client.loader.buttons.length > 1 ? "s" : ""} chargé${client.loader.buttons.length > 1 ? "s" : ""}\n` +
                `> - ${client.loader.selectMenus.length} menu déroulant${client.loader.selectMenus.length > 1 ? "s" : ""} chargé${client.loader.selectMenus.length > 1 ? "s" : ""}\n` +
                `> - ${client.loader.modals.length} modal${client.loader.modals.length > 1 ? "s" : ""} chargé${client.loader.modals.length > 1 ? "s" : ""}\n\n` +
                `> Mode débug: **${client.debugMode ? "Activé" : "Désactivé"}**\n` +
                `> Maintenance: **${client.maintenance ? "Activée" : "Désactivée"}**`;

            if (webhookInstance) {
                webhookInstance.edit({
                    name: client.user.username,
                    avatar: client.user.displayAvatarURL({ dynamic: true })
                }).catch(() => {})

                webhookInstance.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`${client.user.tag} vient de démarrer !`)
                            .setDescription(description)
                            .setColor(client.config.color.success)
                            .setTimestamp()
                            .setFooter({
                                text: "Core made by Arava ❤️",
                                iconURL: client.user.displayAvatarURL({ dynamic: true })
                            })
                    ]
                }).catch(() => {})
            }
        } catch (e) {}
    }
}

module.exports = {
    initClient,
    ready
}