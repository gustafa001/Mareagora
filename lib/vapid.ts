/**
 * VAPID configuration for Web Push
 *
 * Exige as variáveis de ambiente NEXT_PUBLIC_VAPID_PUBLIC_KEY (ou VAPID_PUBLIC_KEY)
 * e VAPID_PRIVATE_KEY. Os valores são resolvidos sob demanda (em runtime), e não no
 * import do módulo — assim o build da Vercel não quebra se a variável não existir
 * no momento da compilação. O erro só aparece se o endpoint de push for chamado sem
 * a configuração correta.
 */

function requireEnv(name: string, fallbackName?: string): string {
  const value = process.env[name] || (fallbackName ? process.env[fallbackName] : undefined);
  if (!value) {
    throw new Error(`[VAPID] Missing required environment variable: ${name}${fallbackName ? ` or ${fallbackName}` : ''}`);
  }
  return value;
}

export function getVapidPublicKey(): string {
  return requireEnv('NEXT_PUBLIC_VAPID_PUBLIC_KEY', 'VAPID_PUBLIC_KEY');
}

export function getVapidPrivateKey(): string {
  return requireEnv('VAPID_PRIVATE_KEY');
}

export const VAPID_EMAIL =
  process.env.VAPID_EMAIL || 'mailto:contato@mareagora.com.br';
