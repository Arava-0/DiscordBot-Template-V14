const { VoiceState, Client, Events } = require('discord.js')

/**
 * @file Discord event handlers for a bot using discord.js
 * @description This file contains multiple event handlers for a Discord bot.
 * Each event handler listens to a specific event and defines an `execute`
 * function that contains the logic to handle the event.
 *
 * - **name**: Specifies the event name using Events enum.
 * - **once**: Boolean value that determines if the listener should run only
 *   once (`true`) or multiple times (`false`).
 *
 * **Parameters for the `execute` function**:
 * - `client` (`Client`): Represents the bot instance, allowing access to all
 *   client methods and properties.
 * - `...args`: Represents additional arguments depending on the event type:
 *
 * The `execute` function is asynchronous (`async`) for each event to handle any
 * asynchronous logic that may be needed, such as API calls or data retrieval.
 */

module.exports = {
	name: Events.ClientReady,
	once: true,

    /**
     * @param {Client} client
     */
	async execute(client) {
	}
}

module.exports = {
	name: Events.GuildMemberAdd,
	once: false,

    /**
     * @param {Client} client
     * @param {GuildMember} member
     */
	async execute(client, member) {
	}
}

module.exports = {
    name: Events.VoiceStateUpdate,
    once: false,

    /**
     * @param {Client} client
     * @param {VoiceState} oldState
     * @param {VoiceState} newState
     */
    async execute(client, oldState, newState) {
    }
}
