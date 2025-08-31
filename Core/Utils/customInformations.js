/*
 * This file is part of DiscordBot-Template-V14 project by Arava.
 * You are authorized to use, modify, and distribute this project under the terms of the MIT License.
 * For more information, please consult: https://github.com/Arava-0/DiscordBot-Template-V14.
 * Year: 2025
 *
 * Please never remove this comment block.
 */

function showError(errorType, errorMessage, errorStack)
{
    console.error(`\x1b[1m\x1b[38;2;255;0;0m[${errorType}] ${errorMessage}\x1b[0m`);
    console.error(
        `\x1b[1m\x1b[38;2;255;0;0m[DETAILS]` +
        ` ${errorStack == null ?
            `Active debug mode to see the stack.\x1b[0m` :
            `${(typeof errorStack != "string" || errorStack.toLowerCase() == "none") ?
                `No stack available.\x1b[0m` :
                `\x1b[0m${errorStack}`
            }`
        }`
    );
}

function showInfo(infoType, infoMessage)
{
    const repeatCount = (8 - (infoType?.length || 0)) < 0 ? 0 : (8 - (infoType?.length || 0));
    const padding = " ".repeat(repeatCount);

    console.info(`\x1b[1m\x1b[38;2;255;255;0m[${infoType}]${padding} \x1b[38;2;8;255;230m${infoMessage}\x1b[0m`);
}

module.exports = {
    showError,
    showInfo
}