/**
 * Armazenamento das inscrições de push.
 *
 * Produção: Supabase (tabela `push_subscriptions`, veja
 * scripts/sql/push_subscriptions.sql), acessado pela API REST com a service
 * role key — somente no servidor. Ativa quando SUPABASE_URL e
 * SUPABASE_SERVICE_ROLE_KEY existem.
 *
 * Desenvolvimento local: sem essas variáveis, cai para um arquivo JSON em
 * .data/. Esse arquivo NÃO persiste no Vercel (disco efêmero/somente leitura),
 * por isso em produção o Supabase é obrigatório.
 */

import { promises as fs } from 'fs';
import path from 'path';

export interface PushSubscriptionRecord {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  portSlug: string;
  createdAt: string;
  /** Última maré avisada a esta inscrição (evita notificar duas vezes). */
  lastNotifiedKey?: string | null;
}

// ───────────────────────── Supabase (REST) ─────────────────────────

const TABLE = 'push_subscriptions';
const PAGE_SIZE = 1000;

function supabaseConfig(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
}

interface Row {
  endpoint: string;
  p256dh: string;
  auth: string;
  port_slug: string;
  created_at: string;
  last_notified_key: string | null;
}

function fromRow(r: Row): PushSubscriptionRecord {
  return {
    endpoint: r.endpoint,
    keys: { p256dh: r.p256dh, auth: r.auth },
    portSlug: r.port_slug,
    createdAt: r.created_at,
    lastNotifiedKey: r.last_notified_key,
  };
}

async function sb(
  cfg: { url: string; key: string },
  query: string,
  init: RequestInit & { headers?: Record<string, string> } = {},
): Promise<Response> {
  const res = await fetch(`${cfg.url}/rest/v1/${TABLE}${query}`, {
    ...init,
    cache: 'no-store',
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`[pushStorage] Supabase ${res.status}: ${await res.text()}`);
  }
  return res;
}

async function sbList(cfg: { url: string; key: string }, filter = ''): Promise<PushSubscriptionRecord[]> {
  const out: PushSubscriptionRecord[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const res = await sb(cfg, `?select=*${filter}&order=created_at.asc`, {
      headers: { Range: `${from}-${from + PAGE_SIZE - 1}` },
    });
    const rows = (await res.json()) as Row[];
    out.push(...rows.map(fromRow));
    if (rows.length < PAGE_SIZE) return out;
  }
}

// ───────────────────────── Arquivo local (dev) ─────────────────────────

const STORAGE_DIR = path.join(process.cwd(), '.data');
const STORAGE_FILE = path.join(STORAGE_DIR, 'push-subs.json');

async function readAll(): Promise<PushSubscriptionRecord[]> {
  try {
    const raw = await fs.readFile(STORAGE_FILE, 'utf-8');
    return JSON.parse(raw) as PushSubscriptionRecord[];
  } catch {
    return [];
  }
}

async function writeAll(records: PushSubscriptionRecord[]): Promise<void> {
  await fs.mkdir(STORAGE_DIR, { recursive: true });
  await fs.writeFile(STORAGE_FILE, JSON.stringify(records, null, 2), 'utf-8');
}

// Ler-modificar-gravar no arquivo precisa ser serializado: o /api/push/notify
// envia em paralelo, e duas gravações simultâneas se sobrescreveriam.
let fileQueue: Promise<unknown> = Promise.resolve();
function withFileLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = fileQueue.then(fn, fn);
  fileQueue = run.catch(() => undefined);
  return run;
}

// ───────────────────────── API pública ─────────────────────────

export async function addSubscription(record: PushSubscriptionRecord): Promise<void> {
  const cfg = supabaseConfig();
  if (cfg) {
    await sb(cfg, '?on_conflict=endpoint', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({
        endpoint: record.endpoint,
        p256dh: record.keys.p256dh,
        auth: record.keys.auth,
        port_slug: record.portSlug,
        created_at: record.createdAt,
        // reinscrição (ex.: troca de porto) zera o histórico de avisos
        last_notified_key: null,
      }),
    });
    return;
  }

  await withFileLock(async () => {
    const all = await readAll();
    const filtered = all.filter((r) => r.endpoint !== record.endpoint);
    filtered.push({ ...record, lastNotifiedKey: null });
    await writeAll(filtered);
  });
}

export async function removeSubscription(endpoint: string): Promise<void> {
  const cfg = supabaseConfig();
  if (cfg) {
    await sb(cfg, `?endpoint=eq.${encodeURIComponent(endpoint)}`, {
      method: 'DELETE',
      headers: { Prefer: 'return=minimal' },
    });
    return;
  }

  await withFileLock(async () => {
    const all = await readAll();
    await writeAll(all.filter((r) => r.endpoint !== endpoint));
  });
}

export async function getSubscriptionsByPort(portSlug: string): Promise<PushSubscriptionRecord[]> {
  const cfg = supabaseConfig();
  if (cfg) return sbList(cfg, `&port_slug=eq.${encodeURIComponent(portSlug)}`);

  const all = await readAll();
  return all.filter((r) => r.portSlug === portSlug);
}

export async function getAllSubscriptions(): Promise<PushSubscriptionRecord[]> {
  const cfg = supabaseConfig();
  if (cfg) return sbList(cfg);
  return readAll();
}

/** Registra qual maré já foi avisada a esta inscrição. */
export async function markNotified(endpoint: string, key: string): Promise<void> {
  const cfg = supabaseConfig();
  if (cfg) {
    await sb(cfg, `?endpoint=eq.${encodeURIComponent(endpoint)}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ last_notified_key: key }),
    });
    return;
  }

  await withFileLock(async () => {
    const all = await readAll();
    await writeAll(all.map((r) => (r.endpoint === endpoint ? { ...r, lastNotifiedKey: key } : r)));
  });
}
