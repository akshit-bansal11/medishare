// Dependencies
import React, { useState } from "react";
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Local Imports
import Validation from "../common/Validation";
import { isEmailValid, isPasswordValid } from '../../utils/validation';

// Common Components
import ActionButton from '../common/buttons/ActionButton';
import Input from '../common/inputs/Input';
import Heading from "../common/Heading";

import { server_url } from "../../config/url";


// SignUp Component
export default function SignUp({ theme }) {
    // ------------------
    // State Management
    // ------------------
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [touched, setTouched] = useState({
        email: false,
        password: false,
    });

    const [submitError, setSubmitError] = useState(false);

    // ------------------
    // Hooks
    // ------------------
    const navigate = useNavigate();

    // ------------------
    // Variables
    // ------------------
    const { name, email, password } = formData;
    const emailValid = isEmailValid(email);
    const passwordValid = isPasswordValid(password);
    const canSubmit = emailValid && passwordValid && name;

    // ------------------
    // Event Handlers
    // ------------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prevTouched => ({
            ...prevTouched,
            [name]: true
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!canSubmit) {
            setSubmitError(true);
            return;
        }

        setSubmitError(false);

        try {
            const res = await axios.post(server_url + '/users/signup', { name, email, password });
            alert("Thanks for Signing Up");
            console.log('Signup success', res.data);
            navigate('/login');
        } catch (err) {
            console.error('Signup failed', err);
            alert('Signup failed. Check your credentials.');
        }
    };

    // ------------------
    // Render
    // ------------------
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } }}
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
                    className={`absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20 ${
                        theme === 'light' ? 'bg-blue-400' : 'bg-amber-400'
                    }`}
                ></div>
                
                <Heading theme={theme} text="Sign Up" size="text-3xl" className="mb-8 text-center relative z-10" />

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    {/* Name Input */}
                    <Input
                        theme={theme}
                        label="Full Name (As Per Official Govnt. ID)"
                        type="text"
                        name="name"
                        value={name}
                        onChange={handleChange}
                        required
                    />

                    {/* Email Input */}
                    <Input
                        theme={theme}
                        label="Email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    />

                    {/* Email Validation */}
                    <AnimatePresence>
                        {touched.email && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Validation
                                    email={email}
                                    password={password}
                                    showEmailValidation={true}
                                    showPasswordValidation={false}
                                    theme={theme}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Password Input */}
                    <Input
                        theme={theme}
                        label="Password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    />

                    {/* Password Validation */}
                    <AnimatePresence>
                        {touched.password && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Validation
                                    email={email}
                                    password={password}
                                    showEmailValidation={false}
                                    showPasswordValidation={true}
                                    theme={theme}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit Error Message */}
                    <AnimatePresence>
                        {submitError && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-red-600 text-sm mb-2"
                            >
                                Please fix the highlighted errors above before submitting.
                            </motion.p>
                        )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <ActionButton
                        theme={theme}
                        type="submit"
                        text="Sign Up"
                        disabled={!canSubmit}
                        className="w-full py-2"
                    />
                </form>
            </motion.div>
        </motion.div>
    );
}
