// ./src/functions/fetch-repos.js

const axios = require('axios');
const config = require('../../config/config.json');

async function fetchGitHubRepos(page = 1, perPage = 100) {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${config.githubUsername}/repos`,
      {
        headers: {
          'Authorization': `token ${config.apiTokens.githubToken}`,
          'User-Agent': config.githubUsername,
        },
        params: {
          per_page: perPage,
          page: page,
        },
      }
    );

    const repos = response.data;

    // Filter out forked repos
    const nonForkedRepos = repos.filter((repo) => !repo.fork);

    // Sort by stars in descending order
    nonForkedRepos.sort(
      (a, b) => b.stargazers_count - a.stargazers_count
    );

    return nonForkedRepos;
  } catch (error) {
    console.error(
      'Error fetching GitHub repositories:',
      error.response ? error.response.data : error.message
    );
    return [];
  }
}

module.exports = fetchGitHubRepos;
