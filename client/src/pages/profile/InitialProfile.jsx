// src/pages/InitialProfile.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Import reusable components
import ActionButton from '../../components/common/buttons/ActionButton';
import Heading from '../../components/common/Heading';
import Input from '../../components/common/inputs/Input';
import Select from '../../components/common/inputs/Select';

import { server_url } from '../../config/url';

// A dedicated component for the profile picture upload logic to keep the main component clean.
const ProfilePictureUploader = ({ theme, preview, onChange }) => (
    <div className="col-span-1 md:col-span-2">
        <label
            className={`block mb-2 text-sm font-medium ${
                theme === 'light' ? 'text-blue-500' : 'text-amber-400'
            }`}
        >
            Profile Picture
        </label>
        <input
            type="file"
            accept="image/*"
            onChange={onChange}
            className={`
                w-full text-sm rounded-lg cursor-pointer
                file:mr-4 file:py-3 file:px-4 file:rounded-l-lg file:border-0 file:font-semibold
                ${
                    theme === 'light'
                        ? 'text-gray-900 border border-gray-300 file:bg-gray-100 file:text-blue-600 hover:file:bg-gray-200'
                        : 'text-gray-300 border border-stone-600 file:bg-neutral-700 file:text-amber-400 hover:file:bg-neutral-600'
                }
            `}
        />
        {preview && (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 flex justify-center"
            >
                <img
                    src={preview}
                    alt="Profile Preview"
                    className={`h-40 w-40 object-cover rounded-full border-4 shadow-lg ${
                        theme === 'light' ? 'border-blue-400/40' : 'border-amber-400/40'
                    }`}
                />
            </motion.div>
        )}
    </div>
);

const formatDateToDisplay = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};



