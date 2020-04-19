const axios = require('axios');

const break_channel_id = 'UC6Ff1z4MhKDDLEUqH_hisyQ';
const youtube_api = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${break_channel_id}&maxResults=1&order=date&key=${process.env.YOUTUBE_API_TOKEN}`
const youtube_stats_api = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${break_channel_id}&key=${process.env.YOUTUBE_API_TOKEN}`
const youtube_prefix = 'https://www.youtube.com/watch?v='

module.exports = {
  getVideoInfo: async function () {
    try {
      let response = await axios.get(youtube_api);
      
      return {
        url: `${youtube_prefix}${response.data.items[0].id.videoId}`,
        publishedAt: response.data.items[0].snippet.publishedAt,
      };
    } catch (e) {
      console.error(e);
    }
  },

  getStats: async function () {
    try {
      let response = await axios.get(youtube_stats_api);
      
      return {
        viewCount: response.data.items[0].statistics.viewCount,
        subscriberCount: response.data.items[0].statistics.subscriberCount
      };
    } catch (e) {
      console.error(e);
    }
  }
};
