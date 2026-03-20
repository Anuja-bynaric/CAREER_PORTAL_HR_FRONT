import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Download, Filter } from 'lucide-react';

const DisplayCandidate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const filteredJobId = location.state?.jobId || 'all';

  const candidates = [
    { id: 1, name: "Viraj Sawant", email: "viraj@example.com", phone: "9876543210", jobId: "JOB101" },
    { id: 2, name: "Sanket Patil", email: "sanket@example.com", phone: "9822113344", jobId: "JOB102" },
  ];

  const filteredData = filteredJobId === 'all' ? candidates : candidates.filter(c => c.jobId === filteredJobId);

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      <h2 className="text-2xl font-black mb-6">CANDIDATES FOR {filteredJobId}</h2>
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase">Candidate</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((candidate) => (
              <tr key={candidate.id} className="border-t">
                <td className="p-4 flex items-center gap-3 cursor-pointer" 
                    onClick={() => navigate('/candidate_Profile', { state: { candidate } })}>
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-[#ff0000] flex items-center justify-center"><User size={16}/></div>
                  <span className="font-bold text-slate-700 hover:text-red-600">{candidate.name}</span>
                </td>
                <td className="p-4 text-center">
                  <button className="p-2 bg-red-600 text-white rounded-lg"><Download size={14}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplayCandidate;