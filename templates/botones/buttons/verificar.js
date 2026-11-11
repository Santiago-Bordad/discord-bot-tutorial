// responde al boton del panel de verificacion
const { MessageFlags } = require('discord.js');
const { embedExito, embedError, embedAviso } = require('../utils/embeds');

module.exports = {
    customId: 'verificar',

    async execute(interaction, args) {
        // "verificar:123456789" -> args = ['123456789']
        const [rolId] = args;
        const rol = interaction.guild.roles.cache.get(rolId);

        if (!rol) {
            return interaction.reply({ embeds: [embedError('el rol ya no existe')], flags: MessageFlags.Ephemeral });
        }

        // si ya lo tiene, avisamos
        if (interaction.member.roles.cache.has(rolId)) {
            return interaction.reply({ embeds: [embedAviso('ya estas verificado')], flags: MessageFlags.Ephemeral });
        }

        // el rol del bot tiene que estar mas arriba que el rol que da
        await interaction.member.roles.add(rol);
        await interaction.reply({ embeds: [embedExito(`te verificaste, ahora tenes ${rol}`)], flags: MessageFlags.Ephemeral });
    },
};