// template practica: panel donde cada uno elige sus roles de un menu
const {
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    PermissionFlagsBits,
    MessageFlags,
} = require('discord.js');
const { embedInfo, embedExito } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoroles-panel')
        .setDescription('manda un menu para que cada uno elija sus roles')
        .addRoleOption((option) => option.setName('rol1').setDescription('rol 1').setRequired(true))
        .addRoleOption((option) => option.setName('rol2').setDescription('rol 2'))
        .addRoleOption((option) => option.setName('rol3').setDescription('rol 3'))
        .addRoleOption((option) => option.setName('rol4').setDescription('rol 4'))
        .addRoleOption((option) => option.setName('rol5').setDescription('rol 5'))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        // juntamos los roles que se pusieron (los opcionales pueden venir vacios)
        const roles = ['rol1', 'rol2', 'rol3', 'rol4', 'rol5']
            .map((nombre) => interaction.options.getRole(nombre))
            .filter(Boolean);

        // una opcion por rol, el value es el id
        const menu = new StringSelectMenuBuilder()
            .setCustomId('autoroles')
            .setPlaceholder('elegi tus roles')
            .setMinValues(0)              // 0 = puede sacarse todos
            .setMaxValues(roles.length)   // puede elegir todos
            .addOptions(roles.map((rol) => ({ label: rol.name, value: rol.id })));

        await interaction.channel.send({
            embeds: [embedInfo('elegi tus roles en el menu. lo que no elijas se te saca')],
            components: [new ActionRowBuilder().addComponents(menu)],
        });

        await interaction.reply({ embeds: [embedExito('panel enviado')], flags: MessageFlags.Ephemeral });
    },
};