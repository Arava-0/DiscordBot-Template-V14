const { ChatInputCommandInteraction, SlashCommandBuilder, Client, AutocompleteInteraction } = require('discord.js');

module.exports = {

    type: "command",
    userCooldown: null,
    serverCooldown: null,
    globalCooldown: null,
    deferReply: true,
    ephemeral: true,
    isOnPrivateGuild: null,

    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!")
    .addStringOption(option => option
        .setName('test-autocomplete')
        .setDescription('An option with autocomplete')
        .setAutocomplete(true)
    ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        await interaction.editReply('Pong!');
    },

    /**
     * @param {AutocompleteInteraction} interaction
     * @param {Client} client
     */
    async autocomplete(interaction, client) {
        const currentValue = interaction.options.getFocused();
        const choices = ['Pong', 'Ping', 'Pung', 'Peng', 'Pang'];
        const filtered = choices.filter(choice => choice.toLowerCase().startsWith(currentValue.toLowerCase()));
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    }
}
