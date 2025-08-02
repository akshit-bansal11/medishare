import React, { useEffect, useState } from 'react';

export default function UsersAdmin({ email, password }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5001 /admin/users', {
        headers: { email, password },
      });
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const blockUser = async (userId) => {
    try {
      await fetch(`http://localhost:5001 /admin/block-user/${userId}`, {
        method: 'POST',
        headers: { email, password },
      });
      fetchUsers();
    } catch (err) {
      console.error('Failed to block user:', err);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await fetch(`http://localhost:5001 /admin/user/${userId}`, {
        method: 'DELETE',
        headers: { email, password },
      });
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const deleteProfile = async (userId) => {
    try {
      await fetch(`http://localhost:5001 /admin/profile/${userId}`, {
        method: 'DELETE',
        headers: { email, password },
      });
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete profile:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="p-4">Loading users...</p>;

  return (
    <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <div key={user._id} className="border rounded-xl shadow-lg p-4 bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p>Email: {user.email}</p>
          <p>Status: {user.status === 0 ? 'Blocked' : 'Active'}</p>
          <p>City: {user.city}</p>
          <p>Contact: {user.contact}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => blockUser(user._id)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
            >
              Block User
            </button>
            <button
              onClick={() => deleteUser(user._id)}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Delete User
            </button>
            <button
              onClick={() => deleteProfile(user._id)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
            >
              Delete Profile
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
