const ms = require('ms');
const getHadith = require('../helpers/hadith.json');
const drawHadith = require('./drawHadith');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { baseClient } = require('@root/src/base');

/**
 * @typedef {Object} hadithChannelData
 * @property {string} channelId - the id of the channel to send the hadith in
 * @property {string} guildId - the id of the guild that the channel is in
 * @property {boolean} enabled - if the hadith are enabled or not
 * @property {string} msgTimeSend - the time between each hadith message in ms
 * @property {string[]} category - the category of hadith to send
 * @property {string[]} roles - the roles that can manage the hadith
 * @property {number} lastSned - the last time the hadith was sent
 * @property {boolean} embed - if the hadith should be sent in an embed or not
 */

/**
 * Send hadith in a channel
 * @param {baseClient} client - the discord client
 * @param {import("discord.js").Guild} guild - the guild that the channel is in
 * @param {hadithChannelData} data - data about the channel
 * @param {boolean} [isTest=false] - if the hadith should be sent in a test channel
 * @returns {Promise<boolean>}
 */
module.exports = async function SendHadith(client, guild, data, isTest = false) {

  let db = await client.db.table("channels");

  let isGuild = client.guilds.cache.get(guild.id) || await client.guilds.fetch(guild.id).catch(() => null);
  if (!isGuild) {
    await db.set(`${guild.id}_hadithChannel..enabled`, false);
    clearTimeout(client.Hadith.get(guild.id));
    client.Hadith.delete(guild.id);
    return false;
  }

  const isDone = true;

  let dat2 = await db.get(`${guild.id}_hadithChannel`);

  // تحقق مما إذا كانت البيانات موجودة
  if (!dat2 || !dat2.msgTimeSend) {
    console.error('Data or msgTimeSend is undefined');
    return false;
  }

  if (!isTest) {
    clearTimeout(client.Hadith.get(guild.id));

    let timeout = setTimeout(async function () {
      await SendHadith(client, isGuild, dat2);
    }, ms(dat2.msgTimeSend));
    client.Hadith.set(guild.id, timeout);
  }

  return new Promise(async (resolve, reject) => {

    /** @type {import("discord.js").TextChannel} */
    let channel = guild.channels.cache.get(data?.channelId) || await guild.channels.fetch(data?.channelId).catch(() => null);

    if (!channel) return resolve(!isDone);

    if (data?.enabled) {
      let idCat = data?.category?.[Math.floor(Math.random() * data?.category?.length)];
      let lastSned = Date.now();

      if (idCat) {
        if (idCat === "random") idCat = [
          "tirmidzi", "nasai","malik","ibnu-majah","darimi","bukhari","ahmad","abu-daud","muslim"
        ][Math.floor(Math.random() * 9)];

        let HadithFilter = getHadith.filter(arab => arab.id === idCat);

        let arab = HadithFilter[Math.floor(Math.random() * HadithFilter.length)];

        let image = await drawHadith(arab);

        let attachment = new AttachmentBuilder(image.imageBuffer, { name: 'arab.png' });
        let embed = new EmbedBuilder()
          .setColor("White")
          .setDescription(image.description)
          .setImage('attachment://arab.png');

        /** @type {import("discord.js").Message} */
        let sender = { files: [attachment] };

        data.roles.length > 0
          ? sender.content = data.roles.map(role => `<@&${role}>`).join(" ")
          : sender.content = "** **";

        if (data?.embed) sender.embeds = [embed];
        else sender.content += "\n" + image.description;

        // تأكد من أن lastSned موجود
        if (data.lastSned < Date.now() - (ms(data?.msgTimeSend)) && !isTest) {
          let doneSend = await channel.send(sender).catch(() => null);

          if (!isTest) await db.set(`${guild.id}_hadithChannel..lastSned`, lastSned);

          if (doneSend) {
            resolve(isDone);
          } else {
            console.log(`Can't send hadith in ${channel.name}`);
            resolve(!isDone);
          }
        }

        if (isTest) {
          let doneSend = await channel.send(sender).catch(() => null);
          if (doneSend) {
            resolve(isDone);
          } else {
            console.log(`Can't send hadith in ${channel.name}`);
            resolve(!isDone);
          }
        }
      }
    }
  });
};
