import type { DurableObjectState } from "@cloudflare/workers-types";
import type { Env } from "../env";

export class WsHub {
  private state: DurableObjectState;
  private env: Env;
  private sessions: Set<WebSocket>;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
    this.sessions = new Set();
  }

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);

    if (url.pathname === "/ws") {
      if (req.headers.get("Upgrade") !== "websocket") {
        return new Response("Expected WebSocket", { status: 400 });
      }

      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair) as [WebSocket, WebSocket];

      this.sessions.add(server);
      this.handleSession(server);

      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }

    if (url.pathname === "/notify" && req.method === "POST") {
      const payload = await req.json();
      const message = JSON.stringify(payload);

      const deadSessions: WebSocket[] = [];
      this.sessions.forEach((session) => {
        try {
          if (session.readyState === 1) {
            session.send(message);
          } else {
            deadSessions.push(session);
          }
        } catch (err) {
          deadSessions.push(session);
        }
      });

      deadSessions.forEach((session) => this.sessions.delete(session));

      return new Response(JSON.stringify({ status: "broadcasted" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not found", { status: 404 });
  }

  private handleSession(ws: WebSocket) {
    ws.accept();

    ws.addEventListener("close", () => {
      this.sessions.delete(ws);
    });

    ws.addEventListener("error", () => {
      this.sessions.delete(ws);
    });
  }
}
