import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Users, FileText, Bell, Shuffle, UserCircle } from 'lucide-react'
import { API_BASE_URL } from '../config'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalUsers: 0,
    teamsWithSubmissions: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    setError('')

    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/')
      return
    }

    try {
      const [teamsRes, usersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/list-teams`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_BASE_URL}/api/admin/list-users`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
      ])

      if (teamsRes.status === 401 || usersRes.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/')
        return
      }

      const teamsData = await teamsRes.json()
      const usersData = await usersRes.json()

      setStats({
        totalTeams: teamsData.teams?.length || 0,
        totalUsers: usersData.users?.length || 0,
        teamsWithSubmissions: 0,
      })
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      icon: Users,
      title: 'Manage Teams',
      description: 'View and manage all registered teams',
      path: '/teams',
      color: 'bg-[#121212]',
    },
    {
      icon: FileText,
      title: 'Problems',
      description: 'Add and manage problem statements',
      path: '/problems',
      color: 'bg-[#121212]',
    },
    {
      icon: UserCircle,
      title: 'Users',
      description: 'View all registered users',
      path: '/users',
      color: 'bg-[#121212]',
    },
    {
      icon: Shuffle,
      title: 'Swap Assignments',
      description: 'Prepare peer review assignments',
      path: '/swap',
      color: 'bg-[#121212]',
    },
    {
      icon: Bell,
      title: 'Send Notification',
      description: 'Broadcast message to all users',
      path: '/notify',
      color: 'bg-[#121212]',
    },
  ]

  return (
    <div className="p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome to Feature Creep Chaos Admin</p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-600">Loading dashboard...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Teams</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {stats.totalTeams}
                  </p>
                </div>
                <Users className="text-blue-500" size={40} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.totalUsers}
                  </p>
                </div>
                <UserCircle className="text-green-500" size={40} />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.path}
                  to={action.path}
                  className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className={`${action.color} p-3 rounded-lg`}>
                      <action.icon className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard