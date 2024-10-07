const ms = require('ms');
const getAyat = require('../helpers/ayat.json');
const drawAyat = require('./drawAyat');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { baseClient } = require('@root/src/base');

/**
 * @typedef {Object} ayatChannelData
 * @property {string} channelId - the id of the channel to send the azkar in
 * @property {string} guildId - the id of the guild that the channel is in
 * @property {boolean} enabled - if the azkar are enabled or not
 * @property {string} msgTimeSend - the time between each azkar message in ms
 * @property {string[]} roles - the roles that can manage the azkar
 * @property {number} lastSned - the last time the azkar was sent
 * @property {boolean} embed - if the azkar should be sent in an embed or not
 */

/**
 * Send azkar in a channel
 * @param {baseClient} client - the discord client
 * @param {import("discord.js").Guild} guild - the guild that the channel is in
 * @param {ayatChannelData} data - data about the channel
 * @param {boolean} [isTest=false] - if the azkar should be sent in a test channel
 * @returns {Promise<boolean>}
 */
module.exports = async function SendAyat(client, guild, data, isTest = false) {

  let db = await client.db.table("channels");




  let isGuild = client.guilds.cache.get(guild.id) || await client.guilds.fetch(guild.id).catch(() => null);
  if (!isGuild) {
    await db.set(`${guild.id}_ayatChannel..enabled`, false);
    
    // تحقق من وجود البيانات في `client.Azkar` قبل محاولة إزالتها
    if (client.Ayat.has(guild.id)) {
      clearTimeout(client.Ayat.get(guild.id));
      client.Ayat.delete(guild.id);
    }
    return false;
  }
  
  const isDone = true;
  let data2 = await db.get(`${guild.id}_ayatChannel`);

  if (!isTest) {
    if (client.Ayat.has(guild.id)) {
      clearTimeout(client.Ayat.get(guild.id));
    }

    let timeout = setTimeout(async function () {
      await SendAyat(client, isGuild, data2);
    }, ms(data2.msgTimeSend));
    
    client.Ayat.set(guild.id, timeout);
  }

  return new Promise(async (resolve, reject) => {
    let channel = guild.channels.cache.get(data?.channelId) || await guild.channels.fetch(data?.channelId).catch(() => null);

    if (!channel) return resolve(!isDone);

    if (data?.enabled) {
      let lastSned = Date.now();

      let ayat = getAyat[Math.floor(Math.random() * getAyat.length)]; // اختر آية عشوائية

      let image = await drawAyat(ayat);

      let attachment = new AttachmentBuilder(image.imageBuffer, { name: 'ayat.png' });
      let embed = new EmbedBuilder()
        .setColor("White")
        .setDescription(image.description)
        .setImage('attachment://ayat.png');

      let sender = { files: [attachment] }

      data.roles.length > 0
        ? sender.content = data.roles.map(role => `<@&${role}>`).join(" ")
        : sender.content = "** **";

      if (data?.embed) sender.embeds = [embed];
      else sender.content += "\n" + image.description;

      if (data.lastSned < Date.now() - (ms(data?.msgTimeSend)) && !isTest) {
        let doneSend = await channel.send(sender).catch(() => null);

        if (!isTest) await db.set(`${guild.id}_ayatChannel..lastSned`, lastSned);

        if (doneSend) {
          resolve(isDone);
        } else {
          console.log(`Can't send ayat in ${channel.name}`);
          resolve(!isDone);
        }
      }

      if (isTest) {
        let doneSend = await channel.send(sender).catch(() => null);

        if (doneSend) {
          resolve(isDone);
        } else {
          console.log(`Can't send ayat in ${channel.name}`);
          resolve(!isDone);
        }
      }
    }
  });
};
