import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./env";
import { WsHub } from "./do/WsHub";

const app = new Hono<{ Bindings: Env }>();

app.use(
  "*",
  cors({
    origin: (origin, c) => {
      const allow = c.env.CORS_ORIGINS?.split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
      if (!allow || allow.length === 0) return origin;
      return allow.includes(origin) ? origin : "";
    },
    allowHeaders: ["Authorization", "Content-Type"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: false,
  })
);

app.get("/health", (c) => c.json({ ok: true }));

export default app;
export { WsHub };
