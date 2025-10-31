import { Hono } from "hono";
import type { Env } from "./env";
import { WsHub } from "./do/WsHub";
import teamsApp from "./routes/teams";
import submitApp from "./routes/submit";
import adminApp from "./routes/admin";

const app = new Hono<{ Bindings: Env }>();

app.get("/health", (c) => c.json({ ok: true }));

app.route("/api/teams", teamsApp);
app.route("/api/submit", submitApp);
app.route("/api/admin", adminApp);

export default app;
export { WsHub };
