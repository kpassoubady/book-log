---
name: repo-init
description: Scaffolds a new GitHub repository using a template, or initializes an existing folder with the template.
---

# repo-init

Use this skill whenever the user asks to initialize a new project, create a new repo, or run `gh init`.

## Instructions

1. **Identify the Project Name:** Based on the current directory or the user's request.
2. **Handle Existing Work:**
   - If the user is currently inside a directory (e.g., `tenant-app`) with existing files, move all existing files/folders to a temporary backup (e.g., `/tmp/backup-tenant-app`).
   - Move up one directory level (`cd ..`).
3. **Create from Template:**
   - Run the command to create the repository from the template:
     `gh repo create <project_name> --template kpassoubady/project-template --private --clone`
4. **Restore Existing Work:**
   - `cd <project_name>`
   - If there was a backup in step 2, move all files from the backup back into the current directory.
5. **Customize Standard Files:**
   - Update `README.md` with the specific project name and a brief description.
   - Update `CLAUDE.md` if the project requires any specific context.
6. **Commit and Push:**
   - `git add .`
   - `git commit -m "Initialize project with standard template and existing work"`
   - `git push`

## Important Guidelines
- **Use Unsandboxed Commands:** If executing `gh` or `git` commands, use the unsandboxed environment or `run_command` as appropriate to avoid TLS/sandbox issues.
- **Template Repository:** The template repository is `kpassoubady/project-template`.
- **Do not overwrite** existing files from the backup with template files unless they are generic boilerplate.
