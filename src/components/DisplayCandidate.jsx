import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { User, Download, RefreshCcw, ChevronLeft } from 'lucide-react';

const DisplayCandidate = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const location = useLocation();

  const [statusFilter, setStatusFilter] = useState('All');

  const [candidates] = useState([
    { id: 1, name: "Viraj Sawant", email: "viraj@example.com", phone: "9876543210", jobId: "JOB101", status: "Selected" },
    { id: 2, name: "Sanket Patil", email: "sanket@example.com", phone: "9822113344", jobId: "JOB101", status: "Shortlisted" },
    { id: 3, name: "Akanksha Pinagale", email: "Akanksha@example.com", phone: "9123456789", jobId: "JOB101", status: "Rejected" },
    { id: 4, name: "Manoj Gaikwad", email: "manoj@example.com", phone: "9888776655", jobId: "JOB101", status: "Selected" },
  ]);

  const jobIdToFilter = jobId || location.state?.jobId || 'all';

  const jobFiltered = jobIdToFilter === 'all'
    ? candidates
    : candidates.filter(c => c.jobId === jobIdToFilter);

  const finalFilteredData = statusFilter === 'All'
    ? jobFiltered
    : jobFiltered.filter(c => c.status === statusFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Selected': return 'bg-green-50 text-green-600 border-green-100';
      case 'Shortlisted': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Rejected': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-grow">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-slate-500 hover:text-red-600 transition-colors text-xs font-medium mb-6"
        >
          <ChevronLeft size={16} /> Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Candidates for {jobIdToFilter}
            </h2>
            <p className="text-slate-500 text-[11px] font-normal mt-1">
              Review and manage applicants for this position.
            </p>
          </div>

          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
            {['All', 'Shortlisted', 'Selected', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 rounded-lg text-[11px] font-medium transition-all ${statusFilter === status
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Candidate Info</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {finalFilteredData.length > 0 ? (
                finalFilteredData.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td
                      className="px-6 py-4 cursor-pointer"
                      onClick={() => navigate(`/candidate_Profile/${candidate.id}`, { state: { candidate } })}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-red-50 group-hover:text-red-600 transition-all border border-slate-200 group-hover:border-red-100">
                          <User size={16} />
                        </div>
                        <div>
                          <div className="font-medium text-slate-800 text-sm">{candidate.name}</div>
                          <div className="text-[11px] text-slate-500">{candidate.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-medium border ${getStatusColor(candidate.status)}`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {/* <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/UpdateStatus/${candidate.id}`, { state: { candidate } });
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-black text-white rounded-md transition-all shadow-sm active:scale-95 text-[10px] font-medium"
                        >
                          <RefreshCcw size={12} />
                          UPDATE STATUS
                        </button> */}

                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-100 hover:bg-red-50 rounded-md transition-all shadow-sm"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-20 text-center text-slate-400 font-medium text-xs">
                    No {statusFilter !== 'All' ? statusFilter.toLowerCase() : ''} candidates found for this position.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DisplayCandidate;