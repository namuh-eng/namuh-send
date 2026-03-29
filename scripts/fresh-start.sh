#!/bin/bash
# Clean state and start fresh run
# Usage: ./scripts/fresh-start.sh <target-url>
set -euo pipefail
cd "$(dirname "$0")/.."

TARGET_URL="${1:?Usage: $0 <target-url>}"

echo "=== Fresh Start ==="

# Kill existing watchdog if running
if [ -f ".ralph-watchdog.lock" ]; then
  PID=$(cat .ralph-watchdog.lock 2>/dev/null)
  if kill -0 "$PID" 2>/dev/null; then
    echo "Killing existing watchdog (PID $PID)..."
    kill "$PID" 2>/dev/null || true
    sleep 2
  fi
  rm -f .ralph-watchdog.lock
fi

# Clean state files
echo "Cleaning state files..."
rm -f .inspect-complete
rm -f build-progress.txt inspect-progress.txt qa-progress.txt
rm -f qa-report.json
rm -f build-spec.md sitemap.md docs-extract.md
rm -rf clone-product-docs/
echo '[]' > prd.json
touch build-progress.txt inspect-progress.txt qa-progress.txt

echo "State cleaned."
echo ""
echo "Starting watchdog for: $TARGET_URL"
echo "=================================="
./ralph-watchdog.sh "$TARGET_URL"
