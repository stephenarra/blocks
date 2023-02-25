import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Voxel Builder/);
});

test("get started link and login", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Get Started" }).click();

  await expect(page).toHaveURL(/.*accounts.google.com/);
});

test("has login button", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/.*accounts.google.com/);
});

test.describe("auth", () => {
  test.use({ storageState: "playwright/.auth/user.json" });

  test("is logged in", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("user-dropdown")).toBeVisible();
  });

  test("can create a model", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Dashboard" }).click();
    await page.getByRole("button", { name: "Create New" }).click();

    await expect(page).toHaveURL(/m\/.*/);
  });
});
