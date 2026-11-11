# template - botones

## que hace
- `/botones-ejemplo`: muestra todos los estilos de botones (referencia)
- `/verificar-panel`: manda un panel con un boton que da un rol al apretarlo
- sistema de botones: cada boton es un archivo en `buttons/`, igual que los comandos

## requisitos
- estructura de la fase 03
- template de embeds (usa `utils/embeds.js`)

## archivos y donde van
| archivo de la template | donde va en tu bot |
|---|---|
| `handlers/buttonHandler.js` | `handlers/buttonHandler.js` |
| `events/interactionCreate.js` | `events/interactionCreate.js` (**reemplaza** al de la fase 03) |
| `buttons/ejemplo.js` | `buttons/ejemplo.js` (carpeta nueva en la raiz) |
| `buttons/verificar.js` | `buttons/verificar.js` |
| `commands/botones/botones-ejemplo.js` | `commands/botones/botones-ejemplo.js` |
| `commands/botones/verificar.js` | `commands/botones/verificar.js` |

## que agregar en otros archivos

### index.js
arriba, con los otros require:
```js
const buttonHandler = require('./handlers/buttonHandler');
```
abajo de `client.commands = new Collection();`:
```js
client.buttons = new Collection();
```
abajo de `commandHandler(client);`:
```js
buttonHandler(client);
```

### events/interactionCreate.js
se reemplaza entero por el de la template. lo nuevo es este bloque:
```js
if (interaction.isButton()) {
    const [nombre, ...args] = interaction.customId.split(':');
    const button = client.buttons.get(nombre);
    if (button) await button.execute(interaction, args, client);
    return;
}
```

### deploy
`node deploy-commands.js` (hay 2 comandos nuevos)

### permisos
para `/verificar-panel`: en ajustes del servidor -> roles, el rol del bot tiene que estar
**mas arriba** que el rol que va a dar

---

## como funciona el customId
cada boton tiene un `customId`. cuando alguien lo aprieta, el bot recibe ese id y busca que archivo lo maneja.

usamos `:` para pasar datos dentro del id:
```
"verificar:123456789"
   │          │
   │          └── args[0] -> el id del rol
   └── nombre -> busca buttons/verificar.js
```
asi un mismo archivo maneja muchos botones distintos

## formato de un boton
archivo en `buttons/<nombre>.js`
```js
module.exports = {
  customId: 'nombre', // lo que va antes de los ":"
  async execute(interaction, args, client) {
    await interaction.reply('apretaste el boton');
  },
};
```

## estilos
| estilo | color | lleva |
|---|---|---|
| `ButtonStyle.Primary` | azul | customId |
| `ButtonStyle.Secondary` | gris | customId |
| `ButtonStyle.Success` | verde | customId |
| `ButtonStyle.Danger` | rojo | customId |
| `ButtonStyle.Link` | gris con flecha | url (sin customId) |

## propiedades
| metodo | que hace | limite |
|---|---|---|
| `.setCustomId('x')` | id del boton | 100 |
| `.setLabel('x')` | texto | 80 |
| `.setStyle(ButtonStyle.X)` | color | - |
| `.setEmoji('✅')` | emoji (tambien custom: `'<:nombre:id>'`) | - |
| `.setURL('https://...')` | link (solo estilo Link) | - |
| `.setDisabled(true)` | deshabilitado | - |

⚠️ max 5 botones por fila (`ActionRowBuilder`) y max 5 filas por mensaje

## formas de responder a un boton
| metodo | que hace |
|---|---|
| `interaction.reply()` | mensaje nuevo (con `MessageFlags.Ephemeral` solo lo ve quien apreto) |
| `interaction.update()` | edita el mensaje donde esta el boton |
| `interaction.deferUpdate()` | "ok, recibido" sin cambiar nada (si vas a tardar) |
| `interaction.showModal()` | abre un formulario (template de modals) |

### deshabilitar los botones despues de apretar
```js
const { ActionRowBuilder, ButtonBuilder } = require('discord.js');

const filas = interaction.message.components.map((fila) =>
    new ActionRowBuilder().addComponents(
        fila.components.map((boton) => ButtonBuilder.from(boton).setDisabled(true)),
    ),
);
await interaction.update({ components: filas });
```

## otra forma: collectors
en vez de un archivo en `buttons/`, se pueden escuchar los botones dentro del mismo comando.
sirve para botones temporales (ej: confirmar si/no). **dejan de andar si el bot se reinicia**
```js
const mensaje = await interaction.reply({ content: 'seguro?', components: [fila], fetchReply: true });

const collector = mensaje.createMessageComponentCollector({ time: 30_000 }); // 30 seg

collector.on('collect', async (i) => {
    if (i.user.id !== interaction.user.id) return i.reply({ content: 'no es tuyo', flags: MessageFlags.Ephemeral });
    await i.update({ content: `elegiste ${i.customId}`, components: [] });
    collector.stop();
});

collector.on('end', (_, razon) => {
    if (razon === 'time') interaction.editReply({ content: 'se acabo el tiempo', components: [] });
});
```

| | archivo en buttons/ | collector |
|---|---|---|
| anda despues de reiniciar | si | no |
| ideal para | paneles fijos (verificar, tickets) | confirmaciones rapidas |

## errores comunes
| error | solucion |
|---|---|
| `esta interaccion ha fallado` | no hay archivo en `buttons/` para ese customId, o tardo mas de 3 seg |
| `client.buttons is undefined` | falta `client.buttons = new Collection()` en index.js |
| `missing permissions` al dar el rol | el rol del bot esta mas abajo que el rol a dar |
| `invalid form body ... custom_id` | dos botones con el mismo customId en el mismo mensaje |
| `components[0].components[5]` | mas de 5 botones en una fila |
