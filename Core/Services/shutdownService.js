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
