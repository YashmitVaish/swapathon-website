import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config'

const Teams = () => {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [teamDetails, setTeamDetails] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    setLoading(true)
    setError('')

    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/')
      return
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/list-teams`, {
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

  const viewTeamDetails = async (teamId) => {
    setSelectedTeam(teamId)
    setDetailsLoading(true)
    setTeamDetails(null)

    const token = localStorage.getItem('adminToken')

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/team?id=${teamId}`, {
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
        setError(data.error || 'Failed to load team details')
        setSelectedTeam(null)
        return
      }

      const data = await res.json()
      setTeamDetails(data)
    } catch (err) {
      setError('Network error')
      setSelectedTeam(null)
    } finally {
      setDetailsLoading(false)
    }
  }

  const filteredTeams = teams.filter((team) =>
    team.TeamName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Teams</h1>

      {loading && <div className="text-gray-600">Loading teams...</div>}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {!loading && teams.length === 0 && !error && (
        <div className="text-gray-600">No teams registered yet</div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">All Teams</h2>
            {teams.length > 0 && (
              <span className="text-sm text-gray-600">
                {filteredTeams.length} of {teams.length}
              </span>
            )}
          </div>
          
          {teams.length > 0 && (
            <input
              type="text"
              placeholder="Search teams..."
              className="w-full mb-3 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}

          {filteredTeams.length === 0 && searchTerm && (
            <div className="text-gray-600 text-sm mb-3">
              No teams found matching "{searchTerm}"
            </div>
          )}

          <div className="space-y-2">
            {filteredTeams.map((t) => (
              <div
                key={t.ID}
                className={`border rounded p-3 bg-white shadow-sm cursor-pointer hover:bg-gray-50 ${
                  selectedTeam === t.ID ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => viewTeamDetails(t.ID)}
              >
                <div className="font-semibold">{t.TeamName}</div>
                <div className="text-sm text-gray-600 truncate">
                  {t.ProblemStatement}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {selectedTeam && (
            <div className="bg-white border rounded p-4 shadow-sm sticky top-4">
              <h2 className="text-lg font-semibold mb-3">Team Details</h2>

              {detailsLoading && (
                <div className="text-gray-600">Loading details...</div>
              )}

              {teamDetails && (
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Team Name</div>
                    <div className="font-medium">{teamDetails.team_name}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">Leader</div>
                    <div className="font-medium">{teamDetails.leader_name}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">Problem Statement</div>
                    <div className="text-sm">{teamDetails.problem_statement}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-1">Members</div>
                    <div className="text-sm space-y-1">
                      {teamDetails.members && (() => {
                        try {
                          const members = typeof teamDetails.members === 'string' 
                            ? (teamDetails.members.startsWith('[') 
                                ? JSON.parse(teamDetails.members)
                                : teamDetails.members.split(',').map(m => m.trim()))
                            : teamDetails.members;
                          return members.map((member, idx) => (
                            <div key={idx} className="bg-gray-50 p-2 rounded">
                              {member}
                            </div>
                          ));
                        } catch (e) {
                          return <div className="text-red-600">Error parsing members</div>;
                        }
                      })()}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">Submission Status</div>
                    <div
                      className={`font-medium ${
                        teamDetails.submission === 'submitted'
                          ? 'text-green-600'
                          : 'text-orange-600'
                      }`}
                    >
                      {teamDetails.submission === 'submitted'
                        ? '✓ Submitted'
                        : 'Not submitted yet'}
                    </div>
                  </div>

                  {teamDetails.submission === 'submitted' && (
                    <div className="border-t pt-3 mt-3">
                      <div className="text-sm font-semibold mb-2">Solutions</div>
                      <div className="space-y-2 text-sm">
                        {teamDetails.sol1 && (
                          <div>
                            <span className="text-gray-600">SOL1:</span>{' '}
                            {teamDetails.sol1}
                          </div>
                        )}
                        {teamDetails.sol2 && (
                          <div>
                            <span className="text-gray-600">SOL2:</span>{' '}
                            {teamDetails.sol2}
                          </div>
                        )}
                        {teamDetails.sol3 && (
                          <div>
                            <span className="text-gray-600">SOL3:</span>{' '}
                            {teamDetails.sol3}
                          </div>
                        )}
                        {teamDetails.sol4 && (
                          <div>
                            <span className="text-gray-600">SOL4:</span>{' '}
                            {teamDetails.sol4}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Teams