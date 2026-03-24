import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Save, Activity } from 'lucide-react';
import { api } from '../../../Api/api';
import toast from 'react-hot-toast';

const UpdateJobStatus = () => {
  const { job_id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { token } = useSelector((state) => state.auth);

  // Initialize status from navigation state or default to 'open'
  const [status, setStatus] = useState(state?.job?.status?.toLowerCase() || 'open');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Updating job status...");

    try {
      const response = await api.put(
        `/admin/change-job-status/${job_id}`, 
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success(`Job marked as ${status}`, { id: toastId });
        setTimeout(() => navigate('/job_Openings'), 1000);
      }
    } catch (error) {
      console.error("Status Update Error:", error);
      const msg = error.response?.data?.message || "Failed to update status";
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 font-sans flex items-center justify-center">
      <div className="max-w-md w-full">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-400 hover:text-red-600 mb-6 font-black text-[10px] uppercase tracking-widest transition-all"
        >
          <ArrowLeft size={14}/> Back to List
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
          <div className="h-2 bg-red-600"></div>
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Update Job Status</h2>
                <p className="text-slate-400 text-[9px] font-bold uppercase mt-1 tracking-widest">ID: {job_id}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-2xl text-red-600">
                <Activity size={24} />
              </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1">
                  Current Job Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus('open')}
                    className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${
                      status === 'open' 
                      ? 'bg-green-50 border-green-200 text-green-700 shadow-sm' 
                      : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    Open / Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('closed')}
                    className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${
                      status === 'closed' 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                      : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    Closed / Filled
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg shadow-red-100 active:scale-95"
              >
                <Save size={16}/> {loading ? 'Processing...' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateJobStatus;