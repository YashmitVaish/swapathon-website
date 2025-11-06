import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./RegistrationBox.css";
import katana from "../assets/katana.png";

function RegistrationBox() {
  const [activeIndex, setActiveIndex] = useState(null);

  const fields = [
    "Clan Name",
    "Leader Name",
    "Email",
    "Password",
    "Confirm Password",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex justify-center items-center px-4 py-10 sm:py-12 md:py-16"
    >
      <div
        className="rounded-2xl border border-white/20 flex flex-col backdrop-blur-2xl pt-7 px-6 sm:px-10 md:px-12 lg:px-16 w-full max-w-md md:max-w-lg lg:max-w-2xl relative overflow-hidden"
        style={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.7)" }}
      >
        {/* Heading */}
        <div className="flex mb-10 items-baseline justify-center md:justify-around gap-10 md:gap-20">
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="font-lastshuriken text-white text-3xl md:text-3xl"
          >
            Register
          </motion.div>
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="font-zenantique text-white text-2xl md:text-3xl"
          >
            登録する
          </motion.div>
        </div>

        {/* Inputs */}
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-6 mb-10 relative"
        >
          {fields.map((placeholder, i) => (
            <div key={i} className="relative">
              <motion.input
                type={
                  placeholder.toLowerCase().includes("password")
                    ? "password"
                    : placeholder === "Email"
                    ? "email"
                    : "text"
                }
                placeholder={placeholder}
                onFocus={() => setActiveIndex(i)}
                onBlur={() => setActiveIndex(null)}
                className="w-full border border-white/20 rounded-2xl p-4 pr-14 bg-black/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#6588AE] transition-all duration-300 hover:scale-[1.02]"
                whileFocus={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              />

              {/* Katana indicator */}
              <AnimatePresence>
                {activeIndex === i && (
                  <motion.img
                    key="katana"
                    src={katana}
                    alt="katana"
                    initial={{ opacity: 0, x: 10, rotate: -15 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    exit={{ opacity: 0, x: 10, rotate: 15 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-7 sm:w-8 md:w-9 pointer-events-none select-none"
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.form>

        {/* Button */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.button
            type="submit"
            className="bg-[#6588AE] border border-[#1e1e1e] py-2 px-16 sm:px-20  text-2xl md:text-3xl mb-5 rounded-2xl text-white hover:bg-[#7ea8d2] transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Enter
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default RegistrationBox;
