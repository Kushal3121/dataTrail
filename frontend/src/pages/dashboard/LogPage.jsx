import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FileText } from 'lucide-react';

const LogsPage = () => {
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <div className='overflow-auto rounded-lg shadow border border-gray-200 bg-white'>
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
              {log.map((entry, idx) => {
                const timestamp = new Date(entry.timestamp);
                const date = timestamp.toLocaleDateString();
                const time = timestamp.toLocaleTimeString();

                return (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-purple-50'}
                  >
                    <td className='px-4 py-3 font-semibold text-gray-800'>
                      {entry.step}
                    </td>
                    <td className='px-4 py-3'>{date}</td>
                    <td className='px-4 py-3'>{time}</td>
                    <td
                      className='px-4 py-3 font-mono text-xs text-indigo-600rounded-md max-w-[220px] truncate'
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
      )}
    </div>
  );
};

export default LogsPage;
