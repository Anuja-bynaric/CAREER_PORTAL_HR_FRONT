import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

const EditJob = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobToEdit = location.state?.job || { title: "", status: "Active" };

  const [formData, setFormData] = useState({
    title: jobToEdit.title,
    status: jobToEdit.status,
    description: "Sample job description here...",
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log("Updated Data:", formData);
    alert("Job Updated Successfully!");
    navigate('/job_Openings');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      {/* Container width reduced from max-w-3xl to max-w-xl */}
      <div className="max-w-xl mx-auto">
        
        {/* Navigation - Font size reduced to text-[8px] */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1.5 text-slate-400 hover:text-[#ff0000] transition-colors mb-5 text-[8px] font-black uppercase tracking-widest"
        >
          <ArrowLeft size={12} /> Back to Dashboard
        </button>

        <div className="bg-white rounded-[1.5rem] shadow-lg shadow-slate-200/50 border border-gray-100 overflow-hidden">
          {/* Header Bar - Height reduced */}
          <div className="h-2.5 bg-[#ff0000]"></div>
          
          <div className="p-6"> {/* Padding reduced from p-10 to p-6 */}
            <div className="flex justify-between items-start mb-6">
              <div>
                {/* Title size reduced from text-3xl to text-xl */}
                <h2 className="text-xl font-bold text-slate-800 tracking-tight uppercase">Edit Job Opening</h2>
                <p className="text-slate-400 text-[9px] font-bold mt-0.5 tracking-tighter ">Edit details for {jobToEdit.id}</p>
              </div>
              <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              {/* Job Title */}
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Job Designation</label>
                <input 
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] text-[11px] font-bold text-slate-700 transition-all"
                  placeholder="e.g. Senior React Developer"
                />
              </div>

              {/* Status & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Posting Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#ff0000] text-[11px] font-bold text-slate-700 appearance-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Posted Date</label>
                  <input 
                    type="text"
                    disabled
                    value={jobToEdit.postedDate}
                    className="w-full px-4 py-2.5 bg-gray-100 border border-gray-100 rounded-xl text-[11px] font-bold text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Action Buttons - Size reduced */}
              <div className="pt-4 flex gap-3">
                <button 
                  type="submit"
                  className="flex-1 bg-[#ff0000] hover:bg-red-700 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.1em] transition-all shadow-md shadow-red-100 active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Save size={14} /> Save Changes
                </button>
                <button 
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 border border-slate-100 text-slate-400 rounded-xl font-black text-[9px] uppercase tracking-[0.1em] hover:bg-slate-50 transition-all"
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

export default EditJob;