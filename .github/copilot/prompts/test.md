# Test Generation Prompt

Generate tests for this code:

## Requirements
- Follow project's existing test patterns
- Use the project's test framework
- Cover happy path and error cases
- Include edge cases (null, empty, boundaries)
- Keep tests focused and independent

## Test Structure
- Use descriptive test names
- Follow Arrange-Act-Assert pattern
- Mock external dependencies appropriately
- Clean up any test data

## Coverage Priorities
1. Public API / exported functions
2. Error handling paths
3. Boundary conditions
4. Complex logic branches

## Output
- Complete, runnable test code
- Brief comment explaining each test's purpose
- Any setup/teardown needed
