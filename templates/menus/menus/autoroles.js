// responde al menu de autoroles: da los elegidos y saca los demas
const { MessageFlags } = require('discord.js');
const { embedExito } = require('../utils/embeds');

module.exports = {
    customId: 'autoroles',

    async execute(interaction) {
        // todos los roles que ofrece el menu (sacados de las opciones del mensaje)
        const opciones = interaction.component.options.map((opcion) => opcion.value);
        // los que eligio
        const elegidos = interaction.values;

        const dar = elegidos.filter((id) => !interaction.member.roles.cache.has(id));
        const sacar = opciones.filter((id) => !elegidos.includes(id) && interaction.member.roles.cache.has(id));

        // el rol del bot tiene que estar mas arriba que estos roles
        if (dar.length) await interaction.member.roles.add(dar);
        if (sacar.length) await interaction.member.roles.remove(sacar);

        await interaction.reply({
            embeds: [embedExito(`roles actualizados: +${dar.length} / -${sacar.length}`)],
            flags: MessageFlags.Ephemeral,
        });
    },
};