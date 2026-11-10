const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    once: false, // se ejecuta con cada mensaje

    async execute(message, client) {
        // ignoramos bots y mensajes que no empiezan con el prefijo
        if (message.author.bot) return;
        if (!message.content.startsWith(client.prefix)) return;

        // "!say hola mundo" -> nombre: "say", args: ["hola", "mundo"]
        const args = message.content.slice(client.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // buscamos el comando, si no existe no hacemos nada
        const command = client.commands.get(commandName);
        if (!command) return;

        // ejecutamos el comando y si falla avisamos
        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(error);
            await message.reply('❌ hubo un error ejecutando el comando');
        }
    },
};