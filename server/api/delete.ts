import { createError } from "h3";
import {
  serverSupabaseUser,
  serverSupabaseServiceRole,
} from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseServiceRole(event);
  const user = await serverSupabaseUser(event);

  // const { data, error } = await client.auth.admin.deleteUser(user.id);

  const data = "test";
  const error;

  console.log("TEST");
  if (error) {
    throw createError({ statusMessage: error.message });
  }

  return { data };
});
