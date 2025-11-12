import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config'

const Problems = () => {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [problemStatement, setProblemStatement] = useState('')
  const [expectedSolution, setExpectedSolution] = useState('')
  const navigate = useNavigate()

  const handleAddProblem = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/')
      return
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/add-problem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          problem: problemStatement,
          solution: expectedSolution,
        }),
      })

      if (res.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/')
        return
      }

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to add problem')
        return
      }

      setSuccess('Problem added successfully!')
      setProblemStatement('')
      setExpectedSolution('')
      setShowForm(false)
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Problem Statements</h1>
          <p className="text-gray-600">Manage problem statements for teams</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add Problem'}
        </button>
      </div>

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

      {showForm && (
        <form
          onSubmit={handleAddProblem}
          className="bg-white p-6 rounded shadow mb-6"
        >
          <h2 className="text-xl font-semibold mb-4">Add New Problem</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Problem Statement
            </label>
            <textarea
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the problem statement"
              rows="4"
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Expected Solution
            </label>
            <textarea
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the expected solution or criteria"
              rows="4"
              value={expectedSolution}
              onChange={(e) => setExpectedSolution(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Adding...' : 'Add Problem'}
          </button>
        </form>
      )}

      <div className="text-gray-600 text-sm">
        Note: Problems are assigned to teams during team registration
      </div>
    </div>
  )
}

export default Problems