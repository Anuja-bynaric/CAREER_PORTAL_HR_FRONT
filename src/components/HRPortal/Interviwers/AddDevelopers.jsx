import React, { useState, useRef, useEffect } from 'react';
import { 
  User, Mail, Phone, Briefcase, ChevronDown, 
  CheckCircle, Lock, Loader2, ArrowLeft, Check,
  Search, X, Hash, Cpu
} from 'lucide-react';
import { api } from '../../../Api/api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddDevelopers = () => {
  const user = useSelector((state) => state.auth?.user); 
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSkillOpen, setIsSkillOpen] = useState(false);
  const [skillSearch, setSkillSearch] = useState('');
  
  const dropdownRef = useRef(null);
  const skillRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'interviewer',
    employeeId: '',
    skills: []
  });

  const roles = [
    { value: 'interviewer', label: 'Interviewer' },
    { value: 'team-lead', label: 'Team Lead' },
    { value: 'project-manager', label: 'Project Manager' }
  ];

  const availableSkills = [
    "React", "Node.js", "Python", "Java", "AWS", "DevOps", 
    "UI/UX", "SQL", "MongoDB", "TypeScript", "Docker", "Kubernetes"
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsDropdownOpen(false);
      if (skillRef.current && !skillRef.current.contains(event.target)) setIsSkillOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (roleValue) => {
    setFormData((prev) => ({ ...prev, role: roleValue }));
    setIsDropdownOpen(false);
  };

  const toggleSkill = (skill) => {
    setFormData(prev => {
      const skills = prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill) 
        : [...prev.skills, skill];
      return { ...prev, skills };
    });
  };

  const filteredSkills = availableSkills.filter(s => 
    s.toLowerCase().includes(skillSearch.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        role: formData.role,
        employeeId: formData.employeeId,
        skills: formData.skills
      };

      const response = await api.post('/admin/interviewers', payload, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 201 || response.status === 200) {
        toast.success('Interviewer created successfully!', { id: toastId });
        navigate('/InterviewerList');
      }
    } catch (error) {
      const serverMessage = error.response?.data?.message || "Failed to create interviewer";
      toast.error(`Error: ${serverMessage}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6 ml-1">
          <button onClick={() => navigate('/InterviewerList')} className="flex items-center justify-center text-slate-500 hover:text-[#ff0000] transition-colors group">
            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:border-red-100 transition-all">
              <ArrowLeft size={20} />
            </div>
          </button>
          <div>
            <h2 className="text-xl font-bold text-[#1a202c] tracking-tight uppercase leading-none">Add Interviewers</h2>
            <p className="text-slate-500 text-xs mt-1 font-medium">Configure profile and technical expertise.</p>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                {/* Employee ID */}
                <div className="group">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Employee ID</label>
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] transition-colors w-4 h-4" />
                    <input name="employeeId" value={formData.employeeId} onChange={handleChange} required type="text" placeholder="EMP-1024" className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] transition-all placeholder:text-slate-300 text-xs font-medium" />
                  </div>
                </div>

                {/* Full Name */}
                <div className="group">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] transition-colors w-4 h-4" />
                    <input name="name" value={formData.name} onChange={handleChange} required type="text" placeholder="Jane Doe" className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] transition-all placeholder:text-slate-300 text-xs font-medium" />
                  </div>
                </div>

                {/* Email */}
                <div className="group">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] transition-colors w-4 h-4" />
                    <input name="email" value={formData.email} onChange={handleChange} required type="email" placeholder="jane.doe@company.com" className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] transition-all placeholder:text-slate-300 text-xs font-medium" />
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

                {/* Role Dropdown */}
                <div className="group relative" ref={dropdownRef}>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Select Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] transition-colors w-4 h-4 z-10" />
                    <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-100 rounded-xl text-left text-slate-600 text-xs font-medium transition-all flex items-center justify-between border-slate-100 focus:border-[#ff0000]">
                      <span className="uppercase tracking-wider">{formData.role.replace('-', ' ')}</span>
                      <ChevronDown size={14} className={`text-slate-300 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute z-50 left-0 right-0 mt-2 bg-[#f8fafc] border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-[#1a202c] px-4 py-2.5 flex items-center justify-between">
                          <span className="text-white text-[9px] font-black uppercase tracking-[0.1em]">Select New Role</span>
                        </div>
                        <div className="p-1.5 space-y-1">
                          {roles.map((role) => (
                            <button key={role.value} type="button" onClick={() => handleRoleSelect(role.value)} className={`w-full text-left px-4 py-3 text-[10px] font-black transition-all rounded-lg flex items-center justify-between uppercase tracking-widest ${formData.role === role.value ? 'bg-slate-200 text-[#1a202c]' : 'text-slate-500 hover:bg-white hover:text-[#1a202c]'}`}>
                              {role.label}
                              {formData.role === role.value && <Check size={12} className="text-red-500" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Searchable Skills Multi-Select */}
                <div className="group relative" ref={skillRef}>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Technical Skills</label>
                  <div className="relative">
                    <Cpu className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] transition-colors w-4 h-4 z-10" />
                    <div onClick={() => setIsSkillOpen(!isSkillOpen)} className="min-h-[42px] w-full pl-10 pr-10 py-2 bg-white border border-slate-100 rounded-xl cursor-pointer flex flex-wrap gap-1.5 items-center">
                      {formData.skills.length === 0 ? (
                        <span className="text-slate-300 text-xs">Select Skills...</span>
                      ) : (
                        formData.skills.map(s => (
                          <span key={s} className="bg-red-50 text-red-600 text-[9px] font-black px-2 py-1 rounded-md uppercase flex items-center gap-1 border border-red-100">
                            {s} <X size={10} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleSkill(s); }} />
                          </span>
                        ))
                      )}
                      <ChevronDown size={14} className="absolute right-3.5 text-slate-300" />
                    </div>

                    {isSkillOpen && (
                      <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-2 border-b border-slate-50">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-3 h-3" />
                            <input autoFocus placeholder="Search skills..." className="w-full pl-8 pr-3 py-2 bg-slate-50 rounded-lg text-xs outline-none" value={skillSearch} onChange={(e) => setSkillSearch(e.target.value)} />
                          </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto p-1.5">
                          {filteredSkills.map(skill => (
                            <div key={skill} onClick={() => toggleSkill(skill)} className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group/item">
                              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{skill}</span>
                              {formData.skills.includes(skill) && <Check size={12} className="text-red-500" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="group md:col-span-2">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Access Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] transition-colors w-4 h-4" />
                    <input name="password" value={formData.password} onChange={handleChange} required type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] transition-all placeholder:text-slate-300 text-xs font-medium" />
                  </div>
                </div>

              </div>

              <div className="flex justify-center pt-5 border-t border-gray-50">
                <button type="submit" disabled={loading} className="w-1/2 bg-[#ff0000] disabled:bg-slate-300 text-white font-black py-2.5 rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-100 uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={12} /> : <CheckCircle size={12} />}
                  {loading ? 'Creating...' : 'Register Interviewer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDevelopers;