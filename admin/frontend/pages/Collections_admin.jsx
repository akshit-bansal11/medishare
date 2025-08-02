import React, { useEffect, useState } from 'react';

export default function CollectionsAdmin({ email, password }) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCollections = async () => {
    try {
      const res = await fetch('http://localhost:5001 /admin/collections', {
        headers: { email, password }
      });
      const data = await res.json();
      setCollections(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch collections:', err);
    }
  };

  const clearCollection = async (name) => {
    try {
      await fetch(`http://localhost:5001 /admin/collections/${name}/clear`, {
        method: 'DELETE',
        headers: { email, password }
      });
      fetchCollections();
    } catch (err) {
      console.error('Failed to clear collection:', err);
    }
  };

  const deleteCollection = async (name) => {
    try {
      await fetch(`http://localhost:5001 /admin/collections/${name}`, {
        method: 'DELETE',
        headers: { email, password }
      });
      fetchCollections();
    } catch (err) {
      console.error('Failed to delete collection:', err);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  if (loading) return <p className="p-4">Loading collections...</p>;

  return (
    <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {collections.map((name) => (
        <div key={name} className="border rounded-xl shadow-lg p-4 bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold capitalize">{name}</h2>
          <div className="mt-3 flex gap-3">
            <button
              onClick={() => clearCollection(name)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
            >
              Clear
            </button>
            <button
              onClick={() => deleteCollection(name)}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
