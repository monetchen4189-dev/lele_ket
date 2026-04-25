#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Scanning for unresolved merge conflict markers..."
if rg -n "^(<<<<<<<|=======|>>>>>>>)" --glob '!*.lock' --glob '!.git/*' .; then
  echo
  echo "❌ Found unresolved merge conflict markers."
  exit 1
fi

echo "✅ No unresolved merge conflict markers found."
