#!/usr/bin/env bash
set -euo pipefail

# Fails when the current branch has commits not reachable from @{u}.
# Usage: run from repo root before ending a session or in local CI.

if ! git rev-parse --git-dir >/dev/null 2>&1; then
	echo "assert-pushed-to-origin: not a git repository" >&2
	exit 0
fi

branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)
if [ -z "${branch}" ] || [ "${branch}" = "HEAD" ]; then
	echo "assert-pushed-to-origin: detached HEAD; checkout a branch before asserting push state" >&2
	exit 2
fi

if ! git rev-parse --verify -q '@{u}' >/dev/null 2>&1; then
	echo "assert-pushed-to-origin: no upstream configured for '${branch}'." >&2
	echo "Fix: git push -u origin ${branch}" >&2
	exit 2
fi

count=$(git rev-list --count '@{u}..HEAD')
if [ "${count}" -gt 0 ]; then
	echo "assert-pushed-to-origin: ${count} commit(s) on '${branch}' are not on upstream yet." >&2
	echo "Fix: git push" >&2
	exit 1
fi

echo "assert-pushed-to-origin: branch '${branch}' is in sync with upstream."
