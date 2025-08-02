import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaPlus, FaTrash, FaCamera, FaSpinner, FaEdit } from 'react-icons/fa';
import { server_url } from '../../config/url';

const itemData = {
  "Tablets": ["Analgesics (Pain Killers): Medications for pain relief (e.g., ibuprofen, paracetamol, aspirin).", "Antibiotics: Treat bacterial infections (e.g., amoxicillin, azithromycin).", "Antipyretics: Reduce fever (e.g., paracetamol, ibuprofen).", "Anti-inflammatories: Reduce inflammation (e.g., ibuprofen, naproxen).", "Antacids: Neutralize stomach acid (e.g., omeprazole, ranitidine).", "Antihistamines: Treat allergies and allergic reactions (e.g., cetirizine, loratadine).", "Antidepressants: Manage depression and mood disorders (e.g., sertraline, fluoxetine).", "Antianxiety Medications: Reduce anxiety (e.g., diazepam, lorazepam).", "Antipsychotics: Treat psychiatric conditions like schizophrenia (e.g., risperidone, olanzapine).", "Antihypertensives: Control high blood pressure (e.g., amlodipine, lisinopril).", "Antidiabetics: Manage blood sugar levels (e.g., metformin, glipizide).", "Anticonvulsants: Prevent or control seizures (e.g., levetiracetam, carbamazepine).", "Anticoagulants: Prevent blood clots (e.g., warfarin, apixaban).", "Antivirals: Treat viral infections (e.g., oseltamivir, acyclovir).", "Antifungals: Treat fungal infections (e.g., fluconazole, terbinafine).", "Statins: Lower cholesterol levels (e.g., atorvastatin, simvastatin).", "Bronchodilators: Relieve asthma or COPD symptoms (e.g., salbutamol, tiotropium).", "Diuretics: Increase urine output to reduce fluid buildup (e.g., furosemide, hydrochlorothiazide).", "Hormonal Medications: Manage hormonal imbalances (e.g., levothyroxine, oral contraceptives).", "Immunosuppressants: Suppress immune response (e.g., cyclosporine, tacrolimus).", "Antiemetics: Prevent nausea and vomiting (e.g., ondansetron, metoclopramide).", "Muscle Relaxants: Relieve muscle spasms (e.g., cyclobenzaprine, baclofen).", "Antispasmodics: Reduce muscle or organ spasms (e.g., hyoscine, dicyclomine).", "Antimigraine Medications: Treat migraines (e.g., sumatriptan, rizatriptan).", "Antiretrovirals: Manage HIV/AIDS (e.g., tenofovir, efavirenz)."],
  "Syrups": ["Analgesic Syrups: Relieve pain (e.g., paracetamol syrup, ibuprofen syrup).", "Antipyretic Syrups: Reduce fever (e.g., paracetamol syrup, mefenamic acid syrup).", "Antihistamine Syrups: Treat allergies and cold symptoms (e.g., cetirizine syrup, diphenhydramine syrup).", "Cough Suppressant Syrups: Reduce cough (e.g., dextromethorphan syrup, codeine syrup).", "Expectorant Syrups: Help loosen mucus (e.g., guaifenesin syrup, ambroxol syrup).", "Antacid Syrups: Neutralize stomach acid (e.g., aluminum hydroxide syrup, magnesium hydroxide syrup).", "Antibiotic Syrups: Treat bacterial infections (e.g., amoxicillin syrup, erythromycin syrup).", "Antiviral Syrups: Treat viral infections (e.g., oseltamivir syrup).", "Antifungal Syrups: Treat fungal infections (e.g., nystatin oral suspension).", "Antiemetic Syrups: Prevent nausea and vomiting (e.g., ondansetron syrup).", "Laxative Syrups: Relieve constipation (e.g., lactulose syrup, polyethylene glycol syrup).", "Bronchodilator Syrups: Relieve asthma or respiratory issues (e.g., salbutamol syrup).", "Vitamin Supplement Syrups: Address nutritional deficiencies (e.g., multivitamin syrup, vitamin D syrup).", "Antispasmodic Syrups: Reduce muscle or intestinal spasms (e.g., dicyclomine syrup).", "Antidiarrheal Syrups: Control diarrhea (e.g., loperamide syrup)."],
  "Injections": ["Analgesic Injections: Relieve pain (e.g., diclofenac injection, tramadol injection).", "Antibiotic Injections: Treat bacterial infections (e.g., ceftriaxone injection, ampicillin injection).", "Antipyretic Injections: Reduce fever (e.g., paracetamol injection).", "Anti-inflammatory Injections: Reduce inflammation (e.g., methylprednisolone injection, ketorolac injection).", "Antiemetic Injections: Prevent nausea and vomiting (e.g., ondansetron injection, metoclopramide injection).", "Antihistamine Injections: Treat allergic reactions (e.g., promethazine injection, diphenhydramine injection).", "Anticoagulant Injections: Prevent blood clots (e.g., heparin injection, enoxaparin injection).", "Antiviral Injections: Treat viral infections (e.g., gancicivlovir injection).", "Antifungal Injections: Treat fungal infections (e.g., amphotericin B injection).", "Insulin Injections: Manage blood sugar levels (e.g., insulin glargine, insulin aspart).", "Vaccine Injections: Prevent diseases (e.g., influenza vaccine, hepatitis B vaccine).", "Anesthetic Injections: Numb specific areas (e.g., lidocaine injection, bupivacaine injection).", "Anticonvulsant Injections: Control seizures (e.g., lorazepam injection, phenytoin injection).", "Hormonal Injections: Manage hormonal imbalances (e.g., medroxyprogesterone injection, testosterone injection).", "Vitamin Injections: Address nutritional deficiencies (e.g., vitamin B12 injection, vitamin D injection).", "EpiPen/Auvi-Q"],
  "Supplies": ["Adhesive Bandages: Cover and protect minor cuts and scrapes (e.g., Band-Aid, adhesive strips).", "Gauze Pads: Absorb blood and protect wounds (e.g., sterile gauze, non-stick gauze).", "Medical Tape: Secure bandages or dressings (e.g., micropore tape, surgical tape).", "Disposable Syringes: Administer medications or draw fluids (e.g., insulin syringes, standard syringes).", "Alcohol Swabs: Disinfect skin or surfaces (e.g., isopropyl alcohol wipes).", "Cotton Balls: Apply antiseptics or clean wounds (e.g., sterile cotton balls).", "Disposable Gloves: Ensure hygiene during procedures (e.g., nitrile gloves, latex gloves).", "Sterile Dressings: Cover and protect larger wounds (e.g., hydrocolloid dressings, foam dressings).", "Adhesive Wound Closures: Close small cuts without stitches (e.g., butterfly bandages, Steri-Strips).", "Disposable Needles: Used with syringes for injections (e.g., hypodermic needles).", "Antiseptic Wipes: Cleanse wounds to prevent infection (e.g., benzalkonium chloride wipes).", "Medical Cotton Swabs: Apply ointments or clean small areas (e.g., single-use applicators)."],
  "Tools": ["Wheelchairs", "Walkers", "Stethoscopes", "Ankle Braces", "Crutches", "Blood Pressure Monitors", "Thermometers", "Pulse Oximeters", "Nebulizers", "Cervical Collars", "Knee Braces", "Back Braces", "Canes", "Glucometers", "Hearing Aids"]
};

