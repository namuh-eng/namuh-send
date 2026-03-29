import { expect, test } from "@playwright/test";

test.describe("Domains Page", () => {
  test("renders domains page with title and filter bar", async ({ page }) => {
    await page.goto("/domains");
    await expect(page.getByRole("heading", { name: "Domains" })).toBeVisible();
    await expect(page.getByPlaceholder("Search...")).toBeVisible();
    await expect(page.getByText("All Statuses")).toBeVisible();
    await expect(page.getByText("All Regions")).toBeVisible();
    await expect(page.getByText("Add domain")).toBeVisible();
  });

  test("click domain name navigates to detail page", async ({ page }) => {
    await page.goto("/domains");
    const domainLink = page.locator("table a").first();
    const count = await domainLink.count();
    if (count > 0) {
      const href = await domainLink.getAttribute("href");
      expect(href).toBeTruthy();
      await domainLink.click();
      await expect(page).toHaveURL(href as string);
    }
  });
});
