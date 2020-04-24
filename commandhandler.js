class CommandHandler {
  constructor (apiCaller) {
    this.apiCaller = apiCaller;
  }

  async handle (raw_command)
  {
    let command = raw_command.trim().toLowerCase();

    if (command === 'br video') {
      let videoInfo = await this.apiCaller.getVideoInfo();
    
      if (videoInfo) {
        return `${videoInfo.url}`;
      }
      else {
        return `something went wrong \:sob: ${process.env.DEVELOPER_ID}`;
      }
    }
    else if (command === 'br stats') {
      let stats = await this.apiCaller.getStats();
    
      if (stats) {
        return `these are the latest Break numbers:
          Total views: ${stats.viewCount}
          Total subscribers: ${stats.subscriberCount}`;
      }
      else {
        return `something went wrong \:sob: ${process.env.DEVELOPER_ID}`;
      }
    }
  }
}

module.exports = CommandHandler;
