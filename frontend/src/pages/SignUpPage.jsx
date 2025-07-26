import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignUpPage = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    role: '',
    organization: '',
    address: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.role) {
      setError('Please select a role');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      try {
        signUp(form);
        navigate('/signin');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4'>
      <div className='bg-white shadow-lg rounded-lg p-8 w-full max-w-xl'>
        <h2 className='text-2xl font-bold mb-6 text-center'>
          Create an Account
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <input
            type='text'
            name='firstName'
            placeholder='First Name'
            onChange={handleChange}
            disabled={loading}
            className='p-2 border rounded-lg'
          />
          <input
            type='text'
            name='lastName'
            placeholder='Last Name'
            onChange={handleChange}
            disabled={loading}
            className='p-2 border rounded-lg'
          />
          <input
            type='text'
            name='username'
            placeholder='Username'
            onChange={handleChange}
            disabled={loading}
            className='p-2 border rounded-lg sm:col-span-2'
          />
          <input
            type='password'
            name='password'
            placeholder='Password'
            onChange={handleChange}
            disabled={loading}
            className='p-2 border rounded-lg sm:col-span-2'
          />
          <input
            type='text'
            name='organization'
            placeholder='Organization'
            onChange={handleChange}
            disabled={loading}
            className='p-2 border rounded-lg'
          />
          <input
            type='text'
            name='address'
            placeholder='Address'
            onChange={handleChange}
            disabled={loading}
            className='p-2 border rounded-lg'
          />
          <select
            name='role'
            value={form.role}
            onChange={handleChange}
            disabled={loading}
            className='p-2 border rounded-lg sm:col-span-2'
          >
            <option value='' disabled>
              -- Select Role --
            </option>
            <option value='Admin'>Admin</option>
            <option value='Analyst'>Analyst</option>
            <option value='Viewer'>Viewer</option>
          </select>
        </div>

        {error && (
          <p className='text-red-500 text-sm mt-4 text-center'>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`mt-6 w-full text-white font-semibold py-2 rounded-lg transition flex items-center justify-center ${
            loading
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? (
            <div className='h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
          ) : (
            'Sign Up'
          )}
        </button>

        <p className='text-sm text-center mt-4 text-gray-600'>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/signin')}
            className='text-indigo-600 font-medium cursor-pointer hover:underline'
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
