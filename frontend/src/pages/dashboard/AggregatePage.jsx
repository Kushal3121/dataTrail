import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { BarChart3 } from 'lucide-react';
import FileDropdown from '../../components/FileDropDown';

const AggregatePage = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Load normalized files on mount
  useEffect(() => {
    fetch('http://localhost:8000/normalized-files', {
      headers: {
        role:
          JSON.parse(localStorage.getItem('loggedInUser'))?.role || 'Viewer',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const normalizedFiles = data.files?.filter((f) =>
          f.startsWith('normalized_')
        );
        setFiles(normalizedFiles || []);
      })
      .catch(() => toast.error('Failed to load files'));
  }, []);

  const handleAggregate = () => {
    if (!selectedFile) {
      toast.error('Please select a file to aggregate');
      return;
    }

    setLoading(true);
    setProgress(0);
    let apiDone = false;
    let animationDone = false;
    let toastMessage = null;

    const finish = () => {
      setTimeout(() => {
        setLoading(false);
        if (toastMessage) {
          toast[toastMessage.type](toastMessage.message);
        }
      }, 300);
    };

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + 10, 100);
        if (next === 100) {
          clearInterval(interval);
          animationDone = true;
          if (apiDone) finish();
        }
        return next;
      });
    }, 150);

    fetch(`http://localhost:8000/aggregate?filename=${selectedFile}`, {
      method: 'POST',
      headers: {
        role:
          JSON.parse(localStorage.getItem('loggedInUser'))?.role || 'Viewer',
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Aggregation failed');
        toastMessage = { type: 'success', message: 'Aggregation complete!' };
        console.log('Hash:', data.log_entry.hash);
      })
      .catch((err) => {
        toastMessage = { type: 'error', message: err.message };
      })
      .finally(() => {
        apiDone = true;
        if (progress === 100) finish();
      });
  };

  return (
    <div className='space-y-6'>
      <h3 className='text-xl font-semibold flex items-center gap-2'>
        <BarChart3 className='text-indigo-600' /> Aggregate Dataset
      </h3>

      <FileDropdown
        files={files}
        selected={selectedFile}
        setSelected={setSelectedFile}
      />

      <button
        onClick={handleAggregate}
        disabled={loading}
        className={`w-full py-2 rounded-lg font-medium transition flex items-center justify-center ${
          loading
            ? 'bg-indigo-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}
      >
        {loading ? 'Aggregating...' : 'Aggregate'}
      </button>

      {loading && (
        <div className='w-full h-3 bg-gray-200 rounded-lg overflow-hidden'>
          <div
            className='h-full bg-indigo-600 rounded-lg transition-all duration-300 ease-in-out'
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default AggregatePage;
