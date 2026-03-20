import React, { useState } from 'react';
import { User, Mail, Calendar, Clock, Users, Briefcase, CheckCircle, Plus, X, Hash } from 'lucide-react';

const ScheduleInterview = () => {
  const [selectedInterviewer, setSelectedInterviewer] = useState('');
  const [panel, setPanel] = useState([]);

  const addInterviewer = () => {
    if (selectedInterviewer && !panel.includes(selectedInterviewer)) {
      setPanel([...panel, selectedInterviewer]);
      setSelectedInterviewer('');
    }
  };

  const removeInterviewer = (name) => {
    setPanel(panel.filter(item => item !== name));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-5 ml-1">
          <h2 className="text-2xl font-black text-[#1a202c] tracking-tight uppercase">Schedule Interview</h2>
          <p className="text-slate-500 text-[11px] mt-0.5 font-medium italic">Create and assign interview slots for candidates.</p>
        </div>

        <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
          {/* Reduced global spacing to control bottom gap better */}
          <form className="p-8">
            
            {/* Row 1: Candidate Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="group">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Candidate Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] w-4 h-4 transition-colors" />
                  <input type="text" placeholder="e.g. Viraj Sawant" className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] text-xs font-medium placeholder:text-slate-300 transition-all" />
                </div>
              </div>

              <div className="group">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Candidate Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] w-4 h-4 transition-colors" />
                  <input type="email" placeholder="candidate@bynaric.com" className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] text-xs font-medium placeholder:text-slate-300 transition-all" />
                </div>
              </div>
            </div>

            {/* Row 2: Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="group">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Interview Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] w-4 h-4 transition-colors" />
                  <input type="date" className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] text-xs font-medium transition-all" />
                </div>
              </div>

              <div className="group">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Interview Time</label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] w-4 h-4 transition-colors" />
                  <input type="time" className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] text-xs font-medium transition-all" />
                </div>
              </div>
            </div>

            {/* Row 3: Job ID & Round Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="group">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Job ID</label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] w-4 h-4 transition-colors" />
                  <select className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] appearance-none text-slate-600 text-xs font-medium cursor-pointer transition-all">
                    <option value="">Select Vacancy ID</option>
                    <option value="JOB101">JOB101 - React Developer</option>
                    <option value="JOB102">JOB102 - Node.js Expert</option>
                    <option value="JOB103">JOB103 - UI Designer</option>
                  </select>
                </div>
              </div>

              <div className="group">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Interview Type / Role</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] w-4 h-4 transition-colors" />
                  <select className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] appearance-none text-slate-600 text-xs font-medium cursor-pointer transition-all">
                    <option value="">Select Round</option>
                    <option value="tech-1">Technical Round 1</option>
                    <option value="tech-2">Technical Round 2</option>
                    <option value="hr">Culture & HR Round</option>
                    <option value="manager">Managerial Round</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Row 4: Multi-Select Panel (Removed Bottom Margin) */}
            <div className="group">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Panel Members</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                  <select 
                    value={selectedInterviewer}
                    onChange={(e) => setSelectedInterviewer(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] text-xs font-medium appearance-none transition-all cursor-pointer"
                  >
                    <option value="">Select Interviewer</option>
                    <option value="Viraj Sawant">Viraj Sawant (Lead)</option>
                    <option value="Sanket Patil">Sanket Patil (Manager)</option>
                    <option value="Amit Kumar">Amit Kumar (SDE III)</option>
                    <option value="Neha Singh">Neha Singh (HR)</option>
                  </select>
                </div>
                <button 
                  type="button"
                  onClick={addInterviewer}
                  className="bg-[#ff0000] text-white px-4 rounded-xl hover:bg-red-600 shadow-md shadow-red-100 transition-all flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
              
              {/* Visual Panel Tags (Minimal bottom margin) */}
              <div className="flex flex-wrap gap-2 mt-3 mb-2 min-h-[32px]">
                {panel.map((name) => (
                  <div key={name} className="flex items-center gap-2 bg-red-50/50 border border-red-100 text-[#ff0000] px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider">
                    {name}
                    <button type="button" onClick={() => removeInterviewer(name)} className="hover:text-black">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tightened Submit Button Section */}
            <div className="flex justify-center  border-t border-gray-50 ">
              <button 
                type="submit" 
                className="w-1/2 bg-[#ff0000] text-white font-black py-3 rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-100 uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2"
              >
                <CheckCircle size={14} />
                Confirm Schedule
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterview;