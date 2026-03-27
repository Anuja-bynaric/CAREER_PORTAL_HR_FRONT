import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../Api/api';
import toast from 'react-hot-toast';
import { Save, ChevronDown } from 'lucide-react';

const EditInterview = () => {
  const { Interview_id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ scheduledAt: '', notes: '', status: '' });
  const [loading, setLoading] = useState(true);
  
  // Custom Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const statusOptions = ['scheduled', 'completed', 'cancelled'];

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await api.get(`/admin/interviews/${Interview_id}`);
        const data = res.data.data;
        const date = new Date(data.scheduledAt);
        const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        
        setFormData({ scheduledAt: formattedDate, notes: data.notes || '', status: data.status });
      } catch (error) {
        toast.error("Error loading interview");
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [Interview_id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/admin/interviews/${Interview_id}/reschedule`, {
        scheduledAt: formData.scheduledAt,
        notes: formData.notes
      });

      await api.patch(`/admin/interviews/${Interview_id}/status`, {
        status: formData.status,
        remarks: formData.notes
      });

      toast.success("Interview updated successfully");
      navigate(-1);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Update failed";
      toast.error(`Error: ${errorMsg}`); 
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse text-slate-400 font-black uppercase text-[10px] tracking-widest">Loading Interview...</div>;

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-8">
        <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-6">Edit Interview</h2>
        
        <form onSubmit={handleUpdate} className="space-y-5">
          {/* Date Input */}
          <div>
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">New Schedule (IST)</label>
            <input 
              type="datetime-local"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-red-500 outline-none"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
              required
            />
          </div>

          {/* Custom Dropdown UI */}
          <div className="relative" ref={dropdownRef}>
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Current Status</label>
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <span className="capitalize">{formData.status}</span>
              <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {isDropdownOpen && (
              <div className="absolute z-50 w-full mt-2 bg-[#0d1117] rounded-2xl shadow-2xl border border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-2 text-[8px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                  Select Status
                </div>
                <div className="py-1">
                  {statusOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => {
                        setFormData({ ...formData, status: option });
                        setIsDropdownOpen(false);
                      }}
                      className={`px-4 py-3 text-sm font-bold capitalize cursor-pointer transition-colors ${
                        formData.status === option 
                          ? 'bg-blue-600 text-white' 
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notes Textarea */}
          <div>
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Internal Notes / Remarks</label>
            <textarea 
              rows="3"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-red-500"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 bg-red-600 text-white px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-red-200 hover:bg-red-700 transition-all active:scale-95"
            >
              <Save size={14}/> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInterview;