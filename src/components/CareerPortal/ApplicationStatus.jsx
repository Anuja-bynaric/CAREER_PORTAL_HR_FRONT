import React from 'react';

const ApplicationStatus = ({ applications }) => {
    if (!applications || applications.length === 0) return null;

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'shortlisted': return 'bg-blue-50 text-blue-600 border border-blue-100';
            case 'selected for interview': return 'bg-purple-50 text-purple-600 border border-purple-100';
            case 'rejected': return 'bg-red-50 text-red-600 border border-red-100';
            default: return 'bg-green-50 text-green-600 border border-green-100';
        }
    };

    return (
        <div className="mb-8 overflow-hidden border border-gray-100 rounded-xl shadow-sm bg-white">
            <div className="bg-gray-50/50 px-5 py-3 border-b border-gray-100">
                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Your Application History</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white border-b border-gray-100">
                            <th className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Applied For</th>
                            <th className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date Applied</th>
                            <th className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {applications.map((app, index) => (
                            <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-5 py-3.5 font-bold text-slate-800 text-[12px]">{app.jobTitle || app.position || `${app.jobId}`}</td>

                                <td className="px-5 py-3.5 text-gray-500 text-[11px]">
                                    {(() => {
                                        // Specifically look for 'applied_at' from your database
                                        const rawDate = app.appliedAt || app.applied_at || app.createdAt || app.created_at;

                                        if (!rawDate) return "NA";

                                        const dateObj = new Date(rawDate);

                                        // If the date is valid, format it. If not, show a fallback.
                                        return isNaN(dateObj.getTime())
                                            ? "Invalid Format"
                                            : dateObj.toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            });
                                    })()}
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter ${getStatusColor(app.status)}`}>
                                        {app.status || 'Applied'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApplicationStatus;