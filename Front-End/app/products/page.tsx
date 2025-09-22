'use client';
import { useState } from 'react';

import { ProductTable } from '@lib/components/ProductTable';
import { ProductForm } from '@lib/components/ProductForm';
import { Product } from '@lib/types/Product';
import { ProductDelete } from '@/lib/components/ProductDelete';
import { Dialog } from '@/lib/components/Dialog';
import { ProductFilter } from '@/lib/components/ProductFilter';

export default function ProductsPage() {
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [filtering, setFiltering] = useState(false);

  const [filters, setFilters] = useState<any | null>(null);

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
          <ProductTable
            filters={filters}
            onEdit={setEditing}
            onDelete={setDeleting}
            onFilter={() => setFiltering(true)}
          />
        </div>
      </section>

      {(creating || editing) && (
        <Dialog
          title={editing ? "Editar producto" : "Crear producto"}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          content={(
            <ProductForm
              product={editing ?? undefined}
              onDone={() => {
                setCreating(false);
                setEditing(null);
              }}
            />
          )} />
      )}

      {deleting && (
        <Dialog
          title="Eliminar producto"
          content={(
            <ProductDelete product={deleting} onClose={() => { setDeleting(null) }} />
          )}
        />
      )}

      {filtering && (
        <Dialog
          title="Filtrar productos"
          onClose={() => { setFiltering(false) }}
          content={(
            <ProductFilter
              filters={filters}
              onClose={(f) => {
                if (f) setFilters(f);
                else setFilters(null);

                setFiltering(false);
              }}
            />
          )}
        />
      )}
    </main>
  );
}
