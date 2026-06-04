# CLAUDE.md — Project Governance

This file is loaded by Claude Code on every session start. All rules here are **mandatory** and must be followed without exception.

---

## 1. Version Control Rules

### Author
- Author must always be **maxiaovo**. Never use `claude`, `ttmanthatman`, or any other name.
- Remote: `git@github.com:maxiaovo/sermon_preparing_web.git` or `https://github.com/maxiaovo/sermon_preparing_web.git`.

### Commit
- Commit message format: `<type>: <description>` (e.g., `feat: add auth module`, `fix: resolve login redirect`).
- Valid types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`.
- Every code change must be committed and pushed to GitHub immediately after verification.

### Branch Strategy
- `main`: production-ready code. Never commit directly to `main` — only merge via PR or after full verification.
- `feature/<name>`: new feature branches (e.g., `feature/auth-module`, `feature/sermon-editor`).
- `fix/<name>`: bug fix branches (e.g., `fix/login-redirect`).
- Merge to `main` only when: all verification criteria pass, no open errors in ERROR_LOG.md for this module, ARCHITECTURE.md status is `done`.
- Delete feature/fix branches after merge.
- Never force-push to `main`.

### Push
- Every commit must be pushed immediately.
- Verify `git log -1 --format='%an %ae'` shows maxiaovo before pushing.

---

## 2. Pre-Coding Checklist (MANDATORY ORDER)

Before writing ANY code, you MUST read these files in order:

| Step | File | Purpose |
|------|------|---------|
| 1 | `ERROR_LOG.md` | Check known errors to avoid repeating mistakes |
| 2 | `VARIABLES.md` | Check for naming conflicts with existing variables/functions |
| 3 | `ARCHITECTURE.md` | Confirm module is defined, approved, and dependencies listed |
| 4 | `FILE_STRUCTURE.md` | Check current file versions and project structure |
| 5 | `server-messages.md` | Load private config (API keys, DB info, etc.) |
| 6 | **Reuse Search** | Search npm, GitHub, Claude Code skills for existing solutions before building |

**If any of these 6 steps is skipped, do NOT write code.**

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

- Before building anything, **search existing solutions** as step 6 of the pre-coding checklist.
- Check in this order: Claude Code skills, npm packages, open-source GitHub projects, prior project code.
- Record reusable dependencies in `ARCHITECTURE.md` under the module's "External Dependencies" field.
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

### When to Write Tests
- **Before code** (TDD): write test first, watch it fail, then implement.
- **After code** (verification): at minimum, manually verify the module against its ARCHITECTURE.md verification criteria.
- Both approaches are acceptable — but verification MUST happen before marking any module `done`.

### Test Types
| Type | Scope | When Required |
|------|-------|---------------|
| Unit test | Single function/component | Core logic, data transformations |
| Integration test | Module-to-module interaction | API endpoints, DB queries |
| E2E test | Full user flow | Critical user journeys (e.g., sermon prep flow) |

### Verification Gate
Before marking a module `done`:
- Run all automated tests for that module.
- Execute the verification steps listed in `ARCHITECTURE.md` for that module.
- Show evidence: terminal output, screenshots, or test results.
- Fix any failures before proceeding to the next module.
- Evidence over assertions — never claim "it works" without showing proof.

---

## 11. Git Configuration

Ensure the local git config uses:
```
git config user.name "maxiaovo"
git config user.email "<maxiaovo's email>"
```

Confirm before every commit that the author is maxiaovo.
