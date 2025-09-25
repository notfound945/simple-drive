#!/bin/bash

# Simple Drive 启动脚本

echo "🚀 启动 Simple Drive..."

# 检查是否已构建
if [ ! -d "build" ]; then
    echo "📦 构建应用..."
    npm run build
fi

# 创建必要的目录
mkdir -p uploads logs

# 设置环境变量
export NODE_ENV=production
export PORT=${PORT:-3000}

echo "🌐 启动服务器在端口 $PORT"
echo "📁 上传目录: $(pwd)/uploads"
echo "📝 日志目录: $(pwd)/logs"

# 启动应用
node build/index.js
