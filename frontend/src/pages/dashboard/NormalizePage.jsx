import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { SlidersHorizontal } from 'lucide-react';
import FileDropdown from '../../components/FileDropDown';
import PreviewTable from '../../components/PreviewTable';

const NormalizePage = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/processed-files', {
      headers: {
        role:
          JSON.parse(localStorage.getItem('loggedInUser'))?.role || 'Viewer',
      },
    })
      .then((res) => res.json())
      .then((data) => setFiles(data.files || []))
      .catch(() => toast.error('Failed to load files'));
  }, []);

  const handleNormalize = () => {
    if (!selectedFile) {
      toast.error('Please select a file to normalize');
      return;
    }

    setLoading(true);
    setProgress(0);
    setPreviewData(null);

    let animationDone = false;
    let apiDone = false;
    let toastMessage = null;
    let preview = null;

    const finish = () => {
      setTimeout(() => {
        setLoading(false);
        if (toastMessage?.type === 'success')
          toast.success(toastMessage.message);
        else if (toastMessage?.type === 'error')
          toast.error(toastMessage.message);
        if (preview) setPreviewData(preview);
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

    fetch(`http://localhost:8000/normalize?filename=${selectedFile}`, {
      method: 'POST',
      headers: {
        role:
          JSON.parse(localStorage.getItem('loggedInUser'))?.role || 'Viewer',
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Normalization failed');
        toastMessage = { type: 'success', message: 'Normalization complete!' };

        // Fetch normalized preview
        return fetch(
          `http://localhost:8000/preview?filename=normalized_${selectedFile}&source=processed`,
          {
            headers: {
              role:
                JSON.parse(localStorage.getItem('loggedInUser'))?.role ||
                'Viewer',
            },
          }
        );
      })
      .then((res) => res.json())
      .then((data) => {
        preview = data;
      })
      .catch((err) => {
        toastMessage = {
          type: 'error',
          message: err.message || 'Normalization failed',
        };
      })
      .finally(() => {
        apiDone = true;
        if (progress === 100) finish();
      });
  };

  return (
    <div className='space-y-6'>
      <h3 className='text-xl font-semibold flex items-center gap-2'>
        <SlidersHorizontal className='text-indigo-600' /> Normalize Dataset
      </h3>

      <FileDropdown
        files={files}
        selected={selectedFile}
        setSelected={setSelectedFile}
      />

      <button
        onClick={handleNormalize}
        disabled={loading}
        className={`w-full py-2 rounded-lg font-medium relative overflow-hidden transition flex items-center justify-center ${
          loading
            ? 'bg-indigo-400 cursor-not-allowed text-white'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}
      >
        {loading && (
          <span
            className='absolute top-0 left-0 h-full bg-indigo-500 opacity-30 transition-all duration-300 ease-in-out'
            style={{ width: `${progress}%` }}
          />
        )}
        <span className='relative z-10'>
          {loading ? 'Normalizing...' : 'Normalize'}
        </span>
      </button>

      {previewData && (
        <PreviewTable columns={previewData.columns} rows={previewData.rows} />
      )}
    </div>
  );
};

export default NormalizePage;
