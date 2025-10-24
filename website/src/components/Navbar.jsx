import React from 'react'

function Navbar() {
  return (
    <div>
        <div className="flex justify-end  p-1">
            <div className=" flex justify-evenly gap-50 text-2xl font-extrabold pr-20">
                <div>
                    Home
                </div>
                <div>
                    Arena
                </div>
                <div>
                    Guidelines
                </div>
                <div>
                    About Us
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar