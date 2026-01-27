# Phase 3 Starter Prompt - CSS Migration

**Copy this entire block to start the next session:**

---

Context: Refactoring zoho-signature-generator from vanilla JS to Vite + TypeScript (simplified approach). Working in isolated worktree - work autonomously, only check in for questions or phase completions.

## Current Status

**Branch**: refactor/vite-typescript
**Location**: /Users/tejasgadhia/Claude/zoho-signature-generator-refactor

**Completed**:
- ✅ Phase 1: Vite + TypeScript initialized (commit 8636aaf)
  - tsconfig.json (strict mode), vite.config.ts, package.json
  - Dev server verified, build working (0 errors)
- ✅ Phase 2: Static assets migrated (commit 6608d68)
  - Moved assets/ → public/assets/ (12 files)
  - Moved favicon.svg → public/favicon.svg
  - All assets verified in dist/ after build

**Plan File**: ~/.claude/plans/smooth-toasting-elephant.md

**Original Code**: ~/Claude/zoho-signature-generator/ (v1.0.0 stable baseline)

## Next Task: Phase 3 - CSS Migration (~3 hours)

**Goal**: Split 2231-line `css/styles.css` into 5 focused files in `src/styles/`

### Target Structure

```
src/styles/
├── main.css           # Import orchestrator
├── base.css          # ~400 lines (reset, layout, sidebar)
├── form.css          # ~600 lines (forms, inputs, buttons, toggles)
├── preview.css       # ~400 lines (preview container, signature styles)
├── components.css    # ~500 lines (modal, help, toast, social cards)
└── colors.css        # ~200 lines (color grid, accent colors, dark mode)
```

### Steps

1. **Read source CSS**: ~/Claude/zoho-signature-generator/css/styles.css
2. **Create main.css** with imports:
   ```css
   @import '../../.ui-design/tokens/tokens.css';
   @import './base.css';
   @import './form.css';
   @import './preview.css';
   @import './components.css';
   @import './colors.css';
   ```
3. **Split by feature area** (see plan lines 268-289 for line ranges)
4. **Import in main.ts**: `import '@/styles/main.css';`
5. **Verify visually**: `npm run dev`, check light/dark modes match original
6. **Commit Phase 3**

### Success Criteria

- [ ] All 5 CSS files created
- [ ] main.css imports all files + design tokens
- [ ] Visual parity with original (light/dark modes)
- [ ] No CSS errors in browser console
- [ ] Dev server runs without warnings

### Autonomy Guidelines

- Work autonomously through the split
- Only stop for actual questions or phase completion
- Commit when done with descriptive message
- Update plan file resume points

### After Completion

1. Test in browser (visual check)
2. Commit Phase 3
3. Create next-session starter prompt for Phase 4
4. Report completion

**Start Phase 3 now.**

---

**End of starter prompt**
