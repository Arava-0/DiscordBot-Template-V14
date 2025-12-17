/*
 * This file is part of DiscordBot-Template-V14 project by Arava.
 * You are authorized to use, modify, and distribute this project under the terms of the MIT License.
 * For more information, please consult: https://github.com/Arava-0/DiscordBot-Template-V14.
 * Year: 2025
 *
 * Please never remove this comment block.
 */

const secondes = function(seconde) {
    return (parseInt(seconde * 1000));
}

const minutes = function(minute) {
    return (parseInt(minute * secondes(60)));
}

const hours = function(hour) {
    return (parseInt(hour * minutes(60)));
}

async function sleep(ms) {
    return (new Promise(resolve => setTimeout(resolve, ms)));
}

async function isValidDate(year, month, day) {
    const errorList = [];
    const date = new Date(year, month - 1, day);

    if (month < 1 || month > 12) {
        errorList.push("Le mois doit être compris entre 1 et 12.");
        return errorList;
    }

    if (date.getDate() != day)
        errorList.push(`Le jour doit être compris entre 1 et ${new Date(year, month, 0).getDate()}.`);

    return (errorList);
}

async function formatTime(minutes) {
    const days = Math.floor(minutes / 1440); // 1440 minutes in a day
    const hours = Math.floor((minutes % 1440) / 60); // 60 minutes in an hour
    const mins = minutes % 60;

    return (`${days}j ${hours}h ${mins}m`);
}

module.exports = {
    secondes,
    minutes,
    hours,
    sleep,
    isValidDate,
    formatTime
}