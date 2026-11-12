// template de referencia: un modal con todos los tipos de campos
const {
    SlashCommandBuilder,
    ModalBuilder,
    LabelBuilder,
    TextDisplayBuilder,
    TextInputBuilder,
    TextInputStyle,
    StringSelectMenuBuilder,
    FileUploadBuilder,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modal-ejemplo')
        .setDescription('abre un formulario con todos los tipos de campos'),

    async execute(interaction) {
        // el modal en si: titulo arriba (max 45) y customId para reconocerlo
        const modal = new ModalBuilder()
            .setCustomId('modal-ejemplo')
            .setTitle('formulario de ejemplo');

        // 1. texto fijo, solo para leer (acepta markdown)
        const intro = new TextDisplayBuilder()
            .setContent('### hola!\ncompleta los campos, los que tienen * son obligatorios');

        // 2. texto corto (una linea)
        const nombre = new LabelBuilder()
            .setLabel('nombre')                          // titulo del campo (max 45)
            .setDescription('como queres que te digan')   // texto chico abajo (max 100)
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId('nombre')               // con esto se lee la respuesta
                    .setStyle(TextInputStyle.Short)      // una linea
                    .setPlaceholder('ej: santi')         // texto gris de ayuda (max 100)
                    .setMinLength(2)
                    .setMaxLength(32)                    // max 4000
                    .setRequired(true),
            );

        // 3. texto largo (varias lineas)
        const mensaje = new LabelBuilder()
            .setLabel('mensaje')
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId('mensaje')
                    .setStyle(TextInputStyle.Paragraph)  // varias lineas
                    .setValue('texto que ya viene escrito') // valor inicial
                    .setRequired(false),
            );

        // 4. menu de opciones (tambien se pueden usar los de usuarios, roles y canales)
        const comida = new LabelBuilder()
            .setLabel('comida favorita')
            .setStringSelectMenuComponent(
                new StringSelectMenuBuilder()
                    .setCustomId('comida')
                    .setPlaceholder('elegi una')
                    .addOptions(
                        { label: 'pizza', value: 'pizza', emoji: '🍕' },
                        { label: 'asado', value: 'asado', emoji: '🥩' },
                        { label: 'milanesa', value: 'milanesa', emoji: '🍽️' },
                    ),
            );

        // 5. subir archivos
        const archivo = new LabelBuilder()
            .setLabel('archivo')
            .setDescription('opcional, max 1')
            .setFileUploadComponent(
                new FileUploadBuilder()
                    .setCustomId('archivo')
                    .setMaxValues(1)
                    .setRequired(false),
            );

        // max 5 componentes por modal (contando el texto fijo)
        modal
            .addTextDisplayComponents(intro)
            .addLabelComponents(nombre, mensaje, comida, archivo);

        // showModal tiene que ser la PRIMERA respuesta (no se puede usar despues de reply o defer)
        await interaction.showModal(modal);
    },
};