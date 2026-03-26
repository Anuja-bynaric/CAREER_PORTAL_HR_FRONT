import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthWrapper from './Wrapper/AuthWrapper'; // Import your new wrapper

import CareerPortal from './components/CareerPortal/CareerPortal'

import JobDetailView from './components/CareerPortal/JobDetailView'
import CandidateDashboard from './components/CareerPortal/CandidateDashboard'
import Navbar from './components/CareerPortal/Navbar'
import LoginForm from './components/CareerPortal/LoginForm';
import Password from './components/CareerPortal/Password'
import JobSelectionGate from './components/CareerPortal/JobSelection'

// Components
import Login from './components/HRPortal/Login';
//import Navbar from './components/HRPortal/Navbar';
import LandingPage from './page/LandingPage';
import AddDevelopers from './components/HRPortal/AddDevelopers';
import JobOpening from './components/HRPortal/JobOpening';
import DisplayCandidate from './components/HRPortal/DisplayCandidate';
import ScheduleInterview from './components/HRPortal/ScheduleInterview';
import JobOpeningList from './components/HRPortal/JobOeningList';
import CandidateProfile from './components/HRPortal/CandidateProfile';
import EditJob from './components/HRPortal/EditJob';
import UpdateStatus from './components/HRPortal/UpdateStatus';
import DisplayScheduleInterviews from './components/HRPortal/DisplayScheduleInterviews';
import UploadResume from './components/HRPortal/UploadResume';
import UpdateInterviewStatus from './components/HRPortal/UpdateInterviewStatus';
import Footer from './components/HRPortal/Footer';

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

        <Route path='/career' element={<CareerPortal />} />
        <Route path="/selection/:jobId" element={<JobSelectionGate />} />
        <Route path="/job/:jobId" element={<JobDetailView />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/dashboard' element={<CandidateDashboard />} />
        <Route path='/set-password' element={<Password />} />




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
      <Footer />
    </Router>
  );
};

export default App;