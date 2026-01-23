# AdamAurelio.com

Personal portfolio website showcasing software engineering expertise, professional experience, and personal interests.

## Tech Stack

- **React 19** - Modern React with hooks and functional components
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Create React App** - Build tooling and development environment

## Features

- 🎨 Modern, responsive design with Tailwind CSS
- 📱 Mobile-first approach with responsive breakpoints
- ✨ Smooth animations and hover effects
- 🎯 Professional portfolio sections
- 📝 Blog component structure
- 🎓 Comprehensive resume/CV section
- 🌐 Multiple content areas (Technology, Theology, Family & Coaching)

## Project Structure

```
AdamAurelioDotCom/
├── adamaurelio/               # React Frontend (Tailwind CSS)
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Header.js     # Navigation with Tailwind
│   │   │   ├── Footer.js     # Footer component
│   │   │   ├── Blog.js       # Blog container
│   │   │   ├── BlogList.js   # Blog listing
│   │   │   ├── BlogPost.js   # Blog post card
│   │   │   └── Resume.js     # Resume component
│   │   ├── pages/            # Page components
│   │   │   ├── Home.js       # Landing page
│   │   │   ├── About.js      # About page
│   │   │   ├── Resume.js     # Full resume page
│   │   │   ├── Services.js   # Services page
│   │   │   ├── Contact.js    # Contact page
│   │   │   └── Admin.js      # Admin dashboard
│   │   ├── styles/
│   │   │   └── index.css     # Tailwind directives
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── tailwind.config.js    # Tailwind configuration
│   ├── postcss.config.js     # PostCSS config
│   ├── package.json
│   ├── Dockerfile
│   └── Dockerfile.dev
├── backend/                   # Django Backend
│   ├── apps/                 # Django applications
│   │   ├── core/            # Core functionality
│   │   ├── blog/            # Blog app
│   │   └── resume/          # Resume/Portfolio
│   ├── config/              # Django settings
│   │   └── settings/        # Environment-specific settings
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── scripts/                  # Setup and utility scripts
│   ├── setup-dev.sh         # Bash setup script
│   └── setup-dev.ps1        # PowerShell setup script
├── nginx/                    # Nginx configuration
│   └── conf.d/
├── docs/                     # Documentation
│   ├── AWS_LIGHTSAIL_SETUP.md
│   ├── CLOUDFLARE_SETUP.md
│   └── SYNOLOGY_SETUP.md
├── .github/workflows/        # CI/CD pipelines
│   ├── ci-dev.yml
│   ├── deploy-qa.yml
│   └── deploy-prod.yml
├── docker-compose.dev.yml    # Development compose
├── docker-compose.qa.yml     # QA compose
├── docker-compose.prod.yml   # Production compose
├── .env.dev.example         # Dev environment template
├── .env.qa.example          # QA environment template
├── .env.prod.example        # Prod environment template
├── SETUP_GUIDE.md           # Complete setup guide
├── QUICKSTART.md            # Quick start guide
└── README.md                # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/AdamAurelio/AdamAurelioDotCom.git
cd AdamAurelioDotCom/adamaurelio
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Available Scripts

### `npm start`

Runs the app in development mode with hot reloading.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

- Optimizes React for production
- Minifies code
- Includes content hashes in filenames
- Purges unused Tailwind CSS classes

## Customizing Tailwind

The Tailwind configuration is in `tailwind.config.js`. You can customize:

- Color palette
- Breakpoints
- Spacing
- Typography
- And more

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          // Your custom colors
        },
      },
    },
  },
};
```

## Deployment

### Docker

The project includes Dockerfiles for containerized deployment:

```bash
# Development
docker build -f Dockerfile.dev -t adamaurelio-dev .
docker run -p 3000:3000 adamaurelio-dev

# Production
docker build -f Dockerfile -t adamaurelio-prod .
docker run -p 80:80 adamaurelio-prod
```

### Build for Production

```bash
npm run build
```

Deploy the `build` folder to your hosting service (Netlify, Vercel, AWS S3, etc.)

## Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=your_api_url
DB_USER=your_db_user
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=your_db_port
PORT=3000
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Contact

Adam Aurelio

- GitHub: [@AdamAurelio](https://github.com/AdamAurelio)
- LinkedIn: [Adam Aurelio](https://linkedin.com/in/adamaurelio)

## Acknowledgments

- Built with [Create React App](https://create-react-app.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [React](https://react.dev/)
