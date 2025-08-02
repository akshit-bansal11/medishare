// src/components/common/TextButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

//  A simple text-based button, often used for navigation links.
export default function TextButton({
    theme = 'light',
    text = '',
    to,
    children
}) {
    const navigate = useNavigate();

    // A simple handler for navigation.
    const handleClick = () => {
        if (to) navigate(to);
    };

    // Dynamic classes for hover text color based on the theme.
    const themeClasses = theme === 'light'
        ? 'text-black hover:text-blue-500'
        : 'text-white hover:text-amber-400';

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            type="button"
            className={`rounded-lg font-semibold transition-colors duration-300 ${themeClasses}`}
        >
            {children ?? text}
        </motion.button>
    );
}