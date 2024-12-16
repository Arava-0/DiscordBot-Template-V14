const { showError } = require("../Utils/customInformations");
const path = require('path');
const fs = require('fs');

async function updateConfig(configName, newContent)
{
    let pwd = path.join(__dirname, `${configName}.json`);
    let content = newContent;

    const checkJsonContent = (content) => {
        try {
            const jsonString = (typeof content === 'string' ? content : JSON.stringify(content));

            JSON.parse(jsonString);
            return (true);
        } catch (err) {
            return (false);
        }
    }

    if (checkJsonContent(content)) {
        fs.writeFileSync(pwd, JSON.stringify(content, null, 4));
    } else {
        showError("CONFIG", `The content provided to "updateConfig(${configName}, INVALID_CONTENT)" is not a valid JSON.`, "None");
    }

    return (content);
}

module.exports = { updateConfig };