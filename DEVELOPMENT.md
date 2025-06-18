# Nexus-OS Development Setup

This document outlines the tooling and configuration setup for the Nexus-OS project.

## �️ Tooling Organization

All development tooling is organized in the `tooling/` directory with symlinks to maintain compatibility:

```
tooling/
├── configs/           # Configuration files
├── docker/            # Container configuration
├── github/            # GitHub workflows
├── husky/             # Git hooks
├── scripts/           # Development scripts
├── vscode/            # VS Code configuration
├── setup.sh           # Tooling setup script
└── README.md          # Tooling documentation
```

**Quick Setup:** Run `./tooling/setup.sh` to organize all tooling and create symlinks.

## �🛠️ Tooling Overview

### Core Development Tools

- **Package Manager**: pnpm (configured with optimizations)
- **Bundler**: Next.js 15+ with Turbo
- **TypeScript**: Strict configuration with enhanced rules
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier with Tailwind CSS plugin
- **Git Hooks**: Husky for pre-commit checks
- **Database**: Drizzle ORM with PostgreSQL
- **AI**: Google Genkit integration

### Development Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm dev:perf         # Start with performance monitoring
pnpm build            # Production build
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format code with Prettier
pnpm format:check     # Check formatting
pnpm typecheck        # TypeScript type checking
pnpm check-all        # Run all checks

# Database
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open database studio

# Performance
pnpm build:analyze    # Analyze bundle size
pnpm test:perf        # Run Lighthouse performance test
```

### Helper Scripts

- `./dev.sh` - Main development helper script
- `./fix-syntax-errors.sh` - Fix syntax issues in problematic files
- `./tooling/setup.sh` - Organize tooling and create symlinks
- `./tooling/scripts/manage.sh` - Tooling management utilities

## 📁 Organized Configuration

All configuration files are now organized in the `tooling/` directory:

### Core Configuration

- `.eslintrc.json` - ESLint configuration
- `.prettierrc.json` - Prettier configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `next.config.ts` - Next.js configuration

### Development Environment

- `.vscode/` - VS Code workspace settings
  - `settings.json` - Editor settings
  - `extensions.json` - Recommended extensions
  - `tasks.json` - Build tasks
  - `launch.json` - Debug configurations
- `.editorconfig` - Editor configuration
- `.gitignore` - Git ignore rules
- `.npmrc` - npm/pnpm configuration

### CI/CD

- `.github/workflows/ci.yml` - GitHub Actions workflow
- `.husky/` - Git hooks
- `Dockerfile` - Container configuration
- `.dockerignore` - Docker ignore rules

## 🚀 Quick Start

1. **Setup development environment:**

   ```bash
   ./dev.sh setup
   ```

2. **Start development server:**

   ```bash
   ./dev.sh dev
   # or
   pnpm dev
   ```

3. **Run quality checks:**
   ```bash
   ./dev.sh check
   # or
   pnpm check-all
   ```

## 🔧 IDE Setup

### VS Code (Recommended)

Install the recommended extensions:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Hero
- Auto Rename Tag
- Path Intellisense

The workspace is configured to:

- Format on save
- Fix linting issues on save
- Organize imports automatically
- Enable Tailwind CSS intellisense

### Other IDEs

Make sure to configure:

- TypeScript language server
- ESLint integration
- Prettier formatting
- EditorConfig support

## 📋 Code Quality Standards

### Formatting

- 2 spaces for indentation
- Single quotes for strings
- Trailing commas where valid
- Line length: 80 characters
- LF line endings

### Linting Rules

- TypeScript strict mode enabled
- No unused variables (prefix with \_ to ignore)
- Prefer const over let
- Console warnings in development
- Import order enforcement

### Git Workflow

Pre-commit hooks run:

1. Prettier formatting
2. ESLint fixing
3. TypeScript type checking

## 🐳 Docker Support

Build and run with Docker:

```bash
# Build image
docker build -t nexus-os .

# Run container
docker run -p 3000:3000 nexus-os
```

## 🔍 Performance Monitoring

- Bundle analysis: `pnpm build:analyze`
- Lighthouse testing: `pnpm test:perf`
- Performance metrics in development
- Web Vitals tracking

## 🗄️ Database Development

Using Drizzle ORM:

```bash
# Generate schema changes
pnpm db:generate

# Apply migrations
pnpm db:migrate

# View database
pnpm db:studio
```

## 🤖 AI Development

Google Genkit integration:

```bash
# Start AI development server
pnpm genkit:dev

# Watch mode for AI flows
pnpm genkit:watch
```

## 🚨 Troubleshooting

### Common Issues

1. **Formatting errors**: Run `pnpm format`
2. **Linting errors**: Run `pnpm lint:fix`
3. **TypeScript errors**: Run `pnpm typecheck`
4. **Build issues**: Run `pnpm cache:clear`
5. **Syntax errors**: Run `./fix-syntax-errors.sh`

### Getting Help

- Check the development script: `./dev.sh help`
- Review configuration files in the project root
- Check VS Code problems panel for issues
- Use the integrated terminal for command output
