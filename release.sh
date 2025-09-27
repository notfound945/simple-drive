#!/bin/bash

# Simple Drive GitHub release script
# Used to create and push Git tags, trigger GitHub Actions for automatic build and release

set -e

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Show help information
show_help() {
    echo "Simple Drive GitHub release script"
    echo ""
    echo "Usage:"
    echo "  $0 <version> [options]"
    echo ""
    echo "Arguments:"
    echo "  version     Version number (e.g.: 1.0.0, v1.0.0)"
    echo ""
    echo "Options:"
    echo "  -h, --help  Show this help information"
    echo "  -d, --dry-run  Only show operations to be performed, don't actually execute"
    echo ""
    echo "Examples:"
    echo "  $0 1.0.0"
    echo "  $0 v1.0.0"
    echo "  $0 1.0.0 --dry-run"
}

# Check arguments
if [ $# -eq 0 ] || [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
    exit 0
fi

VERSION=$1
DRY_RUN=false

# Process options
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

# Ensure version number starts with v
if [[ ! $VERSION =~ ^v ]]; then
    VERSION="v$VERSION"
fi

echo -e "${BLUE}🚀 Simple Drive GitHub Release Script${NC}"
echo -e "${BLUE}====================================${NC}"
echo ""

# Check if in git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Current directory is not a Git repository${NC}"
    exit 1
fi

# Check if working directory is clean
if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}❌ Error: Working directory has uncommitted changes${NC}"
    echo "Please commit or stash all changes first"
    exit 1
fi

# Check if tag already exists
if git rev-parse "$VERSION" > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Tag $VERSION already exists${NC}"
    exit 1
fi

# Show operations to be performed
echo -e "${YELLOW}📋 Operations to be performed:${NC}"
echo "  1. Create tag: $VERSION"
echo "  2. Push tag to remote repository"
echo "  3. Trigger GitHub Actions build and release process"
echo ""

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}🔍 Dry run mode - operations will not be executed${NC}"
    exit 0
fi

# Confirm operation
read -p "Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ Operation cancelled${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}📦 Creating tag $VERSION...${NC}"
git tag -a "$VERSION" -m "Release $VERSION"

echo -e "${BLUE}📤 Pushing tag to remote repository...${NC}"
git push origin "$VERSION"

echo ""
echo -e "${GREEN}✅ Tag $VERSION successfully created and pushed${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "  1. Visit the GitHub repository Actions page to view build progress"
echo "  2. Wait for build completion"
echo "  3. Download release package from Releases page"
echo ""
echo -e "${BLUE}🔗 Useful links:${NC}"
echo "  - Repository: $(git config --get remote.origin.url | sed 's/\.git$//')"
echo "  - Actions: $(git config --get remote.origin.url | sed 's/\.git$//')/actions"
echo "  - Releases: $(git config --get remote.origin.url | sed 's/\.git$//')/releases"
echo ""
echo -e "${GREEN}🎉 Release process started!${NC}"
