#!/bin/bash

# Nexus-OS Tooling Management Script
# Utilities for managing the tooling directory

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TOOLING_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }
info() { echo -e "${BLUE}[INFO]${NC} $1"; }

# Validate symlinks
validate_symlinks() {
    log "Validating symlinks..."
    
    local files=(
        ".eslintrc.json:configs/.eslintrc.json"
        ".prettierrc.json:configs/.prettierrc.json"
        ".prettierignore:configs/.prettierignore"
        ".editorconfig:configs/.editorconfig"
        ".env.example:configs/.env.example"
        "Dockerfile:docker/Dockerfile"
        ".dockerignore:docker/.dockerignore"
        "dev.sh:scripts/dev.sh"
        "fix-syntax-errors.sh:scripts/fix-syntax-errors.sh"
    )
    
    local directories=(
        ".vscode:vscode"
        ".github:github"
        ".husky:husky"
    )
    
    local valid=true
    
    for item in "${files[@]}"; do
        IFS=':' read -r target source <<< "$item"
        local target_path="$PROJECT_ROOT/$target"
        local source_path="$TOOLING_DIR/$source"
        
        if [ ! -L "$target_path" ]; then
            error "Missing symlink: $target"
            valid=false
        elif [ "$(readlink "$target_path")" != "$source_path" ]; then
            error "Invalid symlink: $target points to $(readlink "$target_path"), expected $source_path"
            valid=false
        else
            info "✓ $target"
        fi
    done
    
    for item in "${directories[@]}"; do
        IFS=':' read -r target source <<< "$item"
        local target_path="$PROJECT_ROOT/$target"
        local source_path="$TOOLING_DIR/$source"
        
        if [ ! -L "$target_path" ]; then
            error "Missing directory symlink: $target"
            valid=false
        elif [ "$(readlink "$target_path")" != "$source_path" ]; then
            error "Invalid directory symlink: $target points to $(readlink "$target_path"), expected $source_path"
            valid=false
        else
            info "✓ $target/"
        fi
    done
    
    if [ "$valid" = true ]; then
        log "All symlinks are valid!"
    else
        error "Some symlinks are invalid. Run './tooling/setup.sh' to fix."
        exit 1
    fi
}

# Backup tooling directory
backup_tooling() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_dir="$PROJECT_ROOT/tooling_backup_$timestamp"
    
    log "Creating backup of tooling directory..."
    cp -r "$TOOLING_DIR" "$backup_dir"
    log "Backup created: $backup_dir"
}

# Clean up old backups
cleanup_backups() {
    log "Cleaning up old backup files..."
    
    cd "$PROJECT_ROOT"
    
    # Remove .backup files older than 7 days
    find . -name "*.backup" -type f -mtime +7 -delete 2>/dev/null || true
    
    # Remove tooling backup directories older than 7 days
    find . -name "tooling_backup_*" -type d -mtime +7 -exec rm -rf {} + 2>/dev/null || true
    
    log "Old backups cleaned up"
}

# Show tooling status
show_status() {
    log "Nexus-OS Tooling Status"
    echo ""
    
    info "Project Root: $PROJECT_ROOT"
    info "Tooling Directory: $TOOLING_DIR"
    echo ""
    
    info "Configuration Files:"
    ls -la "$TOOLING_DIR/configs/" | grep -v "^total" | awk '{print "  " $9 " (" $5 " bytes)"}'
    echo ""
    
    info "Scripts:"
    ls -la "$TOOLING_DIR/scripts/" | grep -v "^total" | awk '{print "  " $9 " (" $5 " bytes)"}'
    echo ""
    
    info "Docker Files:"
    ls -la "$TOOLING_DIR/docker/" | grep -v "^total" | awk '{print "  " $9 " (" $5 " bytes)"}'
    echo ""
    
    # Check if symlinks exist
    info "Symlink Status:"
    if [ -L "$PROJECT_ROOT/.eslintrc.json" ]; then
        echo "  ✓ ESLint configuration linked"
    else
        echo "  ✗ ESLint configuration not linked"
    fi
    
    if [ -L "$PROJECT_ROOT/.vscode" ]; then
        echo "  ✓ VS Code configuration linked"
    else
        echo "  ✗ VS Code configuration not linked"
    fi
    
    if [ -L "$PROJECT_ROOT/.github" ]; then
        echo "  ✓ GitHub workflows linked"
    else
        echo "  ✗ GitHub workflows not linked"
    fi
}

# Update all configurations from templates
update_configs() {
    log "Updating configurations..."
    
    # This would be where you'd update configs from templates
    # For now, just validate they exist
    
    local required_configs=(
        "configs/.eslintrc.json"
        "configs/.prettierrc.json"
        "configs/.editorconfig"
        "vscode/settings.json"
        "vscode/extensions.json"
    )
    
    for config in "${required_configs[@]}"; do
        if [ -f "$TOOLING_DIR/$config" ]; then
            info "✓ $config exists"
        else
            error "✗ $config missing"
        fi
    done
}

# Show help
show_help() {
    echo "Nexus-OS Tooling Management"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  validate    - Validate all symlinks are correct"
    echo "  status      - Show tooling directory status"
    echo "  backup      - Create backup of tooling directory"
    echo "  cleanup     - Clean up old backup files"
    echo "  update      - Update configurations"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 validate"
    echo "  $0 status"
    echo "  $0 backup"
}

# Main execution
case "${1:-help}" in
    "validate")
        validate_symlinks
        ;;
    "status")
        show_status
        ;;
    "backup")
        backup_tooling
        ;;
    "cleanup")
        cleanup_backups
        ;;
    "update")
        update_configs
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
