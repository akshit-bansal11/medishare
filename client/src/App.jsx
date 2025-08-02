import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';

// Auth
import SignUp from './components/Auth/SignUp';
import LogIn from './components/Auth/LogIn';

// Layouts
import NavBar from './layouts/NavBar';
import Footer from './layouts/Footer';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Donate from './pages/medicine/Donate';
import Verification from './pages/Verification';
import Find from './pages/medicine/Find';

// Components
import Profile from './pages/profile/Profile';
import InitialProfile from './pages/profile/InitialProfile';
import RequireVerification from './routeWrappers/requireVerification';
import { server_url } from './config/url';

function App() {
  const [theme, setTheme] = useState('light');

  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    hasProfile: false,
  });

  const location = useLocation();

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const checkUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthStatus({ isAuthenticated: false, hasProfile: false });
        return;
      }

      try {
        const res = await axios.get(server_url + '/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data;
        const hasProfile = !!(
          user.age ||
          user.gender ||
          user.address ||
          user.city ||
          user.contact ||
          user.qualification ||
          user.occupation ||
          user.profilePic
        );

        setAuthStatus({ isAuthenticated: true, hasProfile: true });
      } catch (err) {
        console.error('Error checking profile on load:', err);
        setAuthStatus({ isAuthenticated: false, hasProfile: false });
      }
    };

    checkUserProfile();
  }, []);

  return (
    <div className={theme === 'light' ? 'bg-gray-300 min-h-screen' : 'bg-neutral-900 min-h-screen'}>
      <NavBar theme={theme} toggleTheme={toggleTheme} authStatus={authStatus} location={location} />
      <Routes>
        <Route path="/signup" element={<SignUp theme={theme} />} />
        <Route path="/login" element={<LogIn theme={theme} authStatus={authStatus} />} />
        <Route path="/" element={<Home theme={theme} authStatus={authStatus} />} />
        <Route path="/makeprofile" element={<InitialProfile theme={theme} setAuthStatus={setAuthStatus} />} />
        <Route path="/profile" element={<Profile theme={theme} />} />
        <Route path="/dashboard" element={<Dashboard theme={theme} />} />
        <Route path="/verify" element={<Verification theme={theme} />} />
        <Route path="/donations" element={
            <RequireVerification>
              <Donate theme={theme} />
            </RequireVerification>
        }/>
        <Route path="/find" element={
            <RequireVerification>
              <Find theme={theme}/>
            </RequireVerification>
        }/>
      </Routes>
      <Footer theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
}

export default App;
