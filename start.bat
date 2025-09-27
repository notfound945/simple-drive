@echo off
setlocal enabledelayedexpansion

REM Set UTF-8 encoding support
chcp 65001 >nul 2>&1

REM Simple Drive startup script

echo.
echo ========================================
echo   Simple Drive Startup Script
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found, please install Node.js first
    echo Download: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if required files exist
if not exist "index.js" (
    echo [ERROR] index.js file not found
    echo Please make sure you are running this script in the correct directory
    pause
    exit /b 1
)

REM Create necessary directories
if not exist "uploads" (
    echo [INFO] Creating uploads directory...
    mkdir uploads
)

REM Set environment variables
set NODE_ENV=production
if "%PORT%"=="" set PORT=3000
set BODY_SIZE_LIMIT=4G

echo [INFO] Environment configuration:
echo   - Run mode: %NODE_ENV%
echo   - Server port: %PORT%
echo   - Upload directory: %cd%\uploads
echo   - File size limit: %BODY_SIZE_LIMIT%
echo.

echo [INFO] Starting server...
echo [TIP] Press Ctrl+C to stop the server
echo.

REM Start application
node index.js

REM If program exits abnormally, show error message
if errorlevel 1 (
    echo.
    echo [ERROR] Server startup failed, error code: %errorlevel%
    echo Please check:
    echo   1. Is Node.js properly installed
    echo   2. Are project dependencies installed (npm install)
    echo   3. Is port %PORT% already in use
    echo   4. Check error messages above
    echo.
)

pause
