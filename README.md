# MaréAgora — Tábuas de Maré

**Site:** [https://mareagora.com.br](https://mareagora.com.br) · **Blog:** [https://mareagora.com.br/blog](https://mareagora.com.br/blog)

Previsões de maré, ondas, lua e condições do mar para praias, portos e estados do Brasil e do mundo — com tábua de marés, guias de praias, detectoristas, operações portuárias e mapa-múndi das marés. Gratuito e sem cadastro.

Feito com [Next.js](https://nextjs.org), [NEAPS](https://neaps.dev) e [Radix UI](https://www.radix-ui.com).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## SEO & Indexação

### Sitemaps
- `/sitemap/index.xml` — hub central
- `/sitemap/praias.xml` — 95+ praias brasileiras
- `/sitemap/guia-praias.xml` — guias detalhados
- `/sitemap/estados.xml` — páginas de estados
- `/sitemap/blog.xml` — artigos do blog
- `/sitemap/portos.xml` — portos industriais

### Internacionalização
- Rotas `/mare-mundo/**` e `/tide/**` com `robots: { index: false, follow: true }` (exceto `/tide/fishing-guide` que indexa para EN)
- Hreflang entre `/pesca` (PT) e `/tide/fishing-guide` (EN)

### AdSense
- Condicionado pela env var `NEXT_PUBLIC_ADSENSE_ENABLED` (default off)
- `.env.example` documenta todas as variáveis

### Widget Incorporável
- `/widget` — instruções de embed com snippets iframe
- `/widget/porto/[porto]` — card leve de maré, noindex, ISR 30min, sem scripts de terceiros
- `/widget/:path*` excluído de X-Frame-Options no `next.config.mjs`

### API de Revalidação
- `POST /api/revalidate` com Bearer token — revalida 8 páginas-piloto
- Sem cron GitHub Actions (ISR cuida da atualização periódica)

### Scripts de Análise
- `scripts/gsc-top-queries.ts` — exporta top queries do GSC (CSV + MD)
- `scripts/gsc-digest.ts` — digest semanal: compara queries 7d vs 28d, alertas de CTR e posições

### Outreach
- `outreach/guaruja-prospectos.csv` — 20 empresas (escolas de surf, pousadas, marinas, restaurantes)
- `outreach/email-template.md` — 5 templates segmentados por tipo de negócio

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.   
