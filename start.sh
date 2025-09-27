#!/bin/bash

# Simple Drive startup script

echo "🚀 Starting Simple Drive..."

# Create necessary directories
mkdir -p uploads

# Set environment variables
export NODE_ENV=production
export PORT=${PORT:-3000}
export BODY_SIZE_LIMIT=4G

echo "🌐 Starting server on port $PORT"
echo "📁 Upload directory: $(pwd)/uploads"

# Start application
node index.js
