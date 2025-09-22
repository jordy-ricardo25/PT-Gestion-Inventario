'use client';

import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { productFilterSchema, ProductFilterValues } from '@lib/validators';
import { api } from '@lib/api';

type Filter = {
  categoryId?: string;
  min?: number;
  max?: number;
};

type Props = {
  filters?: Filter;
  onClose: (filter: Filter | null) => void;
};

type CategoryOption = {
  id: string;
  name: string;
};

export function ProductFilter({ filters, onClose }: Props) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProductFilterValues>({
    resolver: zodResolver(productFilterSchema),
    defaultValues: {
      ...filters
    }
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['categories', 'for-transaction-form'],
    queryFn: async (): Promise<CategoryOption[]> => {
      const res = await api.get('/categories');
      const raw = res.data;
      const list = Array.isArray(raw) ? raw : raw.items ?? [];
      return list.map((p: any) => ({ id: p.id, name: p.name }));
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <form
      className="space-y-3"
      onSubmit={handleSubmit((v) => {
        onClose({
          ...v
        });
        reset();
      })}
    >
      <div>
        <label className="block text-sm font-medium mb-1">Categoria</label>
        {isLoading ? (
          <div className="text-sm text-neutral-500">Cargando categorias…</div>
        ) : error ? (
          <div className="text-sm text-red-600">Error al cargar categorias</div>
        ) : (
          <select
            className="w-full border p-2 rounded"
            {...register('categoryId')}
          >
            <option value="">Seleccione…</option>
            {data?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}
        {errors.categoryId && (
          <p className="text-red-600 text-sm">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      <label className="block text-sm font-medium mb-1">Precio</label>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <input
            className="border p-2 rounded"
            placeholder="min"
            type="number"
            step="0.01"
            {...register('min', { valueAsNumber: true })}
          />
          {errors.min && (
            <p className="text-red-600 text-sm">
              {errors.min.message}
            </p>
          )}
        </div>
        <div>
          <input
            className="border p-2 rounded"
            placeholder="max"
            type="number"
            step="0.01"
            {...register('max', { valueAsNumber: true })}
          />
          {errors.max && (
            <p className="text-red-600 text-sm">
              {errors.max.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="px-4 py-2 rounded bg-neutral-900 text-white"
          type="submit"
        >
          Aplicar filtros
        </button>
        <button
          className="px-4 py-2 rounded bg-gray-300"
          type="button"
          onClick={() => {
            reset();
            onClose(null);
          }}
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}