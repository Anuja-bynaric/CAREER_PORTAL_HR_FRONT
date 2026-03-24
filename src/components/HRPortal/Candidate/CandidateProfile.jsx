import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { User, Mail, Phone, Calendar, ArrowLeft, RefreshCcw, FileText, Star, Target, CheckCircle, Loader2, Briefcase } from 'lucide-react';
import { api } from '../../../Api/api';
import toast from 'react-hot-toast';

const CandidateProfile = () => {
  const navigate = useNavigate();
  const { jobId, candidateId } = useParams(); // Extracting both from URL
  
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidateData();
  }, [jobId, candidateId]);

  const fetchCandidateData = async () => {
    try {
      setLoading(true);
      // Calling backend with both jobId and candidateId (user_id)
      const response = await api.get(`/user/candidates/${jobId}/${candidateId}`); 
      const data = response.data.data;

      setCandidate({
        id: data.user_id || data.id,
        name: data.fullName || "N/A",
        email: data.email || "Not Provided",
        phone: data.phoneNumber || "Not Provided",
        status: data.status || "Pending",
        jobId: data.jobId,
        appliedAt: data.applied_at,
        atsScore: data.atsScore || 0,
        summary: data.summary || "No summary provided.",
        skills: data.skills || [],
        profileImage: data.profileImage || null,
      });
    } catch (error) {
      console.error("Error fetching candidate:", error);
      toast.error("Failed to load candidate profile");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyles = (status) => {
    const s = status?.toLowerCase().trim();
    if (s === 'selected' || s === 'hired') return 'bg-green-100 text-green-700 border-green-200';
    if (s === 'shortlisted' || s === 'scheduled') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (s === 'rejected') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-red-600" size={32} />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Profile...</p>
    </div>
  );

  if (!candidate) return <div className="p-20 text-center font-black text-slate-400 text-[10px] tracking-widest uppercase">Candidate Not Found</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 font-sans">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-1 text-slate-400 hover:text-red-600 mb-4 font-black text-[7px] uppercase tracking-widest transition-colors"
      >
        <ArrowLeft size={10}/> Back to List
      </button>
      
      <div className="bg-white rounded-[1.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
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
                <span className="text-red-600 font-black text-[8px] uppercase tracking-widest">User ID: {candidate.id}</span>
                <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase border ${getStatusStyles(candidate.status)}`}>
                  {candidate.status}
                </span>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-900 text-white rounded-full">
                   <Target size={10} className="text-red-500" />
                   <span className="text-[7px] font-black uppercase tracking-wider">{candidate.atsScore}% ATS</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={() => navigate(`/UpdateStatus/${candidate.id}`, { state: { candidate } })}
                className="flex-1 md:flex-none bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl font-bold text-[8px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <RefreshCcw size={12}/> Update
              </button>
              
              {(candidate.status?.toLowerCase().trim() === 'shortlisted') && (
                <button 
                  onClick={() => navigate(`/ScheduleInterview/${candidate.id}`, { 
                    state: { 
                      candidate: {
                        id: candidate.id,
                        name: candidate.name,
                        email: candidate.email 
                      } 
                    } 
                  })} 
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
                  <Briefcase size={12} className="text-red-600" />
                  <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Application Info</h3>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-white border border-slate-100 rounded-xl flex justify-between items-center shadow-sm">
                    <div>
                      <p className="text-[9px] font-black text-slate-900 uppercase">Job Ref: {candidate.jobId}</p>
                      <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">
                        Applied: {candidate.appliedAt ? new Date(candidate.appliedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[6px] font-black uppercase border ${getStatusStyles(candidate.status)}`}>
                      {candidate.status}
                    </span>
                  </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;