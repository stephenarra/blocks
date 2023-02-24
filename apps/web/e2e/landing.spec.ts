import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await expect(page).toHaveTitle(/Voxel Builder/);
});

test("get started link", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.getByRole("button", { name: "Get Started" }).click();

  await expect(page).toHaveURL(/.*accounts.google.com/);
});
