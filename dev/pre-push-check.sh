#!/bin/bash

# Pre-Push Checklist for GitHub Pages Deployment
# Run this before pushing to catch deployment issues

set -e  # Exit on first error

echo "🔍 Running pre-push checks..."
echo ""

# 1. Verify JavaScript syntax
echo "1️⃣  Checking JavaScript syntax..."
node --check js/app.js
node --check js/modal.js
node --check js/signature.js
echo "   ✓ All JavaScript files valid"
echo ""

# 2. Check for broken CSS (unmatched braces)
echo "2️⃣  Checking CSS syntax..."
python3 -c "
content = open('css/styles.css').read()
braces_open = content.count('{')
braces_close = content.count('}')
if braces_open != braces_close:
    print(f'   ❌ Unmatched braces: {braces_open} open, {braces_close} close')
    exit(1)
print(f'   ✓ CSS braces balanced ({braces_open} pairs)')
"
echo ""

# 3. Verify .nojekyll exists
echo "3️⃣  Checking GitHub Pages requirements..."
if [ -f .nojekyll ]; then
    echo "   ✓ .nojekyll file exists"
else
    echo "   ❌ MISSING .nojekyll file!"
    echo "   Run: touch .nojekyll && git add .nojekyll"
    exit 1
fi
echo ""

# 4. Check for hidden directory CSS imports
echo "4️⃣  Checking for hidden directory imports..."
if grep -r "@import.*'\.\." css/ > /dev/null 2>&1; then
    echo "   ⚠️  Found @import with hidden directories:"
    grep -rn "@import.*'\.\." css/
    echo "   Ensure .nojekyll file exists to serve these directories"
else
    echo "   ✓ No hidden directory imports found"
fi
echo ""

# 5. Verify key files exist
echo "5️⃣  Verifying required files exist..."
required_files=(
    "index.html"
    "css/styles.css"
    ".ui-design/tokens/tokens.css"
    "js/app.js"
    "js/modal.js"
    "js/signature.js"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✓ $file"
    else
        echo "   ❌ MISSING: $file"
        exit 1
    fi
done
echo ""

# 6. Check git status
echo "6️⃣  Checking git status..."
if git diff --quiet && git diff --cached --quiet; then
    echo "   ⚠️  No changes to commit"
else
    echo "   ✓ Changes ready to commit/push"
    echo ""
    echo "📝 Changed files:"
    git status --short
fi
echo ""

# 7. Final instructions
echo "✅ All checks passed!"
echo ""
echo "Next steps:"
echo "  1. Test locally: open index.html"
echo "  2. Verify styling, forms, dark mode work"
echo "  3. Push: git push origin main"
echo "  4. Wait 1-2 minutes for GitHub Pages deployment"
echo "  5. Test live site: https://tejasgadhia.github.io/zoho-signature-generator/"
echo ""
