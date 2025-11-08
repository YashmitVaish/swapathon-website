import React, { useState, useEffect } from "react";
import grass from "../assets/grass.png";
import samurai from "../assets/samurai.png";
import Navbar from "../components/Navbar";
import Tree from "../components/Tree";
import acm from "../assets/acm.png";
import FlyingBirds from "../components/birds";
import whitebg from "../assets/vansh.png";

import { useNavigate } from "react-router-dom";
function Homepage() {
    const navigate = useNavigate();
    const handleClick = () => {
      navigate("/register");
    };
  return (
    <>
      <div className="relative h-screen w-screen overflow-hidden ">
        <div
          className="relative h-screen w-screen overflow-hidden  md:bg-cover"
          style={{
            backgroundImage: `url(${whitebg})`,
            backgroundPosition: "center",
          }}
        >
          <div className="absolute top-10 z-0 w-200">
            <Tree />
          </div>

          <div className="relative z-40 mt-5">
            <Navbar />
          </div>
          <FlyingBirds></FlyingBirds>

          <div className="absolute inset-0 flex flex-col justify-center items-center z-30 text-center">
            <div className="flex justify-center">
              <img src={acm} alt="" className="w-50 " />
            </div>
            <div className="relative text-center w-fit mx-auto">
              <div className="py-10 px-10 text-black font-lastshuriken text-6xl "
              >
                <div
                style={{
                 WebkitTextStroke: "2px white",
                
              }}>Feature Creep Chaos</div>
                <div className="font-zenantique text-black text-3xl mt-2">
                  武の心
                </div>
              </div>
            </div>
            <div
            onClick={handleClick}
              className="flex justify-center bg-blue-500 p-3 z-999 text-3xl text-white font-lastshuriken border-2 border-blue-300 rounded-2xl shadow-2xl shadow-gray-700 
  transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 hover:shadow-blue-900 cursor-pointer"
              style={{
                WebkitTextStroke: "1px black",
              }}
            >
              Register Here
            </div>
          </div>

          <div className="absolute bottom-0 left-0 z-10 w-full">
            <img src={grass} alt="grass" className="w-full" />
          </div>

          <div className="absolute bottom-0 right-1 z-20">
            <img src={samurai} alt="samurai" className="h-100" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Homepage;
