import { NextRequest } from 'next/server';

const BASE = process.env.INTERNAL_PRODUCTS_API!;

export async function POST(req: NextRequest) {
  const r = await fetch(`${BASE}/stock/adjust`, { method: 'POST', body: await req.text(), headers: { 'Content-Type': 'application/json' } });
  return new Response(await r.text(), { status: r.status, headers: { 'Content-Type': 'application/json' } });
}