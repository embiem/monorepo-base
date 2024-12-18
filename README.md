# Full-Stack Monorepo

A modern full-stack monorepo with Next.js, Node.js, Python, and shared utilities.

## Project Structure

```
.
├── apps/
│   ├── api/                 # Node.js Express API
│   ├── python-api/         # Python FastAPI service
│   ├── queue-worker/       # Node.js background worker
│   ├── webapp1/            # Next.js application
│   └── webapp2/            # Next.js application
├── packages/
│   ├── eslint-config/     # Shared ESLint configurations
│   ├── shared/            # Shared TypeScript utilities
│   ├── typescript-config/ # Shared TypeScript configurations
│   └── ui/                # Shared React components
└── docker/                # Docker configurations
```

## Technologies

- **Frontend**: Next.js 15, React 18, TypeScript, TailwindCSS
- **Backend**: Node.js/Express, Python/FastAPI
- **Queue Processing**: BullMQ, Redis
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT with Redis session storage
- **Build System**: Turborepo
- **Container**: Docker
- **CI/CD**: GitHub Actions

## Prerequisites

- Node.js 18+
- Python 3.11+
- Docker and Docker Compose
- PostgreSQL 15+
- Redis 7+

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd full-stack-monorepo
   ```

2. Install dependencies:

   ```bash
   npm install
   cd apps/python-api && pip install -r requirements.txt
   ```

3. Set up environment variables:

   ```bash
   # Copy all example env files
   cp .env.example .env
   cp apps/api/.env.example apps/api/.env
   cp apps/python-api/.env.example apps/python-api/.env
   cp apps/queue-worker/.env.example apps/queue-worker/.env
   cp apps/webapp1/.env.example apps/webapp1/.env
   cp apps/webapp2/.env.example apps/webapp2/.env
   ```

4. Start development resources:

   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

5. Run database migrations:

   ```bash
   cd packages/shared
   npm run migrate
   ```

6. Start development servers:

   ```bash
   npm run dev
   ```

## Development

### Available Scripts

Root level scripts:

- `npm run dev` - Start all services in development mode
- `npm run build` - Build all packages and applications
- `npm run build:shared` - Build only shared packages
- `npm run clean` - Clean build artifacts
- `npm run lint` - Run linting
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run typecheck` - Run type checking

Individual package/app scripts can be run using the workspace flag:

```bash
npm run dev --workspace=@monorepo/webapp1
npm run build --workspace=@monorepo/api
npm run test --workspace=@monorepo/shared
```

### Coding Best Practices

#### File Organization

- Create small, focused files with a single responsibility
- Break down large files into multiple smaller modules
- Group related functionality into dedicated directories
- Keep file names descriptive and consistent

#### Code Structure

- Extract reusable logic into utility functions
- Use shared types and interfaces from `@monorepo/shared`
- Follow the established project patterns for each package
- Keep components and functions pure and predictable

#### Type Safety

- Leverage TypeScript's type system effectively
- Define clear interfaces for data structures
- Use shared type definitions from `@monorepo/shared`
- Avoid using `any` type

#### Testing

- Write unit tests for utility functions
- Test components in isolation
- Use meaningful test descriptions
- Follow the AAA (Arrange, Act, Assert) pattern

### Adding a new dependency

When you install a dependency, you should install it directly in the package that uses it. The package's package.json will have every dependency that the package needs. This is true for both external and internal dependencies.

Example:

```bash
npm install jest --workspace=web --workspace=@monorepo/ui --save-dev
```

### Database Management

The project uses Drizzle ORM with PostgreSQL. Database schema and migrations are centralized in the database package.

We use a codebase first approach. We use our TypeScript Drizzle schema as a source of truth and Drizzle let’s us generate SQL migration files based on our schema changes with `drizzle-kit generate` and then apply them to the database with `drizzle-kit migrate` commands:

```bash
# Generate new migrations
cd packages/database
npm run generate

# Run migrations
npm run migrate
```

