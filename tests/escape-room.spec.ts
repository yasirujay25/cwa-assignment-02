import { test, expect } from "@playwright/test";

const APP = "http://localhost:3000/escape-room";

test.describe("Escape Room App", () => {
  // 1) Timer / UI smoke test
  test("Timer starts and counts down correctly", async ({ page }) => {
    await page.goto(APP);

    // Wait for hydration + controls to be ready
    const startBtn = page.getByRole("button", { name: "Start" });
    await startBtn.waitFor({ state: "visible" });

    // Narrow to the game footer (the one that has the Start button)
    const gameFooter = page.locator("footer").filter({ has: startBtn });

    // Set timer to 1 minute
    await page.locator('input[type="number"]').fill("1");

    // Start countdown
    await startBtn.click();

    // Let it tick for a bit
    await page.waitForTimeout(3000);

    // Extract the mm:ss from the game footer only
    const mmssLocator = gameFooter.getByText(/\d{2}:\d{2}/);
    await expect(mmssLocator).toBeVisible();
    const mmss = await mmssLocator.innerText();

    // It should no longer be the initial "01:00"
    expect(mmss).not.toBe("01:00");
  });

  // 2) Code execution correctness (Stage 1)
  test("Stage 1 code passes add(2,3)=5 test", async ({ page }) => {
    // Clear persisted state BEFORE the page runs (prevents flakiness if Stage 1 was already solved)
    await page.addInitScript(() => localStorage.clear());

    await page.goto(APP);

    // Wait for the editor to be mounted (your component returns null until mounted)
    const editor = page.locator("textarea.code-editor");
    await editor.waitFor({ state: "visible" });

    // Fill correct code for Stage 1
    await editor.fill("function add(a,b){ return a+b; }");

    // Run tests
    await page.getByRole("button", { name: "Run Tests" }).click();

    // The button should change to '✅ Passed'
    await expect(page.getByRole("button", { name: /✅ Passed/ })).toBeVisible();
  });
});
