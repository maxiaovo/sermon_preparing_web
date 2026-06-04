# CLAUDE.md — Project Governance

This file is loaded by Claude Code on every session start. All rules here are **mandatory** and must be followed without exception.

---

## 1. Version Control Rules

- Every code change must be committed and pushed to GitHub.
- Author must always be **maxiaovo**. Never use `claude`, `ttmanthatman`, or any other name.
- Remote: `git@github.com:maxiaovo/sermon_preparing_web.git` or `https://github.com/maxiaovo/sermon_preparing_web.git`.
- Branch naming: `feature/<name>` for new features, `fix/<name>` for bug fixes.
- Commit message format: `<type>: <description>` (e.g., `feat: add auth module`, `fix: resolve login redirect`).
- Never force-push to `main`.

---

## 2. Pre-Coding Checklist (MANDATORY ORDER)

Before writing ANY code, you MUST read these files in order:

| Step | File | Purpose |
|------|------|---------|
| 1 | `ERROR_LOG.md` | Check known errors to avoid repeating mistakes |
| 2 | `VARIABLES.md` | Check for naming conflicts |
| 3 | `ARCHITECTURE.md` | Confirm module is defined and approved |
| 4 | `FILE_STRUCTURE.md` | Check current file versions and status |
| 5 | `server-messages.md` | Load private config (API keys, DB info, etc.) |

**If any of these files is not read first, do NOT write code.**

---

## 3. Post-Coding Checklist

After writing code, you MUST:
- Re-read `VARIABLES.md` and update if new variables/functions were created.
- Re-read `ARCHITECTURE.md` and update module status if changed.
- Re-read `FILE_STRUCTURE.md` and update file versions/status.
- Verify consistency across all tables. Fix discrepancies immediately.

---

## 4. Error Handling

- Every error encountered during development MUST be logged in `ERROR_LOG.md`.
- Log format: `| # | Date | Type | Description | Root Cause | Fix | Status |`
- On every session start, read `ERROR_LOG.md` FIRST.

---

## 5. Security & Privacy

- **`server-messages.md`** stores ALL private information: API keys, DB credentials, deployment config, environment variables.
- `server-messages.md` is in `.gitignore` — **NEVER upload it to GitHub**.
- Never hardcode secrets in source code. Always read from environment variables or `server-messages.md`.
- Double-check every commit for accidental secret exposure.

---

## 6. Resource Constraints

- If any resource, API key, permission, or access is missing — **ask the user first**.
- Do NOT attempt to bypass restrictions, generate fake credentials, or use workarounds.
- Do not spend tokens on workarounds when asking the user is the correct path.

---

## 7. Reuse First

- Before building anything, check: existing skills, open-source libraries, prior project code, community solutions.
- Search npm, GitHub, and Claude Code skills for relevant tools.
- Do not reinvent the wheel unless no suitable solution exists.

---

## 8. Design Principle

- Be creative. Avoid cliche AI aesthetics (default fonts, generic blue gradients, stock-looking layouts).
- Every UI decision should be intentional and distinctive.

---

## 9. Development Rhythm

- Large tasks must be broken into independent modules and prioritized.
- Present the ordered list to the user for approval.
- Develop **one module at a time**. Do NOT start multiple modules in parallel.
- Complete, verify, and commit each module before moving to the next.

---

## 10. Testing & Verification

- Every module defined in `ARCHITECTURE.md` must include verification criteria.
- Before marking a module "done", run its verification steps and confirm they pass.
- Verification evidence over assertions — show output, screenshots, or test results.

---

## 11. Git Configuration

Ensure the local git config uses:
```
git config user.name "maxiaovo"
git config user.email "<maxiaovo's email>"
```

Confirm before every commit that the author is maxiaovo.
