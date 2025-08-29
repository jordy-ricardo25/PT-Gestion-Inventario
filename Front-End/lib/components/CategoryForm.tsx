'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@lib/api';

const categorySchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(100, 'Máximo 100 caracteres'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export function CategoryForm({
  onDone,
}: {
  onDone?: () => void;
}) {
  const qc = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '' },
  });

  const mutation = useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      return (await api.post('/categories', values)).data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['categories'] });
      onDone?.();
      reset({ name: '' });
    },
  });

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input
          className="w-full border p-2 rounded"
          placeholder="Nombre de la categoría"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-red-600 text-sm">{errors.name.message}</p>
        )}
      </div>

      <button
        disabled={mutation.isPending}
        className="px-4 py-2 rounded bg-neutral-900 text-white"
      >
        {mutation.isPending ? 'Guardando…' : 'Crear categoría'}
      </button>
    </form>
  );
}
