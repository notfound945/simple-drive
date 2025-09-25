#!/bin/bash

# Simple Drive GitHub 发布脚本
# 用于创建和推送 Git 标签，触发 GitHub Actions 自动构建和发布

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 显示帮助信息
show_help() {
    echo "Simple Drive GitHub 发布脚本"
    echo ""
    echo "用法:"
    echo "  $0 <version> [选项]"
    echo ""
    echo "参数:"
    echo "  version     版本号 (例如: 1.0.0, v1.0.0)"
    echo ""
    echo "选项:"
    echo "  -h, --help  显示此帮助信息"
    echo "  -d, --dry-run  仅显示将要执行的操作，不实际执行"
    echo ""
    echo "示例:"
    echo "  $0 1.0.0"
    echo "  $0 v1.0.0"
    echo "  $0 1.0.0 --dry-run"
}

# 检查参数
if [ $# -eq 0 ] || [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
    exit 0
fi

VERSION=$1
DRY_RUN=false

# 处理选项
while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        *)
            if [ -z "$VERSION" ] || [ "$VERSION" = "$1" ]; then
                VERSION=$1
            fi
            shift
            ;;
    esac
done

# 确保版本号以 v 开头
if [[ ! $VERSION =~ ^v ]]; then
    VERSION="v$VERSION"
fi

echo -e "${BLUE}🚀 Simple Drive GitHub 发布脚本${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# 检查是否在 git 仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ 错误: 当前目录不是 Git 仓库${NC}"
    exit 1
fi

# 检查工作目录是否干净
if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}❌ 错误: 工作目录有未提交的更改${NC}"
    echo "请先提交或暂存所有更改"
    exit 1
fi

# 检查标签是否已存在
if git rev-parse "$VERSION" > /dev/null 2>&1; then
    echo -e "${RED}❌ 错误: 标签 $VERSION 已存在${NC}"
    exit 1
fi

# 显示将要执行的操作
echo -e "${YELLOW}📋 将要执行的操作:${NC}"
echo "  1. 创建标签: $VERSION"
echo "  2. 推送标签到远程仓库"
echo "  3. 触发 GitHub Actions 构建和发布流程"
echo ""

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}🔍 试运行模式 - 不会实际执行操作${NC}"
    exit 0
fi

# 确认操作
read -p "是否继续? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ 操作已取消${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}📦 创建标签 $VERSION...${NC}"
git tag -a "$VERSION" -m "Release $VERSION"

echo -e "${BLUE}📤 推送标签到远程仓库...${NC}"
git push origin "$VERSION"

echo ""
echo -e "${GREEN}✅ 标签 $VERSION 已成功创建并推送${NC}"
echo ""
echo -e "${YELLOW}📋 接下来的步骤:${NC}"
echo "  1. 访问 GitHub 仓库的 Actions 页面查看构建进度"
echo "  2. 等待构建完成"
echo "  3. 在 Releases 页面下载发布包"
echo ""
echo -e "${BLUE}🔗 有用的链接:${NC}"
echo "  - 仓库页面: $(git config --get remote.origin.url | sed 's/\.git$//')"
echo "  - Actions: $(git config --get remote.origin.url | sed 's/\.git$//')/actions"
echo "  - Releases: $(git config --get remote.origin.url | sed 's/\.git$//')/releases"
echo ""
echo -e "${GREEN}🎉 发布流程已启动！${NC}"
