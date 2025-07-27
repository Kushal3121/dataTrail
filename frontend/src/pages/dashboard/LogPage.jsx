import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FileText } from 'lucide-react';
import RowsPerPageDropdown from '../../components/RowsPerPageDropDown';

const LogsPage = () => {
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const totalPages = Math.ceil(log.length / rowsPerPage);
  const paginatedData = log.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  useEffect(() => {
    const role =
      JSON.parse(localStorage.getItem('loggedInUser'))?.role || 'Viewer';

    fetch('http://localhost:8000/log', {
      headers: { role },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Failed to fetch logs');
        setLog(data.provenance_log || []);
      })
      .catch((err) => {
        setError(err.message);
        toast.error(err.message || 'Log fetch failed');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className='space-y-6'>
      <h3 className='text-xl font-semibold flex items-center gap-2'>
        <FileText className='text-indigo-600' /> Provenance Log
      </h3>

      {loading ? (
        <p className='text-gray-500'>Loading logs...</p>
      ) : error ? (
        <p className='text-red-500'>{error}</p>
      ) : log.length === 0 ? (
        <p className='text-gray-500'>No log entries found.</p>
      ) : (
        <>
          <div className='rounded-lg shadow border border-gray-200 bg-white'>
            <table className='min-w-full divide-y divide-gray-200 text-sm'>
              <thead className='bg-gray-50 text-gray-600'>
                <tr>
                  <th className='px-4 py-3 text-left'>Step</th>
                  <th className='px-4 py-3 text-left'>Date</th>
                  <th className='px-4 py-3 text-left'>Time</th>
                  <th className='px-4 py-3 text-left'>Hash</th>
                  <th className='px-4 py-3 text-left'>Previous Hash</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {paginatedData.map((entry, idx) => {
                  const timestamp = new Date(entry.timestamp);
                  const date = timestamp.toLocaleDateString();
                  const time = timestamp.toLocaleTimeString();
                  const globalIndex = (page - 1) * rowsPerPage + idx;

                  return (
                    <tr
                      key={globalIndex}
                      className={
                        globalIndex % 2 === 0 ? 'bg-white' : 'bg-purple-50'
                      }
                    >
                      <td className='px-4 py-3 font-semibold text-gray-800'>
                        {entry.step}
                      </td>
                      <td className='px-4 py-3'>{date}</td>
                      <td className='px-4 py-3'>{time}</td>
                      <td
                        className='px-4 py-3 font-mono text-xs text-indigo-600 rounded-md max-w-[220px] truncate'
                        title={entry.hash}
                      >
                        {entry.hash}
                      </td>
                      <td
                        className='px-4 py-3 font-mono text-xs text-gray-500 rounded-md max-w-[220px] truncate'
                        title={entry.previous_hash || 'N/A'}
                      >
                        {entry.previous_hash || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className='flex flex-col sm:flex-row items-center justify-between gap-3 mt-4'>
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
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className='px-4 py-2 rounded-md border text-sm font-medium text-gray-700 disabled:opacity-50'
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LogsPage;
