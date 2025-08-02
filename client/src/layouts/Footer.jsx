// src/components/Footer.jsx
import React from 'react';
import { motion } from 'framer-motion';

// Import react-icons for social and contact links
import {
    FaLinkedin,
    FaFacebook,
    FaInstagram,
    FaTwitter,
    FaEnvelope,
    FaPhone
} from 'react-icons/fa';

// --- Sub-components for better organization ---

/**
 * A reusable component for a single contact item.
 * It displays an icon and text, linked appropriately.
 */
const ContactItem = ({ theme, icon, text, href }) => {
    // Determine the hover color based on the current theme.
    const hoverColor = theme === 'light'
        ? 'hover:text-blue-500'
        : 'hover:text-amber-400';

    return (
        <a
            href={href}
            className={`flex items-center gap-3 transition-colors duration-300 ${hoverColor}`}
        >
            {icon}
            <span>{text}</span>
        </a>
    );
};

/**
 * A reusable component for a single animated social media icon link.
 */
const SocialIcon = ({ theme, icon, href, label }) => {
    const hoverColor = theme === 'light'
        ? 'hover:text-blue-500'
        : 'hover:text-amber-400';

    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className={`text-2xl transition-colors duration-300 ${hoverColor}`}
        >
            {icon}
        </motion.a>
    );
};

/**
 * A component to display the embedded Google Map.
 */
const LocationMap = () => (
    <div className="overflow-hidden rounded-lg shadow-lg">
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d682.1110009610856!2d74.93252176576952!3d30.218448804446755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzDCsDEzJzA3LjAiTiA3NMKwNTUnNTguOSJF!5e0!3m2!1sen!2sin!4v1753256602752!5m2!1sen!2sin"
            width="100%"
            height="250"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Our Location in Bathinda, Punjab"
        ></iframe>
    </div>
);

// --- Main Footer Component ---

export default function Footer({ theme }) {
    // Define animation variants for staggered children animations.
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delay: 0.2,
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        },
    };

    // Determine theme-based text and background colors.
    const bgColor = theme === 'light' ? 'bg-gray-100' : 'bg-neutral-900';
    const textColor = theme === 'light' ? 'text-gray-700' : 'text-gray-300';
    const headingColor = theme === 'light' ? 'text-gray-900' : 'text-white';

    return (
        <motion.footer
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className={`py-12 px-4 sm:px-6 lg:px-8 ${bgColor} ${textColor} transition-colors duration-300`}
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center md:text-left">
                {/* Section 1: About MediShare */}
                <motion.div variants={itemVariants} className="space-y-4">
                    <h3 className={`text-xl font-bold ${headingColor}`}>MediShare</h3>
                    <p>
                        Connecting communities to share life-saving medicines. Our mission is to ensure no dose goes to waste.
                    </p>
                </motion.div>

                {/* Section 2: Contact Information */}
                <motion.div variants={itemVariants} className="space-y-4">
                    <h3 className={`text-xl font-bold ${headingColor}`}>Contact Us</h3>
                    <div className="flex flex-col items-center md:items-start space-y-3">
                        <ContactItem
                            theme={theme}
                            icon={<FaEnvelope />}
                            text="artistbansal2004@gmail.com"
                            href="mailto:artistbansal2004@gmail.com"
                        />
                        <ContactItem
                            theme={theme}
                            icon={<FaPhone />}
                            text="(+91) 70092 50361"
                            href="tel:+917009250361"
                        />
                    </div>
                </motion.div>

                {/* Section 3: Social Media Links */}
                <motion.div variants={itemVariants} className="space-y-4">
                    <h3 className={`text-xl font-bold ${headingColor}`}>Follow Us</h3>
                    <div className="flex justify-center md:justify-start space-x-6">
                        <SocialIcon theme={theme} icon={<FaFacebook />} href="#" label="Facebook" />
                        <SocialIcon theme={theme} icon={<FaInstagram />} href="#" label="Instagram" />
                        <SocialIcon theme={theme} icon={<FaTwitter />} href="#" label="Twitter / X" />
                        <SocialIcon theme={theme} icon={<FaLinkedin />} href="#" label="LinkedIn" />
                    </div>
                </motion.div>

                {/* Section 4: Location Map */}
                <motion.div variants={itemVariants} className="space-y-4">
                    <h3 className={`text-xl font-bold ${headingColor}`}>Our Location</h3>
                    <LocationMap />
                </motion.div>
            </div>

            {/* Copyright Notice at the very bottom */}
            <motion.div
                variants={itemVariants}
                className="mt-12 pt-8 border-t text-center"
                style={{ borderColor: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}
            >
                <p className="text-sm">
                    © {new Date().getFullYear()} MediShare. All rights reserved.
                </p>
            </motion.div>
        </motion.footer>
    );
}
