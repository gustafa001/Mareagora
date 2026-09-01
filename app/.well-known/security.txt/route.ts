// app/.well-known/security.txt/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  const body = `Contact: mailto:security@mareagora.com.br
Expires: ${expires.toISOString()}
Preferred-Languages: pt-BR, en
Canonical: https://mareagora.com.br/.well-known/security.txt
`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
