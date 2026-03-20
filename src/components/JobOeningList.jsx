import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JobOpeningList = () => {
  const navigate = useNavigate();
  const [jobs] = useState([
    { id: "JOB101", title: "Jr. Software Developer", applicants: 12, status: "Active", postedDate: "2026-03-15" },
    { id: "JOB102", title: "React Developer", applicants: 8, status: "Active", postedDate: "2026-03-18" },
    { id: "JOB103", title: "UI/UX Designer", applicants: 5, status: "Closed", postedDate: "2026-03-10" },
  ]);

  const onViewCandidates = (jobId) => {
    navigate(`/DisplayCandidate/${jobId}`, { state: { jobId } });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <div className="flex-grow p-8">
        <div className="max-w-7xl mx-auto">

          {/* Header Section */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">HR Recruitment Dashboard</h2>
              <p className="text-slate-500 text-[11px] font-normal mt-1">Manage your job openings and applicants efficiently.</p>
            </div>
            <button
              onClick={() => navigate('/jobOpening')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium text-xs transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
            >
              <span className="text-lg">+</span> Post New Job
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Posted Date</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Applicants</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-5">
                      <span
                        onClick={() => onViewCandidates(job.id)}
                        className="text-slate-800 font-medium text-sm cursor-pointer hover:text-red-600 transition-colors"
                      >
                        {job.title}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-xs text-slate-500 font-normal">{job.postedDate}</td>
                    <td className="px-6 py-5">
                      <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-medium border border-red-100">
                        {job.applicants} Applied
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[11px] font-medium flex items-center gap-2 ${job.status === 'Active' ? 'text-green-600' : 'text-slate-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${job.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => navigate(`/editJob/${job.id}`, { state: { job } })}
                          className="px-3 py-1.5 text-[11px] font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onViewCandidates(job.id)}
                          className="px-3 py-1.5 text-[11px] font-medium text-white bg-slate-800 rounded-md hover:bg-slate-900 transition-all shadow-sm"
                        >
                          View Candidates
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em]">Bynaric Career Portal v2.0</p>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="w-full bg-black text-white/70 py-12 mt-20">
        <div className="w-full px-4 text-center">
          <p className="text-sm md:text-base tracking-wider">
            © 2022 Bynaric All Rights Reserved. [wps_visitor_counter]
          </p>
        </div>
      </footer>
    </div>
  );
};

export default JobOpeningList;