// template practica: /sugerencia abre un formulario y la manda al canal de sugerencias
const { SlashCommandBuilder, ModalBuilder, LabelBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sugerencia')
        .setDescription('manda una sugerencia para el servidor'),

    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('sugerencia')
            .setTitle('nueva sugerencia')
            .addLabelComponents(
                new LabelBuilder()
                    .setLabel('titulo')
                    .setTextInputComponent(
                        new TextInputBuilder()
                            .setCustomId('titulo')
                            .setStyle(TextInputStyle.Short)
                            .setMaxLength(100)
                            .setRequired(true),
                    ),
                new LabelBuilder()
                    .setLabel('descripcion')
                    .setDescription('explica tu idea con detalle')
                    .setTextInputComponent(
                        new TextInputBuilder()
                            .setCustomId('descripcion')
                            .setStyle(TextInputStyle.Paragraph)
                            .setMinLength(10)
                            .setMaxLength(1000)
                            .setRequired(true),
                    ),
            );

        await interaction.showModal(modal);
    },
};