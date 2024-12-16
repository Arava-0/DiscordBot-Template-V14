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
    console.info(`\x1b[1m\x1b[38;2;255;255;0m[${infoType}] \x1b[38;2;8;255;230m${infoMessage}\x1b[0m`);
}

module.exports = {
    showError,
    showInfo
}