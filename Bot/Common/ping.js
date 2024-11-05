const { ChatInputCommandInteraction, SlashCommandBuilder, Client } = require('discord.js');

module.exports = {

    type: "command",
    userCooldown: null,
    serverCooldown: null,
    noDeferred: false,
    ephemeral: true,
    isOnPrivateGuild: null,

    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        await interaction.editReply('Pong!');
    }
}
