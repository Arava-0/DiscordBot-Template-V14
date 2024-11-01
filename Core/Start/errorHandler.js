const { EmbedBuilder, WebhookClient } = require('discord.js')
const { showInfo, showError } = require('../Utils/customInformations')

async function errorHandler(client)
{
    const webhookCheck = /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/;
    client.cache["errorHandler"] = {};
    client.cache["errorHandler"]["webhookState"] = true;
    client.cache["errorHandler"]["webhookInstance"] = null;

    if (client.config.webhookURL && webhookCheck.test(client.config.webhookURL)) {
        try {
            client.cache.errorHandler.webhookInstance = new WebhookClient({
                url: client.config.webhookURL
            })
        } catch (err) {
            showError(
                `WEBHOOK`, `Impossible de se connecter au webhook | ${err}`,
			    client.debugMode == true ? err.stack : null
            );
            client.cache["errorHandler"]["webhookState"] = false;
        }
    } else {
        showError(
            `WEBHOOK`,
            `Webhook non configuré ou URL invalide (https://discord.com/api/webhooks/ID/TOKEN) -> config.json`,
            client.debugMode == true ? `URL received: "${client.config.webhookURL}"` : null
        );
        client.cache["errorHandler"]["webhookState"] = false;
    }


    deployUncaughtException(client);
    deployUnhandledRejection(client);
    showInfo(`CRASH`, `   Anti-crash system actif !`);
}

function deployUncaughtException(client)
{
    process.on('uncaughtException', (error) => {
        console.error(
            `\x1b[1m\x1b[38;2;255;0;0mAnti-Crash System:\n` +
            `Uncaught Exception: ${error.message}\n` +
            `ERROR STACK:\n` +
            `----------------------------------------\n` +
            `${error.stack}\n` +
            `----------------------------------------\n` +
            `\x1b[0m`
        )
        if (client.cache["errorHandler"]["webhookState"])
            client.cache["errorHandler"]["webhookInstance"].send({
                content: `\`\`\`js\n${error.stack}\`\`\``,
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.color.error)
                        .setTitle(`Uncaught Exception`)
                        .setFooter({text: `${client.user.tag} - Created by Arava`})
                ]
            }).catch(() => {})
    })
}

function deployUnhandledRejection(client)
{
    process.on('unhandledRejection', (error) => {
        console.error(
            `\x1b[1m\x1b[38;2;255;0;0mAnti-Crash System:\n` +
            `Unhandled Rejection: ${error.message}\n` +
            `ERROR STACK:\n` +
            `----------------------------------------\n` +
            `${error.stack}\n` +
            `----------------------------------------\n` +
            `\x1b[0m`
        )
        if (client.cache["errorHandler"]["webhookState"])
            client.cache["errorHandler"]["webhookInstance"].send({
                content: `\`\`\`js\n${error.stack}\`\`\``,
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.color.error)
                        .setTitle(`Unhandled Rejection`)
                        .setFooter({text: `${client.user.tag} - Created by Arava`})
                ]
            }).catch(() => {})
    })
}

module.exports = {
    errorHandler
}