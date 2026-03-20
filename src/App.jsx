import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Login from './components/Login'
import Navbar from './components/Navbar'
import LandingPage from './page/LandingPage'
import AddDevelopers from './components/AddDevelopers'
import JobOpening from './components/JobOpening'
import DisplayCandidate from './components/DisplayCandidate'
import ScheduleInterview from './components/ScheduleInterview'

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
      </Routes>
    </Router>
  )
}

export default App
