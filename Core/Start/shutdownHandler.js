const readline = require('readline');
const { sleep } = require('../Utils/time');
const { shutdownService } = require('../Services/shutdownService');
const { showInfo } = require('../Utils/customInformations');

async function shutdownHandler(client)
{
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('SIGINT', () => {
        process.emit('SIGINT');
    });

    process.on('SIGINT', async () => {
        console.log("\x1b[1m\x1b[38;2;255;0;0mSIGINT signal received...\x1b[0m")
        if (client.stopped) return;

        client.stopped = true;
        await shutdownService(client, "By SIGINT");
        await sleep(500)
        rl.close();
        process.exit(0);
    });

    process.on('message', async (msg) => {
        console.log(`\x1b[1m\x1b[38;2;255;0;0mProcess message received: ${msg}\x1b[0m`)
        if (msg === 'shutdown') {
            if (client.stopped) return;

            client.stopped = true;
            await shutdownService(client, "By PROCESS MESSAGE: 'shutdown'");
            await sleep(500);
            rl.close();
            process.exit(0);
        }
    });

    showInfo("SHUTDOWN", "Shutdown handler actif !");
}

module.exports = {
    shutdownHandler
}