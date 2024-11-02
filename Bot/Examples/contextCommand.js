const { ChatInputCommandInteraction, ContextMenuCommandBuilder, ApplicationCommandType, Client } = require('discord.js');

/**
 * @file Command module for a Discord bot using discord.js
 * @description This module exports a context command with configurable properties
 * for a Discord bot.
 *
 * - `type`: Indicates that this file is a command.
 *
 * - `cooldown`: Specifies the cooldown period for the command in ms.
 *   If set to `null`, no cooldown is applied.
 *
 * - `noDeferred`: If set to `false` or undefined, the command response is
 *   automatically deferred, meaning the bot will wait for more time to complete
 *   the response, and you must use `editReply()` to respond. If set to `true`,
 *   the response is not deferred, and you can use `.reply()` to respond directly.
 *
 * - `ephemeral`: Controls whether the response is ephemeral (visible only to the
 *   user who invoked the command). This setting only takes effect if `noDeferred`
 *   is set to `false` or undefined.
 *
 * - `isOnPrivateGuild`: (Optional) The ID of the guild where the command is
 *   restricted. If not provided, the command will be registered globally.
 *
 * - `data`: Defines the slash command details using `ContextMenuCommandBuilder`,
 *   including the command name, permissions, and options.
 *
 * - `execute()`: Asynchronous function that contains the logic to execute when
 *   the command is triggered.
 */
module.exports = {

    type: "command",
    cooldown: null,
    noDeferred: false,
    ephemeral: true,
    isOnPrivateGuild: "123456789012345678",

    data: new ContextMenuCommandBuilder()
    .setName("example")
    .setType(ApplicationCommandType.Message),

    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
    }
}
