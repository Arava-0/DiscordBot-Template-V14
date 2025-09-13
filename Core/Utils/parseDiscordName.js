/*
 * This file is part of DiscordBot-Template-V14 project by Arava.
 * You are authorized to use, modify, and distribute this project under the terms of the MIT License.
 * For more information, please consult: https://github.com/Arava-0/DiscordBot-Template-V14.
 * Year: 2025
 *
 * Please never remove this comment block.
 */

const { isNullOrUndefined } = require("./isNullOrUndefined");

/**
 * This function will transform all _, *, ... in \_, \* ...
 *
 * @param {String} pseudo
 * @returns {String}
 */
function serializeName(pseudo)
{
    if (isNullOrUndefined(pseudo))
        return ("");

    return (pseudo.replace(/([_*~`>])/g, "\\$1"));
}

module.exports = { serializeName };
