const { EmbedBuilder, Colors } = require("discord.js");

const NOT_DEVELOPPED_YET = new EmbedBuilder()
    .setTitle("**FONCTIONNALITÉ NON DÉVELOPPÉE**")
    .setColor(Colors.Orange)

const MAINTENANCE = new EmbedBuilder()
    .setTitle("**MAINTENANCE EN COURS**")
    .setDescription("Merci de patienter...")
    .setColor(Colors.Orange)

async function notDeveloppedYet(interaction) {
    if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ embeds: [NOT_DEVELOPPED_YET], ephemeral: true });
    } else {
        await interaction.reply({ embeds: [NOT_DEVELOPPED_YET], ephemeral: true });
    }
}

async function maintenance(interaction) {
    if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ embeds: [MAINTENANCE], ephemeral: true });
    } else {
        await interaction.reply({ embeds: [MAINTENANCE], ephemeral: true });
    }
}

module.exports = {
    notDeveloppedYet,
    maintenance
};