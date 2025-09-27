@echo off
chcp 65001 >nul

REM Simple Drive 启动脚本

echo 🚀 启动 Simple Drive...

if not exist "uploads" mkdir uploads

REM 设置环境变量
set NODE_ENV=production
if "%PORT%"=="" set PORT=3000
set BODY_SIZE_LIMIT=4G

echo 🌐 启动服务器在端口 %PORT%
echo 📁 上传目录: %cd%\uploads
echo.
echo 按 Ctrl+C 停止服务器
echo.

REM 启动应用
node index.js

pause
