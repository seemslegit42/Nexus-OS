#!/bin/bash

# Nexus-OS Tooling Setup Script
# This script sets up the development environment and creates necessary symlinks

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TOOLING_DIR="$PROJECT_ROOT/tooling"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Function to create symlinks
create_symlink() {
    local source="$1"
    local target="$2"
    
    if [ -L "$target" ]; then
        rm "$target"
    elif [ -f "$target" ] || [ -d "$target" ]; then
        warn "Backing up existing $target to $target.backup"
        mv "$target" "$target.backup"
    fi
    
    ln -sf "$source" "$target"
    log "Created symlink: $target -> $source"
}

# Function to create directory symlinks
create_dir_symlink() {
    local source="$1"
    local target="$2"
    
    if [ -L "$target" ]; then
        rm "$target"
    elif [ -d "$target" ]; then
        warn "Backing up existing $target to $target.backup"
        mv "$target" "$target.backup"
    fi
    
    ln -sf "$source" "$target"
    log "Created directory symlink: $target -> $source"
}

main() {
    log "Setting up Nexus-OS development environment..."
    
    cd "$PROJECT_ROOT"
    
    # Create symlinks for configuration files
    info "Creating symlinks for configuration files..."
    create_symlink "$TOOLING_DIR/configs/.eslintrc.json" "$PROJECT_ROOT/.eslintrc.json"
    create_symlink "$TOOLING_DIR/configs/.prettierrc.json" "$PROJECT_ROOT/.prettierrc.json"
    create_symlink "$TOOLING_DIR/configs/.prettierignore" "$PROJECT_ROOT/.prettierignore"
    create_symlink "$TOOLING_DIR/configs/.editorconfig" "$PROJECT_ROOT/.editorconfig"
    create_symlink "$TOOLING_DIR/configs/.env.example" "$PROJECT_ROOT/.env.example"
    
    # Create symlinks for Docker files
    info "Creating symlinks for Docker files..."
    create_symlink "$TOOLING_DIR/docker/Dockerfile" "$PROJECT_ROOT/Dockerfile"
    create_symlink "$TOOLING_DIR/docker/.dockerignore" "$PROJECT_ROOT/.dockerignore"
    
    # Create symlinks for VS Code directory
    info "Creating symlinks for VS Code configuration..."
    create_dir_symlink "$TOOLING_DIR/vscode" "$PROJECT_ROOT/.vscode"
    
    # Create symlinks for GitHub workflows
    info "Creating symlinks for GitHub workflows..."
    create_dir_symlink "$TOOLING_DIR/github" "$PROJECT_ROOT/.github"
    
    # Create symlinks for Husky hooks
    info "Creating symlinks for Husky hooks..."
    create_dir_symlink "$TOOLING_DIR/husky" "$PROJECT_ROOT/.husky"
    
    # Create symlinks for scripts in project root
    info "Creating symlinks for development scripts..."
    create_symlink "$TOOLING_DIR/scripts/dev.sh" "$PROJECT_ROOT/dev.sh"
    create_symlink "$TOOLING_DIR/scripts/fix-syntax-errors.sh" "$PROJECT_ROOT/fix-syntax-errors.sh"
    
    # Make scripts executable
    chmod +x "$TOOLING_DIR/scripts/"*.sh
    chmod +x "$PROJECT_ROOT/dev.sh"
    chmod +x "$PROJECT_ROOT/fix-syntax-errors.sh"
    
    # Setup environment file if it doesn't exist
    if [ ! -f "$PROJECT_ROOT/.env" ]; then
        cp "$TOOLING_DIR/configs/.env.example" "$PROJECT_ROOT/.env"
        warn "Created .env file from .env.example. Please configure your environment variables."
    fi
    
    log "Tooling setup complete!"
    info "All configuration files are now organized in the tooling/ directory"
    info "Symlinks have been created to maintain compatibility"
    info "Run './dev.sh help' for available development commands"
}

# Show help
show_help() {
    echo "Nexus-OS Tooling Setup"
    echo ""
    echo "This script organizes all development tooling into the tooling/ directory"
    echo "and creates symlinks to maintain compatibility with existing workflows."
    echo ""
    echo "Usage: $0 [--help]"
    echo ""
    echo "The script will:"
    echo "  - Create symlinks for all configuration files"
    echo "  - Set up VS Code, GitHub, and Husky configurations"
    echo "  - Make development scripts executable"
    echo "  - Create .env file if it doesn't exist"
}

# Main execution
case "${1:-setup}" in
    "--help"|"-h"|"help")
        show_help
        ;;
    "setup"|"")
        main
        ;;
    *)
        error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac
