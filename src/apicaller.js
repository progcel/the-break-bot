const axios = require('axios');
const axiosRetry = require('axios-retry');
const logger = require('./logger')

const breakChannelId = 'UC6Ff1z4MhKDDLEUqH_hisyQ';
const youtubeApi = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${breakChannelId}&maxResults=1&order=date&key=${process.env.YOUTUBE_API_TOKEN}`
const youtubeStatsApi = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${breakChannelId}&key=${process.env.YOUTUBE_API_TOKEN}`
const youtubePrefix = 'https://www.youtube.com/watch?v='

axiosRetry(axios, { retries: 1, retryDelay: 2000 });

class ApiCaller {
  async getVideoInfo () {
    try {
      let response = await axios.get(youtubeApi);
      
      return {
        url: `${youtubePrefix}${response.data.items[0].id.videoId}`,
        publishedAt: response.data.items[0].snippet.publishedAt,
      };
    } catch (e) {
      logger.logError(e);
    }
  }

  async getStats () {
    try {
      let response = await axios.get(youtubeStatsApi);
      
      return {
        viewCount: response.data.items[0].statistics.viewCount,
        subscriberCount: response.data.items[0].statistics.subscriberCount
      };
    } catch (e) {
      logger.logError(e);
    }
  }
}

module.exports = ApiCaller;
