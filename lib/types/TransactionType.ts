export type TransactionType = 'Purchase' | 'Sale';

export const typeLabel = (t: TransactionType) =>
  t === 'Purchase'
    ? 'Compra'
    : 'Venta';

export const typeToServer = (t: TransactionType): 1 | 2 =>
  t === 'Purchase' ? 1 : 2;

export const typeFromServer = (v: unknown): TransactionType =>
  v === 1 || v === '1' ? 'Purchase' : 'Sale';