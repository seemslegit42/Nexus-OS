#!/bin/bash

# Nexus-OS Development Helper Script

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper function for colored output
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install dependencies
install_deps() {
    log "Installing dependencies..."
    if command_exists pnpm; then
        pnpm install
    elif command_exists npm; then
        npm install
    else
        error "Neither pnpm nor npm found. Please install Node.js and pnpm."
        exit 1
    fi
}

# Function to setup development environment
setup_dev() {
    log "Setting up development environment..."
    
    # Install dependencies
    install_deps
    
    # Setup git hooks
    if command_exists husky; then
        npx husky install
        log "Git hooks installed"
    fi
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        cp .env.example .env
        warn "Created .env file from .env.example. Please configure your environment variables."
    fi
    
    log "Development environment setup complete!"
}

# Function to run all checks
check_all() {
    log "Running all checks..."
    
    info "Checking code formatting..."
    pnpm run format:check || warn "Formatting issues found. Run 'pnpm run format' to fix."
    
    info "Running ESLint..."
    pnpm run lint || warn "Linting issues found. Run 'pnpm run lint:fix' to fix."
    
    info "Running TypeScript check..."
    pnpm run typecheck || error "TypeScript errors found."
    
    log "All checks completed!"
}

# Function to fix common issues
fix_issues() {
    log "Fixing common issues..."
    
    info "Formatting code..."
    pnpm run format
    
    info "Fixing ESLint issues..."
    pnpm run lint:fix
    
    info "Clearing cache..."
    pnpm run cache:clear
    
    log "Common issues fixed!"
}

# Function to start development server
dev() {
    log "Starting development server..."
    pnpm run dev
}

# Function to build the project
build() {
    log "Building project..."
    pnpm run build
}

# Function to run database operations
db_operations() {
    case "$1" in
        "generate")
            log "Generating database migrations..."
            pnpm run db:generate
            ;;
        "migrate")
            log "Running database migrations..."
            pnpm run db:migrate
            ;;
        "studio")
            log "Starting database studio..."
            pnpm run db:studio
            ;;
        *)
            info "Available database operations:"
            info "  generate - Generate migrations"
            info "  migrate  - Run migrations"
            info "  studio   - Start database studio"
            ;;
    esac
}

# Function to show help
show_help() {
    echo "Nexus-OS Development Helper"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  setup     - Setup development environment"
    echo "  dev       - Start development server"
    echo "  build     - Build the project"
    echo "  check     - Run all checks (format, lint, typecheck)"
    echo "  fix       - Fix common issues (format, lint, cache)"
    echo "  db [op]   - Database operations (generate, migrate, studio)"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup"
    echo "  $0 dev"
    echo "  $0 check"
    echo "  $0 db generate"
}

# Main script logic
case "${1:-help}" in
    "setup")
        setup_dev
        ;;
    "dev")
        dev
        ;;
    "build")
        build
        ;;
    "check")
        check_all
        ;;
    "fix")
        fix_issues
        ;;
    "db")
        db_operations "$2"
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
