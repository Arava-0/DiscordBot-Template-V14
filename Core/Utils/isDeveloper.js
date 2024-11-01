const { isNullOrUndefined } = require("./isNullOrUndefined");

async function isDeveloper(client, userID)
{
    if (isNullOrUndefined(client.config)) return (false);
    if (isNullOrUndefined(client.config.devID)) return (false);
    if (!Array.isArray(client.config.devID)) return (false);
    return (client.config.devID.includes(userID));
}

module.exports = { isDeveloper };