import { test, expect, type Page } from "@playwright/test";

test.describe.configure({ mode: "serial" });

// Supabase session restoration is async, but the global auth middleware is
// sync — so a direct goto to a protected route can bounce through `/`
// before auth settles. Land on `/` first, let PrivyAuthForm redirect us to
// /notes, then any subsequent navigation happens with an in-memory session.
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForURL(/\/notes/, { timeout: 15_000 });
});

async function createNote(page: Page, title: string): Promise<string> {
  await page.goto("/notes?filter=Favorites");
  await page.getByRole("button", { name: "Add a new note" }).click();

  await expect(page).toHaveURL(/\/note\/[0-9a-f-]+/);

  const titleField = page.getByPlaceholder("Title");
  await titleField.click();
  await titleField.fill(title);

  // Title is debounced 500ms and the Supabase write happens shortly after.
  // Blur the title field so the debounced save flushes, then wait.
  await titleField.blur();
  await page.waitForTimeout(1500);

  return page.url();
}

test("create a note and it appears in the notes list", async ({ page }) => {
  const title = `E2E create ${Date.now()}`;

  const noteUrl = await createNote(page, title);
  expect(noteUrl).toMatch(/\/note\/[0-9a-f-]+/);

  await page.goto("/notes");
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
});

test("edit a note: title, markdown item, todo item persist across reload", async ({
  page,
}) => {
  const title = `E2E edit ${Date.now()}`;
  const updatedTitle = `${title} updated`;
  const markdownText = "This is **markdown** content.";
  const todoText = "Buy milk";

  await createNote(page, title);

  const titleField = page.getByPlaceholder("Title");
  await titleField.fill(updatedTitle);

  await page.getByRole("button", { name: "Add Markdown", exact: true }).click();
  // The app auto-focuses the new markdown item's textarea after ~100ms.
  const markdownTextarea = page.locator(".draggable-item textarea").first();
  await expect(markdownTextarea).toBeFocused();
  await markdownTextarea.fill(markdownText);

  await page.getByRole("button", { name: "Add Task", exact: true }).click();
  const taskInput = page.locator(".Task input[type=text]").last();
  await expect(taskInput).toBeFocused();
  await taskInput.fill(todoText);

  // Let debounce (250–500ms) + Supabase upsert complete.
  await taskInput.blur();
  await page.waitForTimeout(2000);

  // Full reload bounces through `/` because the auth middleware is
  // synchronous while session restoration from the cookie is async.
  // PrivyAuthForm sends us to /notes once auth settles — we then open the
  // note again via SPA navigation so in-memory state isn't lost a second
  // time. `fetchAll` on /notes rehydrates from Supabase, which is what
  // actually proves persistence.
  await page.reload();
  await page.waitForURL(/\/notes/, { timeout: 15_000 });

  await page.getByRole("heading", { name: updatedTitle }).click();
  await expect(page).toHaveURL(/\/note\/[0-9a-f-]+/);

  await expect(page.getByPlaceholder("Title")).toHaveValue(updatedTitle);
  await expect(page.locator(".Markdown").getByText("markdown")).toBeVisible();
  await expect(page.locator(".Task input[type=text]")).toHaveValue(todoText);
});

test("add a tag to a note and filter by it", async ({ page }) => {
  const title = `E2E tag ${Date.now()}`;
  const tag = `e2e-tag-${Date.now()}`;

  await createNote(page, title);

  const tagInput = page.getByPlaceholder("Your Tag");
  await tagInput.fill(tag);
  await tagInput.press("Enter");

  // The tag text appears both as a chip on the note and as a sidebar
  // filter link. Scope to the chip — the list item that owns a
  // "remove tag" button.
  const tagChip = page
    .locator("li", {
      has: page.getByRole("button", { name: "remove tag" }),
    })
    .filter({ hasText: tag });
  await expect(tagChip).toBeVisible();

  // Let the debounced update reach Supabase, then filter the notes list by
  // the tag through SPA navigation. If persistence worked, the note shows
  // up under that filter.
  await page.waitForTimeout(1500);

  await page
    .getByRole("link", { name: "Privy Notes", exact: true })
    .first()
    .click();
  await page.waitForURL(/\/notes/);
  await page.getByRole("link", { name: tag, exact: true }).first().click();
  await expect(page).toHaveURL(new RegExp(`tag=${encodeURIComponent(tag)}`));
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
});

test("favorite a note via heart icon and see it under Favorites filter", async ({
  page,
}) => {
  const title = `E2E fav ${Date.now()}`;

  await createNote(page, title);

  const heart = page
    .locator("header")
    .getByRole("button", { name: "add note to favorites" });
  await heart.waitFor({ state: "visible" });

  // New notes default to favorite=true (see utils/note.ts createEmptyNote).
  // Toggle off, then on again, to exercise the heart icon handler in both
  // directions. The `text-secondary-500` class tracks favorite state.
  await expect(heart).toHaveClass(/text-secondary-500/);
  await heart.click();
  await expect(heart).not.toHaveClass(/text-secondary-500/);
  await heart.click();
  await expect(heart).toHaveClass(/text-secondary-500/);

  await page.waitForTimeout(1500);

  // SPA nav preserves the in-memory auth state, avoiding a reload bounce.
  await page
    .getByRole("link", { name: "Favorites", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/filter=Favorites/);
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
});

test("delete a note removes it from the notes list", async ({ page }) => {
  const title = `E2E delete ${Date.now()}`;

  await createNote(page, title);

  await page.goto("/notes");
  const noteHeading = page.getByRole("heading", { name: title });
  await expect(noteHeading).toBeVisible();

  // The note teaser owns the delete button. Scope the button to the teaser
  // with this title so we don't accidentally delete a different note.
  const teaser = page.locator("article", { hasText: title });
  await teaser
    .getByRole("button", { name: "delete note", exact: true })
    .click();

  await expect(noteHeading).toHaveCount(0);
});
