/*
 * This file is part of DiscordBot-Template-V14 project by Arava.
 * You are authorized to use, modify, and distribute this project under the terms of the MIT License.
 * For more information, please consult: https://github.com/Arava-0/DiscordBot-Template-V14.
 * Year: 2025
 *
 * Please never remove this comment block.
 */

const { Client, MessageFlags, BaseInteraction } = require("discord.js");

const { notDeveloppedYet, maintenance, botStarting } = require("./Utils/customReplies");
const { isDeveloper } = require("./Utils/isDeveloper");
const { canExecute } = require("./Services/cooldownService");
const { showInfo } = require("./Utils/customInformations");
const { isNullOrUndefined } = require("./Utils/isNullOrUndefined");

module.exports = {
    name : "interactionCreate",
    type: "event",
    priority: 999,
    once: false,
    /**
     * @param {Client} client
     * @param {BaseInteraction} interaction
     */
    async execute(client, interaction) {

        const isInMaintenance = (client.config.maintenance === true && await isDeveloper(client, interaction.user.id) === false)
        const isReady = client.cache && client.cache.ready;

        /**
         * If the interaction is an autocomplete interaction, the bot will execute it (if it exists).
         */
        if (interaction.isAutocomplete() && !isInMaintenance && isReady) {
            const command = client.loader.commands.find(c => c.name === interaction.commandName);

            if (isNullOrUndefined(command) || typeof command.autocomplete !== "function")
                return;

            await command.autocomplete(interaction, client);
            return;
        }

        /**
         * Logs every interaction triggered by a user in the console.
         */
        let isInGuild = isNullOrUndefined(interaction.guild) ? false : true;
        showInfo(
            "INTERACTION",
            `${interaction.user.tag} triggered an interaction in ` +
            `${isInGuild ? `guild #${interaction.guild.name} ` +
            `| #${interaction.channel.name}.` : "DMs"}`
        );

        /**
         * If the bot is in maintenance mode, only developers can interact with the bot.
         * If the user is not a developer, the bot will reply with a maintenance message.
         */
        if (isInMaintenance)
            return await maintenance(interaction);

        /**
         * If the bot is not ready, the bot will reply with a starting message.
         */
        if (!isReady)
            return await botStarting(interaction);

        /**
         * If the interaction is a command, the bot will execute it (if it exists).
         */
        if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
            const command = client.loader.commands.find(c => c.name === interaction.commandName);

            if (isNullOrUndefined(command))
                return notDeveloppedYet(interaction);

            if (command.deferReply)
                await interaction.deferReply({ flags: command.ephemeral ? MessageFlags.Ephemeral : undefined });

            if (await canExecute(client, interaction, command) === false) return;
            await command.execute(interaction, client);
        }

        /**
         * If the interaction is a button, select menu or modal, the bot will execute it (if it exists).
         */
        if (interaction.isButton() || interaction.isAnySelectMenu() || interaction.isModalSubmit()) {
            let items = null;

            if (interaction.isButton())
                items = client.loader.buttons;
            if (interaction.isAnySelectMenu())
                items = client.loader.selectMenus;
            if (interaction.isModalSubmit())
                items = client.loader.modals;

            let item = null;
            if (items)
                item = items.find(i => i.pattern.test(interaction.customId));

            if (isNullOrUndefined(item))
                return await notDeveloppedYet(interaction);

            const match = item.pattern.exec(interaction.customId);
            const dynamicValues = Array.from(match).slice(1);

            if (item.deferReply)
                await interaction.deferReply({ flags: item.ephemeral ? MessageFlags.Ephemeral : undefined });
            else if (item.deferUpdate)
                await interaction.deferUpdate();

            item.execute(interaction, client, ...dynamicValues);
        }
    }
}
