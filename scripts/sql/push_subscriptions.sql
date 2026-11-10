-- Inscrições de Web Push do MaréAgora.
-- Rode uma vez no SQL Editor do Supabase.

create table if not exists public.push_subscriptions (
  endpoint          text primary key,
  p256dh            text not null,
  auth              text not null,
  port_slug         text not null,
  created_at        timestamptz not null default now(),
  last_notified_key text
);

create index if not exists push_subscriptions_port_slug_idx
  on public.push_subscriptions (port_slug);

-- RLS ligado e SEM políticas: a chave anon não lê nem escreve nada (endpoint e
-- chaves de criptografia são sensíveis). Só a service role key, usada apenas
-- no servidor, acessa a tabela.
alter table public.push_subscriptions enable row level security;
