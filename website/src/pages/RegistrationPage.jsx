import React from "react";
import Navbar from "../components/Navbar";
import bgR from "../assets/bgR.png";
import RegistrationBox from "../components/RegistrationBox";
import { motion } from "framer-motion";

function RegistrationPage() {
  return (
    <div
      className="h-screen w-full bg-cover bg-center overflow-y-hidden overflow-x-hidden relative"
      style={{
        backgroundImage: `url(${bgR})`,
      }}
    >
      {/* Soft blur overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[3px]"></div>

      {/* Content wrapper */}
      <div className="relative flex flex-col h-full">
        {/* Navbar */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-5 z-10"
        >
          <Navbar />
        </motion.div>

        {/* Registration Box */}
        <div className="flex flex-1 justify-center  items-center lg:items-start px-6 lg:px-20 z-10">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex justify-center"
          >
            <RegistrationBox />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
