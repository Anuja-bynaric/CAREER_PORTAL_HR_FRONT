import React, { useState, useEffect, useRef } from 'react';
import { User, Calendar, Plus, X, ArrowLeft, Loader2, Video, ChevronRight, Mail } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import toast from 'react-hot-toast';
import { api } from '../../../Api/api';

const ScheduleInterview = () => {
  const navigate = useNavigate();
  const { candidateId } = useParams(); 
  const { state } = useLocation(); 
  
  const [startDate, setStartDate] = useState(null);
  const [formData, setFormData] = useState({
    candidateName: state?.candidate?.fullName || state?.candidate?.name || 'Candidate',
    candidateEmail: state?.candidate?.email || '', // Email passed from route state
    interviewType: 'Online', 
    interviewMode: 'Round-I',
    notes: ''
  });

  const [interviewersList, setInterviewersList] = useState([]);
  const [selectedInterviewerId, setSelectedInterviewerId] = useState('');
  const [panel, setPanel] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    if (!startDate) return toast.error("Please select a date and time");
    if (panel.length === 0) return toast.error("Please add at least one interviewer");

    const loadingToast = toast.loading("Scheduling...");
    setLoading(true);

    try {
      const submissionData = {
        jobApplicationId: Number(candidateId),
        interviewerId: Number(panel[0].id), 
        scheduledAt: startDate.toISOString(),
        durationMinutes: 45,
        notes: formData.notes || "",
        candidateEmail: formData.candidateEmail, // Correctly passing the email to API
        interviewerEmails: panel.map(i => i.email), 
        interviewType: formData.interviewType,
        interviewMode: formData.interviewMode,
        googleUserId: 1 
      };

      const response = await api.post('/admin/interviews/schedule', submissionData);
      if (response.data.success) {
        toast.success("Interview Scheduled", { id: loadingToast });
        navigate('/list_schedule_interview');
      }
    } catch (err) {
      toast.error("Scheduling Failed", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
    <button
      type="button"
      className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2.5 flex items-center gap-3 text-[10px] font-bold text-slate-700 hover:border-red-500 transition-all shadow-sm"
      onClick={onClick}
      ref={ref}
    >
      <Calendar size={14} className="text-red-500" />
      {value || "Select Date & Time"}
    </button>
  ));

  return (
    <div className="max-w-md mx-auto p-4 font-sans min-h-screen flex flex-col justify-center">
      <style>{`
        .react-datepicker-popper { z-index: 50 !important; }
        .react-datepicker {
          border: none !important;
          font-family: inherit !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
          border-radius: 12px !important;
          display: flex !important;
        }
        .react-datepicker__header {
          background-color: #0f172a !important;
          border-bottom: none !important;
          border-radius: 12px 0 0 0 !important;
          padding: 12px !important;
        }
        .react-datepicker__current-month {
          color: white !important;
          text-transform: uppercase;
          font-size: 10px !important;
          letter-spacing: 2px !important;
          font-weight: 900 !important;
        }
        .react-datepicker__day-name { color: #64748b !important; font-size: 9px !important; }
        .react-datepicker__day { font-size: 10px !important; font-weight: 600 !important; }
        .react-datepicker__day--selected { 
          background-color: #3b82f6 !important; 
          border-radius: 6px !important; 
        }
        .react-datepicker__time-container {
          background-color: #0f172a !important;
          border-left: 1px solid #1e293b !important;
          width: 80px !important;
        }
        .react-datepicker__header--time { background-color: #0f172a !important; }
        .react-datepicker-time__header { color: white !important; font-size: 10px !important; }
        .react-datepicker__time-list-item { 
          background-color: #0f172a !important; 
          color: #94a3b8 !important; 
          font-size: 9px !important;
          transition: all 0.2s;
        }
        .react-datepicker__time-list-item:hover { background-color: #1e293b !important; color: white !important; }
        .react-datepicker__time-list-item--selected { background-color: #ef4444 !important; color: white !important; }
      `}</style>

      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-red-600 mb-4 transition-all group">
        <ArrowLeft size={10} className="group-hover:-translate-x-1 transition-transform"/>
        <span className="font-black text-[7px] uppercase tracking-widest">Back</span>
      </button>

      <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-50 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full blur-2xl"></div>
          <h2 className="text-xl font-black uppercase tracking-tighter">Schedule <span className="text-red-500">Interview</span></h2>
          <div className="flex flex-col gap-1 mt-2">
            <p className="text-slate-400 text-[8px] font-bold uppercase tracking-widest italic">
              Candidate: <span className="text-white not-italic">{formData.candidateName}</span>
            </p>
            {formData.candidateEmail && (
              <div className="flex items-center gap-1.5">
                <Mail size={10} className="text-red-500" />
                <span className="text-slate-400 text-[7px] font-bold lowercase tracking-wider">{formData.candidateEmail}</span>
              </div>
            )}
          </div>
        </div>

        <form className="p-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[7px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Date & Time</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              customInput={<CustomDateInput />}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[7px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Type</label>
              <div className="relative">
                <Video className="absolute left-3 top-3 text-slate-300" size={12} />
                <select 
                  name="interviewType" 
                  value={formData.interviewType} 
                  onChange={(e) => setFormData({...formData, interviewType: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-3 py-2.5 text-[10px] font-bold outline-none appearance-none"
                >
                  <option value="Online">Online</option>
                  <option value="Face to Face">Face to Face</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[7px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Round</label>
              <select 
                name="interviewMode" 
                value={formData.interviewMode} 
                onChange={(e) => setFormData({...formData, interviewMode: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[10px] font-bold outline-none appearance-none"
              >
                <option value="Round-I">Round-I</option>
                <option value="Round-II">Round-II</option>
              </select>
            </div>
          </div>

          <div ref={dropdownRef}>
            <label className="block text-[7px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Assign Interviewer</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <User className="absolute left-3 top-3 text-slate-300 z-10" size={12} />
                
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-3 py-2.5 text-[10px] font-bold outline-none text-left flex items-center justify-between hover:border-red-200 transition-all"
                >
                  <span className={selectedInterviewerId ? "text-slate-900" : "text-slate-400"}>
                    {selectedInterviewerId 
                      ? interviewersList.find(i => i.id.toString() === selectedInterviewerId)?.name 
                      : "Select Member"}
                  </span>
                  <ChevronRight size={12} className={`transform transition-transform text-slate-400 ${isDropdownOpen ? 'rotate-90' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-[60] left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-slate-900 px-4 py-2">
                      <span className="text-[7px] font-black text-white uppercase tracking-widest">Select Member</span>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {interviewersList.map((dev) => (
                        <button
                          key={dev.id}
                          type="button"
                          onClick={() => {
                            setSelectedInterviewerId(dev.id.toString());
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-[10px] font-bold text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors border-b border-slate-50 last:border-none flex items-center gap-3"
                        >
                          <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-[8px] text-slate-400">
                             {dev.name.charAt(0)}
                          </div>
                          {dev.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button 
                type="button" 
                onClick={addInterviewer} 
                className="p-3 bg-slate-900 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-slate-200"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {panel.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest">
                  Active Interview Panel
                </label>
                <span className="text-[6px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full uppercase">
                  {panel.length} {panel.length === 1 ? 'Member' : 'Members'}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 min-h-[60px] items-center">
                {panel.map(person => (
                  <div 
                    key={person.id} 
                    className="group flex items-center gap-2.5 pl-2 pr-1.5 py-1.5 bg-white text-slate-700 border border-slate-100 rounded-xl shadow-sm hover:border-red-200 hover:shadow-md transition-all duration-200 animate-in fade-in zoom-in"
                  >
                    <div className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center text-[8px] font-black text-white group-hover:bg-red-600 transition-colors">
                      {person.name.charAt(0)}
                    </div>

                    <div className="flex flex-col pr-1">
                      <span className="text-[9px] font-black uppercase tracking-tight text-slate-900">
                        {person.name}
                      </span>
                      <span className="text-[6.5px] text-slate-400 font-bold lowercase tracking-wider">
                        {person.email || 'Panelist'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPanel(panel.filter(p => p.id !== person.id))}
                      className="p-1 rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                      <X size={12} strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-600 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Confirm Schedule"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleInterview;