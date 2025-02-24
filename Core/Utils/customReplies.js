const { EmbedBuilder, Colors } = require("discord.js");

const NOT_DEVELOPPED_YET = new EmbedBuilder()
    .setTitle("**FONCTIONNALITÉ NON DÉVELOPPÉE**")
    .setColor(Colors.Orange)

const MAINTENANCE = new EmbedBuilder()
    .setTitle("**MAINTENANCE EN COURS**")
    .setDescription("Merci de patienter...")
    .setColor(Colors.Orange)

const BOT_STARTING = new EmbedBuilder()
    .setTitle("**DÉMARRAGE DU BOT EN COURS**")
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

async function botStarting(interaction) {
    if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ embeds: [BOT_STARTING], ephemeral: true });
    } else {
        await interaction.reply({ embeds: [BOT_STARTING], ephemeral: true });
    }
}

module.exports = {
    notDeveloppedYet,
    maintenance,
    botStarting
};