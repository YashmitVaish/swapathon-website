# Swapathon Backend API

This document describes the HTTP API provided by the backend. All endpoints are under the `:8080` server (default) and grouped by route.

Base URL: http://localhost:8080

## Authentication

- Team endpoints use JWT signed with `JWT_SECRET` returned by login endpoints.
- Admin endpoints use a separate admin JWT signed with `JWT_ADMIN_SECRET`.
- Provide tokens in the `Authorization` header as `Bearer <token>`.

---

## Routes

### Team Routes (/api/teams)

1) POST /api/teaent": "string",

- "members": "string"
  }
- Success (201):
  { "message": "team registered succesfully " }
- Errors:
  - 400: invalid payload or duplicate email/team
  - 500: hashing or DB error

2) POST /api/teams/login

- Description: Team login. Returns team JWT.
- Auth: none
- Request JSON:
  { "email": "email", "password": "string" }
- Success (200):
  { "token": "`<jwt-token>`" }
- Errors:
  - 400: invalid payload
  - 401: invalid credentials

3) GET /api/teams/listproblems

- Description: List available problem statements.
- Auth: none
- Success (200):
  { "problems": [{ "id": 1, "problem": "...", "solution": "..." }, ...] }
- Errors:
  - 500: DB error

4) GET /api/teams/ws

- Description: WebSocket upgrade endpoint. Upgrades the HTTP connection to a WebSocket.
- Auth: none (WebSocket connections are accepted from any origin)
- Notes: After upgrading, the server will broadcast notifications pushed by admin `/api/admin/notify`.

Protected (require `Authorization: Bearer <token>`):

5) GET /api/teams/get-data

- Description: Get authenticated team's details.
- Auth: team JWT
- Success (200):
  {
  "team_name": "...",
  "leader_name": "...",
  "email_id": "...",
  "problem_statement": "...",
  "members": "..."
  }
- Errors:
  - 401: missing or invalid token
  - 404: team not found

5.5) GET /api/teams/swap-status

- Description: Check if team has submitted Phase 1 and if swap assignments are ready.
- Auth: team JWT
- Success (200):
  {
  "phase1_submitted": true/false,
  "swap_ready": true/false,
  "message": "..."
  }
- Possible responses:
  - Phase 1 not submitted: { "phase1_submitted": false, "swap_ready": false, "message": "Please submit Phase 1 first" }
  - Phase 1 submitted, waiting for swap: { "phase1_submitted": true, "swap_ready": false, "message": "Waiting for admin to trigger swap assignments..." }
  - Swap ready: { "phase1_submitted": true, "swap_ready": true, "message": "Swap is ready! You can now edit features." }
- Errors:
  - 401: missing or invalid token

5.6) GET /api/teams/final-status

- Description: Check if all teams have completed Phase 2 submissions. Used to determine if final results can be viewed.
- Auth: team JWT
- Success (200):
  {
  "all_completed": true/false,
  "message": "...",
  "completed": 5,  // optional: number of teams completed
  "total": 10      // optional: total number of teams
  }
- Possible responses:
  - All completed: { "all_completed": true, "message": "All teams have completed Phase 2. You can now view your final submission." }
  - Still waiting: { "all_completed": false, "message": "Waiting for all teams to complete Phase 2...", "completed": 5, "total": 10 }
- Errors:
  - 401: missing or invalid token
  - 500: database error

6) POST /api/teams/reveal-feature

- Description: Reveal a specific feature from the submission assigned to this team for swap. Only unlocked features can be revealed.
- Auth: team JWT
- Request JSON:
  { "feature_index": 2 } // integer 1-4
- Success (200):
  {
  "feature_index": 2,
  "content": "...",
  "is_locked": false,
  "submission_id": "uuid"
  }
- Errors:
  - 400: invalid payload
  - 401: missing/invalid token
  - 403: feature is locked
    {
    "error": "This feature is locked and cannot be edited",
    "is_locked": true,
    "feature_index": 2
    }
  - 404: no assigned submission found

7) GET /api/teams/viewfinal

- Description: View your team's final submission (the submission originally created by this team).
- Auth: team JWT
- Success (200): same shape as view-for-swap
- Errors:
  - 401 / 404 as above

---

