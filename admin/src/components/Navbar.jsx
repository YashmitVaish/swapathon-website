import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/')
  }

  return (
    <div className='flex items-center justify-between w-full shadow-md p-4 bg-white'>
      <div className='text-lg font-semibold'>Feature Creep Chaos — Admin</div>
      <div>
        <button
          onClick={handleLogout}
          className='bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700'
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Navbar