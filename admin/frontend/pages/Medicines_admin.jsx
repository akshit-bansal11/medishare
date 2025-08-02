import React, { useEffect, useState } from 'react';

export default function MedicinesAdmin({ email, password }) {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMedicines = async () => {
    try {
      const res = await fetch('http://localhost:5001 /admin/medicines', {
        headers: { email, password },
      });
      const data = await res.json();
      setMedicines(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch medicines:', err);
    }
  };

  const deleteMedicine = async (medicineId) => {
    try {
      await fetch(`http://localhost:5001 /admin/medicine/${medicineId}`, {
        method: 'DELETE',
        headers: { email, password },
      });
      fetchMedicines();
    } catch (err) {
      console.error('Failed to delete medicine:', err);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  if (loading) return <p className="p-4">Loading medicines...</p>;

  return (
    <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {medicines.map((med) => (
        <div key={med._id} className="border rounded-xl shadow-lg p-4 bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold">{med.name}</h2>
          <p>Brand: {med.brand || 'N/A'}</p>
          <p>Type: {med.itemType || 'N/A'}</p>
          <p>Category: {med.itemCategory || 'N/A'}</p>
          <p>Quantity: {med.quantity}</p>
          <p>Expiry: {new Date(med.expiryDate).toLocaleDateString()}</p>
          {med.imageUrl && (
            <img src={med.imageUrl} alt="Medicine" className="w-full h-32 object-contain my-2" />
          )}
          <hr className="my-2" />
          <p className="text-sm text-gray-700">
            Donor: {med.userId?.name || 'Unknown'} ({med.userId?.email || 'N/A'})
          </p>
          <div className="mt-3">
            <button
              onClick={() => deleteMedicine(med._id)}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Delete Medicine
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