export default function InitialProfile({ theme, setAuthStatus }) {
    // A single state object for all form fields improves organization and simplifies handlers.
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        dob: '',
        gender: '',
        address: '',
        country: '',
        state: '',
        city: '',
        contact: '',
        qualification: '',
        occupation: '',
    });

    // State for location dropdowns
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [locationLoading, setLocationLoading] = useState(false);


    // Separate state for the profile picture file and its preview URL.
    const [profilePic, setProfilePic] = useState(null);
    const [previewProfile, setPreviewProfile] = useState(null);

    // State for loading, errors, and tracking if a profile already exists.
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasProfile, setHasProfile] = useState(false);

    const navigate = useNavigate();

    // Fetch countries from a public API on component mount
    useEffect(() => {
        setLocationLoading(true);
        axios.get('https://countriesnow.space/api/v0.1/countries/states')
            .then(response => {
                const countryData = response.data.data;
                setCountries(countryData);
                setLocationLoading(false);
            })
            .catch(err => {
                console.error("Error fetching countries:", err);
                setError("Could not load country data. Please refresh the page.");
                setLocationLoading(false);
            });
    }, []);

    // Update states when country changes
    useEffect(() => {
        if (formData.country) {
            const selectedCountry = countries.find(c => c.name === formData.country);
            if (selectedCountry && selectedCountry.states) {
                setStates(selectedCountry.states);
            } else {
                setStates([]);
            }
            // Reset state and city when country changes, unless it's the initial load with data
            if (formData.state) {
               setFormData(prev => ({ ...prev, state: '', city: '' }));
            }
            setCities([]);
        }
    }, [formData.country, countries]);

    // Update cities when state changes
    useEffect(() => {
        if (formData.country && formData.state) {
            setLocationLoading(true);
            axios.post('https://countriesnow.space/api/v0.1/countries/state/cities', {
                country: formData.country,
                state: formData.state
            })
            .then(response => {
                const cityData = response.data.data;
                setCities(cityData);
                setLocationLoading(false);
            })
            .catch(err => {
                console.error("Error fetching cities:", err);
                setError("Could not load city data.");
                setCities([]);
                setLocationLoading(false);
            });
        }
    }, [formData.state, formData.country]);


    // Fetches the user's profile data when the component mounts.
    const fetchProfileData = useCallback(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        axios.get(server_url + '/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            const user = res.data;
            // Populate the form with data from the server.
            setFormData({
                name: user.name || '',
                email: user.email || '',
                dob: user.dob ? formatDateToDisplay(user.dob) : '', // Format date for input[type=date]
                gender: user.gender || '',
                address: user.address || '',
                country: user.country || '',
                state: user.state || '',
                city: user.city || '',
                contact: user.contact || '',
                qualification: user.qualification || '',
                occupation: user.occupation || '',
            });

            // Check if any profile-specific fields have been filled.
            const hasExistingProfile = user.dob || user.gender || user.address;
            setHasProfile(!!hasExistingProfile);

            if (user.profilePic) {
                setPreviewProfile(user.profilePic);
            }
        })
        .catch((err) => {
            console.error('Error fetching user data:', err);
            // If unauthorized, redirect to login.
            if (err.response?.status === 403) navigate('/login');
            else setError('Failed to load profile data. Please try again later.');
        });
    }, [navigate]);

    // Run the fetch function once on component mount.
    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);

    // A single handler for all text-based input changes.
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handler for the profile picture file input.
    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setPreviewProfile(URL.createObjectURL(file));
        }
    };

    // Handles the form submission to create or update the profile.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Use FormData to send both text fields and the image file.
        const submissionData = new FormData();
        for (const key in formData) {
            submissionData.append(key, formData[key]);
        }
        if (profilePic) {
            submissionData.append('profilePic', profilePic);
        }

        try {
            await axios.post(server_url + '/users/profile', submissionData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            // Update global auth state and navigate to the dashboard on success.
            setAuthStatus({ isAuthenticated: true, hasProfile: true });
            navigate('/dashboard');

        } catch (err) {
            console.error(err);
            if (err.response?.status === 403) navigate('/login');
            else setError('Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const countryOptions = countries.map(country => ({ value: country.name, label: country.name }));
    const stateOptions = states.map(state => ({ value: state.name, label: state.name }));
    const cityOptions = cities.map(city => ({ value: city, label: city }));

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${
                theme === 'light' ? 'bg-gray-100' : 'bg-neutral-900'
            }`}
        >
            <div className="w-full max-w-3xl">
                <Heading
                    theme={theme}
                    text={hasProfile ? "Update Your Profile" : "Create Your Profile"}
                    size="text-3xl"
                    className="mb-6 text-center"
                />

                {error && <p className="mb-4 text-center text-red-500">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Using reusable components for form fields */}
                        <Input theme={theme} label="Name" name="name" value={formData.name} readOnly />
                        <Input theme={theme} label="Email" name="email" value={formData.email} readOnly />
                        <Input theme={theme} label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
                        <Select
                            theme={theme}
                            label="Gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            options={[
                                { value: 'Male', label: 'Male' },
                                { value: 'Female', label: 'Female' },
                                { value: 'Other', label: 'Other' },
                            ]}
                            required
                        />
                        <Input theme={theme} label="Flat & Street Address" name="address" value={formData.address} onChange={handleChange} required />
                        
                        <Select
                            theme={theme}
                            label={locationLoading && !countries.length ? "Loading Countries..." : "Country"}
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            options={countryOptions}
                            disabled={locationLoading || countries.length === 0}
                            required
                        />

                        <Select
                            theme={theme}
                            label={locationLoading && !states.length ? "Loading States..." : "State"}
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            options={stateOptions}
                            disabled={!formData.country || locationLoading || states.length === 0}
                            required
                        />

                        <Select
                            theme={theme}
                            label={locationLoading && !cities.length ? "Loading Cities..." : "City"}
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            options={cityOptions}
                            disabled={!formData.state || locationLoading || cities.length === 0}
                            required
                        />

                        <Input theme={theme} label="Contact" name="contact" type="tel" value={formData.contact} onChange={handleChange} required />
                        <Select
                            theme={theme}
                            label="Qualification"
                            name="qualification"
                            value={formData.qualification}
                            onChange={handleChange}
                            options={[
                                { value: 'Metriculation (10th)', label: 'Metriculation (10th)' },
                                { value: 'Senior Secondary (12th)', label: 'Senior Secondary (12th)' },
                                { value: 'Graduate', label: 'Graduate' },
                                { value: 'Post-Graduate', label: 'Post-Graduate' },
                                { value: 'Doctorate (PhD)', label: 'Doctorate (PhD)' },
                                { value: 'Other', label: 'Other' },
                            ]}
                        />
                        <Select
                            theme={theme}
                            label="Occupation"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleChange}
                            options={[
                                { value: 'Job', label: 'Job' },
                                { value: 'Business', label: 'Business' },
                                { value: 'Student', label: 'Student' },
                                { value: 'Homemaker', label: 'Homemaker' },
                                { value: 'Retired', label: 'Retired' },
                                { value: 'Other', label: 'Other' },
                            ]}
                        />

                        <ProfilePictureUploader
                            theme={theme}
                            preview={previewProfile}
                            onChange={handleProfilePicChange}
                        />
                    </div>

                    <ActionButton
                        theme={theme}
                        type="submit"
                        disabled={loading || locationLoading}
                        className="w-full py-3 text-lg"
                    >
                        {loading
                            ? (hasProfile ? 'Updating...' : 'Saving...')
                            : (hasProfile ? 'Update Profile' : 'Save Profile')
                        }
                    </ActionButton>
                </form>
            </div>
        </motion.div>
    );
}
