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
    description: "Sample job description here...", // Optional fields
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log("Updated Data:", formData);
    alert("Job Updated Successfully!");
    navigate('/job_Openings');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-400 hover:text-[#ff0000] transition-colors mb-8 text-[10px] font-black uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-gray-100 overflow-hidden">
          <div className="h-4 bg-[#ff0000]"></div>
          
          <div className="p-10">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Edit Job Opening</h2>
                <p className="text-slate-400 text-xs font-bold mt-1 tracking-tighter italic">Modify details for {jobToEdit.id}</p>
              </div>
              <button className="p-3 text-slate-300 hover:text-red-500 transition-colors">
                <Trash2 size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-8">
              {/* Job Title */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Job Designation</label>
                <input 
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] text-sm font-bold text-slate-700 transition-all"
                  placeholder="e.g. Senior React Developer"
                />
              </div>

              {/* Status & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Posting Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#ff0000] text-sm font-bold text-slate-700 appearance-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Posted Date</label>
                  <input 
                    type="text"
                    disabled
                    value={jobToEdit.postedDate}
                    className="w-full px-6 py-4 bg-gray-100 border border-gray-100 rounded-2xl text-sm font-bold text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex gap-4">
                <button 
                  type="submit"
                  className="flex-1 bg-[#ff0000] hover:bg-red-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-red-100 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Save size={16} /> Save Changes
                </button>
                <button 
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-8 py-4 border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-[0.1em] hover:bg-slate-50 transition-all"
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