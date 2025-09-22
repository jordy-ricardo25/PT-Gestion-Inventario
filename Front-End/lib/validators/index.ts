import { z } from 'zod';

export const productFormSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.coerce
    .number()
    .nonnegative(),
  stock: z.coerce
    .number()
    .int()
    .nonnegative(),
  categoryId: z.uuid().optional().nullable(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const transactionFormSchema = z.object({
  productId: z.uuid().optional().nullable(),
  type: z.string(),
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

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export const transactionFilterSchema = z.object({
  productId: z.union([z.uuid(), z.literal(""), z.undefined()])
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  type: z.string().optional(),
});

export type TransactionFilterValues = z.infer<typeof transactionFilterSchema>;

export const productFilterSchema = z.object({
  categoryId: z.union([z.uuid(), z.literal(""), z.undefined()])
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  min: z.union([z.number(), z.nan(), z.undefined()])
    .transform((v) => (typeof v === "number" && !isNaN(v) ? v : undefined))
    .optional(),

  max: z.union([z.number(), z.nan(), z.undefined()])
    .transform((v) => (typeof v === "number" && !isNaN(v) ? v : undefined))
    .optional(),
});

export type ProductFilterValues = z.infer<typeof productFilterSchema>;