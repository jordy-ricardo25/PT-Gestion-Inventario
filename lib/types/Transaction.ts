import { Product } from "./Product";
import { TransactionType } from "./TransactionType";

export interface Transaction {
  id: string,
  date: Date,
  type: TransactionType,
  quantity: number,
  unitPrice: number,
  totalPrice: number,
  detail?: string | null,
  productId?: string | null
  product?: Product | null
}