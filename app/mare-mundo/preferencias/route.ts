import { NextResponse } from 'next/server';
import type { GlobalPreferences } from '@/lib/globalPreferences';

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<GlobalPreferences>;
  const response = NextResponse.json({ ok: true });

  response.cookies.set('maremundo_prefs', JSON.stringify(body), {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });

  return response;
}
