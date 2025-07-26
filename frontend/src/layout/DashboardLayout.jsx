import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  // Show loader while auth is being checked
  if (isLoading) {
    return (
      <div className='h-screen flex items-center justify-center bg-gray-100'>
        <div className='animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full'></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='h-screen flex items-center justify-center bg-gray-100 text-gray-700 text-xl'>
        You are not logged in.{' '}
        <span
          onClick={() => navigate('/signin')}
          className='ml-2 underline cursor-pointer text-indigo-600'
        >
          Go to Sign In
        </span>
      </div>
    );
  }

  const navItems = [
    { to: 'upload', label: '📁 Upload', roles: ['Admin'] },
    { to: 'transform', label: '🔄 Transform', roles: ['Admin', 'Analyst'] },
    { to: 'normalize', label: '📉 Normalize', roles: ['Admin', 'Analyst'] },
    { to: 'aggregate', label: '📊 Aggregate', roles: ['Admin', 'Analyst'] },
    { to: 'log', label: '📜 Logs', roles: ['Admin', 'Analyst', 'Viewer'] },
    { to: 'verify', label: '✅ Verify', roles: ['Admin', 'Analyst'] },
  ];

  return (
    <div className='flex h-screen bg-gray-100 text-gray-900'>
      {/* Sidebar */}
      <aside className='w-64 bg-indigo-900 text-white p-6 space-y-4'>
        <h1 className='text-2xl font-bold mb-6'>DataTrail</h1>
        {navItems.map(
          (item) =>
            item.roles.includes(user.role) && (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-indigo-700' : 'hover:bg-indigo-800'
                  }`
                }
              >
                {item.label}
              </NavLink>
            )
        )}
        <button
          onClick={() => {
            signOut();
            navigate('/signin');
          }}
          className='mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md text-sm'
        >
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className='flex-1 p-6 overflow-y-auto'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>Dashboard</h2>
          <div className='text-sm text-gray-500'>
            Logged in as: <span className='font-semibold'>{user?.role}</span>
          </div>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
