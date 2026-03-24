import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, ClipboardEdit } from 'lucide-react';
import { useSelector } from 'react-redux'; 
import { api } from '../../../Api/api'; 
import toast from 'react-hot-toast';

const UpdateStatus = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { candidateId } = useParams(); 
  
  // Update: Get user from Redux and derive token
  const { user } = useSelector((state) => state.auth);
  const token = user?.token || localStorage.getItem('token'); 
  
  const candidate = state?.candidate;

  const [status, setStatus] = useState(candidate?.status?.toLowerCase() || 'shortlisted');
  const [note, setNote] = useState(candidate?.notes || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Authentication session expired. Please log in again.");
      return;
    }

    const targetId = candidate?.id || candidateId;

    if (!targetId || targetId === "undefined") {
      toast.error("Invalid Candidate ID.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating status...");

    try {
      const response = await api.patch(
        `/user/${targetId}/status`, // Updated to match your router: router.patch('/:id/status'...)
        { 
          status: status, 
          notes: note 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success("Status Updated Successfully!", { id: toastId });
        setTimeout(() => navigate(-1), 1000); 
      }
    } catch (error) {
      console.error("Update Status Error:", error);
      const errorMessage = error.response?.data?.message || "Failed to update status.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const displayName = candidate?.name || candidate?.fullName || "Candidate";

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans flex items-start justify-center">
      <div className="max-w-md w-full">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1.5 text-slate-400 hover:text-red-600 mb-4 font-black text-[9px] uppercase tracking-widest transition-colors"
        >
          <ArrowLeft size={12}/> Back
        </button>

        <div className="bg-white rounded-[1.5rem] shadow-xl shadow-slate-200 overflow-hidden border border-slate-100">
          <div className="h-2.5 bg-red-600"></div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Update Status</h2>
                <p className="text-slate-400 text-[8px] font-black mt-0.5 uppercase tracking-widest">
                  Progress for {displayName}
                </p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl text-slate-300 border border-slate-50">
                <ClipboardEdit size={18} />
              </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Candidate Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/10 transition-all"
                  disabled={loading}
                >
                  <option value="pending">Pending</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </select>
              </div>

              <div>
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Internal Notes</label>
                <textarea 
                  rows="3"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add feedback..."
                  disabled={loading}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-600 text-[11px] focus:outline-none focus:ring-2 focus:ring-red-500/10 transition-all"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="submit"
                  disabled={loading}
                  className={`flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${loading ? 'opacity-70' : ''}`}
                >
                  <Save size={14}/> {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  onClick={() => navigate(-1)}
                  className="px-5 bg-white border border-slate-200 text-slate-400 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatus;