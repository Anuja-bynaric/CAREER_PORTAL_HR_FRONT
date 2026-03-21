import React from 'react'
import { Search, MapPin, ChevronLeft, ChevronDown, ChevronRight } from 'lucide-react';
const logo = "/assets/logo.png";

function Navbar() {
    return (
        <div>
            <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="cursor-pointer shrink-0" onClick={() => { setSelectedJob(null); fetchAllJobs(); }}>
                    <img src={logo} alt="Bynaric Logo" className="h-9 w-auto object-contain" />
                </div>


            </nav>
        </div>
    )
}

export default Navbar