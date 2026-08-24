import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const VALID_PORT_ID = /^\d{4,6}$/;

export async function GET(
  request: Request,
  { params }: { params: { portId: string } }
) {
  const { portId } = params;

  if (!VALID_PORT_ID.test(portId)) {
    return NextResponse.json(
      { error: 'ID de porto inválido' },
      { status: 400 }
    );
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'mare', `${portId}.json`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=86400',
        'Content-Type': 'application/json',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Porto não encontrado' },
      { status: 404 }
    );
  }
}
