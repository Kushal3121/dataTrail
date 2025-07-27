import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';
import PreviewTable from '../../components/PreviewTable';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setProgress(0);
    setUploaded(false);
  };

  const handleUpload = () => {
    if (!file) {
      toast.error('Please select a file first!');
      return;
    }

    if (uploading || uploaded) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setProgress(0);
    setPreviewData(null);

    // Animate progress bar
    let animationDone = false;
    let apiDone = false;
    let preview = null;
    let toastMessage = null;

    const finish = () => {
      setTimeout(() => {
        setUploading(false);
        setUploaded(true);
        if (toastMessage) toast.success(toastMessage);
        if (preview) setPreviewData(preview);
      }, 300);
    };

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + 5, 100);
        if (next === 100) {
          clearInterval(interval);
          animationDone = true;
          if (apiDone) finish();
        }
        return next;
      });
    }, 100);

    // Upload file to backend
    fetch('http://localhost:8000/upload', {
      method: 'POST',
      body: formData,
      headers: {
        role:
          JSON.parse(localStorage.getItem('loggedInUser'))?.role || 'Viewer',
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Upload failed');
        toastMessage = data.message || 'Upload successful!';
        return fetch(`http://localhost:8000/preview?filename=${file.name}`, {
          headers: {
            role:
              JSON.parse(localStorage.getItem('loggedInUser'))?.role ||
              'Viewer',
          },
        });
      })
      .then((res) => res.json())
      .then((data) => {
        preview = data;
      })
      .catch((err) => {
        toastMessage = err.message || 'Something went wrong';
      })
      .finally(() => {
        apiDone = true;
        if (progress === 100) finish(); // If animation already done
      });
  };

  return (
    <div className='space-y-6'>
      <h3 className='text-xl font-semibold flex items-center gap-2'>
        <UploadCloud className='text-indigo-600' /> Upload Dataset
      </h3>

      <label className='flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-indigo-500 transition'>
        <input
          type='file'
          accept='.csv,.json'
          onChange={handleFileChange}
          className='hidden'
        />
        <span className='text-gray-500'>
          {file ? file.name : 'Click to select a CSV or JSON file'}
        </span>
      </label>

      <button
        onClick={handleUpload}
        disabled={uploading || uploaded}
        className={`relative overflow-hidden w-full py-2 rounded-lg font-medium transition flex items-center justify-center
    ${
      uploaded
        ? 'bg-green-600 text-white cursor-not-allowed'
        : uploading
        ? 'bg-indigo-400 text-white cursor-not-allowed'
        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
    }`}
      >
        {uploading && (
          <div
            className='absolute top-0 left-0 h-full bg-indigo-700 opacity-20'
            style={{ width: `${progress}%` }}
          />
        )}
        <span className='relative z-10'>
          {uploaded ? 'Uploaded' : uploading ? 'Uploading...' : 'Upload'}
        </span>
      </button>

      {previewData && (
        <PreviewTable columns={previewData.columns} rows={previewData.rows} />
      )}
    </div>
  );
};

export default UploadPage;