Schema is defined in `packages/shared/src/db/schema.ts` and can be imported by any application:

```typescript
import { createDbConnection, users } from "@monorepo/database";

const db = createDbConnection();
// Use db.select(), db.insert(), etc.
```

Migrations are applied automatically via the Dockerfile during CD & by running the `npm run migrate` command locally.

### Authentication

The project uses JWT-based authentication with Redis for session management:

- Access tokens (15 min expiry)
- Refresh tokens (7 days expiry)
- Secure HTTP-only cookies
- Redis-backed session storage

### Queue System

Background job processing is handled by BullMQ with Redis:

- Shared queue configuration between API and worker
- Job retry mechanisms
- Job status tracking
- Scalable worker processes

### Shared UI Components

The project includes a shared UI package with React components:

- Pre-built components with TailwindCSS
- TypeScript support
- Fully tree-shakeable
- Common hooks and utilities

Usage:

```typescript
import { Button, Input } from "@monorepo/ui/components";
```

### Ports

- Webapp1: <http://localhost:3000>
- Webapp2: <http://localhost:3001>
- Node.js API: <http://localhost:4000>
- Python API: <http://localhost:5000>
- Redis: localhost:6379
- PostgreSQL: localhost:5432

## Docker

### Development

```bash
# Start development resources
docker-compose -f docker-compose.dev.yml up -d

# Stop development resources
docker-compose -f docker-compose.dev.yml down
```

### Production

```bash
# Build and start all services
docker-compose up -d --build

# Stop all services
docker-compose down
```

## CI/CD

The project uses GitHub Actions for CI/CD with optimized build and deployment pipelines:

### Continuous Integration (CI)

Runs on pull requests and pushes to main:

- Builds and tests affected packages
- Runs linting and type checking
- Caches dependencies and build artifacts

### Continuous Deployment (CD)

Our CD pipeline is optimized using Turborepo's powerful features:

#### Selective Building & Testing

- Uses Turborepo's `--filter` flag to only build and test apps affected by changes
- Compares against the main branch to determine what has changed
- Skips building unmodified applications
- Example:

  ```bash
  turbo run build test --filter=[origin/main]
  ```

#### Remote Caching

- Enables build artifact sharing across CI/CD runs
- Configured using `TURBO_TOKEN` and `TURBO_TEAM` environment variables
- Significantly reduces build times by reusing previous builds
- Setup:

  ```bash
  # Login to enable remote caching
  npx turbo login

  # Link your repository
  npx turbo link
  ```

#### Parallel Execution

- Runs builds and tests in parallel where possible
- Respects dependencies between packages using Turborepo's dependency graph
- Automatically determines the optimal build order

#### Selective Deployment

- Only deploys services that have actually changed
- Uses GitHub Actions' changed files detection
- Prevents unnecessary deployments of unchanged services
- Example workflow:

  ```yaml
  - name: Deploy webapp1
    if: contains(steps.changed-files.outputs.modified_files, 'apps/webapp1/')
    run: deploy-webapp1
  ```

#### Pipeline Configuration

The pipeline is configured in `turbo.json`:

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

This setup ensures:

- Clear definition of task dependencies
- Proper output caching configuration
- Consistent environment variables handling

To use this setup effectively:

1. Set up remote caching:

   ```bash
   npx turbo login
   ```

2. Add these secrets to your GitHub repository:

   - `TURBO_TOKEN`: From Vercel/Turborepo
   - `TURBO_TEAM`: Your team slug from Vercel

3. The pipeline will automatically optimize builds and deployments based on changes.

## Project Configuration

### Turborepo

The monorepo uses Turborepo for build system orchestration:

- Intelligent caching
- Parallel execution
- Remote caching in CI
- Dependency graph optimization

### Environment Variables

Each application has its own `.env` file for configuration. Example files are provided:

- `.env.example` - Root level configuration
- `apps/*/env.example` - Application-specific configuration

## Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request

## License

[Add your license here]

