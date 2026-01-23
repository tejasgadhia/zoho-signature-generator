# Dark Mode System Preferences Troubleshooting

**Date:** January 23, 2026
**Issue:** Light mode signature text appearing white/unreadable
**Root Cause:** System dark mode preference interfering with preview

---

## The Problem

When a user's Mac/OS is set to dark mode (System Settings → Appearance → Dark), the signature preview would show white text on a white background, making it illegible. This happened even when the preview toggle was set to "light mode."

## Why It Happened

The signature HTML includes CSS with `@media (prefers-color-scheme: dark)` to support dark mode in email clients:

```css
@media (prefers-color-scheme: dark) {
  .sig-name { color: #FFFFFF !important; }
  .sig-title { color: #E0E0E0 !important; }
}
```

This media query responds to the **system preference**, not the preview toggle. So even with a white preview background, the text would turn white if the OS was in dark mode.

## The Solution

We needed **two different dark mode CSS approaches**:

1. **Preview Mode** (`isPreview=true`):
   - Only includes `.dark-mode` class selectors (no media query)
   - Ignores system preference
   - Controlled by the toggle switch

2. **Copy Mode** (`isPreview=false`):
   - Includes both `@media (prefers-color-scheme: dark)` AND `.dark-mode` selectors
   - Respects recipient's email client dark mode
   - Works in Gmail, Apple Mail, etc.

### Implementation

**signature.js:**
```javascript
getDarkModeStyles(isPreview = false) {
    if (isPreview) {
        // Preview: ONLY .dark-mode class selectors
        return `<style>.dark-mode .sig-name { color: #FFFFFF !important; }</style>`;
    } else {
        // Copy: Both media query AND .dark-mode selectors
        return `<style>
            @media (prefers-color-scheme: dark) {
                .sig-name { color: #FFFFFF !important; }
            }
            .dark-mode .sig-name { color: #FFFFFF !important; }
        </style>`;
    }
}

generatePreview(data, style, socialOptions, accentColor) {
    // Pass isPreview=true to exclude media query
    return this.generate(data, style, socialOptions, accentColor, true);
}
```

## What Didn't Work

### ❌ Attempt 1: `color-scheme: only light` CSS property
```css
.preview-container {
    color-scheme: only light; /* Didn't prevent media query from triggering */
}
```
**Why:** The media query inside the signature HTML still responded to system preference.

### ❌ Attempt 2: Using `!important` on inline styles
**Why:** Dark mode CSS already had `!important`, creating a specificity tie.

### ❌ Attempt 3: Hard refresh / cache clearing
**Why:** This was actually a logic issue, not a caching issue (though we did have caching issues earlier).

## Testing Checklist

Before deploying changes that affect dark mode:

- [ ] Test on Mac with **System Appearance set to Dark**
- [ ] Test on Mac with **System Appearance set to Light**
- [ ] Test preview toggle in both system modes
- [ ] Test copied signature in Gmail (light + dark mode)
- [ ] Test copied signature in Apple Mail (light + dark mode)
- [ ] Verify accent colors work in both modes

## Key Lessons

1. **Context matters**: Preview and Copy are two different contexts with different requirements
2. **System preferences persist**: OS-level settings can override CSS in unexpected ways
3. **Media queries scope**: `@media (prefers-color-scheme: dark)` responds to system, not container state
4. **Test with dark mode ON**: Most developers use light mode, so dark mode bugs are easy to miss

## Related Issues

- **CSS specificity battles** - See `docs/troubleshooting/css-important-conflicts.md`
- **Browser caching** - See `docs/troubleshooting/browser-caching.md`

---

**TL;DR:** Separate preview and copy dark mode CSS. Preview uses only `.dark-mode` class, copy uses media query + class.
