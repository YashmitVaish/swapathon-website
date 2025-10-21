import React, { useState, useEffect, useRef } from 'react';

const API_BASE = 'http://localhost:8080';

function App() {
  const [view, setView] = useState('home');
  const [teamToken, setTeamToken] = useState('');
  const [adminToken, setAdminToken] = useState('');
  const [notifications, setNotifications] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/api/teams/ws`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications(prev => [...prev, data]);
    };
    wsRef.current = ws;
    return () => ws.close();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Swapathon</h1>
      
      {notifications.length > 0 && (
        <div style={{ background: '#fef3c7', padding: '10px', marginBottom: '20px', border: '1px solid #f59e0b' }}>
          <h3>Notifications:</h3>
          {notifications.map((n, i) => (
            <div key={i}>
              <strong>{n.heading}:</strong> {n.message}
            </div>
          ))}
        </div>
      )}

      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => setView('home')}>Home</button>
        {' '}
        {!teamToken && !adminToken && (
          <>
            <button onClick={() => setView('register')}>Register Team</button>
            {' '}
            <button onClick={() => setView('login')}>Team Login</button>
            {' '}
            <button onClick={() => setView('adminLogin')}>Admin Login</button>
            {' '}
          </>
        )}
        {teamToken && (
          <>
            <button onClick={() => setView('teamData')}>My Team</button>
            {' '}
            <button onClick={() => setView('viewSwap')}>View Swap</button>
            {' '}
            <button onClick={() => setView('viewFinal')}>View Final</button>
            {' '}
            <button onClick={() => setView('phase1')}>Submit Phase 1</button>
            {' '}
            <button onClick={() => setView('phase2')}>Submit Phase 2</button>
            {' '}
          </>
        )}
        {adminToken && (
          <>
            <button onClick={() => setView('dashboard')}>Dashboard</button>
            {' '}
            <button onClick={() => setView('addProblem')}>Add Problem</button>
            {' '}
            <button onClick={() => setView('swap')}>Prepare Swap</button>
            {' '}
            <button onClick={() => setView('notify')}>Send Notification</button>
            {' '}
            <button onClick={() => setView('viewTeam')}>View Team</button>
            {' '}
          </>
        )}
        {(teamToken || adminToken) && (
          <button onClick={() => { setTeamToken(''); setAdminToken(''); setView('home'); }}>Logout</button>
        )}
        {' '}
        <button onClick={() => setView('problems')}>List Problems</button>
      </nav>

      {view === 'home' && <Home />}
      {view === 'register' && <RegisterTeam />}
      {view === 'login' && <TeamLogin onLogin={setTeamToken} />}
      {view === 'adminLogin' && <AdminLogin onLogin={setAdminToken} />}
      {view === 'problems' && <ListProblems />}
      {view === 'teamData' && <TeamData token={teamToken} />}
      {view === 'viewSwap' && <ViewSwap token={teamToken} />}
      {view === 'viewFinal' && <ViewFinal token={teamToken} />}
      {view === 'phase1' && <Phase1Submit token={teamToken} />}
      {view === 'phase2' && <Phase2Submit token={teamToken} />}
      {view === 'dashboard' && <Dashboard token={adminToken} />}
      {view === 'addProblem' && <AddProblem token={adminToken} />}
      {view === 'swap' && <PrepareSwap token={adminToken} />}
      {view === 'notify' && <SendNotification token={adminToken} />}
      {view === 'viewTeam' && <ViewTeam token={adminToken} />}
    </div>
  );
}

function Home() {
  return <div><h2>Welcome to Swapathon</h2><p>Use the navigation above to get started.</p></div>;
}

function RegisterTeam() {
  const [form, setForm] = useState({ team_name: '', leader_name: '', email: '', password: '', problem_statement: '', members: '' });
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/teams/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Register Team</h2>
      <div>
        <input placeholder="Team Name" value={form.team_name} onChange={e => setForm({...form, team_name: e.target.value})} style={{width: '300px', marginBottom: '5px'}} />
      </div>
      <div>
        <input placeholder="Leader Name" value={form.leader_name} onChange={e => setForm({...form, leader_name: e.target.value})} style={{width: '300px', marginBottom: '5px'}} />
      </div>
      <div>
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{width: '300px', marginBottom: '5px'}} />
      </div>
      <div>
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={{width: '300px', marginBottom: '5px'}} />
      </div>
      <div>
        <input placeholder="Problem Statement" value={form.problem_statement} onChange={e => setForm({...form, problem_statement: e.target.value})} style={{width: '300px', marginBottom: '5px'}} />
      </div>
      <div>
        <input placeholder="Members" value={form.members} onChange={e => setForm({...form, members: e.target.value})} style={{width: '300px', marginBottom: '5px'}} />
      </div>
      <button onClick={handleSubmit}>Register</button>
      {result && <pre style={{background: '#f0f0f0', padding: '10px', marginTop: '10px'}}>{result}</pre>}
    </div>
  );
}

function TeamLogin({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/teams/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.token) {
        onLogin(data.token);
        setResult('Logged in successfully!');
      } else {
        setResult(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      setResult(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Team Login</h2>
      <div>
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{width: '300px', marginBottom: '5px'}} />
      </div>
      <div>
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={{width: '300px', marginBottom: '5px'}} />
      </div>
      <button onClick={handleSubmit}>Login</button>
      {result && <pre style={{background: '#f0f0f0', padding: '10px', marginTop: '10px'}}>{result}</pre>}
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.token) {
        onLogin(data.token);
        setResult('Admin logged in successfully!');
      } else {
        setResult(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      setResult(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <div>
        <input placeholder="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} style={{width: '300px', marginBottom: '5px'}} />
      </div>
      <div>
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={{width: '300px', marginBottom: '5px'}} />
      </div>
      <button onClick={handleSubmit}>Login</button>
      {result && <pre style={{background: '#f0f0f0', padding: '10px', marginTop: '10px'}}>{result}</pre>}
    </div>
  );
}

function ListProblems() {
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/api/teams/listproblems`)
      .then(res => res.json())
      .then(data => setProblems(data.problems || []))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div>
      <h2>Problem Statements</h2>
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
      {problems.map(p => (
        <div key={p.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <strong>ID {p.id}:</strong> {p.problem}
          <br/><em>Solution: {p.solution}</em>
        </div>
      ))}
    </div>
  );
}

