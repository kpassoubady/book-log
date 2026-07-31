# Java Guidelines

## Naming

- Classes: PascalCase
- Methods/Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Packages: lowercase, no underscores

## Classes

- One public class per file
- Keep classes focused (Single Responsibility)
- Prefer composition over inheritance
- Use interfaces for contracts
- Make fields private, provide accessors if needed

## Methods

- Keep methods small and focused
- Use meaningful parameter names
- Return early for guard clauses
- Avoid deep nesting

## Null Handling

- Use `Optional<T>` for values that may be absent
- Check nulls at boundaries
- Use `@NonNull`/`@Nullable` annotations
- Avoid returning null from methods

## Patterns

```java
// Prefer
Optional<User> findUser(String id);
private final List<Item> items = new ArrayList<>();

// Avoid
User findUser(String id); // returns null if not found
private List<Item> items;
```

## Exceptions

- Use specific exception types
- Include context in exception messages
- Clean up resources with try-with-resources
- Don't catch generic Exception unless rethrowing
