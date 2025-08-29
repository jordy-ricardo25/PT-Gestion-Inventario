'use client';

import * as React from 'react';
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
import { Product } from '@/lib/types/Product';
import { PagedResult } from '@lib/types/PagedResult{T}';

type Props = {
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
};

export function ProductTable({ onEdit, onDelete }: Props) {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [query, setQuery] = React.useState('');

  const sort = sorting[0]?.id;
  const order = sorting[0]?.desc ? 'desc' : 'asc';

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', page, pageSize, sort, order, query],
    queryFn: async (): Promise<PagedResult<Product>> => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (sort) params.set('sort', sort);
      if (sort) params.set('order', order);
      if (query) params.set('q', query);

      const res = await api.get(`/products?${params.toString()}`);
      return res.data;
    },
  });

  const columns = React.useMemo<ColumnDef<Product>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Nombre',
      cell: (ctx) => <span>{ctx.row.original.name}</span>,
      enableSorting: true,
    },
    {
      accessorKey: 'price',
      header: 'Precio',
      cell: (ctx) => <>${ctx.row.original.price.toFixed(2)}</>,
      enableSorting: true,
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      cell: (ctx) => <>{ctx.row.original.stock}</>,
      enableSorting: true,
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: (ctx) => {
        const p = ctx.row.original;
        return (
          <div className="flex justify-end gap-2">
            <button className="px-3 py-1 rounded bg-neutral-200" onClick={() => onEdit(p)}>
              Editar
            </button>
            <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => onDelete(p)}>
              Eliminar
            </button>
          </div>
        );
      },
    },
  ], [onEdit, onDelete]);

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

  if (isLoading) return <div>Cargando productos…</div>;
  if (error || !data) return <div>Error cargando productos</div>;

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between gap-3">
        <input
          className="border rounded p-2 w-full max-w-sm"
          placeholder="Buscar por nombre, SKU…"
          value={query}
          onChange={(e) => {
            setPage(1);
            setQuery(e.target.value);
          }}
        />
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
                  No hay productos
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
          className="px-3 py-1 rounded border"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span className="text-sm">
          Página {data.page} de {Math.max(1, Math.ceil(data.total / data.pageSize))}
        </span>
        <button
          className="px-3 py-1 rounded border"
          onClick={() => setPage((p) => p + 1)}
          disabled={data.page * data.pageSize >= data.total}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
