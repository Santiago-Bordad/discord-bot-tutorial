// ejemplo de comando con cooldown propio
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    // segundos que hay que esperar entre usos (si no se pone, usa el default de utils/cooldowns.js)
    cooldown: 10,

    data: new SlashCommandBuilder()
        .setName('dado')
        .setDescription('tira un dado')
        .addIntegerOption((option) =>
            option.setName('caras').setDescription('cantidad de caras (default 6)').setMinValue(2).setMaxValue(100),
        ),

    async execute(interaction) {
        const caras = interaction.options.getInteger('caras') ?? 6;
        const resultado = Math.floor(Math.random() * caras) + 1;

        await interaction.reply(`🎲 salio **${resultado}** (dado de ${caras})`);
    },
};