// Reusable Floating Label Input Component
const FloatingLabelInput = ({ theme, label, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = props.value && props.value !== '';

  const commonInputClasses = `peer w-full p-3 pt-6 rounded-lg border outline-none transition-all ${
    theme === 'light' 
      ? 'bg-white/50 border-gray-300 text-black focus:border-blue-500' 
      : 'bg-neutral-700/50 border-neutral-600 text-white focus:border-amber-400'
  }`;

  return (
    <div className="relative">
      <input
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={commonInputClasses}
        placeholder=" "
        {...props}
      />
      <label
        className={`absolute left-3 transition-all duration-200 ease-in-out pointer-events-none
          ${isFocused || hasValue ? 'top-1 text-xs' : 'top-4 text-base'}
          ${theme === 'light' ? (isFocused ? 'text-blue-500' : 'text-gray-500') : (isFocused ? 'text-amber-400' : 'text-gray-400')}
        `}
      >
        {label}
      </label>
    </div>
  );
};

// Reusable Floating Label Select Component
const FloatingLabelSelect = ({ theme, label, children, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = props.value && props.value !== '';

  const commonSelectClasses = `peer w-full p-3 pt-6 rounded-lg border outline-none transition-all appearance-none ${
    theme === 'light' 
      ? 'bg-white/50 border-gray-300 text-black focus:border-blue-500' 
      : 'bg-neutral-700/50 border-neutral-600 text-white focus:border-amber-400'
  }`;

  return (
    <div className="relative">
      <select
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={commonSelectClasses}
        {...props}
      >
        {children}
      </select>
      <label
        className={`absolute left-3 transition-all duration-200 ease-in-out pointer-events-none
          ${(isFocused || hasValue) ? 'top-1 text-xs' : 'top-4 text-base'}
          ${theme === 'light' ? (isFocused ? 'text-blue-500' : 'text-gray-500') : (isFocused ? 'text-amber-400' : 'text-gray-400')}
        `}
      >
        {label}
      </label>
       <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 fill-current text-gray-400" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
      </div>
    </div>
  );
};


export default function Donate({ theme }) {
  const [medicines, setMedicines] = useState([
    { name: '', brand: '', expiryDate: '', quantity: 1, image: null, previewImage: null, itemType: 'Tablets', itemCategory: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [yourDonations, setYourDonations] = useState([]);
  const [editingDonation, setEditingDonation] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchYourDonations();
  }, []);

  const fetchYourDonations = async () => {
    try {
      const res = await axios.get(server_url + '/medicines/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setYourDonations(res.data);
    } catch (err) {
      console.error('Error fetching donations:', err);
      setMessage('Error fetching your donations');
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = field === 'quantity' ? parseInt(value) || 1 : value;

    if (field === 'itemType') {
        updated[index].itemCategory = ''; // Reset category when type changes
    }

    setMedicines(updated);
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    const updated = [...medicines];
    updated[index].image = file;
    updated[index].previewImage = file ? URL.createObjectURL(file) : null;
    setMedicines(updated);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    setEditingDonation({
      ...editingDonation,
      image: file,
      previewImage: file ? URL.createObjectURL(file) : editingDonation.previewImage
    });
  };

  const handleEditChange = (field, value) => {
    const updatedValue = field === 'quantity' ? parseInt(value) || 1 : value;
    const updatedDonation = { ...editingDonation, [field]: updatedValue };

    if (field === 'itemType') {
        updatedDonation.itemCategory = '';
    }
    
    setEditingDonation(updatedDonation);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', brand: '', expiryDate: '', quantity: 1, image: null, previewImage: null, itemType: 'Tablets', itemCategory: '' }]);
  };

  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const clearForm = () => {
    setMedicines([{ name: '', brand: '', expiryDate: '', quantity: 1, image: null, previewImage: null, itemType: 'Tablets', itemCategory: '' }]);
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage('Please login to donate medicines');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify({ medicines: medicines.map(({ image, previewImage, ...rest }) => rest) }));
      medicines.forEach((med, idx) => {
        if (med.image) {
          formData.append(`image${idx}`, med.image);
        }
      });
      const res = await axios.post(server_url + '/medicines/donate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setMessage(res.data.message);
      clearForm();
      fetchYourDonations();
    } catch (err) {
      console.error('Donation error:', err);
      setMessage(
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.details ||
        'Failed to donate medicines.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this donation?')) return;
    
    try {
      setLoading(true);
      await axios.delete(`/medicines/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Donation deleted successfully');
      fetchYourDonations();
    } catch (err) {
      console.error('Delete error:', err);
      setMessage('Failed to delete donation');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (donation) => {
    setEditingDonation({
      id: donation._id,
      name: donation.name,
      brand: donation.brand || '',
      expiryDate: donation.expiryDate ? new Date(donation.expiryDate).toISOString().split('T')[0] : '',
      quantity: donation.quantity,
      image: null,
      previewImage: donation.imageUrl || null,
      itemType: donation.itemType || 'Tablets',
      itemCategory: donation.itemCategory || ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage('Please login to edit donations');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify({
        medicines: [{
          name: editingDonation.name,
          brand: editingDonation.brand || '',
          expiryDate: editingDonation.expiryDate,
          quantity: editingDonation.quantity,
          itemType: editingDonation.itemType,
          itemCategory: editingDonation.itemCategory
        }],
      }));
      
      if (editingDonation.image) {
        formData.append('image', editingDonation.image);
      }

      const response = await axios.put(
        `/medicines/${editingDonation.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message || 'Donation updated successfully');
      setEditingDonation(null);
      fetchYourDonations();
    } catch (err) {
      console.error('Edit error:', err.response?.data || err.message);
      setMessage(
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.error ||
        err.response?.data?.details ||
        'Failed to update donation. Please check the form and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const closeEditModal = () => {
    setEditingDonation(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen p-6 flex flex-col items-center ${
        theme === 'light' 
          ? 'bg-gradient-to-b from-gray-100 to-gray-200' 
          : 'bg-gradient-to-b from-neutral-900 to-neutral-800'
      }`}
    >
      <h2 className={`text-4xl font-extrabold mb-10 ${
        theme === 'light' ? 'text-blue-500' : 'text-amber-400'
      }`}>
        Donate Medicines
      </h2>

      <AnimatePresence>
        {message && (
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-6 px-6 py-3 rounded-full text-lg font-medium ${
              message.includes('success')
                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                : 'bg-red-500/20 text-red-400 border border-red-500/50'
            } backdrop-blur-sm`}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>

      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-3xl rounded-2xl shadow-2xl p-8 backdrop-blur-lg ${
          theme === 'light'
            ? 'bg-white/30 border border-white/20'
            : 'bg-neutral-800/30 border border-neutral-700/20'
        }`}
      >
        <AnimatePresence>
          {medicines.map((med, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-gray-200/50 dark:border-neutral-700/50 rounded-xl p-6 mb-6 relative bg-white/20 dark:bg-neutral-800/20 backdrop-blur-md"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <FloatingLabelInput
                  theme={theme}
                  label="Medicine Name"
                  type="text"
                  value={med.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  required
                />
                <FloatingLabelInput
                  theme={theme}
                  label="Brand (optional)"
                  type="text"
                  value={med.brand}
                  onChange={(e) => handleChange(index, 'brand', e.target.value)}
                />
                <FloatingLabelSelect
                  theme={theme}
                  label="Item Type"
                  value={med.itemType}
                  onChange={(e) => handleChange(index, 'itemType', e.target.value)}
                >
                  {Object.keys(itemData).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                  <option value="Other">Other</option>
                </FloatingLabelSelect>

                <FloatingLabelSelect
                  theme={theme}
                  label="Item Category"
                  value={med.itemCategory}
                  onChange={(e) => handleChange(index, 'itemCategory', e.target.value)}
                  disabled={!med.itemType || med.itemType === "Other"}
                >
                  <option value="">Select a category</option>
                  {med.itemType && itemData[med.itemType] && itemData[med.itemType].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                   <option value="Other">Other</option>
                </FloatingLabelSelect>

                <FloatingLabelInput
                  theme={theme}
                  label="Expiry Date"
                  type="date"
                  value={med.expiryDate}
                  onChange={(e) => handleChange(index, 'expiryDate', e.target.value)}
                  required
                />
                <FloatingLabelInput
                  theme={theme}
                  label="Quantity"
                  type="number"
                  value={med.quantity}
                  onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                  min={1}
                  required
                />
              </div>
              <div className="mt-6">
                <label className={`mb-2 text-sm font-medium flex items-center gap-2 ${
                  theme === 'light'
                  ? 'text-black'
                  : 'text-white'
                }`}>
                  <FaCamera /> Medicine Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(index, e)}
                  className={`w-full p-3 rounded-lg border ${
                    theme === 'light' 
                      ? 'bg-white/50 border-gray-200 file:bg-blue-500 hover:file:bg-blue-600 text-black file:text-white' 
                      : 'bg-neutral-700/50 border-neutral-600 file:bg-amber-400 hover:file:bg-amber-500 text-white file:text-black'
                  } file:mr-4 file:py-2 file:px-4 file:rounded-full transition-all duration-300`}
                />
                {med.previewImage && (
                  <motion.div
                    className="mt-4 flex justify-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={med.previewImage}
                      alt={`Preview ${index + 1}`}
                      className="h-48 w-48 object-cover rounded-xl border shadow-lg hover:scale-105 transition-transform"
                    />
                  </motion.div>
                )}
              </div>
              {medicines.length > 1 && (
                <motion.button
                  type="button"
                  onClick={() => removeMedicine(index)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTrash size={20} />
                </motion.button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="flex gap-4 mt-6">
          <motion.button
            type="button"
            onClick={addMedicine}
            className={`flex-1 py-3 rounded-full font-semibold flex items-center justify-center gap-2 ${
              theme === 'light' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-amber-400 hover:bg-amber-500 text-black'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus /> Add Another
          </motion.button>
          <motion.button
            type="button"
            onClick={clearForm}
            className="flex-1 py-3 rounded-full font-semibold bg-gray-300 text-gray-700 dark:bg-neutral-600 dark:text-white flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear
          </motion.button>
        </div>

        <motion.button
          type="submit"
          disabled={loading || !token}
          className={`w-full py-4 mt-6 rounded-full font-semibold text-lg flex items-center justify-center gap-2 ${
            loading || !token
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : theme === 'light'
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-amber-400 text-black hover:bg-amber-500'
          }`}
          whileHover={{ scale: loading || !token ? 1 : 1.05 }}
          whileTap={{ scale: loading || !token ? 1 : 0.95 }}
        >
          {loading ? <FaSpinner className="animate-spin" /> : null}
          {loading ? 'Submitting...' : 'Submit Donation'}
        </motion.button>
      </form>

      {editingDonation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`w-full max-w-md rounded-2xl p-6 ${
              theme === 'light'
                ? 'bg-white/90 border border-white/20'
                : 'bg-neutral-800/90 border border-neutral-700/20'
            } backdrop-blur-lg`}
          >
            <h3 className={`text-2xl font-bold mb-4 ${
              theme === 'light' ? 'text-blue-500' : 'text-amber-400'
            }`}>
              Edit Donation
            </h3>
            <form onSubmit={handleEditSubmit}>
              <div className="grid gap-6">
                <FloatingLabelInput
                  theme={theme}
                  label="Medicine Name"
                  type="text"
                  value={editingDonation.name}
                  onChange={(e) => handleEditChange('name', e.target.value)}
                  required
                />
                <FloatingLabelInput
                  theme={theme}
                  label="Brand (optional)"
                  type="text"
                  value={editingDonation.brand}
                  onChange={(e) => handleEditChange('brand', e.target.value)}
                />
                 <FloatingLabelSelect
                  theme={theme}
                  label="Item Type"
                  value={editingDonation.itemType}
                  onChange={(e) => handleEditChange('itemType', e.target.value)}
                >
                  {Object.keys(itemData).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                  <option value="Other">Other</option>
                </FloatingLabelSelect>

                <FloatingLabelSelect
                  theme={theme}
                  label="Item Category"
                  value={editingDonation.itemCategory}
                  onChange={(e) => handleEditChange('itemCategory', e.target.value)}
                  disabled={!editingDonation.itemType || editingDonation.itemType === "Other"}
                >
                  <option value="">Select a category</option>
                  {editingDonation.itemType && itemData[editingDonation.itemType] && itemData[editingDonation.itemType].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                   <option value="Other">Other</option>
                </FloatingLabelSelect>
                <FloatingLabelInput
                  theme={theme}
                  label="Expiry Date"
                  type="date"
                  value={editingDonation.expiryDate}
                  onChange={(e) => handleEditChange('expiryDate', e.target.value)}
                  required
                />
                <FloatingLabelInput
                  theme={theme}
                  label="Quantity"
                  type="number"
                  value={editingDonation.quantity}
                  onChange={(e) => handleEditChange('quantity', e.target.value)}
                  min={1}
                  required
                />
                <div className="mt-2">
                  <label className={`mb-2 text-sm font-medium flex items-center gap-2 ${
                    theme === 'light' ? 'text-black' : 'text-white'
                  }`}>
                    <FaCamera /> Medicine Image (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className={`w-full p-3 rounded-lg border ${
                      theme === 'light' 
                        ? 'bg-white/50 border-gray-200 file:bg-blue-500 hover:file:bg-blue-600 text-black file:text-white' 
                        : 'bg-neutral-700/50 border-neutral-600 file:bg-amber-400 hover:file:bg-amber-500 text-white file:text-black'
                    } file:mr-4 file:py-2 file:px-4 file:rounded-full transition-all duration-300`}
                  />
                  {editingDonation.previewImage && (
                    <img
                      src={editingDonation.previewImage}
                      alt="Preview"
                      className="mt-4 h-32 w-32 object-cover rounded-xl border shadow-lg"
                    />
                  )}
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <motion.button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 rounded-full font-semibold ${
                    loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : theme === 'light'
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-amber-400 text-black hover:bg-amber-500'
                  }`}
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                >
                  {loading ? <FaSpinner className="animate-spin" /> : 'Save Changes'}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 py-3 rounded-full font-semibold bg-gray-300 text-gray-700 dark:bg-neutral-600 dark:text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      <h2 className={`text-4xl font-extrabold my-10 ${
        theme === 'light' ? 'text-blue-500' : 'text-amber-400'
      }`}>
        Your Donations
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {yourDonations.length === 0 ? (
          <p className="text-lg text-gray-500 dark:text-gray-400">No donations yet</p>
        ) : (
          yourDonations.map((item) => (
            <motion.div
              key={item._id}
              className={`rounded-2xl shadow-xl overflow-hidden backdrop-blur-md relative ${
                theme === 'light' 
                  ? 'bg-white/30 border border-white/20' 
                  : 'bg-neutral-800/30 border border-neutral-700/20'
              }`}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
              )}
              <div className="p-6 space-y-3">
                <h3 className={`text-xl font-bold ${
                  theme === 'light' ? 'text-blue-500' : 'text-amber-400'
                }`}>
                  {item.name}
                </h3>
                <p className={`text-sm ${
                  theme === 'light' ? 'text-black' : 'text-white'
                }`}>Brand: {item.brand || 'N/A'}</p>
                 <p className={`text-sm ${
                  theme === 'light' ? 'text-black' : 'text-white'
                }`}>Type: {item.itemType || 'N/A'}</p>
                 <p className={`text-sm ${
                  theme === 'light' ? 'text-black' : 'text-white'
                }`}>Category: {item.itemCategory || 'N/A'}</p>
                <p className={`text-sm ${
                  theme === 'light' ? 'text-black' : 'text-white'
                }`}>Expiry: {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}</p>
                <p className={`text-sm ${
                  theme === 'light' ? 'text-black' : 'text-white'
                }`}>Quantity: {item.quantity}</p>
                <div className="flex gap-2 mt-4">
                  <motion.button
                    onClick={() => handleEdit(item)}
                    className={`p-2 rounded-full ${
                      theme === 'light'
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-amber-400 text-black hover:bg-amber-500'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaEdit size={16} />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 rounded-full text-red-500 hover:bg-red-500/20"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTrash size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
