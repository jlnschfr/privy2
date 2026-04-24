import { test, expect } from "@playwright/test";

// Stable public Atom feed. Replace if the source is ever retired.
const FEED_URL = "https://github.com/nuxt/nuxt/releases.atom";

// See notes.spec.ts: land on `/` first so auth state settles before
// navigating to a middleware-protected route.
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForURL(/\/notes/, { timeout: 15_000 });
});

test("add an RSS feed in the admin panel", async ({ page }) => {
  // Admin is behind the auth middleware. A hard `goto("/admin")` bounces to
  // / before session restoration completes, so navigate via the SPA link
  // instead — in-memory auth state is preserved across SPA transitions.
  await page.getByRole("link", { name: "My Privy" }).click();
  await page.waitForURL(/\/admin/);

  const feedInput = page.getByPlaceholder("RSS Feed Url");
  await feedInput.fill(FEED_URL);
  await feedInput.press("Enter");

  // The RSS add flow calls the Netlify function, which parses the feed and
  // then upserts a row into the `rss` table. The URL shows up in the admin
  // list when persistence succeeds.
  await expect(page.getByText(FEED_URL, { exact: true })).toBeVisible({
    timeout: 15_000,
  });
});
