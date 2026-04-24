import { createClient, type Session } from "@supabase/supabase-js";
import type { BrowserContext, Cookie } from "@playwright/test";
import {
  SUPABASE_URL,
  SUPABASE_KEY,
  TEST_USER_EMAIL,
  TEST_USER_PASSWORD,
  BASE_URL,
} from "./env";

// Derive the cookie name the way @nuxtjs/supabase does when no custom
// `cookiePrefix` is configured:
// `sb-<first hostname segment of SUPABASE_URL>-auth-token`.
function getCookieName(): string {
  const { hostname } = new URL(SUPABASE_URL());
  const projectRef = hostname.split(".")[0];
  return `sb-${projectRef}-auth-token`;
}

export function createTestClient() {
  return createClient(SUPABASE_URL(), SUPABASE_KEY(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function signInTestUser(): Promise<Session> {
  const client = createTestClient();
  const { data, error } = await client.auth.signInWithPassword({
    email: TEST_USER_EMAIL(),
    password: TEST_USER_PASSWORD(),
  });
  if (error || !data.session) {
    throw new Error(`Sign-in failed: ${error?.message ?? "no session"}`);
  }
  return data.session;
}

// Build a cookie that mimics @supabase/ssr's base64url storage format.
// Value is "base64-<base64url(JSON.stringify(session))>", per
// node_modules/@supabase/ssr/dist/module/cookies.js
export function sessionToCookie(session: Session): Cookie {
  const payload = {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_in: session.expires_in,
    expires_at: session.expires_at,
    token_type: session.token_type,
    user: session.user,
    provider_token: session.provider_token ?? null,
    provider_refresh_token: session.provider_refresh_token ?? null,
  };
  const json = JSON.stringify(payload);
  const base64url = Buffer.from(json, "utf8").toString("base64url");
  const value = `base64-${base64url}`;

  const url = new URL(BASE_URL());
  return {
    name: getCookieName(),
    value,
    domain: url.hostname,
    path: "/",
    expires: session.expires_at ?? -1,
    httpOnly: false,
    secure: url.protocol === "https:",
    sameSite: "Lax",
  };
}

export async function applySessionCookie(
  context: BrowserContext,
  session: Session,
): Promise<void> {
  await context.addCookies([sessionToCookie(session)]);
}
