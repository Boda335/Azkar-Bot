// Import necessary classes from discord.js
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

/**
 * @type {import("@utils/types/baseCommand")}
 */
module.exports = {
  // Command configuration
  name: "quran",
  description: "ابدأ بقراءة القرآن الكريم",
  category: "PUBLIC",
  botPermissions: ["SendMessages"],
  userPermissions: ["SendMessages"],
  cooldown: 1000,
  command: { enabled: true, minArgsCount: 1 },
  slashCommand: {
    enabled: true,
  },

  // Message command execution
  async msgExecute(client, message, args, lang) {
    try {

    } catch (err) {
      console.log(err)
    }

  },

  // Slash command execution
  async interactionExecute(client, interaction) {
    try {
      // Get specified user or default to interaction user
        let config = client.config
      // Create and send embed
      const embed = new EmbedBuilder()
        .setTitle(`ابدء بقراءة القرآن الكريم`)
        .setColor("White")
        .setTimestamp()
        .setFooter({ text: config.Copyright.text, iconURL: config.Copyright.logo })
        .setImage("https://b.top4top.io/p_3203axez41.png"); // Add your image URL here

      let btn = new ButtonBuilder()
        .setCustomId("mushaf")
        .setLabel("اقرأ")
        .setStyle(ButtonStyle.Success)
        .setEmoji("1282595085405388852");

      let row = new ActionRowBuilder()
        .addComponents(btn);

      await interaction.reply({ embeds: [embed], components: [row] });

    } catch (err) {
      console.log(err);
    }
  },
};
