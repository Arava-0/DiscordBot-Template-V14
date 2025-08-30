/*
 * This file is part of DiscordBot-Template-V14 project by Arava.
 * You are authorized to use, modify, and distribute this project under the terms of the MIT License.
 * For more information, please consult: https://github.com/Arava-0/DiscordBot-Template-V14.
 * Year: 2025
 *
 * Please never remove this comment block.
 */

const cron = require('node-cron');
const { ActivityType } = require("discord.js");
const { getRandomInt } = require('../Utils/math');
const { showInfo } = require('../Utils/customInformations');

async function updatePresence(client, message)
{
    await client.user.setPresence({
        activities: [
            {
                name: `${message == null ? `Je suis sur ${client.guilds.cache.size} serveurs ! 🌟` : message}`,
                type: ActivityType.Custom
            }
        ],
        status: 'dnd',
        afk: false
    });
}

async function launchPresenceService(client)
{
    const messages = client.config.presence;

    await updatePresence(client, `Je suis sur ${client.guilds.cache.size} serveurs ! 🌟`);

    cron.schedule('0 */5 * * * *', async () => {
        let rdmNumber = getRandomInt(0, messages.length);
        if (rdmNumber == messages.length)
            await updatePresence(client, null);
        else
            await updatePresence(client, messages[rdmNumber]);
    })

    showInfo("PRESENCE", "Service de présence démarré !");
}

module.exports = {
    launchPresenceService
}
