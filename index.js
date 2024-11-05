const Core = require('./Core');

const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { User, Message, GuildMember, ThreadMember, Channel, Reaction } = Partials;

/**
 * Initialisation du client Discord.js avec tous les intents et partials.
 *
 * Ce code configure le client Discord.js en activant tous les intents et en
 * spécifiant tous les partials. Les intents et partials déterminent les
 * événements auxquels le bot peut accéder et les données partielles qu'il
 * peut traiter.
 *
 * @details
 * - `intents: Object.values(GatewayIntentBits)`: Cette option active tous les
 *    intents disponibles, permettant au bot de recevoir tous les types
 *    d'événements. Cependant, **il est préférable de n'activer que les intents
 *    nécessaires** pour les fonctionnalités du bot. Cela améliore la
 *    performance et réduit les risques liés à la sécurité.
 * - `partials: [User, Message, GuildMember, ThreadMember, Channel, Reaction]`:
 *    Spécifie les types de données partielles que le bot doit gérer. Les
 *    partials permettent de recevoir des objets incomplets pour des entités
 *    comme `Message` ou `GuildMember`, utiles si l'objet complet n'est pas
 *    encore chargé.
 *
 * ⚠️ **Attention** : Activer tous les intents, surtout `GuildMembers` et
 * `MessageContent`, peut nécessiter une vérification supplémentaire de
 * Discord si le bot est dans plus de 100 serveurs. Il est donc conseillé
 * d'activer uniquement les intents et partials nécessaires pour éviter une
 * charge inutile sur le bot, consultez la liste des intents sur le site:
 * https://discord-api-types.dev/api/discord-api-types-v10/enum/GatewayIntentBits.
 */
const client = new Client({
    intents: Object.values(GatewayIntentBits),
    partials: [User, Message, GuildMember, ThreadMember, Channel, Reaction]
});

require('dotenv').config();

client.login(process.env.TOKEN).then(async () => {
    Core.showInfo("LOGIN", "   Connexion à l'API Discord réussie | Pseudo: " + client.user.tag);
    await Core.shutdownHandler(client);
    await Core.initClient(client);
    await Core.errorHandler(client);
    await Core.loadEverything(client);
    await Core.launchPresenceService(client);
    Core.showInfo("READY", "   Bot prêt à l'emploi ! | Pseudo: " + client.user.tag);
    Core.ready(client);
})

module.exports = {
    client
}