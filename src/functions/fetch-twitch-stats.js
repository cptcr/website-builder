// /src/functions/fetch-twitch-stats.js

const axios = require('axios');
const config = require('../../config/config.json');

async function fetchTwitchStats() {
  try {
    const userResponse = await axios.get(`https://api.twitch.tv/helix/users?login=${config.twitchUsername}`, {
      headers: {
        'Client-ID': config.apiTokens.twitchClientId,
        'Authorization': `Bearer ${config.apiTokens.twitchToken}`,
      },
    });

    const userData = userResponse.data.data[0];
    const userId = userData.id;

    const streamResponse = await axios.get(`https://api.twitch.tv/helix/streams?user_id=${userId}`, {
      headers: {
        'Client-ID': config.apiTokens.twitchClientId,
        'Authorization': `Bearer ${config.apiTokens.twitchToken}`,
      },
    });

    const isLive = streamResponse.data.data.length > 0;
    return {
      liveStatus: isLive ? 'Currently streaming!' : 'Not currently streaming',
      isLive,
    };
  } catch (error) {
    console.error('Error fetching Twitch stats:', error.response ? error.response.data : error.message);
    return null;
  }
}

module.exports = fetchTwitchStats;
