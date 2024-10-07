const ControlHadith = require("@root/src/utils/functions/ControlHadith");
const { category } = require("@root/src/utils/types/baseCommand");
const { ButtonStyle, ButtonBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType } = require("discord.js");
const ms = require("ms");

/**
 * @type {import("@utils/types/baseComponent")}
 */
module.exports = {
  name: "set_HadithChannel",
  enabled: true,
  /**
   * @param {import("discord.js").ChannelSelectMenuInteraction} interaction 
   */
  async action(client, interaction, parts, lang) {
    try {

      const db = await client.db.table("channels");
      await interaction.deferUpdate()
      let channel = interaction.channels.first()
      if (!channel) return interaction.reply({
        content: "❌ | لم يتم العثور علي القناه ",
        ephemeral: true
      })

      let data = await db.get(`${interaction.guildId}_hadithChannel`)


      let isChannel = await db.get(`${interaction.guildId}_hadithChannel`)

      if (isChannel?.channelId === channel.id) return interaction.reply({
        content: ":warning: | هذه القناه تم تعينها بالفعل من قبل ",
        ephemeral: true
      })

      await db.set(`${interaction.guildId}_hadithChannel`, {
        channelId: channel.id,
        guildId: interaction.guildId,
        enabled: data?.enabled || false,
        msgTimeSend: data?.msgTimeSend || "10m",
        category: data?.category || [],
        roles: data?.roles || [],
        lastSned: data?.lastSned || 0
      })

      let dat2 = await db.get(`${interaction.guildId}_hadithChannel`)
      let gg = ControlHadith(client, dat2)

      interaction.editReply({
        ...gg,
        ephemeral: true
      })


    } catch (err) {
      console.log(err)
    }
  },
};