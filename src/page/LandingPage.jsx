import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { Calendar, PlusCircle, Users, ClipboardList } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const actions = [
    {
      title: "Schedule Interview",
      path: "/ScheduleInterview", // Matches your Route path
      description: "Set up a new time slot with candidates and panels.",
      icon: <Calendar className="w-7 h-7 text-white" />,
      bg: "bg-blue-600",
    },
    {
      title: "Add Opening",
      path: "/jobOpening", // Matches your Route path
      description: "Post a new job vacancy to your careers portal.",
      icon: <PlusCircle className="w-7 h-7 text-white" />,
      bg: "bg-[#e31e24]", 
    },
    {
      title: "Add Interviewers",
      path: "/addInterviwer", // Matches your Route path
      description: "Manage your team and assign interviewer roles.",
      icon: <Users className="w-7 h-7 text-white" />,
      bg: "bg-purple-600",
    },
    {
      title: "Display Candidates",
      path: "/DisplayCandidate", // Matches your Route path
      description: "Review resumes and track applicant progress.",
      icon: <ClipboardList className="w-7 h-7 text-white" />,
      bg: "bg-sky-500",
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1a202c] mb-2 uppercase">Welcome HR</h2>
          <p className="text-slate-500 text-md">Choose from below option to continue into the system</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => navigate(item.path)} // Navigate on card click
              className="group bg-white p-8 rounded-[2rem] border-2 border-transparent shadow-sm 
                         transition-all duration-500 ease-in-out cursor-pointer
                         hover:border-[#ff0000] hover:shadow-xl hover:-translate-y-1
                         flex flex-col h-full"
            >
              <div className={`${item.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-gray-100 transition-transform duration-500 group-hover:scale-110`}>
                {item.icon}
              </div>

              <div className="flex-grow">
                <h3 className="text-lg font-bold text-slate-900 mb-3 transition-colors duration-300 group-hover:text-[#ff0000] uppercase tracking-tight">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed  font-medium">
                  {item.description}
                </p>
              </div>

              <div className="mt-10 flex items-center text-slate-400 group-hover:text-[#ff0000] font-bold text-sm transition-all duration-300">
                <span className="uppercase tracking-widest">Continue</span>
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-2">→</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;