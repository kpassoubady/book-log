# Python Guidelines

## Style

- Follow PEP 8
- Use snake_case for functions and variables
- Use PascalCase for classes
- Use UPPER_SNAKE_CASE for constants
- Max line length: 88-120 (follow project config)

## Type Hints

- Add type hints to function signatures
- Use `Optional[T]` for nullable values
- Use `Union` or `|` for multiple types
- Import from `typing` for complex types

## Functions

- Use docstrings for public functions
- Keep functions focused and small
- Use default arguments appropriately
- Prefer keyword arguments for clarity

## Patterns

```python
# Prefer
def process_items(items: list[Item]) -> Result:
    """Process items and return result."""
    ...

# Avoid
def process_items(items):
    ...
```

## Error Handling

- Use specific exception types
- Catch specific exceptions, not bare `except:`
- Use context managers (`with`) for resources
- Raise exceptions with context

## Imports

- Standard library first, then third-party, then local
- Use absolute imports
- Avoid wildcard imports (`from x import *`)
- One import per line (or grouped related imports)
