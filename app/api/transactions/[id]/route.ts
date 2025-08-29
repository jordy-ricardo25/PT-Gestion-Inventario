const BASE = process.env.INTERNAL_TRANSACTIONS_API!;

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const r = await fetch(`${BASE}/Transaction/${params.id}`, { method: 'DELETE' });

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