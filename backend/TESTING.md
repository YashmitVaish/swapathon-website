# Backend Testing Guide

This guide helps testers set up and test the Swapathon backend API.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running the Backend](#running-the-backend)
- [Testing Endpoints](#testing-endpoints)
- [Test Scenarios](#test-scenarios)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Go 1.25.1** or compatible version installed
- **PostgreSQL Database** (or Neon database connection string)
- **API Testing Tool** (Postman, Insomnia, cURL, or browser)
- **WebSocket Client** (optional, for WebSocket testing)

### Verify Go Installation
```bash
go version
```

### Verify Backend Structure
Ensure you're in the `backend` directory:
```bash
cd backend
ls
```

---

## Setup Instructions

### 1. Install Dependencies

```bash
go mod download
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory with the following:

```env
# Database Connection (PostgreSQL/Neon)
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# JWT Secrets (MUST be at least 32 characters each)
JWT_SECRET=your_team_secret_key_at_least_32_characters_long
JWT_ADMIN_SECRET=your_admin_secret_key_at_least_32_characters_long
```

**Important:** 
- JWT secrets must be **at least 32 characters** long for security
- Never commit the `.env` file to version control
- For Neon databases, use the full connection string with SSL

### 3. Verify Configuration

Check that your `.env` file exists:
```bash
# Windows PowerShell
Test-Path .env

# Linux/Mac
ls -la .env
```

---

## Running the Backend

### Start the Server

```bash
go run cmd/main.go
```

**Expected Output:**
```
[GIN-debug] [WARNING] Creating an Engine instance with the Logger and Recovery middleware already attached.
[GIN-debug] POST   /api/teams/register    --> backend/controllers.RegisterTeam
[GIN-debug] POST   /api/teams/login       --> backend/controllers.LoginTeam
...
Connected to DB successfully
Database migrated successfully
[GIN-debug] Listening and serving HTTP on :8080
```

### Verify Server is Running

Open your browser or use cURL:
```bash
curl http://localhost:8080/api/teams/listproblems
```

You should receive a JSON response (even if empty).

---

## Testing Endpoints

### Base URL
All endpoints use: `http://localhost:8080`

### Authentication
- **Team endpoints**: Use JWT token from `/api/teams/login`
- **Admin endpoints**: Use admin JWT token from `/api/admin/login`
- Include token in header: `Authorization: Bearer <token>`

---

## Test Scenarios

### 1. Team Registration Flow

#### Step 1: Register a Team
```bash
curl -X POST http://localhost:8080/api/teams/register \
  -H "Content-Type: application/json" \
  -d '{
    "team_name": "TestTeam1",
    "leader_name": "John Doe",
    "email": "team1@example.com",
    "password": "securepass123",
    "problem_statement": "Build a web app for task management",
    "members": "John Doe, Jane Smith"
  }'
```

**Expected Response (201):**
```json
{
  "message": "team registered succesfully "
}
```

**Test Cases:**
- ✅ Register with valid data
- ❌ Register with duplicate email (should return 400)
- ❌ Register with duplicate team name (should return 400)
- ❌ Register with missing required fields (should return 400)
- ❌ Register with invalid email format (should return 400)

---

### 2. Team Login Flow

#### Step 2: Login as Team
```bash
curl -X POST http://localhost:8080/api/teams/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "team1@example.com",
    "password": "securepass123"
  }'
```

**Expected Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Save the token** for subsequent requests.

**Test Cases:**
- ✅ Login with correct credentials
- ❌ Login with wrong password (should return 401)
- ❌ Login with non-existent email (should return 401)
- ❌ Login with missing fields (should return 400)

---

### 3. List Problems (Public Endpoint)

#### Step 3: View Available Problems
```bash
curl http://localhost:8080/api/teams/listproblems
```

**Expected Response (200):**
```json
{
  "problems": [
    {
      "id": 1,
      "problem": "Build a task management system"
    }
  ]
}
```

**Important:** Solutions should **NOT** be included in the response.

**Test Cases:**
- ✅ List problems without authentication
- ✅ Verify solutions are not exposed
- ❌ Should not require authentication

---

### 4. View Team Details (Protected)

#### Step 4: Get Team Information
```bash
curl http://localhost:8080/api/teams/get-data \
  -H "Authorization: Bearer YOUR_TEAM_TOKEN"
```

**Expected Response (200):**
```json
{
  "team_name": "TestTeam1",
  "leader_name": "John Doe",
  "email_id": "team1@example.com",
  "problem_statement": "Build a web app for task management",
  "members": "John Doe, Jane Smith"
}
```

**Test Cases:**
- ✅ Access with valid token
- ❌ Access without token (should return 401)
- ❌ Access with invalid token (should return 401)

---

### 5. Phase 1 Submission

#### Step 5: Submit Phase 1 Solutions
```bash
curl -X POST http://localhost:8080/api/submit/phase1 \
  -H "Authorization: Bearer YOUR_TEAM_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "problem": "Build a task management system",
    "sol1": "Solution 1: Use React for frontend",
    "sol2": "Solution 2: Use Node.js for backend",
    "sol3": "Solution 3: Use PostgreSQL database",
    "sol4": "Solution 4: Use Docker for deployment",
    "locked_index": 2
  }'
```

**Expected Response (201):**
```json
{
  "message": "Phase 1 submission complete",
  "locked_idea": "SOL2"
}
```

**Test Cases:**
- ✅ Submit with valid data (locked_index 1-4)
- ❌ Submit with locked_index outside 1-4 (should return 400)
- ❌ Submit twice (should return 400 - already submitted)
- ❌ Submit without token (should return 401)
- ❌ Submit with missing fields (should return 400)

---

### 6. Admin Login

#### Step 6: Login as Admin
```bash
curl -X POST http://localhost:8080/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "adminpassword"
  }'
```

**Note:** Admin must be created in database first (or seeded).

**Expected Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Save the admin token** for admin endpoints.

---

### 7. Admin: Add Problem

#### Step 7: Add a Problem Statement
```bash
curl -X POST http://localhost:8080/api/admin/add-problem \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "problem": "Design a mobile app for fitness tracking",
    "solution": "Use React Native for cross-platform development"
  }'
```

**Expected Response (201):**
```json
{
  "message": "Problem created successfully",
  "problem": {
    "ID": 2,
    "CreatedAt": "2024-01-01T00:00:00Z",
    "UpdatedAt": "2024-01-01T00:00:00Z",
    "DeletedAt": null,
    "ProblemStatement": "Design a mobile app for fitness tracking",
    "ExpectedSolution": "Use React Native for cross-platform development"
  }
}
```

**Test Cases:**
- ✅ Add problem with admin token
- ❌ Add problem without token (should return 401)
- ❌ Add problem with team token (should return 401)
- ❌ Add problem with missing fields (should return 400)

---

### 8. Admin: Prepare Swaps

#### Step 8: Assign Swaps Between Teams
```bash
curl -X GET http://localhost:8080/api/admin/swap \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected Response (200):**
```json
{
  "message": "Swap assignments prepared successfully"
}
```

**Prerequisites:**
- At least 2 teams registered
- Each team must have submitted Phase 1

**Test Cases:**
- ✅ Prepare swaps with 2+ teams and submissions
- ❌ Prepare swaps with less than 2 teams (should return 400)
- ❌ Prepare swaps with mismatched team/submission count (should return 400)

---

### 9. Phase 2 Submission

#### Step 9: Submit Phase 2 Update
```bash
curl -X POST http://localhost:8080/api/submit/phase2 \
  -H "Authorization: Bearer YOUR_TEAM_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "solution_index": 1,
    "updated_solution": "Updated Solution 1: Use Next.js instead of React"
  }'
```

**Expected Response (200):**
```json
{
  "message": "Phase 2 update successful",
  "updated_field": 1,
  "updated_idea": "Updated Solution 1: Use Next.js instead of React"
}
```

**Test Cases:**
- ✅ Update a solution (not the locked one)
- ❌ Update locked solution index (should return 403)
- ❌ Update already finalized submission (should return 403)
- ❌ Update without swap assignment (should return 403)
- ❌ Update with invalid solution_index (should return 400)

---

### 10. View For Swap

#### Step 10: View Assigned Submission
```bash
curl http://localhost:8080/api/teams/view-for-swap \
  -H "Authorization: Bearer YOUR_TEAM_TOKEN"
```

**Expected Response (200):**
```json
{
  "sol1": "Solution 1: Use React for frontend",
  "sol2": "Solution 2: Use Node.js for backend",
  "sol3": "Solution 3: Use PostgreSQL database",
  "sol4": "Solution 4: Use Docker for deployment",
  "locked_index": 2
}
```

**Test Cases:**
- ✅ View assigned submission with valid swap
- ❌ View without swap assignment (should return 404)
- ❌ View without token (should return 401)

---

### 11. WebSocket Testing

#### Step 11: Test WebSocket Connection

Use a WebSocket client (e.g., `wscat` or Postman):

```bash
# Install wscat (Node.js)
npm install -g wscat

# Connect to WebSocket
wscat -c ws://localhost:8080/api/teams/ws
```

Then, from another terminal, send a notification as admin:

```bash
curl -X POST http://localhost:8080/api/admin/notify \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "heading": "Important Update",
    "message": "Phase 2 has started!"
  }'
```

The WebSocket client should receive the notification.

---

## Complete Test Flow

### End-to-End Test Scenario

1. **Register Team 1**
   ```bash
   POST /api/teams/register
   ```

2. **Register Team 2**
   ```bash
   POST /api/teams/register
   ```

3. **Login as Team 1**
   ```bash
   POST /api/teams/login
   # Save token1
   ```

4. **Login as Team 2**
   ```bash
   POST /api/teams/login
   # Save token2
   ```

5. **Team 1 submits Phase 1**
   ```bash
   POST /api/submit/phase1 (with token1)
   ```

6. **Team 2 submits Phase 1**
   ```bash
   POST /api/submit/phase1 (with token2)
   ```

7. **Admin prepares swaps**
   ```bash
   GET /api/admin/swap (with admin token)
   ```

8. **Team 1 views assigned submission**
   ```bash
   GET /api/teams/view-for-swap (with token1)
   ```

9. **Team 1 submits Phase 2**
   ```bash
   POST /api/submit/phase2 (with token1)
   ```

10. **Team 1 views final submission**
    ```bash
    GET /api/teams/viewfinal (with token1)
    ```

---

## Test Checklist

### Security Tests
- [ ] JWT tokens are required for protected endpoints
- [ ] Invalid tokens are rejected
- [ ] Expired tokens are rejected
- [ ] Team tokens cannot access admin endpoints
- [ ] Admin tokens cannot access team-specific endpoints
- [ ] Solutions are not exposed in `/api/teams/listproblems`
- [ ] JWT secrets are validated (at least 32 characters)

### Validation Tests
- [ ] Email validation works
- [ ] Required fields are enforced
- [ ] LockedIndex must be 1-4
- [ ] Duplicate email/team names are rejected
- [ ] Phase 1 can only be submitted once
- [ ] Phase 2 cannot modify locked solution

### Functional Tests
- [ ] Teams can register and login
- [ ] Problems can be listed
- [ ] Submissions can be created and updated
- [ ] Swap assignments work correctly
- [ ] WebSocket broadcasts work
- [ ] Admin can manage teams and problems

### Error Handling Tests
- [ ] Appropriate HTTP status codes
- [ ] Clear error messages
- [ ] Database errors are handled gracefully
- [ ] Invalid input returns 400
- [ ] Unauthorized access returns 401
- [ ] Not found returns 404

---

## Troubleshooting

### Server Won't Start

**Error: "Failed to connect to database"**
- Check DATABASE_URL is correct
- Verify database server is running
- Check network connectivity
- Verify SSL settings match database requirements

**Error: "JWT_SECRET is not set or is empty"**
- Ensure `.env` file exists in `backend` directory
- Verify JWT_SECRET and JWT_ADMIN_SECRET are set
- Ensure secrets are at least 32 characters long

### Authentication Issues

**Error: "Invalid or expired token"**
- Token may have expired (24 hour expiry)
- Token may be from wrong environment
- Re-login to get a new token

**Error: "JWT_SECRET not configured"**
- Check `.env` file has JWT_SECRET set
- Restart the server after updating `.env`

### Database Issues

**Error: "Migration failed"**
- Check database permissions
- Verify database exists
- Check connection string format

### Common Issues

**"No .env file found"**
- Create `.env` file in `backend` directory
- Ensure file is named exactly `.env`

**"Port 8080 already in use"**
- Change port in `cmd/main.go`: `router.Run(":8081")`
- Or stop the process using port 8080

---

## Testing Tools

### Recommended Tools

1. **Postman** - Full-featured API testing
   - Import collection
   - Set environment variables for tokens
   - Test WebSocket connections

2. **Insomnia** - Lightweight API client
   - Good for quick tests
   - Easy environment setup

3. **cURL** - Command-line testing
   - Scriptable
   - Good for CI/CD

4. **Browser** - For GET endpoints
   - Quick verification
   - No authentication needed for public endpoints

5. **wscat** - WebSocket testing
   - `npm install -g wscat`
   - `wscat -c ws://localhost:8080/api/teams/ws`

---

## Notes

- Server runs on `http://localhost:8080` by default
- JWT tokens expire after 24 hours
- Database auto-migrates on startup
- WebSocket connections require persistent connection
- Admin accounts must be created manually in database (or seeded)

---

## Support

For issues or questions:
1. Check the logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure database is accessible
4. Review the API documentation in `API.md`

---

**Happy Testing! 🚀**

