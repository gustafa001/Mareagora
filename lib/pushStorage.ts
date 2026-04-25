/**
 * Push subscription storage using /tmp (MVP — data lost on cold start)
 * Each entry: { endpoint, keys, portSlug }
 */

import { promises as fs } from 'fs';
import path from 'path';

const STORAGE_FILE = path.join('/tmp', 'mareagora-push-subs.json');

export interface PushSubscriptionRecord {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  portSlug: string;
  createdAt: string;
}

async function readAll(): Promise<PushSubscriptionRecord[]> {
  try {
    const raw = await fs.readFile(STORAGE_FILE, 'utf-8');
    return JSON.parse(raw) as PushSubscriptionRecord[];
  } catch {
    return [];
  }
}

async function writeAll(records: PushSubscriptionRecord[]): Promise<void> {
  await fs.writeFile(STORAGE_FILE, JSON.stringify(records, null, 2), 'utf-8');
}

export async function addSubscription(record: PushSubscriptionRecord): Promise<void> {
  const all = await readAll();
  // Remove duplicates by endpoint
  const filtered = all.filter((r) => r.endpoint !== record.endpoint);
  filtered.push(record);
  await writeAll(filtered);
}

export async function removeSubscription(endpoint: string): Promise<void> {
  const all = await readAll();
  await writeAll(all.filter((r) => r.endpoint !== endpoint));
}

export async function getSubscriptionsByPort(portSlug: string): Promise<PushSubscriptionRecord[]> {
  const all = await readAll();
  return all.filter((r) => r.portSlug === portSlug);
}

export async function getAllSubscriptions(): Promise<PushSubscriptionRecord[]> {
  return readAll();
}
