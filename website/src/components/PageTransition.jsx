import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FallingPetals from "./petals";

export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [fadeClass, setFadeClass] = useState("fade-in");
  const [showPetals, setShowPetals] = useState(false);

  useEffect(() => {
    // Step 1: Trigger petals immediately
    setShowPetals(true);
    setFadeClass("fade-out");

    // Step 2: After petals & fade-out, switch page content
    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      setFadeClass("fade-in");
    }, 1200); // fade-out duration

    // Step 3: Stop petals once transition completes
    const stopPetalsTimeout = setTimeout(() => {
      setShowPetals(false);
    }, 3000); // let petals finish falling before stopping

    return () => {
      clearTimeout(timeout);
      clearTimeout(stopPetalsTimeout);
    };
  }, [location.pathname, children]);

  return (
    <div
      className={`transition-container ${fadeClass}`}
      style={{
        transition: "opacity 0.6s ease-in-out, background-color 0.6s ease-in-out",
        position: "relative",
        backgroundColor: fadeClass === "fade-out" ? "white" : "transparent",
        zIndex: 10,
        minHeight: "100vh",
      }}
    >
      {/* Render petals only during transition */}
      {showPetals && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          <FallingPetals />
        </div>
      )}

      {displayChildren}
    </div>
  );
}
