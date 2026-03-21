import React, { useState } from 'react';
import { 
  User, Mail, Phone, Briefcase, ChevronDown, Upload, 
  FileText, CheckCircle, Lock, Loader2, ArrowLeft 
} from 'lucide-react';
import { api } from '../../Api/api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddDevelopers = () => {
  const user = useSelector((state) => state.auth?.user); 
  const token = user?.token;
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('manual');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'interviewer'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Update this check based on your actual auth state
  if (!user) { 
    toast.error("Session expired. Please login again.");
    return;
  }

  const toastId = toast.loading("Creating interviewer...");
  setLoading(true);

  try {
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber || null,
      role: formData.role 
    };

    const response = await api.post('/admin/interviewers', payload, {
      withCredentials: true, // Crucial for cookie-based authentication
      headers: {
        'Content-Type': 'application/json'
        // Remove manual Authorization header if using HTTP-only cookies
      }
    });

      if (response.status === 201 || response.status === 200) {
        toast.success('Interviewer created successfully!', { id: toastId });
        // Reset form on success
        setFormData({ 
          name: '', 
          email: '', 
          password: '', 
          phoneNumber: '', 
          role: 'interviewer' 
        });
      }
    } catch (error) {
      console.error("Submission Error:", error.response?.data);
      const serverMessage = error.response?.data?.message || "Failed to create interviewer";
      toast.error(`Error: ${serverMessage}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-6 ml-1">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center justify-center text-slate-500 hover:text-[#ff0000] transition-colors group"
            title="Back to Dashboard"
          >
            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:border-red-100 transition-all">
              <ArrowLeft size={20} />
            </div>
          </button>

          <div>
            <h2 className="text-xl font-bold text-[#1a202c] tracking-tight uppercase leading-none">
              Add Interviewers
            </h2>
            <p className="text-slate-500 text-xs mt-1 font-medium">
              Add to your panel manually or via bulk upload.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex justify-center py-4 border-b border-gray-50 bg-gray-50/30">
            <div className="flex bg-gray-100/80 p-1 rounded-xl w-fit">
              <button 
                type="button"
                onClick={() => setActiveTab('manual')}
                className={`flex items-center gap-2 px-6 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 ${activeTab === 'manual' ? 'bg-white text-[#ff0000] shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <FileText size={12} /> Manual Entry
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('csv')}
                className={`flex items-center gap-2 px-6 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 ${activeTab === 'csv' ? 'bg-white text-[#ff0000] shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Upload size={12} /> CSV Upload
              </button>
            </div>
          </div>

          <div className="px-8 py-10">
            {activeTab === 'manual' ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Full Name */}
                  <div className="group">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] transition-colors w-4 h-4" />
                      <input name="name" value={formData.name} onChange={handleChange} required type="text" placeholder="Jane Doe" className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] transition-all placeholder:text-slate-300 text-xs font-medium" />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="group">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] transition-colors w-4 h-4" />
                      <input name="email" value={formData.email} onChange={handleChange} required type="email" placeholder="jane.doe@company.com" className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] transition-all placeholder:text-slate-300 text-xs font-medium" />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="group">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] transition-colors w-4 h-4" />
                      <input name="password" value={formData.password} onChange={handleChange} required type="password" placeholder="securepassword123" className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] transition-all placeholder:text-slate-300 text-xs font-medium" />
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="group">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Contact</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] transition-colors w-4 h-4" />
                      <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} type="tel" placeholder="9876543210" className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] transition-all placeholder:text-slate-300 text-xs font-medium" />
                    </div>
                  </div>

                  {/* Role Select */}
                  <div className="group">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Select Role</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] transition-colors w-4 h-4" />
                      <select name="role" value={formData.role} onChange={handleChange} className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] appearance-none text-slate-600 text-xs font-medium cursor-pointer transition-all">
                        <option value="interviewer">Interviewer</option>
                        <option value="team-lead">Team Lead</option>
                        <option value="project-manager">Project Manager</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-5 border-t border-gray-50">
                  <button type="submit" disabled={loading} className="w-1/2 bg-[#ff0000] disabled:bg-slate-300 text-white font-black py-2.5 rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-100 uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={12} /> : <CheckCircle size={12} />}
                    {loading ? 'Processing...' : 'Submit Details'}
                  </button>
                </div>
              </form>
            ) : (
              /* CSV Upload Section */
              <div className="space-y-6">
                 <label htmlFor="csv-upload" className="border-2 border-dashed border-slate-100 rounded-[2rem] p-10 flex flex-col items-center justify-center bg-slate-50/20 hover:bg-red-50/10 hover:border-[#ff0000]/20 transition-all cursor-pointer group">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md border border-gray-50 mb-4 group-hover:scale-110 transition-transform duration-500">
                    <Upload className="text-[#ff0000] w-6 h-6" />
                  </div>
                  <p className="text-lg font-semibold text-[#1a202c]">Click to upload CSV</p>
                  <input type="file" accept=".csv" className="hidden" id="csv-upload" />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDevelopers;