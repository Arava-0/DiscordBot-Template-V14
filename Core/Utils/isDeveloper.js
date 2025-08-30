/*
 * This file is part of DiscordBot-Template-V14 project by Arava.
 * You are authorized to use, modify, and distribute this project under the terms of the MIT License.
 * For more information, please consult: https://github.com/Arava-0/DiscordBot-Template-V14.
 * Year: 2025
 *
 * Please never remove this comment block.
 */

const { isNullOrUndefined } = require("./isNullOrUndefined");

async function isDeveloper(client, userID)
{
    if (isNullOrUndefined(client.config)) return (false);
    if (isNullOrUndefined(client.config.devID)) return (false);
    if (!Array.isArray(client.config.devID)) return (false);
    return (client.config.devID.includes(userID));
}

module.exports = { isDeveloper };