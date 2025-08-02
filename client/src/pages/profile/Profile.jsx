import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  FaUser,
  FaEnvelope,
  FaBirthdayCake,
  FaVenusMars,
  FaMapMarkerAlt,
  FaGlobeAmericas,
  FaMapPin,
  FaCity,
  FaPhone,
  FaGraduationCap,
  FaBriefcase,
} from 'react-icons/fa';

export default function Profile({ theme }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get('/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load profile.');
        setLoading(false);
        if (err.response?.status === 403) navigate('/login');
      });
  }, [navigate]);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === 'light' ? 'bg-gradient-to-br from-gray-100 to-gray-200' : 'bg-gradient-to-br from-neutral-900 to-neutral-950'
        }`}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className={`w-12 h-12 border-4 border-t-transparent rounded-full ${
            theme === 'light' ? 'border-blue-500' : 'border-blue-400'
          }`}
        ></motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`ml-4 text-xl font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
        >
          Loading profile...
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === 'light' ? 'bg-gradient-to-br from-gray-100 to-gray-200' : 'bg-gradient-to-br from-neutral-900 to-neutral-950'
        }`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center backdrop-blur-md bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20"
        >
          <p className="text-red-400 text-xl font-semibold">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className={`mt-6 px-6 py-3 rounded-full font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transition-all duration-300 ${
              theme === 'light' ? 'hover:from-blue-600 hover:to-blue-700' : 'hover:from-blue-400 hover:to-blue-500'
            }`}
          >
            Go to Login
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`min-h-screen p-6 flex items-center justify-center ${
        theme === 'light' ? 'bg-gradient-to-br from-gray-100 to-gray-200' : 'bg-gradient-to-br from-neutral-900 to-neutral-950'
      }`}
    >
      <motion.div
        whileHover={{
          scale: 1.02,
          boxShadow: theme === 'light' ? '0 0 25px rgba(59, 130, 246, 0.3)' : '0 0 25px rgba(255, 174, 18, 0.3)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className={`max-w-3xl w-full rounded-3xl shadow-2xl p-10 flex flex-col gap-8 items-center backdrop-blur-lg ${
          theme === 'light' ? 'bg-white/70' : 'bg-neutral-800/70'
        }`}
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className={`text-5xl font-bold tracking-tight bg-clip-text text-transparent ${
            theme === 'light' ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gradient-to-r from-amber-400 to-amber-600'
          }`}
        >
          Your Profile
        </motion.h2>

        {user.profilePic && (
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            src={user.profilePic}
            alt="Profile"
            className={`h-36 w-36 object-cover rounded-full border-4 ${
              theme === 'light' ? 'border-blue-400' : 'border-amber-400'
            }`}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <ProfileItem icon={<FaUser />} value={user.name} theme={theme} />
          <ProfileItem icon={<FaEnvelope />} value={user.email} theme={theme} />
          <ProfileItem icon={<FaBirthdayCake />} value={user.dob || user.age} theme={theme} />
          <ProfileItem icon={<FaVenusMars />} value={user.gender} theme={theme} />
          <ProfileItem icon={<FaMapMarkerAlt />} value={user.address} theme={theme} />
          <ProfileItem icon={<FaGlobeAmericas />} value={user.country} theme={theme} />
          <ProfileItem icon={<FaMapPin />} value={user.state} theme={theme} />
          <ProfileItem icon={<FaCity />} value={user.city} theme={theme} />
          <ProfileItem icon={<FaPhone />} value={user.contact} theme={theme} />
          <ProfileItem icon={<FaGraduationCap />} value={user.qualification} theme={theme} />
          <ProfileItem icon={<FaBriefcase />} value={user.occupation} theme={theme} />
        </div>

        <div className="flex space-x-4 mt-10">
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: theme === 'light' ? '0 0 15px rgba(59, 130, 246, 0.5)' : '0 0 25px rgba(255, 174, 18, 0.3)',
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/makeprofile')}
            className={`px-8 py-3 rounded-full font-medium shadow-lg transition-colors duration-100 ${
              theme === 'light' ? 'text-white bg-blue-500' : 'text-black bg-amber-400'
            }`}
          >
            Edit Profile
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 41, 41, 0.8)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              localStorage.clear();
              navigate('/');
            }}
            className={`px-8 py-3 rounded-full font-medium bg-red-500 text-white shadow-lg transition-colors duration-100 ${
              theme === 'light' ? 'bg-red-500' : 'bg-red-500'
            }`}
          >
            Log Out
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProfileItem({ icon, value, theme }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.1 }}
      whileHover={{
        scale: 1.03,
        backgroundColor: theme === 'light' ? 'rgba(229, 231, 235, 0.8)' : 'rgba(31, 41, 55, 0.8)',
      }}
      className={`flex items-center px-4 py-4 rounded-xl shadow-lg backdrop-blur-sm ${
        theme === 'light' ? 'bg-gray-100/80 text-gray-900 border border-gray-200/50' : 'bg-neutral-900/80 text-gray-100 border border-neutral-700/50'
      }`}
    >
      <motion.span
        className={`text-xl mr-4 ${theme === 'light' ? 'text-blue-500' : 'text-amber-400'}`}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.span>
      <span className="text-lg font-medium">{value || '—'}</span>
    </motion.div>
  );
}
