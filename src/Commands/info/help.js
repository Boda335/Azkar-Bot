const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");



/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction | import("discord.js").Message } interaction 
 * @returns {import("discord.js").MessageReplyOptions}
 */
function help(interaction) {
  let em = new EmbedBuilder()
    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
    .setColor("White")
    .setTimestamp()
    .setThumbnail(interaction.client.user.displayAvatarURL())
    .setTitle("Help Commands | قائمة الاوامر ")
    .addFields([
      { name: "/help", value: "Shows this message || اوامر المساعدة", inline: false },
      { name: "/ping", value: "Shows bot ping || البنج", inline: false },
      { name: "/setup azkar", value: "setup azkar channel || تسطيب الاذكار", inline: false },
      { name: "/setup ayat", value: "setup ayat channel || تسطيب الايات", inline: false },
      { name: "/setup hadith", value: "setup hadith channel || تسطيب الاحاديث", inline: false },
    ])
    .setFooter({
      text: interaction.author ? `Requested by ${interaction.author.globalName}` : `Requested by ${interaction.member.user.globalName}`,
      iconURL: interaction.author ? interaction.author.displayAvatarURL() : interaction.member.user.displayAvatarURL()
    })

  let btnInvite = new ButtonBuilder()
    .setURL(`https://discord.com/oauth2/authorize?client_id=1110669204295790703`)
    .setStyle("Link")
    .setLabel("Invite Me")
  let btnSupport = new ButtonBuilder()
    .setURL("https://discord.gg/Wn6z6yD7n3")
    .setStyle("Link")
    .setLabel("Support Server")
  let btnStatus = new ButtonBuilder()
    .setCustomId("status_bot")
    .setStyle("Primary")
    .setLabel("Bot Status")

  let row = new ActionRowBuilder().addComponents(btnInvite, btnSupport, btnStatus)

  return { embeds: [em], components: [row] }
}


/**
 * @type {import("@utils/types/baseCommand")}
 */
module.exports = {
  name: "help",
  description: "Help commands",
  category: "UTILITY",
  botPermissions: ["SendMessages"],
  userPermissions: ["SendMessages"],
  cooldown: 1000,
  command: {
    enabled: true,
    minArgsCount: 0,
  },
  slashCommand: {
    enabled: true,
  },

  async msgExecute(client, message, args, lang) {
    try {

      message.reply(help(message))

    } catch (err) {
      console.log(err)
    }

  },

  async interactionExecute(client, interaction, lang) {
    try {

      interaction.reply(help(interaction));

    } catch (err) {
      console.log(err);
      interaction.reply({
        content: "An error occurred while executing the command",
        ephemeral: true,
      });
    }

  },
};