# Next Steps - Zoho Email Signature Generator
Last Updated: 2026-01-24

## Immediate Tasks (Start Here)

### 1. Phone Number Auto-Formatting
**Priority**: P3-MEDIUM (Issue #9)
**File(s)**: `js/app.js` (add formatting logic), `index.html` (phone input)
**What to do**:
- Add input mask or format-on-keyup for phone field
- Default to +1 country code
- Format as: `+1 (555) 123-4567`
- Handle paste events (reformat pasted numbers)
- Preserve cursor position during formatting
**Why**: Current free-form input is inconsistent; auto-formatting improves UX
**Estimated effort**: Medium

### 2. Company Website Field Review
**Priority**: UNSET (Issue #8)
**File(s)**: `index.html` lines 218-230
**What to do**:
- Clarify the purpose of this field (currently locked to zoho.com)
- Options: Remove it, make it configurable, or explain why it's locked
- May need user input on intended use case
**Why**: Field purpose unclear to users
**Estimated effort**: Quick (decision) or Medium (if redesign needed)

### 3. Full Name Pill Switch Alignment
**Priority**: UNSET (Issue #6)
**File(s)**: `index.html` lines 92-100, `css/styles.css`
**What to do**:
- Add a disabled pill switch to Full Name field for visual alignment
- Match the toggle layout of other fields
**Why**: Visual polish - other fields have toggles, Full Name doesn't
**Estimated effort**: Quick

## Future Enhancements

- Consider international phone formats beyond US
- Add more signature templates
- Signature preview in actual email clients (Gmail, Outlook mockups)

## Questions to Resolve

- Issue #8: Should company website be user-configurable or always zoho.com?
- Phone formatting: Support international numbers or US-only?

## Blockers

None currently.

## Next Session Starter Prompt

Copy this to start your next session:

> "Continue working on zoho-signature-generator. Last session: Fixed all 5 tooltip texts for clarity (closed #7), logged phone auto-formatting as #9. Next priority: Implement phone number auto-formatting (#9) - add input mask with +1 default, format as +1 (555) 123-4567. See NEXT-STEPS.md and issue #9 for details."
