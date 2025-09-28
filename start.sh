#!/bin/bash

# Simple Drive startup script

echo "Starting Simple Drive..."

# Create necessary directories
mkdir -p uploads

# Set environment variables
export NODE_ENV=production
export PORT=${PORT:-3000}
export BODY_SIZE_LIMIT=4G

echo "Upload directory: $(pwd)/uploads"

# Display network addresses
echo ""
echo "Available addresses:"
echo "========================================"
echo "Network access:"

# Get network interfaces and their IP addresses
# Try 'ip' command first (modern Linux), fallback to 'ifconfig'
if command -v ip >/dev/null 2>&1; then
    # Use 'ip' command (modern Linux)
    ip -4 addr show | grep -oP '(?<=inet\s)\d+(\.\d+){3}' | grep -v '127.0.0.1' | while read ip; do
        echo "   http://$ip:$PORT"
    done
elif command -v ifconfig >/dev/null 2>&1; then
    # Use 'ifconfig' command (macOS, older Linux)
    ifconfig | grep -E 'inet [0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' | grep -v '127.0.0.1' | awk '{print $2}' | while read ip; do
        echo "   http://$ip:$PORT"
    done
else
    echo "   ERROR: Cannot get network interface information"
fi

echo "========================================"
echo ""

echo "Starting server on port $PORT"

# Start application
node index.js
