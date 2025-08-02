// src/pages/Find.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPills, FaCalendarAlt, FaBoxes, FaSyringe, FaUser, FaSearch, FaSpinner } from 'react-icons/fa';
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


export default function Find({ theme = 'light' }) {
  const [medicines, setMedicines] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    itemType: '',
    itemCategory: ''
  });

  // Derive category options from itemType
  const categoryOptions = filters.itemType
    ? itemData[filters.itemType]?.map((desc) => {
        const [label] = desc.split(':');
        return label.trim();
      }) || []
    : [];

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const res = await axios.get(server_url + '/medicines/all', {
          withCredentials: true
        });
        setMedicines(res.data);
        setFiltered(res.data);
        setMessage('');
      } catch (err) {
        console.error('Error fetching medicines:', err);
        setMessage('Failed to fetch medicines. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  useEffect(() => {
    const newFiltered = medicines.filter((med) => {
      const nameMatch = !filters.name || med.name?.toLowerCase().includes(filters.name.toLowerCase());
      const typeMatch = !filters.itemType || med.itemType?.toLowerCase() === filters.itemType.toLowerCase();
      const categoryMatch = !filters.itemCategory || med.itemCategory?.toLowerCase() === filters.itemCategory.toLowerCase();
      return nameMatch && typeMatch && categoryMatch;
    });
    setFiltered(newFiltered);
  }, [filters, medicines]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      if (name === 'itemType') {
        return {
          ...prev,
          itemType: value,
          itemCategory: '' // Reset category when type changes
        };
      }
      return {
        ...prev,
        [name]: value
      };
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen px-4 md:px-12 py-10 ${
        theme === 'light' 
          ? 'bg-gradient-to-b from-gray-100 to-gray-200' 
          : 'bg-gradient-to-b from-neutral-900 to-neutral-800'
      }`}
    >
      <h1 className={`text-4xl font-extrabold mb-10 text-center ${
        theme === 'light' ? 'text-blue-500' : 'text-amber-400'
      }`}>
        Find Medicines
      </h1>

      {/* Filter Section */}
      <div className={`w-full max-w-5xl mx-auto rounded-2xl shadow-2xl p-8 mb-8 backdrop-blur-lg ${
          theme === 'light'
            ? 'bg-white/30 border border-white/20'
            : 'bg-neutral-800/30 border border-neutral-700/20'
        }`}>
        <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${
          theme === 'light' ? 'text-gray-700' : 'text-gray-200'
        }`}>
          <FaSearch /> Filter Donations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <FloatingLabelInput
            theme={theme}
            label="Search by name"
            type="text"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
          />
          <FloatingLabelSelect
            theme={theme}
            label="Item Type"
            name="itemType"
            value={filters.itemType}
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            {Object.keys(itemData).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </FloatingLabelSelect>
          <FloatingLabelSelect
            theme={theme}
            label="Item Category"
            name="itemCategory"
            value={filters.itemCategory}
            onChange={handleFilterChange}
            disabled={!filters.itemType}
          >
            <option value="">All Categories</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </FloatingLabelSelect>
        </div>
      </div>

      {/* Cards Section */}
      {loading ? (
        <div className={`flex justify-center items-center h-64 ${
          theme === 'light' ? 'text-blue-500' : 'text-amber-400'
        }`}>
          <FaSpinner className="animate-spin text-4xl" />
        </div>
      ) : message ? (
        <p className={`text-center text-lg mt-10 font-medium ${
          theme === 'light' ? 'text-red-600' : 'text-red-400'
        }`}>{message}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <AnimatePresence>
            {filtered.length > 0 ? (
              filtered.map((med, i) => (
                <motion.div
                  key={med._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-2xl shadow-xl overflow-hidden backdrop-blur-md relative ${
                    theme === 'light' 
                      ? 'bg-white/30 border border-white/20' 
                      : 'bg-neutral-800/30 border border-neutral-700/20'
                  }`}
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                >
                  <img
                    src={med.imageUrl}
                    alt={med.name}
                    className="w-full h-48 object-cover rounded-t-2xl"
                  />
                  <div className="p-6 space-y-3">
                    <h3 className={`text-xl font-bold ${
                      theme === 'light' ? 'text-blue-500' : 'text-amber-400'
                    } flex items-center gap-2`}>
                      <FaPills /> {med.name}
                    </h3>
                    {med.brand && (
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-black' : 'text-white'
                      }`}>
                        <FaUser className="inline mr-1" /> Brand: {med.brand}
                      </p>
                    )}
                    <p className={`text-sm ${
                      theme === 'light' ? 'text-black' : 'text-white'
                    }`}>
                      <FaSyringe className="inline mr-1" /> Type: {med.itemType}
                    </p>
                    <p className={`text-sm ${
                      theme === 'light' ? 'text-black' : 'text-white'
                    }`}>
                      <FaBoxes className="inline mr-1" /> Category: {med.itemCategory}
                    </p>
                    <p className={`text-sm ${
                      theme === 'light' ? 'text-black' : 'text-white'
                    }`}>
                      <FaCalendarAlt className="inline mr-1" /> Expires:{" "}
                      {new Date(med.expiryDate).toLocaleDateString("en-GB")}
                    </p>
                    <p className={`text-sm ${
                      theme === 'light' ? 'text-black' : 'text-white'
                    }`}>
                      <FaBoxes className="inline mr-1" /> Qty: {med.quantity}
                    </p>
                    <motion.button
                      className={`w-full py-3 rounded-full font-semibold mt-4 ${
                        theme === 'light' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-amber-400 text-black hover:bg-amber-500'
                      }`}
                      onClick={() =>
                        alert(`Contact donor at ${med.userId?.email || 'Email not available'}`)
                      }
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Contact Donor
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`col-span-full text-center text-lg font-medium mt-10 ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                No medicines found.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}