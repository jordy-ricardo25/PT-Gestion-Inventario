'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ProductFormValues, productFormSchema } from '@lib/validators';
import { Product } from '@/lib/types/Product';
import { api } from '@lib/api';

type CategoryOption = { id: number; name: string };

export function ProductForm({ product, onDone }: { product?: Product; onDone?: () => void }) {
  const qc = useQueryClient();

  const {
    data: categories,
    isLoading: catLoading,
    error: catError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<CategoryOption[]> => {
      const res = await api.get('/categories');
      const raw = res.data;
      const list = Array.isArray(raw) ? raw : raw.items ?? [];
      return list.map((c: any) => ({ id: c.id, name: c.name }));
    },
    staleTime: 5 * 60 * 1000,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema) as any,
    values: product
      ? ({ ...product, categoryId: product.categoryId ?? undefined } as any)
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      if (product) return (await api.put(`/products/${product.id}`, values)).data;
      return (await api.post('/products', values)).data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['products'] });
      onDone?.();
      reset();
    },
  });

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-3">
      <input
        className="w-full border p-2 rounded"
        placeholder="Nombre"
        {...register('name')}
      />
      {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}

      <textarea
        className="w-full border p-2 rounded"
        placeholder="Descripción"
        {...register('description')}
      />

      <div>
        <label className="block text-sm font-medium mb-1">Categoría</label>
        {catLoading ? (
          <div className="text-sm text-neutral-500">Cargando categorías…</div>
        ) : catError ? (
          <div className="text-sm text-red-600">Error al cargar categorías</div>
        ) : (
          <select
            className="w-full border p-2 rounded"
            defaultValue={product?.categoryId ?? ''}
            {...register('categoryId')}
            onChange={(e) => setValue('categoryId', e.target.value || undefined)}
          >
            <option value="">Sin categoría</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}
        {errors.categoryId && (
          <p className="text-red-600 text-sm">
            {String((errors as any).categoryId?.message ?? 'Categoría inválida')}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          className="border p-2 rounded"
          placeholder="Precio"
          type="number"
          step="0.01"
          {...register('price', { valueAsNumber: true })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Stock"
          type="number"
          {...register('stock', { valueAsNumber: true })}
        />
      </div>

      <button
        disabled={mutation.isPending}
        className="px-4 py-2 rounded bg-neutral-900 text-white"
      >
        {mutation.isPending ? 'Guardando…' : product ? 'Actualizar' : 'Crear producto'}
      </button>
    </form>
  );
}
