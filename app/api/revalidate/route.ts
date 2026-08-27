import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const TOKEN = process.env.REVALIDATE_TOKEN;

const DEFAULT_PATHS = [
  '/',
  '/mare-hoje',
  '/mare/para/porto-de-belem',
  '/mare/sao-paulo/porto-de-santos',
  '/mare/sao-paulo/ubatuba',
  '/mare/rio-de-janeiro/buzios',
  '/mare/santa-catarina/porto-de-florianopolis',
  '/mare/bahia/porto-de-salvador',
];

/**
 * POST /api/revalidate
 * Body: { paths?: string[] }  — se omitido, usa DEFAULT_PATHS
 * Header: Authorization: Bearer <REVALIDATE_TOKEN>
 *
 * Revalida páginas específicas via on-demand ISR.
 * Protegido por Bearer token.
 */
export async function POST(req: NextRequest) {
  if (!TOKEN) {
    return NextResponse.json(
      { error: 'REVALIDATE_TOKEN not configured' },
      { status: 500 },
    );
  }

  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let paths = DEFAULT_PATHS;
  try {
    const body = await req.json();
    if (Array.isArray(body.paths) && body.paths.length > 0) {
      paths = body.paths;
    }
  } catch {
    // body vazio ou inválido — usa DEFAULT_PATHS
  }

  const revalidated: string[] = [];
  const errors: { path: string; error: string }[] = [];

  for (const path of paths) {
    try {
      revalidatePath(path);
      revalidated.push(path);
    } catch (e) {
      errors.push({ path, error: String(e) });
    }
  }

  return NextResponse.json({
    revalidated,
    errors: errors.length > 0 ? errors : undefined,
    timestamp: new Date().toISOString(),
  });
}

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Use POST with Bearer token' });
}
