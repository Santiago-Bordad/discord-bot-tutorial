// template practica: panel con un boton que da un rol al apretarlo
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { embedInfo, embedExito } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verificar-panel')
        .setDescription('manda el panel de verificacion')
        .addRoleOption((option) =>
            option.setName('rol').setDescription('rol que se da al verificarse').setRequired(true),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const rol = interaction.options.getRole('rol');

        // guardamos el id del rol adentro del customId -> "verificar:123456789"
        // asi el boton sabe que rol dar sin guardar nada en una base de datos
        const boton = new ButtonBuilder()
            .setCustomId(`verificar:${rol.id}`)
            .setLabel('verificarme')
            .setEmoji('✅')
            .setStyle(ButtonStyle.Success);

        await interaction.channel.send({
            embeds: [embedInfo('apreta el boton para verificarte y ver el resto del servidor')],
            components: [new ActionRowBuilder().addComponents(boton)],
        });

        await interaction.reply({ embeds: [embedExito('panel enviado')], flags: MessageFlags.Ephemeral });
    },
};