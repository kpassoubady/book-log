# Token & Model Efficiency

## Rule: Right-Size the Model for the Task

Copilot Chat's model picker spans multiple cost/speed tiers (lightweight and fast, mid-tier/balanced, frontier/premium). Premium and frontier models draw down your monthly premium request quota faster — match the tier to the task instead of defaulting to the top model.

Model names and tiers change often. Judge by what the picker shows for each model (speed, "premium"/"included" labeling), not by memorizing specific model names.

## Decision Tree

```
Is this a read, search, or status check (find a symbol, summarize a file, check a diff)?
  → YES: Use the fastest/lightest model available
  → NO: Continue...

Is it routine code generation or a small, well-scoped edit?
  → YES: Use a mid-tier/balanced model
  → NO: Continue...

Is it an architectural decision, security review, or a hard bug after failed attempts?
  → YES: Use a frontier/premium model
```

## Context Efficiency

- Attach only the files or symbols actually needed — avoid whole-`@workspace` scans when a targeted `#file`/`#selection` reference answers the question
- Don't re-attach a file already in context; refer back to it
- Ask a narrow, single-purpose question rather than one prompt covering several unrelated changes
- Prefer editing existing files over asking Copilot to regenerate whole files

## Response Efficiency

- Don't ask Copilot to restate a diff or file it already produced — read the change directly
- Request terse output for terse questions; save deep explanations for genuinely complex changes

## Custom Agent & Prompt Files

- Keep `agents/` and `prompts/` files focused — one persona or one task per file
- Trim verbose rationale and redundant examples; a short checklist beats a long essay
- Scope each custom agent's `tools:` list to what it actually needs

## After Every Task

Ask: could this have used a cheaper model, fewer attached files, or a shorter prompt? Fold the answer into how you work next time.

See [`instructions/token-efficiency.md`](../instructions/token-efficiency.md) for the expanded rationale, worked examples, and per-scenario guidance.
