import type { DurableObjectState } from "@cloudflare/workers-types";
import type { Env } from "../env";

export class WsHub {
  constructor(State: DurableObjectState, Env: Env) {}
  async fetch(req: Request) {
    return new Response("ok");
  }
}
