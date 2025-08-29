'use client';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Product } from '@lib/types/Product';
import { api } from '@/lib/api';

export function DeleteProductDialog({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.delete(`/products/${product.id}`);
      return res.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['products'] });
      onClose();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        'No se pudo eliminar el producto.';
      setErrorMsg(String(msg));
    },
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-product-title"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-xl">
        <h3 id="delete-product-title" className="text-lg font-semibold">
          Eliminar producto
        </h3>

        <p className="mt-2 text-sm text-neutral-600">
          ¿Seguro que deseas eliminar{' '}
          <span className="font-medium text-neutral-900">{product.name}</span>?
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
    </div>
  );
}
