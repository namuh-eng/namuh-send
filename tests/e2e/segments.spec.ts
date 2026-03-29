import { expect, test } from "@playwright/test";

test.describe("Segments page", () => {
  test("create new segment", async ({ page }) => {
    await page.goto("/audience/segments");

    // Click 'Create segment' button
    await page.click("text=Create segment");

    // Type segment name
    const nameInput = page.getByPlaceholder("Your segment name");
    await expect(nameInput).toBeVisible();
    await nameInput.fill("VIP Customers");

    // Click Add
    await page.click("button:has-text('Add')");

    // Verify segment appears in list
    await expect(page.getByText("VIP Customers")).toBeVisible({
      timeout: 5000,
    });
  });

  test("click segment navigates to filtered contacts", async ({ page }) => {
    // First create a segment
    await page.goto("/audience/segments");

    await page.click("text=Create segment");
    const nameInput = page.getByPlaceholder("Your segment name");
    await nameInput.fill("General");
    await page.click("button:has-text('Add')");
    await expect(page.getByText("General")).toBeVisible({ timeout: 5000 });

    // Click on the segment name link
    await page.click("a:has-text('General')");

    // Verify URL changes to /audience with segmentId
    await page.waitForURL(/\/audience\?segmentId=/);

    // Verify we're on the Contacts tab
    const contactsTab = page.locator("[data-state='active']", {
      hasText: "Contacts",
    });
    await expect(contactsTab).toBeVisible();
  });
});
