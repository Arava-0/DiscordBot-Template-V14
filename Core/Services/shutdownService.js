/*
 * This file is part of DiscordBot-Template-V14 project by Arava.
 * You are authorized to use, modify, and distribute this project under the terms of the MIT License.
 * For more information, please consult: https://github.com/Arava-0/DiscordBot-Template-V14.
 * Year: 2025
 *
 * Please never remove this comment block.
 */

const { Client } = require("discord.js");
const { showError } = require("../Utils/customInformations");

const shutdownTasks = new Map();

/**
 * pushToDoWhenShutdown(fn)
 * ------------------------
 * Add a task to be executed when the bot is shutting down.
 * The function can be asynchronous (returning a Promise) or synchronous.
 * The function receives the Discord Client as its first argument.
 *
 * @param {function(Client):Promise<void>|function(Client):void} fn
 */
function pushToDoWhenShutdown(fn) {
    if (typeof fn !== "function")
        throw new TypeError("Shutdown task must be a function.");
    shutdownTasks.set(fn.name || `anonymous_${shutdownTasks.size + 1}`, fn);
}

/**
 * Here are executed the final tasks before the bot shuts down.
 * Like saving data, sending a message to a channel, etc...
 *
 * @param {Client} client
 * @param {String} shutdownMessage
 */
async function shutdownService(client, shutdownMessage) {
    console.log(
        `\x1b[1m\x1b[38;2;255;0;0m` +
        `${client.user?.username?.toUpperCase() || "BOT"} - Shutting down (${shutdownMessage})... ` +
        `Please wait...\x1b[0m`
    );

    for (const [name, task] of shutdownTasks) {
        if (client.config.debugMode)
            console.log(`[ShutdownService] Executing task: ${name}`);
        try {
            await task(client);
        } catch (err) {
            showError('SHUTDOWN', `Error executing task ${name}: ${err}`, client.config.debugMode == true ? err.stack : null);
        }
    }
}

module.exports = {
    shutdownService,
    pushToDoWhenShutdown
};
