---
name: security-audit
description: Systematically audit the current codebase or specific files for OWASP Top 10 vulnerabilities, leaked secrets, and insecure configurations.
agent: code-reviewer
argument-hint: "[all|path/to/directory|path/to/file]"
pass-full-context: true
---

# /security-audit

Performs a static security audit on the specified scope to identify enterprise-grade vulnerabilities before creating a Pull Request.

## Triggering the Skill

- `/security-audit` — Audits the entire `src/` or `app/` directory.
- `/security-audit path/to/auth` — Audits a specific feature module.
- `/security-audit user.controller.ts` — Audits a specific file.

## Audit Checklist (Enterprise Standards)

The agent will systematically analyze the codebase against the following vectors:

1. **Injection (SQL, NoSQL, OS Command)**: Are inputs properly sanitized and parameterized?
2. **Broken Authentication**: Are sessions, JWTs, and passwords handled securely?
3. **Sensitive Data Exposure**: Are PII, API keys, and secrets hardcoded or logged in plaintext?
4. **Broken Access Control**: Are authorization checks enforced at every boundary?
5. **Security Misconfigurations**: Are headers (CORS, CSP) and framework defaults properly locked down?
6. **Cross-Site Scripting (XSS)**: Are inputs properly encoded before rendering?

## Output Format

The agent will generate a report artifact (`security-audit-report.md`) detailing:
- **Severity**: [CRITICAL|HIGH|MEDIUM|LOW]
- **File & Line Number**
- **Vulnerability Description**
- **Remediation Code Snippet**

This skill does not modify code directly. You must review the report and use Copilot Edits or Inline Chat to apply the recommended fixes.
