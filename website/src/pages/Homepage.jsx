import React from 'react'
import branches from '../assets/branches.png'
import banner from '../assets/banner.png'
import grass from '../assets/grass.png'
import samurai from '../assets/samurai.png'
import Navbar from '../components/Navbar'

function Homepage() {
  return (
    <div
  className=" h-screen w-screen overflow-hidden bg-cover bg-center"
  style={{
    backgroundImage: `url(${banner})`,
 
  }}
>
        <div className="mt-5">
<Navbar></Navbar>
      </div>
      <div className='absolute top-0 left-0 z-10'>

      <img  
        src={branches}
        alt="branches"
        className="  z-10 min-w-[70%] md:max-w-[20%] "
        />
        </div>
      <div className='flex justify-end'>

      <div className='flex flex-col'>
        <div className="font-lastshuriken  mr-30 text-4xl mt-8">
         Feature Creep Chaos
        </div>
         <div className='font-zenantique flex justify-end mr-30 text-3xl mt-1'>
          武の心
          </div>
          </div>
      </div>

<div className='absolute bottom-0'>
      <img
        src={grass}
        alt="grass"
        className=" z-10"
        />
        </div>
        <div className=' absolute bottom-0 right-40'>
          <img src={samurai} alt="" className='h-100'/>
        </div>
    </div>
  )
}

export default Homepage