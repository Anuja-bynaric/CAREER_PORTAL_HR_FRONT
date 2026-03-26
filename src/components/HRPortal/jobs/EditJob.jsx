import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Plus, X, Code2, ListChecks } from 'lucide-react';
import { useSelector } from 'react-redux'; 
import { api } from '../../../Api/api';
import toast from 'react-hot-toast';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useSelector((state) => state.auth); 
  
  const jobToEdit = location.state?.job || { title: "", status: "Active" };

  // Update 1: Initialize 'skills' as a string by joining the requirements array
  const [formData, setFormData] = useState({
    title: jobToEdit.title || "",
    status: jobToEdit.status || "Active",
    location: jobToEdit.location || "",
    experience: jobToEdit.experience || "",
    jobType: jobToEdit.jobType || "Full-time",
    category: jobToEdit.category || "",
    description: jobToEdit.description || "",
    about: jobToEdit.about || "",
    skills: Array.isArray(jobToEdit.requirements) ? jobToEdit.requirements.join(', ') : "",
    responsibilities: Array.isArray(jobToEdit.responsibilities) ? jobToEdit.responsibilities.join(', ') : "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Updating job...");
    
    try {
      // Update 2: Map the string fields back to arrays for the backend
      const submissionData = {
        ...formData,
        requirements: formData.skills
          .split(',')
          .map(item => item.trim())
          .filter(i => i !== ""),
        responsibilities: formData.responsibilities
          .split(',')
          .map(item => item.trim())
          .filter(i => i !== "")
      };

      // Remove the UI-only 'skills' key before sending
      delete submissionData.skills;

      const response = await api.put(`/admin/update/jobs/${id || jobToEdit.id || jobToEdit.jobId}`, submissionData, {
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
      const response = await api.delete(`/admin/delete/jobs/${id || jobToEdit.id || jobToEdit.jobId}`, {
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
  const labelStyle = "text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2";

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/job_Openings')} 
            className="flex items-center justify-center text-slate-500 hover:text-red-600 transition-colors group"
          >
            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:border-red-100 transition-all">
              <ArrowLeft size={20} />
            </div>
          </button>
          <div>
            <h2 className="text-1xl font-black text-slate-800 tracking-tight uppercase leading-none">Edit Job Opening</h2>
            <p className="text-slate-500 text-[11px] font-medium mt-1">Edit details for {id || jobToEdit.jobId || jobToEdit.id}</p>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] shadow-lg shadow-slate-200/50 border border-gray-100 overflow-hidden mb-10">
          <div className="h-2.5 bg-[#ff0000]"></div>
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-6 border-b border-slate-50 pb-4">
              <p className="text-1xl font-black text-slate-800 tracking-tight uppercase">{formData.title}</p>
              <button onClick={handleDelete} className="flex items-center gap-1.5 text-slate-400 hover:text-red-600 transition-all text-[10px] font-black uppercase">
                <Trash2 size={14} /> Delete Job
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelStyle}>Job Designation</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Experience</label>
                  <input type="text" name="experience" value={formData.experience} onChange={handleChange} className={inputStyle} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Posting Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className={inputStyle}>
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Job Type</label>
                  <select name="jobType" value={formData.jobType} onChange={handleChange} className={inputStyle}>
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelStyle}>Description</label>
                <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className={`${inputStyle} resize-none`} />
              </div>

              {/* Update 3: Changed to Textareas for comma-separated input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}><Code2 size={12} className="text-red-500" /> Technical Skills</label>
                  <textarea 
                    name="skills" 
                    rows="4" 
                    value={formData.skills} 
                    onChange={handleChange} 
                    placeholder="React, Node.js, TypeScript..." 
                    className={`${inputStyle} resize-none`} 
                  />
                </div>
                <div>
                  <label className={labelStyle}><ListChecks size={12} className="text-red-500" /> Responsibilities</label>
                  <textarea 
                    name="responsibilities" 
                    rows="4" 
                    value={formData.responsibilities} 
                    onChange={handleChange} 
                    placeholder="UI Development, API integration..." 
                    className={`${inputStyle} resize-none`} 
                  />
                </div>
              </div>

              <div className="pt-6 flex gap-3 border-t border-slate-50">
                <button type="submit" className="flex-1 bg-[#ff0000] hover:bg-red-700 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.1em] transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5">
                  <Save size={14} /> Save Changes
                </button>
                <button type="button" onClick={() => navigate('/job_Openings')} className="px-6 py-3 border border-slate-100 text-slate-400 rounded-xl font-black text-[9px] uppercase hover:bg-slate-50 transition-all">
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