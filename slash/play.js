const { SlashCommandBuilder} = require('@discordjs/builders')
const { MessageEmbeded} = require('discord.js')
const { QueryType } = require('discord-player')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('Play')
        .setDescription('Loads songs')
        .addSubcommand((subcommand)=>
            subcommand.setName('song')
                .setDescription('loads a single song from a url')
                .addStringOption((Option) => Option.setName('url').setDescription('The songs url').setRequired(True)))
                
             
}