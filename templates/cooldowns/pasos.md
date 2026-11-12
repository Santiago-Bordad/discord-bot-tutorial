# template - cooldowns

## que hace
- evita que un comando se pueda spamear: despues de usarlo hay que esperar unos segundos
- cada comando puede tener su propio tiempo con `cooldown: 10`
- si no se pone nada, usa un tiempo por defecto (3 segundos)
- `/dado`: comando de ejemplo con 10 segundos de cooldown

## requisitos
- estructura de la fase 03
- template de embeds (usa `utils/embeds.js`)

## archivos y donde van
| archivo de la template | donde va en tu bot |
|---|---|
| `utils/cooldowns.js` | `utils/cooldowns.js` |
| `commands/utilidades/dado.js` | `commands/utilidades/dado.js` |

## que agregar en otros archivos

### index.js
abajo de `client.commands = new Collection();`:
```js
client.cooldowns = new Collection();
```

### events/interactionCreate.js
arriba de todo, con los otros require:
```js
const revisarCooldown = require('../utils/cooldowns');
const { embedAviso } = require('../utils/embeds');
```
reemplazar el bloque de slash commands por este:
```js
// --- slash commands ---
if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    // si tiene que esperar, le avisamos y no ejecutamos el comando
    const libre = revisarCooldown(interaction, command, client);
    if (libre) {
        return interaction.reply({
            embeds: [embedAviso(`espera, vas a poder usar \`/${command.data.name}\` <t:${libre}:R>`)],
            flags: MessageFlags.Ephemeral,
        });
    }

    await command.execute(interaction, client);
    return;
}
```

### en cada comando (opcional)
agregar `cooldown` con los segundos, al mismo nivel que `data` y `execute`:
```js
module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()...,
    async execute(interaction) {...},
};
```

### deploy
`node deploy-commands.js` (por `/dado`)

---

## como funciona
```
client.cooldowns
 └── 'dado'  -> collection
       ├── '1234' (id usuario) -> 1731370000000 (cuando lo uso)
       └── '5678'              -> 1731370005000
```
1. alguien usa un comando
2. si su id esta en la lista de ese comando y no paso el tiempo -> se le avisa y no se ejecuta
3. si no -> se anota la hora, se ejecuta el comando y un `setTimeout` lo saca de la lista cuando pasa el tiempo

`<t:${libre}:R>` es un timestamp de discord: se ve como "en 8 segundos" y se actualiza solo

## cambiar el tiempo por defecto
en `utils/cooldowns.js`:
```js
const COOLDOWN_DEFAULT = 3; // segundos
```
con `0` los comandos sin `cooldown` no tienen espera

## que los admins no tengan cooldown (opcional)
en `utils/cooldowns.js`, al principio de la funcion:
```js
const { PermissionFlagsBits } = require('discord.js'); // arriba de todo

if (interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) return null;
```

## limitaciones
- se guarda en memoria: si el bot se reinicia, los cooldowns se borran
- para cooldowns largos (ej: `/daily` cada 24 horas) hay que guardarlo en una base de datos (fase 06)

## errores comunes
| error | solucion |
|---|---|
| `cannot read properties of undefined (reading 'has')` | falta `client.cooldowns = new Collection()` en index.js |
| el cooldown no hace nada | el bloque de slash del interactionCreate no se reemplazo |
| `embedAviso is not a function` | falta el require de `utils/embeds` en interactionCreate |
| se ve `<t:123:R>` como texto | va dentro de un embed o mensaje normal, no en un titulo de embed |