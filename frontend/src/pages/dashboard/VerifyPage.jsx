import { useState } from 'react';
import toast from 'react-hot-toast';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

const VerifyPage = () => {
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = () => {
    setVerifying(true);
    setResult(null);

    fetch('http://localhost:8000/verify', {
      headers: {
        role:
          JSON.parse(localStorage.getItem('loggedInUser'))?.role || 'Viewer',
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail);
        setResult({ status: 'valid', data });
        toast.success('Provenance is intact');
      })
      .catch((err) => {
        setResult({ status: 'tampered', data: err.message });
        toast.error('Provenance tampering detected');
      })
      .finally(() => setVerifying(false));
  };

  return (
    <div className='space-y-6'>
      <h3 className='text-xl font-semibold flex items-center gap-2'>
        <ShieldCheck className='text-indigo-600' /> Verify Provenance Chain
      </h3>

      <button
        onClick={handleVerify}
        disabled={verifying}
        className={`w-full py-2 rounded-lg font-medium transition flex items-center justify-center ${
          verifying
            ? 'bg-indigo-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}
      >
        {verifying ? 'Verifying...' : 'Verify Chain'}
      </button>

      {result && result.status === 'valid' && (
        <div className='flex items-center gap-3 p-4 border rounded-md bg-green-50 border-green-200'>
          <ShieldCheck className='text-green-600' />
          <div className='text-sm text-green-800 font-medium'>
            Provenance chain is valid.
          </div>
        </div>
      )}

      {result && result.status === 'tampered' && (
        <div className='flex items-center gap-3 p-4 border rounded-md bg-red-50 border-red-200'>
          <ShieldAlert className='text-red-600' />
          <div className='text-sm text-red-800 font-medium'>
            Tampering detected.
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyPage;
