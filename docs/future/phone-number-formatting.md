# Phone Number Formatting Enhancement

**Status:** Planned for v0.9.0+
**Priority:** Medium
**Estimated Effort:** 2-3 hours

---

## Problem Statement

Current phone number field is free-form text with no formatting assistance:
- Users must manually type `+1 (512) 555-0123`
- No auto-detection of country code
- Inconsistent formats across signatures
- Poor UX compared to modern input standards

---

## Proposed Solution

Implement real-time phone number formatting with:
- Auto-prepend `+1` for US/Canada (aligns with regional enforcement goal)
- Format as user types: `+1 (512) 555-0123`
- Handle paste events (strip, reformat)
- Visual feedback (formatting changes as you type)

---

## Research Required

### Best Practices (2026)
- [ ] Search: "phone number input UX best practices 2026"
- [ ] Search: "auto-formatting phone input accessibility"
- [ ] Study: Stripe, PayPal, Airbnb phone inputs
- [ ] Review: Nielsen Norman Group phone input guidelines

### Technical Approaches

**Option 1: Input Masking**
- Library: None (vanilla JS)
- Pro: Simple, no dependencies
- Con: Can be rigid, accessibility concerns
- Example: `input.addEventListener('input', formatAsYouType)`

**Option 2: Display Formatting**
- Store raw digits, display formatted
- Pro: Flexible, clean data storage
- Con: More complex state management
- Example: `value="5125550123"` displays as `+1 (512) 555-0123`

