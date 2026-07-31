---
name: install-github-copilot-helper
description: Install GitHub Copilot Helper into the current repository with OS-specific steps. Use when asked to set up Copilot instructions, prompts, rules, agents, skills, or hooks from github-copilot-helper for this repo.
---

# install-github-copilot-helper

Use this skill when the user asks to install `github-copilot-helper` into the current project.

## Inputs

- Helper repo path: `/Users/kangs/code/github/github-copilot-helper`
- Target repo path: current working repository (`$PWD`)
- Optional modules list: `instructions,prompts,rules,agents,skills,hooks,templates`
- Optional flags: dry run (`-d` / `-DryRun`), force overwrite (`-f` / `-Force`)

## Procedure

1. Validate helper path exists.
2. Detect operating system.
3. Run a dry run first.
4. Run the actual project install.
5. Verify expected files in target repo.
6. Report what was installed and what changed.

## Decision Points

1. If `/Users/kangs/code/github/github-copilot-helper` does not exist:
   - Stop and ask the user for the correct helper path.
2. If OS is macOS or Linux:
   - Use `install.sh` commands.
3. If OS is Windows:
   - Use `install.ps1` commands.
4. If target already has customizations and user wants to preserve them:
   - Use dry run and install specific modules only.
5. If user explicitly wants overwrite:
   - Add force flags.

## Commands

### macOS / Linux

Dry run:

```bash
cd /Users/kangs/code/github/github-copilot-helper
./install.sh -d "$PWD"
```

Install:

```bash
cd /Users/kangs/code/github/github-copilot-helper
./install.sh "$PWD"
```

Install selected modules only:

```bash
cd /Users/kangs/code/github/github-copilot-helper
./install.sh -m "instructions,prompts,rules,agents,skills,hooks,templates" "$PWD"
```

Force overwrite:

```bash
cd /Users/kangs/code/github/github-copilot-helper
./install.sh -f "$PWD"
```

### Windows (PowerShell)

Dry run:

```powershell
Set-Location "C:\path\to\github-copilot-helper"
.\install.ps1 -DryRun -TargetPath "$PWD"
```

Install:

```powershell
Set-Location "C:\path\to\github-copilot-helper"
.\install.ps1 -TargetPath "$PWD"
```

Install selected modules only:

```powershell
Set-Location "C:\path\to\github-copilot-helper"
.\install.ps1 -Modules "instructions,prompts,rules,agents,skills,hooks,templates" -TargetPath "$PWD"
```

Force overwrite:

```powershell
Set-Location "C:\path\to\github-copilot-helper"
.\install.ps1 -Force -TargetPath "$PWD"
```

## Verification Checklist

- Target repo contains `.github/copilot-instructions.md`
- Target repo contains `.github/copilot/`
- If hooks were installed, verify `.vscode/settings.json` hook wiring exists
- Confirm no unexpected overwrite happened (unless force was requested)

## Completion Criteria

- Installation command completed without errors
- Expected files are present in the target repo
- User receives a concise summary of installed modules and next steps
