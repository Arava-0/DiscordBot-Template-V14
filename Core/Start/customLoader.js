/*
 * This file is part of DiscordBot-Template-V14 project by Arava.
 * You are authorized to use, modify, and distribute this project under the terms of the MIT License.
 * For more information, please consult: https://github.com/Arava-0/DiscordBot-Template-V14.
 * Year: 2025
 *
 * Please never remove this comment block.
 */

const { showInfo, showError } = require("../Utils/customInformations");
const { isNullOrUndefined } = require("../Utils/isNullOrUndefined");
const { loadFiles } = require("../Utils/fileLoader");
const { REST, Routes } = require("discord.js");

function loadEvent(client, loadedFileEvent)
{
	let success = true;

	try {
		if (typeof loadedFileEvent?.execute !== "function")
			throw new Error("The event execution function is not defined or is not a function.");
		if (isNullOrUndefined(loadedFileEvent.name))
			throw new Error("The event name is not defined.");
		if (isNaN(loadedFileEvent.priority ?? 0))
			throw new Error("The event priority is not a number.");

		let findIndexExistingEvent = client.loader.events.findIndex((e) => e.name === loadedFileEvent.name);
		if (findIndexExistingEvent !== -1) {
			client.loader.events[findIndexExistingEvent].events.push({
				priority: loadedFileEvent.priority || 0,
				once: loadedFileEvent.once || false,
				execute: loadedFileEvent.execute,
				__file: loadedFileEvent.__file
			});
		} else {
			client.loader.events.push({
				name: loadedFileEvent.name,
				events: [{
					priority: loadedFileEvent.priority || 0,
					once: loadedFileEvent.once || false,
					execute: loadedFileEvent.execute,
					__file: loadedFileEvent.__file
				}]
			});
		}

		if (client.config.debugMode)
			showInfo (
				`➥  EVENT REGISTERED`,
				`Name: ${loadedFileEvent.name} | Type: ${loadedFileEvent.once ? "once" : "on"}`
			);
	} catch (err) {
		success = false;
		showError (
			`EVENT FAILED TO LOAD`,
			`Name: ${loadedFileEvent.name} | ${err}`,
			client.config.debugMode == true ? err.stack : null
		);
	}

	return (success);
}

function loadCommand(client, loadedFileCommand)
{
	let success = true;

	try {
		let cmd = loadedFileCommand.data;

		if (client.loader.commands.find(c => c.name === cmd.name)) {
			showError(
				`DUP COMMAND`,
				`Name: ${cmd.name} | Type: ${cmd.constructor.name}`,
				"none"
			);
			return false;
		}

		client.loader.commands.push({
			name: cmd.name,
			data: cmd,
			isOnPrivateGuild: isNullOrUndefined(loadedFileCommand.isOnPrivateGuild) ? null : loadedFileCommand.isOnPrivateGuild,
			userCooldown: isNullOrUndefined(loadedFileCommand.userCooldown) ? null : loadedFileCommand.userCooldown,
			serverCooldown: isNullOrUndefined(loadedFileCommand.serverCooldown) ? null : loadedFileCommand.serverCooldown,
			globalCooldown: isNullOrUndefined(loadedFileCommand.globalCooldown) ? null : loadedFileCommand.globalCooldown,
			deferReply: isNullOrUndefined(loadedFileCommand.deferReply) ? false : loadedFileCommand.deferReply,
			ephemeral: isNullOrUndefined(loadedFileCommand.ephemeral) ? false : loadedFileCommand.ephemeral,
			execute: loadedFileCommand.execute,
			autocomplete: typeof loadedFileCommand.autocomplete === "function" ? loadedFileCommand.autocomplete : null,
			__file: loadedFileCommand.__file
		})

		if (client.config.debugMode) {
			let debug = `Name: ${cmd.name} | Type: ${cmd.constructor.name}`;
			if (loadedFileCommand.isOnPrivateGuild)
				debug += ` | Guild: ${loadedFileCommand.isOnPrivateGuild}`;

			showInfo (`➥  COMMAND LOADED`, debug);
		}
	} catch (err) {
		success = false;
		showError (
			`COMMAND FAILED TO LOAD`,
			`Name: ${loadedFileCommand.data.name} | ${err}`,
			client.config.debugMode == true ? err.stack : null
		);
	}

	return (success);
}

