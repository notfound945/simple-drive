@echo off
chcp 65001 >nul

REM Simple Drive GitHub 发布脚本
REM 用于创建和推送 Git 标签，触发 GitHub Actions 自动构建和发布

setlocal enabledelayedexpansion

REM 检查参数
if "%~1"=="" (
    echo Simple Drive GitHub 发布脚本
    echo.
    echo 用法:
    echo   %0 ^<version^> [选项]
    echo.
    echo 参数:
    echo   version     版本号 (例如: 1.0.0, v1.0.0)
    echo.
    echo 选项:
    echo   -d, --dry-run  仅显示将要执行的操作，不实际执行
    echo.
    echo 示例:
    echo   %0 1.0.0
    echo   %0 v1.0.0
    echo   %0 1.0.0 --dry-run
    exit /b 0
)

set VERSION=%~1
set DRY_RUN=false

REM 处理选项
:parse_args
if "%~1"=="" goto :args_done
if "%~1"=="-d" (
    set DRY_RUN=true
    shift
    goto :parse_args
)
if "%~1"=="--dry-run" (
    set DRY_RUN=true
    shift
    goto :parse_args
)
shift
goto :parse_args

:args_done

REM 确保版本号以 v 开头
echo %VERSION% | findstr /r "^v" >nul
if errorlevel 1 (
    set VERSION=v%VERSION%
)

echo 🚀 Simple Drive GitHub 发布脚本
echo ================================
echo.

REM 检查是否在 git 仓库中
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 当前目录不是 Git 仓库
    exit /b 1
)

REM 检查工作目录是否干净
git diff-index --quiet HEAD -- >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 工作目录有未提交的更改
    echo 请先提交或暂存所有更改
    exit /b 1
)

REM 检查标签是否已存在
git rev-parse %VERSION% >nul 2>&1
if not errorlevel 1 (
    echo ❌ 错误: 标签 %VERSION% 已存在
    exit /b 1
)

REM 显示将要执行的操作
echo 📋 将要执行的操作:
echo   1. 创建标签: %VERSION%
echo   2. 推送标签到远程仓库
echo   3. 触发 GitHub Actions 构建和发布流程
echo.

if "%DRY_RUN%"=="true" (
    echo 🔍 试运行模式 - 不会实际执行操作
    exit /b 0
)

REM 确认操作
set /p CONFIRM="是否继续? (y/N): "
if /i not "%CONFIRM%"=="y" (
    echo ❌ 操作已取消
    exit /b 0
)

echo.
echo 📦 创建标签 %VERSION%...
git tag -a %VERSION% -m "Release %VERSION%"
if errorlevel 1 (
    echo ❌ 创建标签失败
    exit /b 1
)

echo 📤 推送标签到远程仓库...
git push origin %VERSION%
if errorlevel 1 (
    echo ❌ 推送标签失败
    exit /b 1
)

echo.
echo ✅ 标签 %VERSION% 已成功创建并推送
echo.
echo 📋 接下来的步骤:
echo   1. 访问 GitHub 仓库的 Actions 页面查看构建进度
echo   2. 等待构建完成
echo   3. 在 Releases 页面下载发布包
echo.
echo 🔗 有用的链接:
for /f "tokens=*" %%i in ('git config --get remote.origin.url') do set REPO_URL=%%i
set REPO_URL=!REPO_URL:.git=!
echo   - 仓库页面: !REPO_URL!
echo   - Actions: !REPO_URL!/actions
echo   - Releases: !REPO_URL!/releases
echo.
echo 🎉 发布流程已启动！

pause
