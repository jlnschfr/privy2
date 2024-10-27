import { createClient } from "@supabase/supabase-js";
import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  const { id } = event.queryStringParameters;

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
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
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
    };
  }
};
