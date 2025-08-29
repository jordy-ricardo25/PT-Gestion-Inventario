import { Category } from "./Category";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId?: string | null;
  category?: Category | null;
}