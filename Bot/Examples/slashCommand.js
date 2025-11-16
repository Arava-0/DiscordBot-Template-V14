const { ChatInputCommandInteraction, SlashCommandBuilder, Client, AutocompleteInteraction } = require('discord.js');

/**
 * @file Command module for a Discord bot using discord.js
 * @description This module exports a slash command with configurable properties
 * for a Discord bot.
 *
 * - `type`: Indicates that this file is a command.
 *
 * - `userCooldown`: Specifies the cooldown period for each user for the
 *   command in ms. If set to `null`, no cooldown is applied.
 *   ex: if user A uses the command, user A will have to wait for the cooldown but
 *   user B can use the command without waiting for the cooldown of user A.
 *
 * - `serverCooldown`: Specifies the cooldown period for the entire server for
 *   the command in ms. If set to `null`, no cooldown is applied.
 *   ex: if user A uses the command, user B will have to wait for the cooldown too
 *   (only if user B is on the same server).
 *
 * - `globalCooldown`: Specifies the cooldown period for the entire bot for
 *   the command in ms. If set to `null`, no cooldown is applied.
 *   ex: if user A uses the command, user B will have to wait for the cooldown too.
 *   (even if user B is in another server).
 *
 * - `deferReply`: If set to `true`, the command response is automatically deferred,
 *   meaning the bot will wait for more time to complete the response, and you must
 *   use `editReply()` to respond. If set to `false` or undefined the response is
 *   not deferred, and you can use `.reply()` to respond directly.
 *
 * - `ephemeral`: Controls whether the response is ephemeral (visible only to the
 *   user who invoked the command). This setting only takes effect if `deferReply`
 *   is set to `true`.
 *
 * - `isOnPrivateGuild`: (Optional) The ID of the guild where the command is
 *   restricted. If not provided, the command will be registered globally.
 *
 * - `data`: Defines the slash command details using `SlashCommandBuilder`,
 *   including the command name, description, and options.
 *
 * - `execute()`: Asynchronous function that contains the logic to execute when
 *   the command is triggered.
 *
 * - `autocomplete()`: Asynchronous function that handles autocomplete interactions
 *   for the command. If not needed, this function can be omitted.
 *   You can use autoComplete by setting an option with `.setAutocomplete(true)` in the
 *   `data` property (!Options are forbidden if you use autocomplete).
 */
module.exports = {

    type: "command",
    userCooldown: null,
    serverCooldown: null,
    globalCooldown: null,
    deferReply: false,
    ephemeral: true,
    isOnPrivateGuild: "123456789012345678",

    data: new SlashCommandBuilder()
    .setName("example")
    .setDescription("This is an example command."),

    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
    },

    /**
     * @param {AutocompleteInteraction} interaction
     * @param {Client} client
     */
    async autocomplete(interaction, client) {
    }
}
