const { REST, Routes } = require("discord.js");
const { showInfo, showError } = require("../Utils/customInformations");
const { loadFiles } = require("../Utils/fileLoader");
const { isNullOrUndefined } = require("../Utils/isNullOrUndefined");

function loadEvent(client, loadedFileEvent)
{
	let success = true;
	let eventPriority;
	let eventExecute;
	let eventOnce;

	let eventName = loadedFileEvent.name || "unknown";

	try {
		eventExecute = (...args) => loadedFileEvent.execute(client, ...args);
		eventPriority = loadedFileEvent.priority || 0;
		eventOnce = loadedFileEvent.once || false;

		if (isNullOrUndefined(eventExecute) || typeof eventExecute !== "function")
			throw new Error("The event execution function is not defined or is not a function.");
		if (isNullOrUndefined(eventName) || eventName === "unknown")
			throw new Error("The event name is not defined.");
		if (isNullOrUndefined(eventPriority) || isNaN(eventPriority))
			throw new Error("The event priority is not a number.");

		let findIndexExistingEvent = client.loader.events.findIndex((e) => e.name === eventName);
		if (findIndexExistingEvent !== -1) {
			client.loader.events[findIndexExistingEvent].events.push({
				priority: eventPriority,
				once: eventOnce,
				execute: [eventExecute]
			});
		} else {
			client.loader.events.push({
				name: eventName,
				events: [{
					priority: eventPriority,
					once: eventOnce,
					execute: [eventExecute]
				}]
			});
		}

		if (client.debugMode)
			showInfo (
				`- EVENT   REGISTERED`,
				`Name: ${eventName} | Type: ${eventOnce ? "once" : "on"}`
			);
	} catch (err) {
		success = false;
		showError (
			`EVENT FAILED TO LOAD`,
			`Name: ${eventName} | ${err}`,
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
			userCooldown: isNullOrUndefined(loadedFileCommand.userCooldown) ? null : loadedFileCommand.userCooldown,
			serverCooldown: isNullOrUndefined(loadedFileCommand.serverCooldown) ? null : loadedFileCommand.serverCooldown,
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

				for (const { priority, execute } of events) {
					if (currentPriority === null || currentPriority !== priority) {
						if (pendingPromises.length > 0) {
							await Promise.all(pendingPromises);
							pendingPromises = [];
						}
						currentPriority = priority;
					}

					for (const handler of execute) {
						const promise = Promise.resolve()
							.then(() => handler(...args))
							.catch((err) => {
								showError(
									`EVENT ERROR`,
									`An error occurred in an event: ${err.message}`,
									err.stack
								);
							});
						pendingPromises.push(promise);
					}
				}

				if (pendingPromises.length > 0) {
					await Promise.all(pendingPromises);
				}
			};

			if (onceEvents.length > 0) {
				client.once(eventName, createWrapper(onceEvents));
				if (client.debugMode) {
					showInfo(
						`EVENTS LOADED`,
						`  >> ${onceEvents.length} once event(s) applied for ${eventName}`
					);
				}
			}

			if (onEvents.length > 0) {
				client.on(eventName, createWrapper(onEvents));
				if (client.debugMode) {
					showInfo(
						`EVENTS LOADED`,
						`  >> ${onEvents.length} on event(s) applied for ${eventName}`
					);
				}
			}
		}
    } catch (err) {
        showError(
            `Failed to apply registered events.`,
            err.message,
            client.debugMode ? err.stack : null
        );
    }
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

	await applyRegisteredEvents(client);
	showInfo(`LOADER`, `  > ${client.loader.events.reduce((c, e) => c + e.events.length, 0)} events loaded`);
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
		`  > ${client.loader.commands.length - globalCommandArray.length} guild commands loaded`
	);
}

module.exports = {
	loadEverything
};
