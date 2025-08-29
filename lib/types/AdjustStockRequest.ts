export interface AdjustStockRequest {
  productId: number;
  quantity: number;
  note?: string;
}