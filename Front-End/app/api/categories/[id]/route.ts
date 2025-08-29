import { NextRequest } from 'next/server';

const BASE = process.env.INTERNAL_PRODUCTS_API!;

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const r = await fetch(`${BASE}/Category/${params.id}`, { cache: 'no-store' });
  return new Response(await r.text(), { status: r.status, headers: { 'Content-Type': 'application/json' } });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const r = await fetch(`${BASE}/Category/${params.id}`, { method: 'DELETE' });

  if (r.status === 204) {
    return new Response(null, { status: 204 });
  }

  const contentType = r.headers.get('Content-Type') ?? undefined;
  const body = await r.text();
  return new Response(body, {
    status: r.status,
    headers: contentType ? { 'Content-Type': contentType } : undefined,
  });
}