/**
 * VAPID configuration for Web Push
 * Add these to your .env.local and Vercel environment variables:
 *
 * VAPID_PUBLIC_KEY=BIEIsoBEg4UubQNr2jyhdoUATIQFhZ_gIukjnkw85uGvLB-svLQXjaNSi-fdN9IqgNI1NTZI1kwAbvnQiTo0aGU
 * VAPID_PRIVATE_KEY=PdSc19BzGabMTBiRRLu6MFqo52iW0XCo84nusV0U-lM
 * VAPID_EMAIL=mailto:contato@mareagora.com.br
 * NEXT_PUBLIC_VAPID_PUBLIC_KEY=BIEIsoBEg4UubQNr2jyhdoUATIQFhZ_gIukjnkw85uGvLB-svLQXjaNSi-fdN9IqgNI1NTZI1kwAbvnQiTo0aGU
 */

export const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  'BIEIsoBEg4UubQNr2jyhdoUATIQFhZ_gIukjnkw85uGvLB-svLQXjaNSi-fdN9IqgNI1NTZI1kwAbvnQiTo0aGU';

export const VAPID_PRIVATE_KEY =
  process.env.VAPID_PRIVATE_KEY || 'PdSc19BzGabMTBiRRLu6MFqo52iW0XCo84nusV0U-lM';

export const VAPID_EMAIL =
  process.env.VAPID_EMAIL || 'mailto:contato@mareagora.com.br';
