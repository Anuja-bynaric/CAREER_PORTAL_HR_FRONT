import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Code2, ListChecks, Clock, Hash, MapPin, Briefcase } from 'lucide-react';
import { useSelector } from 'react-redux'; 
import { api } from '../../../Api/api';
import toast from 'react-hot-toast';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useSelector((state) => state.auth); 
  
  const jobToEdit = location.state?.job || { title: "", status: "Active" };

  // Helper to parse "2-5 years" into [2, 5]
  const parseExperience = (expString) => {
    if (!expString) return { min: "", max: "" };
    const match = expString.match(/(\d+)-(\d+)/);
    return match ? { min: match[1], max: match[2] } : { min: "", max: "" };
  };

  const initialExp = parseExperience(jobToEdit.experience);

  const [formData, setFormData] = useState({
    title: jobToEdit.title || "",
    status: jobToEdit.status || "Active",
    location: jobToEdit.location || "",
    minExperience: initialExp.min, // Split field
    maxExperience: initialExp.max, // Split field
    jobType: jobToEdit.jobType || "Full-time",
    description: jobToEdit.description || "",
    skills: Array.isArray(jobToEdit.requirements) ? jobToEdit.requirements.join(', ') : "",
    responsibilities: Array.isArray(jobToEdit.responsibilities) ? jobToEdit.responsibilities.join(', ') : "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (parseInt(formData.minExperience) > parseInt(formData.maxExperience)) {
        return toast.error("Min experience cannot be greater than Max experience");
    }

    const loadingToast = toast.loading("Updating job...");
    
    try {
      const submissionData = {
        ...formData,
        // Re-combine into the string format the backend expects
        experience: `${formData.minExperience}-${formData.maxExperience} years`,
        requirements: formData.skills
          .split(',')
          .map(item => item.trim())
          .filter(i => i !== ""),
        responsibilities: formData.responsibilities
          .split(',')
          .map(item => item.trim())
          .filter(i => i !== "")
      };

      delete submissionData.skills;
      delete submissionData.minExperience;
      delete submissionData.maxExperience;

      const response = await api.put(`/admin/update/jobs/${id || jobToEdit.id || jobToEdit.jobId}`, submissionData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success("Job Updated Successfully!", { id: loadingToast });
        navigate('/job_Openings');
      }
    } catch (error) {
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
      toast.error(error.response?.data?.message || "Failed to delete job", { id: loadingToast });
    }
  };

  const inputStyle = "w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] text-[11px] font-bold text-slate-700 transition-all";
  const labelStyle = "text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2 mb-2";

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/job_Openings')} className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 hover:text-red-600 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-1xl font-black text-slate-800 tracking-tight uppercase leading-none">Edit Job Opening</h2>
            <p className="text-slate-500 text-[11px] font-medium mt-1">ID: {id || jobToEdit.jobId || jobToEdit.id}</p>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] shadow-lg border border-gray-100 overflow-hidden mb-10">
          <div className="h-2 bg-red-600"></div>
          
          <div className="p-8">
            <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-4">
              <p className="text-lg font-black text-slate-800 uppercase tracking-tight">{formData.title || "New Job"}</p>
              <button onClick={handleDelete} className="flex items-center gap-1.5 text-slate-400 hover:text-red-600 transition-all text-[10px] font-black uppercase">
                <Trash2 size={14} /> Delete
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Designation & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}><Briefcase size={12} className="text-red-500"/> Job Designation</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputStyle} required />
                </div>
                <div>
                  <label className={labelStyle}><MapPin size={12} className="text-red-500"/> Location</label>
                  <select name="location" value={formData.location} onChange={handleChange} required className={inputStyle}>
                    <option value="">Select Location</option>
                    <option value="Pune">Pune</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              {/* Min & Max Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}><Clock size={12} className="text-red-500"/> Min Experience (Years)</label>
                  <input type="number" name="minExperience" value={formData.minExperience} onChange={handleChange} className={inputStyle} required />
                </div>
                <div>
                  <label className={labelStyle}><Hash size={12} className="text-red-500"/> Max Experience (Years)</label>
                  <input type="number" name="maxExperience" value={formData.maxExperience} onChange={handleChange} className={inputStyle} required />
                </div>
              </div>

              {/* Status & Job Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div className="flex gap-4 mt-2">
                    {['Full-time', 'Internship', 'Contract'].map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="jobType"
                          value={type}
                          checked={formData.jobType === type}
                          onChange={handleChange}
                          className="w-3.5 h-3.5 text-red-600"
                        />
                        <span className={`text-[10px] font-bold uppercase ${formData.jobType === type ? 'text-slate-900' : 'text-slate-400'}`}>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={labelStyle}>Job Description</label>
                <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className={`${inputStyle} resize-none`} required />
              </div>

              {/* Skills & Responsibilities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}><Code2 size={12} className="text-red-500" /> Technical Skills</label>
                  <textarea name="skills" rows="4" value={formData.skills} onChange={handleChange} placeholder="Comma separated..." className={`${inputStyle} resize-none`} />
                </div>
                <div>
                  <label className={labelStyle}><ListChecks size={12} className="text-red-500" /> Responsibilities</label>
                  <textarea name="responsibilities" rows="4" value={formData.responsibilities} onChange={handleChange} placeholder="Comma separated..." className={`${inputStyle} resize-none`} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex gap-3 border-t border-slate-50">
                <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                  <Save size={16} /> Update Job
                </button>
                <button type="button" onClick={() => navigate('/job_Openings')} className="px-8 py-3.5 border border-slate-100 text-slate-400 rounded-xl font-black text-[10px] uppercase hover:bg-slate-50 transition-all">
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