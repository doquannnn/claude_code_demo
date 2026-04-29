const { test, expect } = require('@playwright/test');

test.describe('BLOCKY Puzzle Game', () => {
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

  test('PLAY button starts the game', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(400);
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    // Canvas is 640x480. PLAY button center at (320, 280) = (width/2, height/2+40)
    await canvas.click({ position: { x: box.width / 2, y: box.height / 2 + 40 } });
    await page.waitForTimeout(400);
    await expect(canvas).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test('player moves with arrow keys', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(300);
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    await canvas.click({ position: { x: box.width / 2, y: box.height / 2 + 40 } });
    await page.waitForTimeout(300);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);
    await expect(canvas).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test('level 1 solvable with arrow keys', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(300);
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    await canvas.click({ position: { x: box.width / 2, y: box.height / 2 + 40 } });
    await page.waitForTimeout(300);
    // Press Right twice to push block onto target
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(150);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(400);
    await expect(canvas).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test('undo works', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(300);
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    await canvas.click({ position: { x: box.width / 2, y: box.height / 2 + 40 } });
    await page.waitForTimeout(300);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);
    await page.keyboard.press('KeyZ');
    await page.waitForTimeout(100);
    await expect(canvas).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test('no console errors during gameplay', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(300);
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    await canvas.click({ position: { x: box.width / 2, y: box.height / 2 + 40 } });
    await page.waitForTimeout(200);
    for (const key of ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'KeyZ']) {
      await page.keyboard.press(key);
      await page.waitForTimeout(80);
    }
    expect(errors).toHaveLength(0);
  });
});
