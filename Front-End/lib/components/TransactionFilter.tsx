'use client';

import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { transactionFilterSchema, TransactionFilterValues } from '@lib/validators';
import { api } from '@lib/api';

type Filter = {
  productId?: string;
  from?: Date;
  to?: Date;
  type?: number;
};

type Props = {
  filters?: Filter;
  onClose: (filter: Filter | null) => void;
};

type ProductOption = {
  id: string;
  name: string;
};

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

export function TransactionFilter({ filters, onClose }: Props) {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<TransactionFilterValues>({
    resolver: zodResolver(transactionFilterSchema),
    defaultValues: {
      ...filters,
      from: filters?.from ? formatDate(filters.from) : undefined,
      to: filters?.to ? formatDate(filters.to) : undefined,
      type: filters?.type ? filters.type.toString() : undefined,
    }
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', 'for-transaction-form'],
    queryFn: async (): Promise<ProductOption[]> => {
      const res = await api.get('/products');
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
          ...v,
          from: v.from ? new Date(v.from) : undefined,
          to: v.to ? new Date(v.to) : undefined,
          type: v.type ? Number(v.type) : undefined
        });
        reset();
      })}
    >
      <div>
        <label className="block text-sm font-medium mb-1">Fecha desde</label>
        <input
          className="w-full border p-2 rounded"
          type="date"
          {...register('from')}
        />
        {errors.from && (
          <p className="text-red-600 text-sm">{errors.from.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Fecha hasta</label>
        <input
          className="w-full border p-2 rounded"
          type="date"
          {...register('to')}
        />
        {errors.to && (
          <p className="text-red-600 text-sm">{errors.to.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tipo</label>
        <select className="w-full border p-2 rounded" {...register('type')}>
          <option value="">Todos</option>
          <option value="1">Compra</option>
          <option value="2">Venta</option>
        </select>
        {errors.type && (
          <p className="text-red-600 text-sm">
            {errors.type.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Producto</label>
        {isLoading ? (
          <div className="text-sm text-neutral-500">Cargando productos…</div>
        ) : error ? (
          <div className="text-sm text-red-600">Error al cargar productos</div>
        ) : (
          <select
            className="w-full border p-2 rounded"
            {...register('productId')}
          >
            <option value="">Seleccione…</option>
            {data?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}
        {errors.productId && (
          <p className="text-red-600 text-sm">
            {errors.productId.message}
          </p>
        )}
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
