import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import FileDropdown from '../../components/FileDropDown';

const TransformPage = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

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

    const simulateProgress = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(simulateProgress);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    setTimeout(() => {
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
          toast.success('Transformation complete!');
        })
        .catch((err) => {
          toast.error(err.message || 'Transformation failed');
        })
        .finally(() => {
          setLoading(false);
          setProgress(100);
        });
    }, 1200); // Simulate processing time
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
        className={`w-full py-2 rounded-lg font-medium transition flex items-center justify-center ${
          loading
            ? 'bg-indigo-400 cursor-not-allowed text-white'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}
      >
        {loading ? 'Transforming...' : 'Transform'}
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

export default TransformPage;
