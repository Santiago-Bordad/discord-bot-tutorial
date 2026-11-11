// template de referencia: todos los estilos de botones
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botones-ejemplo')
        .setDescription('muestra todos los tipos de botones'),

    async execute(interaction) {
        // fila 1: los 4 estilos que se pueden apretar
        const fila1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('ejemplo:primario')   // id con el que lo reconoce el bot (max 100)
                .setLabel('primario')              // texto del boton (max 80)
                .setStyle(ButtonStyle.Primary),    // azul

            new ButtonBuilder()
                .setCustomId('ejemplo:secundario')
                .setLabel('secundario')
                .setStyle(ButtonStyle.Secondary),  // gris

            new ButtonBuilder()
                .setCustomId('ejemplo:exito')
                .setLabel('exito')
                .setEmoji('✅')                    // emoji a la izquierda del texto
                .setStyle(ButtonStyle.Success),    // verde

            new ButtonBuilder()
                .setCustomId('ejemplo:peligro')
                .setLabel('peligro')
                .setStyle(ButtonStyle.Danger),     // rojo
        );

        // fila 2: link y deshabilitado
        const fila2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('link')
                .setURL('https://discord.js.org')  // los de link NO llevan customId
                .setStyle(ButtonStyle.Link),       // gris con flechita, abre la pagina

            new ButtonBuilder()
                .setCustomId('ejemplo:deshabilitado')
                .setLabel('deshabilitado')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),                // no se puede apretar
        );

        // components siempre va como array de filas (max 5 filas, max 5 botones por fila)
        await interaction.reply({
            content: 'apreta un boton:',
            components: [fila1, fila2],
        });
    },
};