import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api } from '../../../Api/api';
import { User, Download, ArrowLeft, Search, Loader2, AlertCircle, Eye } from 'lucide-react';

const DisplayCandidate = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      if (!jobId) return;
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/admin/job/${jobId}/candidates`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setCandidates(response.data.data);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setCandidates([]);
        } else {
          setError("Failed to fetch candidates.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [jobId, token]);

  const finalFilteredData = candidates.filter(c => {
    const name = c.fullName || '';
    const email = c.email || '';
    const phone = c.phoneNumber || '';
    const status = c.status || 'Applied';
    const matchesStatus = statusFilter === 'All' || status === statusFilter;
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Selected': return 'bg-green-50 text-green-600 border-green-100';
      case 'Shortlisted': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Rejected': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-grow">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/job_Openings')} className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-red-100 hover:text-red-600 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight uppercase leading-none">Candidates List</h2>
            <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">Job ID: {jobId}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-bold">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search candidates..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm shadow-sm outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
            {['All', 'Applied', 'Shortlisted', 'Selected', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === status ? 'bg-red-600 text-white' : 'text-slate-500'}`}
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
              {loading ? (
                <tr><td colSpan="3" className="py-20 text-center"><Loader2 className="animate-spin text-red-600 mx-auto" /></td></tr>
              ) : finalFilteredData.length > 0 ? (
                finalFilteredData.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                    <td
                      className="px-6 py-4"
                     onClick={() => {
    // According to your DB screenshot, the key is user_id
    const userId = candidate.userId; 

    // if (!userId) {
    //   console.error("User ID is missing in candidate object:", candidate);
    //   alert("Error: Candidate User ID not found. Check console.");
    //   return;
    // }

    // Navigate to the dynamic profile path
    navigate(`/candidate_Profile/${jobId}/${userId}`, { 
      state: { candidate } 
    });
  }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-600 transition-all shadow-sm">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{candidate.fullName}</p>
                          <p className="text-[11px] text-slate-500">{candidate.email} • {candidate.phoneNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusColor(candidate.status)}`}>
                        {candidate.status || 'Applied'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <a
                          href={`http://localhost:5000${candidate.resumeUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 inline-block bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Eye size={16} />
                        </a>
                        <a
                          href={`http://localhost:5000/admin/resume/${candidate.resumeUrl?.split('/').pop()}`}
                          target="_blank"
                          rel="noreferrer"
                          download
                          className="p-2.5 inline-block bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3" className="py-20 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">No candidates found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DisplayCandidate;