// recorre modals/ y guarda cada modal en client.modals (customId -> modal)
const fs = require('node:fs');
const path = require('node:path');

module.exports = (client) => {
    const modalsPath = path.join(__dirname, '..', 'modals');

    // si la carpeta no existe no hacemos nada
    if (!fs.existsSync(modalsPath)) return;

    const files = fs.readdirSync(modalsPath).filter((file) => file.endsWith('.js'));

    for (const file of files) {
        const modal = require(path.join(modalsPath, file));

        if (modal.customId && modal.execute) {
            client.modals.set(modal.customId, modal);
            console.log(`modal cargado: ${modal.customId}`);
        } else {
            console.warn(`⚠️ ${file} no tiene customId o execute`);
        }
    }
};