function TeamData({ token }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    fetch(`${API_BASE}/api/teams/get-data`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => setError(err.message));
  };

  useEffect(() => { load(); }, [token]);

  return (
    <div>
      <h2>My Team Data</h2>
      <button onClick={load}>Refresh</button>
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
      {data && <pre style={{background: '#f0f0f0', padding: '10px'}}>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

function ViewSwap({ token }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    fetch(`${API_BASE}/api/teams/view-for-swap`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => setError(err.message));
  };

  useEffect(() => { load(); }, [token]);

  return (
    <div>
      <h2>View Submission for Swap</h2>
      <button onClick={load}>Refresh</button>
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
      {data && <pre style={{background: '#f0f0f0', padding: '10px'}}>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

function ViewFinal({ token }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    fetch(`${API_BASE}/api/teams/viewfinal`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => setError(err.message));
  };

  useEffect(() => { load(); }, [token]);

  return (
    <div>
      <h2>View Final Submission</h2>
      <button onClick={load}>Refresh</button>
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
      {data && <pre style={{background: '#f0f0f0', padding: '10px'}}>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

function Phase1Submit({ token }) {
  const [form, setForm] = useState({ problem: '', sol1: '', sol2: '', sol3: '', sol4: '', locked_index: 1 });
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/submit/phase1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...form, locked_index: parseInt(form.locked_index) })
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Phase 1 Submission</h2>
      <div>
        <input placeholder="Problem Statement" value={form.problem} onChange={e => setForm({...form, problem: e.target.value})} style={{width: '300px', marginBottom: '5px'}} />
      </div>
      <div>
        <textarea placeholder="Solution 1" value={form.sol1} onChange={e => setForm({...form, sol1: e.target.value})} style={{width: '300px', height: '60px', marginBottom: '5px'}} />
      </div>
      <div>
        <textarea placeholder="Solution 2" value={form.sol2} onChange={e => setForm({...form, sol2: e.target.value})} style={{width: '300px', height: '60px', marginBottom: '5px'}} />
      </div>
      <div>
        <textarea placeholder="Solution 3" value={form.sol3} onChange={e => setForm({...form, sol3: e.target.value})} style={{width: '300px', height: '60px', marginBottom: '5px'}} />
      </div>
      <div>
        <textarea placeholder="Solution 4" value={form.sol4} onChange={e => setForm({...form, sol4: e.target.value})} style={{width: '300px', height: '60px', marginBottom: '5px'}} />
      </div>
      <div>
        <input type="number" min="1" max="4" placeholder="Locked Index (1-4)" value={form.locked_index} onChange={e => setForm({...form, locked_index: e.target.value})} style={{width: '300px', marginBottom: '5px'}} />
      </div>
      <button onClick={handleSubmit}>Submit Phase 1</button>
      {result && <pre style={{background: '#f0f0f0', padding: '10px', marginTop: '10px'}}>{result}</pre>}
    </div>
  );
}

function Phase2Submit({ token }) {
  const [form, setForm] = useState({ solution_index: 1, updated_solution: '' });
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/submit/phase2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...form, solution_index: parseInt(form.solution_index) })
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Phase 2 Submission</h2>
      <div>
        <input type="number" min="1" max="4" placeholder="Solution Index (1-4)" value={form.solution_index} onChange={e => setForm({...form, solution_index: e.target.value})} style={{width: '300px', marginBottom: '5px'}} />
      </div>
      <div>
        <textarea placeholder="Updated Solution" value={form.updated_solution} onChange={e => setForm({...form, updated_solution: e.target.value})} style={{width: '300px', height: '100px', marginBottom: '5px'}} />
      </div>
      <button onClick={handleSubmit}>Submit Phase 2</button>
      {result && <pre style={{background: '#f0f0f0', padding: '10px', marginTop: '10px'}}>{result}</pre>}
    </div>
  );
}

