import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthWrapper from './Wrapper/AuthWrapper'; // Import your new wrapper

// Components
import Login from './components/Login';
import Navbar from './components/Navbar';
import LandingPage from './page/LandingPage';
import AddDevelopers from './components/AddDevelopers';
import JobOpening from './components/JobOpening';
import DisplayCandidate from './components/DisplayCandidate';
import ScheduleInterview from './components/ScheduleInterview';
import JobOpeningList from './components/JobOeningList';
import CandidateProfile from './components/CandidateProfile';
import EditJob from './components/EditJob';
import UpdateStatus from './components/UpdateStatus';
import DisplayScheduleInterviews from './components/DisplayScheduleInterviews';
import UploadResume from './components/UploadResume';
import UpdateInterviewStatus from './components/UpdateInterviewStatus';
import Footer from './components/Footer';

const App = () => {
  return (
    <Router>
      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: '12px',
            fontWeight: 'bold',
            borderRadius: '12px',
            background: '#1a1a1a',
            color: '#fff',
            padding: '12px 20px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Navbar />

      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes - Only accessible by Admins/HR */}
        <Route element={<AuthWrapper allowedRoles={['admin', 'hr']} />}>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/addInterviwer" element={<AddDevelopers />} />
          <Route path="/jobOpening" element={<JobOpening />} />
          <Route path="/DisplayCandidate/:jobId" element={<DisplayCandidate />} />
          <Route path="/ScheduleInterview/:candidateId" element={<ScheduleInterview />} />
          <Route path="/job_Openings" element={<JobOpeningList />} />
          <Route path="/candidate_Profile/:candidateId" element={<CandidateProfile />} />
          <Route path="/editJob/:id" element={<EditJob />} />
          <Route path="/UpdateStatus/:candidateId" element={<UpdateStatus />} />
          <Route path="/list_schedule_interview" element={<DisplayScheduleInterviews />} />
          <Route path="/upload_Resume" element={<UploadResume />} />
          <Route path="/InterviewStatus/:id" element={<UpdateInterviewStatus />} />
        </Route>

        {/* Catch-all redirect to login if route doesn't exist */}
        <Route path="*" element={<Login />} />
      </Routes>
      <Footer/>
    </Router>
  );
};

export default App;