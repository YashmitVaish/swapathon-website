import React from 'react'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import RegistrationPage from './pages/RegistrationPAge';
import GuidelinesPage from './pages/GuidelinesPAge';
import HomePage2 from './pages/HomePage2';

function App() {
  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<HomePage2 />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/guidelines" element={<GuidelinesPage />} />
      </Routes>
    </Router>
    
    </>
  
  )
}

export default App