**Option 3: Library-Based**
- `libphonenumber-js` (Google's library, JS port)
- Pro: Handles international, validation included
- Con: Adds dependency (~70KB), overkill for US-only?
- Example: `parsePhoneNumber('+15125550123', 'US')`

### Key Questions

1. **Country code dropdown?** Or assume +1 for now?
2. **International support?** Or US/Canada only?
3. **Validation timing?** Real-time or on blur?
4. **Accessibility?** Screen reader announcements for formatting changes?
5. **Mobile keyboards?** `type="tel"` triggers number pad on mobile

---

## Design Considerations

### Input Field Enhancements

**Visual cues:**
- Placeholder: `+1 (555) 555-5555`
- Helper text: "US/Canada format"
- Real-time formatting as you type
- Green checkmark when valid

**User behaviors to handle:**
- Typing from scratch: `5` → `+1 (5` → `+1 (51` → `+1 (512) 5`
- Pasting: `5125550123` → auto-format to `+1 (512) 555-0123`
- Deleting: Handle backspace through formatting characters
- Invalid input: Show error, don't break formatting

### Accessibility Requirements

- ARIA live region announces formatting changes
- Screen reader: "Phone number formatted as: +1 area code 512, prefix 555, number 0123"
- Keyboard navigation doesn't break
- Focus states clear
- Error messages descriptive

---

## Implementation Sketch

### HTML Changes
```html
<div class="input-group">
    <label for="phone">
        Phone Number
        <span class="info-icon" data-tooltip="Auto-formats to US/Canada style">ⓘ</span>
    </label>
    <div class="input-wrapper">
        <div class="toggle-switch active" data-field="phone"></div>
        <input type="tel"
               id="phone"
               name="phone"
               placeholder="+1 (555) 555-5555"
               inputmode="numeric"
               autocomplete="tel">
        <span class="validation-icon"></span>
    </div>
    <small class="help-text">US/Canada format: +1 (512) 555-0123</small>
</div>
```

### JavaScript Logic
```javascript
function formatPhoneNumber(input) {
    // Strip all non-digits
    let digits = input.replace(/\D/g, '');

    // Limit to 11 digits (1 + 10)
    if (digits.length > 11) digits = digits.slice(0, 11);

    // Add country code if missing
    if (!digits.startsWith('1') && digits.length === 10) {
        digits = '1' + digits;
    }

    // Format: +1 (512) 555-0123
    if (digits.length >= 11) {
        return `+${digits[0]} (${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7,11)}`;
    } else if (digits.length >= 7) {
        return `+${digits[0]} (${digits.slice(1,4)}) ${digits.slice(4,7)}${digits.slice(7) ? '-' + digits.slice(7) : ''}`;
    } else if (digits.length >= 4) {
        return `+${digits[0]} (${digits.slice(1,4)}${digits.slice(4) ? ') ' + digits.slice(4) : ''}`;
    } else if (digits.length >= 1) {
        return `+${digits[0]}${digits.slice(1) ? ' (' + digits.slice(1) : ''}`;
    }

    return '';
}

// Event listeners
phoneInput.addEventListener('input', (e) => {
    const cursorPos = e.target.selectionStart;
    const formatted = formatPhoneNumber(e.target.value);
    e.target.value = formatted;

    // Restore cursor position (adjust for formatting)
    // ... cursor position logic ...
});

phoneInput.addEventListener('paste', (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    const formatted = formatPhoneNumber(pasted);
    e.target.value = formatted;
});
```

### Validation Updates
```javascript
function isValidPhone(phone) {
    // Strip formatting
    const digits = phone.replace(/\D/g, '');

    // Must be 11 digits (1 + 10)
    if (digits.length !== 11) return false;

    // Must start with 1
    if (!digits.startsWith('1')) return false;

    // Area code can't start with 0 or 1
    const areaCode = digits.slice(1, 4);
    if (areaCode[0] === '0' || areaCode[0] === '1') return false;

    return true;
}
```

---

## Testing Requirements

### Manual Testing
- [ ] Type phone from scratch
- [ ] Paste unformatted: `5125550123`
- [ ] Paste formatted: `+1 (512) 555-0123`
- [ ] Paste with country code: `15125550123`
- [ ] Delete characters (backspace through formatting)
- [ ] Tab in/out (doesn't break formatting)
- [ ] Mobile keyboard (type="tel" triggers number pad)

### Accessibility Testing
- [ ] Screen reader announces formatting
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Error messages clear

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## Edge Cases to Handle

1. **Pasting international number:** `+44 20 1234 5678`
   - Strip to digits, check if starts with 1
   - If not, reject or convert?

2. **Partial input then blur:** `+1 (512) 55`
   - Mark as invalid
   - Don't clear, let user complete

3. **Copy from signature:** Should copy formatted or raw?
   - Decision: Raw digits in signature HTML
   - Display formatting is UI-only

4. **Existing data:** Users with old formats
   - Migration: Parse and reformat on load
   - Graceful: Don't break if can't parse

---

## Open Questions

1. **Country code dropdown needed?** Or hardcode +1?
   - Recommendation: Hardcode +1 for v0.9.0, dropdown in v1.0.0 if international users

2. **Store formatted or raw?**
   - Recommendation: Store raw digits, format on display

3. **Validation timing?**
   - Recommendation: Visual feedback real-time, error on blur

4. **Extension support?** `+1 (512) 555-0123 x1234`
   - Recommendation: Skip for v0.9.0, add if requested

---

## Success Metrics

- ✅ Users can type phone without manual formatting
- ✅ 95%+ of phone numbers in consistent format
- ✅ Zero accessibility violations
- ✅ Works on mobile keyboards
- ✅ Paste from various sources works

---

## References (To Research)

- [Google libphonenumber-js](https://github.com/catamphetamine/libphonenumber-js)
- [Nielsen Norman Group: Phone Input UX](https://www.nngroup.com/articles/phone-number-field/)
- [Baymard Institute: Phone Input Best Practices](https://baymard.com/blog/phone-number-field)
- [WCAG 2.2: Input Assistance](https://www.w3.org/WAI/WCAG22/quickref/?showtechniques=332#input-assistance)

---

## Implementation Plan (Draft)

**Task 1:** Research best practices (30 min)
**Task 2:** Design formatting algorithm (30 min)
**Task 3:** Implement input masking (1 hour)
**Task 4:** Add paste handling (30 min)
**Task 5:** Update validation logic (30 min)
**Task 6:** Add accessibility features (30 min)
**Task 7:** Cross-browser testing (30 min)
**Task 8:** Mobile testing (30 min)

**Total:** ~4.5 hours (including research)
