const cron = require("node-cron");

class Scheduler {
  constructor (discordBot, apiCaller, databaseHandler) {
    this.channel = discordBot.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
    this.apiCaller = apiCaller;
    this.databaseHandler = databaseHandler;
  }

  async activate () {
    cron.schedule("*/25 * * * *", async function () {
      await this._newVideoNotify();
    });
  }

  async _newVideoNotify () {
    let videoInfo = this.apiCaller.getVideoInfo();
    if (videoInfo == undefined) return;
    
    let notify = await this.databaseHandler.shouldNotify(videoInfo.url, videoInfo.publishedAt);
    if (notify) channel.send(`${videoInfo.url}`);
  }
}

module.exports = Scheduler;
