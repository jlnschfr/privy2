import { createError } from "h3";
import {
  serverSupabaseUser,
  serverSupabaseServiceRole,
} from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseServiceRole(event);
  const user = await serverSupabaseUser(event);

  const { data, error } = await client.auth.admin.deleteUser(user.id);

  if (error) {
    throw createError({ statusMessage: error.message });
  }

  return { data };
});
