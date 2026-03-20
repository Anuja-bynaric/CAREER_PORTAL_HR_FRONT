import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { User, Mail, Phone, Calendar, ArrowLeft, RefreshCcw, FileText, Star, Target, CheckCircle } from 'lucide-react';

const CandidateProfile = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { candidateId } = useParams();
  
  const candidate = state?.candidate;

  if (!candidate) return <div className="p-6 text-center font-bold text-slate-400 text-[10px] tracking-widest uppercase">No Candidate Selected</div>;

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Selected': return 'bg-green-100 text-green-700 border-green-200';
      case 'Shortlisted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 font-sans">
      {/* Navigation */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-1.5 text-slate-400 hover:text-red-600 mb-6 font-black text-[9px] uppercase tracking-[0.2em] transition-colors"
      >
        <ArrowLeft size={12}/> Back to List
      </button>
      
      <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        {/* Header Banner */}
        <div className="h-24 bg-red-600 relative">
          <div className="absolute -bottom-12 left-10">
            <div className="p-1.5 bg-white rounded-[1.8rem] shadow-xl">
              <div className="w-24 h-24 bg-slate-50 flex items-center justify-center rounded-[1.5rem] text-red-600 border border-slate-100 overflow-hidden">
                {candidate.profileImage ? (
                  <img src={candidate.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={48}/>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-16 px-10 pb-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tighter leading-none mb-3">
                {candidate.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-red-600 font-black text-[9px] uppercase tracking-[0.2em]">ID: {candidateId}</span>
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${getStatusStyles(candidate.status)}`}>
                  {candidate.status}
                </span>
                {/* Integrated ATS Score */}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-full">
                   <Target size={10} className="text-red-500" />
                   <span className="text-[8px] font-black uppercase tracking-wider">{candidate.atsScore || '85'}% ATS Score</span>
                </div>
              </div>
            </div>

            {/* Action Group */}
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={() => navigate(`/UpdateStatus/${candidateId}`, { state: { candidate } })}
                className="flex-1 md:flex-none bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
              >
                <RefreshCcw size={14}/> Update Status
              </button>
              
              {candidate.status === 'Shortlisted' && (
                <button 
                  onClick={() => navigate('/ScheduleInterview', { state: { candidate } })} 
                  className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-100 active:scale-95"
                >
                  <Calendar size={14}/> Schedule
                </button>
              )}
            </div>
          </div>

          {/* Main Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Summary & Skills */}
            <div className="lg:col-span-2 space-y-6">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={14} className="text-red-600" />
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Resume Summary</h3>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem]">
                  <p className="text-xs font-bold text-slate-600 leading-relaxed ">
                    "{candidate.summary || "Results-driven professional with expertise in building high-performance web applications and leading cross-functional teams to success."}"
                  </p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Star size={14} className="text-red-600" />
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Top Rated Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(candidate.skills || ["React", "Tailwind", "Node.js", "System Design"]).map((skill, index) => (
                    <span key={index} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-[9px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 shadow-sm">
                      <CheckCircle size={10} className="text-green-500" />
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Contact & Position */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Contact Details</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                      <Mail size={14}/>
                    </div>
                    <span className="text-xs font-bold text-slate-700 truncate">{candidate.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                      <Phone size={14}/>
                    </div>
                    <span className="text-xs font-bold text-slate-700">{candidate.phone}</span>
                  </div>
                </div>
              </div>

              <div className="bg-red-600 p-6 rounded-[2rem] text-white shadow-xl shadow-red-100">
                <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 mb-1">Applied For</p>
                <h3 className="text-xl font-semibold tracking-tighter uppercase">{candidate.jobId}</h3>
                <div className="h-1 w-8 bg-white/30 my-3 rounded-full"></div>
                <p className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-80">Bynaric Systems</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;