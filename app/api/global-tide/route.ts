export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getGlobalTideData } from '@/lib/globalTide';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || ''); 
  const lon = parseFloat(searchParams.get('lon') || '');
  const days = parseInt(searchParams.get('days') || '7', 10);

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return NextResponse.json({ error: 'Parâmetros lat/lon inválidos ou ausentes' }, { status: 400 });
  }

  const data = await getGlobalTideData(lat, lon, days);

  if (!data) {
    return NextResponse.json({ error: 'Não foi possível calcular a maré para essas coordenadas' }, { status: 502 });
  }

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
      'Content-Type': 'application/json',
    },
  });
}
