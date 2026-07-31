# [Project Name] Guidelines

## Overview
Brief description of the project and its purpose.

## Tech Stack
- Language: [e.g., TypeScript]
- Framework: [e.g., React, Express]
- Database: [e.g., PostgreSQL]
- Testing: [e.g., Jest, Vitest]

## Code Style
- [Add your naming conventions]
- [Add your formatting preferences]
- [Add your patterns]

## Architecture
- [Describe your architecture patterns]
- [Key directories and their purposes]
- [Important modules/services]

## Security
- [Project-specific security requirements]
- [Authentication/authorization patterns]

## Testing
- [Testing conventions]
- [Coverage requirements]
- [Test organization]

## Git Workflow
- [Branch naming conventions]
- [Commit message format]
- [PR requirements]

---

## Examples

### Example 1: React TypeScript Web App

```
# MyReactApp Guidelines

## Overview
A modern React application for task management with real-time collaboration.

## Tech Stack
- Language: TypeScript
- Framework: React 18 with Vite
- Database: Supabase (PostgreSQL)
- Testing: Vitest + React Testing Library

## Code Style
- Use functional components with hooks
- Prefer custom hooks for shared logic
- Use TypeScript strict mode
- Follow Airbnb style guide

## Architecture
- Feature-based directory structure
- Shared components in /components
- Custom hooks in /hooks
- API calls in /services

## Security
- Use Supabase RLS policies
- Validate all user inputs
- Sanitize data before rendering

## Testing
- Unit test custom hooks and utilities
- Integration test components
- E2E tests for critical user flows
- 80% coverage minimum

## Git Workflow
- feature/ branches for new features
- fix/ branches for bug fixes
- Conventional commits
- Require 2 approvals for main branch
```

### Example 2: Python FastAPI Backend

```
# FastAPI Backend Guidelines

## Overview
REST API for a content management system with user authentication.

## Tech Stack
- Language: Python 3.11
- Framework: FastAPI with SQLAlchemy
- Database: PostgreSQL with Alembic migrations
- Testing: pytest with coverage

## Code Style
- Follow PEP 8
- Use type hints everywhere
- Black for formatting
- isort for import sorting

## Architecture
- Domain-driven design
- Repository pattern for data access
- Dependency injection with FastAPI
- Pydantic models for validation

## Security
- JWT authentication
- Password hashing with bcrypt
- CORS properly configured
- Input validation with Pydantic

## Testing
- Unit tests for business logic
- Integration tests for API endpoints
- Test database with pytest fixtures
- 85% coverage target

## Git Workflow
- main branch for production
- develop for integration
- feature/ branches
- Squash merges to main
```

### Example 3: Java Spring Boot Microservice

```
# Spring Boot Microservice Guidelines

## Overview
User service microservice handling authentication and profile management.

## Tech Stack
- Language: Java 17
- Framework: Spring Boot 3
- Database: PostgreSQL with Flyway
- Testing: JUnit 5 + Testcontainers

## Code Style
- Google Java Style Guide
- Lombok for boilerplate reduction
- Package by feature
- Use records for immutable data

## Architecture
- Hexagonal architecture
- REST controllers
- Service layer for business logic
- Repository layer with Spring Data JPA

## Security
- Spring Security with OAuth2
- Use Optional for nullable returns
- Validate inputs with Bean Validation
- Log security events

## Testing
- Unit tests with Mockito
- Integration tests with Testcontainers
- Contract tests with Spring Cloud Contract
- 90% coverage requirement

## Git Workflow
- GitFlow branching model
- Code reviews required
- CI/CD pipeline for all branches
- Semantic versioning for releases
```
