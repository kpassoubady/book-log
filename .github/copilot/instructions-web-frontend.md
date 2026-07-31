# Web Frontend Guidelines

## React/Component Patterns

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper TypeScript types for props
- Avoid prop drilling — use context or state management when needed

## State Management

- Keep state as local as possible
- Lift state only when necessary
- Use appropriate tools (useState, useReducer, context, etc.)
- Avoid unnecessary re-renders

## Styling

- Follow existing CSS/styling patterns in the project
- Use semantic class names
- Prefer CSS modules or styled-components for scoping
- Ensure responsive design
- Follow accessibility guidelines (contrast, focus states)

## Accessibility

- Use semantic HTML elements
- Include proper ARIA labels where needed
- Ensure keyboard navigation works
- Maintain focus management
- Test with screen readers when possible

## Performance

- Lazy load components and routes when appropriate
- Optimize images and assets
- Avoid blocking the main thread
- Use memoization judiciously (useMemo, useCallback)
- Profile before optimizing
