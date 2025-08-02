// src/components/NavBar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import Icons, Logos, and child components
import { IoSunny, IoMoon } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import logoLight from '../assets/logos/logoLight.svg';
import logoDark from '../assets/logos/logoDark.svg';
import ActionButton from '../components/common/buttons/ActionButton';
import NavLinks from '../components/common/NavLinks';

// A small component for the site logo and brand name.
const Logo = ({ theme, onClick }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="flex items-center gap-3"
    >
        <img
            src={theme === 'light' ? logoLight : logoDark}
            alt="MediShare Logo"
            className="w-16 sm:w-20"
        />
        <div className="flex flex-col text-left">
            <h1 className="text-base font-bold sm:text-lg">MediShare</h1>
            <h1 className="text-xs font-light">Share a Dose</h1>
        </div>
    </motion.button>
);

// A component for the hamburger menu icon, which animates between open/closed states.
const MenuToggle = ({ theme, isOpen, onClick }) => (
    <button className="p-2 sm:hidden" onClick={onClick} aria-label="Toggle menu">
        <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <svg
                className={`h-6 w-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
            </svg>
        </motion.div>
    </button>
);

// This component renders the set of action buttons on the right side of the navbar.
const NavActions = ({ theme, authStatus, onThemeClick }) => {
    // Determine which authentication-related buttons to show.
    const authButtons = authStatus.isAuthenticated && authStatus.hasProfile
        ? (
            <ActionButton theme={theme} className='p-2' to="/profile" aria-label="User Profile">
                <FaUserCircle className='text-2xl' />
            </ActionButton>
        ) : (
            <>
                <ActionButton theme={theme} className='px-3 py-2' text="Sign Up" to="/signup" />
                <ActionButton theme={theme} className='px-3 py-2' text="Log In" to="/login" />
            </>
        );

    return (
        <div className="flex flex-col items-center gap-4 sm:flex-row">
            {authButtons}
            <ActionButton
                theme={theme}
                className='p-2'
                onClick={onThemeClick}
                aria-label="Toggle theme"
            >
                {theme === 'light' ? <IoSunny className='text-2xl' /> : <IoMoon className='text-2xl' />}
            </ActionButton>
        </div>
    );
};


export default function NavBar({ theme, toggleTheme, authStatus }) {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // A simple handler to close the mobile menu when an action is taken.
    const handleThemeToggle = () => {
        toggleTheme();
        setIsMenuOpen(false);
    };

    // Determine if the main navigation links should be visible.
    const showNavLinks = authStatus.isAuthenticated && authStatus.hasProfile;

    // Define dynamic classes for the main navigation bar based on the current theme.
    const navThemeClasses = theme === 'light'
        ? 'bg-white text-gray-900'
        : 'bg-neutral-800 text-white';

    // Define dynamic classes for the mobile menu container.
    const mobileMenuContainerClasses = `
        ${isMenuOpen ? 'flex' : 'hidden'} sm:flex 
        flex-col sm:flex-row items-center gap-4 
        absolute sm:static top-full left-0 right-0 p-4 sm:p-0 
        ${theme === 'light' ? 'bg-white' : 'bg-neutral-800'} 
        sm:bg-transparent shadow-lg sm:shadow-none z-20
    `;

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60 } }}
            className={`relative flex items-center justify-between px-4 py-4 shadow-lg transition-colors duration-300 sm:px-6 ${navThemeClasses}`}
        >
            <Logo theme={theme} onClick={() => navigate('/')} />

            {/* Desktop Navigation Links */}
            <div className="hidden sm:flex">
                {showNavLinks && <NavLinks theme={theme} />}
            </div>

            {/* This container holds the right-side actions and handles mobile menu visibility */}
            <div className="flex items-center gap-2">
                <div className="hidden sm:flex">
                    <NavActions
                        theme={theme}
                        authStatus={authStatus}
                        onThemeClick={handleThemeToggle}
                    />
                </div>
                <MenuToggle theme={theme} isOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} />
            </div>


            {/* Mobile Menu - appears below the navbar on small screens */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className={mobileMenuContainerClasses}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Render NavLinks and NavActions inside the mobile menu */}
                        {showNavLinks && <NavLinks theme={theme} />}
                        <NavActions
                            theme={theme}
                            authStatus={authStatus}
                            onThemeClick={handleThemeToggle}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}