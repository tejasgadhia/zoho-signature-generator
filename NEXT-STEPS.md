# Next Steps - Zoho Email Signature Generator
Last Updated: January 24, 2026

## Immediate Tasks (Start Here)

### Ready for v0.9.0 Implementation

**All design and planning complete** - Execute 10-task implementation plan in new session.

---

## Task Overview

**Implementation Plan**: `docs/plans/2026-01-24-v0.9.0-implementation.md`
**Design Spec**: `docs/plans/2026-01-24-v0.9.0-template-redesign-design.md`
**Interactive Mockup**: `mockups/v0.9.0-template-designs-full.html`

**10 Tasks in 3 Batches:**
- **Batch 1** (Tasks 1-3): Classic, Professional, Minimalist templates
- **Batch 2** (Tasks 4-6): Compact, Modern, Creative templates
- **Batch 3** (Tasks 7-10): HTML updates, Personal X field, testing, docs

**Estimated Time**: 2-3 hours total

---

## Batch 1: Core Templates (Tasks 1-3)

### Task 1: Update Classic Template (Default)
**Priority**: HIGH
**File**: `js/signature.js:204-254` (generateClassicStyle function)
**What to do**:
1. Change font from `Arial, Helvetica, sans-serif` to `Verdana, Geneva, sans-serif`
2. Update logo size from 32px to 34px
3. Adjust name size from 18px to 15px
4. Implement 3-tier contact structure (Phone/Email | LinkedIn/X/Bookings | Follow Zoho)
5. Update spacing (10px logo-to-name, 7px between sections)

**Why**: Classic is the new default, most users will see this template
**Estimated effort**: 20-30 minutes

---

### Task 2: Update Professional Template
**Priority**: HIGH
**File**: `js/signature.js` (generateProfessionalStyle function)
**What to do**:
1. Change font to Verdana
2. Update logo size to 38px (larger for two-column layout)
3. Change name size to 15px
4. Implement 3-tier contact structure
5. Adjust column widths (logo: 75px, info: 420px)

**Why**: Popular template for Sales/Account Management
**Estimated effort**: 20-30 minutes

---

### Task 3: Update Minimalist Template
**Priority**: HIGH
**File**: `js/signature.js` (generateMinimalStyle function)
**What to do**:
1. Change font to Verdana
2. Update name size to 16px (largest of all templates)
3. **Remove logo completely** (text-only design)
4. Implement 3-tier contact structure
5. Add tighter spacing (8px vs 10px between sections)

**Why**: Engineering/Technical teams prefer text-only
**Estimated effort**: 15-20 minutes

---

## Batch 2: Specialized Templates (Tasks 4-6)

### Task 4: Update Compact Template
**Priority**: MEDIUM
**File**: `js/signature.js` (generateCompactStyle function)
**What to do**:
1. Change font to Verdana
2. Update logo size to 26px (smallest of all templates)
3. Restructure to multi-line stacked (not single-line)
4. Implement 3-tier contact structure

**Why**: Mobile-heavy users need all info visible
**Estimated effort**: 20-25 minutes

---

### Task 5: Update Modern Template
**Priority**: MEDIUM
**File**: `js/signature.js` (generateModernStyle function)
**What to do**:
1. Change font to Verdana
2. Update logo size to 38px
3. **Adjust vertical accent bar opacity from 25% to 30%** (more visible)
4. Implement 3-tier contact structure
5. Ensure 2px vertical bar separator

**Why**: Product/Engineering Leadership love the accent bar
**Estimated effort**: 20-25 minutes

---

### Task 6: Update Creative Template
**Priority**: MEDIUM
**File**: `js/signature.js` (generateCreativeStyle function)
**What to do**:
1. Change font to Verdana
2. Update logo size to 32px
3. **Reduce left bar width from 5px to 3-4px** (less overwhelming)
4. Implement 3-tier contact structure
5. Logo above name (stacked within bar column)

**Why**: Marketing/Design teams want distinctive but not overwhelming
**Estimated effort**: 20-25 minutes

---

## Batch 3: UI & Documentation (Tasks 7-10)

### Task 7: Update HTML Template Descriptions
**Priority**: HIGH
**File**: `index.html` (style selector section)
**What to do**: Replace design-focused descriptions with user-focused ones:

```html
<option value="classic">Classic (Default) - Best for everyone</option>
<option value="professional">Professional - Best for Sales, Account Management</option>
<option value="minimalist">Minimalist - Best for Engineering, Technical Support</option>
<option value="compact">Compact - Best for mobile-heavy users</option>
<option value="modern">Modern - Best for Product, Engineering Leadership</option>
<option value="creative">Creative - Best for Marketing, Design, Events</option>
```

**Why**: Users need to know "Is this for me?" not "What does it look like?"
**Estimated effort**: 10 minutes

---

### Task 8: Change Default Template to Classic
**Priority**: HIGH
**Files**:
- `index.html` (style selector `<select>` element)
- `js/app.js` (initial state setup)

