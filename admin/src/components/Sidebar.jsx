import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, FileText, ChevronLeft, ChevronRight,Bell } from 'lucide-react'

const Sidebar = () => {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    { icon: LayoutDashboard, text: 'Dashboard', path: '/' },
    { icon: Users, text: 'Teams', path: '/teams' },
    { icon: FileText, text: 'Problems', path: '/problems' },
    { icon: Bell, text: 'Send Notification', path: '/notify' },
  ]

  return (
    <div 
      className={`bg-gray-700 min-h-screen p-4 text-white relative transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-8`}>
        {!isCollapsed && <h1 className='text-xl font-bold'>Admin</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      <div className='flex flex-col gap-2'>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors relative group ${
              location.pathname === item.path ? 'bg-gray-600' : ''
            }`}
            title={isCollapsed ? item.text : ""}
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.text}</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                {item.text}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Sidebar