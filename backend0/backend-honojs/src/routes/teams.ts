import { Hono } from "hono";
import type { Env } from "../env";
import { getDb } from "../db/client";
import { teams, problems, submissions } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { issueTeamToken } from "../auth/jwt";
import { authTeam } from "../middleware/authTeam";
import bcrypt from "bcryptjs";
import { z } from "zod";

const teamsApp = new Hono<{ Bindings: Env }>();

const registerSchema = z.object({
  team_name: z.string(),
  leader_name: z.string(),
  email: z.string().email(),
  password: z.string(),
  members: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

teamsApp.post("/register", async (c) => {
  const body = await c.req.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: "Invalid payload" }, 400);
  }

  const { team_name, leader_name, email, password, members } = parsed.data;

  const db = getDb(c.env.DB);

  const existingEmail = await db
    .select()
    .from(teams)
    .where(eq(teams.email, email))
    .limit(1);

  if (existingEmail.length > 0) {
    return c.json({ error: "Email already registered" }, 400);
  }

  const existingName = await db
    .select()
    .from(teams)
    .where(eq(teams.teamName, team_name))
    .limit(1);

  if (existingName.length > 0) {
    return c.json({ error: "Team name already taken" }, 400);
  }

  const passwordHash = await bcrypt.hash(password, 14);
  const teamId = crypto.randomUUID();

  await db.insert(teams).values({
    id: teamId,
    teamName: team_name,
    leaderName: leader_name,
    email: email,
    passwordHash: passwordHash,
    members: members || null,
  });

  return c.json({ message: "team registered succesfully " }, 201);
});

teamsApp.post("/login", async (c) => {
  const body = await c.req.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: "Invalid payload" }, 400);
  }

  const { email, password } = parsed.data;

  const db = getDb(c.env.DB);

  const team = await db.select().from(teams).where(eq(teams.email, email)).limit(1);

  if (team.length === 0) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const isValid = await bcrypt.compare(password, team[0].passwordHash);

  if (!isValid) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const token = await issueTeamToken(team[0].id, c.env);

  return c.json({ token });
});

teamsApp.get("/listproblems", async (c) => {
  const db = getDb(c.env.DB);

  const problemsList = await db.select().from(problems);

  const formatted = problemsList.map((p) => ({
    id: p.id,
    problem: p.problemStatement,
    solution: p.expectedSolution,
  }));

  return c.json({ problems: formatted });
});

teamsApp.get("/get-data", authTeam, async (c) => {
  const teamId = c.get("teamId") as string;

  const db = getDb(c.env.DB);

  const team = await db.select().from(teams).where(eq(teams.id, teamId)).limit(1);

  if (team.length === 0) {
    return c.json({ error: "Team not found" }, 404);
  }

  return c.json({
    team_name: team[0].teamName,
    leader_name: team[0].leaderName,
    email_id: team[0].email,
    problem_statement: team[0].problemStatement || null,
    members: team[0].members || null,
  });
});

teamsApp.get("/view-for-swap", authTeam, async (c) => {
  const teamId = c.get("teamId") as string;

  const db = getDb(c.env.DB);

  const submission = await db
    .select()
    .from(submissions)
    .where(eq(submissions.swapWithId, teamId))
    .limit(1);

  if (submission.length === 0) {
    return c.json({ error: "No assigned submission found" }, 404);
  }

  return c.json({
    sol1: submission[0].sol1,
    sol2: submission[0].sol2,
    sol3: submission[0].sol3,
    sol4: submission[0].sol4,
    locked_index: submission[0].lockedIndex,
  });
});

teamsApp.get("/viewfinal", authTeam, async (c) => {
  const teamId = c.get("teamId") as string;

  const db = getDb(c.env.DB);

  const submission = await db
    .select()
    .from(submissions)
    .where(eq(submissions.teamId, teamId))
    .limit(1);

  if (submission.length === 0) {
    return c.json({ error: "No submission found" }, 404);
  }

  return c.json({
    sol1: submission[0].sol1,
    sol2: submission[0].sol2,
    sol3: submission[0].sol3,
    sol4: submission[0].sol4,
    locked_index: submission[0].lockedIndex,
  });
});

teamsApp.get("/ws", async (c) => {
  const stub = c.env.WS_HUB.idFromName("main");
  const doInstance = c.env.WS_HUB.get(stub);

  const url = new URL(c.req.url);
  url.pathname = "/ws";

  const req = new Request(url.toString(), {
    method: c.req.method,
    headers: c.req.header(),
    body: c.req.method !== "GET" && c.req.method !== "HEAD" ? c.req.raw.body : undefined,
  });

  return doInstance.fetch(req);
});

export default teamsApp;

