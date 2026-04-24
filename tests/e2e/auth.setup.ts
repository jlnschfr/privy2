import { test as setup } from "@playwright/test";
import { signInTestUser, applySessionCookie } from "./helpers/supabase";
import { wipeTestUserData } from "./helpers/cleanup";

const storageStatePath = "tests/e2e/.auth/user.json";

setup("authenticate and wipe test user data", async ({ page }) => {
  const session = await signInTestUser();
  await wipeTestUserData(session);

  await applySessionCookie(page.context(), session);

  // Land on `/` (login page, not behind middleware). The app reads the
  // injected session cookie asynchronously and PrivyAuthForm redirects to
  // /notes once auth state settles, which confirms the session is valid.
  await page.goto("/");
  await page.waitForURL(/\/notes/, { timeout: 15_000 });

  await page.context().storageState({ path: storageStatePath });
});
