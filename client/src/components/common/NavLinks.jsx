// src/components/common/NavLinks.jsx
import React from 'react';
import TextButton from './buttons/TextButton';

//  A container for navigation links, making it easy to render a consistent nav menu.
function NavLinks({ theme }) {
    // Storing links in an array makes the component more maintainable and scalable.
    const navItems = [
        { text: 'Home', to: '/' },
        { text: 'Dashboard', to: '/dashboard' },
        { text: 'About Us', to: '/about' },
    ];

    return (
        <div className='flex items-center gap-4'>
            {navItems.map((item) => (
                <TextButton
                    key={item.to}
                    theme={theme}
                    text={item.text}
                    to={item.to}
                />
            ))}
        </div>
    );
}

export default NavLinks;