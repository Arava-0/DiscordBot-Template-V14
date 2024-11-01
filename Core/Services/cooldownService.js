const { isNullOrUndefined } = require("../Utils/isNullOrUndefined");

async function canExecute(client, interaction, command)
{
    if (isNullOrUndefined(client.cooldowns))
        client.cooldowns = new Map();

    if (!client.cooldowns.has(command.data.name))
        client.cooldowns.set(command.data.name, new Map());

    const now = Date.now();
    const timestamps = client.cooldowns.get(command.data.name);
    const cooldownAmount = command.cooldown || 3000;

    if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            const messageContent = `Merci d'attendre ${timeLeft.toFixed(2)} seconde(s) avant de réutiliser la commande \`${command.data.name}\`.`;
            if (interaction.deferred || interaction.replied)
                await interaction.editReply({ content: messageContent, ephemeral: true });
            else
                await interaction.reply({ content: messageContent, ephemeral: true });
            return (false);
        }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)
    return (true);
}

module.exports = {
    canExecute
}
