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
        className="absolute  z-10 max-w-[30%] md:max-w-[20%] "
      />
      <div className='flex justify-end'>

      <div className='flex flex-col'>
        <div className="font-lastshuriken  mr-30 text-4xl mt-30">
         Feature Creep Chaos
        </div>
         <div className='font-zenantique flex justify-end mr-30 text-3xl mt-1'>
          武の心
          </div>
          </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative flex items-center justify-center">
          <img
            src={banner}
            alt="banner"
            className=" max-w-screen "
          />
          <img
            src={Seal}
            alt="seal"
            className="absolute"
          />
        </div>
      </div>

      <img
        src={grass}
        alt="grass"
        className="absolute bottom-0 left-0 w-full h-100 z-10"
      />
    </div>
  )
}

export default Homepage