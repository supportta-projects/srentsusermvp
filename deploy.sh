#!/bin/bash

# Deployment script for srents application
# Run this script on your VPS after initial setup

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /var/www/srentsusermvp

# Pull latest changes from GitHub
echo "📥 Pulling latest changes..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --production

# Build the application
echo "🔨 Building application..."
pnpm run build

# Restart PM2
echo "🔄 Restarting application..."
pm2 restart srents

echo "✅ Deployment complete!"
echo "📊 Check status with: pm2 status"
echo "📝 View logs with: pm2 logs srents"

