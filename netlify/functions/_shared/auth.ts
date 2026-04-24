import { createClient, type User } from "@supabase/supabase-js";
import type { HandlerEvent, HandlerResponse } from "@netlify/functions";

type RequireUserResult =
  | { user: User; response: null }
  | { user: null; response: HandlerResponse };

export const requireUser = async (
  event: HandlerEvent,
): Promise<RequireUserResult> => {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  const token = authHeader?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return {
      user: null,
      response: { statusCode: 401, body: JSON.stringify({}) },
    };
  }

  const client = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
  );
  const {
    data: { user },
    error,
  } = await client.auth.getUser(token);
  if (error || !user) {
    return {
      user: null,
      response: { statusCode: 401, body: JSON.stringify({}) },
    };
  }

  return { user, response: null };
};
