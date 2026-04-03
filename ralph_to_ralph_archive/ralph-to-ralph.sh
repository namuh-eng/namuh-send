#!/bin/bash
# Full pipeline: Inspect → Build → QA
set -e

TARGET_URL="${1:?Usage: $0 <target-url> [inspect-iters] [build-iters] [qa-iters]}"
INSPECT_ITERS="${2:-999}"
BUILD_ITERS="${3:-999}"
QA_ITERS="${4:-999}"

echo "========================================="
echo "  RALPH-TO-RALPH: Product Cloner"
echo "========================================="
echo "Target:           $TARGET_URL"
echo "Inspect iters:    $INSPECT_ITERS"
echo "Build iters:      $BUILD_ITERS"
echo "QA iters:         $QA_ITERS"
echo "========================================="
echo ""

# Initialize progress files
touch inspect-progress.txt
touch build-progress.txt
touch qa-progress.txt
mkdir -p screenshots

# Initialize PRD if not exists
if [ ! -f "prd.json" ]; then
  echo '[]' > prd.json
fi

echo ">>> Phase 1: Inspect (Ever CLI + Claude)"
echo ""
./inspect-ralph.sh "$TARGET_URL" "$INSPECT_ITERS"

echo ""
echo ">>> Phase 2: Build (Claude)"
echo ""
./build-ralph.sh "$BUILD_ITERS"

echo ""
echo ">>> Phase 3: QA (Codex as independent evaluator)"
echo ""
./qa-ralph.sh "$QA_ITERS"

echo ""
echo "========================================="
echo "  RALPH-TO-RALPH: Complete!"
echo "========================================="
echo "  PRD: prd.json"
echo "  Spec: build-spec.md"
echo "  QA Report: qa-report.json"
echo "========================================="
