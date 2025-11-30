# 🚀 Quick Start Guide - Etsy Tracker

Your complete Etsy operations tracker is ready to deploy!

## 📁 Project Structure

```
etsy-tracker/
├── frontend/           # React app with modern UI
├── backend/            # FastAPI server + SQLite
├── terraform/          # AWS ECS deployment
├── docker-compose.yml  # Local deployment
└── deploy-aws.sh       # One-click AWS deploy
```

## 🎯 Fastest Way to Run (3 commands)

```bash
cd etsy-tracker
docker-compose up -d
# Open http://localhost:3000
```

**Done!** Your tracker is running.

## 🎨 What You Get

- ✅ Beautiful dark-themed UI with glassmorphism
- ✅ Weekly task tracking with progress bars
- ✅ Daily tasks (messages, photos, listings, etc.)
- ✅ Weekly tasks (sourcing, shipping, SEO)
- ✅ Stats tracking (items listed, sales, revenue)
- ✅ Persistent SQLite database
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ One-click deployment options

## 🔧 Deployment Options

### 1. Local (Recommended to Start)

```bash
docker-compose up -d
```

### 2. AWS ECS (Your Expertise!)

```bash
./deploy-aws.sh
```

This creates:
- ECS Fargate cluster
- Application Load Balancer
- ECR repositories
- EFS for data persistence
- CloudWatch logging

### 3. Other Platforms

- **AWS Lightsail** - Easiest AWS option
- **Heroku**
- **DigitalOcean**
- **Fly.io**

See [README.md](README.md) for details.

## 💡 Customization

### Edit Tasks

File: `frontend/src/App.jsx`

```javascript
const TASKS = [
  { id: 'task-id', name: 'Task Name', frequency: 'daily', ... }
]
```

### Change Colors

File: `frontend/src/App.css`

```css
:root {
  --primary: #8b5cf6;
  --secondary: #10b981;
  ...
}
```

## 🗄️ Database

**Default:** SQLite (file-based, simple)  
**Location:** `./data/etsy_tracker.db`

### Upgrade to PostgreSQL

1. Update `backend/requirements.txt` (add `psycopg2-binary`)
2. Change `DATABASE_URL` environment variable
3. Works with AWS RDS out of the box

## 📊 Data Structure

Each week tracks:
- Task completions (daily checkboxes)
- Items listed count
- Sales count
- Revenue amount

Navigate weeks with arrows in the UI.

## 🎯 Your Daily Workflow

1. Open the app (bookmark `http://localhost:3000`)
2. Check off tasks as you complete them
3. Update your stats at end of day
4. Visual progress keeps you motivated!

The app is designed for **YOUR** workflow:
- Photo 3-5 items daily
- List 2-3 items daily
- Sourcing trips Mon/Wed/Sat
- Shipping runs Mon/Thu
- Weekly SEO optimization

## ⚠️ Important Notes

- Data persists between restarts
- Backup `./data/` directory regularly
- For production, use PostgreSQL or RDS
- HTTPS recommended for public deployment

## 🔐 AWS Deployment Cost Estimate

Using Fargate + ALB:
- 2 Fargate tasks (0.25 vCPU, 0.5GB): ~$20/month
- Application Load Balancer: ~$16/month
- EFS storage: ~$0.30/GB/month
- **Total: ~$40-50/month**

**Cheaper option:** AWS Lightsail container (~$10/month)

## 📚 Next Steps

1. Try it locally first: `docker-compose up -d`
2. Customize tasks to match your workflow
3. Deploy to AWS when ready: `./deploy-aws.sh`
4. Set up daily reminder notifications (future feature)

## 🆘 Troubleshooting

### Port 3000 in use?
→ Change in `docker-compose.yml`: `"3001:80"`

### Data not saving?
→ Check `./data/` directory permissions

### Can't connect to backend?
```bash
docker-compose logs backend
```

### Need help?
→ Check [README.md](README.md) for detailed docs

## 🎨 Tech Stack

- **Frontend:** React 18 + Vite + Modern CSS
- **Backend:** FastAPI + SQLAlchemy + SQLite
- **Deploy:** Docker + Terraform + AWS ECS
- **You already know:** Python, Terraform, AWS!

Enjoy tracking your Etsy success! 📦✨
