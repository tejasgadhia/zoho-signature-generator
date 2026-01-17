# Zoho Email Signature Generator

A professional email signature generator for Zoho employees. Create beautiful, email-compatible HTML signatures with live preview and multiple styles.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-Internal-green.svg)

## Features

- **4 Signature Styles**: Classic, Compact, Modern, and Minimal layouts
- **iOS-Style Toggle Switches**: Professional UI for including/excluding optional fields
- **Live Preview**: Real-time updates with light/dark mode toggle
- **Zoho Social Integration**: Include official Zoho social handles with granular control
- **One-Click Copy**: Copy HTML signature to clipboard
- **Import Instructions**: Step-by-step guides for Zoho Mail, Gmail, macOS Mail, iOS Mail, and Outlook
- **Zero Dependencies**: Pure vanilla HTML, CSS, and JavaScript
- **Email Compatible**: Table-based layouts with inline styles
- **Privacy-First**: All processing happens locally in your browser

## Quick Start

1. Open `index.html` in your web browser
2. Fill in your information (only Name is required)
3. Toggle optional fields on/off using the switches
4. Choose your preferred signature style
5. Click "Copy Signature" to copy the HTML
6. Click "How to Import?" for email client instructions

## Form Fields

- **Name** (required) - Your full name
- **Job Title** (optional) - Your position at Zoho
- **Department** (optional) - Your team or department
- **Email Address** (optional) - Your work email
- **Phone Number** (optional) - Your contact number
- **LinkedIn Profile** (optional) - Your LinkedIn URL
- **Twitter/X Handle** (optional) - Your Twitter/X handle
- **Company Website** (optional) - Defaults to zoho.com

## Signature Styles

### Classic
Traditional layout with logo on top. Clean and professional with vertical stacking.

### Compact
Minimal design with everything in one line. Perfect for email clients with limited space.

### Modern
Logo on the left with a vertical red line separator. Contemporary and eye-catching.

### Minimal
Clean text-only design without logo. Name appears in Zoho red for brand recognition.

## Zoho Social Media

- **Master Toggle**: Enable/disable all Zoho social handles
- **Individual Channels**: Toggle Twitter/X, LinkedIn, Facebook, Instagram separately
- **Display Options**: Choose between text links or icons

## Email Client Compatibility

Works with:
- Gmail (Web, iOS, Android)
- Apple Mail (macOS, iOS, iPadOS)
- Outlook (Windows, macOS, Web, iOS, Android)
- Zoho Mail
- Yahoo Mail
- ProtonMail
- Thunderbird

## Troubleshooting

**Signature not copying**
- Ensure JavaScript is enabled
- Try a modern browser (Chrome 90+, Firefox 88+, Safari 14+)
- Check clipboard permissions in browser settings

**Toggle switches not working**
- Verify JavaScript is enabled
- Check browser console (F12) for errors

**Preview not updating**
- Verify all form fields have proper values
- Check browser console for errors

**Signature looks different in email client**
- This is normal - email clients have varying CSS support
- Core layout and content will be preserved
- Test in your specific email client before using

**Social media links not appearing**
- Ensure the master toggle is checked
- Verify at least one social channel is selected

## Privacy & Security

- ✅ No server communication - all processing happens locally
- ✅ No data collection - zero tracking or cookies
- ✅ Theme preference stored in localStorage only

## Future Enhancements

- [ ] Save/load multiple signature profiles
- [ ] Export as image (PNG/JPG)
- [ ] QR code generation
- [ ] Bulk generation for teams (CSV import)
- [ ] Custom color scheme picker

## License

Internal tool for Zoho employees. Not for public distribution.

## Credits

- Design pattern inspired by Lovable prompt
- Zoho branding from official guidelines
- Toggle UI from iOS design patterns

---

**Version**: 0.1.0
**Release Date**: January 17, 2026
**Repository**: https://github.com/tejasgadhia/signature-generator
