# API Endpoints

Base URL: https://swapathon-backend.bkumar-be23.workers.dev

## Setup Required

Set JWT secrets before using authentication endpoints:

```bash
wrangler secret put JWT_SECRET
wrangler secret put JWT_ADMIN_SECRET
```

## Public Endpoints

### GET /health
Health check endpoint
- Response: `{"ok": true}`

## Team Routes (/api/teams)

### POST /api/teams/register
Register a new team
- Auth: None
- Request Body:
```json
{
  "team_name": "string",
  "leader_name": "string",
  "email": "string",
  "password": "string",
  "members": "string (optional)"
}
```
- Success (201): `{"message": "team registered succesfully "}`
- Errors: 400 (invalid payload, duplicate email/team_name)

### POST /api/teams/login
Team login
- Auth: None
- Request Body:
```json
{
  "email": "string",
  "password": "string"
}
```
- Success (200): `{"token": "<jwt-token>"}`
- Errors: 400 (invalid payload), 401 (invalid credentials)

### GET /api/teams/listproblems
List all available problems
- Auth: None
- Success (200): `{"problems": [{"id": 1, "problem": "...", "solution": "..."}]}`

### GET /api/teams/get-data
Get authenticated team's data
- Auth: Bearer token (team JWT)
- Success (200): `{"team_name": "...", "leader_name": "...", "email_id": "...", "problem_statement": "...", "members": "..."}`
- Errors: 401 (invalid token), 404 (team not found)

### GET /api/teams/view-for-swap
View submission assigned for swap
- Auth: Bearer token (team JWT)
- Success (200): `{"sol1": "...", "sol2": "...", "sol3": "...", "sol4": "...", "locked_index": 2}`
- Errors: 401 (invalid token), 404 (no assigned submission)

### GET /api/teams/viewfinal
View team's final submission
- Auth: Bearer token (team JWT)
- Success (200): `{"sol1": "...", "sol2": "...", "sol3": "...", "sol4": "...", "locked_index": 2}`
- Errors: 401 (invalid token), 404 (no submission found)

### GET /api/teams/ws
WebSocket upgrade endpoint
- Auth: None
- Returns: WebSocket connection

## Submission Routes (/api/submit)

### POST /api/submit/phase1
Phase 1 submission (initial submission)
- Auth: Bearer token (team JWT)
- Request Body:
```json
{
  "problem": "string",
  "sol1": "string",
  "sol2": "string",
  "sol3": "string",
  "sol4": "string",
  "locked_index": 1
}
```
- Success (201): `{"message": "Phase 1 submission complete", "locked_idea": "SOL1"}`
- Errors: 400 (invalid payload, already submitted), 401 (invalid token)

### POST /api/submit/phase2
Phase 2 submission (update assigned submission)
- Auth: Bearer token (team JWT)
- Request Body:
```json
{
  "solution_index": 2,
  "updated_solution": "string"
}
```
- Success (200): `{"message": "Phase 2 update successful", "updated_field": 2, "updated_idea": "..."}`
- Errors: 400 (invalid payload), 401 (invalid token), 403 (no assignment, locked index, already final)

## Admin Routes (/api/admin)

### POST /api/admin/login
Admin login
- Auth: None
- Request Body:
```json
{
  "username": "string",
  "password": "string"
}
```
- Success (200): `{"token": "<admin-jwt>"}`
- Errors: 400 (invalid payload), 401 (invalid credentials)

### GET /api/admin/dashboard-admin
Get all teams for admin dashboard
- Auth: Bearer token (admin JWT)
- Success (200): `{"teams": [{"ID": "...", "TeamName": "...", "ProblemStatement": "..."}]}`
- Errors: 401 (invalid token)

### POST /api/admin/add-problem
Add a new problem
- Auth: Bearer token (admin JWT)
- Request Body:
```json
{
  "problem": "string",
  "solution": "string"
}
```
- Success (201): `{"message": "Problem created successfully", "problem": {"id": 1, "problem": "...", "solution": "..."}}`
- Errors: 400 (invalid payload), 401 (invalid token)

### GET /api/admin/team?id=<team-uuid>
Get team details and submission
- Auth: Bearer token (admin JWT)
- Query Params: `id` (required)
- Success (200): `{"team": {...}, "submission": {...}}` or `{"team": {...}, "submission": "no submission yet"}`
- Errors: 400 (missing id), 401 (invalid token), 404 (team not found)

### GET /api/admin/swap
Assign swap partners to all teams
- Auth: Bearer token (admin JWT)
- Success (200): `{"message": "Swap assignments prepared successfully"}`
- Errors: 400 (not enough teams, not all teams submitted), 401 (invalid token)

### POST /api/admin/notify
Broadcast notification via WebSocket
- Auth: Bearer token (admin JWT)
- Request Body:
```json
{
  "heading": "string",
  "message": "string"
}
```
- Success (200): `{"status": "broadcasted"}`
- Errors: 400 (invalid payload), 401 (invalid token)
