#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKFLOW_FILE="$ROOT_DIR/.github/workflows/deploy-pages.yml"

echo "[1/6] Repo basic info"
BRANCH="$(git -C "$ROOT_DIR" branch --show-current || true)"
REMOTE_URL="$(git -C "$ROOT_DIR" remote get-url origin 2>/dev/null || true)"
echo "- Current branch: ${BRANCH:-<unknown>}"
if [[ -n "$REMOTE_URL" ]]; then
  echo "- origin: $REMOTE_URL"
else
  echo "- origin: <not configured in this local clone>"
fi

echo

echo "[2/6] Required files"
for f in "$ROOT_DIR/index.html" "$ROOT_DIR/app.js" "$ROOT_DIR/styles.css" "$ROOT_DIR/word-config.js" "$WORKFLOW_FILE"; do
  if [[ -f "$f" ]]; then
    echo "✅ exists: ${f#$ROOT_DIR/}"
  else
    echo "❌ missing: ${f#$ROOT_DIR/}"
  fi
done

echo

echo "[3/6] Workflow key checks"
if [[ -f "$WORKFLOW_FILE" ]]; then
  if grep -q 'uses: actions/configure-pages@' "$WORKFLOW_FILE"; then
    echo "✅ configure-pages present"
  else
    echo "❌ configure-pages missing"
  fi

  if grep -q 'uses: actions/upload-pages-artifact@' "$WORKFLOW_FILE"; then
    echo "✅ upload-pages-artifact present"
  else
    echo "❌ upload-pages-artifact missing"
  fi

  if grep -q 'uses: actions/deploy-pages@' "$WORKFLOW_FILE"; then
    echo "✅ deploy-pages present"
  else
    echo "❌ deploy-pages missing"
  fi

  if grep -q 'github.event.repository.default_branch' "$WORKFLOW_FILE"; then
    echo "✅ deploy is guarded by default branch"
  else
    echo "⚠️ guard by default branch not detected"
  fi
fi

echo

echo "[4/6] Local syntax smoke checks"
if command -v node >/dev/null 2>&1; then
  if node --check "$ROOT_DIR/app.js"; then
    echo "✅ app.js syntax OK"
  else
    echo "❌ app.js syntax check failed"
  fi
else
  echo "⚠️ node not found; skip JS syntax check"
fi

echo

echo "[5/6] Likely root causes when Pages is not live"
echo "- Settings > Pages Source is not 'GitHub Actions'"
echo "- GitHub Actions workflow failed"
echo "- Repository is private and current account has no access"
echo "- URL is wrong: https://<username>.github.io/<repo-name>/"

echo

echo "[6/6] Next actions on GitHub"
echo "1) Open Actions tab and check latest 'Deploy static site to GitHub Pages' run"
echo "2) Open Settings > Pages and confirm 'Your site is live at ...'"
echo "3) Retry in incognito after 2-10 minutes (first deploy can take longer)"
