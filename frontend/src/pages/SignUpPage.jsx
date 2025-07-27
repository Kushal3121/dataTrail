import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RoleDropdown from '../components/RoleDropdown';

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
  const [selectedRole, setSelectedRole] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setForm((prev) => ({ ...prev, role: selectedRole }));
  }, [selectedRole]);

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
    <div className='min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-gray-100 px-4'>
      <div className='bg-white shadow-2xl rounded-xl p-10 w-full max-w-xl text-gray-800'>
        <h2 className='text-3xl font-extrabold mb-6 text-center text-indigo-700'>
          Create an Account
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <input
            type='text'
            name='firstName'
            placeholder='First Name'
            onChange={handleChange}
            disabled={loading}
            className='p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />
          <input
            type='text'
            name='lastName'
            placeholder='Last Name'
            onChange={handleChange}
            disabled={loading}
            className='p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />
          <input
            type='text'
            name='username'
            placeholder='Username'
            onChange={handleChange}
            disabled={loading}
            className='p-3 border rounded-lg sm:col-span-2 shadow focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />
          <input
            type='password'
            name='password'
            placeholder='Password'
            onChange={handleChange}
            disabled={loading}
            className='p-3 border rounded-lg sm:col-span-2 shadow focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />
          <input
            type='text'
            name='organization'
            placeholder='Organization'
            onChange={handleChange}
            disabled={loading}
            className='p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />
          <input
            type='text'
            name='address'
            placeholder='Address'
            onChange={handleChange}
            disabled={loading}
            className='p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />

          <div className='sm:col-span-2'>
            <RoleDropdown
              selected={selectedRole}
              setSelected={setSelectedRole}
            />
          </div>
        </div>

        {error && (
          <p className='text-red-500 text-sm mt-4 text-center'>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`mt-6 w-full text-white font-semibold py-3 rounded-lg transition flex items-center justify-center shadow-lg ${
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
