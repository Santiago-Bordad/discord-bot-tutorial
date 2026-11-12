// responde a todos los menus que empiezan con "menu-ejemplo:"
const { MessageFlags } = require('discord.js');

module.exports = {
    customId: 'menu-ejemplo',

    async execute(interaction, args) {
        // "menu-ejemplo:usuarios" -> args = ['usuarios']
        const [tipo] = args;

        let elegido;

        // interaction.values = array con lo que se eligio (values o ids)
        if (interaction.isStringSelectMenu()) {
            elegido = interaction.values.join(', ');
        } else {
            // en los otros menus values son ids, asi que los mostramos como menciones
            // users, roles y channels son collections con los objetos completos
            const todos = [
                ...(interaction.users?.values() ?? []),
                ...(interaction.roles?.values() ?? []),
                ...(interaction.channels?.values() ?? []),
            ];
            elegido = todos.map((x) => `${x}`).join(', ');
        }

        await interaction.reply({
            content: `en el menu **${tipo}** elegiste: ${elegido || 'nada'}`,
            flags: MessageFlags.Ephemeral,
        });
    },
};