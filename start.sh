#!/bin/bash

# Simple Drive 启动脚本

echo "🚀 启动 Simple Drive..."

# 创建必要的目录
mkdir -p uploads

# 设置环境变量
export NODE_ENV=production
export PORT=${PORT:-3000}
export BODY_SIZE_LIMIT=4G

echo "🌐 启动服务器在端口 $PORT"
echo "📁 上传目录: $(pwd)/uploads"

# 启动应用
node index.js
