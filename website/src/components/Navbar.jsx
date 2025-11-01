import React from 'react'

function Navbar() {
  return (
    <div>
        <div className="flex justify-end  p-1 ">
            <div className=" flex justify-evenly gap-50 text-xl font-inter font-extrabold pr-20">
                <div>
                    HOME
                </div>
                <div>
                    GUIDELINES
                </div>
                <div>
                    ABOUT US
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar