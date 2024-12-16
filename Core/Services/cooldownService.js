const { isNullOrUndefined } = require("../Utils/isNullOrUndefined");

async function answerCooldownActive(interaction, lastUsed, remaining, type)
{
    const remainingSeconds = (remaining / 1000).toFixed(2);
    let msg = `**Patientez ${remainingSeconds} secondes** avant d'utiliser cette commande.\n\n`;

    switch (type) {
        case 1:
            msg += `-# > **Type de cooldown**: Global\n`
            msg += `-# > *Le cooldown global affecte tous les utilisateurs sans exception.*`;
            break;
        case 2:
            msg += `-# > Type de cooldown**: Serveur\n`
            msg += `-# > *Dans ce serveur, la commande est temporairement verrouillée pour tout le monde.*`;
            break;
        case 3:
            msg += `-# > Type de cooldown**: Utilisateur\n`
            msg += `-# > *Seul votre compte est concerné par ce délai.*`;
            break;
        default:
            msg += `-# > Type de cooldown**: Inconnu\n`
            msg += `-# > *Un délai de sécurité est actif.*`;
            break;
    }

    if (interaction.deferred || interaction.replied)
        await interaction.editReply({ content: messageContent, ephemeral: true });
    else
        await interaction.reply({ content: messageContent, ephemeral: true });
}

async function canExecute(client, interaction, command)
{
    const userId = interaction.user.id;
    const serverId = interaction.guild?.id;
    const commandName = command.data?.name || "unknown";

    const globalCooldown = command.globalCooldown || 0;
    const serverCooldown = command.serverCooldown || 0;
    const userCooldown   = command.userCooldown   || 0;

    if (isNullOrUndefined(client.cache["cooldowns"]))
        client.cache["cooldowns"] = {};
    if (isNullOrUndefined(client.cache["cooldowns"][commandName]))
        client.cache["cooldowns"][commandName] = {
            global: 0,
            server: {},
            user: {}
        };

    const now = Date.now();
    const cooldownData = client.cache["cooldowns"][commandName];

    // --- GLOBAL cooldown ---
    if (globalCooldown > 0) {
        const globalExpiresAt = cooldownData.global;
        if (globalExpiresAt && now < globalExpiresAt) {
            await answerCooldownActive(interaction, globalExpiresAt - globalCooldown, globalExpiresAt - now, 1)
            return (false);
        }
    }

    // --- SERVER cooldown ---
    if (serverCooldown > 0 && serverId) {
        const serverExpiresAt = cooldownData.server[serverId] || 0;
        if (now < serverExpiresAt) {
            await answerCooldownActive(interaction, serverExpiresAt - serverCooldown, serverExpiresAt - now, 2)
            return (false);
        }
    }

    // --- USER cooldown ---
    if (userCooldown > 0) {
        const userExpiresAt = cooldownData.user[userId] || 0;
        if (now < userExpiresAt) {
            await answerCooldownActive(interaction, userExpiresAt - userCooldown, userExpiresAt - now, 3)
            return (false);
        }
    }

    if (globalCooldown > 0)
        cooldownData.global = now + globalCooldown;

    if (serverCooldown > 0 && serverId)
        cooldownData.server[serverId] = now + serverCooldown;

    if (userCooldown > 0)
        cooldownData.user[userId] = now + userCooldown;

    return (true);
}

async function cooldownService(client)
{
    cron.schedule('0,30 * * * * *', () => {
        if (isNullOrUndefined(client.cache["cooldowns"]))
            return;

        const now = Date.now();

        for (const commandName of Object.keys(client.cache["cooldowns"])) {
            const cooldownData = client.cache["cooldowns"][commandName];

            if (cooldownData.global && cooldownData.global < now) {
                cooldownData.global = 0;
            }

            for (const serverId of Object.keys(cooldownData.server || {})) {
                const expiresAt = cooldownData.server[serverId];
                if (expiresAt < now) {
                    delete cooldownData.server[serverId];
                }
            }

            for (const userId of Object.keys(cooldownData.user || {})) {
                const expiresAt = cooldownData.user[userId];
                if (expiresAt < now) {
                    delete cooldownData.user[userId];
                }
            }
        }
    });
}

module.exports = {
    canExecute,
    cooldownService
}