### Submission Routes (/api/submit)

Protected (require team JWT)

1) POST /api/submit/phase1

- Description: Phase 1 submission (initial submissions). Creates a Submission record for the team.
- Auth: team JWT
- Request JSON:
  {
  "problem": "string", // named `problem` in submission controller as `ProblemStatement`
  "sol1": "string",
  "sol2": "string",
  "sol3": "string",
  "sol4": "string",
  "locked_index": 1 // integer 1-4
  }
- Success (201):
  {
  "message": "Phase 1 submission complete",
  "locked_idea": "SOL<locked_index>"
  }
- Errors:
  - 400: invalid payload or already submitted in Phase 1
  - 500: DB error

2) POST /api/submit/phase2

- Description: Phase 2 submission (after swaps). Teams submit an updated solution for the submission assigned to them. Cannot update the locked index and marks the submission as final.
- Auth: team JWT
- Request JSON:
  {
  "solution_index": 2, // integer 1-4, index chosen to update (cannot equal LockedIndex)
  "updated_solution": "string"
  }
- Success (200):
  {
  "message": "Phase 2 update successful",
  "updated_field": 2,
  "updated_idea": "..."
  }
- Errors:
  - 400: invalid payload
  - 403: no assigned submission, locked index chosen, or submission already final
  - 500: DB error

---

### Admin Routes (/api/admin)

1) POST /api/admin/login

- Description: Admin login by username and password. Returns admin JWT.
- Auth: none
- Request JSON:
  { "username": "string", "password": "string" }
- Success (200):
  { "token": "`<admin-jwt>`" }
- Errors:
  - 400: invalid payload
  - 401: invalid credentials

Protected (require `Authorization: Bearer <admin-token>`):

2) GET /api/admin/dashboard-admin

- Description: List teams for admin dashboard.
- Auth: admin JWT
- Success (200):
  { "teams": [ { "ID": "uuid", "TeamName": "...", "ProblemStatement": "..." }, ... ] }
- Errors: 500 on DB failure

3) POST /api/admin/add-problem

- Description: Add a problem statement.
- Auth: admin JWT
- Request JSON:
  { "problem": "string", "solution": "string" }
- Success (201):
  { "message": "Problem created successfully", "problem": { ... } }
- Errors: 400/500 accordingly

4) GET /api/admin/team?id=`<team-uuid>`

- Description: View team details and submission info for the provided team id.
- Auth: admin JWT
- Query param: `id` (required)
- Success (200):
  {
  "team_name": "...",
  "leader_name": "...",
  "problem_statement": "...",
  "members": "...",
  "submission": "submitted" | "no submission yet",
  "sol1": "...",
  "sol2": "...",
  "sol3": "...",
  "sol4": "...",
  }
- Errors:
  - 400: missing id
  - 404: team not found

5) GET /api/admin/swap

- Description: Prepare swap assignments. Shuffles the team IDs by a non-zero circular offset and writes the resulting `SwapWithID` for each submission.
- Auth: admin JWT
- Success (200): { "message": "Swap assignments prepared successfully" }
- Errors:
  - 400: not enough teams or submissions/teams mismatch
  - 500: DB error
- Notes: This will overwrite `swap_with_id` fields on existing submissions.

6) POST /api/admin/notify

- Description: Broadcast a notification to all connected WebSocket clients.
- Auth: admin JWT
- Request JSON:
  { "heading": "string", "message": "string" }
- Success (200): { "status": "broadcasted" }
- Errors: 500 if hub not initialized or broadcast failure

---

## Common error shapes

- Validation / bad request: 400
  { "error": "..." }
- Unauthorized / invalid token: 401
  { "error": "..." }
- Forbidden: 403
  { "error": "..." }
- Not found: 404
  { "error": "..." }
- Server error: 500
  { "error": "..." }

---

## WebSocket notes

- Connect to `ws://localhost:8080/api/teams/ws` to receive broadcasts.
- Notifications sent by admin `/api/admin/notify` are JSON objects with `heading` and `message` fields.

---

## Useful env vars

- `DATABASE_URL` (neon.tech hostel h )
- `JWT_SECRET` (for team tokens)
- `JWT_ADMIN_SECRET` (for admin tokens)
