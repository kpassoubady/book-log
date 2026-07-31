#!/usr/bin/env bash
# Hook: PreToolUse — run tests before Copilot pushes code
# Configure via VS Code Copilot agent hooks.
# Exit non-zero to block the push.

set -euo pipefail

# Auto-detect test runner and execute
if [[ -f "package.json" ]]; then
  if command -v npm &>/dev/null; then
    npm test 2>&1 || { echo "Tests failed. Push blocked."; exit 1; }
  fi
elif [[ -f "pyproject.toml" ]] || [[ -f "setup.py" ]]; then
  if command -v pytest &>/dev/null; then
    pytest --quiet 2>&1 || { echo "Tests failed. Push blocked."; exit 1; }
  fi
elif [[ -f "go.mod" ]]; then
  go test ./... 2>&1 || { echo "Tests failed. Push blocked."; exit 1; }
elif [[ -f "Cargo.toml" ]]; then
  cargo test --quiet 2>&1 || { echo "Tests failed. Push blocked."; exit 1; }
elif [[ -f "pom.xml" ]]; then
  mvn test -q 2>&1 || { echo "Tests failed. Push blocked."; exit 1; }
fi

exit 0
