/*
 * This file is part of DiscordBot-Template-V14 project by Arava.
 * You are authorized to use, modify, and distribute this project under the terms of the MIT License.
 * For more information, please consult: https://github.com/Arava-0/DiscordBot-Template-V14.
 * Year: 2025
 *
 * Please never remove this comment block.
 */

// Imports des utilitaires
const customInformations = require('./Utils/customInformations');
const isDeveloper = require('./Utils/isDeveloper');
const isNullOrUndefined = require('./Utils/isNullOrUndefined');
const parseDiscordName = require('./Utils/parseDiscordName');
const math = require('./Utils/math');
const time = require('./Utils/time');
const { getClient } = require('./Utils/getClient');

// Imports des services
const presenceService = require('./Services/presenceService');
const cooldownService = require('./Services/cooldownService');
const { pushToDoWhenShutdown: onShutdown } = require('./Services/shutdownService');

// Imports des modules de démarrage
const customLoader = require('./Start/customLoader');
const errorHandler = require('./Start/errorHandler');
const initClient = require('./Start/initClient');
const shutdownHandler = require('./Start/shutdownHandler');
const devWatcher = require('./Start/devWatcher');

// Imports des modules de configuration
const jsonConfigs = require('./Config/jsonConfig');

module.exports = {
    // Exportation des utilitaires
    ...customInformations,
    ...isDeveloper,
    ...isNullOrUndefined,
    ...parseDiscordName,
    ...math,
    ...time,
    getClient,

    // Exportation des services
    ...presenceService,
    ...cooldownService,
    onShutdown,

    // Exportation des modules de démarrage
    ...customLoader,
    ...errorHandler,
    ...initClient,
    ...shutdownHandler,
    ...devWatcher,

    // Exportation des modules de configuration
    ...jsonConfigs,
};
