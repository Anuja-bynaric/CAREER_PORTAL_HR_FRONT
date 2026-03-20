import React, { useState } from 'react';
import { User, Mail, Phone, FileText, Download, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const DisplayCandidate = () => {
  const [selectedJobId, setSelectedJobId] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // You can change this number

  // Sample data - replace with your actual API data
  const candidates = [
    { id: 1, name: "Viraj Sawant", email: "viraj@example.com", phone: "9876543210", resume: "viraj_cv.pdf", jobId: "JOB101" },
    { id: 2, name: "Sanket Patil", email: "sanket@example.com", phone: "9822113344", resume: "sanket_resume.pdf", jobId: "JOB102" },
    { id: 3, name: "Amit Kumar", email: "amit@example.com", phone: "9011223344", resume: "amit_final.pdf", jobId: "JOB101" },
    { id: 4, name: "Priya Shah", email: "priya@example.com", phone: "9988776655", resume: "priya_cv_2024.pdf", jobId: "JOB103" },
    { id: 5, name: "Rahul Deshmukh", email: "rahul@example.com", phone: "9122334455", resume: "rahul_dev.pdf", jobId: "JOB101" },
    { id: 6, name: "Neha Verma", email: "neha@example.com", phone: "9555443322", resume: "neha_res.pdf", jobId: "JOB102" },
  ];

  // 1. Filter Logic
  const filteredData = selectedJobId === 'all' 
    ? candidates 
    : candidates.filter(item => item.jobId === selectedJobId);

  // 2. Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="flex justify-between items-end mb-6 ml-1">
          <div>
            <h2 className="text-2xl font-black text-[#1a202c] tracking-tight uppercase">Display Candidates</h2>
            <p className="text-slate-500 text-[11px] mt-0.5 font-medium italic">View and manage applicant resumes efficiently.</p>
          </div>

          <div className="group w-64">
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Filter by Job ID</label>
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
              <select 
                value={selectedJobId}
                onChange={(e) => {
                  setSelectedJobId(e.target.value);
                  setCurrentPage(1); // Reset to page 1 on filter change
                }}
                className="w-full pl-10 pr-10 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] appearance-none text-slate-600 text-xs font-bold cursor-pointer transition-all shadow-sm"
              >
                <option value="all">All Job IDs</option>
                <option value="JOB101">JOB101 - React Developer</option>
                <option value="JOB102">JOB102 - Node.js Expert</option>
                <option value="JOB103">JOB103 - UI Designer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resume</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentItems.length > 0 ? (
                currentItems.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-[#ff0000]">
                          <User size={16} />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{candidate.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-medium tracking-tight">{candidate.email}</td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">{candidate.phone}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 italic bg-slate-50 border border-slate-100 w-fit px-2.5 py-1 rounded-lg">
                        <FileText size={12} className="text-[#ff0000]" />
                        {candidate.resume}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#ff0000] text-white hover:bg-red-600 transition-all shadow-md shadow-red-100 active:scale-95">
                        <Download size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length}
            </p>
            
            <div className="flex items-center gap-1">
              <button 
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-[#ff0000] hover:border-[#ff0000] disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-all"
              >
                <ChevronLeft size={14} />
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`w-8 h-8 rounded-lg text-[11px] font-black transition-all ${
                    currentPage === index + 1 
                    ? 'bg-[#ff0000] text-white shadow-md shadow-red-100' 
                    : 'bg-white border border-slate-200 text-slate-400 hover:border-[#ff0000] hover:text-[#ff0000]'
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button 
                disabled={currentPage === totalPages}
                onClick={() => paginate(currentPage + 1)}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-[#ff0000] hover:border-[#ff0000] disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-all"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayCandidate;