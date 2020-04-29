class CommandHandler {
  constructor (apiCaller) {
    this.apiCaller = apiCaller;
  }

  async handle (raw_command)
  {
    let command = raw_command.trim().toLowerCase();

    let result;
    if (command === 'br video') {
      let videoInfo = await this.apiCaller.getVideoInfo();
      if (videoInfo) result = `${videoInfo.url}`;
    }
    else if (command === 'br stats') {
      let stats = await this.apiCaller.getStats();
      if (stats) {
        result = 'these are the latest Break numbers:\n' +
                 'Total views: ' + stats.viewCount + '\n' +
                 'Total subscribers: ' + stats.subscriberCount;
      }
    }
    else {
      return;
    }

    if (result) {
      return result;
    }
    else {
      return `something went wrong \:sob: ${process.env.DEVELOPER_ID}`;
    }
  }
}

module.exports = CommandHandler;
