# Async/Concurrency Guidelines

## General Principles

- Prefer async/await over raw promises/callbacks for readability
- Handle errors properly in async code — never swallow exceptions
- Avoid blocking the main thread with synchronous operations
- Use appropriate concurrency patterns for the language/platform
- Test async code thoroughly, including race conditions

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
- Profile async code for bottlenecks