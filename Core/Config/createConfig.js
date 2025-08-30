/*
 * This file is part of DiscordBot-Template-V14 project by Arava.
 * You are authorized to use, modify, and distribute this project under the terms of the MIT License.
 * For more information, please consult: https://github.com/Arava-0/DiscordBot-Template-V14.
 * Year: 2025
 *
 * Please never remove this comment block.
 */

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