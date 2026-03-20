import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
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

const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/landing' element={<LandingPage/>}/>
        <Route path='/addInterviwer' element={<AddDevelopers/>}/>
        <Route path='/jobOpening' element={<JobOpening/>}/>
        <Route path='/DisplayCandidate' element={<DisplayCandidate/>}/>
        <Route path='/ScheduleInterview' element={<ScheduleInterview/>}/>
        <Route path='/job_Openings' element={<JobOpeningList/>}/>
        <Route path='/candidate_Profile' element={<CandidateProfile/>}/>
        <Route path='/editJob' element={<EditJob/>}/>
      </Routes>
    </Router>
  )
}

export default App
