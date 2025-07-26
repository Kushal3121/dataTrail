import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  BarChart3,
  UploadCloud,
  Layers,
  ServerCog,
  Lock,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const LandingPage = () => {
  const [headline, setHeadline] = useState('');
  const phrases = [
    'Secure Your Data Flow',
    'Trace Every Transformation',
    'Prove Data Integrity',
    'Visualize Your Provenance',
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setHeadline(phrases[i]);
      i = (i + 1) % phrases.length;
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-gray-100 px-6 py-16'>
      <div className='max-w-6xl mx-auto'>
        {/* Hero Section */}
        <div className='text-center mb-16'>
          <h1 className='text-5xl font-extrabold text-white mb-2'>DataTrail</h1>
          <p className='text-2xl text-indigo-300 h-8 transition-all duration-500'>
            {headline}
          </p>
          <p className='text-lg text-gray-300 max-w-2xl mx-auto mt-4'>
            A secure, tamper-proof big data pipeline tracker. Ensure integrity.
            Prove provenance.
          </p>
          <Link
            to='/signup'
            className='mt-8 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-full transition shadow-lg'
          >
            Get Started
          </Link>
        </div>

        {/* Features Section */}
        <div className='grid md:grid-cols-3 gap-10 text-center mb-24'>
          <div className='bg-[#1e293b] rounded-xl p-6 shadow hover:shadow-lg transition'>
            <UploadCloud className='mx-auto text-indigo-400 mb-4' size={40} />
            <h3 className='text-xl font-bold mb-2 text-white'>
              Seamless File Upload
            </h3>
            <p className='text-gray-400'>
              Upload your data securely and efficiently, supporting large-scale
              CSV pipelines.
            </p>
          </div>

          <div className='bg-[#1e293b] rounded-xl p-6 shadow hover:shadow-lg transition'>
            <BarChart3 className='mx-auto text-purple-400 mb-4' size={40} />
            <h3 className='text-xl font-bold mb-2 text-white'>
              Provenance Analytics
            </h3>
            <p className='text-gray-400'>
              Track, transform, and verify the origin and changes of every data
              asset.
            </p>
          </div>

          <div className='bg-[#1e293b] rounded-xl p-6 shadow hover:shadow-lg transition'>
            <ShieldCheck className='mx-auto text-green-400 mb-4' size={40} />
            <h3 className='text-xl font-bold mb-2 text-white'>
              Tamper-Proof Logging
            </h3>
            <p className='text-gray-400'>
              Immutable cryptographic logging ensures zero tolerance for
              manipulation.
            </p>
          </div>

          <div className='bg-[#1e293b] rounded-xl p-6 shadow hover:shadow-lg transition'>
            <Layers className='mx-auto text-yellow-400 mb-4' size={40} />
            <h3 className='text-xl font-bold mb-2 text-white'>
              Multi-Step Transformation
            </h3>
            <p className='text-gray-400'>
              Chain together transformations and log every stage of your
              pipeline with cryptographic precision.
            </p>
          </div>

          <div className='bg-[#1e293b] rounded-xl p-6 shadow hover:shadow-lg transition'>
            <ServerCog className='mx-auto text-cyan-400 mb-4' size={40} />
            <h3 className='text-xl font-bold mb-2 text-white'>
              Streamlined Integrations
            </h3>
            <p className='text-gray-400'>
              Designed to plug into your existing big data ecosystem with
              minimal effort and maximum security.
            </p>
          </div>

          <div className='bg-[#1e293b] rounded-xl p-6 shadow hover:shadow-lg transition'>
            <Lock className='mx-auto text-pink-400 mb-4' size={40} />
            <h3 className='text-xl font-bold mb-2 text-white'>
              Access Control
            </h3>
            <p className='text-gray-400'>
              Granular role-based access ensures that only authorized users can
              perform specific actions.
            </p>
          </div>
        </div>

        {/* Callout Section */}
        <div className='text-center'>
          <h2 className='text-3xl font-semibold text-white mb-2'>
            Built for Analysts, Trusted by Admins
          </h2>
          <p className='text-gray-300 max-w-2xl mx-auto mb-6'>
            Whether you're monitoring integrity or ensuring compliance,
            DataTrail is your gateway to transparent, traceable, and trustworthy
            data pipelines.
          </p>
          <Link
            to='/signup'
            className='bg-white text-indigo-700 font-semibold px-8 py-3 rounded-full shadow hover:bg-gray-100 transition'
          >
            Start Your Journey
          </Link>
        </div>
      </div>
      <footer className='text-center mt-24 text-sm text-gray-400'>
        &copy; {new Date().getFullYear()} DataTrail. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
