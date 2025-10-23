import React from 'react'
import branches from '../assets/branches.png'
import Seal from '../assets/AcmSeal.png'
import banner from '../assets/banner.png'
import grass from '../assets/grassSamurai.png'
function Homepage() {
  return (
     <div className="relative h-screen w-screen overflow-hidden">
   
      <img
        src={branches}
        alt="branches"
        className="absolute  z-10 max-w-[30%] md:max-w-[20%] object-contain"
      />

      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <div className="relative flex items-center justify-center">
          <img
            src={banner}
            alt="banner"
            className=" max-w-screen "
          />
          <img
            src={Seal}
            alt="seal"
            className="absolute object-contain z-30"
          />
        </div>
      </div>

      <img
        src={grass}
        alt="grass"
        className="absolute bottom-0 left-0 w-full object-cover z-15"
      />
    </div>
  )
}

export default Homepage