'use client';

import { useState } from 'react';

import { TransactionTable } from '@lib/components/TransactionTable';
import { TransactionForm } from '@lib/components/TransactionForm';
import { TransactionDelete } from '@/lib/components/TransactionDelete';
import { Dialog } from '@/lib/components/Dialog';

import { TransactionFilter } from '@/lib/components/TransactionFilter';
import { Transaction } from '@lib/types/Transaction';

export default function TransactionsPage() {
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);
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
            onEdit={setEditing}
            onDelete={setDeleting}
            onFilter={() => setFiltering(true)}
          />
        </div>
      </section>

      {(creating || editing) && (
        <Dialog
          title={editing ? "Editar transacción" : "Crear transacción"}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          content={(
            <TransactionForm
              transaction={editing ?? undefined}
              onDone={() => {
                setCreating(false);
                setEditing(null);
              }}
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
