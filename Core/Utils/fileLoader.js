/*
 * This file is part of DiscordBot-Template-V14 project by Arava.
 * You are authorized to use, modify, and distribute this project under the terms of the MIT License.
 * For more information, please consult: https://github.com/Arava-0/DiscordBot-Template-V14.
 * Year: 2025
 *
 * Please never remove this comment block.
 */

const { showError, showInfo } = require("./customInformations");
const { glob } = require("glob");
const path = require("path");

async function deleteCachedFile(file)
{
	const filePath = path.resolve(file)
	if (require.cache[filePath]){
		delete require.cache[filePath];
	}
}

async function loadFiles(dirName, excludeDirs = []) {
	try {
		const files = await glob(path.join(process.cwd(), dirName, "**/*.js").replace(/\\/g, "/"));
		let jsfiles = files.filter((file) => path.extname(file) === ".js");
		await Promise.all(jsfiles.map(deleteCachedFile));

		// Linux compatibility: exclude directories
		jsfiles = jsfiles.filter((file) => !excludeDirs.some((dir) => file.includes(dir)));

		// Windows compatibility: replace backslashes with forward slashes
		jsfiles = jsfiles.filter((file) => !excludeDirs.some((dir) => file.replace(/\\/g, "/").includes(dir)));

		return (jsfiles);
	} catch (err) {
		console.error(`Error while loading files from directory ${dirName}: ${err}`);
		throw err;
	}
}

async function finder(client, resolvedPath) {
	let target;

	for (const command of client?.loader?.commands)
		if (command.__file === resolvedPath)
			target = { type: "command", ref: command, name: command?.name };

	for (const pool of ["buttons", "selectMenus", "modals"])
		for (const item of client?.loader?.[pool])
			if (item.__file === resolvedPath)
				target = { type: pool.slice(0, -1), ref: item, name: item?.id };

	for (const event of client?.loader?.events)
		for (const evt of event.events)
			if (evt.__file === resolvedPath)
				target = { type: "event", ref: evt, name: event?.name };

	if (resolvedPath === client?.config?.__file)
		target = { type: "config", ref: client.config, name: "config.json" };

	return (target);
}

async function reloadFile(client, filePath) {
	try {
		const resolvedPath = path.resolve(filePath);
		const target = await finder(client, resolvedPath);

		if (!target) return;

		await deleteCachedFile(resolvedPath);
		const reloadedFile = require(resolvedPath);

		if (target.type === "config") {
			if (typeof reloadedFile !== "object")
				return showError("RELOADER", `Le fichier ${filePath} n'a pas pu être rechargé.`, "none");
			client.config = { ...client.config, ...reloadedFile, __file: resolvedPath };
			return showInfo("RELOADER", `Le fichier ${target.name} (${target.type}) a été rechargé avec succès.`);
		}

		if (!reloadedFile || typeof reloadedFile !== "object")
			return showError("RELOADER", `Le fichier ${filePath} n'a pas pu être rechargé.`, "none");
		if (!reloadedFile.execute || typeof reloadedFile.execute !== "function")
			return showError("RELOADER", `Le fichier ${filePath} n'a pas pu être rechargé. (execute missing)`, "none");

		if (target.type === "command") {
			target.ref.userCooldown = reloadedFile.userCooldown ?? null;
			target.ref.serverCooldown = reloadedFile.serverCooldown ?? null;
			target.ref.globalCooldown = reloadedFile.globalCooldown ?? null;
			target.ref.deferReply = reloadedFile.deferReply ?? true;
			target.ref.ephemeral = reloadedFile.ephemeral ?? true;
			target.ref.execute = reloadedFile.execute;
			target.ref.autocomplete = reloadedFile.autocomplete ?? null;
		}

		else if (["button", "selectMenu", "modal"].includes(target.type)) {
			target.ref.deferReply = reloadedFile.deferReply ?? false;
			target.ref.deferUpdate = reloadedFile.deferUpdate ?? false;
			target.ref.ephemeral = reloadedFile.ephemeral ?? true;
			target.ref.execute = reloadedFile.execute;
		}

		else if (target.type === "event") {
			target.ref.priority = reloadedFile.priority ?? 0;
			target.ref.execute = reloadedFile.execute;
		}

		showInfo("RELOADER", `Le fichier ${target.name} (${target.type}) a été rechargé avec succès.`);
	} catch (err) {
		showError(
			"RELOADER",
			`Une erreur est survenue lors du rechargement du fichier: ${filePath}`,
			client.config.debugMode ? err.stack : null
		)
	}
}

module.exports = { loadFiles, reloadFile };
