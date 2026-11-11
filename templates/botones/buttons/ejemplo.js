// responde a todos los botones que empiezan con "ejemplo:"
const { MessageFlags } = require('discord.js');

module.exports = {
    customId: 'ejemplo', // lo que va antes de los ":" en el customId

    async execute(interaction, args) {
        // "ejemplo:primario" -> args = ['primario']
        const [tipo] = args;

        // el de peligro edita el mensaje original y saca los botones
        if (tipo === 'peligro') {
            return interaction.update({
                content: `💥 ${interaction.user} apreto peligro, se acabaron los botones`,
                components: [],
            });
        }

        // el resto responde solo a quien lo apreto
        await interaction.reply({
            content: `apretaste el boton **${tipo}**`,
            flags: MessageFlags.Ephemeral,
        });
    },
};