# template - embeds

## que hace
- `/embed-ejemplo`: muestra un embed con TODAS las propiedades (sirve de referencia)
- `/embed-crear`: el usuario arma su propio embed y lo manda a un canal
- `utils/embeds.js`: embeds rapidos de exito, error, aviso e info para usar en cualquier comando

## requisitos
- estructura de la fase 03 (slash commands con handlers)

## archivos y donde van
| archivo de la template | donde va en tu bot |
|---|---|
| `commands/embeds/embed-ejemplo.js` | `commands/embeds/embed-ejemplo.js` |
| `commands/embeds/embed-crear.js` | `commands/embeds/embed-crear.js` |
| `utils/embeds.js` | `utils/embeds.js` (carpeta nueva en la raiz) |

## que agregar en otros archivos
- **nada en index.js**: el commandHandler carga los comandos solo
- **intents**: ninguno extra (con `Guilds` alcanza)
- **deploy**: correr `node deploy-commands.js` porque son comandos nuevos
- **para usar los embeds rapidos en otro comando**, agregar arriba de ese archivo:
```js
const { embedExito, embedError, embedAviso, embedInfo } = require('../../utils/embeds');
```
y usarlos asi:
```js
await interaction.reply({ embeds: [embedExito('todo salio bien')] });
```

---

## todas las propiedades
```
┌─────────────────────────────────────────┐
│ [icono] autor                [thumbnail]│
│ titulo (link)                           │
│ descripcion                             │
│                                         │
│ campo normal                            │
│ inline 1   inline 2   inline 3          │
│                                         │
│ [         imagen grande          ]      │
│ [icono] footer • timestamp              │
└─────────────────────────────────────────┘
```

| metodo | que hace | limite |
|---|---|---|
| `.setColor(color)` | color de la barra izquierda | - |
| `.setAuthor({ name, iconURL, url })` | texto chico arriba con icono | name: 256 |
| `.setTitle('x')` | titulo | 256 |
| `.setURL('https://...')` | link del titulo | - |
| `.setDescription('x')` | texto principal, acepta markdown | 4096 |
| `.setThumbnail(url)` | imagen chica arriba a la derecha | - |
| `.addFields({ name, value, inline })` | agrega campos | 25 campos, name: 256, value: 1024 |
| `.setFields(...)` | reemplaza todos los campos | - |
| `.spliceFields(indice, cantidad)` | borra campos | - |
| `.setImage(url)` | imagen grande abajo | - |
| `.setFooter({ text, iconURL })` | texto chico abajo | 2048 |
| `.setTimestamp()` | fecha y hora (sin parametro = ahora) | - |

⚠️ **limite total**: entre todo el texto del embed max 6000 caracteres, y max 10 embeds por mensaje

## formas de poner el color
```js
.setColor(0x5865f2)          // hex como numero
.setColor('#5865f2')         // hex como texto
.setColor([88, 101, 242])    // rgb
.setColor('Random')          // aleatorio
.setColor(Colors.Blurple)    // nombres de discord.js (importar Colors)
```
colores disponibles en `Colors`: Default, White, Aqua, Green, Blue, Yellow, Purple, LuminousVividPink, Fuchsia, Gold, Orange, Red, Grey, Navy, DarkAqua, DarkGreen, DarkBlue, DarkPurple, DarkVividPink, DarkGold, DarkOrange, DarkRed, DarkGrey, DarkerGrey, LightGrey, DarkNavy, Blurple, Greyple, DarkButNotBlack, NotQuiteBlack

## cosas utiles
### mandar varios embeds juntos
```js
await interaction.reply({ embeds: [embed1, embed2, embed3] });
```

### editar un embed que ya se mando
```js
const { EmbedBuilder } = require('discord.js');

// copiamos el embed original y le cambiamos lo que queramos
const nuevo = EmbedBuilder.from(mensaje.embeds[0]).setTitle('titulo nuevo');
await mensaje.edit({ embeds: [nuevo] });
```

### usar una imagen de tu pc
```js
const { AttachmentBuilder } = require('discord.js');

const archivo = new AttachmentBuilder('./imagenes/banner.png', { name: 'banner.png' });
embed.setImage('attachment://banner.png'); // el nombre tiene que coincidir

await interaction.reply({ embeds: [embed], files: [archivo] });
```

### campo vacio para separar
```js
{ name: '\u200B', value: '\u200B' } // \u200B es un caracter invisible
```

### fechas que se adaptan a la zona horaria de cada uno
```js
const segundos = Math.floor(Date.now() / 1000);
`<t:${segundos}:R>`  // "hace 5 minutos"
`<t:${segundos}:F>`  // "miercoles, 11 de noviembre de 2026 20:46"
```

## errores comunes
| error | solucion |
|---|---|
| `invalid form body ... embeds[0].description` | la descripcion esta vacia o pasa los 4096 |
| `received one or more errors` | algun campo sin `name` o `value`, o value vacio |
| la imagen no aparece | la url no es directa a la imagen (tiene que terminar en .png, .jpg, .gif) |
| `embeds is not iterable` | pusiste `embeds: embed` en vez de `embeds: [embed]` |
| `cannot find module '../../utils/embeds'` | falta crear `utils/embeds.js` en la raiz |