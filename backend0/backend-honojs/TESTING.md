# Backend Testing Guide

## Base URL

**Production:** `https://swapathon-backend.bkumar-be23.workers.dev`

## Quick Start

1. Set JWT secrets (if not already set):
```bash
wrangler secret put JWT_SECRET
wrangler secret put JWT_ADMIN_SECRET
```

2. Test health endpoint:
```bash
curl https://swapathon-backend.bkumar-be23.workers.dev/health
```

Expected response:
```json
{"ok": true}
```

## Testing Workflow

### Step 1: Admin Setup

First, create an admin account (if you don't have one). You'll need to insert an admin directly into the database:

```sql
INSERT INTO admins (id, username, password_hash, email) 
VALUES ('admin-uuid', 'admin', '<bcrypt_hash>', 'admin@example.com');
```

Or use a SQL client with Cloudflare D1 to insert an admin manually.

For testing, you can use bcryptjs to generate a password hash:

```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('your_password', 14);
console.log(hash);
```

### Step 2: Admin Login

```bash
curl -X POST https://swapathon-backend.bkumar-be23.workers.dev/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your_password"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Save the token** for authenticated requests:
```bash
export ADMIN_TOKEN="<token_from_response>"
```

### Step 3: Add a Problem

```bash
curl -X POST https://swapathon-backend.bkumar-be23.workers.dev/api/admin/add-problem \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "problem": "Build a REST API for a todo application",
    "solution": "Implement CRUD operations with proper authentication"
  }'
```

**Expected Response:**
```json
{
  "message": "Problem created successfully",
  "problem": {
    "id": 1,
    "problem": "Build a REST API for a todo application",
    "solution": "Implement CRUD operations with proper authentication"
  }
}
```

### Step 4: Team Registration

```bash
curl -X POST https://swapathon-backend.bkumar-be23.workers.dev/api/teams/register \
  -H "Content-Type: application/json" \
  -d '{
    "team_name": "Team Alpha",
    "leader_name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "members": "John Doe, Jane Smith, Bob Johnson"
  }'
```

**Expected Response:**
```json
{
  "message": "team registered succesfully "
}
```

### Step 5: Team Login

```bash
curl -X POST https://swapathon-backend.bkumar-be23.workers.dev/api/teams/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Save the token:**
```bash
export TEAM_TOKEN="<token_from_response>"
```

### Step 6: List Problems

```bash
curl https://swapathon-backend.bkumar-be23.workers.dev/api/teams/listproblems
```

**Expected Response:**
```json
{
  "problems": [
    {
      "id": 1,
      "problem": "Build a REST API for a todo application",
      "solution": "Implement CRUD operations with proper authentication"
    }
  ]
}
```

### Step 7: Get Team Data

```bash
curl https://swapathon-backend.bkumar-be23.workers.dev/api/teams/get-data \
  -H "Authorization: Bearer $TEAM_TOKEN"
```

**Expected Response:**
```json
{
  "team_name": "Team Alpha",
  "leader_name": "John Doe",
  "email_id": "john@example.com",
  "problem_statement": null,
  "members": "John Doe, Jane Smith, Bob Johnson"
}
```

### Step 8: Phase 1 Submission

```bash
curl -X POST https://swapathon-backend.bkumar-be23.workers.dev/api/submit/phase1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEAM_TOKEN" \
  -d '{
    "problem": "Build a REST API for a todo application",
    "sol1": "Design database schema with users and todos tables",
    "sol2": "Implement JWT authentication middleware",
    "sol3": "Create REST endpoints for CRUD operations",
    "sol4": "Add input validation and error handling",
    "locked_index": 2
  }'
```

**Expected Response:**
```json
{
  "message": "Phase 1 submission complete",
  "locked_idea": "SOL2"
}
```

### Step 9: Admin - Assign Swaps

**Important:** Make sure at least 2 teams have submitted Phase 1.

```bash
curl https://swapathon-backend.bkumar-be23.workers.dev/api/admin/swap \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Expected Response:**
```json
{
  "message": "Swap assignments prepared successfully"
}
```

### Step 10: View Assignment (Team)

```bash
curl https://swapathon-backend.bkumar-be23.workers.dev/api/teams/view-for-swap \
  -H "Authorization: Bearer $TEAM_TOKEN"
```

**Expected Response:**
```json
{
  "sol1": "Design database schema with users and todos tables",
  "sol2": "Implement JWT authentication middleware",
  "sol3": "Create REST endpoints for CRUD operations",
  "sol4": "Add input validation and error handling",
  "locked_index": 2
}
```

### Step 11: Phase 2 Submission

Update a solution (cannot update locked_index = 2):

```bash
curl -X POST https://swapathon-backend.bkumar-be23.workers.dev/api/submit/phase2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEAM_TOKEN" \
  -d '{
    "solution_index": 1,
    "updated_solution": "Design normalized database schema with proper foreign keys and indexes"
  }'
```

**Expected Response:**
```json
{
  "message": "Phase 2 update successful",
  "updated_field": 1,
  "updated_idea": "Design normalized database schema with proper foreign keys and indexes"
}
```

### Step 12: View Final Submission

```bash
curl https://swapathon-backend.bkumar-be23.workers.dev/api/teams/viewfinal \
  -H "Authorization: Bearer $TEAM_TOKEN"
