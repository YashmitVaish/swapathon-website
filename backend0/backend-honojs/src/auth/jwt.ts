import { SignJWT, jwtVerify } from "jose";
import type { Env } from "../env";

export interface JWTPayload {
  sub: string;
  role: "team" | "admin";
  iss: string;
  aud: string;
  iat: number;
  exp: number;
}

export async function issueTeamToken(teamId: string, env: Env): Promise<string> {
  const secret = new TextEncoder().encode(env.JWT_SECRET);
  const now = Math.floor(Date.now() / 1000);

  const jwt = await new SignJWT({
    sub: teamId,
    role: "team",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(now + 24 * 60 * 60)
    .setIssuer(env.JWT_ISS)
    .setAudience(env.JWT_AUD)
    .sign(secret);

  return jwt;
}

export async function issueAdminToken(username: string, env: Env): Promise<string> {
  const secret = new TextEncoder().encode(env.JWT_ADMIN_SECRET);
  const now = Math.floor(Date.now() / 1000);

  const jwt = await new SignJWT({
    sub: username,
    role: "admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(now + 24 * 60 * 60)
    .setIssuer(env.JWT_ISS)
    .setAudience(env.JWT_AUD)
    .sign(secret);

  return jwt;
}

export async function verifyToken(
  token: string,
  secret: string,
  env: Env
): Promise<JWTPayload> {
  const secretBytes = new TextEncoder().encode(secret);
  const { payload } = await jwtVerify(token, secretBytes, {
    issuer: env.JWT_ISS,
    audience: env.JWT_AUD,
  });

  return payload as JWTPayload;
}

