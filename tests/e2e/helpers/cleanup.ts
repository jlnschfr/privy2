import type { SupabaseClient, Session } from "@supabase/supabase-js";
import { createTestClient } from "./supabase";

// Scorched-earth cleanup: delete every note and RSS feed the test user owns.
// RLS restricts these deletes to the authenticated user's rows, so this can
// never touch real user data even if the filter were wrong.
export async function wipeTestUserData(session: Session): Promise<void> {
  const client = createTestClient();
  await client.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });

  await Promise.all([
    deleteAllRows(client, "notes", session.user.id),
    deleteAllRows(client, "rss", session.user.id),
  ]);
}

async function deleteAllRows(
  client: SupabaseClient,
  table: "notes" | "rss",
  userId: string,
): Promise<void> {
  const { error } = await client
    .from(table)
    .delete()
    .match({ user_id: userId });
  if (error) {
    throw new Error(`Failed to wipe ${table}: ${error.message}`);
  }
}
