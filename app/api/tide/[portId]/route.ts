import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { portId: string } }
) {
  const { portId } = params;

  try {
    // portId é o dhnId do porto (ex: "50228" para Porto de Santos)
    const filePath = path.join(process.cwd(), 'data', 'mare', `${portId}.json`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    return NextResponse.json(data, {
      headers: {
        // Cache de 24h no browser, 7 dias no CDN do Vercel
        'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=86400',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(`Erro ao carregar dados da maré para portId ${portId}:`, error);
    return NextResponse.json(
      { error: 'Porto não encontrado', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 404 }
    );
  }
}
