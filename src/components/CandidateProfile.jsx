import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, ArrowLeft } from 'lucide-react';

const CandidateProfile = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const candidate = state?.candidate;

  if (!candidate) return <div className="p-10 text-center">No Candidate Selected</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-6 font-bold"><ArrowLeft size={16}/> BACK</button>
      
      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border">
        <div className="h-24 bg-red-600"></div>
        <div className="p-8">
          <div className="flex justify-between items-start -mt-16 mb-6">
            <div className="p-1 bg-white rounded-2xl shadow-lg">
              <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded-xl text-red-600"><User size={40}/></div>
            </div>
            <button onClick={() => navigate('/ScheduleInterview')} className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2">
              <Calendar size={16}/> Schedule Interview
            </button>
          </div>
          
          <h1 className="text-3xl font-black">{candidate.name}</h1>
          <p className="text-red-600 font-bold mb-8 uppercase tracking-widest">{candidate.jobId} Applicant</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3"><Mail size={18} className="text-gray-400"/> {candidate.email}</div>
            <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3"><Phone size={18} className="text-gray-400"/> {candidate.phone}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;