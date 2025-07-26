import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  UploadCloud,
  RefreshCw,
  SlidersHorizontal,
  BarChart3,
  FileText,
  ShieldCheck,
  LogOut,
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

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
    {
      to: 'upload',
      label: 'Upload',
      icon: <UploadCloud size={18} />,
      roles: ['Admin'],
    },
    {
      to: 'transform',
      label: 'Transform',
      icon: <RefreshCw size={18} />,
      roles: ['Admin', 'Analyst'],
    },
    {
      to: 'normalize',
      label: 'Normalize',
      icon: <SlidersHorizontal size={18} />,
      roles: ['Admin', 'Analyst'],
    },
    {
      to: 'aggregate',
      label: 'Aggregate',
      icon: <BarChart3 size={18} />,
      roles: ['Admin', 'Analyst'],
    },
    {
      to: 'log',
      label: 'Logs',
      icon: <FileText size={18} />,
      roles: ['Admin', 'Analyst', 'Viewer'],
    },
    {
      to: 'verify',
      label: 'Verify',
      icon: <ShieldCheck size={18} />,
      roles: ['Admin', 'Analyst'],
    },
  ];

  return (
    <div className='flex h-screen bg-gray-100 text-gray-900'>
      {/* Sidebar */}
      <aside className='w-64 bg-gradient-to-b from-[#1e293b] to-[#0f172a] text-gray-100 p-6 space-y-4 shadow-lg border-r border-gray-800'>
        <h1 className='text-2xl font-bold mb-6 text-center text-white'>
          DataTrail
        </h1>
        <nav className='space-y-1'>
          {navItems.map(
            (item) =>
              item.roles.includes(user.role) && (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#334155] text-white'
                        : 'hover:bg-[#1e293b] hover:text-white text-gray-300'
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              )
          )}
        </nav>

        <button
          onClick={() => {
            signOut();
            navigate('/signin');
          }}
          className='mt-10 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md text-sm font-semibold transition'
        >
          <LogOut size={16} /> Sign Out
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
