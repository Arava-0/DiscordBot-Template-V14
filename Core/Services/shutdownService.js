/*
 * This file is part of DiscordBot-Template-V14 project by Arava.
 * You are authorized to use, modify, and distribute this project under the terms of the MIT License.
 * For more information, please consult: https://github.com/Arava-0/DiscordBot-Template-V14.
 * Year: 2025
 *
 * Please never remove this comment block.
 */

const { Client } = require("discord.js");

/**
 * Here you can execute some functions before the bot is shutting down
 * Like saving data, sending a message to a channel, etc...
 *
 * @param {Client} client
 * @param {String} shutdownMessage
 */
async function shutdownService(client, shutdownMessage)
{
    console.log(
        `\x1b[1m\x1b[38;2;255;0;0m` +
        `${client.user.username.toUpperCase()} BOT - Shutting down (${shutdownMessage})... ` +
        `Please wait...\x1b[0m`
    );
}

module.exports = {
    shutdownService
}
