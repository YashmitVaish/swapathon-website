import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const teams = sqliteTable("teams", {
  id: text("id").primaryKey().notNull(),
  teamName: text("team_name").notNull().unique(),
  leaderName: text("leader_name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  problemStatement: text("problem_statement"),
  members: text("members"),
});

export const admins = sqliteTable("admins", {
  id: text("id").primaryKey().notNull(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  email: text("email").unique(),
});

export const problems = sqliteTable("problems", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  problemStatement: text("problem_statement").notNull(),
  expectedSolution: text("expected_solution").notNull(),
});

export const submissions = sqliteTable("submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamId: text("team_id").notNull(),
  swapWithId: text("swap_with_id"),
  problemStatement: text("problem_statement").notNull(),
  sol1: text("sol1").notNull(),
  sol2: text("sol2").notNull(),
  sol3: text("sol3").notNull(),
  sol4: text("sol4").notNull(),
  lockedIndex: integer("locked_index").notNull().default(0),
  isFinal: integer("is_final").notNull().default(0), // 0 = false, 1 = true
  evaluation: integer("evaluation").notNull().default(0),
});

export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
export type Problem = typeof problems.$inferSelect;
export type NewProblem = typeof problems.$inferInsert;
export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;

