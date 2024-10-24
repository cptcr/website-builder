// index.js

const express = require('express');
const path = require('path');
const fs = require('fs');
const { marked } = require('marked');
const nodemailer = require('nodemailer');
const { exec } = require('child_process');
const crypto = require('crypto'); // For generating randomized filenames
const multer = require('multer'); // For handling file uploads
const app = express();

const fetchGitHubRepos = require('./src/functions/fetch-repos'); // Adjusted to accept pagination parameters
const fetchTwitchStats = require('./src/functions/fetch-twitch-stats');
const config = require('./config/config.json'); // Main configuration
const mailConfig = require('./config/mail.config.json'); // Mail configuration

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // Middleware to parse form data

// ANSI color codes for colored logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
  },
};

// Function to simulate a progress bar during startup
function showProgressBar(callback) {
  let progress = 0;
  const total = 100;
  const interval = setInterval(() => {
    progress += 2;
    const progressBar =
      '[' +
      '#'.repeat(progress / 2) +
      ' '.repeat((total - progress) / 2) +
      ']';
    process.stdout.write(
      `\r${colors.fg.green}${progressBar} ${progress}%${colors.reset}`
    );
    if (progress >= total) {
      clearInterval(interval);
      setTimeout(() => {
        // Clear the console
        console.clear();
        callback();
      }, 1000); // Wait 1 second before clearing
    }
  }, 50); // Update every 50ms
}

// Function to check NPM packages for updates
function checkNpmUpdates() {
  console.log(
    `${colors.fg.blue}%s${colors.reset}`,
    'Checking for outdated NPM packages...'
  );
  exec('npm outdated --json', (error, stdout, stderr) => {
    if (error && stderr) {
      console.error(
        `${colors.fg.red}%s${colors.reset}`,
        'Error checking NPM packages:',
        stderr.trim()
      );
      return;
    }

    const outdatedPackages = JSON.parse(stdout || '{}');

    if (Object.keys(outdatedPackages).length === 0) {
      console.log(
        `${colors.fg.green}%s${colors.reset}`,
        'All NPM packages are up to date.'
      );
    } else {
      console.warn(
        `${colors.fg.yellow}%s${colors.reset}`,
        'The following packages are outdated:'
      );
      for (const [pkg, details] of Object.entries(outdatedPackages)) {
        console.warn(
          `${colors.fg.yellow}%s${colors.reset}`,
          `- ${pkg}: current(${details.current}) -> latest(${details.latest})`
        );
      }
    }
  });
}

// Function to verify configurations
function verifyConfigurations() {
  console.log(
    `${colors.fg.blue}%s${colors.reset}`,
    'Verifying configurations...'
  );
  let allConfigsValid = true;

  // Valid design options
  const validDesigns = Object.keys(config['design-options']);

  // Check main configuration
  if (!config.githubUsername) {
    console.error(
      `${colors.fg.red}%s${colors.reset}`,
      'Error: GitHub username is not set in config.json.'
    );
    allConfigsValid = false;
  }
  if (!config.port) {
    console.warn(
      `${colors.fg.yellow}%s${colors.reset}`,
      'Warning: Port is not set in config.json. Using default port 3000.'
    );
  }
  // Check design selection
  if (!validDesigns.includes(config.design)) {
    console.error(
      `${colors.fg.red}%s${colors.reset}`,
      `Error: Invalid design "${config.design}" specified in config.json. Valid options are: ${validDesigns.join(', ')}.`
    );
    allConfigsValid = false;
  }

  // Check mail configuration
  if (!mailConfig.auth || !mailConfig.auth.user || !mailConfig.auth.pass) {
    console.error(
      `${colors.fg.red}%s${colors.reset}`,
      'Error: Mail authentication details are not set in mail.config.json.'
    );
    allConfigsValid = false;
  }
  if (!mailConfig.recipientEmail) {
    console.error(
      `${colors.fg.red}%s${colors.reset}`,
      'Error: Recipient email is not set in mail.config.json.'
    );
    allConfigsValid = false;
  }

  if (allConfigsValid) {
    console.log(
      `${colors.fg.green}%s${colors.reset}`,
      'All configurations are set correctly.'
    );
  } else {
    console.error(
      `${colors.fg.red}%s${colors.reset}`,
      'Please fix the above configuration errors before proceeding.'
    );
  }

  return allConfigsValid;
}

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer storage and file filter
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate a random 16-byte hexadecimal filename
    const randomName = crypto.randomBytes(16).toString('hex');
    // Get the file extension
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, randomName + ext);
  },
});

