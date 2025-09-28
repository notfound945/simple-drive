#!/bin/bash

# Simple Drive startup script

echo "🚀 Starting Simple Drive..."

# Create necessary directories
mkdir -p uploads

# Set environment variables
export NODE_ENV=production
export PORT=${PORT:-3000}
export BODY_SIZE_LIMIT=4G

echo "📁 Upload directory: $(pwd)/uploads"

# Display network addresses
node get-network-info.js

echo "🌐 Starting server on port $PORT"

# Start application
node index.js
