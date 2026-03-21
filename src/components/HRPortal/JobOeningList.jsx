import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; 
import { api } from '../../Api/api';
import { Search, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

const JobOpeningList = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/all/jobs', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        const formattedJobs = response.data.data.map(job => ({
          ...job, 
          applicants: job.applicantCount || 0, 
          status: job.status || "Active", 
          postedDate: new Date(job.createdAt).toLocaleDateString('en-CA'),
          requirements: job.requirements || [],
          responsibilities: job.responsibilities || [],
          jobId: job.jobId
        }));
        setJobs(formattedJobs);
        setFilteredJobs(formattedJobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const results = jobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(results);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, jobs]);

  // Logic for Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const onViewCandidates = (jobId) => {
    navigate(`/DisplayCandidate/${jobId}`, { state: { jobId } });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <div className="flex-grow p-8">
        <div className="max-w-7xl mx-auto">

          {/* Header Section */}
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => navigate('/landing')} 
              className="flex items-center justify-center text-slate-500 hover:text-red-600 transition-colors group"
            >
              <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:border-red-100 transition-all">
                <ArrowLeft size={20} />
              </div>
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight uppercase leading-none">
                job opening List
              </h2>
             
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search by job title or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-600 transition-all text-sm font-medium placeholder:text-slate-400 shadow-sm"
              />
            </div>

            <button
              onClick={() => navigate('/jobOpening')}
              className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-red-100 active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="text-lg">+</span> Post New Job
            </button>
          </div>

          {/* Table */}
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
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-400 text-xs">Loading job openings...</td>
                  </tr>
                ) : currentJobs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-400 text-xs">No matching job openings found.</td>
                  </tr>
                ) : (
                  currentJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-5">
                        <span
                          onClick={() => onViewCandidates(job.jobId)}
                          className="text-slate-800 font-medium text-sm cursor-pointer hover:text-red-600 transition-colors"
                        >
                          {job.title}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{job.jobId}</p>
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
                            onClick={() => navigate(`/editJob/${job.jobId}`, { state: { job } })}
                            className="px-3 py-1.5 text-[11px] font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onViewCandidates(job.jobId)}
                            className="px-3 py-1.5 text-[11px] font-medium text-white bg-slate-800 rounded-md hover:bg-slate-900 transition-all shadow-sm"
                          >
                            View Candidates
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {!loading && filteredJobs.length > 0 && (
              <div className="px-6 py-4 bg-slate-50/50 border-t border-gray-100 flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Showing {indexOfFirstJob + 1} to {Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} className="text-slate-600" />
                  </button>
                  
                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${
                          currentPage === i + 1 
                          ? 'bg-red-600 text-white shadow-md shadow-red-100' 
                          : 'bg-white border border-gray-200 text-slate-600 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} className="text-slate-600" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em]">Bynaric Career Portal v2.0</p>
          </div>
        </div>
      </div>

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