const ControlAyat = require("@utils/functions/ControlAyat");
const SendAyat = require("@utils/functions/sendAyat");
const { ButtonStyle, ButtonBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AnySelectMenuInteraction, ChannelType, EmbedBuilder } = require("discord.js");

/**
 * @type {import("@utils/types/baseComponent")}
 */
module.exports = {
  name: "SelectAyat",
  enabled: true,
  /**
   * @param {AnySelectMenuInteraction} interaction 
   */
  async action(client, interaction, parts, lang) {
    try {
      await interaction.deferUpdate()
      await client.wait(200)
      const config = client.config
      const db = await client.db.table("channels");
      const action = parts[1];
      let data = await db.get(`${interaction.guildId}_ayatChannel`);

      let values = interaction.values

      switch (action) {
        case "timeOptions": {

          await db.set(`${interaction.guildId}_ayatChannel..msgTimeSend`, values[0]);

          let data2 = await db.get(`${interaction.guildId}_ayatChannel`);
          interaction.editReply(ControlAyat(client, data2));

          break;
        }
        case "roles": {
          await db.set(`${interaction.guildId}_ayatChannel..roles`, values);
          let data2 = await db.get(`${interaction.guildId}_ayatChannel`);
          interaction.editReply(ControlAyat(client, data2));
          break;
        }

        case "test": {

          let channel = interaction.guild.channels.cache.get(data?.channelId)

          if (!channel) return interaction.followUp({
            content: "❌ | cant find Ayat Channel | **لا يمكن العثور علي القناه الذي تم تعينها**",
            ephemeral: true
          })

          if (!data?.enabled) return interaction.followUp({
            content: "❌ | Please enable Ayat Channel first | **من فضلك تشغيل بتفعيل الأيات اولا**",
            ephemeral: true
          });

          let done = await SendAyat(client, interaction.guild, data, true);
          if (done) interaction.followUp({
            content: "✅ | Ayat Channel send successfully | **تم ارسال الأيات بنجاح**", ephemeral: true
          });
          // Todo : play Ayat test function {}
          break;
        }

        case "setChannel": {

          await db.set(`${interaction.guildId}_ayatChannel..channelId`, values[0]);
          let data2 = await db.get(`${interaction.guildId}_ayatChannel`);
          interaction.editReply(ControlAyat(client, data2));

          break;
        }
        case "OnOff": {
          let enabled = data?.enabled;
        
          await db.set(`${interaction.guildId}_ayatChannel..enabled`, !enabled);
          let data2 = await db.get(`${interaction.guildId}_ayatChannel`);
        
          if (enabled) {
            if (client.Ayat.has(interaction.guild.id)) {
              clearTimeout(client.Ayat.get(interaction.guild.id));
              client.Ayat.delete(interaction.guild.id);
            }
          } else {
            SendAyat(client, interaction.guild, data2);
          }
        
          interaction.editReply(ControlAyat(client, data2));
          break;
        }
        case "EmbedOnOff": {
          let enabledEmbed = data?.embed

          await db.set(`${interaction.guildId}_ayatChannel..embed`, !enabledEmbed);
          let data2 = await db.get(`${interaction.guildId}_ayatChannel`);
          interaction.editReply(ControlAyat(client, data2));
          break;
        }
      }


    } catch (err) {
      console.log(err);
    }
  },
};