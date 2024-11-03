const { REST, Routes } = require("discord.js");
const { showInfo, showError } = require("../Utils/customInformations");
const { loadFiles } = require("../Utils/fileLoader");
const { isNullOrUndefined } = require("../Utils/isNullOrUndefined");

function loadEvent(client, loadedFileEvent)
{
	let success = true;

	try {
		const execute = (...args) => loadedFileEvent.execute(client, ...args);

		if (loadedFileEvent.once)
			client.once(loadedFileEvent.name, execute);
		else
			client.on(loadedFileEvent.name, execute);

		client.loader.events.push(loadedFileEvent.name)
		if (client.debugMode)
			showInfo (
				`- EVENT       LOADED`,
				`Name: ${loadedFileEvent.name} | Type: ${loadedFileEvent.once ? "once" : "on"}`
			);
	} catch (err) {
		success = false;
		showError (
			`EVENT FAILED TO LOAD`,
			`Name: ${loadedFileEvent.name} | ${err}`,
			client.debugMode == true ? err.stack : null
		);
	}

	return (success);
}

function loadCommand(client, loadedFileCommand)
{
	let success = true;

	try {
		let cmd = loadedFileCommand.data;

		client.loader.commands.push({
			name: cmd.name,
			data: cmd,
			isOnPrivateGuild: isNullOrUndefined(loadedFileCommand.isOnPrivateGuild) ? null : loadedFileCommand.isOnPrivateGuild,
			cooldown: isNullOrUndefined(loadedFileCommand.cooldown) ? null : loadedFileCommand.cooldown,
			noDeferred: isNullOrUndefined(loadedFileCommand.noDeferred) ? false : loadedFileCommand.noDeferred,
			ephemeral: isNullOrUndefined(loadedFileCommand.ephemeral) ? false : loadedFileCommand.ephemeral,
			execute: loadedFileCommand.execute,
		})

		if (client.debugMode) {
			let debug = `Name: ${cmd.name} | Type: ${cmd.constructor.name}`;
			if (loadedFileCommand.isOnPrivateGuild)
				debug += ` | Guild: ${loadedFileCommand.isOnPrivateGuild}`;

			showInfo (`- COMMAND     LOADED`, debug);
		}
	} catch (err) {
		success = false;
		showError (
			`COMMAND FAILED TO LOAD`,
			`Name: ${loadedFileCommand.data.name} | ${err}`,
			client.debugMode == true ? err.stack : null
		);
	}

	return (success);
}

function loadItem(client, loadedFile)
{
	const type = loadedFile.type;
	let success = true;

	try {
		const pattern = new RegExp(`^${loadedFile.id.replace(/{!}/g, '([\\w@.#$!,-]+)')}$`);

		client.loader[`${type}s`].push({
			id: loadedFile.id,
			pattern: pattern,
			noDeferred: isNullOrUndefined(loadedFile.noDeferred) ? false : loadedFile.noDeferred,
			ephemeral: isNullOrUndefined(loadedFile.ephemeral) ? false : loadedFile.ephemeral,
			execute: loadedFile.execute,
		});

		if (client.debugMode)
			showInfo (
				`- ${type.toUpperCase()}${" ".repeat(12 - type.length)}LOADED`,
				`Name: ${loadedFile.id}`
			);
	} catch (err) {
		success = false;
		showError (
			`${type.toUpperCase()} FAILED TO LOAD`,
			`Name: ${loadedFile.id} | ${err}`,
			client.debugMode == true ? err.stack : null
		);
	}

	return (success);
}

async function loadEverything(client)
{
	const files = await loadFiles("./Bot", ["/Bot/Examples/"]);

	const interactionHandler = require.resolve("../interactionHandler.js");
	files.push(interactionHandler);

	files.forEach((file) => {
		if (client.debugMode)
			showInfo("DEBUG", `Loading file: ${file}`)
		const loadedFile = require(file);

		if (isNullOrUndefined(loadedFile) || isNullOrUndefined(loadedFile.type))
			return;

		switch (loadedFile.type) {
			case "event":
				loadEvent(client, loadedFile);
				break;
			case "command":
				loadCommand(client, loadedFile);
				break;
			case "button":
			case "selectMenu":
			case "modal":
				loadItem(client, loadedFile);
				break;
			default:
				showError(
					`LOADING FAILED`,
					`Provided type: ${loadedFile.type} | File: "${file}"`,
					"none"
				);
				break;
		}
	});

	showInfo(`LOADER`, `  > ${client.loader.events.length} events loaded`);
	showInfo(`LOADER`, `  > ${client.loader.buttons.length} buttons loaded`);
	showInfo(`LOADER`, `  > ${client.loader.selectMenus.length} select menus loaded`);
	showInfo(`LOADER`, `  > ${client.loader.modals.length} modals loaded`);

	let globalCommandArray = [];
	let guildsCommandArray = {};

	client.loader.commands.forEach((command) => {
		if (!command.isOnPrivateGuild)
			globalCommandArray.push(command.data.toJSON());
		else {
			if (!guildsCommandArray[command.isOnPrivateGuild])
				guildsCommandArray[command.isOnPrivateGuild] = [];
			guildsCommandArray[command.isOnPrivateGuild].push(command.data.toJSON());
		}
	});

	if (globalCommandArray.length == 0 && Object.keys(guildsCommandArray).length == 0) {
		return showInfo(
			`LOADER`,
			`  > Aucune commande n'a été chargée...`
		);
	}

	const rest = new REST().setToken(process.env.TOKEN);

	Object.keys(guildsCommandArray).forEach(async (guildID) => {
		try {
			await rest.put(
				Routes.applicationGuildCommands(client.user.id, guildID),
				{ body: guildsCommandArray[guildID] }
			);
		} catch (err) {
			showError(
				`COMMAND FAILED TO LOAD`,
				`Guild: ${guildID} | ${err}`,
				client.debugMode == true ? err.stack : null
			);
		}
	});

	await rest.put(
		Routes.applicationCommands(client.user.id),
		{ body: globalCommandArray }
	);

	showInfo(
		`LOADER`,
		`  > ${globalCommandArray.length} global commands loaded`
	);
	showInfo(
		`LOADER`,
		`  > ${Object.keys(guildsCommandArray).length} guilds commands loaded`
	);
}

module.exports = {
	loadEverything
};
