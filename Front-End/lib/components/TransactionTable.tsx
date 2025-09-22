'use client';

import { useState, useMemo } from 'react';
import { ListFilter } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { api } from '@lib/api';
import { PagedResult } from '@lib/types/PagedResult{T}';
import { Transaction } from '@/lib/types/Transaction';
import { Product } from '@lib/types/Product';
import { typeLabel, typeFromServer } from '@lib/types/TransactionType';

type Props = {
  filters: {
    productId?: string;
    from?: Date;
    to?: Date;
    type?: number;
  } | null;
  onDelete: (t: Transaction) => void;
  onFilter: () => void;
};

export function TransactionTable({ filters, onDelete, onFilter }: Props) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState<SortingState>([]);

  const [search, setSearch] = useState('');
  const [query] = useDebounce(search, 500);

  const sort = sorting[0]?.id;
  const order = sorting[0]?.desc ? 'desc' : 'asc';

  const { data, isLoading, error } = useQuery({
    queryKey: ['transactions', page, pageSize, sort, order, query, filters],
    queryFn: async (): Promise<PagedResult<Transaction>> => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (sort) params.set('sort', sort);
      if (sort) params.set('order', order);
      if (query) params.set('query', query);

      if (filters?.from) params.set('from', filters.from.toISOString());
      if (filters?.to) params.set('to', filters.to.toISOString());
      if (filters?.type) params.set('type', filters.type.toString());
      if (filters?.productId) params.set('productId', filters.productId);

      const res1 = await api.get('/products');
      const data1 = res1.data as PagedResult<Product>;

      const res2 = await api.get(`/transactions?${params.toString()}`);
      const data2 = res2.data as PagedResult<Transaction>;

      return {
        ...data2,
        items: data2.items.map(tx => ({
          ...tx,
          product: tx.productId ? data1.items.find(
            px => px.id == tx.productId
          ) ?? null : null
        }))
      };
    },
  });

  const columns = useMemo<ColumnDef<Transaction>[]>(() => [
    {
      accessorKey: 'date',
      header: 'Fecha',
      cell: (ctx) => new Date(ctx.row.original.date).toLocaleString(),
      enableSorting: true,
    },
    {
      accessorKey: 'product',
      header: 'Producto',
      cell: (ctx) => ctx.row.original.product?.name ?? ctx.row.original.productId,
      enableSorting: false,
    },
    {
      accessorKey: 'type',
      header: 'Tipo',
      cell: (ctx) => typeLabel(typeFromServer(ctx.row.original.type)),
      enableSorting: true,
    },
    {
      accessorKey: 'quantity',
      header: 'Cantidad',
      cell: (ctx) => ctx.row.original.quantity,
      enableSorting: true,
    },
    {
      accessorKey: 'detail',
      header: 'Detalle',
      cell: (ctx) => ctx.row.original.detail ?? '-',
      enableSorting: false,
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: (ctx) => {
        const t = ctx.row.original;
        return (
          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1 rounded bg-red-600 text-white"
              onClick={() => onDelete(t)}
            >
              Eliminar
            </button>
          </div>
        );
      },
    },
  ], [onDelete]);

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    manualPagination: true,
    pageCount: data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : -1,
    state: { sorting },
    onSortingChange: setSorting,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  });

  if (isLoading) return <div>Cargando transacciones…</div>;
  if (error || !data) return <div>Error cargando transacciones</div>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <input
            className="border rounded p-2 w-full max-w-sm"
            placeholder="Buscar por detalle…"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
          <button className="rounded border p-2"
            onClick={() => onFilter()}>
            <ListFilter size={24} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Filas:</label>
          <select
            className="border rounded p-2"
            value={pageSize}
            onChange={(e) => {
              setPage(1);
              setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[1200px] text-sm">
          <thead className="bg-neutral-100">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="p-3 text-left select-none">
                    {h.isPlaceholder ? null : (
                      <button
                        className={`flex items-center gap-1 ${h.column.getCanSort() ? 'cursor-pointer' : 'cursor-default'}`}
                        onClick={h.column.getToggleSortingHandler()}
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {h.column.getIsSorted() === 'asc' && '▲'}
                        {h.column.getIsSorted() === 'desc' && '▼'}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center text-neutral-500">
                  No hay transacciones
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          className="px-3 py-1 rounded border disabled:hidden"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={data.page === 1}
        >
          Anterior
        </button>
        <span className="text-sm">
          Página {data.page} de {Math.max(1, Math.ceil(data.total / data.pageSize))}
        </span>
        <button
          className="px-3 py-1 rounded border disabled:opacity-50"
          onClick={() => setPage((p) => p + 1)}
          disabled={data.page * data.pageSize >= data.total}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
