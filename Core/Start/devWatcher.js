const { showInfo } = require("../Utils/customInformations");
const { reloadFile } = require("../Utils/fileLoader");

function collectFilesToWatch(client) {
    const files = new Set();

    for (const command of client?.loader?.commands)
        if (command.__file)
            files.add(command.__file);

    for (const pool of ["buttons", "selectMenus", "modals"])
        for (const item of client?.loader?.[pool])
            if (item.__file)
                files.add(item.__file);

    for (const event of client?.loader?.events)
        for (const evt of event.events)
            if (evt.__file)
                files.add(evt.__file);

    return Array.from(files);
}

function collectConfigFilePath(client) {
    return client?.config?.__file ? [client.config.__file] : [];
}

async function startDevWatcher(client) {
    if (!client.devWatcherMode) return;

    const filesToWatch = collectFilesToWatch(client);
    filesToWatch.push(...collectConfigFilePath(client));

    if (filesToWatch.length === 0)
        return showInfo("WATCHER", "Aucun fichier à surveiller. Le mode DevWatcher est désactivé.");

    const chokidar = require("chokidar");
    const watcher = chokidar.watch(filesToWatch, {
        ignoreInitial: true
    });

    watcher.on("change", async (filePath) => {
        await reloadFile(client, filePath);
    });

    showInfo("WATCHER", `Mode DevWatcher activé. Surveillance de ${filesToWatch.length} fichiers.`);
}

module.exports = {
    startDevWatcher: startDevWatcher
};
