import React from 'react';
import { Route } from 'react-router-dom';
import AuthWrapper from '../Wrapper/AuthWrapper';

// Components
import LandingPage from '../page/LandingPage';
import AddDevelopers from '../components/HRPortal/Interviwers/AddDevelopers';
import JobOpening from '../components/HRPortal/jobs/JobOpening';
import JobOpeningList from '../components/HRPortal/jobs/JobOeningList';
import EditJob from '../components/HRPortal/jobs/EditJob';
import DisplayCandidate from '../components/HRPortal/Candidate/DisplayCandidate';
import CandidateProfile from '../components/HRPortal/Candidate/CandidateProfile';
import ScheduleInterview from '../components/HRPortal/Interviews/ScheduleInterview';
import UpdateStatus from '../components/HRPortal/Candidate/UpdateStatus';
import DisplayScheduleInterviews from '../components/HRPortal/Interviews/DisplayScheduleInterviews';
import UploadResume from '../components/HRPortal/Candidate/UploadResume';
import UpdateInterviewStatus from '../components/HRPortal/Interviews/UpdateInterviewStatus';
import InterviewInfo from '../components/HRPortal/Interviews/InterviewInfo';
import EditInterview from '../components/HRPortal/Interviews/EditInterview';
import UpdateJobStatus from '../components/HRPortal/jobs/updateJobStatus';
import Reschedule from '../components/HRPortal/Interviews/Reschedule';
import InterviwerList from '../components/HRPortal/Interviwers/InterviwerList';
import EditInterviewer from '../components/HRPortal/Interviwers/EditInterviwer';

const AdminRoutes = (
  <Route element={<AuthWrapper allowedRoles={['admin', 'hr']} />}>
    <Route path="/landing" element={<LandingPage />} />
    <Route path="/addInterviwer" element={<AddDevelopers />} />
    <Route path="/jobOpening" element={<JobOpening />} />
    <Route path="/job_Openings" element={<JobOpeningList />} />
    <Route path="/editJob/:id" element={<EditJob />} />
    <Route path="/DisplayCandidate/:jobId" element={<DisplayCandidate />} />
    <Route path="/candidate_Profile/:jobId/:candidateId" element={<CandidateProfile />} />
    <Route path="/ScheduleInterview/:candidateId" element={<ScheduleInterview />} />
    <Route path="/UpdateStatus/:candidateId" element={<UpdateStatus />} />
    <Route path="/list_schedule_interview" element={<DisplayScheduleInterviews />} />
    <Route path="/upload_Resume" element={<UploadResume />} />
    <Route path="/InterviewStatus/:id" element={<UpdateInterviewStatus />} />
    <Route path='/Interview/:Interview_id' element={<InterviewInfo/>}/>
    <Route path='Interview/edit/:Interview_id' element={<EditInterview/>}/>
    <Route path='/job_status_update/:job_id' element={<UpdateJobStatus/>}/>
    <Route path='/Reschedule/:Interview_id' element={<Reschedule/>}/>
    <Route path='/InterviewerList' element={<InterviwerList/>}/>
    <Route path='/Interviwer/edit/:Interviwer_Id' element={<EditInterviewer/>}/>
  </Route>
);

export default AdminRoutes;