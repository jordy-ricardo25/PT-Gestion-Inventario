'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { transactionFormSchema, TransactionFormValues } from '@lib/validators';
import { TransactionType, typeToServer } from '@lib/types/TransactionType';
import { Transaction } from '@lib/types/Transaction';
import { api } from '@lib/api';

type Props = {
  transaction?: Transaction;
  onDone?: () => void;
};

type ProductOption = {
  id: string;
  name: string;
  price: number;
};

export function TransactionForm({ transaction, onDone }: Props) {
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
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
    resolver: zodResolver(transactionFormSchema) as any,
    values: transaction
      ? {
        ...transaction,
        type: transaction.type.toString()
      } as any
      : undefined,
    defaultValues: {
      type: '1',
      quantity: 1,
      detail: '',
    },
  });

  const [formError, setFormError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (values: TransactionFormValues) => {
      const payload = {
        ...values,
        type: Number(values.type)
      }

      if (transaction) return (await api.put(`/transactions/${transaction.id}`, payload)).data;
      return (await api.post('/transactions', payload)).data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['transactions'] });
      onDone?.();
      reset();
    },
    onError: (error: any) => {
      if (error.response?.data?.message) {
        setFormError(error.response.data.message);
      } else {
        setFormError(`Ocurrió un error inesperado al ${transaction ? 'actualizar' : 'crear'} la transacción.`);
      }
    }
  });

  return (
    <form className="space-y-3" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
      <div>
        <label className="block text-sm font-medium mb-1">Producto</label>
        {isLoading ? (
          <div className="text-sm text-neutral-500">Cargando productos…</div>
        ) : error ? (
          <div className="text-sm text-red-600">Error al cargar productos</div>
        ) : (
          <select
            className="w-full border p-2 rounded"
            disabled={transaction != undefined}
            defaultValue={''}
            {...register('productId')}
            onChange={(e) => {
              setValue('productId', e.target.value || undefined)
              setValue('unitPrice', data?.find(
                (p) => p.id === e.target.value
              )?.price || 0)
            }}
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

      <div>
        <label className="block text-sm font-medium mb-1">Tipo</label>
        <select
          className="w-full border p-2 rounded"
          disabled={transaction != undefined}
          {...register('type')}
        >
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
        <label className="block text-sm font-medium mb-1">Cantidad</label>
        <input
          className="w-full border p-2 rounded"
          type="number"
          min={1}
          step={1}
          disabled={transaction != undefined}
          {...register('quantity', { valueAsNumber: true })}
        />
        {errors.quantity && (
          <p className="text-red-600 text-sm">
            {errors.quantity.message}
          </p>
        )}
      </div>

      <div>
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Detalle (opcional)"
          {...register('detail')}
        />
        {formError && (
          <div className="p-2 rounded bg-red-100 text-red-700 text-sm">
            {formError}
          </div>
        )}
      </div>

      <button
        disabled={mutation.isPending}
        className="px-4 py-2 rounded bg-neutral-900 text-white"
      >
        {mutation.isPending ? 'Guardando…' : transaction ? 'Actualizar' : 'Crear transacción'}
      </button>
    </form>
  );
}
