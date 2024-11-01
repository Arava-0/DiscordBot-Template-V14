const { CommandInteraction, Client } = require("discord.js");

const { notDeveloppedYet, maintenance } = require("./Utils/customReplies");
const { isDeveloper } = require("./Utils/isDeveloper");
const { canExecute } = require("./Services/cooldownService");

module.exports = {
    name : "interactionCreate",
    type: "event",
    once: false,
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        console.log(`[INTERACTION] ${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
        if (!interaction.isChatInputCommand() && !interaction.isButton() && !interaction.isAnySelectMenu() && !interaction.isModalSubmit()) return;

        if (client.maintenance === true && await isDeveloper(client, interaction.user.id) === false)
            return await maintenance(interaction);

        if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);

            if (button == undefined || button == null) {
                return await notDeveloppedYet(interaction);
            }

            if (!button.noDeferred)
                await interaction.deferReply({ ephemeral: button.ephemeral });

            button.execute(interaction, client);
        }

        if (interaction.isModalSubmit()) {
            const modal = client.modals.get(interaction.customId);

            if (modal == undefined || modal == null) {
                return await notDeveloppedYet(interaction);
            }

            if (!modal.noDeferred)
                await interaction.deferReply({ ephemeral: modal.ephemeral });

            modal.execute(interaction, client);
        }

        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (command == null || command == undefined) {
                return notDeveloppedYet(interaction);
            }

            if (!command.noDeferred)
                await interaction.deferReply({ ephemeral: command.ephemeral });

            if (await canExecute(client, interaction, command) === false) return;
            await command.execute(interaction, client);
        }

        if (interaction.isContextMenuCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (command == null || command == undefined) {
                return notDeveloppedYet(interaction);
            }

            if (!command.noDeferred)
                await interaction.deferReply({ ephemeral: command.ephemeral });

            if (await canExecute(client, interaction, command) === false) return;
            await command.execute(interaction, client);
        }

        if (interaction.isAnySelectMenu()) {
            const select = client.selectMenus.get(interaction.customId);

            if (select == undefined || select == null) {
                return await notDeveloppedYet(interaction);
            }

            if (!select.noDeferred)
                await interaction.deferReply({ ephemeral: select.ephemeral });

            select.execute(interaction, client);
        }
    }
}
