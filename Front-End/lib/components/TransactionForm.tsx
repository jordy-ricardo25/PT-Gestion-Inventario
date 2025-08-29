'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { transactionSchema, TransactionFormValues } from '@lib/validators';
import { TransactionType, typeToServer } from '@lib/types/TransactionType';
import { api } from '@lib/api';

type ProductOption = { id: string; name: string; price: number };

export function TransactionForm({ onDone }: { onDone?: () => void }) {
  const qc = useQueryClient();

  const { data: products, isLoading: prodLoading, error: prodError } = useQuery({
    queryKey: ['products', 'for-transaction-form'],
    queryFn: async (): Promise<ProductOption[]> => {
      const res = await api.get('/products');
      const raw = res.data;
      const list = Array.isArray(raw) ? raw : raw.items ?? [];
      return list.map((p: any) => ({ id: p.id, name: p.name, price: p.price }));
    },
    staleTime: 5 * 60 * 1000,
  });

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema) as any,
    defaultValues: {
      date: new Date(),
      type: 'Purchase' as TransactionType,
      quantity: 1,
      detail: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: TransactionFormValues) => {
      const payload = { ...values, type: typeToServer(values.type) };

      console.log(payload)

      return (await api.post('/transactions', payload)).data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['transactions'] });
      onDone?.();
      reset();
    },
  });

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Producto</label>
        {prodLoading ? (
          <div className="text-sm text-neutral-500">Cargando productos…</div>
        ) : prodError ? (
          <div className="text-sm text-red-600">Error al cargar productos</div>
        ) : (
          <select
            className="w-full border p-2 rounded"
            defaultValue={''}
            {...register('productId')}
            onChange={(e) => {
              setValue('productId', e.target.value || undefined)
              setValue('unitPrice', products?.find(
                (p) => p.id === e.target.value
              )?.price || 0)
            }}
          >
            <option value="">Seleccione…</option>
            {products?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}
        {errors.productId && (
          <p className="text-red-600 text-sm">
            {String((errors as any).productId.message)} ?? 'Producto inválido'
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tipo</label>
        <select
          className="w-full border p-2 rounded"
          {...register('type')}
          onChange={(e) => setValue('type', e.target.value as 'Purchase' | 'Sale')}
        >
          <option value="Purchase">Compra</option>
          <option value="Sale">Venta</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Cantidad</label>
        <input
          className="w-full border p-2 rounded"
          type="number"
          min={1}
          step={1}
          {...register('quantity', { valueAsNumber: true })}
        />
        {errors.quantity && (
          <p className="text-red-600 text-sm">
            {errors.quantity.message}
          </p>
        )}
      </div>

      <textarea
        className="w-full border p-2 rounded"
        placeholder="Detalle (opcional)"
        {...register('detail')}
      />

      <button
        disabled={mutation.isPending}
        className="px-4 py-2 rounded bg-neutral-900 text-white"
      >
        {mutation.isPending ? 'Guardando…' : 'Crear transacción'}
      </button>
    </form>
  );
}
