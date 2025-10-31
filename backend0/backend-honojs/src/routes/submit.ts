import { Hono } from "hono";
import type { Env } from "../env";
import { getDb } from "../db/client";
import { submissions } from "../db/schema";
import { eq } from "drizzle-orm";
import { authTeam } from "../middleware/authTeam";
import { z } from "zod";

const submitApp = new Hono<{ Bindings: Env }>();

const phase1Schema = z.object({
  problem: z.string(),
  sol1: z.string(),
  sol2: z.string(),
  sol3: z.string(),
  sol4: z.string(),
  locked_index: z.number().int().min(1).max(4),
});

const phase2Schema = z.object({
  solution_index: z.number().int().min(1).max(4),
  updated_solution: z.string(),
});

submitApp.post("/phase1", authTeam, async (c) => {
  const teamId = c.get("teamId") as string;
  const body = await c.req.json();
  const parsed = phase1Schema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: "Invalid payload" }, 400);
  }

  const { problem, sol1, sol2, sol3, sol4, locked_index } = parsed.data;

  const db = getDb(c.env.DB);

  const existing = await db
    .select()
    .from(submissions)
    .where(eq(submissions.teamId, teamId))
    .limit(1);

  if (existing.length > 0) {
    return c.json({ error: "Already submitted in Phase 1" }, 400);
  }

  await db.insert(submissions).values({
    teamId: teamId,
    problemStatement: problem,
    sol1: sol1,
    sol2: sol2,
    sol3: sol3,
    sol4: sol4,
    lockedIndex: locked_index,
    isFinal: 0,
    evaluation: 0,
  });

  return c.json(
    {
      message: "Phase 1 submission complete",
      locked_idea: `SOL${locked_index}`,
    },
    201
  );
});

submitApp.post("/phase2", authTeam, async (c) => {
  const teamId = c.get("teamId") as string;
  const body = await c.req.json();
  const parsed = phase2Schema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: "Invalid payload" }, 400);
  }

  const { solution_index, updated_solution } = parsed.data;

  const db = getDb(c.env.DB);

  const submission = await db
    .select()
    .from(submissions)
    .where(eq(submissions.swapWithId, teamId))
    .limit(1);

  if (submission.length === 0) {
    return c.json({ error: "No assigned submission found" }, 403);
  }

  if (submission[0].isFinal === 1) {
    return c.json({ error: "Submission already finalized" }, 403);
  }

  if (submission[0].lockedIndex === solution_index) {
    return c.json({ error: "Cannot update locked index" }, 403);
  }

  const updateData: any = {
    isFinal: 1,
  };

  if (solution_index === 1) updateData.sol1 = updated_solution;
  else if (solution_index === 2) updateData.sol2 = updated_solution;
  else if (solution_index === 3) updateData.sol3 = updated_solution;
  else if (solution_index === 4) updateData.sol4 = updated_solution;

  await db
    .update(submissions)
    .set(updateData)
    .where(eq(submissions.swapWithId, teamId));

  return c.json({
    message: "Phase 2 update successful",
    updated_field: solution_index,
    updated_idea: updated_solution,
  });
});

export default submitApp;