// Allowed file extensions
const allowedExtensions = ['.jpeg', '.jpg', '.png', '.webp', '.heif'];

const fileFilter = function (req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Serve uploaded files statically
app.use('/files', express.static(uploadDir));

// Initialize the application after progress bar
showProgressBar(() => {
  // After clearing the console, perform checks
  checkNpmUpdates();
  const configsValid = verifyConfigurations();

  if (configsValid) {
    // Start the server
    const server = app.listen(config.port || 3000, () => {
      console.log(
        `${colors.fg.green}%s${colors.reset}`,
        `Server running on port ${config.port || 3000}`
      );
    });

    // Handle server errors
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(
          `${colors.fg.red}%s${colors.reset}`,
          `Port ${config.port || 3000} is already in use.`
        );
      } else {
        console.error(
          `${colors.fg.red}%s${colors.reset}`,
          'Server error:',
          err
        );
      }
      process.exit(1); // Exit the application
    });
  } else {
    console.error(
      `${colors.fg.red}%s${colors.reset}`,
      'Server not started due to configuration errors.'
    );
  }
});

// Cache for GitHub repositories
let cachedRepos = null;
let lastFetchTime = 0;
const CACHE_DURATION = 3600 * 1000; // 1 hour

// Fetch all GitHub repositories with pagination
async function fetchAllGitHubRepos() {
  console.log(
    `${colors.fg.blue}%s${colors.reset}`,
    'Fetching GitHub repositories...'
  );
  try {
    const allRepos = [];
    let page = 1;
    const perPage = 100; // Maximum allowed per GitHub API
    let repos;

    do {
      repos = await fetchGitHubRepos(page, perPage);
      allRepos.push(...repos);
      console.log(
        `${colors.fg.green}%s${colors.reset}`,
        `Fetched page ${page} with ${repos.length} repositories.`
      );
      page++;
    } while (repos.length === perPage);

    console.log(
      `${colors.fg.green}%s${colors.reset}`,
      'Total Repositories Fetched:',
      allRepos.length
    );

    return allRepos;
  } catch (error) {
    console.error(
      `${colors.fg.red}%s${colors.reset}`,
      'Error fetching GitHub repositories:',
      error.message
    );
    return [];
  }
}

async function getCachedGitHubRepos() {
  const now = Date.now();
  if (!cachedRepos || now - lastFetchTime > CACHE_DURATION) {
    cachedRepos = await fetchAllGitHubRepos();
    lastFetchTime = now;
    console.log(
      `${colors.fg.green}%s${colors.reset}`,
      'GitHub repositories cache updated.'
    );
  } else {
    console.log(
      `${colors.fg.cyan}%s${colors.reset}`,
      'Using cached GitHub repositories.'
    );
  }
  return cachedRepos;
}

// Route handlers

// Home page
app.get('/', async (req, res) => {
  const allRepos = await getCachedGitHubRepos();
  const topRepos = allRepos.slice(0, 4); // Get top 4 repos
  const twitchStats = await fetchTwitchStats();
  const techStack = config.techStack || {
    languages: [],
    tools: [],
  };

  console.log(
    `${colors.fg.blue}%s${colors.reset}`,
    `Rendering home page with ${topRepos.length} top repositories.`
  );
  res.render('index', { config, topRepos, twitchStats, techStack });
});

// Projects page
app.get('/projects', async (req, res) => {
  const allRepos = await getCachedGitHubRepos();
  console.log(
    `${colors.fg.blue}%s${colors.reset}`,
    `Rendering projects page with ${allRepos.length} repositories.`
  );
  res.render('projects', { config, allRepos });
});

// Detailed project view
app.get('/projects/:repoName', async (req, res) => {
  const repoName = req.params.repoName;
  const allRepos = await getCachedGitHubRepos();
  const repo = allRepos.find(
    (r) => r.name.toLowerCase() === repoName.toLowerCase()
  );

  if (repo) {
    console.log(
      `${colors.fg.blue}%s${colors.reset}`,
      `Rendering details for project: ${repo.name}`
    );
    res.render('project_detail', { config, repo });
  } else {
    console.error(
      `${colors.fg.red}%s${colors.reset}`,
      `Project not found: ${repoName}`
    );
    res.status(404).render('404', { config });
  }
});

// Skills page
app.get('/skills', (req, res) => {
  const skills = config.skills || [];

  console.log(
    `${colors.fg.blue}%s${colors.reset}`,
    'Rendering skills page.'
  );
  res.render('skills', { config, skills });
});

