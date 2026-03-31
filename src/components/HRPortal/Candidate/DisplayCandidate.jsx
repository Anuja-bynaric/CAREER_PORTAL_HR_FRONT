import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api } from '../../../Api/api';
import { User, Download, ArrowLeft, Search, Loader2, AlertCircle, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';

const DisplayCandidate = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchCandidates = async () => {
      if (!jobId) return;
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/user/job/${jobId}/candidates`, {
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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const filteredData = candidates.filter(c => {
    const name = c.fullName || '';
    const email = c.email || '';
    const phone = c.phoneNumber || '';
    const skills = Array.isArray(c.skills) ? c.skills.join(' ') : (c.skills || '');

    const status = (c.status || 'Pending').toLowerCase().trim();
    const activeFilter = statusFilter.toLowerCase().trim();

    const matchesStatus = activeFilter === 'all' || status === activeFilter;
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm);

    return matchesStatus && matchesSearch;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hired': return 'bg-green-100 text-green-700 border-green-200';
      case 'Shortlisted': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Rejected': return 'bg-red-50 text-red-600 border-red-100';
      case 'Pending':
      default: return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  const renderSkills = (skills) => {
    if (!skills) return <span className="text-slate-300 italic">No skills listed</span>;
    const skillsArray = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {skillsArray.slice(0, 3).map((skill, idx) => (
          <span key={idx} className="bg-slate-100 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter">
            {skill}
          </span>
        ))}
        {skillsArray.length > 3 && <span className="text-[9px] text-slate-400 font-bold">+{skillsArray.length - 3}</span>}
      </div>
    );
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
              placeholder="Search by name, email or skills..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm shadow-sm outline-none focus:border-red-200 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
            {['All', 'Pending', 'Shortlisted', 'Rejected', 'Hired'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${statusFilter === status ? 'bg-red-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
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
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Candidate & Skills</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="3" className="py-20 text-center"><Loader2 className="animate-spin text-red-600 mx-auto" /></td></tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td
                      className="px-6 py-4 cursor-pointer"
                      onClick={() => {
                        const candidateId = candidate.id;
                        navigate(`/candidate_Profile/${jobId}/${candidateId}`, {
                          state: { candidate }
                        });
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-600 transition-all shadow-sm">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm group-hover:text-red-600 transition-colors">{candidate.fullName}</p>
                          {renderSkills(candidate.skills)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusColor(candidate.status || 'Pending')}`}>
                        {candidate.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setSelectedFile(`http://localhost:5000/uploads/resumes/${candidate.resumeUrl?.split('/').pop()}`)}
                          className="p-2.5 inline-block bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Eye size={16} />
                        </button>
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

          {/* PAGINATION FOOTER */}
          {!loading && filteredData.length > 0 && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
              </p>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
                >
                  <ChevronLeft size={16} />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-red-600 text-white shadow-md shadow-red-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL OVERLAY */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="font-bold text-slate-800">Resume Preview</h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-grow bg-slate-100">
              <iframe
                src={selectedFile}
                className="w-full h-full border-none"
                title="Resume Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayCandidate;