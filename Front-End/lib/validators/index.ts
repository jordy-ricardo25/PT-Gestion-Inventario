import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.coerce
    .number()
    .nonnegative(),
  stock: z.coerce
    .number()
    .int()
    .nonnegative(),
  categoryId: z.string().uuid().optional().nullable(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const transactionSchema = z.object({
  date: z
    .preprocess(
      (v) => (v instanceof Date ? v : v ? new Date(v as string) : new Date()),
      z.date()
    )
    .optional(),
  productId: z.string().uuid().optional().nullable(),
  type: z.enum(["Purchase", "Sale"]),
  quantity: z.coerce
    .number()
    .int()
    .positive({ message: "Cantidad debe ser > 0" }),
  unitPrice: z.coerce
    .number()
    .nonnegative({ message: "Precio unitario requerido" }),
  totalPrice: z.coerce.number().optional().nullable(),
  detail: z.string().max(500).optional().nullable(),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;