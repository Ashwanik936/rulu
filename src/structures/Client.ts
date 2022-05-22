import '../utils/string.extensions'
const { Formatters } = require('discord.js');
import Discord from 'discord.js'
import { Client, Collection, Intents, MessageEmbed } from 'discord.js'
import path from 'path'
import { readdirSync } from 'fs'
import { Command, Event, Config } from '../interfaces'
const discordModals = require('discord-modals')
const { format, parse } = require('date-and-time')
import config from '../config'

export default class InfernoClient extends Client {
  public commands: Collection<string, Command> = new Collection()
  public events: Collection<string, Event> = new Collection()
  public aliases: Collection<string, Command> = new Collection()

  public constructor() {
    super({
      intents: [
        [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES],
      ],
      presence: {
        status: 'idle',
        activities: [{ name: 'My God Interstaller', type: 'WATCHING' }],
      },
      partials: ['MESSAGE', 'REACTION', 'CHANNEL'],
    })
  }

  public async init() {
    /* Commands */
    const commandPath = path.join(__dirname, '..', 'commands')
    readdirSync(commandPath).forEach((dir) => {
      const commands = readdirSync(`${commandPath}/${dir}`).filter((file) => file.endsWith('.ts'))

      for (const file of commands) {
        const { command } = require(`${commandPath}/${dir}/${file}`)
        this.commands.set(command.data.name, command)
      }
    })

    /* Events */
    const eventPath = path.join(__dirname, '..', 'events')
    readdirSync(eventPath).forEach(async (file) => {
      const { event } = await import(`${eventPath}/${file}`)
      this.events.set(event.name, event)
      this.on(event.name, event.run.bind(null, this))
    })

    this.login(config.BOT_TOKEN)
    discordModals(this)

    this.on('modalSubmit', (modal) => {
      const logs = this.channels.cache.get(config.APPLICATIONS_LOG_CHANNEL) as Discord.TextChannel
      if (!logs) return console.log('Cannot find log channel')
      const answer1 = modal.getTextInputValue('question1' + modal.user.id)
      const answer2 = modal.getTextInputValue('question2' + modal.user.id)
      const img = modal.getTextInputValue('question2')
      //if you added more questions, you can add them answers here
      const Cool = "<#977879706483458088>";
      modal.reply({ content: 'Congrats! Your Intro Shared in ' + Cool , ephemeral: true });
      let result: string = `**About Me** \n  ${answer1}   \n 
        **Find My Work Here** \n  ${answer2} `
     

      const embed = new MessageEmbed()
      .setColor('#2F3136')
         .setAuthor({ name: modal.user.tag , iconURL: 'https://cdn.discordapp.com/avatars/'+modal.user.id+"/"+ modal.user.avatar+".jpeg"})
        .setDescription(result)
        .setImage('')
        .setTimestamp()
        .setFooter({ text: 'Made by Interstaller :D' })

      logs.send({ embeds: [embed] })
    })
  }
}





