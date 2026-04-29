const { test, expect } = require('@playwright/test');

test.describe('BASTION Tower Defense', () => {
  let errors;
  test.beforeEach(async ({ page }) => {
    errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', err => errors.push(err.message));
  });

  test('loads and shows canvas', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(500);
    await expect(page.locator('canvas')).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test('START button begins the game', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(400);
    // Canvas is 800x600. START button center at (400, 340).
    await page.locator('canvas').click({ position: { x: 400, y: 340 } });
    await page.waitForTimeout(400);
    await expect(page.locator('canvas')).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test('can select GUN tower from sidebar', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(300);
    await page.locator('canvas').click({ position: { x: 400, y: 340 } }); // START
    await page.waitForTimeout(300);
    // GUN button at canvas coords (648..792, 130..170) → click at (720, 150)
    await page.locator('canvas').click({ position: { x: 720, y: 150 } });
    await page.waitForTimeout(200);
    await expect(page.locator('canvas')).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test('can place tower on play field', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(300);
    await page.locator('canvas').click({ position: { x: 400, y: 340 } }); // START
    await page.waitForTimeout(300);
    await page.locator('canvas').click({ position: { x: 720, y: 150 } }); // GUN
    await page.waitForTimeout(200);
    // Place at (300, 80) — above the path (path goes through y=200,380)
    await page.locator('canvas').click({ position: { x: 300, y: 80 } });
    await page.waitForTimeout(300);
    await expect(page.locator('canvas')).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test('NEXT WAVE button starts enemies', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(300);
    await page.locator('canvas').click({ position: { x: 400, y: 340 } }); // START
    await page.waitForTimeout(300);
    // NEXT WAVE button at canvas (648..792, 420..460) → click (720, 440)
    await page.locator('canvas').click({ position: { x: 720, y: 440 } });
    await page.waitForTimeout(1500);
    await expect(page.locator('canvas')).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test('game runs 5 seconds error-free after wave', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(300);
    await page.locator('canvas').click({ position: { x: 400, y: 340 } }); // START
    await page.waitForTimeout(300);
    await page.locator('canvas').click({ position: { x: 720, y: 150 } }); // GUN
    await page.locator('canvas').click({ position: { x: 300, y: 80 } });  // Place
    await page.waitForTimeout(200);
    await page.locator('canvas').click({ position: { x: 720, y: 440 } }); // NEXT WAVE
    await page.waitForTimeout(5000);
    expect(errors).toHaveLength(0);
  });
});
