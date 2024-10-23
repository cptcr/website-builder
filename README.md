# Website Builder

A customizable and extensible website builder that allows you to create a professional portfolio or personal website with ease. Configure your site using simple JSON files, choose from multiple design themes, and deploy it effortlessly.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Available Designs](#available-designs)
- [Usage](#usage)
  - [Running the Application](#running-the-application)
  - [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Easy Configuration**: Customize your website using simple JSON files.
- **Multiple Design Themes**: Choose from various pre-built themes to match your style.
- **Dynamic Content**: Fetches GitHub repositories and Twitch stats to display on your site.
- **Contact Form**: Integrated contact form with email notifications.
- **Blog Support**: Write blog posts in Markdown.
- **File Uploads**: Support for uploading files with configurable storage.
- **Responsive Design**: Mobile-friendly layouts using modern CSS practices.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/cptcr/website-builder.git
   ```

2. **Navigate to the project directory**

   ```bash
   cd website-builder
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

### Configuration

The application uses JSON files for configuration. You can generate these files using the interactive setup script.

1. **Run the setup script**

   ```bash
   npm run setup
   ```

2. **Follow the prompts**

   The script will ask for various details such as site name, GitHub username, design selection, API tokens, personal information, etc.

3. **Configuration files generated**

   - `config/config.json`: Main configuration file.
   - `config/mail.config.json`: Mail server configuration for the contact form.

### Available Designs

Choose from the following design themes during setup:

- **default**: Default design with a balanced and classic look.
- **midnight**: A sleek dark theme with deep blues and purples.
- **sunset**: Warm and vibrant colors inspired by a sunset.
- **caprihan**: Cool blues and greens inspired by the island of Capri.
- **ocean**: An oceanic theme featuring teals and deep blues.

## Usage

### Running the Application

To start the application, use one of the following commands:

- **Production Mode**

  ```bash
  npm start
  ```

- **Development Mode** (with nodemon for automatic restarts)

  ```bash
  npm run dev
  ```

The server will start on the port specified in your `config.json` (default is `3000`).

### Scripts

- **Setup**

  Runs the interactive configuration script.

  ```bash
  npm run setup
  ```

- **Start**

  Starts the server in production mode.

  ```bash
  npm start
  ```

- **Dev**

  Starts the server in development mode with nodemon.

  ```bash
  npm run dev
  ```

- **Test**

  Placeholder for running tests.

  ```bash
  npm test
  ```

## Project Structure

```
website-builder/
├── config/
│   ├── config.json          # Main configuration file
│   └── mail.config.json     # Mail server configuration
├── public/
│   ├── styles/              # CSS files for different themes
│   ├── uploads/             # Uploaded files
│   └── ...                  # Static assets
├── src/
│   ├── functions/
│   │   ├── fetch-repos.js   # Function to fetch GitHub repos
│   │   └── fetch-twitch-stats.js  # Function to fetch Twitch stats
│   ├── markdown/            # Blog posts in Markdown format
│   └── views/               # EJS templates
├── .gitignore
├── index.js                 # Main application file
├── package.json
├── README.md
└── setup.js                 # Interactive setup script
```

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a new branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit your changes**

   ```bash
   git commit -m "Add your message here"
   ```

4. **Push to the branch**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**

## License

This project is licensed under the [MIT License](LICENSE).

---

**Note**: Remember to replace placeholders like `your_github_api_token`, `your_twitch_oauth_token`, and `your_twitch_client_id` with your actual API tokens in the configuration files. Keep these tokens secure and do not share them publicly.
