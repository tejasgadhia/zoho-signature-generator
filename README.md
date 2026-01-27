# Zoho Email Signature Generator

Professional email signature generator for Zoho employees. Six layout styles, four brand colors, dark mode support, live preview.

![Version](https://img.shields.io/badge/version-0.8.0-blue.svg)

**Live Demo**: https://tejasgadhia.github.io/zoho-signature-generator/

---

## Features

- 6 signature layouts (Classic, Compact, Modern, Minimal, Executive, Bold)
- 4 Zoho brand colors for links (Red, Green, Blue, Yellow)
- Dark mode support (Gmail, Apple Mail)
- Zoho social media integration with drag-and-drop ordering
- Email validation (@zohocorp.com required)
- LinkedIn URL cleanup (removes tracking parameters)
- Live preview with theme toggle
- Client-side processing (no server communication)
- Zero dependencies (vanilla JavaScript)
- Email-compatible HTML (table-based layouts, inline styles)

---

## How to Use

1. Fill in your information (name required)
2. Toggle optional fields on/off
3. Choose signature style and accent color
4. Click "Copy Signature"
5. Click "How to Import?" for your email client

---

## Email Client Compatibility

Tested in Gmail, Apple Mail, Outlook (Windows/macOS/Web/iOS/Android), Zoho Mail, Yahoo Mail, ProtonMail, Thunderbird.

**Dark Mode Support**:
- Gmail (Web + Mobile): Full support
- Apple Mail (macOS + iOS): Full support
- Outlook Web: Partial support
- Outlook Desktop: Light mode only

---

## Troubleshooting

**Signature not copying**: Enable JavaScript, use modern browser (Chrome 90+, Firefox 88+, Safari 14+), check clipboard permissions

**Toggle switches not working**: Enable JavaScript, check browser console

**Preview not updating**: Check browser console, verify form values

**Signature looks different in email client**: Normal behavior - email clients vary in CSS support. Core layout and content preserved.

---

## Privacy

All processing happens locally in your browser. No server communication, tracking, or cookies. Theme preference stored in localStorage only.

---

## Development

**Local Testing**:
```bash
open index.html
# or
npx serve  # http://localhost:3000
```

**Deployment**: Changes to `main` branch auto-deploy to GitHub Pages in 1-2 minutes.

**Pre-Push Checks**:
```bash
./pre-push-check.sh  # Verifies JS syntax, CSS validity, required files
```

See `CLAUDE.md` for detailed development guidelines.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for full version history.

---


## License

This project is licensed under the [O'Saasy License Agreement](https://osaasy.dev/).

**TL;DR**: You can use, modify, and distribute this project freely. You can self-host it for personal or commercial use. However, you cannot offer it as a competing hosted/managed SaaS product.

See [LICENSE.md](LICENSE.md) for full details.
