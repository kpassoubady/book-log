# Code Review Prompt

Review this code for:

## Correctness
- Logic errors, off-by-one bugs
- Null/undefined handling
- Race conditions or async issues
- Edge cases not handled

## Security
- Input validation gaps
- Injection vulnerabilities
- Authentication/authorization issues
- Secrets or sensitive data exposure

## Performance
- N+1 queries
- Unnecessary allocations
- Missing indexes (if DB-related)
- Blocking operations

## Maintainability
- Clear naming
- Code duplication
- Excessive complexity
- Dead code

## Output Format

**Summary:** One sentence — what the code does and if it's ready.

**Issues (if any):**
- File:line — what's wrong
- Severity — critical / warning / nit
- Fix — concrete suggestion

**What's Good:** Brief note on well-done aspects.
