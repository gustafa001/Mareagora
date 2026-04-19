# Guia de Implementação — Conteúdo MaréAgora para AdSense

## Resumo do Conteúdo Criado

### Artigos de Blog (pasta /artigos)
| Arquivo | Título | ~Palavras |
|---|---|---|
| como-ler-tabua-de-mares.md | Como Ler a Tábua de Marés: Guia Completo | ~1.200 |
| melhores-praias-surf-mares.md | Melhores Praias para Surf e Como a Maré Influencia as Ondas | ~1.100 |
| pesca-e-mares.md | Pesca e Marés: Como as Fases da Maré Influenciam a Pescaria | ~1.200 |
| o-que-causa-as-mares.md | O Que Causa as Marés? A Ciência Por Trás do Fenômeno | ~1.300 |
| piscinas-naturais-brasil.md | Piscinas Naturais do Brasil: Onde Encontrar e Quando Visitar | ~1.300 |
| mergulho-e-mares.md | Mergulho e Marés: Como Escolher o Melhor Momento | ~1.000 |

### Descrições de Portos (pasta /portos)
| Arquivo | Conteúdo | ~Palavras |
|---|---|---|
| descricoes-portos.md | 8 portos: Santos, Rio, Fortaleza, Salvador, Recife, Belém, Floripa, Vitória | ~1.800 |

### Páginas Institucionais (pasta /paginas)
| Arquivo | Conteúdo | ~Palavras |
|---|---|---|
| faq.md | 18 perguntas e respostas sobre marés | ~1.100 |
| sobre-e-privacidade.md | Página Sobre + Política de Privacidade completa (LGPD) | ~1.200 |

**Total: ~11.200 palavras de conteúdo original**

---

## Ordem de Prioridade Para Implementação

### Prioridade ALTA (implementar antes de pedir revisão)
1. **Política de Privacidade** — obrigatória pelo AdSense
2. **Página Sobre** — fundamental para credibilidade
3. **Como Ler a Tábua de Marés** — artigo âncora, explicativo, alto valor
4. **FAQ** — muito valorizado pelo Google como conteúdo útil
5. **Descrições dos Portos** — adiciona texto relevante às páginas já existentes

### Prioridade MÉDIA (publicar em sequência)
6. **O Que Causa as Marés** — conteúdo educativo aprofundado
7. **Piscinas Naturais do Brasil** — muito buscado, alto potencial de tráfego
8. **Pesca e Marés** — audiência específica e engajada

### Prioridade BAIXA (publicar para volume)
9. **Melhores Praias para Surf**
10. **Mergulho e Marés**

---

## Como Implementar no Next.js

### Opção A: Página estática por artigo
Crie uma rota `/blog/[slug]` e leia os Markdown com `gray-matter` + `remark`.

```
/app/blog/page.tsx          → listagem dos artigos
/app/blog/[slug]/page.tsx   → artigo individual
/content/blog/              → pasta com os .md
```

### Opção B: Hardcoded (mais rápido)
Se quiser publicar rápido, crie componentes React com o texto diretamente em JSX. Menos elegante, mas funciona.

### Descrições dos Portos
Integre as descrições ao componente de página do porto. Abaixo da tábua de marés, adicione uma seção "Sobre o Porto de [Nome]" com o texto correspondente.

### Páginas Institucionais
```
/app/sobre/page.tsx
/app/privacidade/page.tsx
/app/faq/page.tsx
```

---

## Checklist Antes de Pedir Revisão ao AdSense

- [ ] Política de Privacidade publicada e linkada no footer
- [ ] Página Sobre publicada
- [ ] Página de Contato com e-mail real
- [ ] Pelo menos 5 artigos publicados (mínimo 600 palavras cada)
- [ ] Descrições nos principais portos (Santos, Rio, Fortaleza, Salvador)
- [ ] FAQ publicado
- [ ] Navegação clara entre as seções (menu com Blog, Sobre, FAQ)
- [ ] Site mobile-friendly (já está, Next.js)
- [ ] Sem conteúdo duplicado de outros sites
- [ ] Conteúdo em português correto (sem erros grosseiros)
- [ ] Pelo menos 2-3 semanas de conteúdo novo publicado antes de pedir revisão

---

## Dicas Extras Para Aprovação

**Navegação:** adicione links no footer para Sobre, Privacidade, Contato e FAQ. O Google verifica se essas páginas existem e são acessíveis.

**Consistência:** publique os artigos espaçados (não tudo de uma vez). O Google valoriza sites que atualizam regularmente.

**Imagens:** adicione ao menos uma imagem relevante por artigo com alt text descritivo. Melhora SEO e aparência.

**Meta tags:** certifique-se que cada artigo tem meta description única e title tag descritivo.

**Sitemap:** gere um sitemap.xml com todas as URLs, incluindo os artigos. O Next.js tem suporte nativo para isso.

**Breadcrumb:** adicione breadcrumb de navegação nas páginas de artigo (Home > Blog > Título do Artigo). Melhora UX e SEO.
