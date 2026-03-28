import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { portId: string } }
) {
  const portId = params.portId;
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://mareagora-api.onrender.com';
    const response = await fetch(`${apiBaseUrl}/api/mare/${portId}?start_date=${date}&v=2`, {
      next: { revalidate: 3600 }, // Cache por 1 hora
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch from backend' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Tide Proxy Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
