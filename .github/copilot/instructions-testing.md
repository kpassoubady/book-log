# Testing Guidelines

## Test Structure

- Follow Arrange-Act-Assert (AAA) pattern
- One logical assertion per test (multiple asserts OK if related)
- Use descriptive test names that explain the scenario
- Keep tests independent — no shared mutable state
- Clean up after tests (database, files, etc.)

## Unit Tests

- Test one unit of behavior at a time
- Mock external dependencies
- Test both happy path and error cases
- Cover edge cases (null, empty, boundary values)
- Keep tests fast — mock slow operations

## Integration Tests

- Test component interactions
- Use real dependencies when practical
- Test API contracts
- Verify database operations
- Test authentication and authorization flows

## Test Quality

- Tests should fail when behavior breaks
- Avoid testing implementation details
- Don't over-mock — test real behavior when possible
- Maintain tests alongside code changes
- Delete obsolete tests

## Coverage

- Aim for meaningful coverage, not 100%
- Prioritize critical paths and complex logic
- Cover error handling paths
- Test boundary conditions
- Don't write tests just for coverage numbers