**What to do**:
1. Set Classic as selected option: `<option value="classic" selected>`
2. Update AppState default: `signatureStyle: 'classic'`

**Why**: Classic works for everyone (universal default)
**Estimated effort**: 5 minutes

---

### Task 9: Add Personal X Field (Optional)
**Priority**: MEDIUM
**Files**:
- `index.html` (add X toggle and input after LinkedIn field)
- `js/app.js` (add X field event handlers)
- `js/signature.js` (update tier 2 contact generation to include X)

**What to do**:
1. Clone LinkedIn field HTML, change labels to X
2. Add event listeners for X toggle/input
3. Update tier 2 contact generation: `LinkedIn • X • Book a Meeting`
4. X URL format: `https://x.com/[handle]` (no @ symbol)

**Why**: Separate personal X from Zoho brand X account
**Estimated effort**: 20-30 minutes

---

### Task 10: Final Testing & Documentation
**Priority**: HIGH
**Files**:
- `README.md` (update screenshots if needed)
- `CHANGELOG.md` (add v0.9.0 section)

**Testing Checklist:**
- [ ] All 6 templates render with Verdana font
- [ ] Classic is default (loads on page refresh)
- [ ] 3-tier hierarchy shows in all templates
- [ ] All 4 accent colors work (Red, Green, Blue, Yellow)
- [ ] Dark mode toggles correctly
- [ ] Optional fields work (LinkedIn, X, Bookings, Zoho social)
- [ ] Copy signature button works
- [ ] No JavaScript console errors
- [ ] Logo loads (light/dark variants)

**Estimated effort**: 30-40 minutes

---

## Future Enhancements (Post-v0.9.0)

### v0.10.0 Candidates
**Priority**: LOW (not blocking v0.9.0)

1. **Mobile Optimization** (2-3 hours)
   - Test on actual mobile email apps (Gmail iOS, Outlook Android)
   - Consider responsive design with inline media queries
   - Or create "Mobile-Optimized" template variants
   - Reduce font sizes for mobile (11-12px)

2. **Phone Number Auto-Formatting** (1-2 hours)
   - Auto-prepend +1 for US numbers
   - Format-as-you-type: `(555) 123-4567`
   - International number support

3. **Email Client Testing** (1-2 hours)
   - Gmail (web + mobile)
   - Outlook (desktop + web)
   - Apple Mail (macOS + iOS)
   - Zoho Mail
   - Document compatibility issues

4. **Yellow Accent Warning** (30 minutes)
   - Display inline help when yellow selected
   - Message: "⚠️ Yellow works best on dark backgrounds. For better visibility, consider Red, Green, or Blue."

---

## Questions to Resolve

**None currently** - All design decisions finalized.

**For future releases:**
- Should we support international phone formats beyond +1?
- Do we need separate mobile-specific templates or just responsive design?
- Should event banners be a separate feature or part of signature templates?

---

## Blockers

**None** - All prerequisites complete:
- ✅ Design specification approved
- ✅ Implementation plan written
- ✅ Interactive mockup created
- ✅ Git working tree clean
- ✅ Repository URL fixes deployed

---

## Next Session Starter Prompt

Copy this to start your next session:

```
Continue working on zoho-signature-generator v0.9.0 template redesign.

Execute the implementation plan at docs/plans/2026-01-24-v0.9.0-implementation.md using the executing-plans skill.

Key context:
- Design spec: docs/plans/2026-01-24-v0.9.0-template-redesign-design.md
- Mockup: mockups/v0.9.0-template-designs-full.html
- Main changes: Verdana font, 3-tier content hierarchy, Classic as default
- 10 tasks in 3 batches (templates 1-3, templates 4-6, UI/docs)

Reference my CLAUDE.md for git workflow preferences (always merge locally, no permission needed).

Start with Task 1: Update Classic Template.
```

---

## Quick Reference

**Key Files:**
- `js/signature.js` - All 6 template generation functions (main work here)
- `js/app.js` - State management, event handlers (add X field support)
- `index.html` - Template selector, form fields (add X field HTML)
- `css/styles.css` - No changes needed for v0.9.0

**Critical Changes:**
- **Font**: `Arial, Helvetica, sans-serif` → `Verdana, Geneva, sans-serif` (ALL templates)
- **Default**: `signatureStyle: 'professional'` → `signatureStyle: 'classic'`
- **3-tier structure**: Phone/Email (tier 1) | LinkedIn/X/Bookings (tier 2) | Follow Zoho (tier 3)

**Logo Sizes:**
- Classic: 34px
- Professional: 38px
- Minimalist: NONE (text-only)
- Compact: 26px
- Modern: 38px
- Creative: 32px

**Testing Commands:**
```bash
# Validate JavaScript syntax
node --check js/*.js

# Local testing
open index.html

# Push to production (after testing)
git push origin main
```

---

Ready to implement v0.9.0!
