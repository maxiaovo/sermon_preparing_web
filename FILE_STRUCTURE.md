# FILE_STRUCTURE.md — File Structure & Version Tracker

## Rules
- Every file creation, modification, or deletion must be recorded here.
- Version format: `major.minor.patch` (e.g., `0.1.0`).
- Increment:
  - `major`: file rewrite or purpose change
  - `minor`: significant content addition
  - `patch`: typo fixes, small tweaks
- Read this file before any coding session.

## File Registry

| File Path | Version | Status | Last Modified | Description |
|-----------|---------|--------|---------------|-------------|
| `.gitignore` | 0.1.0 | created | 2026-06-04 | Git ignore rules for secrets, deps, build artifacts |
| `CLAUDE.md` | 0.2.0 | modified | 2026-06-04 | Main project governance file — added merge rules, reuse checklist, testing strategy |
| `VARIABLES.md` | 0.1.0 | created | 2026-06-04 | Variable and function name registry |
| `ARCHITECTURE.md` | 0.2.0 | modified | 2026-06-04 | System architecture — added External Dependencies to module template |
| `FILE_STRUCTURE.md` | 0.1.1 | modified | 2026-06-04 | This file — version bumps for CLAUDE.md and ARCHITECTURE.md |
| `ERROR_LOG.md` | 0.1.0 | created | 2026-06-04 | Error log for debugging and avoidance |
| `server-messages.md` | 0.1.0 | created | 2026-06-04 | Private server config (gitignored, not pushed) |

## Directory Legend

```
yubei/
├── .gitignore              # Security: ignore secrets + build artifacts
├── CLAUDE.md               # Governance: all workflow rules
├── VARIABLES.md            # Registry: all variables and functions
├── ARCHITECTURE.md         # Design: module definitions
├── FILE_STRUCTURE.md       # Tracker: file versions (this file)
├── ERROR_LOG.md            # Log: all encountered errors
└── server-messages.md      # Secret: private config (NOT in git)
```
