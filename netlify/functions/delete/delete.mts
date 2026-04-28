import { createClient } from "@supabase/supabase-js";
import type { Handler } from "@netlify/functions";
import { requireUser } from "../_shared/auth";

export const handler: Handler = async (event) => {
  const { user, response } = await requireUser(event);
  if (response) return response;

  const { id } = event.queryStringParameters ?? {};
  if (!id || user.id !== id) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.NUXT_SUPABASE_SECRET_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  const { data, error } = await supabase.auth.admin.deleteUser(id);

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ data }),
  };
};
