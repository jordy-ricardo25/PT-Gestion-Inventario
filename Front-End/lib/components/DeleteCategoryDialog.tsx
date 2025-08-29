'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@lib/api';
import { Category } from '@lib/types/Category';

export function DeleteCategoryDialog({
  category,
  onClose,
}: {
  category: Category;
  onClose: () => void;
}) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/categories/${category.id}`);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['categories'] });
      onClose();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.error || err?.message || 'No se pudo eliminar';
      alert(msg);
    },
  });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-2">Eliminar categoría</h3>
        <p className="text-sm text-neutral-600 mb-4">
          ¿Seguro que deseas eliminar la categoría <b>{category.name}</b>?
        </p>

        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-2 rounded border"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancelar
          </button>
          <button
            className="px-3 py-2 rounded bg-red-600 text-white"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Eliminando…' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
