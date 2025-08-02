// src/components/common/Heading.jsx
import React from 'react';
import { motion } from 'framer-motion';

// A stylized heading component with a gradient text effect.
const Heading = ({ theme, text, size = 'text-5xl', className = '' }) => {
    // Dynamically determine gradient colors based on the theme.
    const themeClasses = theme === 'light'
        ? 'from-blue-400 to-blue-600'
        : 'from-amber-400 to-amber-600';

    return (
        <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`
                ${size} 
                font-bold 
                leading-normal 
                tracking-tight 
                bg-clip-text 
                text-transparent 
                bg-gradient-to-r 
                ${themeClasses} 
                ${className}
            `}
        >
            {text}
        </motion.h2>
    );
};

export default Heading;