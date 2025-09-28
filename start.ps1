# Simple Drive PowerShell startup script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Simple Drive Startup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Node.js not found"
    }
    Write-Host "[INFO] Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js not found, please install Node.js first" -ForegroundColor Red
    Write-Host "Download: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check required files
if (-not (Test-Path "index.js")) {
    Write-Host "[ERROR] index.js file not found" -ForegroundColor Red
    Write-Host "Please make sure you are running this script in the correct directory" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Create necessary directories
if (-not (Test-Path "uploads")) {
    Write-Host "[INFO] Creating uploads directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Name "uploads" | Out-Null
}

# Set environment variables
$env:NODE_ENV = "production"
if (-not $env:PORT) { $env:PORT = "3000" }
$env:BODY_SIZE_LIMIT = "4G"

Write-Host "[INFO] Environment configuration:" -ForegroundColor Green
Write-Host "  - Run mode: $env:NODE_ENV" -ForegroundColor White
Write-Host "  - Server port: $env:PORT" -ForegroundColor White
Write-Host "  - Upload directory: $(Get-Location)\uploads" -ForegroundColor White
Write-Host "  - File size limit: $env:BODY_SIZE_LIMIT" -ForegroundColor White
Write-Host ""

Write-Host "[INFO] Starting server..." -ForegroundColor Green
Write-Host "[TIP] Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

try {
    # Start application
    node index.js
} catch {
    Write-Host ""
    Write-Host "[ERROR] Server startup failed" -ForegroundColor Red
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "  1. Is Node.js properly installed" -ForegroundColor White
    Write-Host "  2. Are project dependencies installed (npm install)" -ForegroundColor White
    Write-Host "  3. Is port $env:PORT already in use" -ForegroundColor White
    Write-Host "  4. Check error messages above" -ForegroundColor White
    Write-Host ""
}

Read-Host "Press Enter to exit"
