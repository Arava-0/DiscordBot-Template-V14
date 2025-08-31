/*
 * This file is part of DiscordBot-Template-V14 project by Arava.
 * You are authorized to use, modify, and distribute this project under the terms of the MIT License.
 * For more information, please consult: https://github.com/Arava-0/DiscordBot-Template-V14.
 * Year: 2025
 *
 * Please never remove this comment block.
 */

const { Colors, MessageFlags, ContainerBuilder, SeparatorSpacingSize } = require("discord.js");

const NOT_DEVELOPPED_YET = new ContainerBuilder()
    .setAccentColor(Colors.Orange)
    .addTextDisplayComponents(
        textDisplay => textDisplay
            .setContent("Cette fonctionnalité n'est pas encore développée.")
    )

const MAINTENANCE = new ContainerBuilder()
    .setAccentColor(Colors.Orange)
    .addTextDisplayComponents(
        textDisplay => textDisplay
            .setContent("**Une maintenance est en cours.**")
    )
    .addSeparatorComponents(
        separator => separator
            .setSpacing(SeparatorSpacingSize.Small)
            .setDivider(true)
    )
    .addTextDisplayComponents(
        textDisplay => textDisplay
            .setContent("-# *Merci de patienter...*")
    )

const BOT_STARTING = new ContainerBuilder()
    .setAccentColor(Colors.Orange)
    .addTextDisplayComponents(
        textDisplay => textDisplay
            .setContent("**Démarrage du bot en cours.**")
    )
    .addSeparatorComponents(
        separator => separator
            .setSpacing(SeparatorSpacingSize.Small)
            .setDivider(true)
    )
    .addTextDisplayComponents(
        textDisplay => textDisplay
            .setContent("-# *Merci de patienter...*")
    )

async function notDeveloppedYet(interaction) {
    if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ components: [NOT_DEVELOPPED_YET], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
    } else {
        await interaction.reply({ components: [NOT_DEVELOPPED_YET], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
    }
}

async function maintenance(interaction) {
    if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ components: [MAINTENANCE], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
    } else {
        await interaction.reply({ components: [MAINTENANCE], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
    }
}

async function botStarting(interaction) {
    if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ components: [BOT_STARTING], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
    } else {
        await interaction.reply({ components: [BOT_STARTING], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
    }
}

module.exports = {
    notDeveloppedYet,
    maintenance,
    botStarting
};