#!/bin/bash

# Local AWS Development Script for Baheka Tech Website

set -e

echo "🛠️  Starting local AWS development environment..."

# Check if Serverless Framework is installed
if ! command -v serverless &> /dev/null; then
    echo "❌ Serverless Framework is not installed. Installing now..."
    npm install -g serverless
fi

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start serverless offline
echo "🚀 Starting serverless offline on port 3001..."
echo "📡 API Gateway will be available at: http://localhost:3001"
echo "📁 S3 local simulation will be available"
echo ""
echo "Press Ctrl+C to stop the local server"
echo ""

# Set local environment variables
export STAGE=dev
export AWS_REGION=us-east-1

# Start serverless offline
serverless offline --httpPort 3001 --host 0.0.0.0