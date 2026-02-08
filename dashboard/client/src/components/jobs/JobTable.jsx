import { useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { ArrowUpDown, ExternalLink } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns';

export default function JobTable({ jobs }) {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState([]);

  const columns = useMemo(() => [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.title}</div>
          <div className="text-xs text-gray-500">{row.original.company}</div>
        </div>
      ),
    },
    { accessorKey: 'location', header: 'Location' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => <StatusBadge status={getValue()} />,
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="flex flex-wrap gap-1">
          {(getValue() || []).map(t => (
            <span key={t.id} className="px-1.5 py-0.5 rounded text-xs text-white" style={{ backgroundColor: t.color }}>
              {t.name}
            </span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'date_added',
      header: 'Added',
      cell: ({ getValue }) => {
        const v = getValue();
        return v ? format(new Date(v), 'MMM d, yyyy') : '-';
      },
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: ({ row }) => row.original.linkedin_url ? (
        <a
          href={row.original.linkedin_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="text-gray-400 hover:text-primary-500"
        >
          <ExternalLink size={14} />
        </a>
      ) : null,
    },
  ], []);

  const table = useReactTable({
    data: jobs,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-900/50">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(header => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-1">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && <ArrowUpDown size={12} />}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
              onClick={() => navigate(`/jobs/${row.original.id}`)}
            >
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-4 py-3 text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {jobs.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                No jobs found. Add a job or import from LinkedIn.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
