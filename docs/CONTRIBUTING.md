# Contributing to Semaphore

Thank you for your interest in contributing to Semaphore! We welcome contributions of all kinds, from bug reports and feature requests to code improvements and documentation updates.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Review Process](#review-process)
- [Community](#community)

## 🤝 Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow. Please be respectful, inclusive, and professional in all interactions.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Go 1.25+** - [Installation Guide](https://golang.org/dl/)
- **Node 22+** - [Installation Guide](https://nodejs.org/en/download/)
- **PostgreSQL 15+**
- **Redis 7+**
- **Docker & Docker Compose** - [Installation Guide](https://docs.docker.com/get-docker/)
- **Git** - [Installation Guide](https://git-scm.com/downloads)

### Development Tools

**Required:**

- `goose` - Database migration tool: `go install github.com/pressly/goose/v3/cmd/goose@latest`
- `sqlc` - SQL to type-safe go code generation tool: `https://docs.sqlc.dev/en/stable/overview/install.html`

**Recommended:**

- **VS Code/Cursor** with Go, ESLint, Prettier, Tailwind CSS IntelliSense extensions

## 🛠️ Development Setup

### 1. Fork and Clone

```bash
# Clone the repository
git clone git@github.com:adcentra/adcentra.git
cd adcentra

# Add origin remote
git remote add origin git@github.com:adcentra/adcentra.git
```

### 2. Environment Configuration

Create a `.envrc` file in the server folder for server related configs:
Create a `.env.local` file in the web folder for nextjs frontend related configs:

```bash
# Database configuration
export SEMAPHORE_DSN="postgres://adcentra:password@localhost/adcentra?sslmode=disable"

# Email configuration (for development, you can use a test service like MailHog)
export SMTP_USERNAME="your-smtp-username"
export SMTP_PASSWORD="your-smtp-password"

# Optional: Production server IP (only needed for deployment)
export PROD_IP="your-production-server-ip"
```

### 3. Database Setup

**Option A: Using Docker (Recommended for development)**

```bash
# Start PostgreSQL and Redis containers
docker-compose up -d

# Run migrations
make db/migrations/up
```

**Option B: Local Installation**

```bash
# Create database
createdb adcentra

# Install citext extension
psql -d adcentra -c "CREATE EXTENSION IF NOT EXISTS citext;"

# Run migrations
make db/migrations/up
```

### 4. Backend Setup

```bash
cd server

# Download dependencies
go mod download

cd ..

# Verify setup
make audit

# Start the server
make run/api
```

The API server will be available at `http://localhost:4000`

### 5. Web frontend setup

```bash
cd web

# Install dependencies
npm i

# Run the app
npm run dev
```

## 📁 Project Structure

Understanding the project structure will help you navigate and contribute effectively:

### Backend Structure (`server/`)

```
server/
├── cmd/
│   ├── api/                # Main API application
│   │   ├── main.go         # Application entry point
│   │   ├── routes.go       # HTTP route definitions
│   │   ├── middleware.go   # HTTP middleware
│   │   └── [feature].go    # Feature-specific handlers
│   └── tools/              # Administrative tools
│       ├── makeadmin/      # Admin user creation
├── internal/               # Private application code
│   ├── data/               # Database models and queries
│   ├── cache/              # Redis caching layer
│   ├── mailer/             # Email functionality
│   ├── validator/          # Input validation
│   └── vcs/                # Version control info
├── migrations/             # Database migration files
├── public/                 # Static assets and HTML templates
├── remote/                 # Remote deployment configuration
│   ├── production/         # Production server configuration
│   │   ├── api.service     # Systemd service file for API
│   │   └── Caddyfile       # Caddy web server configuration
│   └── setup/              # Server setup scripts
│       └── 01.sh           # Initial server setup script
└── vendor/                 # Vendored Go dependencies
```

### Frontend Structure (`web/`)

```
web/
├── app/                      # Next.js App Router directory
│   ├── (marketing)/          # Route group for marketing pages
│   │   ├── layout.tsx        # Marketing layout component
│   │   └── page.tsx          # Marketing home page
│   ├── components/           # Shared React components
│   │   └── ui/               # UI component library
│   │       └── button.tsx    # Button component
│   ├── lib/                  # Utility libraries
│   │   └── utils.ts          # Utility functions
│   ├── globals.css           # Global CSS styles
│   ├── layout.tsx            # Root layout component
│   └── favicon.ico           # Site favicon
├── public/                   # Static assets
│   └── marketing/            # Marketing-related images
├── components.json           # shadcn/ui configuration
├── eslint.config.mjs         # ESLint configuration
├── next.config.ts            # Next.js configuration
├── package.json              # Node.js dependencies
├── postcss.config.mjs        # PostCSS configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Frontend documentation
```

## 📏 Coding Standards

### Go Code Style

We follow standard Go conventions with some additional guidelines:

**Formatting:**

```bash
# Format code
go fmt ./...

# Vet code
go vet ./...

# Static analysis
staticcheck ./...
```

**Key Principles:**

- The go server architecture is inspired from the book Let's go further by Alex Edwards.
- Use meaningful variable and function names
- Keep functions small and focused
- Handle errors explicitly
- Use context.Context for cancellation and timeouts

**Example:**

```go
// Good
func (m UserModel) GetByEmail(email string) (*User, error) {
    query := `SELECT id, email, username FROM users WHERE email = $1`

    ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
    defer cancel()

    var user User
    err := m.DB.QueryRow(ctx, query, email).Scan(&user.ID, &user.Email, &user.Username)
    if err != nil {
        switch {
        case errors.Is(err, pgx.ErrNoRows):
            return nil, ErrRecordNotFound
        default:
            return nil, err
        }
    }

    return &user, nil
}
```

### Next.js/React/TypeScript Code Style

We follow standard React and TypeScript conventions with Next.js best practices:

**Formatting:**

```bash
# Lint code
npm run lint
```

**Architecture Principles:**

- Use Next.js App Router for routing and layouts
- Prefer Server Components when possible, use Client Components when needed
- Follow React best practices for component composition
- Use TypeScript for type safety
- Organize components in a logical hierarchy
- Use meaningful names for components and functions

## 🔧 Making Changes

### SQLC Code gen

After adding/modifying sql queries for models, make sure to run the following command to generate type-safe go code for the query functions:

`sqlc generate`

### Branching Strategy

We use a feature branch workflow:

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description

# Make your changes and commit
git add .
git commit -m "feat[web]: add user authentication"

# Push to your fork
git push origin feature/your-feature-name
```

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope(web/server)]: <short description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes or adding bruno API endpoints
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```
feat[web]: add Google Sign-In integration
fix[server]: resolve duplicate inventory entries
docs[server]: update installation instructions
refactor: web and server refactor
```

### Database Migrations

When making database changes:

```bash
# Create a new migration
make db/migrations/new name=add_user_preferences

# Edit the generated migration file in server/migrations/
# Always include both up and down migrations

# Test the migration
make db/migrations/up
make db/migrations/down
```

### Adding New Features

When adding new features, follow these steps:

1. **Plan the feature**: Create an issue describing the feature
2. **Design the API**: Plan database changes and API endpoints
3. **Backend implementation**: Start with data models, then business logic, then HTTP handlers
4. **Frontend implementation**: Follow recommended nextjs architecture
5. **Testing**: Write comprehensive tests
6. **Documentation**: Update relevant documentation

## 📥 Submitting Changes

### Pull Request Process

1. **Ensure your branch is up to date:**

   ```bash
   git pull origin main
   ```

2. **Run all tests and linting:**

   ```bash
   # Backend
   make audit

   # Frontend
   cd web && npm run lint
   ```

3. **Create a pull request:**
   - Use a descriptive title following conventional commit format
   - Fill out the pull request template completely
   - Link any related issues
   - Add screenshots for UI changes
   - Ensure CI passes

### Pull Request Template

```markdown
## Description

Brief description of the changes and the problem they solve.

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing

Describe the tests you ran and provide instructions to reproduce.

## Screenshots (if applicable)

Add screenshots to help explain your changes.

## Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

## 👀 Review Process

### What to Expect

1. **Automated Checks**: CI will run tests and linting
2. **Code Review**: Maintainers will review your code
3. **Feedback**: You may receive suggestions for improvements
4. **Approval**: Once approved, your PR will be merged

### Review Criteria

- **Functionality**: Does the code work as intended?
- **Code Quality**: Is the code readable and well-structured?
- **Testing**: Are there adequate tests?
- **Documentation**: Is documentation updated if needed?
- **Performance**: Does the change impact performance?
- **Security**: Are there any security concerns?

## 🎯 Types of Contributions

### 🐛 Bug Reports

When reporting bugs, please include:

- **Environment**: OS, Go version, Node.js version
- **Steps to reproduce**: Clear steps to reproduce the issue
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable
- **Logs**: Relevant log output

### ✨ Feature Requests

For feature requests, please include:

- **Problem**: What problem does this solve?
- **Solution**: Describe your proposed solution
- **Alternatives**: What alternatives have you considered?
- **Use cases**: Who would benefit from this feature?

### 📚 Documentation

Documentation improvements are always welcome:

- Fix typos or unclear explanations
- Add examples or tutorials
- Improve API documentation
- Update setup instructions

### 🧪 Testing

Help improve test coverage:

- Add unit tests for untested code
- Write integration tests
- Improve test reliability
- Add performance tests

## 🌟 Recognition

Contributors will be recognized in:

- The project's README
- Release notes
- Annual contributor highlights

## 💬 Community

### Getting Help

- **GitHub Discussions**: For questions and general discussion
- **GitHub Issues**: For bug reports and feature requests
- **Code Reviews**: Learn from feedback on pull requests

### Communication Guidelines

- Be respectful and inclusive
- Provide constructive feedback
- Help newcomers get started
- Share knowledge and resources

## 🏷️ Good First Issues

Look for issues labeled `good first issue` or `help wanted`. These are specifically chosen to be newcomer-friendly.

## 📚 Additional Resources

- [Go Documentation](https://golang.org/doc/)
- [Go Architecture](https://lets-go-further.alexedwards.net/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

Thank you for contributing to Semaphore! Your efforts help make this project better for everyone. 🎉
