# TypeScript Guidelines

## Types

- Use explicit types for function parameters and returns
- Avoid `any` — use `unknown` if type is truly unknown
- Prefer interfaces for object shapes
- Use type aliases for unions and complex types
- Enable strict mode

## Null Handling

- Use optional chaining (`?.`) for nullable access
- Use nullish coalescing (`??`) for defaults
- Avoid non-null assertions (`!`) — handle nulls properly
- Use `undefined` over `null` when possible

## Functions

- Prefer arrow functions for callbacks
- Use named functions for top-level declarations
- Type all parameters and return values
- Use generics for reusable utilities

## Patterns

```typescript
// Prefer
const items: Item[] = [];
const config = { timeout: 5000 } as const;
function process(input: string): Result { ... }

// Avoid
let items: any = [];
const config: any = { timeout: 5000 };
function process(input) { ... }
```

## Imports

- Use named imports over default imports when possible
- Group imports: external, internal, relative
- Avoid circular dependencies
