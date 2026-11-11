# template - menus (select menus)

## que hace
- `/menus-ejemplo`: muestra los 5 tipos de menus (referencia)
- `/autoroles-panel`: manda un menu donde cada uno elige sus roles
- sistema de menus: cada menu es un archivo en `menus/`, igual que los botones

## requisitos
- estructura de la fase 03
- template de embeds (usa `utils/embeds.js`)
- template de botones (usa su `interactionCreate.js`)

## archivos y donde van
| archivo de la template | donde va en tu bot |
|---|---|
| `handlers/menuHandler.js` | `handlers/menuHandler.js` |
| `menus/menu-ejemplo.js` | `menus/menu-ejemplo.js` (carpeta nueva en la raiz) |
| `menus/autoroles.js` | `menus/autoroles.js` |
| `commands/menus/menus-ejemplo.js` | `commands/menus/menus-ejemplo.js` |
| `commands/menus/autoroles.js` | `commands/menus/autoroles.js` |

## que agregar en otros archivos

### index.js
arriba, con los otros require:
```js
const menuHandler = require('./handlers/menuHandler');
```
abajo de `client.buttons = new Collection();`:
```js
client.menus = new Collection();
```
abajo de `buttonHandler(client);`:
```js
menuHandler(client);
```

### events/interactionCreate.js
abajo del bloque de botones (adentro del try):
```js
// --- menus (los 5 tipos) ---
if (interaction.isAnySelectMenu()) {
    // "menu-ejemplo:roles" -> nombre: "menu-ejemplo", args: ["roles"]
    const [nombre, ...args] = interaction.customId.split(':');
    const menu = client.menus.get(nombre);
    if (menu) await menu.execute(interaction, args, client);
    return;
}
```

### deploy
`node deploy-commands.js` (hay 2 comandos nuevos)

### permisos
para `/autoroles-panel`: el rol del bot tiene que estar **mas arriba** que los roles que da

---

## los 5 tipos
| builder | que muestra | comprobar con |
|---|---|---|
| `StringSelectMenuBuilder` | opciones que inventas vos | `isStringSelectMenu()` |
| `UserSelectMenuBuilder` | usuarios del servidor | `isUserSelectMenu()` |
| `RoleSelectMenuBuilder` | roles | `isRoleSelectMenu()` |
| `ChannelSelectMenuBuilder` | canales (se filtran con `.addChannelTypes()`) | `isChannelSelectMenu()` |
| `MentionableSelectMenuBuilder` | usuarios y roles | `isMentionableSelectMenu()` |

`isAnySelectMenu()` = cualquiera de los 5

## propiedades del menu
| metodo | que hace | limite |
|---|---|---|
| `.setCustomId('x')` | id del menu | 100 |
| `.setPlaceholder('x')` | texto gris cuando no hay nada elegido | 150 |
| `.setMinValues(n)` | minimo a elegir (0 = puede no elegir nada) | 0 a 25 |
| `.setMaxValues(n)` | maximo a elegir | 1 a 25 |
| `.setDisabled(true)` | deshabilitado | - |
| `.addOptions(...)` | opciones (solo en el de texto) | 25 |

## propiedades de cada opcion (solo menu de texto)
| metodo | que hace | limite |
|---|---|---|
| `.setLabel('x')` | lo que se ve | 100 |
| `.setValue('x')` | lo que recibe el bot | 100 |
| `.setDescription('x')` | texto chico abajo | 100 |
| `.setEmoji('🍕')` | emoji | - |
| `.setDefault(true)` | viene elegida de entrada | - |

tambien se pueden pasar como objeto:
```js
.addOptions({ label: 'pizza', value: 'pizza', emoji: '🍕' })
```

⚠️ un menu ocupa una fila entera: no se puede poner un menu y botones en la misma fila

## leer lo que se eligio
| propiedad | que tiene |
|---|---|
| `interaction.values` | array con los values (texto) o los ids (los otros) |
| `interaction.users` | collection de usuarios elegidos |
| `interaction.members` | collection de miembros elegidos |
| `interaction.roles` | collection de roles elegidos |
| `interaction.channels` | collection de canales elegidos |

## errores comunes
| error | solucion |
|---|---|
| `esta interaccion ha fallado` | no hay archivo en `menus/` para ese customId |
| `client.menus is undefined` | falta `client.menus = new Collection()` en index.js |
| `max_values must be less than or equal to options` | max values es mas grande que la cantidad de opciones |
| `invalid form body ... value` | dos opciones con el mismo value |
| `isAnySelectMenu is not a function` | discord.js viejo, actualizar con `npm install discord.js@14` |