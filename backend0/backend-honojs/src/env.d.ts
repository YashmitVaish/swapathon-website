import type {
  D1Database,
  DurableObjectNamespace,
} from "@cloudflare/workers-types";

export type Env = {
  DB: D1Database;
  WS_HUB: DurableObjectNamespace;
  JWT_SECRET: string;
  JWT_ADMIN_SECRET: string;
  JWT_ISS: string;
  JWT_AUD: string;
  CORS_ORIGINS?: string;
};
