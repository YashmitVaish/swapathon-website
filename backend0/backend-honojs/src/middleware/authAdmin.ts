import { Context, Next } from "hono";
import type { Env } from "../env";
import { verifyToken } from "../auth/jwt";

export async function authAdmin(c: Context<{ Bindings: Env }>, next: Next) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Missing or invalid authorization header" }, 401);
  }

  const token = authHeader.substring(7);

  try {
    const payload = await verifyToken(token, c.env.JWT_ADMIN_SECRET, c.env);

    if (payload.role !== "admin") {
      return c.json({ error: "Invalid token role" }, 401);
    }

    c.set("adminUsername", payload.sub);
    await next();
  } catch (error) {
    return c.json({ error: "Invalid or expired token" }, 401);
  }
}

