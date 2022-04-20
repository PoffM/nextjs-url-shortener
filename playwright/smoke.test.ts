import { expect, test } from "@playwright/test";

test.setTimeout(5_000);

test("Go to /", async ({ page }) => {
  await page.goto("/");

  // Wait for the "Shorten" button:
  await page.waitForSelector(`text=Shorten`);
});

test("Shorten a URL and follow it", async ({ page }) => {
  await page.goto("/");

  await page.waitForSelector(`input[name=originalUrl]`);
  await page.type("input[name=originalUrl]", "localhost:3000/about");
  await page.click("button >> text=Shorten");

  // Shows the original link:
  await page.waitForSelector(`text="http://localhost:3000/about"`);
  // Shows the shortened link:
  const link = await page.waitForSelector(
    `a >> text=/http:\\/\\/localhost:3000/.{7}/`
  );

  // Navigate to the href directly because the link uses target="_blank" which messes up the test navigation.
  const href = (await link.getAttribute("href")) ?? "/";

  await Promise.all([
    // Waits for the main frame navigation and returns the main resource response
    page.waitForNavigation({ url: "http://localhost:3000/about" }),
    // Triggers the request
    page.goto(href),
  ]);
});

test("Test 404", async ({ page }) => {
  const res = await page.goto("/not-found");
  expect(res?.status()).toBe(404);
});
