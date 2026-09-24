import { test, expect } from "@playwright/test";
test("country selection, keyboard settings, save/resume, full playthrough and debrief", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/itihas/");
  await expect(
    page.getByRole("heading", { name: "One decision. A different world." }),
  ).toBeVisible();
  await expect(page.locator(".capital-pin")).toHaveCount(7);
  expect(
    (await page.locator(".map-canvas").boundingBox())!.height,
  ).toBeGreaterThan(300);
  await page.getByRole("button", { name: "Settings", exact: false }).click();
  await page.getByLabel("Automatically advance consequences").uncheck();
  await page.getByRole("button", { name: "Back to the map" }).click();
  await page.getByRole("button", { name: "Begin as United States" }).click();
  for (let turn = 1; turn <= 8; turn++) {
    await page.getByRole("button", { name: "Read the briefing" }).click();
    await page.getByRole("button", { name: "Make the call" }).click();
    await page.locator(".choice").first().click();
    await page
      .getByRole("button", { name: "Skip animation, add all to timeline" })
      .click();
    await page.getByRole("button", { name: "A newsflash arrives" }).click();
    await page.locator(".flash-choice").first().click();
    await page.getByRole("button", { name: "Finish the dispatch" }).click();
    await page
      .getByRole("button", {
        name: turn === 8 ? "See the world you made" : "Open the next dispatch",
      })
      .click();
  }
  await expect(page.locator(".ending-page")).toBeVisible();
  await page.getByRole("button", { name: "Open your debrief" }).click();
  await expect(
    page.getByRole("heading", { name: "Where the story changed." }),
  ).toBeVisible();
  await expect(page.locator(".history-table article")).toHaveCount(8);
  await page.locator(".question summary").first().click();
  await expect(page.locator(".question textarea").first()).toBeVisible();
  await page
    .locator(".question textarea")
    .first()
    .fill("A crisis can move through alliances.");
  const dl = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export choices (CSV)" }).click();
  expect((await dl).suggestedFilename()).toContain(".csv");
  await page.reload();
  await page.getByRole("button", { name: "Revisit debrief" }).click();
  await expect(page.locator(".ending-page")).toBeVisible();
  await page.getByRole("button", { name: "Open your debrief" }).click();
  await page.locator(".question summary").first().click();
  await expect(page.locator(".question textarea").first()).toHaveValue(
    "A crisis can move through alliances.",
  );
  expect(errors).toEqual([]);
});
test("mobile layout, map equivalent, teacher council, and invalid import", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/itihas/");
  await page.getByRole("button", { name: "Settings", exact: false }).click();
  await page.getByLabel("Council mode").check();
  await page.getByRole("button", { name: "Back to the map" }).click();
  await page.getByRole("button", { name: "Begin as United States" }).click();
  await page.getByRole("button", { name: "Read the briefing" }).click();
  await page.getByRole("button", { name: "Make the call" }).click();
  await expect(page.getByLabel("Class votes for A")).toBeVisible();
  await page.getByLabel("Class votes for A").fill("3");
  await page.locator(".choice").first().click();
  await page.getByRole("button", { name: "Why did this happen?" }).click();
  await expect(page.locator(".dispatch-panel .insight")).toBeVisible();
  await page.getByRole("button", { name: "Butterfly timeline" }).click();
  await expect(page.locator(".timeline-list button")).toHaveCount(1);
  await page.getByRole("button", { name: "Close dialog" }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  await page.getByRole("button", { name: "Settings", exact: false }).click();
  await page.locator("input[type=file]").setInputFiles({
    name: "broken.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":99}'),
  });
  await expect(page.getByRole("alert")).toContainText(
    "not a valid Butterfly save",
  );
});
test("album empty state and keyboard dialog dismissal", async ({ page }) => {
  await page.goto("/itihas/");
  await page.getByRole("button", { name: /Album/ }).click();
  await expect(
    page.getByRole("heading", {
      name: "Every consequence starts a collection.",
    }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("bundled map falls back when WebGL is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      type: string,
      ...args: any[]
    ) {
      if (type.includes("webgl")) return null;
      return (original as any).call(this, type, ...args);
    } as any;
  });
  await page.goto("/itihas/");
  await expect(page.locator(".leaflet-container")).toBeVisible();
  await expect(page.locator(".capital-pin")).toHaveCount(7);
  await expect(
    page.locator(".leaflet-overlay-pane path:visible").first(),
  ).toBeVisible();
});
