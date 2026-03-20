import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Plus, X } from 'lucide-react';
import { useSelector } from 'react-redux'; 
import { api } from '../Api/api';
import toast from 'react-hot-toast'; // Import toast

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useSelector((state) => state.auth); 
  
  const jobToEdit = location.state?.job || { title: "", status: "Active" };

  const [formData, setFormData] = useState({
    title: jobToEdit.title || "",
    status: jobToEdit.status || "Active",
    location: jobToEdit.location || "",
    experience: jobToEdit.experience || "",
    jobType: jobToEdit.jobType || "Full-time",
    category: jobToEdit.category || "",
    description: jobToEdit.description || "",
    about: jobToEdit.about || "",
    requirements: jobToEdit.requirements || [""],
    responsibilities: jobToEdit.responsibilities || [""],
  });

  const handleArrayChange = (index, value, field) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeArrayField = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Updating job...");
    try {
      const response = await api.put(`/admin/edit/job/${id || jobToEdit.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success("Job Updated Successfully!", { id: loadingToast });
        navigate('/job_Openings');
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.response?.data?.message || "Failed to update job", { id: loadingToast });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job opening?")) return;
    
    const loadingToast = toast.loading("Deleting job...");
    try {
      const response = await api.delete(`/admin/delete/jobs/${id || jobToEdit.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success("Job Deleted Successfully!", { id: loadingToast });
        navigate('/job_Openings');
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(error.response?.data?.message || "Failed to delete job", { id: loadingToast });
    }
  };

  const inputStyle = "w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] text-[11px] font-bold text-slate-700 transition-all";
  const labelStyle = "text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1";

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1.5 text-slate-400 hover:text-[#ff0000] transition-colors mb-5 text-[8px] font-black uppercase tracking-widest"
        >
          <ArrowLeft size={12} /> Back to Dashboard
        </button>

        <div className="bg-white rounded-[1.5rem] shadow-lg shadow-slate-200/50 border border-gray-100 overflow-hidden mb-10">
          <div className="h-2.5 bg-[#ff0000]"></div>
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight uppercase">Edit Job Opening</h2>
                <p className="text-slate-400 text-[9px] font-bold mt-0.5 tracking-tighter">Edit details for {id || jobToEdit.id}</p>
              </div>
              <button 
                type="button"
                onClick={handleDelete}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className={labelStyle}>Job Designation</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={inputStyle} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelStyle}>Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className={inputStyle} placeholder="e.g. Pune, India" />
                </div>
                <div className="space-y-1.5">
                  <label className={labelStyle}>Experience</label>
                  <input type="text" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} className={inputStyle} placeholder="e.g. 2-4 Years" />
                </div>
                <div className="space-y-1.5">
                  <label className={labelStyle}>Job Type</label>
                  <select value={formData.jobType} onChange={(e) => setFormData({...formData, jobType: e.target.value})} className={inputStyle}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className={labelStyle}>Category</label>
                  <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className={inputStyle} placeholder="e.g. Engineering" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelStyle}>Posting Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className={inputStyle}>
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className={labelStyle}>Posted Date</label>
                  <input type="text" disabled value={jobToEdit.postedDate} className="w-full px-4 py-2.5 bg-gray-100 border border-gray-100 rounded-xl text-[11px] font-bold text-gray-400 cursor-not-allowed" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelStyle}>Description</label>
                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className={`${inputStyle} resize-none`} />
              </div>

              <div className="space-y-1.5">
                <label className={labelStyle}>About the Company</label>
                <textarea rows="3" value={formData.about} onChange={(e) => setFormData({...formData, about: e.target.value})} className={`${inputStyle} resize-none`} />
              </div>

              {/* Requirements Section */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className={labelStyle}>Requirements</label>
                  <button type="button" onClick={() => addArrayField('requirements')} className="text-red-600 font-black text-[8px] uppercase flex items-center gap-1 hover:underline">
                    <Plus size={10} /> Add Requirement
                  </button>
                </div>
                {formData.requirements.map((req, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input type="text" value={req} onChange={(e) => handleArrayChange(idx, e.target.value, 'requirements')} className={inputStyle} />
                    <button type="button" onClick={() => removeArrayField(idx, 'requirements')} className="text-slate-300 hover:text-red-500"><X size={14} /></button>
                  </div>
                ))}
              </div>

              {/* Responsibilities Section */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className={labelStyle}>Responsibilities</label>
                  <button type="button" onClick={() => addArrayField('responsibilities')} className="text-red-600 font-black text-[8px] uppercase flex items-center gap-1 hover:underline">
                    <Plus size={10} /> Add Responsibility
                  </button>
                </div>
                {formData.responsibilities.map((res, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input type="text" value={res} onChange={(e) => handleArrayChange(idx, e.target.value, 'responsibilities')} className={inputStyle} />
                    <button type="button" onClick={() => removeArrayField(idx, 'responsibilities')} className="text-slate-300 hover:text-red-500"><X size={14} /></button>
                  </div>
                ))}
              </div>

              <div className="pt-6 flex gap-3">
                <button type="submit" className="flex-1 bg-[#ff0000] hover:bg-red-700 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.1em] transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5">
                  <Save size={14} /> Save Changes
                </button>
                <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 border border-slate-100 text-slate-400 rounded-xl font-black text-[9px] uppercase tracking-[0.1em] hover:bg-slate-50 transition-all">
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