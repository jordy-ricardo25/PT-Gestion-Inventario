import { NextRequest } from 'next/server';

const BASE = process.env.INTERNAL_TRANSACTIONS_API!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') ?? 1);
  const pageSize = Number(searchParams.get('pageSize') ?? 10);
  const sort = searchParams.get('sort') ?? '';
  const order = searchParams.get('order') ?? '';
  const q = searchParams.get('q') ?? '';

  const upstream = new URL(`${BASE}/Transaction`);
  upstream.searchParams.set('page', String(page));
  upstream.searchParams.set('pageSize', String(pageSize));
  if (sort) upstream.searchParams.set('sort', sort);
  if (order) upstream.searchParams.set('order', order);
  if (q) upstream.searchParams.set('q', q);

  const r = await fetch(upstream, { cache: 'no-store' });

  if (!r.ok) {
    const text = await r.text();
    return new Response(text || 'Error', { status: r.status });
  }

  const body = await r.json();

  if (body && body.items && body.total != null) {
    const normalized = {
      items: body.items,
      page: Number(body.page ?? page),
      pageSize: Number(body.pageSize ?? pageSize),
      total: Number(body.total ?? 0),
    };
    return Response.json(normalized);
  }

  const arr = Array.isArray(body) ? body : [];
  return Response.json({
    items: arr,
    page,
    pageSize,
    total: arr.length,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();

  const r = await fetch(`${BASE}/Transaction`, { method: 'POST', body, headers: { 'Content-Type': 'application/json' } });
  return new Response(await r.text(), { status: r.status, headers: { 'Content-Type': 'application/json' } });
}