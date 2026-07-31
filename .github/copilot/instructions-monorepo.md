# Monorepo Guidelines

## Overview

A monorepo contains multiple projects/packages in a single repository. These guidelines help maintain consistency and efficiency across the workspace.

## Workspace Structure

### Directory Organization
```
monorepo/
├── packages/          # Individual packages/libraries
│   ├── core/         # Shared core functionality
│   ├── ui/           # UI components
│   └── api/          # API clients
├── apps/             # Applications
│   ├── web/          # Web application
│   └── mobile/       # Mobile app
├── tools/            # Build tools, scripts
├── docs/             # Documentation
└── .github/          # GitHub configuration
```

### Package Naming
- Use consistent naming patterns: `@org/package-name`
- Keep names descriptive but concise
- Use kebab-case for directory names
- Avoid generic names like "utils" or "common"

## Dependency Management

### Internal Dependencies
- Use workspace references for internal packages
- Keep dependency versions in sync
- Document package relationships clearly
- Avoid circular dependencies

### External Dependencies
- Centralize common dependencies in root package.json
- Use consistent versioning across packages
- Audit dependencies regularly for security
- Minimize duplicate dependencies

## Build & CI/CD

### Build Orchestration
- Use tools like Turborepo, Nx, or Lerna for efficient builds
- Cache build artifacts appropriately
- Parallelize independent builds
- Define clear build dependencies

### CI Pipeline
- Build all packages on every PR
- Run tests for affected packages only
- Use matrix builds for multiple environments
- Cache dependencies and build outputs

## Code Sharing

### Shared Code
- Extract common utilities to dedicated packages
- Use TypeScript path mapping for clean imports
- Document shared interfaces clearly
- Version shared packages appropriately

### Cross-Package Changes
- Coordinate breaking changes across packages
- Update all consumers simultaneously
- Use automated tooling for refactoring
- Test integration points thoroughly

## Development Workflow

### Local Development
- Use workspace tools for running multiple packages
- Set up hot reloading for efficient development
- Document setup process clearly
- Provide development scripts

### Testing
- Unit test individual packages
- Integration test across package boundaries
- Use consistent testing frameworks
- Mock external dependencies appropriately

## Release Management

### Versioning
- Use independent versioning for packages
- Automate version bumps and changelogs
- Tag releases clearly
- Publish packages to registries

### Deployment
- Deploy applications independently
- Coordinate releases for interdependent packages
- Use feature flags for gradual rollouts
- Monitor cross-package integrations

## Best Practices

- Keep packages small and focused
- Document package APIs clearly
- Use consistent tooling across packages
- Regular cleanup of unused code/packages
- Monitor for performance regressions
- Encourage code reviews for cross-package changes

## JavaScript/TypeScript

### Patterns
- Use `async/await` for promise-based operations
- Wrap async operations in try/catch blocks
- Use `Promise.all()` for parallel independent operations
- Use `Promise.allSettled()` when some failures are acceptable
- Avoid mixing callbacks and promises

### Examples
```javascript
// Prefer
async function fetchUserData(userId) {
  try {
    const [user, posts] = await Promise.all([
      fetchUser(userId),
      fetchPosts(userId)
    ]);
    return { user, posts };
  } catch (error) {
    logger.error('Failed to fetch user data', { userId, error });
    throw error;
  }
}

// Avoid
function fetchUserData(userId) {
  return fetchUser(userId).then(user => {
    return fetchPosts(userId).then(posts => {
      return { user, posts };
    });
  });
}
```

### Anti-patterns
- Fire-and-forget async operations without error handling
- Deep promise chains (use async/await)
- Blocking operations in async functions

## Python

### Patterns
- Use `asyncio` for concurrent I/O operations
- Prefer `async/await` syntax over `@asyncio.coroutine`
- Use appropriate event loops
- Handle async context managers properly

### Examples
```python
import asyncio

async def process_users(user_ids: list[int]) -> list[dict]:
    """Process multiple users concurrently."""
    async def process_user(user_id: int) -> dict:
        async with aiohttp.ClientSession() as session:
            async with session.get(f'/api/users/{user_id}') as response:
                return await response.json()

    tasks = [process_user(uid) for uid in user_ids]
    return await asyncio.gather(*tasks, return_exceptions=True)
```

### Anti-patterns
- Using `time.sleep()` in async functions
- Blocking I/O operations without proper delegation
- Not handling asyncio task cancellation

## Java

### Patterns
- Use `CompletableFuture` for composable async operations
- Handle exceptions in async chains with `exceptionally()` or `handle()`
- Use appropriate thread pools for CPU-bound work
- Prefer reactive streams (RxJava, Reactor) for complex async flows

### Examples
```java
public CompletableFuture<UserData> fetchUserData(String userId) {
    return CompletableFuture.supplyAsync(() -> fetchUser(userId))
        .thenCombine(
            CompletableFuture.supplyAsync(() -> fetchPosts(userId)),
            (user, posts) -> new UserData(user, posts)
        )
        .exceptionally(throwable -> {
            logger.error("Failed to fetch user data", throwable);
            throw new CompletionException(throwable);
        });
}
```

### Anti-patterns
- Blocking operations in reactive streams
- Not handling `CompletionException` properly
- Overusing `CompletableFuture.runAsync()` for I/O operations

## Testing Async Code

- Use async test frameworks (Jest, pytest-asyncio, JUnit 5)
- Test both success and failure paths
- Mock async dependencies appropriately
- Test for race conditions when applicable
- Use timeouts to prevent hanging tests

## Performance Considerations

- Avoid unnecessary async operations for simple synchronous work
- Use connection pooling for database/network operations
- Monitor for async leaks (unhandled promises, uncancelled tasks)
- Profile async code for bottlenecks</content>
<parameter name="filePath">/Users/kangs/github/github-copilot-helper/instructions/async.md