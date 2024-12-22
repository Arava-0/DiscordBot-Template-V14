const { Events, Client, Guild } = require("discord.js");
const { showInfo } = require("../../Core/Utils/customInformations");

module.exports = {
    name : Events.GuildDelete,
    type: "event",
    once: false,

    /**
     * @param {Client} client
     * @param {Guild} event
     */
    async execute(client, event) {
        showInfo("GUILDS", `${client.user.username} is no longer in the guild ${event.name} (${event.id}) (0)`);
    }
}
