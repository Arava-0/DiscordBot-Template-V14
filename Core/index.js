// Imports des utilitaires
const customInformations = require('./Utils/customInformations');
const isDeveloper = require('./Utils/isDeveloper');
const isNullOrUndefined = require('./Utils/isNullOrUndefined');
const math = require('./Utils/math');
const time = require('./Utils/time');

// Imports des services
const presenceService = require('./Services/presenceService');
const shutdownService = require('./Services/shutdownService');

// Imports des modules de démarrage
const customLoader = require('./Start/customLoader');
const errorHandler = require('./Start/errorHandler');
const initClient = require('./Start/initClient');
const shutdownHandler = require('./Start/shutdownHandler');

// Imports des modules de configuration
const createConfig = require('./Config/createConfig');
const updateConfig = require('./Config/updateConfig');

module.exports = {
    // Exportation des utilitaires
    ...customInformations,
    ...isDeveloper,
    ...isNullOrUndefined,
    ...math,
    ...time,

    // Exportation des services
    ...presenceService,
    ...shutdownService,

    // Exportation des modules de démarrage
    ...customLoader,
    ...errorHandler,
    ...initClient,
    ...shutdownHandler,

    // Exportation des modules de configuration
    ...createConfig,
    ...updateConfig,
};
