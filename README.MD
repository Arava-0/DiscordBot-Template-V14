# Guide d'Utilisation : Template Bot Discord.js v14

Cette template est un point de départ structuré pour développer un bot Discord avec **Discord.js v14**. Elle offre des modules bien pensés pour gérer les commandes slash, les commandes contextuelles, les interactions (boutons, menus déroulants, modaux) et les événements. Voici une explication approfondie des fonctionnalités!

---

## Fonctionnalités détaillées

### **1. Commandes contextuelles**
Les commandes contextuelles permettent de déclencher des actions via le menu contextuel d’un message ou d’un utilisateur dans Discord.

#### Fonctionnement :
- **Définition de la commande** :
  - Les commandes sont configurées avec un `ContextMenuCommandBuilder`.
  - Exemple : une commande nommée `example` sera visible lorsqu’on effectue un clic droit sur un message.

- **Propriétés importantes** :
  - **`isOnPrivateGuild`** :
    - Si cette propriété est définie avec un ID de serveur, la commande sera **restreinte à ce serveur**.
    - Si elle n’est pas définie, la commande sera enregistrée globalement (visible sur tous les serveurs où le bot est présent).
  - **`noDeferred`** :
    - Si `false` ou non spécifié, la réponse est différée. Cela signifie que Discord accorde plus de temps pour répondre, mais vous devez utiliser une méthode comme `editReply()` pour envoyer une réponse.
    - Si `true`, la réponse est immédiate et doit être envoyée avec `.reply()`.
  - **`ephemeral`** :
    - Si activé, la réponse est visible uniquement par l’utilisateur qui a exécuté la commande.
    - Ne fonctionne que dans le cas ou `noDeferred` n'est pas activé ou sur `false`.

- **Cooldowns**:
  - **`globalCooldown`**
    - Applique un délai de réutilisation **commun à tous les serveurs et tous les utilisateurs**.
    Par exemple, si défini à `5000`, **personne** ne pourra réutiliser la commande avant 5 secondes, sur **n’importe quel** serveur.
  - **`serverCooldown`**
    - Applique un délai **partagé par tous les membres du serveur** où la commande a été exécutée.
    Par exemple, si défini à `10000`, alors **tout le serveur** devra attendre 10 secondes avant que **quelqu’un** puisse lancer à nouveau la commande (même si un autre utilisateur du serveur n’a pas encore utilisé cette commande).
  - **`userCooldown`**
    - Applique un délai **spécifique à chaque utilisateur**.
    Par exemple, si défini à `3000`, chaque utilisateur devra attendre 3 secondes avant de pouvoir réutiliser la commande.

---

### **2. Commandes Slash**
Les commandes slash permettent aux utilisateurs de taper `/commande` dans la barre de commande Discord pour interagir avec le bot.

#### Fonctionnement :
- **Définition de la commande** :
  - Utilise un `SlashCommandBuilder` pour spécifier le nom, la description et les éventuelles options de la commande.

- **Propriétés importantes** :
  - **`isOnPrivateGuild`** : Identiques aux commandes contextuelles.
  - **`noDeferred`** et **`ephemeral`** : Identiques aux commandes contextuelles.
  - **Options des commandes** : Vous pouvez ajouter des paramètres aux commandes via des méthodes comme `.addStringOption()`, permettant d’ajouter des entrées utilisateur.
  - **Cooldowns** : Identiques aux commandes contextuelles.

---

### **3. Interactions personnalisées**
Les interactions permettent au bot de répondre aux actions directes des utilisateurs, comme des clics sur des boutons, des choix dans des menus déroulants, ou l’envoi de formulaires modaux.

#### Fonctionnement :
- **Définition** :
  - Une interaction est identifiée par un `id` unique, avec un format dynamique grâce au **`{!}`** :
    - **`{!}`** agit comme un espace réservé, remplacé dynamiquement lors de l'exécution.
    - Exemple : un bouton avec l'ID `button-test-{!}` peut être utilisé comme `button-test-123` ou `button-test-abc` selon les besoins du contexte.

- **Types d’interactions** :
  - **Boutons** : Actions déclenchées par un clic sur un bouton dans Discord.
  - **Menus déroulants** : Actions déclenchées par une sélection dans un menu.
  - **Modaux** : Actions déclenchées par l’envoi d’un formulaire avec plusieurs champs.

- **Propriétés importantes** :
  - **`noDeferred`** :
    - Si `false`, la réponse est différée, ce qui permet de gérer des traitements longs avant de répondre.
    - Si `true`, la réponse est immédiate.
  - **`ephemeral`** : Si `true`, la réponse est uniquement visible pour l’utilisateur ayant déclenché l’interaction.

- **Gestion des patterns dynamiques** :
  - Le pattern associé à `{!}` est extrait et passé comme argument à la fonction d'exécution (`execute(interaction, client, ...dynamicValues)`). Cela permet de créer une logique différente pour chaque variante d’un même type d’interaction.

---

### **4. Gestionnaire d'événements**
Les événements permettent au bot de réagir automatiquement à des actions spécifiques dans Discord, comme la connexion du bot, l’ajout d’un nouveau membre ou des changements dans un canal vocal.

#### Fonctionnement :
- **Événements d'exemples inclus** :
  - **`ClientReady`** : Déclenché lorsque le bot se connecte et est prêt à être utilisé.
  - **`GuildMemberAdd`** : Déclenché lorsqu’un nouvel utilisateur rejoint un serveur.
  - **`VoiceStateUpdate`** : Déclenché lorsqu’un utilisateur rejoint, quitte ou change de canal vocal.

- **Propriétés importantes** :
  - **`once`** :
    - Si `true`, l’événement est déclenché une seule fois, comme `ClientReady`.
    - Si `false`, il peut être déclenché plusieurs fois.
  - **Arguments de la fonction `execute()`** :
    - Les événements passent des arguments spécifiques à leur nature, comme un membre (`GuildMember`) pour `GuildMemberAdd` ou deux états vocaux (`oldState`, `newState`) pour `VoiceStateUpdate`.

---

## Comment utiliser cette template ?

1. **Configurer votre bot** :
   - Récupérez le token de votre bot depuis le [portail Discord Developer](https://discord.com/developers/applications).
   - Configurez un fichier `.env` ou une variable d’environnement pour inclure votre token.

2. **Ajouter vos propres commandes et interactions** :
   - Inspirez-vous des exemples fournis pour créer de nouvelles fonctionnalités.
   - Modifiez les propriétés comme `userCooldown`, `isOnPrivateGuild`, `ephemeral` selon vos besoins.
   - Des exemples sont présents dans `/Bot/Examples`, toutes vos commandes/interactions/events doivent être placés dans `/Bot/...`.

---

## Points forts de cette template
- **Flexibilité** : Gère les commandes, interactions et événements facilement grâce à des structures modulaires.
- **Contrôle précis** : Cooldowns utilisateur/serveur, restrictions de guildes spécifiques avec `isOnPrivateGuild`.
- **Adaptabilité** : Utilisation des patterns dynamiques `{!}` pour gérer plusieurs variantes d’une interaction unique.

Avec cette structure, vous pouvez rapidement développer un bot puissant et extensible pour Discord.