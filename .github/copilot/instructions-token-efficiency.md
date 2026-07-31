# Token & Model Efficiency — Expanded Guide

The short version lives in [`rules/token-efficiency.md`](../rules/token-efficiency.md). This file expands on the reasoning and gives worked examples — combine it into your project's instructions if you want the fuller version, not just the quick rules.

## Why This Matters

Every message to Copilot Chat re-sends the conversation and any attached context. Premium/frontier models also draw down a monthly premium request quota rather than being unlimited — picking the right tier for the task keeps both your context window and your quota from being spent on work that didn't need it.

## Model Tiers, in Practice

Copilot's model picker groups models roughly into:

- **Lightweight/fast** — near-instant, cheapest tier. Good for anything mechanical: finding a symbol, summarizing a file, checking git status, listing what changed.
- **Balanced/mid-tier** — the default for most day-to-day coding: writing a function, fixing a bug with a clear repro, generating tests for existing code.
- **Frontier/premium** — reserve for work where getting it wrong is expensive: architecture and technology choices, security review, a bug that survived two lower-tier attempts, or anything touching data migrations.

Don't hardcode a specific model name into your workflow — the picker's lineup changes on a regular cadence. Re-evaluate which tier a model belongs to by how the picker labels it (speed, "premium" vs. "included"), not by name.

### Worked Examples

| Task | Tier | Why |
|------|------|-----|
| "Where is `UserRepository` defined?" | Lightweight | Pure search, no generation |
| "Summarize what changed in this PR" | Lightweight | Read-only synthesis |
| "Add a `deleted_at` column and a migration" | Balanced | Well-scoped, familiar pattern |
| "Why does this race condition only happen under load?" | Frontier | Deep reasoning, high cost of a wrong answer |
| "Design the auth strategy for a new multi-tenant feature" | Frontier | Architectural, hard to reverse later |

## Context Efficiency in Detail

- `@workspace` triggers a broad scan of the repository — reach for `#file` or `#selection` when you already know where the answer lives
- Re-attaching a file Copilot already has in context doesn't add information, only tokens
- A prompt bundling three unrelated changes forces Copilot to hold all three in working memory at once; splitting them into separate turns is usually faster overall, even though it's more messages
- Prefer diffs and targeted edits over "regenerate this whole file" — regeneration re-derives content Copilot could have just edited

## Response Efficiency in Detail

- If Copilot just wrote or edited a file, you can read the result directly instead of asking it to "show me what you changed"
- Match the depth of the answer to the depth of the question — a one-line question deserves a one-line answer, not a structured report
- Save long explanations for cases where the reasoning itself is the valuable part (a tricky bug's root cause, a non-obvious architectural tradeoff)

## Custom Agents & Prompts

- One persona or one task per file — a `code-reviewer` agent that also tries to refactor and write docs is three agents wearing a trenchcoat
- Scope the `tools:` list in agent frontmatter to only what that persona needs; an agent that only reads shouldn't be granted write-capable tools
- Prefer a short checklist over long prose — reviewers and writers alike get more consistent results from a scannable list of criteria than a paragraph of rationale

## Continuous Improvement

After finishing a task, it's worth asking:

- Could this have run on a cheaper model tier?
- Did the prompt attach more context than the task needed?
- Is there a repeated pattern here worth turning into a saved prompt or custom agent, so the next occurrence takes one message instead of several?

None of this is a hard gate — it's a habit that compounds. Small savings per task add up across a project's lifetime.
