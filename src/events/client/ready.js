const { chunkArray } = require('@root/src/utils/class/utils');
const sendAzkar = require('@root/src/utils/functions/sendAzkar');
const sendAyat = require('@root/src/utils/functions/sendAyat'); // دالة لإرسال الآيات
const sendHadith = require('@root/src/utils/functions/sendHadith'); // دالة لإرسال الآيات
const chalk = require('chalk');
const { ActivityType } = require('discord.js');
const gr = chalk.hex('#00D100');
const un = chalk.underline;

module.exports = {
  name: 'ready',
  /**
   * @param {import("@base/baseClient")} client 
   */
  async execute(client) {
    await client.DBConnect();
    await client.registerInteractions();
    const db = await client.db.table("channels");

    const commands = client.slashCommands.map(({ execute, ...data }) => data);
    setTimeout(() => {
      console.log(gr(`Logged In As ` + un(`${client.user.username}`)));
      console.log(chalk.cyan(`Servers:` + un(`${client.guilds.cache.size}`)), chalk.red(`Users:` + un(`${client.guilds.cache
        .reduce((a, b) => a + b.memberCount, 0)
        .toLocaleString()}`)), chalk.blue(`Commands:` + un(` ${client.commands.size}` + ` TOTAL Commands ${client.commands.size + commands.length}`)));
    }, 3000);
    
    client.user.setStatus("dnd");
    client.user.setActivity({ name: `Loading....`, type: ActivityType.Custom });
    setTimeout(() => client.user.setStatus("idle"), 40000);
    setInterval(() => {
      let ServersStatus = client.Ayat.size + client.Azkar.size + client.Hadith.size;
      client.user.setActivity({ name: `in ${ServersStatus}/${client.channels.cache.size} Channels`, type: ActivityType.Custom });
    }, 1 * 1000 * 60);

    let AzkarChannels = Object.values(await db.endsWith("_azkarChannel")) || [];
    let AyatChannels = Object.values(await db.endsWith("_ayatChannel")) || [];
    let HadithChannels = Object.values(await db.endsWith("_hadithChannel")) || [];
    
    if (AzkarChannels.length === 0 && AyatChannels.length === 0 && HadithChannels.length === 0) return;

    setTimeout(async () => {
      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      
      let chunkedAzkar = chunkArray(AzkarChannels, 30);
      let chunkedAyat = chunkArray(AyatChannels, 30);
      let chunkedHadith = chunkArray(HadithChannels, 30);

      // إرسال الأذكار
      for (let i = 0; i < chunkedAzkar.length; i++) {
        setTimeout(async () => {
          for (let data of chunkedAzkar[i]) {
            let guild = await client.guilds.fetch(data.guildId).catch(() => null);
            if (!guild?.id) {
              setTimeout(async () => await db.delete(`${data.guildId}_azkarChannel`), 1000 * i);
              console.log("no guild in server  " + guild + " and delete it");
              continue;
            }
            if (data) {
              await sleep(1000);
              if (data?.msgTimeSend) {
                await sendAzkar(client, guild, data);
              }
            }
          }
        }, 1000 * i);
      }

      // إرسال الآيات
      for (let i = 0; i < chunkedAyat.length; i++) {
        setTimeout(async () => {
          for (let data of chunkedAyat[i]) {
            let guild = await client.guilds.fetch(data.guildId).catch(() => null);
            if (!guild?.id) {
              setTimeout(async () => await db.delete(`${data.guildId}_ayatChannel`), 1000 * i);
              console.log("no guild in server  " + guild + " and delete it");
              continue;
            }
            if (data) {
              await sleep(1000);
              if (data?.msgTimeSend) {
                await sendAyat(client, guild, data);
              }
            }
          }
        }, 1000 * i);
      }
      for (let i = 0; i < chunkedHadith.length; i++) {
        setTimeout(async () => {
          for (let data of chunkedHadith[i]) {
            let guild = await client.guilds.fetch(data.guildId).catch(() => null);
            if (!guild?.id) {
              setTimeout(async () => await db.delete(`${data.guildId}_hadithChannel`), 1000 * i);
              console.log("no guild in server  " + guild + " and delete it");
              continue;
            }
            if (data) {
              await sleep(1000);
              if (data?.msgTimeSend) {
                await sendHadith(client, guild, data);
              }
            }
          }
        }, 1000 * i);
      }
    }, 3000);
  },
};
