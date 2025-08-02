import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import DonateIcon from '../assets/icons/donate.svg';
import MedicineIcon from '../assets/icons/medicines.svg';
import UserSettingsIconLight from '../assets/icons/userSettingsLight.svg';
import UserSettingsIconDark from '../assets/icons/userSettingsDark.svg';

import ActionButton from '../components/common/buttons/ActionButton';

export default function Dashboard({ theme }) {
  const navigate = useNavigate();

  // Dataset with imported images
  const cards = [
    {
      image: DonateIcon,
      buttonText: 'Your Donations',
      link: '/donations'
    },
    {
      image: MedicineIcon,
      buttonText: 'Find',
      link: '/find'
    },
    {
      image: theme === 'light' ? UserSettingsIconLight : UserSettingsIconDark,
      buttonText: 'Settings',
      link: '/settings'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className={`min-h-screen p-4 transition-colors duration-300 ${
        theme === 'light' ? 'bg-gray-100 text-black' : 'bg-neutral-900 text-white'
      }`}
    >
      <h2 className="text-4xl font-bold text-center my-8">Your Dashboard</h2>

      <motion.div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className={`rounded-xl shadow-lg p-6 flex flex-col items-center justify-between transition-colors duration-300 ${
              theme === 'light' ? 'bg-white text-black' : 'bg-neutral-800 text-white'
            }`}
          >
            <img
              src={card.image}
              alt={card.buttonText}
              className="h-32 w-32 object-contain mb-6"
            />

            <ActionButton className='px-4 py-2' theme={theme} text={card.buttonText} to={card.link} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
