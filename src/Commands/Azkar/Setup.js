const ControlAzkar = require('@root/src/utils/functions/ControlAzkar');
const ControlAyat = require('@root/src/utils/functions/ControlAyat');
const ControlHadith = require('@root/src/utils/functions/ControlHadith');
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, ChannelSelectMenuBuilder, ChannelType, ApplicationCommandOptionType } = require('discord.js');

/**
 * @type {import("@utils/types/baseCommand")}
 */
module.exports = {
  name: "setup",
  description: "setup radio channel",
  category: "ADMIN",
  botPermissions: ["ManageChannels"],
  userPermissions: ["ManageChannels"],
  cooldown: 1000,
  command: {
    enabled: false,
    minArgsCount: 1,
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "ayat",
        description: "to setup ayat channel",
        type: ApplicationCommandOptionType.Subcommand
      },
      {
        name: "azkar",
        description: "to setup azkar channel",
        type: ApplicationCommandOptionType.Subcommand
      },
      {
        name: "hadith",
        description: "to setup hadith channel",
        type: ApplicationCommandOptionType.Subcommand
      }
    ],
  },

  async msgExecute(client, message, args, lang) {
    try {

    } catch (err) {
      console.log(err)
    }

  },

  async interactionExecute(client, interaction, lang) {
    try {
      const db = await client.db.table("channels");

      const Subcommand = interaction.options.getSubcommand()
      let config = client.config

      switch (Subcommand) {

        case "azkar": {

          let data = await db.get(`${interaction.guildId}_azkarChannel`) || null
          let channel = interaction.guild.channels.cache.get(data?.channelId) || null

          let embed = new EmbedBuilder()
            .setColor("White")
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL(), url: config.NexusLink })
            .setThumbnail(client.user.avatarURL({ size: 2048 }))
            .setTitle("قائمه تسطيب قناه الأذكار ")
            .setDescription("يمكنك  تحديد قاناه ارسال الاذكار")
            .setFooter({ text: config.Copyright.text, iconURL: config.Copyright.logo })

          let Menu_setChannel = new ChannelSelectMenuBuilder()
            .setCustomId("set_AzkarChannel")
            .setPlaceholder("Setup Azkar Channel")
            .setChannelTypes(ChannelType.GuildText)
          
          let rowMenu = new ActionRowBuilder().addComponents(Menu_setChannel);

          if (channel?.id) return interaction.reply({
            ...ControlAzkar(client, data),
            ephemeral: true
          })

          interaction.reply({ embeds: [embed], components: [rowMenu], ephemeral: true });
          break;
        }
        case "ayat": {

          let data = await db.get(`${interaction.guildId}_ayatChannel`) || null
          let channel = interaction.guild.channels.cache.get(data?.channelId) || null

          let embed = new EmbedBuilder()
            .setColor("White")
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL(), url: config.NexusLink })
            .setThumbnail(client.user.avatarURL({ size: 2048 }))
            .setTitle("قائمه تسطيب قناه أيات القرآن الكريم ")
            .setDescription("يمكنك  تحديد قاناه ارسال الايات")
            .setFooter({ text: config.Copyright.text, iconURL: config.Copyright.logo })

          let Menu_setChannel = new ChannelSelectMenuBuilder()
            .setCustomId("set_AyatChannel")
            .setPlaceholder("Setup Ayat Channel")
            .setChannelTypes(ChannelType.GuildText)
          
          let rowMenu = new ActionRowBuilder().addComponents(Menu_setChannel);

          if (channel?.id) return interaction.reply({
            ...ControlAyat(client, data),
            ephemeral: true
          })

          interaction.reply({ embeds: [embed], components: [rowMenu], ephemeral: true });
          break;
        }
        case "hadith": {

          let data = await db.get(`${interaction.guildId}_hadithChannel`) || null
          let channel = interaction.guild.channels.cache.get(data?.channelId) || null

          let embed = new EmbedBuilder()
            .setColor("White")
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL(), url: config.NexusLink })
            .setThumbnail(client.user.avatarURL({ size: 2048 }))
            .setTitle("قائمه تسطيب قناه الاحاديث")
            .setDescription("يمكنك  تحديد قاناه ارسال الاحاديث ")
            .setFooter({ text: config.Copyright.text, iconURL: config.Copyright.logo })

          let Menu_setChannel = new ChannelSelectMenuBuilder()
            .setCustomId("set_HadithChannel")
            .setPlaceholder("Setup Hadith Channel")
            .setChannelTypes(ChannelType.GuildText)
          
          let rowMenu = new ActionRowBuilder().addComponents(Menu_setChannel);

          if (channel?.id) return interaction.reply({
            ...ControlHadith(client, data),
            ephemeral: true
          })

          interaction.reply({ embeds: [embed], components: [rowMenu], ephemeral: true });
          break;
        }
        
      }

    } catch (err) {
      console.log(err.message);
    }

  },
};