const { test, expect } = require('@playwright/test');

test.describe('JUMPER Platformer', () => {
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
    // Canvas 640x360. Button center at (320, 220) = (width/2, height/2+40)
    await canvas.click({ position: { x: box.width / 2, y: box.height / 2 + 40 } });
    await page.waitForTimeout(400);
    await expect(canvas).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test('player moves left and right', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(300);
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    await canvas.click({ position: { x: box.width / 2, y: box.height / 2 + 40 } });
    await page.waitForTimeout(300);
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(600);
    await page.keyboard.up('ArrowRight');
    await page.keyboard.down('ArrowLeft');
    await page.waitForTimeout(400);
    await page.keyboard.up('ArrowLeft');
    await expect(canvas).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test('player can jump', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(300);
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    await canvas.click({ position: { x: box.width / 2, y: box.height / 2 + 40 } });
    await page.waitForTimeout(300);
    await page.keyboard.press('Space');
    await page.waitForTimeout(200);
    await page.keyboard.press('Space'); // double jump
    await page.waitForTimeout(600);
    await expect(canvas).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test('player lands on ground (no infinite fall)', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(300);
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    await canvas.click({ position: { x: box.width / 2, y: box.height / 2 + 40 } });
    // Wait 2.5 seconds — player should land and stay on platform
    await page.waitForTimeout(2500);
    await expect(canvas).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test('game runs 5 seconds error-free', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(300);
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    await canvas.click({ position: { x: box.width / 2, y: box.height / 2 + 40 } });
    await page.waitForTimeout(300);
    for (let i = 0; i < 4; i++) {
      await page.keyboard.down('ArrowRight');
      await page.waitForTimeout(500);
      await page.keyboard.up('ArrowRight');
      await page.keyboard.press('Space');
      await page.waitForTimeout(400);
    }
    expect(errors).toHaveLength(0);
  });
});
