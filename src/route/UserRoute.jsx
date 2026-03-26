import React from 'react';
import { Route } from 'react-router-dom';
import AuthWrapper from '../Wrapper/AuthWrapper';
import CandidateDashboard from '../components/CareerPortal/CandidateDashboard';
import JobSelectionGate from '../components/CareerPortal/JobSelection';

const CandidateRoutes = (
  <Route element={<AuthWrapper allowedRoles={['candidate']} />}>
    <Route path='/dashboard' element={<CandidateDashboard />} />
    <Route path="/selection/:jobId" element={<JobSelectionGate />} />
  </Route>
);

export default CandidateRoutes;