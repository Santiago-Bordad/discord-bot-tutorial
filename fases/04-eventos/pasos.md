# fase 04 - eventos

## objetivo
hacer que el bot reaccione a cosas que pasan en el servidor sin que nadie use un comando:
alguien entra, se va, borra un mensaje, reacciona, etc

## como funciona
discord le avisa al bot cada vez que pasa algo (si tiene el intent).
el eventHandler de la fase 02 carga cualquier archivo de `events/`,
asi que para escuchar un evento nuevo solo hay que crear el archivo

## como queda
```
mi-bot/
├── .env                      -> CAMBIA: se agregan ids de canales
└── events/
    ├── ready.js              -> igual
    ├── interactionCreate.js  -> igual
    ├── guildMemberAdd.js     -> NUEVO: alguien entra
    ├── guildMemberRemove.js  -> NUEVO: alguien se va
    ├── messageDelete.js      -> NUEVO: borran un mensaje
    └── messageReactionAdd.js -> NUEVO: reaccionan a un mensaje
```

## paso 1: crear los canales en discord
- un canal para bienvenidas (ej: #bienvenidas)
- un canal para logs (ej: #logs), mejor que sea privado
- click derecho en cada uno -> copiar id

## paso 2: agregar los ids al .env
```env
CANAL_BIENVENIDA=id_del_canal_de_bienvenidas
CANAL_LOGS=id_del_canal_de_logs
```

## paso 3: copiar los eventos
- copiar los 4 archivos de `ejemplo/events/` a `events/`

## paso 4: probar
```bash
node index.js
```
- en consola tienen que aparecer los 4 eventos nuevos cargados
- entrar con otra cuenta (o invitar a alguien) -> mensaje en #bienvenidas
- que se vaya -> mensaje en #logs
- borrar un mensaje -> aparece en #logs
- reaccionar a un mensaje con ⭐ -> el bot avisa en #logs

---

## formato de un evento
```js
const { Events } = require('discord.js');

module.exports = {
  name: Events.NombreDelEvento,
  once: false,
  async execute(argumento1, argumento2, client) {
    // el ultimo argumento siempre es client (lo agrega el eventHandler)
  },
};
```

## eventos mas usados
| evento | cuando pasa | argumentos | intent necesario |
|---|---|---|---|
| `ClientReady` | el bot se conecta | client | - |
| `InteractionCreate` | slash, boton, menu, modal | interaction | Guilds |
| `MessageCreate` | mensaje nuevo | message | GuildMessages |
| `MessageUpdate` | editan un mensaje | oldMessage, newMessage | GuildMessages |
| `MessageDelete` | borran un mensaje | message | GuildMessages |
| `GuildMemberAdd` | alguien entra | member | GuildMembers ⚠️ |
| `GuildMemberRemove` | alguien se va o lo echan | member | GuildMembers ⚠️ |
| `GuildMemberUpdate` | cambia apodo o roles | oldMember, newMember | GuildMembers ⚠️ |
| `GuildBanAdd` | banean a alguien | ban | GuildModeration |
| `MessageReactionAdd` | reaccionan | reaction, user | GuildMessageReactions |
| `MessageReactionRemove` | sacan una reaccion | reaction, user | GuildMessageReactions |
| `VoiceStateUpdate` | entran/salen de voz | oldState, newState | GuildVoiceStates |
| `ChannelCreate` | crean un canal | channel | Guilds |
| `ChannelDelete` | borran un canal | channel | Guilds |
| `GuildCreate` | el bot entra a un servidor | guild | Guilds |
| `PresenceUpdate` | cambia el estado de alguien | oldPresence, newPresence | GuildPresences ⚠️ |

⚠️ = intent privilegiado (activarlo en el developer portal, fase 00)

lista completa: https://discord.js.org/docs/packages/discord.js/main/Events:Enum

## partials
si un mensaje es viejo (de antes de que el bot prendiera), no esta en cache.
sin partials el evento ni llega; con partials llega "incompleto" (`.partial === true`).

- para completarlo: `await algo.fetch()`
- un mensaje **borrado** no se puede recuperar con fetch, ya no existe

```js
if (reaction.partial) await reaction.fetch();
```

## errores comunes
| error | solucion |
|---|---|
| el evento nunca se ejecuta | falta el intent en index.js o en el developer portal |
| `cannot read properties of null (reading 'send')` | el id del canal esta mal en el .env |
| bienvenida no anda | falta el intent privilegiado server members |
| mensaje borrado aparece sin contenido | era viejo y no estaba en cache, es normal |
| las reacciones a mensajes viejos no llegan | faltan los partials Message y Reaction |