function loadItem(client, loadedFile)
{
	const type = loadedFile.type;
	let success = true;

	if (client.loader[`${type}s`].find(i => i.id === loadedFile.id)) {
		showError(
			`DUP ${type.toUpperCase()}`,
			`ID: ${loadedFile.id}`,
			"none"
		);
		return false;
	}

	try {
		const pattern = new RegExp(`^${loadedFile.id.replace(/{!}/g, '([\\w@.#$!,-]+)')}$`);

		client.loader[`${type}s`].push({
			id: loadedFile.id,
			pattern: pattern,
			deferReply: isNullOrUndefined(loadedFile.deferReply) ? false : loadedFile.deferReply,
			deferUpdate: isNullOrUndefined(loadedFile.deferUpdate) ? false : loadedFile.deferUpdate,
			ephemeral: isNullOrUndefined(loadedFile.ephemeral) ? false : loadedFile.ephemeral,
			execute: loadedFile.execute,
			__file: loadedFile.__file
		});

		if (loadedFile.deferReply && loadedFile.deferUpdate)
			showError(
				`LOADING WARNING`,
				`Item: ${loadedFile.id} | Both 'deferReply' and 'deferUpdate' are set to true. Only one should be true.`,
				"none"
			);

		if (client.config.debugMode)
			showInfo (
				`➥  ${type.toUpperCase()} LOADED`,
				`Name: ${loadedFile.id}`
			);
	} catch (err) {
		success = false;
		showError (
			`${type.toUpperCase()} FAILED TO LOAD`,
			`Name: ${loadedFile.id} | ${err}`,
			client.config.debugMode == true ? err.stack : null
		);
	}

	return (success);
}

async function applyRegisteredEvents(client) {
    try {
        for (const registeredEvent of client.loader.events) {
			const { name: eventName, events } = registeredEvent;

			const sortedEvents = events.sort((a, b) => b.priority - a.priority);
			const onceEvents = sortedEvents.filter(event => event.once);
			const onEvents = sortedEvents.filter(event => !event.once);

			const createWrapper = (events) => async (...args) => {
				let currentPriority = null;
				let pendingPromises = [];

				if (!client.cache || !client.cache.ready)
					return;

				for (const { priority, execute } of events) {
					if (currentPriority === null || currentPriority !== priority) {
						if (pendingPromises.length > 0) {
							await Promise.all(pendingPromises);
							pendingPromises = [];
						}
						currentPriority = priority;
					}

					const promise = Promise.resolve()
						.then(() => execute(client, ...args))
						.catch((err) => {
							showError(
								`EVENT ERROR`,
								`An error occurred in an event: ${err.message}`,
								err.stack
							);
						});
					pendingPromises.push(promise);
				}

				if (pendingPromises.length > 0) {
					await Promise.all(pendingPromises);
				}
			};

			if (onceEvents.length > 0) {
				client.once(eventName, createWrapper(onceEvents));
				if (client.config.debugMode) {
					showInfo(
						`EVENTS LOADED`,
						`>> ${onceEvents.length} once event(s) applied for ${eventName}`
					);
				}
			}

			if (onEvents.length > 0) {
				client.on(eventName, createWrapper(onEvents));
				if (client.config.debugMode) {
					showInfo(
						`EVENTS LOADED`,
						`>> ${onEvents.length} on event(s) applied for ${eventName}`
					);
				}
			}
		}
    } catch (err) {
        showError(
            `Failed to apply registered events.`,
            err.message,
            client.config.debugMode ? err.stack : null
        );
    }
}

async function loadEverything(client)
{
	const files = await loadFiles("./Bot", ["/Bot/Examples/"]);

	const interactionHandler = require.resolve("../interactionHandler.js");
	files.push(interactionHandler);

	files.forEach((file) => {
		if (client.config.debugMode)
			showInfo("DEBUG", `Loading file: ${file}`)

		let loadedFile;
		try {
			loadedFile = require(file);
		} catch (err) {
			showError(
				`FILE FAILED TO LOAD`,
				`File: "${file}" | ${err}`,
				client.config.debugMode == true ? err.stack : null
			);
			return;
		}

		if (isNullOrUndefined(loadedFile) || isNullOrUndefined(loadedFile.type))
			return;

		loadedFile.__file = file;
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

	await applyRegisteredEvents(client);
	showInfo(`LOADER`, `> ${client.loader.events.reduce((c, e) => c + e.events.length, 0)} events loaded`);
	showInfo(`LOADER`, `> ${client.loader.buttons.length} buttons loaded`);
	showInfo(`LOADER`, `> ${client.loader.selectMenus.length} select menus loaded`);
	showInfo(`LOADER`, `> ${client.loader.modals.length} modals loaded`);

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
			`> Aucune commande n'a été chargée...`
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
				client.config.debugMode == true ? err.stack : null
			);
		}
	});

	await rest.put(
		Routes.applicationCommands(client.user.id),
		{ body: globalCommandArray }
	);

	showInfo(
		`LOADER`,
		`> ${globalCommandArray.length} global commands loaded`
	);
	showInfo(
		`LOADER`,
		`> ${client.loader.commands.length - globalCommandArray.length} guild commands loaded`
	);
}

module.exports = {
	loadEverything
};
