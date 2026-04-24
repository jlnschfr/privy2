import { test as teardown } from "@playwright/test";
import { signInTestUser } from "./helpers/supabase";
import { wipeTestUserData } from "./helpers/cleanup";

teardown("wipe test user data", async () => {
  const session = await signInTestUser();
  await wipeTestUserData(session);
});
