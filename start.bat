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

REM Display network addresses
echo.
echo Available addresses:
echo ========================================
echo Network access:
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /c:"IPv4"') do (
    set "ip=%%i"
    set "ip=!ip: =!"
    if not "!ip!"=="127.0.0.1" (
        echo    http://!ip!:%PORT%
    )
)
echo ========================================
echo.

echo [INFO] Starting server...
echo [TIP] Press Ctrl+C to stop the server
echo.

REM Start application in background and get the first network IP
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /c:"IPv4"') do (
    set "ip=%%i"
    set "ip=!ip: =!"
    if not "!ip!"=="127.0.0.1" (
        set "FIRST_IP=!ip!"
        goto :found_ip
    )
)
:found_ip

REM Start server in background
start /b node index.js

REM Wait a moment for server to start
timeout /t 3 /nobreak >nul

REM Open browser
if defined FIRST_IP (
    echo [INFO] Opening browser at http://!FIRST_IP!:%PORT%
    start http://!FIRST_IP!:%PORT%
) else (
    echo [INFO] Opening browser at http://localhost:%PORT%
    start http://localhost:%PORT%
)

REM Wait for user to stop
echo [INFO] Server is running. Press any key to stop...
pause >nul

REM Kill the background process
taskkill /f /im node.exe >nul 2>&1

echo [INFO] Server stopped.
pause
