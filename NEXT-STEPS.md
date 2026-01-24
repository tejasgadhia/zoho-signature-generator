# Next Steps - Zoho Email Signature Generator
Last Updated: 2026-01-24

## v0.9.0+ Complete - What's Next?

**Status**: v0.9.0 deployed with post-release fixes. Backlog tracked in GitHub Issues.

---

## GitHub Issues Backlog

**Source of truth for all tasks**: https://github.com/tejasgadhia/zoho-signature-generator/issues

| # | Issue | Complexity | Priority |
|---|-------|------------|----------|
| [#1](https://github.com/tejasgadhia/zoho-signature-generator/issues/1) | Bug: Social media toggle button click doesn't update preview | Unknown | HIGH |
| [#4](https://github.com/tejasgadhia/zoho-signature-generator/issues/4) | UX: Auto-focus bookings input when toggle enabled | Simple | LOW |
| [#5](https://github.com/tejasgadhia/zoho-signature-generator/issues/5) | UX: Apply title case formatting on keyup instead of blur | Simple | LOW |
| [#6](https://github.com/tejasgadhia/zoho-signature-generator/issues/6) | Design: Add disabled pill switch to full name field | Medium | LOW |
| [#7](https://github.com/tejasgadhia/zoho-signature-generator/issues/7) | Content: Review and improve tooltip text | Medium | LOW |
| [#8](https://github.com/tejasgadhia/zoho-signature-generator/issues/8) | Design: Review company website field purpose | Complex | LOW |

---

## Other Tasks (Not in GitHub)

### User Testing & Feedback Collection
**Priority**: HIGH
**What to do**:
- Share tool with Zoho colleagues
- Collect feedback on template choices
- Identify any rendering issues in different email clients
- Note any requested features

### Email Client Compatibility Testing
**Priority**: MEDIUM
**What to do**:
1. Create signature with each template
2. Test in Gmail, Outlook, Apple Mail, Zoho Mail
3. Document any rendering issues

---

## Future Enhancements (v0.10.0 Candidates)

### Mobile Optimization
- Test on actual mobile email apps
- Consider responsive design with inline media queries
- Or create "Mobile-Optimized" template variants

### Phone Number Auto-Formatting
- Auto-prepend +1 for US numbers
- Format-as-you-type: `(555) 123-4567`

### Event Banner Feature
- Promotional banner below signature
- Time-limited display for events/announcements

### Template Previews on Hover
- Show mini-preview when hovering over template options
- Help users choose without clicking through each

---

## Questions to Resolve

- Should we support international phone formats beyond +1?
- Do we need separate mobile-specific templates?
- Should event banners be a separate feature or part of templates?

---

## Blockers

**None** - v0.9.0 is complete and deployed.

---

## Next Session Starter Prompt

If you want to continue working on this project, copy this:

```
Continue working on zoho-signature-generator.

v0.9.0+ is deployed. Check GitHub Issues for backlog:
https://github.com/tejasgadhia/zoho-signature-generator/issues

Quick wins available:
- #4: Auto-focus bookings input (simple)
- #5: Title case on keyup (simple)

Or pick any issue from the backlog. Reference PROJECT-STATUS.md for current state.
```

---

## Quick Reference

**Live URL**: https://tejasgadhia.github.io/zoho-signature-generator

**Key Files:**
- `js/signature.js` - Template generation (7 functions)
- `js/app.js` - State management, form handling
- `index.html` - UI and form
- `CHANGELOG.md` - Version history

**Recent Commits:**
```
d62cf73 docs: update documentation for v0.9.0 release
26e9899 feat: update template selector with user-focused descriptions
8d9543c feat: add Creative template with bold left accent bar
```

**Template Reference:**
| Template | Logo | Best For |
|----------|------|----------|
| Classic | 34px | Everyone (default) |
| Professional | 38px | Sales, Account Management |
| Minimalist | None | Engineering, Technical Support |
| Compact | 26px | Mobile-heavy users |
| Modern | 38px | Product, Engineering Leadership |
| Creative | 32px | Marketing, Design, Events |

---

v0.9.0 shipped!
