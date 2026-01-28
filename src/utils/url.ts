/**
 * URL Manipulation Utilities
 * Pure URL transformation and sanitization functions
 */

/**
 * Normalize URL by adding https:// if missing
 * @param url - URL to normalize
 * @returns Normalized URL with protocol
 */
export function normalizeUrl(url: string): string {
  if (!url.match(/^https?:\/\//)) {
    return 'https://' + url.replace(/^\/+/, '');
  }
  return url;
}

/**
 * Sanitize social media URL by extracting username/handle
 * Prevents double URL bug when users paste full URLs
 *
 * Examples:
 * - "https://x.com/username" → "username"
 * - "https://www.linkedin.com/in/username/" → "in/username"
 * - "username" → "username" (unchanged)
 * - "@username" → "username" (removes @)
 *
 * @param input - User input (username or full URL)
 * @param domain - Social media domain (e.g., 'x.com', 'linkedin.com')
 * @returns Sanitized username/path
 */
export function sanitizeSocialUrl(input: string, domain: string): string {
  if (!input) return '';

  try {
    // Try to parse as URL
    const urlObj = new URL(input.startsWith('http') ? input : 'https://' + input);

    // Check if hostname matches the expected domain (with or without www.)
    const hostname = urlObj.hostname.replace(/^www\./, '');
    if (hostname === domain || hostname === 'www.' + domain) {
      // Extract the path (remove leading slash)
      return urlObj.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
    }
  } catch {
    // Not a valid URL, treat as username/handle
  }

  // Remove any remaining URL artifacts (protocol, www., domain)
  return input
    .replace(/^https?:\/\//i, '')        // Remove protocol
    .replace(/^www\./i, '')               // Remove www.
    .replace(new RegExp(`^${domain}/?`, 'i'), '') // Remove domain
    .replace(/^\/+/, '')                  // Remove leading slashes
    .replace(/\/+$/, '')                  // Remove trailing slashes
    .replace(/^@/, '')                    // Remove @ prefix
    .replace(/\s+/g, '')                  // Remove all spaces
    .toLowerCase();                       // Convert to lowercase for consistency
}

/**
 * Clean LinkedIn URL by removing tracking parameters
 * Converts https://linkedin.com/in/username?tracking=xyz to https://linkedin.com/in/username
 *
 * @param url - LinkedIn URL to clean
 * @returns Cleaned URL without tracking parameters
 */
export function cleanLinkedInUrl(url: string): string {
  try {
    const urlObj = new URL(normalizeUrl(url));
    if (urlObj.hostname.includes('linkedin.com')) {
      // Keep only the pathname, remove query parameters
      return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`.replace(/\/$/, '');
    }
    return url;
  } catch {
    return url;
  }
}

/**
 * Generate tracked zoho.com URL with UTM parameters
 * Adds utm_source, utm_medium, and utm_campaign parameters for email signature tracking
 *
 * @param emailPrefix - Email prefix to use as campaign name
 * @returns Tracked URL with UTM parameters
 */
export function getTrackedWebsiteURL(emailPrefix: string): string {
  const cleanPrefix = emailPrefix.trim() || 'zoho-employee';
  const baseURL = 'https://www.zoho.com';

  // Build UTM parameters
  const params = new URLSearchParams({
    utm_source: 'email-signature',
    utm_medium: 'signature',
    utm_campaign: cleanPrefix
  });

  return `${baseURL}?${params.toString()}`;
}
