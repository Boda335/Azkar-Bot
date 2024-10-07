const { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType } = require("discord.js")
/**
 * 
 * @param {import("../../..")} client 
 * @param {*} data 
 * @returns {import("discord.js").MessageReplyOptions}
 */
module.exports = function (client, data) {


  let TimeOptions = [
    {
      label: "10 Minutes | 10 دقيقه",
      description: "سيقوم بالارسال كل 10 دقيقه",
      value: '10m',
      emoji: "⏰",
      default: data?.msgTimeSend == "10m" ? true : false
    },
    {
      label: "15 Minutes | 15 دقيقه",
      description: "سيقوم بالارسال كل 15 دقيقه",
      value: '15m',
      emoji: "⏰",
      default: data?.msgTimeSend == "15m" ? true : false
    },
    {
      label: "30 Minutes | 30 دقيقه",
      description: "سيقوم بالارسال كل 30 دقيقه",
      value: '30m',
      emoji: "⏰",
      default: data?.msgTimeSend == "30m" ? true : false
    },
    {
      label: "1 hours | 1 ساعه",
      description: "سيقوم بالارسال كل 1 ساعه",
      value: '1h',
      emoji: "⏰",
      default: data?.msgTimeSend == "1h" ? true : false
    },
    {
      label: "2 hours | 2 ساعتين",
      description: "سيقوم بالارسال كل 2 ساعات",
      value: '2h',
      emoji: "⏰",
      default: data?.msgTimeSend == "2h" ? true : false
    },
    {
      label: "3 hours | 3 ساعات",
      description: "سيقوم بالارسال كل 3 ساعات",
      value: '3h',
      emoji: "⏰",
      default: data?.msgTimeSend == "3h" ? true : false
    },
    {
      label: "4 hours | 4 ساعات",
      description: "سيقوم بالارسال كل 4 ساعات",
      value: '4h',
      emoji: "⏰",
      default: data?.msgTimeSend == "4h" ? true : false
    },
    {
      label: "5 hours | 5 ساعات",
      description: "سيقوم بالارسال كل 5 ساعات",
      value: '5h',
      emoji: "⏰",
      default: data?.msgTimeSend == "5h" ? true : false
    },
    {
      label: "6 hours | 6 ساعات",
      description: "سيقوم بالارسال كل 6 ساعات",
      value: '6h',
      emoji: "⏰",
      default: data?.msgTimeSend == "6h" ? true : false
    },
    {
      label: "7 hours | 7 ساعات",
      description: "سيقوم بالارسال كل 7 ساعات",
      value: '7h',
      emoji: "⏰",
      default: data?.msgTimeSend == "7h" ? true : false
    },
  ]

  let channel = client.guilds.cache.get(data.guildId)?.channels.cache.get(data.channelId) || null

  let config = client.config

  let embed = new EmbedBuilder()
    .setColor("White")
    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL(), url: config.NexusLink })
    .setThumbnail(client.user.avatarURL({ size: 2048 }))
    .setTitle("التحكم في ارسال الأيات القرآنية")
    .setFooter({ text: config.Copyright.text, iconURL: config.Copyright.logo })

  let btn = new ButtonBuilder()
    .setCustomId("SelectAyat_OnOff")

  let btnEmbed = new ButtonBuilder()
    .setCustomId("SelectAyat_EmbedOnOff")
    .setEmoji(data?.embed ? "1231310986833694772" : "1231310988469473372")
    .setLabel("Embed")
    .setStyle(ButtonStyle.Secondary)

  let btnTest = new ButtonBuilder()
    .setCustomId("SelectAyat_test")
    .setEmoji("✨")
    .setLabel("تجربة ارسال الأيات")
    .setStyle(ButtonStyle.Secondary)



  let timeOptions = new StringSelectMenuBuilder()
    .setCustomId("SelectAyat_timeOptions")
    .addOptions(TimeOptions)
    .setPlaceholder("اختر وقت الارسال خلال فتهر معينة")

  let rolesAzkar = new RoleSelectMenuBuilder()
    .setMaxValues(5)
    .setMinValues(0)
    .addDefaultRoles(data?.roles)
    .setCustomId("SelectAyat_roles")
    .setPlaceholder("اختر الادوار التي يتم اشعارها لها")

  let Menu_setChannel = new ChannelSelectMenuBuilder()
    .setCustomId("SelectAyat_setChannel")
    .setPlaceholder("Setup Azkar Channel")
    .setChannelTypes(ChannelType.GuildText)

  if (channel) Menu_setChannel.setDefaultChannels([channel?.id])


  if (data) {

    if (data.enabled) {
      embed.setDescription(`**حاله التشغيل : ✅**`)
      btn.setLabel("Ayat Status").setStyle(ButtonStyle.Success).setEmoji("1231310986833694772")
    } else {
      embed.setDescription(`**حاله التشغيل : ❌**`)
      btn.setLabel("Ayat Status").setStyle(ButtonStyle.Danger).setEmoji("1231310988469473372")
    }

    embed.addFields([
      {
        name: "Channel | الروم",
        value: `${channel?.id ? `<#${data?.channelId}>` : "`not set | لا يوجد`"}`,
      },
      {
        name: "Embed Style | مظهر الأيات",
        value: data?.embed ? "✅" : "❌",
        inline: false
      },
      {
        name: "Roles | الادوار",
        value: `${data?.roles.length > 0 ? data?.roles
          ?.map(r => `<@&${r}>`).join(",\n") : ["`not set | لا يوجد`"].join(" ")}`,
        inline: false
      },
      {
        name: "Time | الوقت",
        value: `\`${data?.msgTimeSend}\``,
        inline: false
      }
    ])




    let row1 = new ActionRowBuilder().addComponents(timeOptions)
    let row2 = new ActionRowBuilder().addComponents(rolesAzkar)
    let row3 = new ActionRowBuilder().addComponents(btn, btnEmbed, btnTest)

    let rowMenu = new ActionRowBuilder().addComponents(Menu_setChannel);

    return { embeds: [embed], components: [rowMenu, row1, row2, row3] }

  }

}