// revisa si un usuario puede usar un comando o tiene que esperar
// devuelve null si puede usarlo, o el momento (en segundos) en que se libera
const { Collection } = require('discord.js');

// segundos de espera si el comando no tiene "cooldown"
const COOLDOWN_DEFAULT = 3;

module.exports = (interaction, command, client) => {
    const nombre = command.data.name;

    // cada comando tiene su propia lista: id del usuario -> cuando lo uso
    if (!client.cooldowns.has(nombre)) {
        client.cooldowns.set(nombre, new Collection());
    }

    const usos = client.cooldowns.get(nombre);
    const ahora = Date.now();
    const duracion = (command.cooldown ?? COOLDOWN_DEFAULT) * 1000;

    // si lo uso hace poco, calculamos cuando se libera
    if (usos.has(interaction.user.id)) {
        const expira = usos.get(interaction.user.id) + duracion;
        if (ahora < expira) return Math.round(expira / 1000);
    }

    // lo anotamos y lo borramos solo cuando pasa el tiempo
    usos.set(interaction.user.id, ahora);
    setTimeout(() => usos.delete(interaction.user.id), duracion);

    return null;
};