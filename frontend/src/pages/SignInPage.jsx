import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/RoleContext';

const SignInPage = () => {
  const { signIn } = useAuth();
  const { setRole } = useRole();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setError('');
    setLoading(true);
    setTimeout(() => {
      try {
        const role = signIn(form);
        setRole(role);
        navigate('/dashboard');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-gray-100 px-4'>
      <div className='bg-white shadow-2xl rounded-xl p-10 w-full max-w-md text-gray-800'>
        <h2 className='text-3xl font-extrabold mb-6 text-center text-indigo-700'>
          Sign In to DataTrail
        </h2>

        <input
          type='text'
          name='username'
          placeholder='Username'
          onChange={handleChange}
          disabled={loading}
          className='w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-indigo-500'
        />

        <input
          type='password'
          name='password'
          placeholder='Password'
          onChange={handleChange}
          disabled={loading}
          className='w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-indigo-500'
        />

        {error && (
          <p className='text-red-500 text-sm mb-4 text-center'>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full text-white font-semibold py-3 rounded-lg transition flex items-center justify-center shadow-lg ${
            loading
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? (
            <div className='h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
          ) : (
            'Sign In'
          )}
        </button>

        <p className='text-sm text-center mt-4 text-gray-600'>
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className='text-indigo-600 font-medium cursor-pointer hover:underline'
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
