import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Teams = () => {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('adminToken')
      if (!token) {
        navigate('/')
        return
      }

      try {
        const res = await fetch('/api/admin/dashboard-admin', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.status === 401) {
          localStorage.removeItem('adminToken')
          navigate('/')
          return
        }

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          setError(data.error || `Request failed: ${res.status}`)
          return
        }

        const data = await res.json()
        setTeams(data.teams || [])
      } catch (err) {
        setError('Network error')
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [navigate])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Teams</h1>

      {loading && <div className="text-gray-600">Loading teams...</div>}

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {!loading && teams.length === 0 && !error && (
        <div className="text-gray-600">No teams available</div>
      )}

      <div className="grid gap-3">
        {teams.map((t) => (
          <div key={t.ID} className="border rounded p-3 bg-white shadow-sm">
            <div className="font-semibold">{t.TeamName}</div>
            <div className="text-sm text-gray-600">{t.ProblemStatement}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Teams