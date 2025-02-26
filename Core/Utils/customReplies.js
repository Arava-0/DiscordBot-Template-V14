const { EmbedBuilder, Colors, MessageFlags } = require("discord.js");

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
        await interaction.editReply({ embeds: [NOT_DEVELOPPED_YET], flags: MessageFlags.Ephemeral });
    } else {
        await interaction.reply({ embeds: [NOT_DEVELOPPED_YET], flags: MessageFlags.Ephemeral });
    }
}

async function maintenance(interaction) {
    if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ embeds: [MAINTENANCE], flags: MessageFlags.Ephemeral });
    } else {
        await interaction.reply({ embeds: [MAINTENANCE], flags: MessageFlags.Ephemeral });
    }
}

async function botStarting(interaction) {
    if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ embeds: [BOT_STARTING], flags: MessageFlags.Ephemeral });
    } else {
        await interaction.reply({ embeds: [BOT_STARTING], flags: MessageFlags.Ephemeral });
    }
}

module.exports = {
    notDeveloppedYet,
    maintenance,
    botStarting
};