import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config'

const Swap = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handlePrepareSwap = async () => {
    if (
      !window.confirm(
        'Are you sure you want to prepare swap assignments? This will randomly assign each team to review another team\'s submission.'
      )
    ) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/')
      return
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/swap`, {
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

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to prepare swap')
        return
      }

      setSuccess(data.message || 'Swap assignments prepared successfully!')
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Swap Assignments</h1>
      <p className="text-gray-600 mb-6">
        Prepare swap assignments for peer review. Each team will be randomly assigned to review another team's submission.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">How it works</h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 mb-6">
          <li>All teams must have submitted their solutions</li>
          <li>Teams will be randomly assigned in a circular pattern</li>
          <li>Each team gets a different team's submission to review</li>
          <li>No team reviews their own submission</li>
        </ul>

        <button
          onClick={handlePrepareSwap}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Preparing Swap...' : 'Prepare Swap Assignments'}
        </button>
      </div>

      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <div className="flex items-start">
          <span className="text-yellow-600 mr-2">⚠️</span>
          <div className="text-sm text-yellow-800">
            <strong>Important:</strong> Make sure all teams have submitted their solutions before preparing swap assignments. The operation requires equal number of teams and submissions.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Swap
