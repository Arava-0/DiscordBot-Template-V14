/*
 * This file is part of DiscordBot-Template-V14 project by Arava.
 * You are authorized to use, modify, and distribute this project under the terms of the MIT License.
 * For more information, please consult: https://github.com/Arava-0/DiscordBot-Template-V14.
 * Year: 2025
 *
 * Please never remove this comment block.
 */

const { randomBytes } = require('crypto');

function getRandomInt(min, max) {
    return (Math.floor(Math.random() * (max - min) + min));
}

async function isNumber(data) {
    for (let i = 0; i < data.length; i++) {
        if (
            data[i] !== "0" &&
            data[i] !== "1" &&
            data[i] !== "2" &&
            data[i] !== "3" &&
            data[i] !== "4" &&
            data[i] !== "5" &&
            data[i] !== "6" &&
            data[i] !== "7" &&
            data[i] !== "8" &&
            data[i] !== "9"
        ) return (false);
    }
    return (true);
}

/**
 * Generates a short UUID in the form of 'xxxx-xxxx-xxxx-xxxx'
 * Total possibilities: 2^64 = 18.4 quintillion
 * @returns {Promise<String>} A short UUID in the form of 'xxxx-xxxx-xxxx-xxxx'
 */
async function shortUUID() {
    const hex = randomBytes(8).toString('hex');
    return hex.match(/.{1,4}/g).join('-');
}

/**
 * Generates a long UUID in the form of 'xxxxxx-xxxxxx-xxxxxx-xxxxxx'
 * Total possibilities: 2^128 = 340 undecillion
 * @returns {Promise<String>} A long UUID in the form of 'xxxxxx-xxxxxx-xxxxxx-xxxxxx'
 */
async function longUUID() {
    const hex = randomBytes(16).toString('hex');
    return hex.match(/.{1,6}/g).join('-');
}

module.exports = {
    getRandomInt, isNumber, shortUUID, longUUID
}
