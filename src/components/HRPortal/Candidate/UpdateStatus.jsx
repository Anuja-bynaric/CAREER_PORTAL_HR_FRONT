import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, ClipboardEdit, ChevronDown, Check } from 'lucide-react';
import { useSelector } from 'react-redux';
import { api } from '../../../Api/api';
import toast from 'react-hot-toast';

const UpdateStatus = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { candidateId } = useParams();

  const { user } = useSelector((state) => state.auth);
  const token = user?.token;

  const candidate = state?.candidate;

  const [status, setStatus] = useState(candidate?.status?.toLowerCase() || 'shortlisted');
  const [note, setNote] = useState(candidate?.notes || '');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-amber-400' },
    { value: 'shortlisted', label: 'Shortlisted', color: 'bg-blue-400' },
    { value: 'shortlisted for Technical Round', label: 'shortlisted for Technical Round', color: 'bg-indigo-500' },
    { value: 'shortlisted for HR Round', label: 'shortlisted for HR Round', color: 'bg-purple-500' },
    { value: 'shortlisted for Managerial Round', label: 'shortlisted for Managerial Round', color: 'bg-cyan-500' },
    { value: 'rejected', label: 'Rejected', color: 'bg-rose-500' },
    { value: 'hired', label: 'Hired', color: 'bg-emerald-500' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    if (!user) {
      toast.error("Session expired. Please log in.");
      return;
    }
    const targetId = candidate?.id || candidateId;
    if (!targetId || targetId === "undefined") {
      toast.error("Invalid Candidate ID.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating...");
    try {
      const response = await api.patch(
        `/user/${targetId}/status`,
        { status: status, notes: note },
      );
      if (response.data.success) {
        toast.success("Updated!", { id: toastId });
        setTimeout(() => navigate(-1), 800);
      }
    } catch (error) {
      toast.error("Failed to update.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const displayName = candidate?.name || candidate?.fullName || "Candidate";

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 font-sans flex items-start justify-center">
      <div className="max-w-sm w-full">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-slate-400 hover:text-red-600 mb-4 font-black text-[8px] uppercase tracking-[0.2em] transition-all"
        >
          <ArrowLeft size={10} /> Back
        </button>

        <div className="bg-white rounded-[1.2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 relative">
          <div className="h-1.5 bg-red-600"></div>
          <div className="p-5">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Update Status</h2>
                <p className="text-slate-400 text-[7px] font-bold mt-0.5 uppercase tracking-widest italic">
                  Candidate: <span className="text-slate-900 not-italic">{displayName}</span>
                </p>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg text-slate-300 border border-slate-100">
                <ClipboardEdit size={14} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative" ref={dropdownRef}>
                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-0.5">Application Status</label>

                <button
                  type="button"
                  onClick={() => !loading && setIsOpen(!isOpen)}
                  className={`w-full h-9 px-3 bg-slate-50/50 border border-slate-100 rounded-lg font-bold text-slate-700 text-[9px] flex justify-between items-center transition-all ${loading ? 'opacity-50' : 'hover:border-slate-300 hover:bg-white active:scale-[0.99]'}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${statusOptions.find(o => o.value === status)?.color}`} />
                    <span className="uppercase tracking-wider font-black truncate max-w-[150px]">
                      {status}
                    </span>
                  </div>
                  <ChevronDown size={10} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 shadow-2xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 flex flex-col">
                    {/* Sticky Header stays at the top */}
                    <div className="shrink-0 bg-slate-900 px-3 py-2 flex items-center justify-between">
                      <span className="text-white text-[7px] font-black uppercase tracking-widest">Select New Status</span>
                      <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></div>
                    </div>

                    {/* Scrollable Area - Fixed height and auto overflow */}
                    <div className="overflow-y-auto max-h-[160px] p-1 bg-white">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setStatus(option.value);
                            setIsOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-[8px] font-black uppercase tracking-tight transition-all flex items-center justify-between group mb-0.5
            ${status === option.value ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`shrink-0 w-1.5 h-1.5 rounded-full ${option.color}`} />
                            <span className="truncate">{option.label}</span>
                          </div>
                          {status === option.value && <Check size={10} className="text-red-600 shrink-0 ml-2" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-0.5">Internal Feedback</label>
                <textarea
                  rows="2"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Note for HR team..."
                  disabled={loading}
                  className="w-full p-2.5 bg-slate-50/50 border border-slate-100 rounded-lg font-bold text-slate-600 text-[10px] focus:outline-none focus:bg-white focus:border-slate-300 transition-all resize-none"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={loading}
                  className="flex-1 bg-slate-900 hover:bg-red-600 text-white h-10 rounded-lg font-black text-[9px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-slate-200"
                >
                  <Save size={12} /> {loading ? 'Updating...' : 'Save Status'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 bg-white border border-slate-200 text-slate-400 h-10 rounded-lg font-black text-[8px] uppercase tracking-widest transition-all hover:bg-slate-50 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatus;