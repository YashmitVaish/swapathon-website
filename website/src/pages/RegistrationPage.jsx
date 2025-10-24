import React from 'react'
import bg from '../assets/lakeBg.png'
import Navbar from '../components/Navbar'
import RegistrationBox from '../components/RegistrationBox'
import Seal from '../assets/AcmSeal.png'
function RegistrationPage() {
  return (
      <div
  className=" h-screen w-screen overflow-hidden bg-cover bg-center"
  style={{
    backgroundImage: `url(${bg})`,
 
  }}
>
        <div className="mt-5">
<Navbar></Navbar>
      </div>
<div className="flex justify-center flex-wrap gap-40 mt-10 mr-15">
    <div className='flex items-center'>

    <div>
        <img src={Seal} alt=""  className='w-140'/>
    </div>
    </div>
    <div>
        <RegistrationBox></RegistrationBox>

    </div>
</div>
    </div>
  )
}

export default RegistrationPage