function Dashboard({ token }) {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');

  const load = () => {
    fetch(`${API_BASE}/api/admin/dashboard-admin`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTeams(data.teams || []))
      .catch(err => setError(err.message));
  };

  useEffect(() => { load(); }, [token]);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={load}>Refresh</button>
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
      {teams.map(t => (
        <div key={t.ID} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <strong>{t.TeamName}</strong> - {t.ProblemStatement}
          <br/><small>ID: {t.ID}</small>
        </div>
      ))}
    </div>
  );
}

function AddProblem({ token }) {
  const [form, setForm] = useState({ problem: '', solution: '' });
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/add-problem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Add Problem</h2>
      <div>
        <textarea placeholder="Problem" value={form.problem} onChange={e => setForm({...form, problem: e.target.value})} style={{width: '300px', height: '80px', marginBottom: '5px'}} />
      </div>
      <div>
        <textarea placeholder="Solution" value={form.solution} onChange={e => setForm({...form, solution: e.target.value})} style={{width: '300px', height: '80px', marginBottom: '5px'}} />
      </div>
      <button onClick={handleSubmit}>Add Problem</button>
      {result && <pre style={{background: '#f0f0f0', padding: '10px', marginTop: '10px'}}>{result}</pre>}
    </div>
  );
}

function PrepareSwap({ token }) {
  const [result, setResult] = useState('');

  const handleSwap = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/swap`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Prepare Swap</h2>
      <button onClick={handleSwap}>Execute Swap</button>
      {result && <pre style={{background: '#f0f0f0', padding: '10px', marginTop: '10px'}}>{result}</pre>}
    </div>
  );
}

function SendNotification({ token }) {
  const [form, setForm] = useState({ heading: '', message: '' });
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Send Notification</h2>
      <div>
        <input placeholder="Heading" value={form.heading} onChange={e => setForm({...form, heading: e.target.value})} style={{width: '300px', marginBottom: '5px'}} />
      </div>
      <div>
        <textarea placeholder="Message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} style={{width: '300px', height: '80px', marginBottom: '5px'}} />
      </div>
      <button onClick={handleSubmit}>Send</button>
      {result && <pre style={{background: '#f0f0f0', padding: '10px', marginTop: '10px'}}>{result}</pre>}
    </div>
  );
}

function ViewTeam({ token }) {
  const [teamId, setTeamId] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const handleView = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/team?id=${teamId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setData(data);
      setError('');
    } catch (err) {
      setError(err.message);
      setData(null);
    }
  };

  return (
    <div>
      <h2>View Team</h2>
      <div>
        <input placeholder="Team ID (UUID)" value={teamId} onChange={e => setTeamId(e.target.value)} style={{width: '300px', marginBottom: '5px'}} />
      </div>
      <button onClick={handleView}>View</button>
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
      {data && <pre style={{background: '#f0f0f0', padding: '10px', marginTop: '10px'}}>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

export default App;