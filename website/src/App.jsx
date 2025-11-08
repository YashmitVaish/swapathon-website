import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Homepage from "./pages/Homepage";
import RegistrationPage from "./pages/RegistrationPage";
import GuidelinesPage from "./pages/GuidelinesPage";
import HomePage from "./pages/HomePage";
import FallingPetals from "./components/petals";
import PageTransition from "./components/PageTransition";

// A wrapper to use `useLocation` properly
function AppContent() {
  const location = useLocation();

  return (
    <>
      {/* <PageTransition key={location.pathname}>
      </PageTransition> */}
        <Routes >
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/guidelines" element={<GuidelinesPage />} />
          <Route path="/petals" element={<FallingPetals />} />
        </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
