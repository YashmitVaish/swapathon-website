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

## Phase 3 - Auth Endpoints (Not Yet Implemented)

Phase 3 includes JWT utilities and middleware:
- `src/auth/jwt.ts` - JWT token creation and verification
- `src/middleware/authTeam.ts` - Team authentication middleware
- `src/middleware/authAdmin.ts` - Admin authentication middleware

These are ready to be used in Phase 4 routes.

