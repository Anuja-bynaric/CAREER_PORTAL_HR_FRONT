import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const JobCard = ({ location, title, exp, type, description, onApply, isApplied }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-white p-5 border shadow-sm transition-all group border-l-4 mb-4 rounded-r-xl max-w-full overflow-hidden ${isApplied ? "border-l-green-500 border-gray-100" : "border-l-transparent border-gray-100 hover:shadow-md hover:border-l-red-600"
      }`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0"> {/* min-w-0 prevents title overflow too */}
          <span className="text-[9px] font-bold text-red-600 uppercase tracking-widest">{location}</span>
          <h3 className="text-md font-semibold mt-0.5 text-slate-800 group-hover:text-red-600 transition tracking-tight truncate">
            {title}
          </h3>
          <div className="flex gap-2 mt-2">
            <span className="text-[10px] text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-full font-medium">{exp}</span>
            <span className="text-[10px] text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-full font-medium">{type}</span>
          </div>
        </div>

        <button
          onClick={onApply}
          disabled={isApplied}
          className={`shrink-0 px-4 py-1.5 rounded-lg transition-all text-[11px] font-bold shadow-sm active:scale-95 ${isApplied ? "bg-green-50 text-green-600 border border-green-100 cursor-default" : "bg-red-600 text-white hover:bg-red-700"
            }`}
        >
          {isApplied ? "Applied" : "Apply Now"}
        </button>
      </div>

      {/* DESCRIPTION SECTION - WIDTH FIXED */}
      <div className="mt-4 flex items-center justify-between gap-3 overflow-hidden w-full">
        <div className="flex-1 min-w-0"> {/* CRITICAL: min-w-0 stops the width expansion */}
          <p className={`text-slate-500 text-[11px] leading-relaxed italic ${!isExpanded ? "truncate" : "whitespace-normal"}`}>
            "{description}"
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="shrink-0 flex items-center gap-0.5 text-red-600 text-[10px] font-bold hover:underline cursor-pointer uppercase tracking-tighter"
        >
          {isExpanded ? (
            <>Less <ChevronUp size={12} /></>
          ) : (
            <>... More <ChevronDown size={12} /></>
          )}
        </button>
      </div>
    </div>
  );
};

export default JobCard;