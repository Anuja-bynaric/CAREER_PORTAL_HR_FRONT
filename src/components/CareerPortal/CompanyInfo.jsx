import React from 'react';
// Added Globe and Award to the import list below
import { Target, Users, Zap, CheckCircle, Globe, Award } from 'lucide-react';

const CompanyInfo = () => {
  const highlights = [
    {
      icon: <Target className="text-red-600" size={28} />,
      title: "Our Vision",
      desc: "Our goal is to make the recruitment process AI-driven through continuous innovation."
    },
    {
      icon: <Globe className="text-red-600" size={28} />, // Now defined
      title: "Diverse Industries",
      desc: "From Healthcare to Education, we provide cross-platform solutions for both Public and Private sectors."
    },
    {
      icon: <Award className="text-red-600" size={28} />, // Now defined
      title: "Engineering Excellence",
      desc: "We build up young and talented software engineers to a world-class level using the very latest technology."
    }
  ];

  return (
    <section className="bg-white py-7 px-8 border-b border-gray-100">
      <div className="max-w-6xl mx-auto"> {/* Added mx-auto to center the section content */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Text Content */}
          <div>
            <h2 className="text-4xl font-black font-bold text-slate-900 leading-tight mb-6">
              Why Work at <span className="text-red-600">Bynaric?</span>
            </h2>
            <div className="text-gray-600 text-lg leading-relaxed mb-8 space-y-4">
              <p>
                We always apply best practice in the software development process and use the very latest technology. 
                We build up young and talented software engineers to a world class level.
              </p>
              <p>
                We warrant customer satisfaction to the best of our ability with reasonable cost and an 
                excellent maintenance service provided by dedicated engineers.
              </p>
              <p>
                We target web, software and Mobile App Development services to a diverse range of industries 
                including Government, Healthcare, and Education.
              </p>
            </div>
            
            <div className="space-y-4">
              {['Latest Tech Stack', 'Career Growth', 'AI-Driven Innovation'].map((item, i) => (
                <div key={i} className="flex items-center space-x-3 text-slate-700 font-semibold">
                  <CheckCircle size={20} className="text-green-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Feature Cards */}
          <div className="grid gap-6">
            {highlights.map((h, index) => (
              <div key={index} className="flex p-6 rounded-2xl bg-gray-50 border border-transparent hover:border-red-200 hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="mr-5 bg-white p-3 rounded-xl shadow-sm h-fit">{h.icon}</div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-lg">{h.title}</h4>
                  <p className="text-gray-500 text-sm mt-1">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default CompanyInfo;