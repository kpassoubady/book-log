# General Coding Standards

## Naming

- **Variables/Functions:** camelCase (JavaScript/TypeScript), snake_case (Python/Ruby)
- **Classes:** PascalCase
- **Constants:** UPPER_SNAKE_CASE
- **Files:** Follow project convention (kebab-case or snake_case)

## Functions

- Single responsibility — do one thing well
- Keep under 20 lines when possible
- Max 3-4 parameters — use objects for more
- Pure functions preferred when possible
- Meaningful names that describe behavior

## Error Handling

- Handle errors at appropriate boundaries
- Provide context in error messages
- Never swallow exceptions silently
- Use custom error types for domain errors
- Log errors with sufficient context

## Comments

- Explain "why", not "what"
- Keep comments updated with code
- Use TODO/FIXME with context
- Delete commented-out code

## Git Commits

- Present tense, imperative mood
- Under 50 characters for subject
- Reference issues when applicable
- One logical change per commit
- Do NOT add "Co-Authored-By" lines
