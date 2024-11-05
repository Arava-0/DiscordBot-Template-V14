const { isNullOrUndefined } = require("../Utils/isNullOrUndefined");

async function canExecute(client, interaction, command)
{
    const now = Date.now();

    if (isNullOrUndefined(client.cache["cooldowns"]))
        client.cache["cooldowns"] = {};
    if (isNullOrUndefined(client.cache["cooldowns"]["user"]))
        client.cache["cooldowns"]["user"] = new Map();
    if (isNullOrUndefined(client.cache["cooldowns"]["server"]))
        client.cache["cooldowns"]["server"] = new Map();

    if (!client.cache["cooldowns"]["user"].has(command.data.name))
        client.cache["cooldowns"]["user"].set(command.data.name, new Map());
    if (!client.cache["cooldowns"]["server"].has(command.data.name))
        client.cache["cooldowns"]["server"].set(command.data.name, null);

    const userTimestamps = client.cache["cooldowns"]["user"].get(command.data.name);
    const serverTimestamp = client.cache["cooldowns"]["server"].get(command.data.name);
    const cooldownAmount = command.userCooldown || 3000;
    const serverCooldownAmount = command.serverCooldown || 0;

    if (serverTimestamp && now < serverTimestamp) {
        const timeLeft = (serverTimestamp - now) / 1000;
        const messageContent = `Merci d'attendre ${timeLeft.toFixed(2)} seconde(s) avant de réutiliser la commande \`${command.data.name}\`.`;
        if (interaction.deferred || interaction.replied)
            await interaction.editReply({ content: messageContent, ephemeral: true });
        else
            await interaction.reply({ content: messageContent, ephemeral: true });
        return (false);
    }

    client.cache["cooldowns"]["server"].set(command.data.name, now + serverCooldownAmount);

    if (userTimestamps.has(interaction.user.id)) {
        let expirationTime = userTimestamps.get(interaction.user.id);

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

    client.cache["cooldowns"]["user"].get(command.data.name).set(interaction.user.id, now + cooldownAmount);
    return (true);
}

module.exports = {
    canExecute
}
