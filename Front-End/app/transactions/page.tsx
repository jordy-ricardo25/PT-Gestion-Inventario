'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { TransactionTable } from '@lib/components/TransactionTable';
import { Transaction } from '@lib/types/Transaction';

import { TransactionForm } from '@lib/components/TransactionForm';
import { TransactionDelete } from '@/lib/components/TransactionDelete';
import { Dialog } from '@/lib/components/Dialog';
import { TransactionFilter } from '@/lib/components/TransactionFilter';

export default function TransactionsPage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Transaction | null>(null);
  const [filtering, setFiltering] = useState(false);

  const [filters, setFilters] = useState<any | null>(null);

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

          <h1 className="justify-self-center text-2xl font-bold">Transacciones</h1>

          <button
            onClick={() => setCreating(true)}
            className="justify-self-end rounded-xl bg-black px-3 py-1.5 text-sm text-white hover:opacity-90"
          >
            + Agregar transacción
          </button>
        </div>
      </header>

      <section className="w-full p-6">
        <div className="rounded-2xl border bg-white p-4">
          <TransactionTable
            filters={filters}
            onDelete={setDeleting}
            onFilter={() => setFiltering(true)}
          />
        </div>
      </section>

      {creating && (
        <Dialog
          title="Crear transacción"
          onClose={() => { setCreating(false) }}
          content={(
            <TransactionForm
              onDone={() => setCreating(false)}
            />
          )}
        />
      )}

      {deleting && (
        <Dialog
          title="Eliminar transacción"
          content={(
            <TransactionDelete
              transaction={deleting}
              onClose={() => setDeleting(null)}
            />
          )}
        />
      )}

      {filtering && (
        <Dialog
          title="Filtrar transacciones"
          onClose={() => setFiltering(false)}
          content={(
            <TransactionFilter
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
