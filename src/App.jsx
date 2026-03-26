import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Route Groups
import CandidateRoutes from './route/UserRoute';
import AdminRoutes from './route/HrRoute';

// Public Components
import CareerPortal from './components/CareerPortal/CareerPortal';
import LoginForm from './components/HRPortal/Components/Login';
import JobDetailView from './components/CareerPortal/JobDetailView';
import Password from './components/CareerPortal/Password';
import Navbar from './components/HRPortal/Components/Navbar';
import Footer from './components/HRPortal/Components/Footer';

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <Navbar />

      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path='/' element={<CareerPortal />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path="/job/:jobId" element={<JobDetailView />} />
        <Route path='/set-password' element={<Password />} />

        {/* --- PROTECTED GROUPS --- */}
        {CandidateRoutes}
        {AdminRoutes}

        {/* --- CATCH-ALL --- */}
        <Route path="*" element={<LoginForm />} />
      </Routes>
      
      <Footer />
    </Router>
  );
};

export default App;