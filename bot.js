require('dotenv').config();
const cron = require("node-cron");
const discord = require('discord.js');
const apiCaller = require('./apicaller');
const databaseHandler = require('./databasehandler');

const discordBot = new discord.Client();

async function setupScheduler(){
  cron.schedule("*/25 * * * *", async function() {
    await newVideoNotify();
  });
}

async function newVideoNotify() {
  let videoInfo = await apiCaller.getVideoInfo();
  if (videoInfo == undefined) return;

  let notify = await databaseHandler.shouldNotify(videoInfo.url, videoInfo.publishedAt);

  if (notify) {
    let channel = discordBot.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
    channel.send(`${videoInfo.url}`);
  }
}

discordBot.on('ready', async () => {
  console.log('Bot is online!');

  await setupScheduler();
});

discordBot.on('message', async function (message) {
  let command = message.content.trim().toLowerCase();

  if (command === 'br video') {
    let videoInfo = await apiCaller.getVideoInfo();

    if (videoInfo) {
      message.reply(`${videoInfo.url}`);
    }
    else {
      message.reply(`something went wrong \:sob: ${process.env.DEVELOPER_ID}`);
    }
  }
  else if (command == 'br stats') {
    let stats = await apiCaller.getStats();

    if (stats) {
      message.reply(`these are the latest Break numbers:
      Total views: ${stats.viewCount}
      Total subscribers: ${stats.subscriberCount}`);
    }
    else {
      message.reply(`something went wrong \:sob: ${process.env.DEVELOPER_ID}`);
    }
  }
});

discordBot.login(process.env.BOT_TOKEN);
