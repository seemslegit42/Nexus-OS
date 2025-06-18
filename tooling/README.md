# Nexus-OS Tooling Directory

This directory contains all development tooling, configuration files, and scripts for the Nexus-OS project, organized for better maintainability and clarity.

## 📁 Directory Structure

```
tooling/
├── configs/           # Configuration files
│   ├── .eslintrc.json     # ESLint configuration
│   ├── .prettierrc.json  # Prettier configuration
│   ├── .prettierignore    # Prettier ignore rules
│   ├── .editorconfig      # Editor configuration
│   └── .env.example       # Environment variables template
├── docker/            # Container configuration
│   ├── Dockerfile         # Docker build configuration
│   └── .dockerignore      # Docker ignore rules
├── github/            # GitHub workflows and templates
│   └── workflows/
│       └── ci.yml         # CI/CD pipeline
├── husky/             # Git hooks
│   └── pre-commit         # Pre-commit hook
├── scripts/           # Development scripts
│   ├── dev.sh             # Main development helper
│   └── fix-syntax-errors.sh  # Syntax error fixer
├── vscode/            # VS Code workspace configuration
│   ├── settings.json      # Editor settings
│   ├── extensions.json   # Recommended extensions
│   ├── tasks.json        # Build tasks
│   └── launch.json       # Debug configurations
├── setup.sh           # Tooling setup script
└── README.md          # This file
```

## 🚀 Quick Setup

Run the setup script to organize all tooling and create necessary symlinks:

```bash
cd tooling
./setup.sh
```

This will:

- Create symlinks in the project root for all configuration files
- Maintain compatibility with existing development workflows
- Set up VS Code, GitHub Actions, and Git hooks
- Make all scripts executable

## 🛠️ Configuration Files

### Code Quality

- **ESLint** (`configs/.eslintrc.json`): TypeScript-focused linting rules
- **Prettier** (`configs/.prettierrc.json`): Code formatting with Tailwind CSS support
- **EditorConfig** (`configs/.editorconfig`): Consistent editor settings across IDEs

### Development Environment

- **VS Code** (`vscode/`): Complete workspace configuration with extensions and debugging
- **Environment** (`configs/.env.example`): Template for environment variables

### Containerization

- **Docker** (`docker/`): Production-ready container configuration with multi-stage builds

### CI/CD

- **GitHub Actions** (`github/workflows/ci.yml`): Automated testing and build pipeline
- **Git Hooks** (`husky/`): Pre-commit quality checks

## 🔧 Development Scripts

### Main Development Helper (`scripts/dev.sh`)

Comprehensive script for common development tasks:

```bash
./dev.sh setup     # Setup development environment
./dev.sh dev       # Start development server
./dev.sh build     # Build the project
./dev.sh check     # Run all quality checks
./dev.sh fix       # Fix common issues
./dev.sh db [op]   # Database operations
```

### Syntax Error Fixer (`scripts/fix-syntax-errors.sh`)

Helper script to backup and fix syntax errors in problematic files.

## 📋 Maintenance

### Adding New Configuration

1. Add new config files to the appropriate subdirectory in `tooling/`
2. Update `setup.sh` to create symlinks if needed
3. Update this README with documentation

### Modifying Existing Configuration

1. Edit files directly in the `tooling/` directory
2. Changes will be reflected immediately due to symlinks
3. Commit changes from the `tooling/` directory

### VS Code Integration

The tooling directory is configured to work seamlessly with VS Code:

- Automatic formatting on save
- ESLint integration with auto-fix
- Tailwind CSS IntelliSense
- TypeScript strict checking
- Debugging configurations

## 🔄 Symlink Management

The `setup.sh` script creates symlinks from the project root to the tooling directory:

```
Project Root          ->  Tooling Directory
.eslintrc.json        ->  tooling/configs/.eslintrc.json
.prettierrc.json      ->  tooling/configs/.prettierrc.json
.vscode/              ->  tooling/vscode/
.github/              ->  tooling/github/
Dockerfile            ->  tooling/docker/Dockerfile
dev.sh                ->  tooling/scripts/dev.sh
```

This approach provides:

- ✅ Clean organization of tooling files
- ✅ Backward compatibility with existing workflows
- ✅ Single source of truth for configurations
- ✅ Easy maintenance and updates

## 🚨 Troubleshooting

### Symlinks Not Working

If symlinks aren't working properly:

```bash
cd tooling
./setup.sh  # Re-run setup script
```

### Configuration Changes Not Taking Effect

Ensure you're editing files in the `tooling/` directory, not the symlinked files in the project root.

### Scripts Not Executable

```bash
chmod +x tooling/scripts/*.sh
chmod +x tooling/setup.sh
```

## 📚 Related Documentation

- [DEVELOPMENT.md](../DEVELOPMENT.md) - Main development documentation
- [README.md](../README.md) - Project overview
- [package.json](../package.json) - Available npm scripts
