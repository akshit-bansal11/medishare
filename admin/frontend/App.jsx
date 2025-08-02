// admin/frontend/App.jsx
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import UsersAdmin from './pages/Users_admin';
import MedicinesAdmin from './pages/Medicines_admin';
import CollectionsAdmin from './pages/Collections_admin';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const checkAuth = async () => {
    try {
      const res = await fetch('http://localhost:5001 /admin/users', {
        headers: { email, password },
      });
      if (res.status === 403) throw new Error();
      setAuthenticated(true);
    } catch {
      setError('You do not have clearance');
    }
  };

  if (!authenticated) {
    return (
      <div className="p-6 max-w-md mx-auto mt-20">
        <h1 className="text-2xl font-semibold mb-4">Admin Login</h1>
        <input
          className="w-full border p-2 mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border p-2 mb-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={checkAuth}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
        >
          Login
        </button>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/admin/users" element={<UsersAdmin email={email} password={password} />} />
        <Route path="/admin/medicines" element={<MedicinesAdmin email={email} password={password} />} />
        <Route path="/admin/collections" element={<CollectionsAdmin email={email} password={password} />} />
        <Route path="/admin" element={<Navigate to="/admin/collections" />} />
        <Route path="*" element={<p className="p-4">Page not found</p>} />
      </Routes>
    </>
  );
}

export default App;
