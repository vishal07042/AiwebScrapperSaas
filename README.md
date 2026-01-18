# AI Web Scraper with Deployment Feature 🚀

A powerful AI-powered web scraping SaaS platform that allows users to scrape any website using natural language, and deploy the extracted JSON data to a live API endpoint with one click.

![Deployment Flow](../../../.gemini/antigravity/brain/8d766a93-f0e5-4bd4-bfa9-006a9228fef0/deployment_flow_diagram_1768453005207.png)

## ✨ Key Features

### AI-Powered Scraping

- **Smart Fields Mode**: Define custom JSON schema with field descriptions
- **Natural Language Mode**: Describe what to extract in plain English
- **Product Mode**: Optimized for e-commerce sites
- **Article Mode**: Extract blog posts and articles
- **Customizable Options**: Configure wait times, selectors, and content limits

### One-Click Deployment

- 🚀 **Instant API Creation**: Deploy scraped JSON to a live endpoint
- 🔗 **Clean URLs**: `https://worker.dev/{userId}/{endpointName}`
- ☁️ **Cloudflare Workers**: Production-ready serverless deployment
- 💾 **KV Storage**: Persistent data storage with Cloudflare KV
- 🌐 **CORS Enabled**: Access from any domain
- ⚡ **Edge Network**: Low-latency global access

## 🎯 Quick Start

### Prerequisites

- Node.js 16+ installed
- Google AI API key ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository**

```bash
cd c:\Users\profe\Downloads\webScrapersass
```

2. **Install backend dependencies**

```bash
cd backend
npm install
```

3. **Install frontend dependencies**

```bash
cd ../frontend
npm install
```

4. **Configure environment variables**

```bash
cd ../backend
copy .env.example .env
```

Edit `.env` and add your Google AI API key:

```env
GOOGLE_API_KEY=your_actual_api_key_here
```

### Running Locally

#### Option 1: Using the batch file (Windows)

```bash
# From the root directory
start-backend.bat
```

Then in another terminal:

```bash
cd frontend
npm run dev
```

#### Option 2: Manually

```bash
# Terminal 1 - Backend
cd backend
node index.js

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The app will be available at:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 📖 How to Use

### Step 1: Scrape Data

1. Open the app in your browser
2. Enter a URL (e.g., `https://news.ycombinator.com`)
3. Choose a scraping mode:
   - **Smart Fields**: Define custom fields to extract
   - **Natural Language**: Describe what you want
   - **Product**: For e-commerce sites
   - **Article**: For blog posts and news
4. Click **START EXTRACTION**

### Step 2: Deploy Your Data

1. Once scraping is complete, you'll see the JSON result
2. Click the **Deploy** button in the results panel
3. Configure your deployment:
   - **User ID**: Your namespace (e.g., "demo-user")
   - **Endpoint Name**: Unique name (e.g., "hackernews-top-10")
   - **Description**: Optional description
4. Click **Deploy Now**
5. Copy your deployed URL!

### Step 3: Access Your API

Your data is now available at:

```
http://localhost:3000/api/serve/{userId}/{endpointName}
```

Example:

```bash
curl http://localhost:3000/api/serve/demo-user/hackernews-top-10
```

## 🌐 Production Deployment

For production deployment with Cloudflare Workers, see:

- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Complete setup instructions
- **[Implementation Details](DEPLOYMENT_IMPLEMENTATION.md)** - Technical overview

### Quick Production Setup

1. Install Wrangler:

```bash
npm install -g wrangler
```

2. Run the deployment script:

```bash
cd backend
node deploy-to-cloudflare.js
```

3. Follow the prompts to:
   - Login to Cloudflare
   - Create KV namespace
   - Deploy the worker

## 📡 API Endpoints

### Scraping Endpoints

| Method | Endpoint               | Description                            |
| ------ | ---------------------- | -------------------------------------- |
| POST   | `/api/scrape/smart`    | Smart scraping with custom fields      |
| POST   | `/api/scrape`          | Generic scraping with natural language |
| POST   | `/api/scrape/products` | E-commerce product scraping            |
| POST   | `/api/scrape/article`  | Article/blog scraping                  |

