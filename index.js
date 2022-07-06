const Discord = require('discord.js')
const dotenv = require('dotenv')

const { Player } = require('@discord-player') 

// Anväds för alla kommandon
const { REST } = require('@discordjs/rest')
const { ROUTES } = require('@discord-api-types/v9')

// anväds för att läsa filer
const fs = require('fs')
 
const LOAD_SLASH = process.argv[2] == 'load'
dotenv.config()

//token, guildid, clientid
const TOKEN = process.env.TOKEN
const CLIENT_ID = '994374192004866068'
const GUILD_ID = '807639483457208350'

const client = new Discord.client({
    intents: [
        'GUILDS',
        'GUILD_VOICE_STATE'
    ]
})

client.slashcommand = new Discord.Collection()
// det som spelar upp låtar
client.player = new Player(client,{
    ytdlOptions: {
        // gör så att det är hög kvalitet och bara ljud
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    }
})

let commands = []

const slashFiles = fs.readFileSync('./slash').filter(file.endsWith('.js')) 
for (const  file of slashFiles){
    const slashcmd = require(`./slash/${file}`)
    client.slashcommand.set(slashcmd.data.name, slashcmd)
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

// deployar slash commands
if (LOAD_SLASH) {
    const rest = new REST({version: '9'}).setToken(TOKEN)
    console.log('Deploying slash commands')
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body:commands})
    .then(() => {
        console.log('Loaded :)')
        process.exit(0)
    })
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })
}
else {
    client.on('ready', () => {
        console.log(`logged in as ${client.user.tag}`)
    })
    client.on('interactioncreate', (interaction) => {
        async function handleCommand(){
            if (!interaction.isCommand()) return

            const slashcmd = client.slashcommand.get(interaction.commandName)
            if (!slashcmd) interaction.reply('Not a valid slash command')

            await interaction.deferReply()
            await slashcmd.run({client,interaction})
        }
        handleCommand()
    })
    client.login(TOKEN)
}
