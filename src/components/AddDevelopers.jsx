import React, { useState } from 'react';
import { User, Mail, Phone, Briefcase, ChevronDown, Upload, FileText, CheckCircle } from 'lucide-react';

const AddDevelopers = () => {
  const [activeTab, setActiveTab] = useState('manual');

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Page Title - Left Aligned */}
        <div className="mb-5 ml-1">
          <h2 className="text-2xl font-black text-[#1a202c] tracking-tight uppercase">Add Interviewers</h2>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">Add to your panel manually or via bulk upload.</p>
        </div>

        {/* Main Content Container - Wide Layout */}
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Internal Tab Switcher */}
          <div className="flex justify-center py-4 border-b border-gray-50 bg-gray-50/30">
            <div className="flex bg-gray-100/80 p-1 rounded-xl w-fit">
              <button 
                onClick={() => setActiveTab('manual')}
                className={`flex items-center gap-2 px-6 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 ${activeTab === 'manual' ? 'bg-white text-[#ff0000] shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <FileText size={12} />
                Manual Entry
              </button>
              <button 
                onClick={() => setActiveTab('csv')}
                className={`flex items-center gap-2 px-6 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 ${activeTab === 'csv' ? 'bg-white text-[#ff0000] shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Upload size={12} />
                CSV Upload
              </button>
            </div>
          </div>

          <div className="px-8 py-10">
            {activeTab === 'manual' ? (
              <form className="space-y-6">
                {/* Two-Column Input Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  
                  {/* Full Name */}
                  <div className="group">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] transition-colors w-4 h-4" />
                      <input 
                        type="text" 
                        placeholder="Enter name" 
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] transition-all placeholder:text-slate-300 text-xs font-medium" 
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="group">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] transition-colors w-4 h-4" />
                      <input 
                        type="email" 
                        placeholder="email@institute.edu" 
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] transition-all placeholder:text-slate-300 text-xs font-medium" 
                      />
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="group">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Contact</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] transition-colors w-4 h-4" />
                      <input 
                        type="tel" 
                        placeholder="Phone number" 
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] transition-all placeholder:text-slate-300 text-xs font-medium" 
                      />
                    </div>
                  </div>

                  {/* Subject/Role Selection */}
                <div className="group">
  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">
    Select Role
  </label>
  <div className="relative">
    {/* Icon represents team and professional hierarchy */}
    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] transition-colors w-4 h-4" />
    
    <select className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] appearance-none text-slate-600 text-xs font-medium cursor-pointer transition-all">
      <option value="">Select Role</option>
      <option value="team-lead">Team Lead</option>
      <option value="project-manager">Project Manager</option>
      <option value="tech-architect">Technical Architect</option>
      <option value="senior-dev">Senior Developer</option>
      <option value="hr-manager">HR Manager</option>
    </select>
    
    {/* Custom dropdown arrow icon */}
    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4 pointer-events-none" />
  </div>
</div>

                </div>

                {/* Wide Footer Actions */}
                <div className="flex justify-center pt-5 border-t border-gray-50">
  {/* Submit button: Centered, 1/2 width, and compact padding */}
  <button 
    type="submit" 
    className="w-1/2 bg-[#ff0000] text-white font-black py-2.5 rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-100 uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2"
  >
    <CheckCircle size={12} />
    Submit Details
  </button>
</div>
              </form>
            ) : (
              /* CSV Upload UI */
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <label htmlFor="csv-upload" className="border-2 border-dashed border-slate-100 rounded-[2rem] p-10 flex flex-col items-center justify-center bg-slate-50/20 hover:bg-red-50/10 hover:border-[#ff0000]/20 transition-all cursor-pointer group">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md border border-gray-50 mb-4 group-hover:scale-110 transition-transform duration-500">
                    <Upload className="text-[#ff0000] w-6 h-6" />
                  </div>
                  <p className="text-lg font-semibold text-[#1a202c]">Click to upload or drag and drop</p>
                  <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-[0.25em] font-bold">CSV files only (Max. 5MB)</p>
                  <input type="file" accept=".csv" className="hidden" id="csv-upload" />
                </label>

                

                <button className="w-1/2 ml-60 bg-[#ff0000] text-white font-black py-3.5 rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-100 uppercase tracking-[0.3em] text-[10px]">
                  Process CSV File
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDevelopers;