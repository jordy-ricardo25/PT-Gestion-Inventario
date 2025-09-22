'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Transaction } from '@lib/types/Transaction';
import { api } from '@lib/api';

type Props = {
  transaction: Transaction;
  onClose: () => void;
};

export function TransactionDelete({ transaction, onClose }: Props) {
  const qc = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.delete(`/transactions/${transaction.id}`);
      return res.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['transactions'] });
      onClose();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data ||
        err?.message ||
        'No se pudo eliminar la transacción.';
      setErrorMsg(String(msg));
    },
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-neutral-600 mt-2 mb-4">
        ¿Seguro que deseas eliminar esta transacción?
        <br />
        Esta acción no se puede deshacer.
      </p>

      {errorMsg && (
        <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <div className="mt-6 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-3 py-1.5 text-sm hover:bg-neutral-100 disabled:opacity-60"
          disabled={mutation.isPending}
        >
          Cancelar
        </button>
        <button
          onClick={() => mutation.mutate()}
          className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 disabled:opacity-60"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Eliminando…' : 'Eliminar'}
        </button>
      </div>
    </div>
  );
}
