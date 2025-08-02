//Dependencies
import React, { useState, useMemo } from "react";
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";

// Reusable Components
import ActionButton from '../common/buttons/ActionButton';
import Heading from '../common/Heading';
import Input from '../common/inputs/Input';

// Validation Logic
import Validation from "../common/Validation";
import { isEmailValid, isPasswordValid } from '../../utils/validation';

import { server_url } from "../../config/url";


//A component for user login.
export default function LogIn({ theme, authStatus }) {
    // A single state object for form data improves organization.
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // Tracks which fields the user has interacted with to show validation messages.
    const [touched, setTouched] = useState({
        email: false,
        password: false,
    });

    // Holds the error message for submission failures.
    const [submitError, setSubmitError] = useState(null);

    const navigate = useNavigate();

    // useMemo prevents re-running validation on every render, optimizing performance.
    const validationStatus = useMemo(() => ({
        email: isEmailValid(formData.email),
        password: isPasswordValid(formData.password),
    }), [formData.email, formData.password]);

    const canSubmit = validationStatus.email && validationStatus.password;

    /**
     * A generic handler to update form data state.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /**
     * Marks a field as 'touched' when the user moves away from it.
     */
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    /**
     * Handles the form submission, performs validation, and makes an API call.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({ email: true, password: true }); // Show all validations on submit attempt

        if (!canSubmit) {
            setSubmitError("Please fix the highlighted errors before submitting.");
            return;
        }

        setSubmitError(null);

        try {
            const res = await axios.post(server_url + '/users/login', formData);

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userEmail', formData.email);

            // A toast notification would be a great replacement for the old alert.
            console.log(`Welcome back! Server says: ${res.data.message}`);
            console.log('Login success', res.data);

            navigate(authStatus.hasProfile ? '/dashboard' : '/makeprofile');
        } catch (err) {
            console.error('Login failed', err);
            const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setSubmitError(errorMessage);
        }
    };

    // Animation variants for cleaner JSX
    const validationMotionProps = {
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: 'auto' },
        exit: { opacity: 0, height: 0 },
        transition: { duration: 0.3 }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 60 } }}
            exit={{ opacity: 0, y: -20 }}
            className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
                theme === 'light' ? 'bg-gray-100' : 'bg-neutral-900'
            }`}
        >
            <motion.div
                whileHover={{ scale: 1.02 }}
                className={`relative max-w-md w-full rounded-xl shadow-2xl p-8 overflow-hidden transition-colors duration-300 ${
                    theme === 'light' ? 'bg-white text-black' : 'bg-neutral-800 text-white'
                }`}
            >
                <div
                    className={`absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-20 ${
                        theme === 'light' ? 'bg-blue-400' : 'bg-amber-400'
                    }`}
                />

                <Heading
                    theme={theme}
                    text="Log In"
                    size="text-3xl"
                    className="mb-8 text-center relative z-10"
                />

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div>
                        <Input
                            theme={theme}
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        <AnimatePresence>
                            {touched.email && (
                                <motion.div {...validationMotionProps}>
                                    <Validation
                                        email={formData.email}
                                        password={formData.password}
                                        showEmailValidation={true}
                                        showPasswordValidation={false}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div>
                        <Input
                            theme={theme}
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        <AnimatePresence>
                            {touched.password && (
                                <motion.div {...validationMotionProps}>
                                    <Validation
                                        email={formData.email}
                                        password={formData.password}
                                        showEmailValidation={false}
                                        showPasswordValidation={true}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <AnimatePresence>
                        {submitError && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-red-600 text-sm text-center pt-2"
                            >
                                {submitError}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <div className="pt-2">
                        <ActionButton
                            theme={theme}
                            type="submit"
                            disabled={!canSubmit}
                            className="w-full py-3"
                        >
                            Log In
                        </ActionButton>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
