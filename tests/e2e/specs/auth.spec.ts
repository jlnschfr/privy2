import { test, expect } from "@playwright/test";
import { createTestClient } from "../helpers/supabase";

test("login: authenticated session lands on the notes page", async ({
  page,
}) => {
  // Land on `/` with the session cookie already in place. PrivyAuthForm
  // watches `useSupabaseUser` and navigates to /notes once auth settles — so
  // ending up on /notes with a working UI means the session is accepted.
  await page.goto("/");
  await expect(page).toHaveURL(/\/notes/, { timeout: 15_000 });
  await expect(
    page.getByRole("button", { name: "Add a new note" }),
  ).toBeVisible();
});

test("signup is disabled for new users", async () => {
  // Public signup is turned off in Supabase. Attempting to register a brand-
  // new user should fail. Using a client without a logged-in session so RLS
  // and auth settings behave as they would for an anonymous visitor.
  const client = createTestClient();
  const randomSuffix = Math.random().toString(36).slice(2, 10);
  const email = `e2e-signup-${Date.now()}-${randomSuffix}@example.com`;

  const { data, error } = await client.auth.signUp({
    email,
    password: "irrelevant-but-strong-enough-Pw1!",
  });

  // Supabase returns an explicit error when signups are disabled. If that
  // ever changes and Supabase silently succeeds, fall back to asserting no
  // confirmed user/session was produced.
  if (error) {
    expect(error.message.toLowerCase()).toMatch(
      /signups? (are )?(not allowed|disabled)|not allowed/,
    );
  } else {
    expect(data.session).toBeNull();
    expect(data.user?.identities?.length ?? 0).toBe(0);
  }
});
