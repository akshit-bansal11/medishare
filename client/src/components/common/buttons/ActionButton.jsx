// src/components/common/ActionButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// A primary call-to-action button with theming and navigation capabilities.
export default function ActionButton({
    theme = 'light',
    text = 'Click Me',
    to = null,
    disabled = false,
    onClick,
    className = '',
    children,
    type = 'button'
}) {
    const navigate = useNavigate();

    // Combines the provided onClick function with navigation logic.
    const handleClick = (e) => {
        if (disabled) return;
        if (onClick) onClick(e);
        if (to) navigate(to);
    };

    // Dynamically determine button styles based on theme and disabled state.
    const themeClasses = disabled
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : theme === 'light'
            ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:shadow-lg'
            : 'bg-gradient-to-r from-amber-300 to-amber-500 text-black hover:shadow-lg';

    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            onClick={handleClick}
            disabled={disabled}
            type={type}
            className={`rounded-lg font-semibold transition-colors duration-300 ${themeClasses} ${className}`}
        >
            {/* Render children if they exist, otherwise fall back to the text prop. */}
            {children ?? text}
        </motion.button>
    );
}