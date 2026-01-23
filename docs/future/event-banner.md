# Event Banner Functionality

**Status:** Planned for v0.10.0
**Priority:** Medium
**Estimated Effort:** 3-4 hours

---

## Problem Statement

Zoho Events Team and Marketing frequently host events (Zoholics, User Group Meetings, Workshops, Webinars) and need to promote them via email signatures. Currently there's no way to add event graphics to signatures.

**Use Cases:**
- "Join us at Zoholics 2026" banner with conference graphic
- "Register for our Q2 Product Webinar" with branded image
- "Visit us at Booth #42 at TechCrunch Disrupt" with show logo

---

## Proposed Solution

Add optional "Event Banner" section to form with:
- Toggle to enable/disable
- Event graphic URL input (hosted on Zoho WorkDrive or CDN)
- Event registration link input
- Banner appears at bottom of signature (after social links)

---

## Research Required

### Zoho WorkDrive Public Links

**Outstanding Questions:**
1. Can WorkDrive generate public shareable links for images?
2. What's the URL format for direct image embedding?
3. Do links expire or require authentication?
4. What's the typical workflow Events Team uses?

**Alternative:** If WorkDrive is complex, use Zoho CDN or static hosting.

### Email Banner Best Practices

**Research needed:**
- [ ] Search: "email signature banner best practices 2026"
- [ ] Optimal dimensions for email banners
- [ ] File size recommendations (keep signatures fast)
- [ ] Image format: PNG vs JPG vs WebP
- [ ] Accessibility: Alt text requirements

**Expected findings:**
- Max width: 600px (standard email width)
- Max height: 100-150px (keep signatures compact)
- File size: <100KB (fast loading)
- Format: PNG or JPG (WebP not universally supported in email)

---

## Design Considerations

### Form UI

**Event Banner Section (collapsed by default):**
```
┌─────────────────────────────────────┐
│ Event Promotion (Optional)    [⭘]  │ ← Toggle
├─────────────────────────────────────┤
│ Event Graphic URL                   │
│ [https://workdrive.zoho.com/...]    │
│ ℹ️ Get from Events Team             │
│                                     │
│ Event Registration Link             │
│ [https://zoho.com/event-signup]     │
│                                     │
│ ⚠️ Best Practices:                  │
│ • Max width: 600px                  │
│ • Max height: 150px                 │
│ • Format: PNG or JPG                │
│ • File size: <100KB                 │
└─────────────────────────────────────┘
```

### Signature Placement

**Banner at bottom (after social links):**
```
John Doe
Account Executive
Zoho Corporation

📧 john@zohocorp.com | 📞 +1 (512) 555-0123
🌐 zoho.com

🔗 LinkedIn | 𝕏 Twitter | f Facebook

┌───────────────────────────────┐
│  [EVENT GRAPHIC IMAGE]        │ ← Clickable, links to registration
│  (600x150px banner)            │
└───────────────────────────────┘
```

### Accessibility

