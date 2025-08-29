import { NextRequest } from 'next/server';

const BASE = process.env.INTERNAL_PRODUCTS_API!;

export async function GET() {
  const r = await fetch(`${BASE}/Category`, { cache: 'no-store' });
  return new Response(await r.text(), { status: r.status, headers: { 'Content-Type': r.headers.get('Content-Type') || 'application/json' } });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const r = await fetch(`${BASE}/Category`, { method: 'POST', body, headers: { 'Content-Type': 'application/json' } });
  return new Response(await r.text(), { status: r.status, headers: { 'Content-Type': 'application/json' } });
}