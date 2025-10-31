# Swapathon Backend (Hono.js)

A Cloudflare Workers backend built with Hono.js framework, featuring database support via Drizzle ORM, WebSocket capabilities through Durable Objects, and JWT authentication.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Cloudflare account](https://dash.cloudflare.com/) (for deployment)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (installed via npm)

## Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd backend0/backend-honojs
```

2. Install dependencies:
```bash
npm install
```

## Configuration

The project uses `wrangler.toml` for Cloudflare Workers configuration. Key settings include:

- **Database**: Cloudflare D1 (SQLite) database named `swapathon-db`
- **Durable Objects**: WebSocket hub (`WsHub`)
- **Environment Variables**: JWT settings and CORS origins

You may need to adjust the `database_id` in `wrangler.toml` if you're using your own Cloudflare account.

## Database Setup

### Generate Database Schema

After creating or modifying your database schema in `src/db/schema.ts`, generate migrations:

```bash
npm run db:generate
```

This creates migration files in the `drizzle` directory.

### Apply Migrations Locally

To apply migrations to your local D1 database:

```bash
npm run db:migrate:local
```

### Apply Migrations to Remote Database

To apply migrations to your production D1 database:

```bash
npm run db:migrate:remote
```

**Note**: Make sure you're authenticated with Wrangler (`wrangler login`) before running remote migrations.

## Running Locally

1. Start the development server:

```bash
npm run dev
```

This will start a local development server using Wrangler. The server will typically be available at `http://localhost:8787` (or another port if specified).

2. Test the health endpoint:

```bash
curl http://localhost:8787/health
```

You should receive a JSON response: `{"ok": true}`

## Deployment

Deploy your backend to Cloudflare Workers:

```bash
npm run deploy
```

**Before deploying:**

1. Ensure you're logged in to Cloudflare:
```bash
wrangler login
```

2. Create your D1 database (if not already created):
```bash
wrangler d1 create swapathon-db
```

Update the `database_id` in `wrangler.toml` with the ID from the output.

3. Apply migrations to the remote database (see [Database Setup](#database-setup)).

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start local development server |
| `npm run deploy` | Deploy to Cloudflare Workers (with minification) |
| `npm run cf-typegen` | Generate TypeScript types for Cloudflare bindings |
| `npm run db:generate` | Generate Drizzle migration files |
| `npm run db:migrate:local` | Apply migrations to local D1 database |
| `npm run db:migrate:remote` | Apply migrations to remote D1 database |

## Project Structure

```
backend-honojs/
├── src/
│   ├── db/
│   │   ├── client.ts      # Drizzle database client
│   │   └── schema.ts      # Database schema definitions
│   ├── do/
│   │   └── WsHub.ts       # WebSocket Durable Object
│   ├── env.d.ts           # TypeScript environment type definitions
│   └── index.ts           # Main application entry point
├── drizzle.config.ts       # Drizzle ORM configuration
├── wrangler.toml           # Cloudflare Workers configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies and scripts
```

## Environment Variables

The following environment variables are configured in `wrangler.toml`:

- `JWT_ISS`: JWT issuer identifier (default: "swapathon")
- `JWT_AUD`: JWT audience identifier (default: "swapathon-clients")
- `CORS_ORIGINS`: Comma-separated list of allowed CORS origins (default: "http://localhost:5173")

These can be modified in `wrangler.toml` or set as secrets in Cloudflare:

```bash
wrangler secret put JWT_ISS
wrangler secret put JWT_AUD
wrangler secret put CORS_ORIGINS
```

## Additional Resources

- [Hono.js Documentation](https://hono.dev/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Verify your D1 database exists:
```bash
wrangler d1 list
```

2. Check that the `database_id` in `wrangler.toml` matches your database ID.

### Type Generation

If TypeScript types are not recognized, run:

```bash
npm run cf-typegen
```

This generates the `CloudflareBindings` interface for type safety.

### CORS Issues

If you're experiencing CORS errors:

1. Verify the `CORS_ORIGINS` environment variable includes your frontend URL.
2. Ensure your frontend is sending requests with proper headers.
3. Check that the origin matches exactly (including protocol and port).
