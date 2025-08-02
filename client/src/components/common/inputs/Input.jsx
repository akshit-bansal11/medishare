// src/components/common/inputs/Input.jsx
import React from 'react';

//  A themed input field with a floating label.
const Input = ({ theme, label, type = 'text', name, value, onChange, onBlur, required = false, readOnly = false }) => {
    const id = `input-${name}`; // Create a unique ID for accessibility.

    // Dynamic classes for border and focus colors based on the theme.
    const themeInputClasses = theme === 'light'
        ? 'border-gray-300 bg-gray-200 focus:border-blue-400 text-black'
        : 'border-stone-600 bg-neutral-800 focus:border-amber-400 text-white';

    // Dynamic classes for label color based on the theme and focus state.
    const themeLabelClasses = theme === 'light'
        ? 'text-gray-500 peer-focus:text-blue-500'
        : 'text-gray-400 peer-focus:text-amber-400';
    
    // Add specific styles for the date picker icon based on the theme
    // This uses a CSS filter to make the icon black in light mode and white in dark mode.
    const datePickerIconStyle = type === 'date'
        ? (theme === 'light'
            ? '[&::-webkit-calendar-picker-indicator]:[filter:invert(0)]'
            : '[&::-webkit-calendar-picker-indicator]:[filter:invert(1)]'
        )
        : '';

    return (
        <div className="relative">
            <input
                id={id}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                required={required}
                readOnly={readOnly}
                // `peer` class allows the label to react to the input's state (e.g., focus).
                // `placeholder-transparent` hides the default placeholder, allowing the label to act as one.
                className={`
                    peer w-full border rounded-lg px-4 py-3
                    focus:outline-none transition-all duration-300 
                    ${themeInputClasses} placeholder-transparent
                    ${readOnly ? 'cursor-not-allowed' : ''}
                    ${datePickerIconStyle}
                `}
                placeholder={label} // Placeholder is required for the floating label effect to work correctly.
            />
            <label
                htmlFor={id}
                // This complex class string handles the floating label animation.
                // It moves and scales the label when the input has a value, is focused, or is a date input.
                className={`
                    absolute left-4 top-3.5 transition-all duration-300 
                    transform origin-left
                    ${(value || type === 'date') ? '-translate-y-9 scale-75' : 'peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0'}
                    peer-focus:-translate-y-9 peer-focus:scale-75
                    ${themeLabelClasses}
                `}
            >
                {label}
            </label>
        </div>
    );
};

export default Input;