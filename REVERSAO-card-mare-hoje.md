# Reverter o card “Maré Hoje” (páginas de cidade/porto)

Este pacote de mudanças afeta **apenas** os templates de cidade/porto:

- `/mare/[estado]/[cidade]` — `components/PortPageContent.tsx`
- `/mare-mundo/[pais]/[slug]` — `app/mare-mundo/[pais]/[slug]/page.tsx`

Mudanças: card novo “maré hoje”, tabela mensal logo abaixo dele, hero mais
compacto, ticker mais compacto e **remoção do botão de alerta push**.
As rotas `/tide/...`, a home, blog, estados, portos, widgets e operações
**não** foram alteradas visualmente.

Antes da mudança foi criada a tag `antes-card-mare-hoje` apontando para o
commit `e8083c8`, que é o estado do site imediatamente antes deste pacote.

Commits do pacote:

- `9432881` — card + tabela nas páginas do Brasil
- `eb48cfc` — mesmo layout em `/mare-mundo` + remoção do botão de alerta push

## Opção 1 — reverter só este pacote (recomendado)

```bash
git revert --no-commit eb48cfc 9432881
git commit -m "revert: volta layout antigo das páginas de cidade"
git push
```

Isso cria um commit novo desfazendo apenas as mudanças do pacote, sem perder
nenhum trabalho feito depois.

## Opção 2 — voltar tudo ao estado da tag (descarta mudanças posteriores)

```bash
git reset --hard antes-card-mare-hoje
git push --force-with-lease
```

Use apenas se nada depois deste pacote precisar ser mantido.

## Opção 3 — reverter sem tocar no histórico

```bash
git checkout antes-card-mare-hoje -- \
  components/PortPageContent.tsx \
  components/TideTodayCard.tsx \
  components/SummaryCards.tsx \
  components/SeoOverviewTicker.tsx \
  components/NotificationCTA.tsx \
  components/TideSchemaMarkup.tsx \
  "app/mare-mundo/[pais]/[slug]/page.tsx"
```

Depois é só revisar, commitar e publicar.

## Conferir o que a tag contém

```bash
git show --stat antes-card-mare-hoje
```
