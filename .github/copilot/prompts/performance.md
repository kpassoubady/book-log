# Performance Optimization Prompt

Analyze this code for performance bottlenecks and suggest optimizations:

## Focus Areas
- Algorithm efficiency (time/space complexity)
- Memory usage and leaks
- I/O operations and blocking calls
- Database queries and N+1 problems
- Frontend rendering and bundle size

## Analysis Steps
1. Identify performance-critical sections
2. Measure current performance (if possible)
3. Find bottlenecks and root causes
4. Suggest specific optimizations
5. Estimate improvement potential

## Optimization Types
- **Algorithmic**: Better data structures/algorithms
- **Caching**: Memoization, result caching
- **Lazy Loading**: Defer expensive operations
- **Parallelization**: Concurrent processing
- **System-level**: Database tuning, connection pooling

## Output Format

For each optimization:

**Issue:** [What's slow/inefficient]

**Location:** [File/function/line]

**Current Complexity:** [O(n), memory usage, etc.]

**Suggested Fix:** [Specific code change]

**Expected Impact:** [Quantified improvement]

**Trade-offs:** [Any downsides]

## Guidelines
- Prioritize high-impact, low-effort changes
- Provide measurable improvements
- Consider code maintainability
- Test optimizations thoroughly
- Profile in realistic conditions