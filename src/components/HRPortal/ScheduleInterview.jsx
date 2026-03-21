import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Clock, Users, Briefcase, CheckCircle, Plus, X, Hash, ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom'; // Added useParams & useLocation
import toast from 'react-hot-toast';
import { api } from '../../Api/api';

const ScheduleInterview = () => {
  const navigate = useNavigate();
  const { candidateId } = useParams(); // 1. Capture ID from URL params
  const { state } = useLocation();      // 2. Capture candidate object from navigation state
  const { token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    candidateName: state?.candidate?.fullName || state?.candidate?.name || '', // Pre-fill name
    candidateEmail: state?.candidate?.email || '',                             // Pre-fill email
    interviewDate: '',
    interviewTime: '',
    jobId: state?.candidate?.jobId || '',                                      // Pre-fill Job ID
    interviewType: '',
    notes: ''
  });

  const [selectedInterviewer, setSelectedInterviewer] = useState('');
  const [panel, setPanel] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addInterviewer = () => {
    if (selectedInterviewer) {
      try {
        const interviewer = JSON.parse(selectedInterviewer);
        if (!panel.find(item => item.id === interviewer.id)) {
          setPanel([...panel, interviewer]);
          setSelectedInterviewer('');
        }
      } catch (e) {
        console.error("Parsing error", e);
      }
    }
  };

  const removeInterviewer = (id) => {
    setPanel(panel.filter(item => item.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (panel.length === 0) return toast.error("Please add at least one interviewer");

    const loadingToast = toast.loading("Scheduling interview...");
    setLoading(true);

    try {
      const scheduledAt = new Date(`${formData.interviewDate}T${formData.interviewTime}:00`).toISOString();

      const submissionData = {
        jobApplicationId: candidateId, // Use ID from params
        interviewerId: panel[0].id,
        interviewType: formData.interviewType,
        scheduledAt: scheduledAt,
        meetingLink: "https://meet.google.com/xyz-abc-def",
        notes: formData.notes || `Interview for ${formData.candidateName}`
      };

      const response = await api.post('/admin/interviews/schedule', submissionData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success("Interview scheduled successfully!", { id: loadingToast });
        // Navigate back to the specific candidate profile
        navigate(`/candidate_Profile/${candidateId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to schedule", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* Page Header with Back Button */}
        <div className="flex items-center gap-4 mb-6 ml-1">
          <button
            // 3. Updated Back Arrow to return to specific candidate profile
            onClick={() => navigate(`/candidate_Profile/${candidateId}`)}
            className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-red-600 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-[#1a202c] tracking-tight uppercase leading-none">Schedule Interview</h2>
            <p className="text-slate-500 text-[11px] mt-1 font-medium italic">Scheduling for Candidate ID: <span className="text-red-600">#{candidateId}</span></p>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <form className="p-8" onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="group">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Candidate Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] w-4 h-4 transition-colors" />
                  <input readOnly required name="candidateName" value={formData.candidateName} onChange={handleChange} type="text" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium cursor-not-allowed" />
                </div>
              </div>

              <div className="group">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Candidate Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4 transition-colors" />
                  <input readOnly required name="candidateEmail" value={formData.candidateEmail} onChange={handleChange} type="email" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium cursor-not-allowed" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="group">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Interview Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] w-4 h-4 transition-colors" />
                  <input required name="interviewDate" value={formData.interviewDate} onChange={handleChange} type="date" className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] text-xs font-medium transition-all" />
                </div>
              </div>

              <div className="group">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Interview Time</label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] w-4 h-4 transition-colors" />
                  <input required name="interviewTime" value={formData.interviewTime} onChange={handleChange} type="time" className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] text-xs font-medium transition-all" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="group">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Job ID Reference</label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4 transition-colors" />
                  <input readOnly name="jobId" value={formData.jobId} type="text" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium cursor-not-allowed" />
                </div>
              </div>

              <div className="group">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Interview Round</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] w-4 h-4 transition-colors" />
                  <select required name="interviewType" value={formData.interviewType} onChange={handleChange} className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] appearance-none text-slate-600 text-xs font-medium cursor-pointer transition-all">
                    <option value="">Select Round</option>
                    <option value="Technical Round 1">Technical Round 1</option>
                    <option value="Technical Round 2">Technical Round 2</option>
                    <option value="HR Round">Culture & HR Round</option>
                  </select>
                </div>
              </div>
            </div>

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
                    <option value={JSON.stringify({ id: 2, name: "Viraj Sawant" })}>Viraj Sawant (Lead)</option>
                    <option value={JSON.stringify({ id: 3, name: "Sanket Patil" })}>Sanket Patil (Manager)</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={addInterviewer}
                  className="bg-[#ff0000] text-white px-4 rounded-xl hover:bg-red-600 shadow-md transition-all flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                >
                  <Plus size={14} /> Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3 mb-2 min-h-[32px]">
                {panel.map((interviewer) => (
                  <div key={interviewer.id} className="flex items-center gap-2 bg-red-50/50 border border-red-100 text-[#ff0000] px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider">
                    {interviewer.name}
                    <button type="button" onClick={() => removeInterviewer(interviewer.id)} className="hover:text-black">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center border-t border-gray-50 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 bg-[#ff0000] text-white font-black py-3 rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-100 uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 disabled:bg-slate-300"
              >
                <CheckCircle size={14} />
                {loading ? "Processing..." : "Confirm Schedule"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterview;