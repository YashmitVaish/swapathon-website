import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import acm from "../assets/acm.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "Register", path: "/register" },
    { name: "Prizes", path: "/prizes" },
    { name: "GUIDELINES", path: "/guidelines" },
  ];

  return (
    <nav
      className="flex justify-between items-center px-6 md:px-16 py-3 mx-4 md:mx-20 rounded-3xl backdrop-blur-3xl border border-white/20 bg-white/10 shadow-lg relative z-50"
      style={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)" }}
    >
      {/* Logo */}
      <div className="pl-2 flex items-center">
        <img
          src={acm}
          alt="ACM Logo"
          className="w-24 md:w-36 hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-8 lg:gap-12 text-white font-inter font-semibold">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `relative transition-all duration-300 ease-in-out 
              hover:text-blue-300 
              after:content-[''] after:absolute after:left-0 after:-bottom-1 
              after:w-0 after:h-[2px] after:bg-blue-300 after:transition-all after:duration-300 
              hover:after:w-full 
              ${isActive ? "text-blue-400 after:w-full" : "text-white"}`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* Hamburger Icon (Mobile) */}
      <div className="md:hidden">
        {isOpen ? (
          <X
            size={28}
            className="text-white cursor-pointer transition-transform duration-300 hover:rotate-90"
            onClick={() => setIsOpen(false)}
          />
        ) : (
          <Menu
            size={28}
            className="text-white cursor-pointer transition-transform duration-300 hover:scale-110"
            onClick={() => setIsOpen(true)}
          />
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="absolute top-[100%] left-0 w-full flex flex-col items-center gap-6 py-6 bg-white/10 backdrop-blur-2xl border-t border-white/20 text-white font-inter font-semibold rounded-b-3xl shadow-lg md:hidden"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `relative transition-all duration-300 ease-in-out 
                  hover:text-blue-300 
                  ${isActive ? "text-blue-400" : "text-white"}`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
