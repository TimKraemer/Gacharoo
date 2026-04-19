# GitHub push policy (Gacharoo)

This repository is the board’s **source of truth**. Work must exist on **GitHub**, not only as local commits.

## Cadence (what “regular” means)

- **After each cohesive unit of work** (one logical change, one reviewable slice), push your current branch to `origin`.
- **At least once per working session** if you accumulated multiple small commits.
- **Before closing a Paperclip heartbeat** where you created commits: ensure there is nothing left unpushed against your configured upstream (see verification below).

## Upstream branches

- Prefer tracking branches: `git push -u origin HEAD` the first time you publish a branch.
- If you work on `main`, still push after meaningful commits—do not let `main` drift only on disk.

## Verification (local)

From the repository root:

```bash
bun run git:assert-pushed
```

This fails when your branch has commits that are not present on the configured upstream (typical “forgot to push” case).

## Hooks (recommended)

Install repo-local hooks once (per clone):

```bash
bun run git:hooks
```

The `post-commit` hook prints a reminder when you have **unpushed commits** so pushes do not slip until end-of-day.

## Why this exists

Board expectation: parent initiative **GAC-20** (“always push commits”). This document is the durable, reviewable rule; hooks and scripts make it **checkable** in day-to-day work.
