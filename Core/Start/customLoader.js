const { REST, Routes } = require("discord.js");
const { showInfo, showError } = require("../Utils/customInformations");
const { loadFiles } = require("../Utils/fileLoader");
const { isNullOrUndefined } = require("../Utils/isNullOrUndefined");

function loadEvent(client, loadedFileEvent)
{
	let success = true;

	try {
		const execute = (...args) => loadedFileEvent.execute(...args, client);

		if (loadedFileEvent.once)
			client.once(loadedFileEvent.name, execute);
		else
			client.on(loadedFileEvent.name, execute);

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
		client.commands.set(loadedFileCommand.data.name, loadedFileCommand);

		if (loadedFileCommand.isOnPrivateGuild) {
			showInfo (
				`- COMMAND     LOADED`,
				`Name: ${loadedFileCommand.data.name} | Type: ${loadedFileCommand.data.constructor.name} | Guild: ${loadedFileCommand.isOnPrivateGuild}`
			);
		} else {
			showInfo (
				`- COMMAND     LOADED`,
				`Name: ${loadedFileCommand.data.name} | Type: ${loadedFileCommand.data.constructor.name}`
			);
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

function loadButtons(client, loadedFileButton)
{
	let success = true;

	try {
		client.buttons.set(loadedFileButton.id, loadedFileButton);

		showInfo (
			`- BUTTON      LOADED`,
			`Name: ${loadedFileButton.id}`
		);
	} catch (err) {
		success = false;
		showError (
			`BUTTON FAILED TO LOAD`,
			`Name: ${loadedFileButton.id} | ${err}`,
			client.debugMode == true ? err.stack : null
		);
	}

	return (success);
}

function loadSelectMenus(client, loadedFileSelectMenu)
{
	let success = true;

	try {
		client.selectMenus.set(loadedFileSelectMenu.id, loadedFileSelectMenu);

		showInfo (
			`- SELECT MENU LOADED`,
			`Name: ${loadedFileSelectMenu.id}`
		);
	} catch (err) {
		success = false;
		showError (
			`SELECT MENU FAILED TO LOAD`,
			`Name: ${loadedFileSelectMenu.id} | ${err}`,
			client.debugMode == true ? err.stack : null
		);
	}

	return (success);
}

function loadModals(client, loadedFileModal)
{
	let success = true;

	try {
		client.modals.set(loadedFileModal.id, loadedFileModal);

		showInfo (
			`- MODAL       LOADED`,
			`Name: ${loadedFileModal.id}`
		);
	} catch (err) {
		success = false;
		showError (
			`MODAL FAILED TO LOAD`,
			`Name: ${loadedFileModal.id} | ${err}`,
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
				loadButtons(client, loadedFile);
				break;
			case "selectMenu":
				loadSelectMenus(client, loadedFile);
				break;
			case "modal":
				loadModals(client, loadedFile);
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

	let globalCommandArray = [];
	let guildsCommandArray = {};

	client.commands.forEach((command) => {
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
			`  Aucune commande n'a été chargée...`
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
}

module.exports = {
	loadEverything
};
