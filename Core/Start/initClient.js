/*
 * This file is part of DiscordBot-Template-V14 project by Arava.
 * You are authorized to use, modify, and distribute this project under the terms of the MIT License.
 * For more information, please consult: https://github.com/Arava-0/DiscordBot-Template-V14.
 * Year: 2025
 *
 * Please never remove this comment block.
 */

const { EmbedBuilder, WebhookClient, ActivityType, Colors, Events } = require('discord.js')
const { isNullOrUndefined } = require('../Utils/isNullOrUndefined');
const { showInfo } = require("../Utils/customInformations");
const path = require('path');
const { setClient } = require('../Utils/getClient');

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

    const config = require(path.join(process.cwd(), "config.json"));
    config.__file = path.join(process.cwd(), "config.json");
    client.config = config;

    client.devWatcherMode = process.env.DEV_WATCHER === "true";
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

    setClient(client);
    showInfo("CLIENT", "Client discord initialisé !");
}

function ready(client)
{
    if (process.send)
        process.send("ready");

    if (isNullOrUndefined(client.cache))
        client.cache = {};
    client.cache["ready"] = true;
    client.emit(Events.ClientReady);

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
                `> Mode débug: **${client.config.debugMode ? "Activé" : "Désactivé"}**\n` +
                `> Maintenance: **${client.config.maintenance ? "Activée" : "Désactivée"}**`;

            if (webhookInstance) {
                webhookInstance.edit({
                    name: client.user.username,
                    avatar: client.user.displayAvatarURL({ dynamic: true })
                }).then(() => {
                    webhookInstance.send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`${client.user.tag} vient de démarrer !`)
                                .setDescription(description)
                                .setColor(Colors.Green)
                                .setTimestamp()
                                .setFooter({
                                    text: "Core made by Arava ❤️",
                                    iconURL: client.user.displayAvatarURL({ dynamic: true })
                                })
                        ]
                    }).catch(() => {})
                }).catch(() => {});
            }
        } catch (e) {}
    }
}

module.exports = {
    initClient,
    ready
}