- Alt text required: "Join us at [Event Name] - [Date/Location]"
- Link includes descriptive text (not just image)
- Works with screen readers
- Banner is optional (doesn't break signature if removed)

---

## Implementation Sketch

### HTML Changes

```html
<!-- Event Banner Section -->
<div class="form-section">
    <div class="section-header">
        <h3>Event Promotion (Optional)</h3>
        <label class="toggle-switch">
            <input type="checkbox" id="toggle-event-banner">
            <span class="slider"></span>
        </label>
    </div>

    <div id="event-banner-fields" class="collapsible-section" style="display: none;">
        <div class="form-group">
            <label for="event-banner-url">
                Event Graphic URL
                <span class="info-icon" data-tooltip="Get from Events Team - max 600x150px, <100KB">ⓘ</span>
            </label>
            <input type="url" id="event-banner-url" placeholder="https://workdrive.zoho.com/...">
            <small class="help-text">Upload to WorkDrive, get shareable link, paste here</small>
        </div>

        <div class="form-group">
            <label for="event-link-url">Event Registration Link</label>
            <input type="url" id="event-link-url" placeholder="https://zoho.com/event-signup">
        </div>

        <div class="info-box">
            <strong>📏 Banner Guidelines:</strong>
            <ul>
                <li>Max width: 600px</li>
                <li>Max height: 150px</li>
                <li>Format: PNG or JPG</li>
                <li>File size: &lt;100KB</li>
            </ul>
        </div>
    </div>
</div>
```

### JavaScript Logic

```javascript
// Add to AppState
const AppState = {
    // ... existing properties
    eventBanner: {
        enabled: false,
        imageUrl: '',
        linkUrl: ''
    }
};

// Toggle handler
document.getElementById('toggle-event-banner').addEventListener('change', (e) => {
    const isEnabled = e.target.checked;
    AppState.eventBanner.enabled = isEnabled;

    document.getElementById('event-banner-fields').style.display =
        isEnabled ? 'block' : 'none';

    updatePreview();
});

// Generate banner HTML
function generateEventBanner(imageUrl, linkUrl) {
    if (!imageUrl || !linkUrl) return '';

    return `
    <tr>
        <td style="padding-top: 16px;">
            <a href="${escapeHtml(linkUrl)}" style="display: block; text-decoration: none;">
                <img src="${escapeHtml(imageUrl)}"
                     alt="Event Banner"
                     style="max-width: 600px; width: 100%; height: auto; display: block; border: 0;"
                     border="0">
            </a>
        </td>
    </tr>
    `.trim();
}
```

### Signature.js Integration

```javascript
generate(data, style, socialOptions, accentColor, isPreview) {
    // ... existing code ...

    // Add event banner at end if enabled
    let eventBannerHtml = '';
    if (data.eventBanner && data.eventBanner.enabled &&
        data.eventBanner.imageUrl && data.eventBanner.linkUrl) {
        eventBannerHtml = this.generateEventBanner(
            data.eventBanner.imageUrl,
            data.eventBanner.linkUrl
        );
    }

    // Append to signature HTML
    return `${signatureHtml}${eventBannerHtml}`;
}
```

---

## Validation Requirements

### Image URL Validation

```javascript
function validateImageUrl(url) {
    // Must be valid URL
    try {
        new URL(url);
    } catch {
        return { valid: false, error: 'Invalid URL format' };
    }

    // Should be image format (check extension)
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const hasValidExtension = validExtensions.some(ext =>
        url.toLowerCase().endsWith(ext)
    );

    if (!hasValidExtension) {
        return { valid: false, error: 'Must be JPG, PNG, or GIF image' };
    }

    return { valid: true };
}
```

### Image Loading Test

```javascript
// Test if image loads before adding to signature
function testImageUrl(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => reject(new Error('Image failed to load'));
        img.src = url;
    });
}
```

---

## Testing Requirements

### Manual Testing
- [ ] Toggle banner on/off
- [ ] Paste WorkDrive URL
- [ ] Paste CDN URL
- [ ] Test with broken image URL (shows error)
- [ ] Copy signature with banner to clipboard
- [ ] Paste in Gmail, verify image loads
- [ ] Paste in Outlook, verify image loads
- [ ] Click banner in email, verify link works

### Email Client Testing
- [ ] Gmail (web + mobile) - Image loads, clickable
- [ ] Apple Mail (macOS + iOS) - Image loads, clickable
- [ ] Outlook (desktop + web) - Image loads, clickable
- [ ] Zoho Mail - Image loads, clickable

### Edge Cases
- [ ] Very large image (>1MB) - show warning
- [ ] Invalid URL - show error
- [ ] Image 404 - show error before adding to signature
- [ ] No link URL but has image - disable banner
- [ ] Banner toggle off then on - fields persist

---

## Workflow Integration

### Events Team Workflow

**Step 1: Events Team creates graphic**
- Design banner in Canva/Photoshop
- Export as PNG or JPG
- Max 600x150px, <100KB

**Step 2: Upload to hosting**
- Option A: Zoho WorkDrive → Get shareable link
- Option B: Zoho CDN → Get static URL
- Option C: GitHub Pages assets folder

**Step 3: Distribute to employees**
- Share URL via Slack/email
- Provide event registration link
- Optional: Create template with pre-filled URLs

**Step 4: Employees add to signature**
- Toggle "Event Promotion" on
- Paste graphic URL
- Paste registration link
- Copy signature

**Step 5: After event**
- Employees toggle banner off
- Or replace with next event

---

## Open Questions

1. **WorkDrive integration complexity?**
   - If WorkDrive is too complex, use simpler hosting
   - Could Events Team upload to GitHub repo directly?

2. **Banner expiration?**
   - Should banners auto-expire after event date?
   - Or rely on employees to remove manually?

3. **Multiple events?**
   - Support only 1 banner at a time?
   - Or allow rotating banners (complex)?

4. **Banner templates?**
   - Should we provide Canva templates?
   - Pre-made banner sizes for Events Team?

---

## Success Metrics

- ✅ Events Team can easily distribute banner URLs
- ✅ Employees can add banners in <2 minutes
- ✅ Banners render correctly in all major email clients
- ✅ Click-through tracking works (UTM parameters in link)
- ✅ Image loading is fast (<1 second)
- ✅ No accessibility violations

---

## Implementation Plan (Draft)

**Phase 1: WorkDrive Research** (1 hour)
- Test WorkDrive shareable links
- Verify direct image embedding works
- Document URL format and workflow

**Phase 2: Form UI** (1 hour)
- Add event banner section to index.html
- Add toggle and input fields
- Add best practices help text

**Phase 3: Validation Logic** (30 min)
- URL validation
- Image loading test
- Error messaging

**Phase 4: Signature Integration** (1 hour)
- Update signature.js to accept event banner data
- Generate banner HTML
- Position at bottom of signature

**Phase 5: Testing** (30 min)
- Test in all email clients
- Test with various image URLs
- Test edge cases

**Total:** ~4 hours

---

## Deferred from v0.9.0

This feature was consciously deferred from v0.9.0 to prioritize:
1. Template redesigns (affects all signatures daily)
2. Phone number formatting (better UX for all users)

Event banners are valuable but lower priority since:
- Not all employees need them
- Events are periodic, not constant
- Templates and phone formatting have broader impact

---

## Related Documents

- Original design doc: `docs/plans/2026-01-23-v0.8.0-design.md` (deferred section)
- WorkDrive research: To be created in Phase 1

---

## Notes

- Keep implementation simple - don't over-engineer
- Focus on Events Team workflow ease-of-use
- Ensure email client compatibility (images are tricky)
- Provide clear best practices documentation
