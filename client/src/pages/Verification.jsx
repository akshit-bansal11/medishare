import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { server_url } from '../config/url';

export default function Verification({ theme }) {
  const [pidFront, setPidFront] = useState(null);
  const [pidBack, setPidBack] = useState(null);
  const [gidFront, setGidFront] = useState(null);
  const [gidBack, setGidBack] = useState(null);
  const [preview, setPreview] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    if (field === 'pidFront') setPidFront(file);
    if (field === 'pidBack') setPidBack(file);
    if (field === 'gidFront') setGidFront(file);
    if (field === 'gidBack') setGidBack(file);
    setPreview((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
  };

  const handleSubmit = async () => {
    if (!gidFront) {
      alert('Government ID (Front) is required.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      if (pidFront) formData.append('pidFront', pidFront);
      if (pidBack) formData.append('pidBack', pidBack);
      if (gidFront) formData.append('gidFront', gidFront);
      if (gidBack) formData.append('gidBack', gidBack);

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Login required');
        navigate('/login');
        return;
      }

      const res = await axios.post(server_url + '/verify/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setStatus(res.data);
      if (res.data.verificationStatus > 0) {
        localStorage.setItem('justVerified', 'true');
        window.dispatchEvent(new Event('profileSaved'));
        navigate('/donations');
      }
    } catch (err) {
      setStatus({ error: err.response?.data?.error || err.message });
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = (label, field, required = false) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center p-4 rounded-xl shadow-lg backdrop-blur-sm ${
        theme === 'light' ? 'bg-white/70 border border-gray-200/50' : 'bg-neutral-800/70 border border-neutral-700/50'
      }`}
    >
      <label
        className={`mb-2 font-semibold text-lg ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}
      >
        {label} {required && '*'}
      </label>
      <motion.input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageChange(e, field)}
        className={`text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold ${
          theme === 'light' ? 'file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100' : 'file:bg-blue-900/50 file:text-blue-300 hover:file:bg-blue-900/70'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      />
      {preview[field] && (
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          src={preview[field]}
          alt={field}
          className={`mt-3 h-40 w-full object-cover rounded-lg shadow-md border ${
            theme === 'light' ? 'border-blue-100' : 'border-blue-900'
          } ring-2 ring-blue-500/20`}
        />
      )}
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className={`min-h-screen p-6 flex items-center justify-center ${
        theme === 'light' ? 'bg-gradient-to-br from-gray-100 to-gray-200' : 'bg-gradient-to-br from-neutral-900 to-neutral-950'
      }`}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className={`max-w-4xl w-full rounded-3xl shadow-2xl p-8 text-center backdrop-blur-lg ${
          theme === 'light' ? 'bg-white/70 border border-gray-200/50' : 'bg-neutral-800/70 border border-neutral-700/50'
        }`}
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600"
        >
          Identity Verification
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {renderPreview('Personal ID - Front (Optional)', 'pidFront')}
          {renderPreview('Personal ID - Back (Optional)', 'pidBack')}
          {renderPreview('Government ID - Front (Required)', 'gidFront', true)}
          {renderPreview('Government ID - Back (Optional)', 'gidBack')}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={loading}
          className={`mt-8 px-8 py-3 rounded-full font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-t-transparent rounded-full border-white mr-2"
              />
              Verifying...
            </div>
          ) : (
            'Submit Verification'
          )}
        </motion.button>

        {status && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 text-lg font-medium p-4 rounded-xl backdrop-blur-sm bg-white/10"
          >
            {status.error && <span className="text-red-400">{status.error}</span>}
            {status.verified && <span className="text-green-400">✅ Fully Verified</span>}
            {!status.verified && status.verificationStatus === 1 && (
              <span className="text-yellow-400">✔️ Basic Verification Complete</span>
            )}
            {!status.verified && status.verificationStatus === 0 && (
              <span className="text-red-400">❌ Verification Failed</span>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
