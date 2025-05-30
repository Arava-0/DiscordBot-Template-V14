const { CommandInteraction, Client, MessageFlags } = require("discord.js");

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
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
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
        if (client.maintenance === true && await isDeveloper(client, interaction.user.id) === false)
            return await maintenance(interaction);

        /**
         * If the bot is not ready, the bot will reply with a starting message.
         */
        if (!client.cache || !client.cache.ready)
            return await botStarting(interaction);

        /**
         * If the interaction is a command, the bot will execute it (if it exists).
         */
        if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
            const command = client.loader.commands.find(c => c.name === interaction.commandName);

            if (isNullOrUndefined(command))
                return notDeveloppedYet(interaction);

            if (!command.noDeferred)
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

            if (!item.noDeferred)
                await interaction.deferReply({ flags: item.ephemeral ? MessageFlags.Ephemeral : undefined });

            item.execute(interaction, client, ...dynamicValues);
        }
    }
}
