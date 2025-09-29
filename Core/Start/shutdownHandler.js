/*
 * This file is part of DiscordBot-Template-V14 project by Arava.
 * You are authorized to use, modify, and distribute this project under the terms of the MIT License.
 * For more information, please consult: https://github.com/Arava-0/DiscordBot-Template-V14.
 * Year: 2025
 *
 * Please never remove this comment block.
 */

const readline = require('readline');
const { sleep } = require('../Utils/time');
const { shutdownService } = require('../Services/shutdownService');
const { showInfo } = require('../Utils/customInformations');

async function shutdownHandler(client)
{
    const isTTY = Boolean(process.stdin.isTTY && process.stdout.isTTY);
    const rl = isTTY
        ? readline.createInterface({ input: process.stdin, output: process.stdout })
        : null;

    if (rl) {
        rl.on('SIGINT', () => {
            process.emit('SIGINT');
        });
    }

    ['SIGTERM', 'SIGINT', 'SIGHUP'].forEach(sig => {
        process.on(sig, async () => {
            console.log(`\x1b[1m\x1b[38;2;255;0;0m${sig} signal received...\x1b[0m`)
            if (client.stopped) return;

            client.stopped = true;
            await shutdownService(client, `By ${sig}`);
            await sleep(500);
            if (rl) rl.close();
            process.exit(0);
        })
    });

    process.on('message', async (msg) => {
        console.log(`\x1b[1m\x1b[38;2;255;0;0mProcess message received: ${msg}\x1b[0m`)
        if (msg === 'shutdown') {
            if (client.stopped) return;

            client.stopped = true;
            await shutdownService(client, "By PROCESS MESSAGE: 'shutdown'");
            await sleep(500);
            if (rl) rl.close();
            process.exit(0);
        }
    });

    showInfo("SHUTDOWN", "Shutdown handler actif !");
}

module.exports = {
    shutdownHandler
}
