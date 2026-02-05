/**
 * Encrypted localStorage Wrapper
 * Provides encryption layer for sensitive data in localStorage
 * Uses Web Crypto API (AES-GCM 256-bit)
 *
 * @deprecated As of v3.4.0, this module is no longer used by the application.
 * localStorage preferences (accent color, social order, format locks) are now
 * stored as validated plaintext — encryption was causing data loss because
 * ephemeral keys couldn't survive page reloads. Kept for potential future use
 * if truly sensitive data (PII, tokens) needs encrypted client-side storage.
 */

import { encryptData, decryptData, isCryptoAvailable } from './crypto';
import { signAndEncrypt, decryptAndVerify, isHmacAvailable } from './tamper-detection';

/**
 * Save encrypted data to localStorage
 * @param key - Storage key
 * @param value - Data to encrypt and store
 */
export async function setEncrypted(key: string, value: string): Promise<void> {
  if (!isCryptoAvailable()) {
    console.warn('Crypto API unavailable, storing unencrypted');
    localStorage.setItem(key, value);
    return;
  }

  try {
    const encrypted = await encryptData(value);
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.error('Encryption failed, storing unencrypted:', error);
    localStorage.setItem(key, value);
  }
}

/**
 * Get and decrypt data from localStorage
 * @param key - Storage key
 * @returns Decrypted value or null if not found
 */
export async function getEncrypted(key: string): Promise<string | null> {
  const stored = localStorage.getItem(key);
  if (!stored) return null;

  if (!isCryptoAvailable()) {
    return stored;
  }

  try {
    return await decryptData(stored);
  } catch (error) {
    console.error('Decryption failed, returning raw value:', error);
    return stored;
  }
}

/**
 * Save encrypted JSON object to localStorage
 * @param key - Storage key
 * @param data - Object to encrypt and store
 */
export async function setEncryptedJSON<T>(key: string, data: T): Promise<void> {
  const json = JSON.stringify(data);
  await setEncrypted(key, json);
}

/**
 * Get and decrypt JSON object from localStorage
 * @param key - Storage key
 * @returns Decrypted object or null if not found
 */
export async function getEncryptedJSON<T>(key: string): Promise<T | null> {
  const json = await getEncrypted(key);
  if (!json) return null;

  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/**
 * Save encrypted and signed data to localStorage (with tamper detection)
 * @param key - Storage key
 * @param value - Data to sign, encrypt, and store
 */
export async function setEncryptedSigned(key: string, value: string): Promise<void> {
  if (!isCryptoAvailable() || !isHmacAvailable()) {
    console.warn('Crypto/HMAC API unavailable, storing unencrypted');
    localStorage.setItem(key, value);
    return;
  }

  try {
    const encrypted = await signAndEncrypt(value, encryptData);
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.error('Sign and encrypt failed, storing unencrypted:', error);
    localStorage.setItem(key, value);
  }
}

/**
 * Get, decrypt, and verify data from localStorage (with tamper detection)
 * @param key - Storage key
 * @returns Verified decrypted value, null if not found or tampered
 */
export async function getEncryptedVerified(key: string): Promise<string | null> {
  const stored = localStorage.getItem(key);
  if (!stored) return null;

  if (!isCryptoAvailable() || !isHmacAvailable()) {
    return stored;
  }

  try {
    const decrypted = await decryptAndVerify(stored, decryptData);
    if (decrypted === null) {
      // Tampering detected - clear corrupted data
      console.warn(`Tampered data detected for key: ${key}, clearing...`);
      localStorage.removeItem(key);
      return null;
    }
    return decrypted;
  } catch (error) {
    console.error('Decrypt and verify failed, returning raw value:', error);
    return stored;
  }
}

/**
 * Save encrypted and signed JSON object to localStorage
 * @param key - Storage key
 * @param data - Object to sign, encrypt, and store
 */
export async function setEncryptedSignedJSON<T>(key: string, data: T): Promise<void> {
  const json = JSON.stringify(data);
  await setEncryptedSigned(key, json);
}

/**
 * Get, decrypt, verify, and parse JSON object from localStorage
 * @param key - Storage key
 * @returns Verified decrypted object or null if not found/tampered
 */
export async function getEncryptedVerifiedJSON<T>(key: string): Promise<T | null> {
  const json = await getEncryptedVerified(key);
  if (!json) return null;

  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/**
 * SECURITY NOTE:
 * Currently, only non-sensitive data is stored in localStorage:
 * - Accent color preference (not sensitive)
 * - Social channel order (not sensitive)
 * - Format lock states (not sensitive)
 * - Schema version (not sensitive)
 *
 * FormData (name, email, phone, linkedin) is transient and NOT persisted.
 * This is intentional for privacy - no PII in localStorage.
 *
 * If future features require persisting sensitive data, use these
 * encrypted storage functions instead of direct localStorage access.
 */
