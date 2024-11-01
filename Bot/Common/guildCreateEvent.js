const { Events } = require("discord.js");
const { showInfo } = require("../../Core/Utils/customInformations");

module.exports = {
    name : Events.GuildCreate,
    type: "event",
    once: false,

    async execute(event, client) {
        showInfo("GUILDS", `${client.user.username} has joined the guild ${event.name} (${event.id})`);
    }
}
