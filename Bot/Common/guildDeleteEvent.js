const { Events } = require("discord.js");
const { showInfo } = require("../../Core/Utils/customInformations");

module.exports = {
    name : Events.GuildDelete,
    type: "event",
    once: false,

    async execute(event, client) {
        showInfo("GUILDS", `${client.user.username} is no longer in the guild ${event.name} (${event.id})`);
    }
}