// About page
app.get('/about', (req, res) => {
  console.log(
    `${colors.fg.blue}%s${colors.reset}`,
    'Rendering about page.'
  );
  res.render('about', { config });
});

// Testimonials page
app.get('/testimonials', (req, res) => {
  const testimonials = config.testimonials || [];

  console.log(
    `${colors.fg.blue}%s${colors.reset}`,
    'Rendering testimonials page.'
  );
  res.render('testimonials', { config, testimonials });
});

// Blog summary page
app.get('/blog', (req, res) => {
  const posts = fs.readdirSync('./src/markdown').map((file) => {
    const fileContent = fs.readFileSync(`./src/markdown/${file}`, 'utf8');
    const summary = fileContent.slice(0, 200);
    const titleMatch = fileContent.match(/^#\s+(.*)/);
    const title = titleMatch ? titleMatch[1] : file;
    const dateMatch = fileContent.match(/^Date:\s+(.*)/m);
    const date = dateMatch ? new Date(dateMatch[1]) : new Date();
    return {
      filename: file.replace('.md', ''),
      title,
      summary,
      date,
    };
  });
  // Sort posts by date
  posts.sort((a, b) => b.date - a.date);
  console.log(
    `${colors.fg.blue}%s${colors.reset}`,
    `Rendering blog summary page with ${posts.length} posts.`
  );
  res.render('blog_summary', { config, posts });
});

// Individual blog post
app.get('/blog/:filename', (req, res) => {
  const fileName = req.params.filename;
  try {
    const fileContent = fs.readFileSync(
      `./src/markdown/${fileName}.md`,
      'utf8'
    );
    const renderedMarkdown = marked(fileContent);
    console.log(
      `${colors.fg.blue}%s${colors.reset}`,
      `Rendering blog post: ${fileName}`
    );
    res.render('blog', { config, content: renderedMarkdown });
  } catch (error) {
    console.error(
      `${colors.fg.red}%s${colors.reset}`,
      `Error reading blog post: ${fileName}`,
      error.message
    );
    res.status(404).render('404', { config });
  }
});

// Contact page (GET)
app.get('/contact', (req, res) => {
  console.log(
    `${colors.fg.blue}%s${colors.reset}`,
    'Rendering contact page.'
  );
  res.render('contact', {
    config,
    success: null,
    error: null,
    name: '',
    email: '',
    message: '',
  });
});

// Contact form submission (POST)
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  let success = null;
  let error = null;

  if (!name || !email || !message) {
    error = 'All fields are required.';
    console.warn(
      `${colors.fg.yellow}%s${colors.reset}`,
      'Contact form submission failed: Missing fields.'
    );
    return res.render('contact', {
      config,
      success,
      error,
      name,
      email,
      message,
    });
  }

  try {
    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.secure === 'true' || mailConfig.secure === true, // Convert string 'true'/'false' to boolean
      auth: {
        user: mailConfig.auth.user,
        pass: mailConfig.auth.pass,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: mailConfig.recipientEmail,
      subject: `New contact form submission from ${name}`,
      text: message,
    });

    success = 'Your message has been sent successfully!';
    console.log(
      `${colors.fg.green}%s${colors.reset}`,
      `Email sent successfully from ${email}.`
    );
    res.render('contact', {
      config,
      success,
      error: null,
      name: '',
      email: '',
      message: '',
    });
  } catch (err) {
    console.error(
      `${colors.fg.red}%s${colors.reset}`,
      'Error sending email:',
      err.message
    );
    error =
      'There was an error sending your message. Please try again later.';
    res.render('contact', {
      config,
      success: null,
      error,
      name,
      email,
      message,
    });
  }
});

// File upload page (GET)
app.get('/upload', (req, res) => {
  res.render('upload', { config });
});

// File upload route (POST)
app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    const fileUrl = `/files/${req.file.filename}`;
    console.log(
      `${colors.fg.green}%s${colors.reset}`,
      `File uploaded successfully: ${fileUrl}`
    );
    res.status(200).json({ message: 'File uploaded successfully', fileUrl });
  } else {
    console.error(
      `${colors.fg.red}%s${colors.reset}`,
      'File upload failed'
    );
    res.status(400).json({ error: 'File upload failed' });
  }
});

// 404 Error Handler (make sure this is at the end)
app.use((req, res) => {
  console.warn(
    `${colors.fg.yellow}%s${colors.reset}`,
    `404 Not Found: ${req.originalUrl}`
  );
  res.status(404).render('404', { config });
});
