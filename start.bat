@echo off
chcp 65001 >nul

REM Simple Drive 启动脚本

echo 🚀 启动 Simple Drive...

REM 检查是否已构建
if not exist "build" (
    echo 📦 构建应用...
    call npm run build
    if errorlevel 1 (
        echo ❌ 构建失败！
        pause
        exit /b 1
    )
)

REM 创建必要的目录
if not exist "uploads" mkdir uploads
if not exist "logs" mkdir logs

REM 设置环境变量
set NODE_ENV=production
if "%PORT%"=="" set PORT=3000

echo 🌐 启动服务器在端口 %PORT%
echo 📁 上传目录: %cd%\uploads
echo 📝 日志目录: %cd%\logs
echo.
echo 按 Ctrl+C 停止服务器
echo.

REM 启动应用
node build/index.js

pause
