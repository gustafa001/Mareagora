/**
 * VAPID configuration for Web Push
 * Requires NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in environment variables.
 */

function requireEnv(name: string, fallbackName?: string): string {
  const value = process.env[name] || (fallbackName ? process.env[fallbackName] : undefined);
  if (!value) {
    throw new Error(`[VAPID] Missing required environment variable: ${name}${fallbackName ? ` or ${fallbackName}` : ''}`);
  }
  return value;
}

export const VAPID_PUBLIC_KEY = requireEnv('NEXT_PUBLIC_VAPID_PUBLIC_KEY', 'VAPID_PUBLIC_KEY');

export const VAPID_PRIVATE_KEY = requireEnv('VAPID_PRIVATE_KEY');

export const VAPID_EMAIL =
  process.env.VAPID_EMAIL || 'mailto:contato@mareagora.com.br';

