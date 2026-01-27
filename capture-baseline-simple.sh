#!/bin/bash
# Simplified Baseline Screenshot Capture Script
# Updated for agent-browser v0.8.2+
# Purpose: Capture key form states for visual regression testing

set -e  # Exit on error

BASELINE_DIR="baseline-screenshots"
URL="https://tejasgadhia.github.io/zoho-signature-generator/"

echo "Starting baseline screenshot capture..."
echo "URL: $URL"
echo "Output directory: $BASELINE_DIR"
echo ""

# Open browser
echo "[1/6] Opening page..."
agent-browser open "$URL"
sleep 2  # Wait for page load

# 1. Initial empty form (light mode)
echo "[2/6] Capturing empty form (light mode)..."
agent-browser screenshot "$BASELINE_DIR/01-initial-empty-form.png" --full

# 2. Get snapshot to identify form fields
echo "[3/6] Taking snapshot to identify elements..."
agent-browser snapshot -i > /tmp/snapshot.txt

# Find the name field reference from snapshot
NAME_FIELD=$(grep -m1 'textbox "Full Name' /tmp/snapshot.txt | grep -o '\[ref=[^]]*\]' | sed 's/\[ref=\(.*\)\]/\1/')

if [ -n "$NAME_FIELD" ]; then
  # 3. Fill form with sample data
  echo "[4/6] Filling form with sample data..."
  agent-browser fill "@$NAME_FIELD" "John Doe"
  sleep 1

  echo "[5/6] Capturing filled form..."
  agent-browser screenshot "$BASELINE_DIR/02-filled-name-field.png" --full
else
  echo "Warning: Could not find name field, skipping fill test"
fi

# 4. Final state
echo "[6/6] Capturing final state..."
agent-browser screenshot "$BASELINE_DIR/03-final-state.png" --full

# Close browser
echo ""
echo "Closing browser..."
agent-browser close

echo ""
echo "✓ Baseline screenshots captured successfully!"
echo "Output: $BASELINE_DIR/"
echo ""
ls -lh "$BASELINE_DIR/"/*.png 2>/dev/null || echo "No screenshots found"
