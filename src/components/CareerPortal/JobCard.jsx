import React from 'react';

const JobCard = ({ location, title, exp, type, description, onApply, isApplied }) => {
  return (
    <div className={`bg-white p-6 border shadow-sm transition-all group border-l-4 mb-5 rounded-r-xl ${isApplied
      ? "border-l-green-500 border-gray-100"
      : "border-l-transparent border-gray-100 hover:shadow-md hover:border-l-red-600"
      }`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <span className="text-[10px] font-medium text-red-600 uppercase tracking-widest">{location}</span>
          {/* Decreased font size from 2xl to lg and weight to medium */}
          <h3 className="text-lg font-medium mt-1 text-slate-800 group-hover:text-red-600 transition tracking-tight">
            {title}
          </h3>
          <div className="flex gap-3 mt-3">
            {/* Decreased badge text to xs */}
            <span className="text-[11px] text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full font-medium">
              {exp}
            </span>
            <span className="text-[11px] text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full font-medium">
              {type}
            </span>
          </div>
        </div>

        {/* Enhanced button with smaller, cleaner font */}
        <button
          // Using disabled={isApplied} is cleaner than isApplied ? null : onApply
          onClick={onApply}
          disabled={isApplied}
          className={`px-5 py-2 rounded-lg transition-all text-xs font-medium shadow-sm active:scale-95 ${isApplied
              ? "bg-green-50 text-green-600 border border-green-100 cursor-default"
              : "bg-white border border-slate-200 text-slate-600 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600"
            }`}
        >
          {isApplied ? "Applied" : "Apply Now"}
        </button>
      </div>

      {/* Decreased description font and weight */}
      <p className="mt-4 text-slate-500 text-xs font-normal line-clamp-2 leading-relaxed italic">
        "{description}"
      </p>
    </div>
  );
};

export default JobCard;