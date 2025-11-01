import React from 'react'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import RegistrationPage from './pages/RegistrationPAge';
import GuidelinesPage from './pages/GuidelinesPAge';
import HomePage from './pages/HomePage';
import FallingPetals from './components/petals';


function App() {
  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/guidelines" element={<GuidelinesPage />} />
        <Route path='/petals' element={<FallingPetals />}/>
      </Routes>
    </Router>
    
    </>
  
  )
}

export default App
