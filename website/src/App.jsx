import React from 'react'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import RegistrationPage from './pages/RegistrationPAge';

function App() {
  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<RegistrationPage />} />
      </Routes>
    </Router>
    
    </>
  
  )
}

export default App
