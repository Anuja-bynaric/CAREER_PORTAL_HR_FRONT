import React, { useState, useEffect } from 'react';
import { MapPin, Briefcase, Clock, ChevronLeft, Send, UploadCloud, FileText, X, Mail, Tag, Plus } from 'lucide-react';
import axios from 'axios';
import { api } from '../../Api/api';
import { useNavigate, useLocation } from 'react-router-dom';
import JobSelectionGate from './JobSelection.jsx';
import LoginForm from './LoginForm.jsx';
import Password from './Password.jsx';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearApplicationSession, setApplicationSession } from '../../redux/ApplicationSlice.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const JobDetailView = ({ onBack, onLoginSuccess, onAppliedSuccess, user: initialUser }) => {
  const { jobId } = useParams(); // Grabs 'jobId' from the URL path
  const { state } = useLocation();
  const navigate = useNavigate();
  const [job, setJob] = useState(state?.job || null);
  const [skills, setSkills] = useState([]); // State for the skills tags
  const [skillInput, setSkillInput] = useState('');
  const reduxToken = useSelector((state) => state.application?.appToken);

  const [selectedFile, setSelectedFile] = useState(null);
  const [currentView, setCurrentView] = useState(state?.view || 'selection');
  // UPDATED: Check initialUser OR the user passed in navigation state from dashboard
  const [user, setUser] = useState(initialUser || state?.user || null);
  const [isPendingVerification, setIsPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backendToken, setBackendToken] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // If user refreshes the page, 'state' is lost, so fetch from API
    if (!job) {
      api.get(`/admin/job/${jobId}`)
        .then(res => setJob(res.data.data));
    }
  }, [jobId]);

  const handleBack = () => {
    navigate(`/selection/${jobId}`, { state: { job } }); // Cleanly goes back to the list
  };

  useEffect(() => {
    // Only force back to selection if there is no user AND no specific view requested
    if (!user && !state?.view) {
      //dispatch(clearApplicationSession());
      setCurrentView('selection');
    } else if (user || state?.view === 'form') {
      // If user is logged in OR we came from the "Apply Now" button
      setCurrentView('job');
    }
  }, [dispatch, jobId, user, job, state?.view]); // Added state?.view to dependencies

  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    consentGiven: false
  });



  // ADDED: Auto-fill logic when user data is available
  useEffect(() => {
    if (user) {

      console.log("Autofill debugging - User Object:", user);
      setFormData({
        fullName: user.name || '',
        emailAddress: user.email || '',
        phoneNumber: user.phoneNumber || user.phone || '',
        consentGiven: true
      });
      if (user.skills) {
        if (Array.isArray(user.skills)) {
          setSkills(user.skills);
        } else if (typeof user.skills === 'string') {
          try {
            const parsed = JSON.parse(user.skills);
            setSkills(Array.isArray(parsed) ? parsed : []);
          } catch (e) {
            setSkills(user.skills.split(',').map(s => s.trim()));
          }
        }
      } if (user.resumeUrl || user.savedResumeName) {
      }
    }
  }, [user]);

  const addSkill = (e) => {
    e.preventDefault();
    const val = skillInput.trim();
    if (val && !skills.includes(val)) {
      setSkills([...skills, val]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    // Notify the parent (CareerPortal) that login was successful
    if (onLoginSuccess) onLoginSuccess(userData);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // 1. Check for Resume
    if (!selectedFile && !user?.savedResumeName) {
      toast("Please upload a resume.");
      return;
    }

    setLoading(true);
    const finalToken = reduxToken;

    //console.log("--- DEBUG: Authorization Header ---", finalToken ? `Bearer ${finalToken}` : "MISSING");
    try {


      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('emailAddress', formData.emailAddress);
      data.append('phoneNumber', formData.phoneNumber);
      const actualJobId = job.jobId || job.id || job._id || jobId;
      data.append('jobId', String(actualJobId));
      data.append('consentGiven', String(formData.consentGiven));

      data.append('skills', JSON.stringify(skills));

      if (selectedFile) {
        data.append('resume', selectedFile);
      } else if (user?.savedResumeName) {
        data.append('savedResumeName', user.savedResumeName);
      }

      // 2. SEND THE REQUEST
      // NOTE: If reduxToken is null, we send an empty string. 
      // If your login logic saves the token to a DIFFERENT slice (like 'auth'), 
      // you must update your useSelector at the top of this file!
      // ... inside handleFormSubmit, after axios.post
      const response = await axios.post(`${API_BASE_URL}/user/applyJob`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(finalToken && { 'Authorization': `Bearer ${finalToken}` })
        }
      });

      if (response.data.success) {
        // CASE A: User was already logged in
        if (user || finalToken) {
          toast("Application submitted successfully!");
          navigate('/dashboard', { state: { user } });
        }
        // CASE B: New Candidate (Guest)
        else {
          // The backend should return a token here to allow password setting
          const receivedToken = response.data.token;
          setBackendToken(receivedToken);
          setIsPendingVerification(true);

          // Optional: If you want to move to password screen immediately after email check
          //setCurrentView('set-password'); 
        }
      }

    } catch (error) {
      // This is where you see "Email already exists" because Authorization was empty
      const msg = error.response?.data?.message || "Something went wrong";
      console.error("Backend Error Response:", error.response?.data);
      toast(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!job) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeFile = () => setSelectedFile(null);

  // --- VIEW: PENDING VERIFICATION ---
  if (isPendingVerification) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="bg-red-50 p-8 rounded-full mb-6">
          <Mail size={40} className="text-red-600 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Verify Your Email</h2>
        <p className="text-gray-500 text-sm max-w-md leading-relaxed mb-4">
          We've sent a secure link to your email <b>{formData.emailAddress}</b>.
        </p>

        <button
          type="button"
          onClick={() => { setIsPendingVerification(false); setCurrentView('form'); }}
          className="text-red-600 text-xs font-bold hover:underline flex items-center gap-2 mx-auto"
        >
          <ChevronLeft size={16} /> Back to Form
        </button>
      </div>
    );
  }

  // --- VIEW: SET PASSWORD ---
  // --- VIEW: SET PASSWORD ---
  // 1. Make sure you import the login action from your main auth slice at the top
  // import { setLogin } from '../../redux/authSlice'; 

  // ... inside JobDetailView.jsx

  if (currentView === 'set-password') {
    return (
      <Password
        token={backendToken}
        onPasswordSuccess={(finalData) => {
          const newToken = finalData?.token || backendToken;
          const userData = finalData?.user || {
            name: formData.fullName,
            email: formData.emailAddress,
            role: 'candidate' // Ensure the role matches what AuthWrapper expects
          };

          if (newToken) {
            // UPDATE BOTH SLICES
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            dispatch(setApplicationSession(newToken));

            // THIS IS THE KEY: satisfies the AuthWrapper/ProtectedRoute
            // Replace 'setLogin' with your actual action name (e.g., loginSuccess, setUser)
            dispatch(setLogin({
              user: userData,
              token: newToken,
              isAuthenticated: true
            }));

          }
          setUser(userData);
          setIsPendingVerification(false);

          // Use a small delay so Redux can propagate the "Authenticated" state 
          // before the Route Guard checks it
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 150);
        }}
      />
    );
  }

  // --- VIEW: SELECTION GATE ---
  if (currentView === 'selection' && !user) {
    return (
      <JobSelectionGate
        job={job}
        onBack={onBack}
        onApplyClick={() => setCurrentView('form')}
        onSignInClick={() => setCurrentView('login')}
      />
    );
  }

  // --- VIEW: LOGIN ---
  if (currentView === 'login') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <LoginForm onBack={() => setCurrentView('selection')} onLoginSuccess={handleLoginSuccess} />
        <footer className="w-full bg-black text-white/70 py-12 mt-20 text-center">
          <p className="text-xs tracking-wider">© 2022 Bynaric All Rights Reserved.</p>
        </footer>
      </div>
    );
  }

  // --- VIEW: MAIN FORM ---
  return (
    <div className="mx-auto py-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={handleBack} // This now uses your navigate('/career') logic
        className="flex items-center ml-8 text-red-600 font-bold mb-8 text-[12px] hover:gap-2 transition-all uppercase tracking-wider"
      >
        <ChevronLeft size={16} /> Back to Openings
      </button>

      <div className="max-w-7xl mx-10 grid lg:grid-cols-2 gap-16 items-start">
        {/* LEFT: JOB INFO */}
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{job.title}</h3>
            <div className="flex flex-wrap gap-4 text-gray-500 font-medium text-[11px] uppercase tracking-wider mt-2">
              {/* Only show if data exists */}
              {job.location && (
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-red-500" /> {job.location}</span>
              )}
              {(job.experience || job.exp) && (
                <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-red-500" /> {job.experience || job.exp}</span>
              )}
              {(job.jobType || job.type) && (
                <span className="flex items-center gap-1.5"><Clock size={14} className="text-red-500" /> {job.jobType || job.type}</span>
              )}
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <h3 className="text-base font-bold text-slate-800">Job Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{job.description}</p>

            <h3 className="text-base font-bold text-slate-800 mt-8">What You'll Do</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
              <li>Collaborate with cross-functional teams to define and ship new features.</li>
              <li>Ensure the performance, quality, and responsiveness of applications.</li>
              <li>Apply best practices in software development and use the latest technology.</li>
            </ul>
          </div>
        </div>

        {/* RIGHT: APPLICATION FORM */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-8">
            <h3 className="text-lg font-bold text-slate-900 mb-6 text-center">Apply for this position</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase tracking-tight">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  className="w-full p-2.5 text-xs border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none rounded-xl"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase tracking-tight">Email Address *</label>
                <input
                  type="email"
                  name="emailAddress"
                  className="w-full p-2.5 text-xs border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none rounded-xl"
                  placeholder="Email Address"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase tracking-tight">Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  className="w-full p-2.5 text-xs border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none rounded-xl"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-tight">
                  Skills / Key Expertise
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSkill(e)}
                    placeholder="e.g. React, Node.js"
                    className="flex-grow p-2.5 text-xs border border-gray-200 outline-none rounded-xl focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="bg-slate-100 p-2.5 rounded-xl hover:bg-slate-200 text-slate-600"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Skill Tags Display */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill, index) => (
                    <span key={index} className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold border border-red-100">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)}>
                        <X size={12} className="hover:text-red-800" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="max-w-full">
                <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase tracking-tight">Resume/CV *</label>
                {(user?.savedResumeName || user?.resumeUrl) && !selectedFile ? (
                  <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="text-blue-600 flex-shrink-0" size={14} />
                      <span className="text-[10px] font-medium text-gray-700 truncate">Using saved: {user.savedResumeName}</span>
                    </div>
                    <label className="group cursor-pointer">
                      <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                      <span className="text-[10px] font-bold text-blue-600 hover:underline px-2">Change</span>
                    </label>
                  </div>
                ) : !selectedFile ? (
                  <label className="group cursor-pointer">
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 text-center bg-gray-50 group-hover:border-red-500 group-hover:bg-red-50/30 transition-all duration-300">
                      <UploadCloud size={16} className="mx-auto text-gray-400 group-hover:text-red-500 mb-1" />
                      <p className="text-[10px] font-semibold text-gray-700">Click to upload</p>
                    </div>
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-2 bg-red-50 border border-red-100 rounded-xl">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="text-red-600 flex-shrink-0" size={14} />
                      <span className="text-[10px] font-medium text-gray-700 truncate">{selectedFile.name}</span>
                    </div>
                    <button type="button" onClick={removeFile} className="text-red-600 p-1 hover:bg-red-200 rounded-full">
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  name="consentGiven"
                  checked={formData.consentGiven}
                  onChange={handleInputChange}
                  className="mt-1 h-3.5 w-3.5 text-red-600 focus:ring-red-500 cursor-pointer"
                  required
                />
                <label className="text-[10px] text-gray-500 leading-tight">
                  By using this form you agree with the storage and handling of your data. <span className="text-red-500">*</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full max-w-[180px] mx-auto bg-red-600 text-white font-bold py-2.5 rounded-xl shadow-lg hover:bg-red-700 transition flex items-center justify-center gap-2 mt-6 disabled:bg-gray-400 text-xs tracking-wider"
              >
                {loading ? "SENDING..." : "SUBMIT"} <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
};

export default JobDetailView;