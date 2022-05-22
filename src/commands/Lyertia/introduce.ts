import { Command } from '../../interfaces'
import { SlashCommandBuilder } from '@discordjs/builders'
const { Modal, TextInputComponent, showModal } = require('discord-modals')

export const command: Command = {
  data: new SlashCommandBuilder().setName('introduction').setDescription('Introduce Your Self'),
  run: async (interaction) => {
    const form = new Modal()
      .setCustomId('application' + interaction.user.id)
      .setTitle('Introduce Your Self')
      .addComponents(
        new TextInputComponent()
          .setCustomId('question1' + interaction.user.id)
          .setLabel('✏️ Say Something About Your Self ✏️')
          .setStyle('LONG') // SHORT or LONG
          .setMinLength(4)
          .setMaxLength(4000)
          .setPlaceholder('Hey! everyone I am Interstaller I Love To Hang Out ..........')
          .setRequired(true)
      )
      .addComponents(
        new TextInputComponent()
          .setCustomId('question2' + interaction.user.id)
          .setLabel('🔗 Where We Can Find Your Work (optional)')
          .setStyle('SHORT') // SHORT or LONG
          .setMinLength(4)
          .setMaxLength(100)
          .setPlaceholder('https://discord.gg/HnUTGSeH3n')
          .setRequired(false)
      )
    
    /// you can add more questions here

    showModal(form, {
      client: interaction.client,
      interaction: interaction,
    })
  },
}
