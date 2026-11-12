const { Events, MessageFlags } = require('discord.js');

// responde con un error sin importar si ya se habia respondido o no
async function responderError(interaction) {
    const respuesta = { content: '❌ hubo un error', flags: MessageFlags.Ephemeral };
    if (interaction.replied || interaction.deferred) await interaction.followUp(respuesta);
    else await interaction.reply(respuesta);
}

module.exports = {
    name: Events.InteractionCreate,
    once: false,

    async execute(interaction, client) {
        try {
            // --- slash commands ---
            if (interaction.isChatInputCommand()) {
                const command = client.commands.get(interaction.commandName);
                if (command) await command.execute(interaction, client);
                return;
            }

            // --- botones ---
            if (interaction.isButton()) {
                // "verificar:123" -> nombre: "verificar", args: ["123"]
                const [nombre, ...args] = interaction.customId.split(':');
                const button = client.buttons.get(nombre);
                if (button) await button.execute(interaction, args, client);
                return;
            }
        } catch (error) {
            console.error(error);
            await responderError(interaction);
        }
    },
}; 