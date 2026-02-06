/**
 * Dark Mode Component
 * Generates CSS style blocks for dark mode email signatures
 */

/**
 * Generate dark mode CSS style block
 * @param isPreview - If true, only use .dark-mode class (ignore system preference)
 * @returns <style> block with dark mode overrides
 */
export function getDarkModeStyles(isPreview: boolean = false): string {
  if (isPreview) {
    // Preview mode: ONLY respond to .dark-mode class, ignore system preference
    return `
<style>
.dark-mode .sig-name { color: #FFFFFF !important; }
.dark-mode .sig-title { color: #E0E0E0 !important; }
.dark-mode .sig-separator { color: #666666 !important; }
.dark-mode .sig-social-label { color: #B0B0B0 !important; }
.dark-mode .sig-logo-light { display: none !important; }
.dark-mode .sig-logo-dark { display: inline-block !important; }
.sig-logo-dark { display: none; }
</style>`.trim();
  } else {
    // Copy mode: Include media query for email clients
    return `
<style>
@media (prefers-color-scheme: dark) {
.sig-name { color: #FFFFFF !important; }
.sig-title { color: #E0E0E0 !important; }
.sig-separator { color: #666666 !important; }
.sig-social-label { color: #B0B0B0 !important; }
.sig-logo-light { display: none !important; }
.sig-logo-dark { display: inline-block !important; }
}
.dark-mode .sig-name { color: #FFFFFF !important; }
.dark-mode .sig-title { color: #E0E0E0 !important; }
.dark-mode .sig-separator { color: #666666 !important; }
.dark-mode .sig-social-label { color: #B0B0B0 !important; }
.dark-mode .sig-logo-light { display: none !important; }
.dark-mode .sig-logo-dark { display: inline-block !important; }
.sig-logo-dark { display: none; }
</style>`.trim();
  }
}
