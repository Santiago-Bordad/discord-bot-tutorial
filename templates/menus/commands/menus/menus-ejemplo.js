// template de referencia: los 5 tipos de select menus
const {
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    UserSelectMenuBuilder,
    RoleSelectMenuBuilder,
    ChannelSelectMenuBuilder,
    MentionableSelectMenuBuilder,
    ChannelType,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('menus-ejemplo')
        .setDescription('muestra todos los tipos de menus'),

    async execute(interaction) {
        // 1. menu de texto: las opciones las inventas vos (max 25)
        const texto = new StringSelectMenuBuilder()
            .setCustomId('menu-ejemplo:texto')        // id del menu (max 100)
            .setPlaceholder('elegi tu comida favorita') // texto gris cuando no hay nada elegido (max 150)
            .setMinValues(1)                          // minimo de opciones a elegir
            .setMaxValues(2)                          // maximo de opciones a elegir
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('pizza')                // lo que se ve (max 100)
                    .setValue('pizza')                // lo que recibe el bot (max 100)
                    .setDescription('con muzzarella') // texto chico abajo (max 100)
                    .setEmoji('🍕'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('asado')
                    .setValue('asado')
                    .setEmoji('🥩')
                    .setDefault(true),                // viene elegida de entrada
                new StringSelectMenuOptionBuilder()
                    .setLabel('milanesa')
                    .setValue('milanesa')
                    .setEmoji('🍽️'),
            );

        // 2. menu de usuarios: discord pone la lista solo
        const usuarios = new UserSelectMenuBuilder()
            .setCustomId('menu-ejemplo:usuarios')
            .setPlaceholder('elegi usuarios')
            .setMaxValues(3);

        // 3. menu de roles
        const roles = new RoleSelectMenuBuilder()
            .setCustomId('menu-ejemplo:roles')
            .setPlaceholder('elegi un rol');

        // 4. menu de canales (se puede filtrar por tipo)
        const canales = new ChannelSelectMenuBuilder()
            .setCustomId('menu-ejemplo:canales')
            .setPlaceholder('elegi un canal de texto')
            .addChannelTypes(ChannelType.GuildText);

        // 5. menu de usuarios y roles juntos
        const mencionables = new MentionableSelectMenuBuilder()
            .setCustomId('menu-ejemplo:mencionables')
            .setPlaceholder('elegi usuarios o roles')
            .setMaxValues(5);

        // cada menu ocupa una fila entera (max 5 filas por mensaje)
        await interaction.reply({
            content: 'proba los menus:',
            components: [texto, usuarios, roles, canales, mencionables].map((menu) =>
                new ActionRowBuilder().addComponents(menu),
            ),
        });
    },
};