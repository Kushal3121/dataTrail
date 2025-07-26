import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center px-6'>
      <div className='max-w-3xl text-center'>
        <h1 className='text-5xl font-extrabold mb-6'>DataTrail</h1>
        <p className='text-xl mb-8'>
          A secure, tamper-proof big data pipeline tracker. Ensure integrity.
          Prove provenance.
        </p>
        <Link
          to='/signup'
          className='bg-white text-indigo-700 font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition'
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
