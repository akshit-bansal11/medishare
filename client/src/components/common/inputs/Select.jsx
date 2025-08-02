// src/components/common/Select.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * A modernized and themed select (dropdown) component that features a floating label,
 * animated dropdown arrow, and styling consistent with the Input component.
 *
 * @param {object} props - The component props.
 * @param {'light' | 'dark'} props.theme - The color theme for the select component.
 * @param {string} props.label - The text to display in the floating label.
 * @param {string} props.name - The `name` attribute for the select element, crucial for form handling.
 * @param {string} props.value - The current value of the select input.
 * @param {Function} props.onChange - The callback function to execute when the select value changes.
 * @param {Function} [props.onBlur] - An optional callback for when the select element loses focus.
 * @param {Array<{value: string, label: string}>} [props.options=[]] - An array of objects for the dropdown options.
 * @param {boolean} [props.required=false] - Specifies whether the select field is required.
 */
const Select = ({ theme, label, name, value, onChange, onBlur, options = [], required = false }) => {
    // A unique ID is generated for the select element to link it with the label for accessibility.
    const id = `select-${name}`;

    // State to track if the select element is currently focused. This is key for UI animations.
    const [isFocused, setIsFocused] = useState(false);

    // Custom event handlers to manage the focus state.
    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e) => {
        setIsFocused(false);
        // If an onBlur function is passed from the parent, it is called here.
        if (onBlur) onBlur(e);
    };

    // --- Theme-based Tailwind CSS classes for dynamic styling ---

    // Classes for the main select element, aligned with Input.jsx for consistency.
    const themeSelectClasses = theme === 'light'
        ? 'border-gray-300 bg-gray-200 focus:border-blue-400 text-black'
        : 'border-stone-600 bg-neutral-800 focus:border-amber-400 text-white';

    // Classes for the floating label, aligned with Input.jsx.
    const themeLabelClasses = theme === 'light'
        ? 'text-gray-500 peer-focus:text-blue-500'
        : 'text-gray-400 peer-focus:text-amber-400';

    // Note: Styling <option> elements directly has limited and inconsistent browser support.
    // These classes apply a basic theme that works in most modern browsers.
    const optionThemeClasses = theme === 'light'
        ? 'bg-white text-gray-900'
        : 'bg-neutral-800 text-white';

    return (
        <div className="relative">
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required={required}
                // The `peer` class is essential for the floating label effect.
                className={`
                    peer w-full border rounded-lg px-4 py-3 appearance-none
                    focus:outline-none transition-all duration-300
                    ${themeSelectClasses}
                `}
                aria-label={label}
            >
                {/* A hidden, disabled option serves as a placeholder, ensuring the label floats correctly. */}
                <option value="" disabled hidden></option>
                {options.map(option => (
                    <option key={option.value} value={option.value} className={optionThemeClasses}>
                        {option.label}
                    </option>
                ))}
            </select>
            <label
                htmlFor={id}
                // The label's position and scale are animated based on whether the input has a value or is focused.
                // The translate-y value is updated to -translate-y-9 to match the Input component.
                className={`
                    absolute left-4 top-3.5 transition-all duration-300
                    transform origin-left pointer-events-none
                    ${value || isFocused ? '-translate-y-9 scale-75' : 'translate-y-0 scale-100'}
                    ${themeLabelClasses}
                `}
            >
                {label}
            </label>
            {/* The custom dropdown arrow, which animates on focus. */}
            <motion.div
                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                animate={{ rotate: isFocused ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <svg
                    className={`w-5 h-5 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </motion.div>
        </div>
    );
};

export default Select;
