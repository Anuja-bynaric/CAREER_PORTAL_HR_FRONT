import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { User, Mail, Phone, Calendar, ArrowLeft, RefreshCcw, FileText, Star, Target, CheckCircle } from 'lucide-react';

const MOCK_CANDIDATE = {
  id: "CAND-9921",
  name: "Alex Thompson",
  email: "alex.thompson@example.com",
  phone: "+1 (555) 012-3456",
  status: "Shortlisted",
  atsScore: 92,
  jobId: "job_1774073676986",
  summary: "Senior Frontend Engineer with over 6 years of experience specializing in React and modern CSS architectures. Proven track record of optimizing web performance and leading UI/UX migrations for enterprise-scale SaaS platforms.",
  skills: ["React 18", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "System Design"],
  profileImage: null 
};

const CandidateProfile = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { candidateId: paramId } = useParams();
  
  const candidate = state?.candidate || MOCK_CANDIDATE;
  const candidateId = paramId || candidate.id;

  if (!candidate) return <div className="p-4 text-center font-bold text-slate-400 text-[8px] tracking-widest uppercase">No Candidate Selected</div>;

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Selected': return 'bg-green-100 text-green-700 border-green-200';
      case 'Shortlisted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 font-sans">
      {/* Navigation: Tiny text */}
      <button 
        onClick={() => navigate(`/DisplayCandidate/${candidate.jobId}`)}
        className="flex items-center gap-1 text-slate-400 hover:text-red-600 mb-4 font-black text-[7px] uppercase tracking-widest transition-colors"
      >
        <ArrowLeft size={10}/> Back to List
      </button>
      
      <div className="bg-white rounded-[1.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        {/* Header Banner: Smaller height */}
        <div className="h-20 bg-red-600 relative">
          <div className="absolute -bottom-8 left-8">
            <div className="p-1 bg-white rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-xl text-red-600 border border-slate-100 overflow-hidden">
                {candidate.profileImage ? (
                  <img src={candidate.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={32}/>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-10 px-8 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
            <div>
              <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-2">
                {candidate.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-red-600 font-black text-[8px] uppercase tracking-widest">ID: {candidateId}</span>
                <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase border ${getStatusStyles(candidate.status)}`}>
                  {candidate.status}
                </span>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-900 text-white rounded-full">
                   <Target size={10} className="text-red-500" />
                   <span className="text-[7px] font-black uppercase tracking-wider">{candidate.atsScore}% ATS</span>
                </div>
              </div>
            </div>

            {/* Action Group: Smaller buttons */}
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={() => navigate(`/UpdateStatus/${candidateId}`, { state: { candidate } })}
                className="flex-1 md:flex-none bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl font-bold text-[8px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <RefreshCcw size={12}/> Update
              </button>
              
              {candidate.status === 'Shortlisted' && (
                <button 
                 onClick={() => navigate(`/ScheduleInterview/${candidateId}`, { state: { candidate } })} 
                  className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold text-[8px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Calendar size={12}/> Schedule
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={12} className="text-red-600" />
                  <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Summary</h3>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                  <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
                    "{candidate.summary}"
                  </p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Star size={12} className="text-red-600" />
                  <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Skills</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map((skill, index) => (
                    <span key={index} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-[8px] font-bold uppercase tracking-wide rounded-lg flex items-center gap-1.5">
                      <CheckCircle size={8} className="text-green-500" />
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3">Contact</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail size={12} className="text-red-600"/>
                    <span className="text-[10px] font-bold text-slate-700 truncate">{candidate.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={12} className="text-red-600"/>
                    <span className="text-[10px] font-bold text-slate-700">{candidate.phone}</span>
                  </div>
                </div>
              </div>

              <div className="bg-red-600 p-4 rounded-2xl text-white shadow-lg shadow-red-100">
                <p className="text-[8px] font-bold uppercase tracking-widest opacity-70 mb-1">Applied For</p>
                <h3 className="text-sm font-bold uppercase">{candidate.jobId}</h3>
                <div className="h-0.5 w-6 bg-white/30 my-2 rounded-full"></div>
                <p className="text-[7px] font-bold uppercase tracking-widest opacity-80">Bynaric Systems</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;