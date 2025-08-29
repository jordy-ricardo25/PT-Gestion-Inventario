'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { CategoryTable } from '@lib/components/CategoryTable';
import { Category } from '@lib/types/Category';

import { CategoryForm } from '@lib/components/CategoryForm';
import { DeleteCategoryDialog } from '@lib/components/DeleteCategoryDialog';

export default function CategoriesPage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Category | null>(null);

  return (
    <main className="flex flex-col min-h-screen items-center justify-center">
      <header className="w-full max-w-6xl px-6">
        <div className="grid grid-cols-3 items-center">
          <button
            onClick={() => router.back()}
            className="justify-self-start rounded-xl border px-3 py-1.5 text-sm hover:bg-neutral-100"
          >
            ← Volver
          </button>

          <h1 className="justify-self-center text-2xl font-bold">Categorías</h1>

          <button
            onClick={() => setCreating(true)}
            className="justify-self-end rounded-xl bg-black px-3 py-1.5 text-sm text-white hover:opacity-90"
          >
            + Agregar categoría
          </button>
        </div>
      </header>

      <section className="w-full p-6">
        <div className="rounded-2xl border bg-white p-4">
          <CategoryTable onDelete={setDeleting} />
        </div>
      </section>

      {(creating) && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl border bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Crear categoría
              </h2>
              <button
                onClick={() => {
                  setCreating(false);
                }}
                className="rounded-md px-2 py-1 text-sm hover:bg-neutral-100"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <CategoryForm
              onDone={() => {
                setCreating(false);
              }}
            />
          </div>
        </div>
      )}

      {deleting && (
        <DeleteCategoryDialog
          category={deleting}
          onClose={() => setDeleting(null)}
        />
      )}
    </main>
  );
}
