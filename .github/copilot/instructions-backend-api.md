# Backend API Guidelines

## API Design

- Use RESTful conventions (GET, POST, PUT, DELETE)
- Use plural nouns for resource endpoints (`/users`, `/orders`)
- Version APIs when breaking changes are needed
- Return appropriate HTTP status codes
- Include consistent error response format

## Request Handling

- Validate all input data
- Use proper request/response DTOs
- Sanitize user input to prevent injection attacks
- Implement rate limiting for public endpoints
- Log requests appropriately (without sensitive data)

## Database

- Use parameterized queries — never concatenate SQL
- Handle transactions properly
- Index frequently queried columns
- Avoid N+1 query problems
- Close connections properly

## Authentication & Authorization

- Use established auth patterns (JWT, OAuth, etc.)
- Validate tokens on every request
- Implement proper role-based access control
- Never expose sensitive data in responses
- Use secure cookie settings

## Error Handling

- Return consistent error formats
- Log errors with context for debugging
- Don't expose internal details in error responses
- Handle edge cases gracefully
- Implement proper retry logic for external services
