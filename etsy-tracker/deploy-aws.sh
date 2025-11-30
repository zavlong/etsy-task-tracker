#!/bin/bash

# Etsy Tracker - AWS Deployment Script
# This script builds, pushes, and deploys the application to AWS ECS

set -e

echo "🚀 Etsy Tracker AWS Deployment"
echo "================================"

# Configuration
AWS_REGION=${AWS_REGION:-us-east-1}
APP_NAME="etsy-tracker"

# Check prerequisites
command -v aws >/dev/null 2>&1 || { echo "❌ AWS CLI is required but not installed."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed."; exit 1; }
command -v terraform >/dev/null 2>&1 || { echo "❌ Terraform is required but not installed."; exit 1; }

echo "✅ Prerequisites check passed"

# Step 1: Initialize Terraform
echo ""
echo "📦 Step 1: Initializing Terraform..."
cd terraform
terraform init

# Step 2: Apply Terraform (create infrastructure)
echo ""
echo "🏗️  Step 2: Creating AWS infrastructure..."
terraform apply -auto-approve

# Get ECR URLs
BACKEND_ECR=$(terraform output -raw ecr_backend_url)
FRONTEND_ECR=$(terraform output -raw ecr_frontend_url)

echo "✅ Infrastructure created"
echo "   Backend ECR: $BACKEND_ECR"
echo "   Frontend ECR: $FRONTEND_ECR"

# Step 3: Login to ECR
echo ""
echo "🔐 Step 3: Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $BACKEND_ECR

# Step 4: Build and push backend
echo ""
echo "🐳 Step 4: Building and pushing backend..."
cd ../backend
docker build -t $APP_NAME-backend .
docker tag $APP_NAME-backend:latest $BACKEND_ECR:latest
docker push $BACKEND_ECR:latest

# Step 5: Build and push frontend
echo ""
echo "🐳 Step 5: Building and pushing frontend..."
cd ../frontend
docker build -t $APP_NAME-frontend .
docker tag $APP_NAME-frontend:latest $FRONTEND_ECR:latest
docker push $FRONTEND_ECR:latest

# Step 6: Update ECS services
echo ""
echo "🔄 Step 6: Updating ECS services..."
aws ecs update-service \
  --cluster $APP_NAME-prod \
  --service $APP_NAME-backend \
  --force-new-deployment \
  --region $AWS_REGION \
  >/dev/null

aws ecs update-service \
  --cluster $APP_NAME-prod \
  --service $APP_NAME-frontend \
  --force-new-deployment \
  --region $AWS_REGION \
  >/dev/null

# Get the app URL
cd ../terraform
APP_URL=$(terraform output -raw app_url)

echo ""
echo "✅ Deployment complete!"
echo ""
echo "================================"
echo "🌐 Your app is available at:"
echo "   $APP_URL"
echo "================================"
echo ""
echo "📊 Useful commands:"
echo "   View logs: aws logs tail /ecs/$APP_NAME-backend --follow"
echo "   Check status: aws ecs describe-services --cluster $APP_NAME-prod --services $APP_NAME-backend"
echo "   Destroy: cd terraform && terraform destroy"
echo ""
