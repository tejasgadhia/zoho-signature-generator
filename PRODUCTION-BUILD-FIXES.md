# Production Build Fixes - 2026-01-27

## Issues Found in npm run preview Testing

### Critical Issues Fixed

#### 1. HTML/CSS Class Name Mismatches ✅ FIXED
**Problem**: HTML used different class names than CSS
- Color buttons: HTML had `.accent-color-btn`, CSS has `.color-btn`
- Social cards: HTML had `.social-channel-card`, CSS has `.social-compact-card`

**Fix**: Updated index.html to match CSS class names
```bash
sed -i '' 's/accent-color-btn/color-btn/g' index.html
sed -i '' 's/social-channel-card/social-compact-card/g' index.html
```

#### 2. Asset Path Issues ✅ FIXED
**Problem**: Relative asset paths (assets/logo.svg) don't work with Vite base path
**Fix**: Changed to absolute paths with base
```bash
sed -i '' 's|src="assets/|src="/zoho-signature-generator/assets/|g' index.html
```

### JavaScript Issues Remaining

#### 3. Email Validation Not Showing ⚠️ NEEDS FIX
**Problem**: Line 164 in form-handler.ts looks for `#email` but input has `id="email-prefix"`
**Location**: `src/app/form-handler.ts:164`
**Fix Needed**:
```typescript
// Current (broken):
const inputGroup = document.querySelector(`#${field}`)?.closest('.input-group');

// Fix: Map field names to actual input IDs
const inputIdMap: Record<string, string> = {
  'email': 'email-prefix',
  'linkedin': 'linkedin-username',
  'twitter': 'x-username',
  'bookings': 'bookings-id'
};
const inputId = inputIdMap[field] || field;
const inputGroup = document.querySelector(`#${inputId}`)?.closest('.input-group');
```

#### 4. LinkedIn URL Missing "/in/" ⚠️ NEEDS FIX
**Problem**: LinkedIn URLs show `linkedin.com/username` instead of `linkedin.com/in/username`
**Location**: `src/utils/validation.ts` (cleanLinkedInUrl function)
**Need to check**: Is the function constructing the URL correctly?

#### 5. Phone Formatting Gaps in Preview ⚠️ NEEDS FIX
**Problem**: Phone numbers have formatting gaps in signature preview
**Location**: `src/signature-generator/` modules
**Need to check**: Phone number rendering in signature HTML

#### 6. Input Lag/Performance ⚠️ NEEDS FIX
**Problem**: Noticeable lag when typing in full name and X handle fields
**Cause**: `updatePreview()` called on every keystroke without debouncing
**Location**: `src/app/form-handler.ts` - input event listeners
**Fix Needed**: Add debouncing to preview updates

#### 7. Help Tooltips Not Working ⚠️ NEEDS FIX
**Problem**: Blue ? icon help buttons don't work
**Possible causes**:
- Event listeners not attached
- DOM elements not found
- Missing help panel functionality
**Need to check**: Where are help tooltips initialized?

#### 8. Dark Mode Toggle Not Working ⚠️ NEEDS FIX
**Problem**: Theme toggle doesn't switch modes
**Location**: `src/main.ts:58-63`
**Issue**: ThemeManager is commented out (line 35-37)
**Fix Needed**: Either:
1. Use PreviewRenderer.toggleDarkMode() directly for preview-only dark mode
2. OR uncomment and implement ThemeManager for app-wide theme

#### 9. Missing Instruction Modals ⚠️ NEEDS FIX
**Problem**: Import instructions missing for:
- Zoho Desk
- Gmail
- Apple Mail
- Outlook
**Location**: Check HTML for modal content sections
**Need to verify**: Are modal content divs present in index.html?

## Testing Checklist After Fixes

- [ ] Color selector boxes styled correctly
- [ ] Social media cards styled and functional
- [ ] Email validation shows error messages
- [ ] Email auto-populates from full name
- [ ] Email allows typing uppercase but converts to lowercase on blur
- [ ] Phone formatting displays correctly in preview
- [ ] LinkedIn URLs include "/in/" segment
- [ ] No input lag when typing
- [ ] Help tooltip icons open help panels
- [ ] Dark mode toggle switches preview theme
- [ ] All 4 import instruction modals open correctly
- [ ] Logo and button images load (no 404s)

## Next Steps

1. Rebuild: `npm run build`
2. Test preview: `npm run preview`
3. Fix remaining JavaScript issues
4. Test again
5. Deploy when all issues resolved