```

**Expected Response:**
```json
{
  "sol1": "Design database schema with users and todos tables",
  "sol2": "Implement JWT authentication middleware",
  "sol3": "Create REST endpoints for CRUD operations",
  "sol4": "Add input validation and error handling",
  "locked_index": 2
}
```

### Step 13: Admin - View Team Details

```bash
curl "https://swapathon-backend.bkumar-be23.workers.dev/api/admin/team?id=<team-uuid>" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Expected Response:**
```json
{
  "team": {
    "id": "...",
    "team_name": "Team Alpha",
    "leader_name": "John Doe",
    "email": "john@example.com",
    ...
  },
  "submission": {
    "id": 1,
    "team_id": "...",
    ...
  }
}
```

### Step 14: Admin - Dashboard

```bash
curl https://swapathon-backend.bkumar-be23.workers.dev/api/admin/dashboard-admin \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Expected Response:**
```json
{
  "teams": [
    {
      "ID": "uuid",
      "TeamName": "Team Alpha",
      "ProblemStatement": "Build a REST API..."
    }
  ]
}
```

### Step 15: Admin - Broadcast Notification

```bash
curl -X POST https://swapathon-backend.bkumar-be23.workers.dev/api/admin/notify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "heading": "Phase 2 Started",
    "message": "Teams can now update their assigned submissions"
  }'
```

**Expected Response:**
```json
{
  "status": "broadcasted"
}
```

### Step 16: WebSocket Connection

Connect to WebSocket endpoint to receive notifications:

```javascript
const ws = new WebSocket('wss://swapathon-backend.bkumar-be23.workers.dev/api/teams/ws');

ws.onopen = () => {
  console.log('Connected to WebSocket');
};

ws.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  console.log('Notification received:', notification);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('WebSocket closed');
};
```

## Error Testing

### Invalid Credentials

```bash
curl -X POST https://swapathon-backend.bkumar-be23.workers.dev/api/teams/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@example.com",
    "password": "wrong"
  }'
```

**Expected Response:**
```json
{
  "error": "Invalid credentials"
}
```
Status: `401 Unauthorized`

### Missing Authentication

```bash
curl https://swapathon-backend.bkumar-be23.workers.dev/api/teams/get-data
```

**Expected Response:**
```json
{
  "error": "Missing or invalid authorization header"
}
```
Status: `401 Unauthorized`

### Invalid Token

```bash
curl https://swapathon-backend.bkumar-be23.workers.dev/api/teams/get-data \
  -H "Authorization: Bearer invalid_token"
```

**Expected Response:**
```json
{
  "error": "Invalid or expired token"
}
```
Status: `401 Unauthorized`

### Duplicate Registration

```bash
curl -X POST https://swapathon-backend.bkumar-be23.workers.dev/api/teams/register \
  -H "Content-Type: application/json" \
  -d '{
    "team_name": "Team Alpha",
    "leader_name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "error": "Email already registered"
}
```
Status: `400 Bad Request`

### Invalid Payload

```bash
curl -X POST https://swapathon-backend.bkumar-be23.workers.dev/api/teams/register \
  -H "Content-Type: application/json" \
  -d '{
    "team_name": "Team Beta"
  }'
```

**Expected Response:**
```json
{
  "error": "Invalid payload"
}
```
Status: `400 Bad Request`

### Already Submitted Phase 1

```bash
curl -X POST https://swapathon-backend.bkumar-be23.workers.dev/api/submit/phase1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEAM_TOKEN" \
  -d '{
    "problem": "Test problem",
    "sol1": "Solution 1",
    "sol2": "Solution 2",
    "sol3": "Solution 3",
    "sol4": "Solution 4",
    "locked_index": 1
  }'
```

**Expected Response:**
```json
{
  "error": "Already submitted in Phase 1"
}
```
Status: `400 Bad Request`

### Phase 2 - Invalid Locked Index Update

```bash
curl -X POST https://swapathon-backend.bkumar-be23.workers.dev/api/submit/phase2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEAM_TOKEN" \
  -d '{
    "solution_index": 2,
    "updated_solution": "Updated solution"
  }'
```

**Expected Response:**
```json
{
  "error": "Cannot update locked index"
}
```
Status: `403 Forbidden`

### Phase 2 - No Assignment

```bash
curl -X POST https://swapathon-backend.bkumar-be23.workers.dev/api/submit/phase2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEAM_TOKEN" \
  -d '{
    "solution_index": 1,
    "updated_solution": "Updated solution"
  }'
```

**Expected Response:**
```json
{
  "error": "No assigned submission found"
}
```
Status: `403 Forbidden`

## Complete Test Script

Save this as `test-backend.sh`:

```bash
#!/bin/bash

BASE_URL="https://swapathon-backend.bkumar-be23.workers.dev"

echo "=== Testing Health Endpoint ==="
curl "$BASE_URL/health"
echo -e "\n"

