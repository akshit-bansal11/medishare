// src/components/Validation.jsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaXmark } from "react-icons/fa6";

// Import validation utility functions
import {
    isEmailValid,
    has8Chars,
    hasNumber,
    hasUpper,
    hasLower,
    hasSymbol
} from '../../utils/validation';

//  A small, reusable component to display a single validation rule.
const ValidationRule = ({ isValid, text }) => {
    // Determine text color and icon based on validity.
    const colorClass = isValid ? "text-green-600" : "text-red-600";
    const Icon = isValid ? FaCheck : FaXmark;

    return (
        <p className={`${colorClass} flex items-center gap-2`}>
            <Icon />
            <span>{text}</span>
        </p>
    );
};

//  Displays a list of validation criteria for email and password fields.
export default function Validation({
    email,
    password,
    showEmailValidation,
    showPasswordValidation,
    theme = 'light'
}) {
    // Memoize the password validation rules to avoid re-creating the array on every render.
    // This makes the component more efficient and scalable.
    const passwordRules = useMemo(() => [
        { check: has8Chars, text: "At least 8 characters" },
        { check: hasNumber, text: "At least 1 number" },
        { check: hasUpper, text: "At least 1 uppercase letter" },
        { check: hasLower, text: "At least 1 lowercase letter" },
        { check: hasSymbol, text: "At least 1 symbol" },
    ], []);

    // Memoize the email validation result for efficiency.
    const emailIsValid = useMemo(() => isEmailValid(email), [email]);

    // Define animation properties for consistency.
    const containerMotion = {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.2 }
    };

    const listMotion = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 }
    };

    return (
        <motion.div
            {...containerMotion}
            className={`mt-2 space-y-1 text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}
        >
            {/* Email Validation Section */}
            {showEmailValidation && (
                <motion.div {...listMotion}>
                    <ValidationRule
                        isValid={emailIsValid}
                        text='Must be a valid email format'
                    />
                </motion.div>
            )}

            {/* Password Validation Section */}
            {showPasswordValidation && (
                <motion.div {...listMotion} className="space-y-1">
                    {passwordRules.map((rule) => (
                        <ValidationRule
                            key={rule.text}
                            isValid={rule.check(password)}
                            text={rule.text}
                        />
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
}