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
 * - "https://www.linkedin.com/in/username/" → "username" (strips "in/" prefix)
 * - "username" → "username" (unchanged)
 * - "@username" → "username" (removes @)
 *
 * @param input - User input (username or full URL)
 * @param domain - Social media domain (e.g., 'x.com', 'linkedin.com')
 * @returns Sanitized username/path
 */
export function sanitizeSocialUrl(input: string, domain: string): string {
  if (!input) return '';

  let result = '';

  try {
    // Try to parse as URL
    const urlObj = new URL(input.startsWith('http') ? input : 'https://' + input);

    // Check if hostname matches the expected domain (with or without www.)
    const hostname = urlObj.hostname.replace(/^www\./, '');
    if (hostname === domain || hostname === 'www.' + domain) {
      // Extract the path (remove leading slash)
      result = urlObj.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
    }
  } catch {
    // Not a valid URL, treat as username/handle
  }

  // If we didn't extract from URL, clean up the raw input
  if (!result) {
    result = input
      .replace(/^https?:\/\//i, '')        // Remove protocol
      .replace(/^www\./i, '')               // Remove www.
      .replace(new RegExp(`^${domain}/?`, 'i'), '') // Remove domain
      .replace(/^\/+/, '')                  // Remove leading slashes
      .replace(/\/+$/, '')                  // Remove trailing slashes
      .replace(/^@/, '')                    // Remove @ prefix
      .replace(/\s+/g, '')                  // Remove all spaces
      .toLowerCase();                       // Convert to lowercase for consistency
  }

  // For LinkedIn: strip "in/" prefix to prevent /in/in/username duplication
  // The form-handler.ts will add the /in/ prefix when constructing the full URL
  if (domain === 'linkedin.com') {
    result = result.replace(/^in\//i, '');
  }

  return result;
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
 * Extract booking slug from Zoho Bookings URL
 * Handles various URL formats users might paste:
 * - "https://bookings.zohocorp.com/#/yourname" → "yourname"
 * - "https://zoho.com/bookings/yourname" → "yourname"
 * - "bookings.zohocorp.com/#/yourname" → "yourname"
 * - "yourname" → "yourname" (unchanged)
 *
 * @param input - User input (slug or full URL)
 * @returns Extracted booking slug
 */
export function extractBookingsSlug(input: string): string {
  if (!input) return '';

  const trimmed = input.trim();
  let slug = '';

  // Pattern 1: bookings.zohocorp.com/#/slug
  const hashPattern = /bookings\.zohocorp\.com\/#\/([^\/\?#]+)/i;
  const hashMatch = trimmed.match(hashPattern);
  if (hashMatch) {
    slug = hashMatch[1];
  }

  // Pattern 2: zoho.com/bookings/slug
  if (!slug) {
    const pathPattern = /zoho\.com\/bookings\/([^\/\?#]+)/i;
    const pathMatch = trimmed.match(pathPattern);
    if (pathMatch) {
      slug = pathMatch[1];
    }
  }

  // Pattern 3: Just the URL without protocol
  if (!slug) {
    const noProtocolHashPattern = /^bookings\.zohocorp\.com\/#\/([^\/\?#]+)/i;
    const noProtocolMatch = trimmed.match(noProtocolHashPattern);
    if (noProtocolMatch) {
      slug = noProtocolMatch[1];
    }
  }

  // Not a URL - clean up raw input
  if (!slug) {
    slug = trimmed
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .replace(/^bookings\.zohocorp\.com\/?#?\/?/i, '')
      .replace(/^zoho\.com\/bookings\/?/i, '')
      .replace(/[\/\?#].*/g, '');  // Remove anything after slug
  }

  // Sanitize the slug: lowercase, remove spaces, only allow letters/numbers/hyphens
  return slug
    .toLowerCase()
    .replace(/\s+/g, '-')           // Convert spaces to hyphens
    .replace(/[^a-z0-9-]/g, '')     // Remove invalid characters
    .replace(/-+/g, '-')            // Collapse multiple hyphens
    .replace(/^-|-$/g, '')          // Remove leading/trailing hyphens
    .trim();
}

/**
 * Generate tracked zoho.com URL with UTM parameters
 * Adds utm_source, utm_medium, and utm_campaign parameters for email signature tracking
 *
 * @param emailPrefix - Email prefix to use as campaign name
 * @returns Tracked URL with UTM parameters
 */
export function getTrackedWebsiteURL(emailPrefix: string): string {
  // Sanitize campaign name: only allow alphanumeric, dots, hyphens, underscores
  // This prevents URL injection attacks
  const sanitized = emailPrefix.trim().replace(/[^a-zA-Z0-9.\-_]/g, '') || 'zoho-employee';
  const baseURL = 'https://www.zoho.com';

  // Build UTM parameters
  const params = new URLSearchParams({
    utm_source: 'email-signature',
    utm_medium: 'signature',
    utm_campaign: sanitized
  });

  return `${baseURL}?${params.toString()}`;
}

/**
 * Sanitize URL to prevent XSS attacks
 * Blocks dangerous protocols (javascript:, data:, vbscript:, file:, etc.)
 *
 * @param url - URL to sanitize
 * @returns Sanitized URL, or empty string if dangerous
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  const trimmed = url.trim();

  // Block dangerous protocols
  const dangerousProtocols = /^(javascript|data|vbscript|file|about):/i;
  if (dangerousProtocols.test(trimmed)) {
    return '';
  }

  // Check for protocol-less dangerous URLs (e.g., "javascript:alert(1)" without colon)
  if (/^(javascript|data|vbscript|file|about)\s/i.test(trimmed)) {
    return '';
  }

  return trimmed;
}
