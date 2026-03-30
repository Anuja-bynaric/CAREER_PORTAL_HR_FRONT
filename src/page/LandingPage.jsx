import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { api } from '../Api/api';
import {
  Calendar as CalendarIcon, Users, Briefcase, FileUp, ArrowRight,
  CheckCircle, Clock, FileText, UserCheck, TrendingUp, XCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [value, onChange] = useState(new Date());
  const [graphType, setGraphType] = useState('interview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Define the Actions array (Fixes the ReferenceError)
  const actions = [
    { title: "JOB OPENINGS", path: "/job_Openings", icon: <Briefcase size={22} />, bg: "bg-red-600" },
    { title: "INTERVIEWERS", path: "/InterviewerList", icon: <Users size={22} />, bg: "bg-red-600" },
    { title: "UPLOAD RESUMES", path: "/upload_Resume", icon: <FileUp size={22} />, bg: "bg-red-600" },
    { title: "SCHEDULED INTERVIEWS", path: "/list_schedule_interview", icon: <CalendarIcon size={22} />, bg: "bg-red-600" }
  ];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Updated URL to match your backend exactly
        const response = await api.get('http://localhost:5000/analytics', {
          withCredentials: true
        });
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchAnalytics();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const topRowStats = [
    { label: "TOTAL RESUMES", count: stats?.totalApplications || 0, icon: <FileText size={18} />, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "SHORTLISTED", count: stats?.shortlistedApplications || 0, icon: <Users size={18} />, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "TOTAL HIRED", count: stats?.hiredApplications || 0, icon: <UserCheck size={18} />, color: "text-red-600", bg: "bg-red-50" },
    { label: "PENDING", count: stats?.pendingApplications || 0, icon: <Clock size={18} />, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "COMPLETED", count: stats?.totalInterviewsCompleted || 0, icon: <CheckCircle size={18} />, color: "text-green-600", bg: "bg-green-50" },
    { label: "CANCELLED", count: stats?.totalInterviewsCancelled || 0, icon: <XCircle size={18} />, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  const interviewData = [
    { day: 'Mon', value: 4 }, { day: 'Tue', value: 8 }, { day: 'Wed', value: 5 },
    { day: 'Thu', value: stats?.totalInterviewsScheduled || 0 }, { day: 'Fri', value: 9 }, { day: 'Sat', value: 2 }, { day: 'Sun', value: 1 },
  ];

  if (loading) return <div className="flex items-center justify-center min-h-screen font-bold">Loading Stats...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 pb-12">
      <main className="max-w-full mx-auto px-6 py-8">

        {/* HEADER & TOP STATS ROW */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-10">
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Dashboard</h2>
            <p className="text-slate-500 text-sm font-medium">Welcome, {user?.name || 'User'}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full xl:w-auto">
            {topRowStats.map((stat, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                  <p className="text-lg font-black text-slate-800 leading-none">{stat.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE SECTION: CALENDAR & GRAPH */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-1 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-xs font-black text-slate-800 mb-6 uppercase tracking-widest flex items-center italic">
              <CalendarIcon size={18} className="mr-2 text-red-600" /> Event Calendar
            </h3>
            <Calendar onChange={onChange} value={value} className="border-none w-full text-sm font-medium" />
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col relative">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center italic">
                <TrendingUp size={18} className="mr-2 text-red-600" /> Interview Analytics
              </h3>
              <select
                value={graphType}
                onChange={(e) => setGraphType(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-black py-2 px-4 rounded-xl focus:outline-none uppercase cursor-pointer"
              >
                <option value="interview">Interviews</option>
                <option value="candidate">Candidates</option>
              </select>
            </div>

            <div className="flex-grow min-h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphType === 'interview' ? interviewData : candidateData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={4} dot={{ r: 4, fill: '#dc2626' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* QUICK NAVIGATION (BOTTOM) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {actions.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(item.path)}
              className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className={`${item.bg} text-white p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>{item.icon}</div>
                <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{item.title}</h3>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-red-600 transition-all" />
            </div>
          ))}
        </div>

      </main>

      <style>{`
        .react-calendar { border: none !important; width: 100% !important; }
        .react-calendar__tile--active { background: #dc2626 !important; border-radius: 12px !important; color: white !important; }
        .react-calendar__tile--now { background: #fee2e2 !important; border-radius: 12px !important; color: #dc2626 !important; }
      `}</style>
    </div>
  );
};

export default LandingPage;