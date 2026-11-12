// recorre menus/ y guarda cada menu en client.menus (customId -> menu)
const fs = require('node:fs');
const path = require('node:path');

module.exports = (client) => {
    const menusPath = path.join(__dirname, '..', 'menus');

    // si la carpeta no existe no hacemos nada
    if (!fs.existsSync(menusPath)) return;

    const files = fs.readdirSync(menusPath).filter((file) => file.endsWith('.js'));

    for (const file of files) {
        const menu = require(path.join(menusPath, file));

        if (menu.customId && menu.execute) {
            client.menus.set(menu.customId, menu);
            console.log(`menu cargado: ${menu.customId}`);
        } else {
            console.warn(`⚠️ ${file} no tiene customId o execute`);
        }
    }
};