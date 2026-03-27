import React from 'react';
import { Route } from 'react-router-dom';
import AuthWrapper from '../Wrapper/AuthWrapper';
import CandidateDashboard from '../components/CareerPortal/CandidateDashboard';
import JobSelectionGate from '../components/CareerPortal/JobSelection';
//import JobDetailView from "../components/CareerPortal/JobDetailView";
//import Password from '../components/CareerPortal/Password';


const CandidateRoutes = (
  <>
    {/* PUBLIC: Anyone can see this */}
    <Route path="/selection/:jobId" element={<JobSelectionGate />} />

    {/* PROTECTED: Only logged-in candidates can see this */}
    <Route element={<AuthWrapper allowedRoles={['candidate']} />}>
      <Route path='/dashboard' element={<CandidateDashboard />} />
    </Route>
  </>
);

export default CandidateRoutes;