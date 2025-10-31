import { Hono } from "hono";
import type { Env } from "../env";
import { getDb } from "../db/client";
import { admins, teams, submissions, problems } from "../db/schema";
import { eq } from "drizzle-orm";
import { issueAdminToken } from "../auth/jwt";
import { authAdmin } from "../middleware/authAdmin";
import bcrypt from "bcryptjs";
import { z } from "zod";

const adminApp = new Hono<{ Bindings: Env }>();

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const addProblemSchema = z.object({
  problem: z.string(),
  solution: z.string(),
});

const notifySchema = z.object({
  heading: z.string(),
  message: z.string(),
});

adminApp.post("/login", async (c) => {
  const body = await c.req.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: "Invalid payload" }, 400);
  }

  const { username, password } = parsed.data;

  const db = getDb(c.env.DB);

  const admin = await db
    .select()
    .from(admins)
    .where(eq(admins.username, username))
    .limit(1);

  if (admin.length === 0) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const isValid = await bcrypt.compare(password, admin[0].passwordHash);

  if (!isValid) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const token = await issueAdminToken(admin[0].username, c.env);

  return c.json({ token });
});

adminApp.get("/dashboard-admin", authAdmin, async (c) => {
  const db = getDb(c.env.DB);

  const teamsList = await db.select().from(teams);

  const formatted = teamsList.map((t) => ({
    ID: t.id,
    TeamName: t.teamName,
    ProblemStatement: t.problemStatement || null,
  }));

  return c.json({ teams: formatted });
});

adminApp.post("/add-problem", authAdmin, async (c) => {
  const body = await c.req.json();
  const parsed = addProblemSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: "Invalid payload" }, 400);
  }

  const { problem, solution } = parsed.data;

  const db = getDb(c.env.DB);

  const result = await db
    .insert(problems)
    .values({
      problemStatement: problem,
      expectedSolution: solution,
    })
    .returning();

  return c.json(
    {
      message: "Problem created successfully",
      problem: {
        id: result[0].id,
        problem: result[0].problemStatement,
        solution: result[0].expectedSolution,
      },
    },
    201
  );
});

adminApp.get("/team", authAdmin, async (c) => {
  const teamId = c.req.query("id");

  if (!teamId) {
    return c.json({ error: "Team ID required" }, 400);
  }

  const db = getDb(c.env.DB);

  const team = await db.select().from(teams).where(eq(teams.id, teamId)).limit(1);

  if (team.length === 0) {
    return c.json({ error: "Team not found" }, 404);
  }

  const submission = await db
    .select()
    .from(submissions)
    .where(eq(submissions.teamId, teamId))
    .limit(1);

  if (submission.length === 0) {
    return c.json({
      team: team[0],
      submission: "no submission yet",
    });
  }

  return c.json({
    team: team[0],
    submission: submission[0],
  });
});

adminApp.get("/swap", authAdmin, async (c) => {
  const db = getDb(c.env.DB);

  const teamsList = await db.select().from(teams);
  const submissionsList = await db.select().from(submissions);

  if (teamsList.length < 2) {
    return c.json({ error: "At least 2 teams required" }, 400);
  }

  if (submissionsList.length !== teamsList.length) {
    return c.json({ error: "All teams must have submitted" }, 400);
  }

  const teamIds = teamsList.map((t) => t.id);

  const offset = Math.floor(Math.random() * (teamIds.length - 1)) + 1;

  await db.batch(
    submissionsList.map((sub, idx) => {
      const newIdx = (idx + offset) % teamIds.length;
      return db
        .update(submissions)
        .set({ swapWithId: teamIds[newIdx] })
        .where(eq(submissions.id, sub.id));
    })
  );

  return c.json({ message: "Swap assignments prepared successfully" });
});

adminApp.post("/notify", authAdmin, async (c) => {
  const body = await c.req.json();
  const parsed = notifySchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: "Invalid payload" }, 400);
  }

  const { heading, message } = parsed.data;

  const stub = c.env.WS_HUB.idFromName("main");
  const doInstance = c.env.WS_HUB.get(stub);

  const response = await doInstance.fetch(
    new Request("http://localhost/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ heading, message }),
    })
  );

  return c.json({ status: "broadcasted" });
});

export default adminApp;

