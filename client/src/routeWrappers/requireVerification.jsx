import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { server_url } from '../config/url';

export default function RequireVerification({ children }) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();

  const checkVerification = async (retries = 3, delay = 1000) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to /login');
      navigate('/login');
      setChecking(false);
      return;
    }

    for (let i = 0; i < retries; i++) {
      try {
        const res = await axios.get(server_url + '/users/profile-status', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Profile status response:', {
          attempt: i + 1,
          status: res.status,
          data: res.data,
          verificationStatus: res.data?.verificationStatus,
        });

        // Check if response is HTML
        if (typeof res.data === 'string' && res.data.includes('<!doctype html>')) {
          console.error('Received HTML instead of JSON, likely a misconfigured API request');
          throw new Error('Invalid response format: HTML received');
        }

        const status = res.data?.verificationStatus ?? 0;

        if (status === 0) {
          console.log('Verification status is 0, redirecting to /verify');
          navigate('/verify');
        } else if (localStorage.getItem('justVerified') === 'true') {
          console.log('Just verified, redirecting to /donations');
          localStorage.removeItem('justVerified');
          setAllowed(true);
          navigate('/donations');
        } else {
          console.log('Verification status is', status, 'allowing access');
          setAllowed(true);
        }
        setChecking(false);
        return;
      } catch (err) {
        console.error('Error fetching profile status:', {
          attempt: i + 1,
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        if (err.response?.status === 404 || err.message.includes('Invalid response format')) {
          console.log('Profile not found or invalid response, redirecting to /verify');
          navigate('/verify');
          setChecking(false);
          return;
        }
        if (i === retries - 1) {
          console.log('Max retries reached, redirecting to /login');
          navigate('/login');
          setChecking(false);
        } else {
          console.log(`Retrying after ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  };

  useEffect(() => {
    checkVerification();
    const handleProfileSaved = () => {
      console.log('Profile saved event triggered, rechecking verification');
      checkVerification();
    };
    window.addEventListener('profileSaved', handleProfileSaved);
    return () => window.removeEventListener('profileSaved', handleProfileSaved);
  }, [navigate]);

  if (checking) return <div className="p-6 text-center">Checking verification...</div>;
  return allowed ? children : null;
}