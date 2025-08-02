// src/components/common/TextCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

// A card component for displaying a heading, text, and an optional icon.
export default function TextCard({
    theme = 'light',
    icon,
    heading,
    text
}) {
    // Dynamic classes for the card's background and border.
    const cardThemeClasses = theme === 'light'
        ? 'bg-white border-gray-200'
        : 'bg-neutral-800 border-neutral-600';

    // Dynamic classes for the icon's color.
    const iconThemeClasses = theme === 'light'
        ? 'text-blue-500'
        : 'text-amber-400';

    // Dynamic classes for the heading text color.
    const headingThemeClasses = theme === 'light'
        ? 'text-gray-900'
        : 'text-white';

    // Dynamic classes for the body text color.
    const textThemeClasses = theme === 'light'
        ? 'text-gray-600'
        : 'text-gray-300';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }} // Ensures the animation runs only once when it enters the viewport.
            className={`p-8 rounded-2xl shadow-xl flex flex-col justify-center items-center gap-5 border ${cardThemeClasses}`}
        >
            {/* Use React.cloneElement to inject new props (className) into the icon element
                without needing to know its type or original props. This is a flexible way
                to style a component passed in as a prop.
            */}
            {icon && React.cloneElement(icon, {
                className: `text-7xl ${iconThemeClasses}`
            })}

            <h3 className={`text-2xl font-bold ${headingThemeClasses}`}>
                {heading}
            </h3>

            <p className={`text-center max-w-prose ${textThemeClasses}`}>
                {text}
            </p>
        </motion.div>
    );
}