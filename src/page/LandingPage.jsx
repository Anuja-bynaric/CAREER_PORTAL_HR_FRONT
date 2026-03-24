import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; 
import { Calendar, Users, Briefcase, FileUp, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const LandingPage = () => {
  const navigate = useNavigate();

  // 1. Check for 'user' and 'isAuthenticated' instead of 'token'
  // Since tokens are in cookies, Redux only tracks the user profile
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // 2. Redirect if not logged in
    if (!isAuthenticated && !user) {
      console.warn("No active session found. Redirecting to login...");
      toast.error("Please login to access the dashboard");
      navigate('/login'); 
      return;
    }

    if (user) {
      console.log("--- Dashboard Loaded ---");
      console.log("User:", user.name);
      console.log("Email:", user.email);
    }
  }, [isAuthenticated, user, navigate]);

  const actions = [
    {
      title: "Display Job Openings",
      path: "/job_Openings",
      description: "Review, edit, or remove current job listings.",
      icon: <Briefcase size={24} />,
      bg: "bg-red-600",
    },
    {
      title: "Display Interviewer",
      path: "/InterviewerList",
      description: "Manage your team and assign interviewer roles.",
      icon: <Users size={24} />,
      bg: "bg-red-600",
    },
    {
      title: "Upload Resume",
      path: "/upload_Resume",
      description: "Bulk upload candidate resumes in ZIP format for processing.", 
      icon: <FileUp size={24} />, 
      bg: "bg-red-600",
    },
    {
      title: "Scheduled Interviews",
      path: "/list_schedule_interview", 
      description: "View and manage upcoming interview time slots.",
      icon: <Calendar size={24} />,
      bg: "bg-red-600",
    }
  ];

  // 3. Prevent UI flicker during redirect
  if (!isAuthenticated && !user) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tighter mb-2">
            Welcome, {user?.name || 'HR Manager'}
          </h2>
          <div className="h-1 w-12 bg-red-600 mx-auto rounded-full mb-4"></div>
         
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {actions.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => navigate(item.path)}
              className="group bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm 
                         transition-all duration-300 ease-in-out cursor-pointer
                         hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1
                         flex flex-col h-full relative overflow-hidden"
            >
              {/* Subtle Background Icon Decoration */}
              <div className="absolute -right-4 -bottom-4 text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {React.cloneElement(item.icon, { size: 80 })}
              </div>

              {/* Icon Container */}
              <div className={`${item.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 text-white`}>
                {item.icon}
              </div>

              {/* Content */}
              <div className="flex-grow relative z-10">
                <h3 className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tight group-hover:text-red-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-[10px] leading-relaxed font-bold uppercase tracking-wide">
                  {item.description}
                </p>
              </div>

              {/* Footer Link */}
              <div className="mt-8 flex items-center text-slate-300 group-hover:text-red-600 transition-all duration-300">
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Continue</span>
                <ArrowRight size={12} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;