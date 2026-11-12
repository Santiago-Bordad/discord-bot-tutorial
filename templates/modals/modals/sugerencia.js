// cuando se envia el formulario, publica la sugerencia con reacciones para votar
const { EmbedBuilder, MessageFlags } = require('discord.js');
const { embedExito, embedError } = require('../utils/embeds');

module.exports = {
    customId: 'sugerencia',

    async execute(interaction) {
        const canal = interaction.guild.channels.cache.get(process.env.CANAL_SUGERENCIAS);
        if (!canal) {
            return interaction.reply({ embeds: [embedError('no esta configurado el canal de sugerencias')], flags: MessageFlags.Ephemeral });
        }

        const titulo = interaction.fields.getTextInputValue('titulo');
        const descripcion = interaction.fields.getTextInputValue('descripcion');

        const embed = new EmbedBuilder()
            .setColor(0xfee75c)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTitle(`💡 ${titulo}`)
            .setDescription(descripcion)
            .setFooter({ text: 'vota con las reacciones' })
            .setTimestamp();

        const mensaje = await canal.send({ embeds: [embed] });
        await mensaje.react('👍');
        await mensaje.react('👎');

        await interaction.reply({ embeds: [embedExito(`sugerencia enviada a ${canal}`)], flags: MessageFlags.Ephemeral });
    },
};
