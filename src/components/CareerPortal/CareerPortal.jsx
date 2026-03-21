import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronLeft, ChevronDown, ChevronRight } from 'lucide-react';
import axios from 'axios';
import JobCard from './JobCard';
import CompanyInfo from './CompanyInfo';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const slides = ["/assets/teamPhoto.JPG", "/assets/image2.JPG", "/assets/photo.jpg"];

const CareerPortal = () => {
  // REMOVED: selectedJob state. We are letting the Router handle the view transitions.
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);

  const navigate = useNavigate();

  const fetchAllJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/admin/all/jobs');
      if (response.data.success) {
        setFilteredJobs(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJobs();
    const timer = setInterval(() => nextSlide(), 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/admin/search', {
        params: { keyword: searchKeyword, location: searchLocation }
      });
      if (response.data.success) {
        setFilteredJobs(response.data.data);
        // Cleaned up: Removed setSelectedJob(null)
        setTimeout(() => {
          document.getElementById('jobs-list')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectJob = (job) => {
    // Navigate to the selection route with the ID. 
    // Make sure 'job.id' matches the property name from your API (e.g., job._id or job.id)
    const id = job.id || job._id || job.Jobid;
    navigate(`/selection/${id}`, { state: { job } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white relative">
      <div className="relative z-10">
        {/* FIX: We removed the conditional 'selectedJob' rendering here.
            The JobDetailView and Selection Gate are now handled by your Routes in App.js.
        */}
        <>
          {/* HERO SECTION */}
          <div className="pt-8 pb-4 bg-gray-50">
            <div className="max-w-4xl mx-auto text-center px-4 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tighter uppercase text-gray-900">
                Work with <span className="text-red-600">Bynaric</span>
              </h1>
              <p className="text-gray-600 text-md md:text-lg max-w-2xl mx-auto font-medium">
                Join a team that turns ambition into impact through technology and innovation.
              </p>
            </div>
          </div>

          {/* SEARCH SECTION */}
          <div className="pb-8 px-0 pt-4">
            <div className="max-w-3xl mx-auto px-4">
              <div className="bg-white p-2.5 flex flex-col md:flex-row gap-2 shadow-lg rounded-xl border border-gray-100">
                <div className="flex-[1.5] flex items-center px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                  <Search className="text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Role (e.g. Developer)"
                    className="w-full p-1.5 text-xs outline-none bg-transparent font-semibold"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>
                <div className="flex-1 flex items-center px-3 py-1.5 bg-gray-50 rounded-lg relative border border-gray-100">
                  <MapPin className="text-gray-400 mr-1" size={16} />
                  <select
                    className="w-full p-1 text-xs outline-none bg-transparent font-semibold appearance-none cursor-pointer"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  >
                    <option value="">All Locations</option>
                    <option value="Pune">Pune</option>
                    <option value="Mumbai">Mumbai</option>
                  </select>
                  <ChevronDown className="absolute right-3 text-gray-400 pointer-events-none" size={14} />
                </div>
                <button onClick={handleSearch} disabled={loading} className="bg-red-600 text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-red-700 transition-all uppercase tracking-wider shadow-md disabled:bg-gray-400">
                  {loading ? "..." : "Search"}
                </button>
              </div>
            </div>
          </div>

          {/* JOBS LIST SECTION */}
          <div id="jobs-list" className="max-w-6xl mx-auto px-8 py-5 min-h-[300px]">
            <div className="flex items-baseline gap-4 mb-5 border-b border-gray-100 pb-6">
              <h4 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Open Positions</h4>
              <span className="text-red-600 font-semibold bg-red-50 px-4 py-1 rounded-full text-sm border border-red-100">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Available
              </span>
            </div>

            {loading ? (
              <div className="text-center py-20 font-bold text-gray-400">Loading Jobs...</div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid gap-6">
                {filteredJobs.map(job => (
                  <JobCard
                    key={job.id || job._id}
                    location={job.location?.toUpperCase()}
                    title={job.title}
                    exp={job.experience}
                    type={job.jobType}
                    description={job.description}
                    onApply={() => handleSelectJob(job)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl font-bold text-gray-400">No matching jobs found.</h3>
                <button onClick={fetchAllJobs} className="text-red-600 underline mt-2">View all jobs</button>
              </div>
            )}
          </div>

          {/* COMPANY INFO SECTION */}
          <div className="px-8 mt-12"><CompanyInfo /></div>

          {/* SLIDER SECTION */}
          <div className="max-w-6xl mx-auto px-4 py-12 relative group">
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden border border-gray-100 shadow-sm rounded-lg">
              {slides.map((s, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                  style={{ backgroundImage: `url(${s})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>
              ))}
            </div>
            <button onClick={prevSlide} className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100">
              <ChevronLeft size={24} />
            </button>
            <button onClick={nextSlide} className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100">
              <ChevronRight size={24} />
            </button>
          </div>

          <Footer />
        </>
      </div>
    </div>
  );
};

export default CareerPortal;