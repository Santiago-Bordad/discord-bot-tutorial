// responde cuando se envia el formulario de ejemplo
const { EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    customId: 'modal-ejemplo',

    async execute(interaction) {
        // leemos cada campo por su customId
        const nombre = interaction.fields.getTextInputValue('nombre');
        const mensaje = interaction.fields.getTextInputValue('mensaje');      // '' si lo dejo vacio
        const [comida] = interaction.fields.getStringSelectValues('comida');  // array con lo elegido
        const archivos = interaction.fields.getUploadedFiles('archivo');      // collection o null

        const embed = new EmbedBuilder()
            .setColor(0x5865f2)
            .setTitle('respuestas del formulario')
            .addFields(
                { name: 'nombre', value: nombre },
                { name: 'mensaje', value: mensaje || '*vacio*' },
                { name: 'comida', value: comida ?? '*no eligio*' },
                { name: 'archivo', value: archivos?.first()?.url ?? '*no subio*' },
            );

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    },
};
