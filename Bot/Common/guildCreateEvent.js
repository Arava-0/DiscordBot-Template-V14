const { Events, Client, Guild } = require("discord.js");
const { showInfo } = require("../../Core/Utils/customInformations");

module.exports = {
    name : Events.GuildCreate,
    type: "event",
    once: false,

    /**
     * @param {Client} client
     * @param {Guild} event
     */
    async execute(client, event) {
        showInfo("GUILDS", `${client.user.username} has joined the guild ${event.name} (${event.id})`);
    }
}
