import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'; // Import Toaster
import Login from './components/Login'
import Navbar from './components/Navbar'
import LandingPage from './page/LandingPage'
import AddDevelopers from './components/AddDevelopers'
import JobOpening from './components/JobOpening'
import DisplayCandidate from './components/DisplayCandidate'
import ScheduleInterview from './components/ScheduleInterview'
import JobOpeningList from './components/JobOeningList'
import CandidateProfile from './components/CandidateProfile'
import EditJob from './components/EditJob'
import UpdateStatus from './components/UpdateStatus'
import DisplayScheduleInterviews from './components/DisplayScheduleInterviews'
import UploadResume from './components/UploadResume';

const App = () => {
  return (
    <Router>
      {/* Configuration for the Toast notifications */}
      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        toastOptions={{
          style: {
            fontSize: '12px',
            fontWeight: 'bold',
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <Navbar/>
      <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/landing' element={<LandingPage/>}/>
          <Route path='/addInterviwer' element={<AddDevelopers/>}/>
          <Route path='/jobOpening' element={<JobOpening/>}/>
          <Route path='/DisplayCandidate/:jobId' element={<DisplayCandidate/>}/>
          <Route path='/ScheduleInterview' element={<ScheduleInterview/>}/>
          <Route path='/job_Openings' element={<JobOpeningList/>}/>
          <Route path='/candidate_Profile/:candidateId' element={<CandidateProfile/>}/>
          <Route path='/editJob/:id' element={<EditJob/>}/>
          <Route path='/UpdateStatus/:candidateId' element={<UpdateStatus/>}/>
          <Route path='/list_schedule_interview' element={<DisplayScheduleInterviews/>}/>
          <Route path='/upload_Resume' element={<UploadResume/>}/>
      </Routes>
    </Router>
  )
}

export default App