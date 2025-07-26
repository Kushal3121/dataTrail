import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoleProvider } from './context/RoleContext';
import { AuthProvider } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import DashboardLayout from './layout/DashboardLayout';
import UploadPage from './pages/dashboard/UploadPage';
import TransformPage from './pages/dashboard/TransformPage';
import NormalizePage from './pages/dashboard/NormalizePage';
import AggregatePage from './pages/dashboard/AggregatePage';
import LogPage from './pages/dashboard/LogPage';
import VerifyPage from './pages/dashboard/VerifyPage';

// TEMP placeholder for dashboard
const Dashboard = () => (
  <h1 className='text-center text-2xl mt-10'>Dashboard Page</h1>
);

function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <Router>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/signup' element={<SignUpPage />} />
            <Route path='/signin' element={<SignInPage />} />
            <Route path='/dashboard' element={<DashboardLayout />}>
              <Route path='upload' element={<UploadPage />} />
              <Route path='transform' element={<TransformPage />} />
              <Route path='normalize' element={<NormalizePage />} />
              <Route path='aggregate' element={<AggregatePage />} />
              <Route path='log' element={<LogPage />} />
              <Route path='verify' element={<VerifyPage />} />
            </Route>
          </Routes>
        </Router>
      </RoleProvider>
    </AuthProvider>
  );
}

export default App;
