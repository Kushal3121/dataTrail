import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import FileDropdown from '../../components/FileDropDown';
import PreviewTable from '../../components/PreviewTable';

const TransformPage = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/raw-files', {
      headers: {
        role:
          JSON.parse(localStorage.getItem('loggedInUser'))?.role || 'Viewer',
      },
    })
      .then((res) => res.json())
      .then((data) => setFiles(data.files || []))
      .catch(() => toast.error('Failed to load files'));
  }, []);

  const handleTransform = () => {
    if (!selectedFile) {
      toast.error('Please select a file to transform');
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
        toast.success(toastMessage);
        if (preview) setPreviewData(preview);
      }, 300);
    };

    const simulateProgress = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + 10, 100);
        if (next === 100) {
          clearInterval(simulateProgress);
          animationDone = true;
          if (apiDone) finish();
        }
        return next;
      });
    }, 100);

    fetch(`http://localhost:8000/transform?filename=${selectedFile}`, {
      method: 'POST',
      headers: {
        role:
          JSON.parse(localStorage.getItem('loggedInUser'))?.role || 'Viewer',
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Transformation failed');
        toastMessage = 'Transformation complete!';

        // Fetch the transformed file (from /processed dir)
        return fetch(
          `http://localhost:8000/preview?filename=${selectedFile}&source=processed`,
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
        toastMessage = err.message || 'Transformation failed';
      })
      .finally(() => {
        apiDone = true;
        if (progress === 100) finish();
      });
  };

  return (
    <div className='space-y-6'>
      <h3 className='text-xl font-semibold flex items-center gap-2'>
        <RefreshCw className='text-indigo-600' /> Transform Dataset
      </h3>

      <FileDropdown
        files={files}
        selected={selectedFile}
        setSelected={setSelectedFile}
      />

      <button
        onClick={handleTransform}
        disabled={loading}
        className={`w-full py-2 rounded-lg font-medium relative overflow-hidden transition flex items-center justify-center
          ${
            loading
              ? 'bg-indigo-400 text-white cursor-not-allowed'
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
          {loading ? 'Transforming...' : 'Transform'}
        </span>
      </button>

      {previewData && (
        <PreviewTable columns={previewData.columns} rows={previewData.rows} />
      )}
    </div>
  );
};

export default TransformPage;
