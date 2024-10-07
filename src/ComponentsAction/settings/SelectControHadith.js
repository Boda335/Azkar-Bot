const ControlHadith = require("@utils/functions/ControlHadith");
const SendHadith = require("@utils/functions/sendHadith"); 
const { ButtonStyle, ButtonBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AnySelectMenuInteraction, ChannelType, EmbedBuilder } = require("discord.js");

/**
 * @type {import("@utils/types/baseComponent")}
 */
module.exports = {
  name: "SelectHadith",
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
      let data = await db.get(`${interaction.guildId}_hadithChannel`);

      let values = interaction.values

      switch (action) {
        case "list": {

          await db.set(`${interaction.guildId}_hadithChannel..category`, values);

          let dat2 = await db.get(`${interaction.guildId}_hadithChannel`);
          interaction.editReply(ControlHadith(client, dat2));

          break;
        }
        case "timeOptions": {

          await db.set(`${interaction.guildId}_hadithChannel..msgTimeSend`, values[0]);

          let dat2 = await db.get(`${interaction.guildId}_hadithChannel`);
          interaction.editReply(ControlHadith(client, dat2));

          break;
        }
        case "roles": {
          await db.set(`${interaction.guildId}_hadithChannel..roles`, values);
          let dat2 = await db.get(`${interaction.guildId}_hadithChannel`);
          interaction.editReply(ControlHadith(client, dat2));
          break;
        }

        case "test": {

          let channel = interaction.guild.channels.cache.get(data?.channelId)

          if (!channel) return interaction.followUp({
            content: "❌ | cant find Hadith Channel | **لا يمكن العثور علي القناه الذي تم تعينها**",
            ephemeral: true
          })

          if (data?.catogory?.length == 0) return interaction.followUp({
            content: "❌ | Please choose category | **من فضلك قم بتحديد الفئات**",
            ephemeral: true
          })

          if (!data?.enabled) return interaction.followUp({
            content: "❌ | Please enable Hadith Channel first | **من فضلك تشغيل بتفعيل الاحاديث اولا**",
            ephemeral: true
          });

          let done = await SendHadith(client, interaction.guild, data, true);
          if (done) interaction.followUp({
            content: "✅ | Hadith Channel send successfully | **تم ارسال الاحاديث بنجاح**", ephemeral: true
          });
          // Todo : play Hadith test function {}
          break;
        }

        case "setChannel": {

          await db.set(`${interaction.guildId}_hadithChannel..channelId`, values[0]);
          let dat2 = await db.get(`${interaction.guildId}_hadithChannel`);
          interaction.editReply(ControlHadith(client, dat2));

          break;
        }
        case "OnOff": {
          let enabled = data?.enabled

          await db.set(`${interaction.guildId}_hadithChannel..enabled`, !enabled);
          let dat2 = await db.get(`${interaction.guildId}_hadithChannel`);

          if (enabled) {
            clearTimeout(client.Hadith.get(interaction.guild.id));
            client.Hadith.delete(interaction.guild.id);
          }
          else SendHadith(client, interaction.guild, dat2);

          interaction.editReply(ControlHadith(client, dat2));
          break;
        }
        case "EmbedOnOff": {
          let enabledEmbed = data?.embed

          await db.set(`${interaction.guildId}_hadithChannel..embed`, !enabledEmbed);
          let dat2 = await db.get(`${interaction.guildId}_hadithChannel`);
          interaction.editReply(ControlHadith(client, dat2));
          break;
        }
      }



    } catch (err) {
      console.log(err);
    }
  },
};