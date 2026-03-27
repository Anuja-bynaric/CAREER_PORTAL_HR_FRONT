// Navbar.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogout } from '../../../redux/authSlice';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { api } from '../../../Api/api'; 
import toast from 'react-hot-toast';

const logo = "/assets/logo.png";

function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        try {
            // 1. Call Backend Logout API with required configuration
            // Using your endpoint: /user/logout with withCredentials: true
            await api.post('/user/logout', {}, { withCredentials: true }); 

            // 2. Clear Redux State using your slice action
            dispatch(setLogout());

            // 3. Navigate to the login page (or /career as per your snippet)
            toast.success("Logged out successfully");
            navigate('/login'); 
            
            console.log("Cookie cleared and state reset");
        } catch (error) {
            console.error("Logout failed:", error);
            // Force frontend logout even if the network request fails
            dispatch(setLogout());
            navigate('/login');
        }
    };

    return (
        <nav className="flex items-center justify-between px-8 py-3 bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="cursor-pointer shrink-0" onClick={() => navigate('/landing')}>
                <img src={logo} alt="Bynaric Logo" className="h-9 w-auto object-contain" />
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <div className="relative group">
                        <div className="flex items-center gap-3 cursor-pointer py-2 px-3 rounded-xl transition-colors group-hover:bg-gray-50">
                            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-600 border border-red-100 shadow-sm">
                                <User size={18} />
                            </div>
                            <div className="text-left leading-tight">
                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Welcome</p>
                                <p className="text-sm font-bold text-slate-800">{user.name}</p>
                            </div>
                            <button className="outline-none">
                                <ChevronDown size={14} className="text-gray-300 group-hover:text-red-600 transition-transform group-hover:rotate-180" />
                            </button>
                        </div>

                        <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                            <div className="bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden min-w-[160px]">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-5 py-4 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                                >
                                    <LogOut size={16} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-red-600"
                    >
                        Sign In
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;