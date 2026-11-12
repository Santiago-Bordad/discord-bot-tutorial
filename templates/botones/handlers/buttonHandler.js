// recorre buttons/ y guarda cada boton en client.buttons (customId -> boton)
const fs = require('node:fs');
const path = require('node:path');

module.exports = (client) => {
    const buttonsPath = path.join(__dirname, '..', 'buttons');

    // si la carpeta no existe no hacemos nada
    if (!fs.existsSync(buttonsPath)) return;

    const files = fs.readdirSync(buttonsPath).filter((file) => file.endsWith('.js'));

    for (const file of files) {
        const button = require(path.join(buttonsPath, file));

        if (button.customId && button.execute) {
            client.buttons.set(button.customId, button);
            console.log(`boton cargado: ${button.customId}`);
        } else {
            console.warn(`⚠️ ${file} no tiene customId o execute`);
        }
    }
};