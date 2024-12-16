const fs = require('fs');
const path = require('path');
const { showError } = require('../Utils/customInformations');

async function createConfigFile(name)
{
    let pwd = path.join(__dirname, `${name}.json`);
    let content = {};

    if (!fs.existsSync(pwd)) {
        fs.writeFileSync(pwd, JSON.stringify(content, null, 4));
    } else {
        showError("CONFIG", `The file ${name}.json already exists.`, "None");
    }

    return (content);
}

async function getConfigFile(name)
{
    let pwd = path.join(__dirname, `${name}.json`);
    let content = {};

    if (fs.existsSync(pwd)) {
        try {
            content = JSON.parse(fs.readFileSync(pwd));
        } catch (err) {
            showError("CONFIG", `The file ${name}.json is not a valid JSON (calling to getConfigFile(${name}))`, err);
        }
    } else {
        content = await createConfigFile(name);
    }

    return (content);
}

module.exports = { createConfigFile, getConfigFile };