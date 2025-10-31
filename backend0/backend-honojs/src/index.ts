import { Hono } from "hono";
import type { Env } from "./env";
import { WsHub } from "./do/WsHub";

const app = new Hono<{ Bindings: Env }>();

app.get("/health", (c) => c.json({ ok: true }));

export default app;
export { WsHub };
