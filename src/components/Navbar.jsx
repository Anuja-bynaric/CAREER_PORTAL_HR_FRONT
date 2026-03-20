import React from 'react';

const logo = "/assets/logo.png";

function Navbar() {
    return (
        <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="cursor-pointer shrink-0">
                <img src={logo} alt="Bynaric Logo" className="h-9 w-auto object-contain" />
            </div>
        </nav>
    );
}

export default Navbar;