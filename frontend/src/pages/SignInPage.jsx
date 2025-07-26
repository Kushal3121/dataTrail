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
  const [loading, setLoading] = useState(false); // ✅ New loading state

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
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='bg-white shadow-lg rounded-lg p-8 w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>
          Sign In to DataTrail
        </h2>

        <input
          type='text'
          name='username'
          placeholder='Username'
          onChange={handleChange}
          className='w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg'
          disabled={loading}
        />

        <input
          type='password'
          name='password'
          placeholder='Password'
          onChange={handleChange}
          className='w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg'
          disabled={loading}
        />

        {error && (
          <p className='text-red-500 text-sm mb-4 text-center'>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full ${
            loading
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white font-semibold py-2 rounded-lg transition flex items-center justify-center`}
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
