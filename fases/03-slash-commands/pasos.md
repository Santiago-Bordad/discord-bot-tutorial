# fase 03 - slash commands

## objetivo
pasar de comandos con prefijo (`!ping`) a slash commands (`/ping`)

## por que slash commands
- discord los muestra con autocompletado y descripcion
- validan los datos solos (numeros, usuarios, canales)
- no necesitan el intent MessageContent
- son lo que discord recomienda hoy

## diferencias con la fase 02
| | prefijo (fase 02) | slash (fase 03) |
|---|---|---|
| como se escribe | `!ping` | `/ping` |
| evento | messageCreate | interactionCreate |
| se recibe | `message` | `interaction` |
| responder | `message.reply()` | `interaction.reply()` |
| registrarlos | no hace falta | hay que hacer deploy |

## como queda
```
mi-bot/
├── index.js                  -> igual que fase 02 (se borra client.prefix)
├── deploy-commands.js        -> NUEVO: registra los comandos en discord
├── handlers/
│   ├── commandHandler.js     -> CAMBIA: ahora busca data y execute
│   └── eventHandler.js       -> igual
├── events/
│   ├── ready.js              -> igual
│   └── interactionCreate.js  -> NUEVO: reemplaza a messageCreate.js
└── commands/
    └── utilidades/
        ├── ping.js           -> CAMBIA: ahora es slash
        └── decir.js          -> NUEVO: ejemplo con opciones
```

## paso 1: revisar el .env
tiene que tener los 3 valores de la fase 00:
```env
TOKEN=tu_token
CLIENT_ID=tu_client_id
GUILD_ID=tu_guild_id
```

## paso 2: actualizar el commandHandler
- copiar `ejemplo/handlers/commandHandler.js`
- ahora cada comando tiene `data` (la definicion) en vez de `name`

## paso 3: cambiar el evento
- borrar `events/messageCreate.js`
- copiar `ejemplo/events/interactionCreate.js`
- en index.js borrar la linea `client.prefix = '!';`

## paso 4: actualizar los comandos
- copiar `ejemplo/commands/utilidades/ping.js`
- copiar `ejemplo/commands/utilidades/decir.js`

## paso 5: registrar los comandos en discord
- copiar `ejemplo/deploy-commands.js` a la raiz
- correrlo:
```bash
node deploy-commands.js
```
- tiene que decir `comandos registrados: 2`

## paso 6: probar
```bash
node index.js
```
- escribir `/` en el servidor, tienen que aparecer `/ping` y `/decir`

---

## ⚠️ cuando hay que hacer deploy
| cambio | deploy? | reiniciar bot? |
|---|---|---|
| comando nuevo | si | si |
| cambiar nombre, descripcion u opciones | si | si |
| borrar un comando | si | si |
| cambiar solo el codigo de execute | no | si |

## deploy en un servidor vs global
- **guild** (un servidor): aparece al instante, ideal para probar
- **global** (todos los servidores): puede tardar hasta 1 hora
- en `deploy-commands.js` estan los dos, el global esta comentado

## formato de un comando
```js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nombre')            // solo minusculas, sin espacios, max 32
    .setDescription('que hace'),  // obligatorio, max 100

  async execute(interaction, client) {
    await interaction.reply('respuesta');
  },
};
```

## tipos de opciones
| metodo | que pide | como se lee |
|---|---|---|
| `.addStringOption` | texto | `interaction.options.getString('x')` |
| `.addIntegerOption` | numero entero | `getInteger('x')` |
| `.addNumberOption` | numero con decimales | `getNumber('x')` |
| `.addBooleanOption` | si / no | `getBoolean('x')` |
| `.addUserOption` | usuario | `getUser('x')` / `getMember('x')` |
| `.addChannelOption` | canal | `getChannel('x')` |
| `.addRoleOption` | rol | `getRole('x')` |
| `.addMentionableOption` | usuario o rol | `getMentionable('x')` |
| `.addAttachmentOption` | archivo | `getAttachment('x')` |

## formas de responder
| metodo | para que |
|---|---|
| `interaction.reply('x')` | responder (obligatorio en menos de 3 segundos) |
| `reply({ content, flags: MessageFlags.Ephemeral })` | respuesta que solo ve quien uso el comando |
| `interaction.deferReply()` | "pensando..." si el comando tarda mas de 3 seg |
| `interaction.editReply('x')` | cambiar la respuesta (despues de reply o defer) |
| `interaction.followUp('x')` | mandar otro mensaje mas |

## errores comunes
| error | solucion |
|---|---|
| los comandos no aparecen | no corriste `node deploy-commands.js` o reiniciar discord (ctrl + r) |
| `missing access` en el deploy | el bot no se invito con el scope `applications.commands` (fase 00) |
| `la aplicacion no respondio` | el execute tardo mas de 3 seg, usar deferReply |
| `interaction has already been acknowledged` | respondiste dos veces con reply, usar editReply o followUp |
| `invalid form body` | nombre con mayusculas/espacios o falta la descripcion |