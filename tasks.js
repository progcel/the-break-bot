class Tasks {
  constructor (discordBot, apiCaller, databaseHandler) {
    this.channel = discordBot.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
    this.apiCaller = apiCaller;
    this.databaseHandler = databaseHandler;
  }

  async newVideoNotify () {
    let videoInfo = await this.apiCaller.getVideoInfo();
    if (videoInfo == undefined) return;
    
    let notify = await this.databaseHandler.shouldNotify(videoInfo.url, videoInfo.publishedAt);
    if (notify) this.channel.send(`${videoInfo.url}`);
  }
}

module.exports = Tasks;
