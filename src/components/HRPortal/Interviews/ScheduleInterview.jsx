import React, { useState, useEffect } from 'react';
import { User, Calendar, Clock, Briefcase, Plus, X, ArrowLeft, Loader2, Mail, Layers } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../../../Api/api';

const ScheduleInterview = () => {
  const navigate = useNavigate();
  const { candidateId } = useParams(); 
  const { state } = useLocation(); 
  
  const [formData, setFormData] = useState({
    candidateName: state?.candidate?.fullName || state?.candidate?.name || '',
    candidateEmail: state?.candidate?.email || '', 
    interviewDate: '',
    interviewTime: '',
    interviewType: 'Online', 
    interviewMode: 'Round-I',
    notes: ''
  });

  const [interviewersList, setInterviewersList] = useState([]);
  const [selectedInterviewerId, setSelectedInterviewerId] = useState('');
  const [panel, setPanel] = useState([]); // Stores objects: { id, name, email }
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getInterviewers = async () => {
      try {
        const response = await api.get('/admin/interviewers');
        setInterviewersList(response.data.data || []);
      } catch (err) {
        toast.error("Failed to load interviewers");
      }
    };
    getInterviewers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addInterviewer = () => {
    if (!selectedInterviewerId) return;
    const interviewer = interviewersList.find(i => i.id.toString() === selectedInterviewerId);
    
    if (interviewer && !panel.find(p => p.id === interviewer.id)) {
      setPanel([...panel, interviewer]);
      setSelectedInterviewerId('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (panel.length === 0) return toast.error("Please add at least one interviewer");
    if (!formData.candidateEmail) return toast.error("Candidate email required");

    const loadingToast = toast.loading("Scheduling...");
    setLoading(true);

    try {
      const scheduledAt = `${formData.interviewDate}T${formData.interviewTime}:00.000Z`;
      const interviewerEmails = panel.map(interviewer => interviewer.email);

      const submissionData = {
        jobApplicationId: Number(candidateId),
        interviewerId: Number(panel[0].id), 
        scheduledAt: scheduledAt,
        durationMinutes: 45,
        notes: formData.notes || "",
        candidateEmail: formData.candidateEmail,
        interviewerEmails: interviewerEmails, 
        interviewType: formData.interviewType, // Directly uses 'Online', 'Face to Face', etc.
        interviewMode: formData.interviewMode, // 'Round-I', 'Round-II', etc.
        googleUserId: 1 
      };

      const response = await api.post('/admin/interviews/schedule', submissionData);

      if (response.data.success) {
        toast.success("Interview Scheduled", { id: loadingToast });
        navigate('/list_schedule_interview');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Scheduling Failed";
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 font-sans">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-red-600 mb-4 transition-all group">
        <ArrowLeft size={10}/>
        <span className="font-black text-[7px] uppercase tracking-[0.2em]">Back</span>
      </button>

      <div className="bg-white rounded-[1.5rem] shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-black uppercase tracking-tighter leading-none">Schedule <span className="text-red-500">Interview</span></h2>
            <p className="text-slate-400 text-[8px] mt-1.5 font-bold uppercase tracking-widest italic">
              Candidate: <span className="text-white">{formData.candidateName}</span>
            </p>
          </div>
        </div>

        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Candidate Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-slate-300" size={12} />
              <input required type="email" name="candidateEmail" value={formData.candidateEmail} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-3 py-2 text-[10px] font-bold outline-none" />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Date</label>
              <input required type="date" name="interviewDate" value={formData.interviewDate} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[10px] font-bold outline-none" />
            </div>
            <div>
              <label className="block text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Time</label>
              <input required type="time" name="interviewTime" value={formData.interviewTime} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[10px] font-bold outline-none" />
            </div>
          </div>

          {/* Type & Mode Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Interview Type</label>
              <select name="interviewType" value={formData.interviewType} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[10px] font-bold outline-none">
                <option value="Online">Online</option>
                <option value="Face to Face">Face to Face</option>
                <option value="Calendly">Calendly</option>
              </select>
            </div>
            <div>
              <label className="block text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Interview Round</label>
              <select name="interviewMode" value={formData.interviewMode} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[10px] font-bold outline-none">
                <option value="Round-I">Round-I</option>
                <option value="Round-II">Round-II</option>
                <option value="Round-III">Round-III</option>
              </select>
            </div>
          </div>

          {/* Interviewer Selection */}
          <div>
            <label className="block text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Assign Interviewer</label>
            <div className="flex gap-2">
              <select value={selectedInterviewerId} onChange={(e) => setSelectedInterviewerId(e.target.value)} className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[10px] font-bold outline-none">
                <option value="">Select Member</option>
                {interviewersList.map(dev => (
                  <option key={dev.id} value={dev.id}>{dev.name}</option>
                ))}
              </select>
              <button type="button" onClick={addInterviewer} className="p-2.5 bg-slate-900 text-white rounded-lg hover:bg-red-600 transition-all">
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Panel Display */}
          {panel.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {panel.map(person => (
                <div key={person.id} className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 rounded-lg text-[9px] font-black uppercase">
                  {person.name}
                  <X size={10} className="cursor-pointer" onClick={() => setPanel(panel.filter(p => p.id !== person.id))} />
                </div>
              ))}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-red-600 transition-all shadow-lg active:scale-95 disabled:opacity-50">
            {loading ? <Loader2 size={14} className="animate-spin mx-auto" /> : "Confirm Schedule"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleInterview;