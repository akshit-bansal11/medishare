// Dependencies
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Components
import ActionButton from '../components/common/buttons/ActionButton';
import TextCard from '../components/common/TextCard';

// Logos
import logoLight from '../assets/logos/logoLight.svg';
import logoDark from '../assets/logos/logoDark.svg';

// Icons
import { FaHandHoldingMedical } from "react-icons/fa";
import { GiMedicines } from "react-icons/gi";
import { FaHandshake } from "react-icons/fa";

export default function Home({ theme, authStatus }) {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 20 } }}
            exit={{ opacity: 0, y: -20 }}
            className={`min-h-screen flex flex-col transition-colors duration-300 ${
                theme === 'light' ? 'bg-gray-100' : 'bg-neutral-900'
            }`}
        >
            <section className="relative flex flex-col items-center justify-center flex-grow py-16 px-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                    className="relative z-10 text-center max-w-3xl"
                >
                    <img
                        src={theme === 'light' ? logoLight : logoDark}
                        alt="MediShare Logo"
                        className="w-32 mx-auto mb-6"
                    />
                    <h1
                        className={`text-4xl md:text-5xl font-bold mb-4 ${
                            theme === 'light' ? 'text-gray-900' : 'text-white'
                        }`}
                    >
                        MediShare: Share a Dose, Save a Life
                    </h1>
                    <p
                        className={`text-lg md:text-xl mb-8 ${
                            theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                        }`}
                    >
                        Donate your unused, unexpired medications to help those in need. Request medicine safely and
                        securely through our community-driven platform.
                    </p>
                    <div className="flex justify-center gap-4">
                        <ActionButton theme={theme} className='px-4 py-3' text="Donate Medicine" to={authStatus.isAuthenticated ? "/donations" : '/signup'} />
                        <ActionButton theme={theme} className='px-4 py-3' text="Find Medicine" to={authStatus.isAuthenticated ? "/find" : '/signup'} />
                    </div>
                </motion.div>
            </section>

            <section
                className={`py-16 px-4 ${
                    theme === 'light' ? 'bg-white' : 'bg-neutral-800'
                } transition-colors duration-300`}
            >
                <div className="max-w-5xl mx-auto text-center">
                    <div className="grid md:grid-cols-3 gap-8">
                        <TextCard 
                            theme={theme}
                            icon = {<FaHandHoldingMedical />}
                            heading = 'Donate'
                            text = 'Sign up and list your unused, unexpired medications. Our platform ensures safe and secure donation processes'
                        />
                        <TextCard 
                            theme={theme}
                            icon = {<GiMedicines />}
                            heading = 'Find'
                            text = 'Browse available medications and request what you need. We verify all requests to ensure fairness and safety.'
                        />
                        <TextCard 
                            theme={theme}
                            icon = {<FaHandshake />}
                            heading = 'Connect'
                            text = 'Donors and recipients are connected securely. Coordinate safe handoff or delivery through our platform.'
                        />
                    </div>
                </div>
            </section>
        </motion.div>
    );
}