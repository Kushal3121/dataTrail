import { useState } from 'react';
import RowsPerPageDropdown from './RowsPerPageDropDown';

const PreviewTable = ({ columns, rows }) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const paginatedRows = rows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className='space-y-4 mt-6'>
      <div className='rounded-lg shadow border border-gray-200 bg-white overflow-auto'>
        <table className='min-w-full divide-y divide-gray-200 text-sm text-gray-800'>
          <thead className='bg-gray-50'>
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className='px-4 py-3 text-left font-medium whitespace-nowrap truncate max-w-[180px]'
                  title={col}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {paginatedRows.map((row, ridx) => (
              <tr
                key={ridx}
                className={ridx % 2 === 0 ? 'bg-white' : 'bg-purple-50'}
              >
                {row.map((cell, cidx) => (
                  <td
                    key={cidx}
                    className='px-4 py-3 truncate max-w-[220px]'
                    title={cell ?? ''}
                  >
                    {cell ?? '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className='flex flex-col sm:flex-row items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-600'>Rows per page:</span>
          <RowsPerPageDropdown
            value={rowsPerPage}
            onChange={(val) => {
              setRowsPerPage(val);
              setPage(1);
            }}
          />
        </div>

        <div className='flex items-center gap-4'>
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className='px-4 py-2 rounded-md border text-sm font-medium text-gray-700 disabled:opacity-50'
          >
            Previous
          </button>
          <span className='text-sm text-gray-600'>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className='px-4 py-2 rounded-md border text-sm font-medium text-gray-700 disabled:opacity-50'
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewTable;
