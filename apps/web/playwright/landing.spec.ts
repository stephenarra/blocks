import { test, expect } from "@playwright/test";

test("get started link and login", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Voxel Builder/);
  await page.getByRole("button", { name: "Get Started" }).click();

  await expect(page).toHaveURL(/.*accounts.google.com/);

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

  test("can crud a model", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Dashboard" }).click();
    await page.getByRole("button", { name: "Create New" }).click();

    await expect(page).toHaveURL(/m\/.*/);

    // update model name
    await page.getByTestId("model-name").click();
    await page.getByPlaceholder("Name").fill("Model Name");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByTestId("model-name")).toHaveText("Model Name");
    await page.getByTestId("back").click();
    await page.getByRole("link", { name: "Model Name" }).click();

    // delete model
    await page.getByTestId("model-name").click();
    await page.getByRole("button", { name: "Delete" }).click();

    await expect(page).toHaveURL("/dashboard");

    await page
      .getByRole("link", { name: "Model Name" })
      .waitFor({ state: "detached" });
    expect(
      await page.getByRole("link", { name: "Model Name" }).count()
    ).toEqual(0);
  });
});
