import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { SlidersHorizontal } from 'lucide-react';
import FileDropdown from '../../components/FileDropDown';

const NormalizePage = () => {
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

  const handleNormalize = () => {
    if (!selectedFile) {
      toast.error('Please select a file to normalize');
      return;
    }

    setLoading(true);
    setProgress(0);

    let animationDone = false;
    let apiDone = false;
    let toastMessage = null;

    const finish = () => {
      setTimeout(() => {
        setLoading(false);
        if (toastMessage) {
          if (toastMessage.type === 'success') {
            toast.success(toastMessage.message);
          } else {
            toast.error(toastMessage.message);
          }
        }
      }, 300); // Small delay to make 100% progress bar feel final
    };

    // ⏳ Animate progress bar
    const fakeProgress = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + 10, 100);
        if (next === 100) {
          clearInterval(fakeProgress);
          animationDone = true;
          if (apiDone) finish();
        }
        return next;
      });
    }, 150);

    // 🔁 API call
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
        console.log('Hash:', data.log_entry.hash);
      })
      .catch((err) => {
        toastMessage = { type: 'error', message: err.message };
      })
      .finally(() => {
        apiDone = true;
        if (progress === 100) finish(); // If progress bar is already full
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
        className={`w-full py-2 rounded-lg font-medium transition flex items-center justify-center ${
          loading
            ? 'bg-indigo-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}
      >
        {loading ? 'Normalizing...' : 'Normalize'}
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

export default NormalizePage;
