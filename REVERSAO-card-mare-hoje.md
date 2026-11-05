# Reverter o card “Maré Hoje” (páginas de cidade/porto)

Este pacote de mudanças afeta **apenas** o template `/mare/[estado]/[cidade]`
(`components/PortPageContent.tsx`): card novo “maré hoje”, tabela mensal logo
abaixo dele, hero mais compacto e ticker mais compacto.

Antes da mudança foi criada a tag `antes-card-mare-hoje` apontando para o
commit `e8083c8`, que é o estado do site imediatamente antes deste pacote.

## Opção 1 — reverter só este commit (recomendado)

```bash
git revert <hash-do-commit-do-card>
git push
```

Isso cria um commit novo desfazendo apenas as mudanças do card, sem perder
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
  components/TideSchemaMarkup.tsx
```

Depois é só revisar, commitar e publicar.

## Conferir o que a tag contém

```bash
git show --stat antes-card-mare-hoje
```
