@echo off
echo Starting Simple Drive...

REM Create necessary directories
if not exist uploads mkdir uploads

REM Set environment variables
set NODE_ENV=production
set PORT=3000
set BODY_SIZE_LIMIT=4G

echo Server starting on port %PORT%...
echo Upload directory: %cd%\uploads
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start application
node index.js

echo.
echo Server stopped.
pause
