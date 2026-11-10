// carga las variables del archivo .env
require('dotenv').config();

// importamos lo que necesitamos de discord.js
const { Client, GatewayIntentBits, Events } = require('discord.js');

const client = new Client({
    intents: [
        // --- servidores ---
        GatewayIntentBits.Guilds,                       // servidores, canales, roles (siempre)
        GatewayIntentBits.GuildMembers,                 // ⚠️ privilegiado - entradas, salidas, roles de miembros
        GatewayIntentBits.GuildModeration,              // bans y unbans
        GatewayIntentBits.GuildExpressions,             // emojis, stickers y sonidos
        // GatewayIntentBits.GuildIntegrations,            // integraciones
        // GatewayIntentBits.GuildWebhooks,                // webhooks
        GatewayIntentBits.GuildInvites,                 // invitaciones creadas/borradas
        GatewayIntentBits.GuildVoiceStates,             // quien entra/sale de canales de voz
        GatewayIntentBits.GuildPresences,               // ⚠️ privilegiado - estado (online, jugando a...)
        GatewayIntentBits.GuildScheduledEvents,         // eventos programados del servidor

        // --- mensajes en servidores ---
        GatewayIntentBits.GuildMessages,                // mensajes
        GatewayIntentBits.GuildMessageReactions,        // reacciones
        GatewayIntentBits.GuildMessageTyping,           // "esta escribiendo..."
        GatewayIntentBits.GuildMessagePolls,            // encuestas
        GatewayIntentBits.MessageContent,               // ⚠️ privilegiado - leer el texto de los mensajes

        // --- mensajes directos (md) ---
        GatewayIntentBits.DirectMessages,               // mensajes por md
        GatewayIntentBits.DirectMessageReactions,       // reacciones en md
        GatewayIntentBits.DirectMessageTyping,          // "esta escribiendo..." en md
        GatewayIntentBits.DirectMessagePolls,           // encuestas en md

        // --- automod ---
        GatewayIntentBits.AutoModerationConfiguration,  // cambios en reglas de automod
        GatewayIntentBits.AutoModerationExecution,      // cuando automod actua
        ],
    // partials: deja recibir eventos de cosas que no estan en cache
    // (ej: reacciones a mensajes viejos, mds)
    partials: [
        Partials.User,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.ThreadMember,
    ],
});

// se ejecuta una sola vez cuando el bot se conecta
client.once(Events.ClientReady, (c) => {
    console.log(`conectado como ${c.user.tag}`);
});

// se ejecuta cada vez que alguien manda un mensaje
client.on(Events.MessageCreate, async (message) => {
    // si el mensaje es de un bot, lo ignoramos
    if (message.author.bot) return;

    // si el mensaje dice !ping, respondemos
    // si el mensaje dice !ping, respondemos con la latencia
    if (message.content === '!ping') {
        const latencia = Date.now() - message.createdTimestamp; // tiempo que tardo el mensaje en llegar
        await message.reply(`pong! (${latencia} ms)`);
    }
});

// conectamos el bot usando el token
client.login(process.env.TOKEN);