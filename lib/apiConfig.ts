/**
 * Ponto único de configuração da URL base da API de marés.
 *
 * Em produção (Vercel), adicione a variável de ambiente:
 *   NEXT_PUBLIC_API_URL=https://mareagora-api.onrender.com
 *
 * Em dev local, cria .env.local com:
 *   NEXT_PUBLIC_API_URL=http://localhost:8000
 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://mareagora-api.onrender.com';
