# Personal Portfolio Website

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Demo](#demo)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Development](#development)
- [Folder Structure](#folder-structure)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Introduction

This is a personal portfolio website built with **Node.js**, **Express**, and **EJS** templating. It showcases your projects fetched from GitHub, displays Twitch statistics, includes a blog, and features a contact form powered by Nodemailer.

## Features

- **Dynamic Project Display**: Automatically fetches and displays your GitHub repositories.
- **Twitch Statistics**: Shows live Twitch stats.
- **Blog**: Supports Markdown-formatted blog posts.
- **Contact Form**: Allows visitors to send messages directly to your email.
- **Skills and Testimonials**: Highlights your skills and client testimonials.
- **Responsive Design**: Optimized for all devices.
- **Development Mode**: Uses Nodemon for auto-restarts during development.

## Demo

[Include a link to a live demo or screenshots here.]

## Prerequisites

- **Node.js** (version 14 or higher recommended)
- **npm** (Node Package Manager)
- **GitHub Personal Access Token**: For GitHub API access.
- **Twitch API Credentials**: For Twitch stats.
- **SMTP Server Credentials**: For sending emails via Nodemailer.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Install Nodemon (for Development)**

   ```bash
   npm install -g nodemon
   ```

## Configuration

### 1. **Main Configuration**

Create a `config.json` file inside the `config` directory:

```json
{
  "port": 3000,
  "siteName": "Your Site Name",
  "githubUsername": "your_github_username",
  "twitchUsername": "your_twitch_username",
  "apiTokens": {
    "githubToken": "your_github_api_token",
    "twitchClientId": "your_twitch_client_id",
    "twitchToken": "your_twitch_oauth_token"
  }
}
```

- **port**: Port number for the server.
- **siteName**: The name of your website.
- **githubUsername**: Your GitHub username.
- **twitchUsername**: Your Twitch username.
- **apiTokens.githubToken**: GitHub Personal Access Token.
- **apiTokens.twitchClientId**: Twitch Client ID.
- **apiTokens.twitchToken**: Twitch OAuth Token.

### 2. **Mail Configuration**

Create a `mail.config.json` file inside the `config` directory:

```json
{
  "host": "smtp.your-email-provider.com",
  "port": 587,
  "secure": false,
  "auth": {
    "user": "your-email@example.com",
    "pass": "your-email-password"
  },
  "recipientEmail": "recipient@example.com"
}
```

- **host**: SMTP server host.
- **port**: SMTP server port.
- **secure**: `true` for port 465, `false` for other ports.
- **auth.user**: Your email address.
- **auth.pass**: Your email password or app-specific password.
- **recipientEmail**: Email to receive contact form messages.

**Note**: Do not commit configuration files with sensitive information to version control.

## Usage

### Running the Application

#### Development Mode

To run the application in development mode with automatic restarts:

```bash
npm run dev
```

#### Production Mode

To run the application normally:

```bash
npm run build
```

### Accessing the Website

Open your browser and navigate to:

```
http://localhost:3000
```

Replace `3000` with your configured port if different.

## Development

### Folder Structure

```
your-repo-name/
├── config/
│   ├── config.json
│   └── mail.config.json
├── public/
│   ├── styles/styles.css
├── src/
│   ├── functions/
│   │   ├── fetch-repos.js
│   │   └── fetch-twitch-stats.js
│   ├── markdown/
│   │   ├── test-1.md
│   │   ├── test-2.md
│   └── views/
│       ├── partials/
│       |   ├── footer.ejs
│       |   ├── head.ejs
│       |   ├── header.ejs
│       ├── index.ejs
│       ├── projects.ejs
│       ├── project_detail.ejs
│       ├── skills.ejs
│       ├── about.ejs
│       ├── testimonials.ejs
│       ├── blog_summary.ejs
│       ├── blog.ejs
│       ├── contact.ejs
│       └── 404.ejs
├── index.js
├── package.json
├── .gitignore
└── README.md
```

### Scripts

In your `package.json`, ensure you have:

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

## Customization

### 1. **EJS Templates**

Customize the EJS templates in `src/views/` to change the website's appearance.

### 2. **Styles and Scripts**

Add your CSS and JavaScript files to the `public/css/` and `public/js/` directories.

### 3. **Blog Posts**

Place your Markdown-formatted blog posts in the `src/markdown/` directory.

**Example Format**:

```markdown
# Blog Post Title

Date: YYYY-MM-DD

Content of your blog post...
```

### 4. **Skills and Testimonials**

Update the arrays in `index.js` or create separate JSON files for better management.

### 5. **GitHub Repositories**

Ensure your GitHub API token has the necessary permissions to fetch your repositories.

### 6. **Contact Form**

Configure SMTP settings in `mail.config.json` to enable email functionality.

## Troubleshooting

- **Port Already in Use**: Change the port number in `config/config.json` or stop the process using the port.
- **GitHub API Rate Limits**: Use a GitHub token to increase rate limits.
- **Email Sending Issues**: Verify SMTP settings and credentials in `mail.config.json`.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.