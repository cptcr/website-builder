const fs = require('fs');
const readline = require('readline');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  fg: {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
  },
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function collectMultipleInputs(fieldName) {
  const inputs = [];
  while (true) {
    const input = await askQuestion(
      `${colors.fg.cyan}Enter a value for ${fieldName} (type 'stop' to finish): ${colors.reset}`
    );
    if (input.toLowerCase() === 'stop') break;
    inputs.push(input);
  }
  return inputs;
}

async function main() {
  console.log(`${colors.fg.green}Welcome to the configuration setup.${colors.reset}`);
  console.log(`${colors.fg.green}Please provide the following details:\n${colors.reset}`);

  const config = {};
  const mailConfig = {};

  config.siteName = await askQuestion(`${colors.fg.cyan}Site Name: ${colors.reset}`);

  const port = await askQuestion(`${colors.fg.cyan}Port (default 3000): ${colors.reset}`);
  config.port = port || 3000;

  config.githubUsername = await askQuestion(`${colors.fg.cyan}GitHub Username: ${colors.reset}`);

  config.twitchUsername = await askQuestion(`${colors.fg.cyan}Twitch Username: ${colors.reset}`);

  config['design-options'] = {
    default: {
      description: 'Default design with a balanced and classic look.',
    },
    midnight: {
      description: 'A sleek dark theme with deep blues and purples.',
    },
    sunset: {
      description: 'Warm and vibrant colors inspired by a sunset.',
    },
    caprihan: {
      description: 'Cool blues and greens inspired by the island of Capri.',
    },
    ocean: {
      description: 'An oceanic theme featuring teals and deep blues.',
    },
  };

  console.log(`\n${colors.fg.green}Available Designs:${colors.reset}`);
  Object.keys(config['design-options']).forEach((design) => {
    console.log(
      `${colors.fg.yellow}- ${design}: ${config['design-options'][design].description}${colors.reset}`
    );
  });

  config.design = await askQuestion(
    `${colors.fg.cyan}Choose a design from the above options: ${colors.reset}`
  );

  config.apiTokens = {};
  config.apiTokens.githubToken = await askQuestion(
    `${colors.fg.cyan}GitHub API Token: ${colors.reset}`
  );
  config.apiTokens.twitchToken = await askQuestion(
    `${colors.fg.cyan}Twitch OAuth Token: ${colors.reset}`
  );
  config.apiTokens.twitchClientId = await askQuestion(
    `${colors.fg.cyan}Twitch Client ID: ${colors.reset}`
  );

  config.seo = {};
  console.log(`\n${colors.fg.green}SEO Configuration:${colors.reset}`);
  config.seo.title = await askQuestion(`${colors.fg.cyan}SEO Title: ${colors.reset}`);
  config.seo.description = await askQuestion(
    `${colors.fg.cyan}SEO Description: ${colors.reset}`
  );
  config.seo.keywords = await askQuestion(
    `${colors.fg.cyan}SEO Keywords (comma-separated): ${colors.reset}`
  );
  config.seo.author = await askQuestion(`${colors.fg.cyan}Author Name: ${colors.reset}`);
  config.seo.viewport = await askQuestion(
    `${colors.fg.cyan}Viewport (default "width=device-width, initial-scale=1.0"): ${colors.reset}`
  );
  if (!config.seo.viewport) {
    config.seo.viewport = 'width=device-width, initial-scale=1.0';
  }

  config.personalInfo = {};
  console.log(`\n${colors.fg.green}Personal Information:${colors.reset}`);
  config.personalInfo.name = await askQuestion(`${colors.fg.cyan}Name: ${colors.reset}`);
  config.personalInfo.age = await askQuestion(`${colors.fg.cyan}Age: ${colors.reset}`);
  config.personalInfo.country = await askQuestion(
    `${colors.fg.cyan}Country: ${colors.reset}`
  );

  console.log(`\n${colors.fg.green}Languages (type 'stop' to finish):${colors.reset}`);
  config.personalInfo.languages = await collectMultipleInputs('language');

  console.log(`\n${colors.fg.green}Hobbies (type 'stop' to finish):${colors.reset}`);
  config.personalInfo.hobbies = await collectMultipleInputs('hobby');

  config.experience = {};
  console.log(`\n${colors.fg.green}Experience:${colors.reset}`);
  config.experience.jobTitle = await askQuestion(
    `${colors.fg.cyan}Job Title: ${colors.reset}`
  );
  config.experience.company = await askQuestion(
    `${colors.fg.cyan}Company: ${colors.reset}`
  );
  config.experience.description = await askQuestion(
    `${colors.fg.cyan}Job Description: ${colors.reset}`
  );

  config.techStack = {};
  console.log(`\n${colors.fg.green}Tech Stack - Languages (type 'stop' to finish):${colors.reset}`);
  config.techStack.languages = await collectMultipleInputs('programming language');

  console.log(`\n${colors.fg.green}Tech Stack - Tools (type 'stop' to finish):${colors.reset}`);
  config.techStack.tools = await collectMultipleInputs('tool');

  console.log(`\n${colors.fg.green}Mail Configuration:${colors.reset}`);
  mailConfig.host = await askQuestion(`${colors.fg.cyan}Mail Host (e.g., smtp.gmail.com): ${colors.reset}`);
  mailConfig.port = await askQuestion(`${colors.fg.cyan}Mail Port (e.g., 587): ${colors.reset}`);
  mailConfig.secure = await askQuestion(`${colors.fg.cyan}Secure connection? (true/false): ${colors.reset}`);
  mailConfig.auth = {};
  mailConfig.auth.user = await askQuestion(
    `${colors.fg.cyan}Email Address (username): ${colors.reset}`
  );
  mailConfig.auth.pass = await askQuestion(
    `${colors.fg.cyan}Email Password: ${colors.reset}`
  );
  mailConfig.recipientEmail = await askQuestion(
    `${colors.fg.cyan}Recipient Email (where to receive contact form messages): ${colors.reset}`
  );

  console.log(`\n${colors.fg.green}Configuration completed.${colors.reset}`);

  const configDir = path.join(__dirname, 'config');
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
  }

  fs.writeFileSync(
    path.join(configDir, 'config.json'),
    JSON.stringify(config, null, 2)
  );
  console.log(`${colors.fg.green}config.json has been saved in the config directory.${colors.reset}`);

  fs.writeFileSync(
    path.join(configDir, 'mail.config.json'),
    JSON.stringify(mailConfig, null, 2)
  );
  console.log(`${colors.fg.green}mail.config.json has been saved in the config directory.${colors.reset}`);

  rl.close();
}

main();
