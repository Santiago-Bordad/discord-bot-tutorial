# template - modals (formularios)

## que hace
- `/modal-ejemplo`: abre un formulario con todos los tipos de campos (referencia)
- `/sugerencia`: abre un formulario y publica la sugerencia con reacciones para votar
- sistema de modals: cada modal es un archivo en `modals/`, igual que botones y menus

## requisitos
- estructura de la fase 03
- template de embeds (usa `utils/embeds.js`)
- template de botones y menus (usa su `interactionCreate.js`)
- discord.js 14.28 o mas (`npm install discord.js@14`)

## archivos y donde van
| archivo de la template | donde va en tu bot |
|---|---|
| `handlers/modalHandler.js` | `handlers/modalHandler.js` |
| `modals/modal-ejemplo.js` | `modals/modal-ejemplo.js` (carpeta nueva en la raiz) |
| `modals/sugerencia.js` | `modals/sugerencia.js` |
| `commands/modals/modal-ejemplo.js` | `commands/modals/modal-ejemplo.js` |
| `commands/modals/sugerencia.js` | `commands/modals/sugerencia.js` |

## que agregar en otros archivos

### index.js
arriba, con los otros require:
```js
const modalHandler = require('./handlers/modalHandler');
```
abajo de `client.menus = new Collection();`:
```js
client.modals = new Collection();
```
abajo de `menuHandler(client);`:
```js
modalHandler(client);
```

### events/interactionCreate.js
abajo del bloque de menus (adentro del try):
```js
// --- modals (formularios) ---
if (interaction.isModalSubmit()) {
    const [nombre, ...args] = interaction.customId.split(':');
    const modal = client.modals.get(nombre);
    if (modal) await modal.execute(interaction, args, client);
    return;
}
```

### .env
```env
CANAL_SUGERENCIAS=id_del_canal_de_sugerencias
```

### deploy
`node deploy-commands.js` (hay 2 comandos nuevos)

---

## como funciona
```
/comando o boton  ->  showModal(modal)  ->  el usuario completa  ->  isModalSubmit  ->  modals/<customId>.js
```
1. un comando (o un boton) abre el modal con `interaction.showModal(modal)`
2. el usuario lo completa y aprieta enviar
3. llega una interaccion nueva con el customId del modal
4. el archivo de `modals/` lee las respuestas con `interaction.fields`

## formato de un modal
archivo en `modals/<nombre>.js`
```js
module.exports = {
  customId: 'nombre',
  async execute(interaction, args, client) {
    const texto = interaction.fields.getTextInputValue('id-del-campo');
    await interaction.reply(`escribiste: ${texto}`);
  },
};
```

## estructura de un modal
```js
new ModalBuilder()
  .setCustomId('id')                  // max 100
  .setTitle('titulo')                 // max 45
  .addTextDisplayComponents(texto)    // texto fijo para leer
  .addLabelComponents(campo1, campo2) // campos para completar
```
⚠️ max 5 componentes por modal (contando los textos fijos)

cada campo va adentro de un `LabelBuilder`:
```js
new LabelBuilder()
  .setLabel('titulo del campo')       // max 45
  .setDescription('ayuda')            // opcional, max 100
  .setTextInputComponent(...)         // o cualquiera de la tabla de abajo
```

## tipos de campos
| metodo del label | builder | como se lee |
|---|---|---|
| `.setTextInputComponent()` | `TextInputBuilder` | `fields.getTextInputValue('id')` |
| `.setStringSelectMenuComponent()` | `StringSelectMenuBuilder` | `fields.getStringSelectValues('id')` |
| `.setUserSelectMenuComponent()` | `UserSelectMenuBuilder` | `fields.getSelectedUsers('id')` |
| `.setRoleSelectMenuComponent()` | `RoleSelectMenuBuilder` | `fields.getSelectedRoles('id')` |
| `.setChannelSelectMenuComponent()` | `ChannelSelectMenuBuilder` | `fields.getSelectedChannels('id')` |
| `.setMentionableSelectMenuComponent()` | `MentionableSelectMenuBuilder` | `fields.getSelectedMentionables('id')` |
| `.setFileUploadComponent()` | `FileUploadBuilder` | `fields.getUploadedFiles('id')` |
| `.setCheckboxComponent()` | `CheckboxBuilder` | `fields.getCheckbox('id')` |
| `.setCheckboxGroupComponent()` | `CheckboxGroupBuilder` | `fields.getCheckboxGroup('id')` |
| `.setRadioGroupComponent()` | `RadioGroupBuilder` | `fields.getRadioGroup('id')` |

los checkbox y radio son los mas nuevos, si no aparecen actualizar discord

## propiedades del texto (TextInputBuilder)
| metodo | que hace | limite |
|---|---|---|
| `.setCustomId('x')` | id para leer la respuesta | 100 |
| `.setStyle(TextInputStyle.Short)` | una linea | - |
| `.setStyle(TextInputStyle.Paragraph)` | varias lineas | - |
| `.setPlaceholder('x')` | texto gris de ayuda | 100 |
| `.setValue('x')` | texto que ya viene escrito | 4000 |
| `.setMinLength(n)` / `.setMaxLength(n)` | largo minimo y maximo | 0 a 4000 |
| `.setRequired(false)` | opcional (por defecto es obligatorio) | - |

## abrir un modal desde un boton
en el archivo de `buttons/`:
```js
async execute(interaction) {
    await interaction.showModal(modal); // igual que en un comando
}
```
(lo vamos a usar en la template de tickets)

## errores comunes
| error | solucion |
|---|---|
| `interaction has already been acknowledged` | usaste reply o deferReply antes de showModal, tiene que ser la primera respuesta |
| `esta interaccion ha fallado` al enviar | no hay archivo en `modals/` para ese customId |
| `client.modals is undefined` | falta `client.modals = new Collection()` en index.js |
| `invalid form body ... components` | mas de 5 componentes, o un label sin campo adentro |
| `LabelBuilder is not a function` | discord.js viejo, actualizar con `npm install discord.js@14` |
| `getTextInputValue` devuelve vacio | el campo era opcional y lo dejaron vacio, es normal |
