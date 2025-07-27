import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);

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

    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;

        if (next >= 100) {
          clearInterval(interval);
          setProgress(100);
          setTimeout(() => {
            setUploading(false);
            setUploaded(true);
            toast.success('Upload completed successfully!');
          }, 300);
          return 100;
        }

        return next;
      });
    }, 100);
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
        className={`w-full py-2 rounded-lg font-medium transition flex items-center justify-center
          ${
            uploaded
              ? 'bg-indigo-600 text-white cursor-not-allowed'
              : uploading
              ? 'bg-indigo-400 text-white cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
      >
        {uploaded ? 'Uploaded' : uploading ? 'Uploading...' : 'Upload'}
      </button>

      {(uploading || progress > 0) && (
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

export default UploadPage;