### Deployment Endpoints

| Method | Endpoint                        | Description             |
| ------ | ------------------------------- | ----------------------- |
| POST   | `/api/deploy`                   | Deploy JSON to endpoint |
| GET    | `/api/serve/:userId/:endpoint`  | Get deployed data       |
| GET    | `/api/deployments/:userId`      | List user's deployments |
| DELETE | `/api/deploy/:userId/:endpoint` | Delete deployment       |

## 🏗️ Architecture

### Frontend (React + Vite)

- Modern React with hooks
- Tailwind CSS for styling
- Lucide React icons
- Dark theme optimized

### Backend (Express.js)

- RESTful API design
- AI integration with Google Gemini
- Playwright for web scraping
- In-memory storage (development)
- Cloudflare KV (production)

### Deployment (Cloudflare Workers)

- Serverless edge functions
- Global CDN distribution
- KV storage for persistence
- Automatic CORS handling

## 📁 Project Structure

```
webScrapersass/
├── frontend/
│   ├── src/
│   │   ├── AIWebScraper.jsx      # Main scraper component
│   │   ├── App.jsx                # App wrapper
│   │   └── components/
│   │       ├── ApiDeploymentPage.jsx
│   │       └── ...
│   └── package.json
├── backend/
│   ├── index.js                   # Main server
│   ├── cloudflare-worker.js       # Worker script
│   ├── wrangler.toml              # Wrangler config
│   ├── deploy-to-cloudflare.js   # Deployment helper
│   ├── .env                       # Environment variables
│   └── package.json
├── DEPLOYMENT_GUIDE.md            # Deployment instructions
├── DEPLOYMENT_IMPLEMENTATION.md   # Implementation details
└── start-backend.bat              # Windows startup script
```

## 🔐 Security

Current implementation is for development. For production:

- ✅ Add authentication (API keys, OAuth)
- ✅ Implement rate limiting
- ✅ Add input validation/sanitization
- ✅ Use proper database (PostgreSQL, MongoDB)
- ✅ Add user management
- ✅ Implement HTTPS
- ✅ Add monitoring and logging

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for security best practices.

## 🎨 Example Use Cases

### 1. Product Price Monitoring

Scrape product prices and deploy to an API for your price tracking app.

### 2. News Aggregation

Extract top stories from news sites and create a unified news API.

### 3. Job Board

Scrape job listings and expose them via API for your job search app.

### 4. Real Estate Listings

Extract property data and create a real-time real estate API.

### 5. Social Media Analytics

Track social media metrics and deploy to an analytics dashboard.

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js, Playwright
- **AI**: Google Gemini (via @ai-sdk/google)
- **Deployment**: Cloudflare Workers, Cloudflare KV
- **Language**: JavaScript (ES6+)

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [Implementation Details](DEPLOYMENT_IMPLEMENTATION.md) - Technical overview
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Google AI SDK](https://ai.google.dev/)

## 🐛 Troubleshooting

### PowerShell Execution Policy Error

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Backend won't start

- Check you're in the backend directory
- Verify `.env` file exists with API key
- Run: `node index.js` directly

### Deployment fails

- Ensure backend is running on port 3000
- Check endpoint name format (lowercase, alphanumeric, hyphens only)
- Verify user ID is set

### CORS errors

- Cloudflare Worker includes CORS headers automatically
- For local dev, backend has CORS enabled

## 🚀 Future Enhancements

- [ ] User authentication system
- [ ] Deployment analytics dashboard
- [ ] Scheduled re-scraping
- [ ] API versioning
- [ ] Custom domain support
- [ ] Webhook notifications
- [ ] Data transformation pipelines
- [ ] Team collaboration features
- [ ] API rate limiting per user
- [ ] Billing integration

## 📄 License

This project is for educational/portfolio purposes.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Built with ❤️ using AI-powered web scraping and serverless deployment**

For questions or support, please refer to the documentation files or create an issue.
