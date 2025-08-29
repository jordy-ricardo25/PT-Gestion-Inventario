'use client';
import { useState } from 'react';

import { ProductTable } from '@lib/components/ProductTable';
import { ProductForm } from '@lib/components/ProductForm';
import { Product } from '@lib/types/Product';
import { DeleteProductDialog } from '@/lib/components/DeleteProductDialog';

export default function ProductsPage() {
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <main className="flex flex-col min-h-screen items-center justify-center">
      <header className="w-full max-w-6xl px-6">
        <div className="grid grid-cols-3 items-center">
          <button
            onClick={() => history.back()}
            className="justify-self-start rounded-xl border px-3 py-1.5 text-sm hover:bg-neutral-100"
          >
            ← Volver
          </button>

          <h1 className="justify-self-center text-2xl font-bold">Productos</h1>

          <button
            onClick={() => setCreating(true)}
            className="justify-self-end rounded-xl bg-black px-3 py-1.5 text-sm text-white hover:opacity-90"
          >
            + Agregar producto
          </button>
        </div>
      </header>

      <section className="w-full p-6">
        <div className="rounded-2xl border bg-white p-4">
          <ProductTable onEdit={setEditing} onDelete={setDeleting} />
        </div>
      </section>

      {(creating || editing) && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl border bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {editing ? 'Editar producto' : 'Crear producto'}
              </h2>
              <button
                onClick={() => {
                  setCreating(false);
                  setEditing(null);
                }}
                className="rounded-md px-2 py-1 text-sm hover:bg-neutral-100"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <ProductForm
              product={editing ?? undefined}
              onDone={() => {
                setCreating(false);
                setEditing(null);
              }}
            />
          </div>
        </div>
      )}

      {deleting && (
        <DeleteProductDialog product={deleting} onClose={() => setDeleting(null)} />
      )}
    </main>
  );
}
