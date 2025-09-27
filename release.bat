@echo off
chcp 65001 >nul

REM Simple Drive GitHub release script
REM Used to create and push Git tags, trigger GitHub Actions for automatic build and release

setlocal enabledelayedexpansion

REM Check arguments
if "%~1"=="" (
    echo Simple Drive GitHub release script
    echo.
    echo Usage:
    echo   %0 ^<version^> [options]
    echo.
    echo Arguments:
    echo   version     Version number (e.g.: 1.0.0, v1.0.0)
    echo.
    echo Options:
    echo   -d, --dry-run  Only show operations to be performed, don't actually execute
    echo.
    echo Examples:
    echo   %0 1.0.0
    echo   %0 v1.0.0
    echo   %0 1.0.0 --dry-run
    exit /b 0
)

set VERSION=%~1
set DRY_RUN=false

REM Process options
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

REM Ensure version number starts with v
echo %VERSION% | findstr /r "^v" >nul
if errorlevel 1 (
    set VERSION=v%VERSION%
)

echo 🚀 Simple Drive GitHub Release Script
echo ====================================
echo.

REM Check if in git repository
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Current directory is not a Git repository
    exit /b 1
)

REM Check if working directory is clean
git diff-index --quiet HEAD -- >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Working directory has uncommitted changes
    echo Please commit or stash all changes first
    exit /b 1
)

REM Check if tag already exists
git rev-parse %VERSION% >nul 2>&1
if not errorlevel 1 (
    echo ❌ Error: Tag %VERSION% already exists
    exit /b 1
)

REM Show operations to be performed
echo 📋 Operations to be performed:
echo   1. Create tag: %VERSION%
echo   2. Push tag to remote repository
echo   3. Trigger GitHub Actions build and release process
echo.

if "%DRY_RUN%"=="true" (
    echo 🔍 Dry run mode - operations will not be executed
    exit /b 0
)

REM Confirm operation
set /p CONFIRM="Continue? (y/N): "
if /i not "%CONFIRM%"=="y" (
    echo ❌ Operation cancelled
    exit /b 0
)

echo.
echo 📦 Creating tag %VERSION%...
git tag -a %VERSION% -m "Release %VERSION%"
if errorlevel 1 (
    echo ❌ Failed to create tag
    exit /b 1
)

echo 📤 Pushing tag to remote repository...
git push origin %VERSION%
if errorlevel 1 (
    echo ❌ Failed to push tag
    exit /b 1
)

echo.
echo ✅ Tag %VERSION% successfully created and pushed
echo.
echo 📋 Next steps:
echo   1. Visit the GitHub repository Actions page to view build progress
echo   2. Wait for build completion
echo   3. Download release package from Releases page
echo.
echo 🔗 Useful links:
for /f "tokens=*" %%i in ('git config --get remote.origin.url') do set REPO_URL=%%i
set REPO_URL=!REPO_URL:.git=!
echo   - Repository: !REPO_URL!
echo   - Actions: !REPO_URL!/actions
echo   - Releases: !REPO_URL!/releases
echo.
echo 🎉 Release process started!

pause
