import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { portId: string } }
) {
  const { portId } = params;

  try {
    // portId é o nome do dataFile sem .json (ex: "46_-_porto_de_santos_-_148_-_150")
    const filePath = path.join(process.cwd(), 'data', `${portId}.json`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    return NextResponse.json(data, {
      headers: {
        // Cache de 24h no browser, 7 dias no CDN do Vercel
        'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=86400',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Porto não encontrado' },
      { status: 404 }
    );
  }
}
