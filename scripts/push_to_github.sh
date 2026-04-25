#!/usr/bin/env bash
set -euo pipefail

BRANCH="$(git branch --show-current)"
REMOTE_URL="$(git remote get-url origin 2>/dev/null || true)"

echo "Current branch: $BRANCH"

if [[ -z "$REMOTE_URL" ]]; then
  echo "origin remote is not configured."
  echo "Run:"
  echo "  git remote add origin <your-repo-url>"
  echo "  git push -u origin $BRANCH"
  exit 1
fi

echo "origin: $REMOTE_URL"
echo "Pushing current branch to origin..."
git push -u origin "$BRANCH"