echo "=== Testing Team Registration ==="
curl -X POST "$BASE_URL/api/teams/register" \
  -H "Content-Type: application/json" \
  -d '{
    "team_name": "Test Team",
    "leader_name": "Test Leader",
    "email": "test@example.com",
    "password": "testpass123",
    "members": "Member 1, Member 2"
  }'
echo -e "\n"

echo "=== Testing Team Login ==="
TEAM_TOKEN=$(curl -s -X POST "$BASE_URL/api/teams/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }' | jq -r '.token')

echo "Team Token: $TEAM_TOKEN"
echo -e "\n"

echo "=== Testing List Problems ==="
curl "$BASE_URL/api/teams/listproblems"
echo -e "\n"

echo "=== Testing Get Team Data ==="
curl "$BASE_URL/api/teams/get-data" \
  -H "Authorization: Bearer $TEAM_TOKEN"
echo -e "\n"

echo "=== Testing Phase 1 Submission ==="
curl -X POST "$BASE_URL/api/submit/phase1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEAM_TOKEN" \
  -d '{
    "problem": "Test Problem",
    "sol1": "Solution 1",
    "sol2": "Solution 2",
    "sol3": "Solution 3",
    "sol4": "Solution 4",
    "locked_index": 1
  }'
echo -e "\n"
```

Make it executable:
```bash
chmod +x test-backend.sh
./test-backend.sh
```

## Postman Collection

Import this into Postman:

```json
{
  "info": {
    "name": "Swapathon Backend API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "https://swapathon-backend.bkumar-be23.workers.dev/health",
          "protocol": "https",
          "host": ["swapathon-backend", "bkumar-be23", "workers", "dev"],
          "path": ["health"]
        }
      }
    },
    {
      "name": "Team Register",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"team_name\": \"Test Team\",\n  \"leader_name\": \"Test Leader\",\n  \"email\": \"test@example.com\",\n  \"password\": \"testpass123\",\n  \"members\": \"Member 1, Member 2\"\n}"
        },
        "url": {
          "raw": "https://swapathon-backend.bkumar-be23.workers.dev/api/teams/register",
          "protocol": "https",
          "host": ["swapathon-backend", "bkumar-be23", "workers", "dev"],
          "path": ["api", "teams", "register"]
        }
      }
    },
    {
      "name": "Team Login",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"testpass123\"\n}"
        },
        "url": {
          "raw": "https://swapathon-backend.bkumar-be23.workers.dev/api/teams/login",
          "protocol": "https",
          "host": ["swapathon-backend", "bkumar-be23", "workers", "dev"],
          "path": ["api", "teams", "login"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "https://swapathon-backend.bkumar-be23.workers.dev"
    },
    {
      "key": "team_token",
      "value": ""
    },
    {
      "key": "admin_token",
      "value": ""
    }
  ]
}
```

## Testing Checklist

- [ ] Health endpoint responds correctly
- [ ] Team registration works
- [ ] Team login returns valid JWT
- [ ] Admin login returns valid JWT
- [ ] List problems returns problems
- [ ] Get team data requires authentication
- [ ] Phase 1 submission works
- [ ] Phase 1 duplicate submission fails
- [ ] Swap assignment works (requires 2+ teams)
- [ ] View for swap returns assigned submission
- [ ] Phase 2 submission updates correctly
- [ ] Phase 2 cannot update locked index
- [ ] View final returns team's submission
- [ ] Admin dashboard returns teams
- [ ] Admin team details endpoint works
- [ ] Admin notification broadcasts
- [ ] WebSocket connection establishes
- [ ] WebSocket receives notifications
- [ ] Error handling for invalid credentials
- [ ] Error handling for missing auth
- [ ] Error handling for invalid payload

## Notes

1. **JWT Tokens**: Tokens expire after 24 hours. Re-login if you get 401 errors.

2. **Swap Assignment**: Requires at least 2 teams with Phase 1 submissions.

3. **Phase 2**: Cannot update the locked index from Phase 1.

4. **Database**: Uses Cloudflare D1 (SQLite), so transactions are atomic.

5. **WebSocket**: Connect to `wss://` (not `ws://`) for production.

6. **CORS**: Currently disabled for testing. Re-enable in `src/index.ts` for production with frontend.

7. **Rate Limiting**: Not implemented yet. Consider adding for production.

## Troubleshooting

**401 Unauthorized:**
- Check if JWT secrets are set
- Verify token is not expired
- Ensure token is sent in `Authorization: Bearer <token>` header

**404 Not Found:**
- Verify endpoint URL is correct
- Check if route is registered in `src/index.ts`

**500 Server Error:**
- Check Cloudflare Workers logs: `wrangler tail`
- Verify database migrations are applied
- Check environment variables are set correctly

**WebSocket Issues:**
- Verify Durable Object migration is applied
- Check `WS_HUB` binding in `wrangler.toml`
- Ensure Durable Object class is exported

## Support

For issues or questions:
1. Check [README.md](./README.md) for setup
2. Check [ENDPOINTS.md](./ENDPOINTS.md) for API reference
3. View logs: `wrangler tail`
4. Check deployment status: `wrangler deployments list`

