# 📦 Etsy Shop Tracker

A modern, sleek web application to track your daily Etsy shop operations with a beautiful glassmorphic UI.

## Features

✨ **Beautiful Modern UI** - Glassmorphism design with dark theme  
📊 **Weekly Progress Tracking** - Visual progress bars for daily and weekly completion  
💾 **Persistent Storage** - SQLite database stores all your data  
🐳 **Easy Deployment** - Docker containers for local or cloud deployment  
📱 **Responsive Design** - Works on desktop, tablet, and mobile  

## Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone or navigate to the project directory
cd etsy-tracker

# Start the application
docker-compose up -d

# Access the app at http://localhost:3000
```

That's it! The app will be running with both frontend and backend.

### Option 2: Run Locally (Development)

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python main.py
# API runs at http://localhost:8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:3000
```

## Deployment Options

### 1. Local Docker (Current Setup)
- Perfect for running on your local machine
- Data persists in the `./data` directory
- Access via `http://localhost:3000`

### 2. AWS Deployment Options

#### Option A: AWS ECS (Recommended for you)
Since you work with ECS, this should be familiar:

```bash
# Build and push images to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_URL

docker build -t etsy-tracker-backend ./backend
docker tag etsy-tracker-backend:latest YOUR_ECR_URL/etsy-tracker-backend:latest
docker push YOUR_ECR_URL/etsy-tracker-backend:latest

docker build -t etsy-tracker-frontend ./frontend
docker tag etsy-tracker-frontend:latest YOUR_ECR_URL/etsy-tracker-frontend:latest
docker push YOUR_ECR_URL/etsy-tracker-frontend:latest
```

Then deploy via ECS task definitions. Use EFS or RDS for persistent storage.

#### Option B: AWS S3 + API Gateway (Static + Serverless)
For the frontend:
```bash
cd frontend
npm run build
aws s3 sync dist/ s3://your-bucket-name --delete
```

Convert the backend to Lambda functions for true serverless.

#### Option C: AWS Lightsail
Simplest AWS option - one-click container deployment for ~$10/month.

### 3. Other Cloud Platforms

**Heroku:**
```bash
heroku container:push web -a your-app-name
heroku container:release web -a your-app-name
```

**DigitalOcean App Platform:**
- Connect your GitHub repo
- Auto-deploys on push

**Fly.io:**
```bash
fly launch
fly deploy
```

## Database Persistence

**Local Docker:** Data is stored in `./data/etsy_tracker.db`

**AWS Options:**
- Use RDS for PostgreSQL (change DATABASE_URL in docker-compose.yml)
- Use EFS for SQLite file persistence
- Use DynamoDB (requires code changes)

### Switching to PostgreSQL

Update `backend/requirements.txt`:
```
psycopg2-binary==2.9.9
```

Update environment variable:
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌──────────┐
│   React     │─────▶│   FastAPI    │─────▶│  SQLite  │
│  Frontend   │      │   Backend    │      │ Database │
│  (Port 80)  │      │  (Port 8000) │      │          │
└─────────────┘      └──────────────┘      └──────────┘
```

## Tech Stack

- **Frontend:** React 18 + Vite + date-fns
- **Backend:** FastAPI + SQLAlchemy
- **Database:** SQLite (easily swappable to PostgreSQL)
- **Deployment:** Docker + Docker Compose

## Customization

### Adding/Removing Tasks

Edit `frontend/src/App.jsx`, modify the `TASKS` array:

```javascript
const TASKS = [
  { 
    id: 'your-task', 
    name: 'Your Task Name', 
    frequency: 'daily', // or 'weekly'
    priority: 'high', // 'high', 'medium', 'low'
    time: 30, // minutes
    days: [1, 3, 5] // for weekly: Mon=1, Sun=7
  },
  // ... more tasks
];
```

### Styling

All styles are in `frontend/src/App.css`. Color scheme is defined in CSS variables at the top.

### Database Schema

The `week_data` table stores:
- `week_key`: ISO date of Monday (YYYY-MM-DD)
- `completions`: JSON of completed tasks
- `listed`, `sales`, `revenue`: Weekly stats

## Terraform Deployment (Advanced)

Want to deploy to AWS with Terraform? I can create a complete Terraform setup with:
- ECS cluster
- Application Load Balancer
- RDS database
- CloudWatch logging
- Auto-scaling

Just ask!

## Troubleshooting

**Port already in use:**
```bash
docker-compose down
docker-compose up -d
```

**Frontend can't reach backend:**
Check that both containers are on the same network:
```bash
docker network ls
docker network inspect etsy-tracker_default
```

**Data not persisting:**
Ensure the `./data` directory has write permissions:
```bash
chmod -R 755 ./data
```

## Support

This is a custom build for your Etsy shop workflow. Modify as needed!

## License

MIT - Do whatever you want with it!
